// src/database/schemas/init.ts
import db from '../index';

export const initAllTables = async (): Promise<void> => {
    try {
        // 1. Справочник ролей пользователей
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS user_roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,                      -- 'mother', 'baby', 'doctor', 'partner'
        description TEXT,                               -- Описание роли
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        deleted_at INTEGER                              -- Мягкое удаление
      );
    `);

        // 2. Пользователи
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,                                      -- Может быть NULL для нерожденных детей
        email TEXT,                                     -- Email пользователя
        phone TEXT,                                     -- Телефон
        role_id INTEGER NOT NULL,                       -- Ссылка на роль
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        deleted_at INTEGER,
        FOREIGN KEY (role_id) REFERENCES user_roles(id)
      );
    `);

        // 3. Справочник статусов беременностей
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS pregnancy_statuses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,                      -- 'active', 'completed', 'miscarriage'
        description TEXT,                               -- Описание статуса
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        deleted_at INTEGER
      );
    `);

        // 4. Беременности
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS pregnancies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mother_id INTEGER NOT NULL,                     -- ID мамы
        start_date INTEGER,                             -- Дата начала беременности (timestamp)
        edd INTEGER,                                    -- Предполагаемая дата родов
        pregnancy_number INTEGER,                       -- Номер беременности: 1, 2, 3...
        status_id INTEGER NOT NULL,                     -- Статус беременности
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        deleted_at INTEGER,
        FOREIGN KEY (mother_id) REFERENCES users(id),
        FOREIGN KEY (status_id) REFERENCES pregnancy_statuses(id)
      );
    `);

        // 5. Дети в беременностях (для близнецов)
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS pregnancy_babies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pregnancy_id INTEGER NOT NULL,                  -- Ссылка на беременность
        baby_id INTEGER NOT NULL,                       -- Ссылка на ребенка
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        deleted_at INTEGER,
        FOREIGN KEY (pregnancy_id) REFERENCES pregnancies(id),
        FOREIGN KEY (baby_id) REFERENCES users(id),
        UNIQUE(pregnancy_id, baby_id)                   -- Один ребенок в одной беременности
      );
    `);

        // 6. Справочник категорий метрик
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS metric_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,                      -- 'vital_signs', 'lab_results', 'ultrasound'
        description TEXT,                               -- Описание категории
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        deleted_at INTEGER
      );
    `);

        // 7. Справочник типов данных метрик
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS metric_data_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,                      -- 'number', 'string', 'boolean', 'date'
        regexp TEXT,                                    -- Регулярное выражение для валидации
        description TEXT,                               -- Описание типа данных
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        deleted_at INTEGER
      );
    `);

        // 8. Справочник типов метрик
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS metric_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,                             -- 'Вес', 'Температура', 'Гемоглобин'
        unit TEXT,                                      -- 'кг', '°C', 'г/л'
        data_type_id INTEGER NOT NULL,                  -- Тип данных метрики
        category_id INTEGER NOT NULL,                   -- Категория метрики
        normal_range_min REAL,                          -- Минимальное нормальное значение
        normal_range_max REAL,                          -- Максимальное нормальное значение
        description TEXT,                               -- Описание метрики
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        deleted_at INTEGER,
        FOREIGN KEY (data_type_id) REFERENCES metric_data_types(id),
        FOREIGN KEY (category_id) REFERENCES metric_categories(id)
      );
    `);

        // 9. Домашние измерения пользователей
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS user_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        metric_type_id INTEGER NOT NULL,                -- Тип измеряемой метрики
        value TEXT NOT NULL,                            -- Значение измерения
        user_id INTEGER NOT NULL,                       -- Кому принадлежит измерение
        measured_time INTEGER NOT NULL,                 -- Время измерения (timestamp)
        notes TEXT,                                     -- Примечания к измерению
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        deleted_at INTEGER,
        FOREIGN KEY (metric_type_id) REFERENCES metric_types(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

        // 10. Больницы и медицинские учреждения
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS hospitals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,                             -- Название больницы
        address TEXT,                                   -- Адрес
        phone TEXT,                                     -- Телефон
        website TEXT,                                   -- Веб-сайт
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        deleted_at INTEGER
      );
    `);

        // 11. Справочник типов приемов/исследований
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS appointment_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,                             -- 'Гинеколог', 'УЗИ', 'Анализ крови'
        entity_type TEXT NOT NULL,                      -- 'appointment' или 'research'
        description TEXT,                               -- Описание типа
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        deleted_at INTEGER
      );
    `);

        // 12. Справочник статусов приемов
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS appointment_statuses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,                      -- 'scheduled', 'completed', 'cancelled'
        description TEXT,                               -- Описание статуса
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        deleted_at INTEGER
      );
    `);

        // 13. Справочник приоритетов приемов
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS appointment_priorities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,                      -- 'low', 'normal', 'high', 'urgent'
        description TEXT,                               -- Описание приоритета
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        deleted_at INTEGER
      );
    `);

        // 14. Приемы у врачей и исследования
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,                       -- Кто посещает прием
        type_id INTEGER NOT NULL,                       -- Тип приема/исследования
        doctor_id INTEGER,                              -- ID врача (из users)
        hospital_id INTEGER,                            -- ID больницы
        planned_time INTEGER,                           -- Запланированное время (timestamp)
        status_id INTEGER NOT NULL,                     -- Статус приема
        priority_id INTEGER NOT NULL,                   -- Приоритет приема
        reminder_sent BOOLEAN DEFAULT 0,                -- Отправлено ли напоминание
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        closed_at INTEGER,                              -- Время завершения приема
        deleted_at INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (type_id) REFERENCES appointment_types(id),
        FOREIGN KEY (doctor_id) REFERENCES users(id),
        FOREIGN KEY (hospital_id) REFERENCES hospitals(id),
        FOREIGN KEY (status_id) REFERENCES appointment_statuses(id),
        FOREIGN KEY (priority_id) REFERENCES appointment_priorities(id)
      );
    `);

        // 15. Метрики, снятые на приемах
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS appointment_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        appointment_id INTEGER NOT NULL,                -- Ссылка на прием
        metric_type_id INTEGER NOT NULL,                -- Тип метрики
        value TEXT NOT NULL,                            -- Значение метрики
        notes TEXT,                                     -- Примечания врача
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        deleted_at INTEGER,
        FOREIGN KEY (appointment_id) REFERENCES appointments(id),
        FOREIGN KEY (metric_type_id) REFERENCES metric_types(id)
      );
    `);

        // 16. Справочник форм выпуска лекарств
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS medication_forms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,                      -- 'таблетки', 'капсулы', 'сироп'
        description TEXT,                               -- Описание формы
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        deleted_at INTEGER
      );
    `);

        // 17. Справочник категорий лекарств
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS medication_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,                      -- 'витамины', 'антибиотики', 'гормоны'
        description TEXT,                               -- Описание категории
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        deleted_at INTEGER
      );
    `);

        // 18. Лекарственные препараты
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS medications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,                             -- Название лекарства
        description TEXT,                               -- Описание
        form_id INTEGER NOT NULL,                       -- Форма выпуска
        active_substance TEXT,                          -- Активное вещество
        manufacturer TEXT,                              -- Производитель
        barcode TEXT,                                   -- Штрих-код
        category_id INTEGER NOT NULL,                   -- Категория лекарства
        prescription_required BOOLEAN DEFAULT 0,        -- Требуется рецепт
        contraindications TEXT,                         -- Противопоказания
        side_effects TEXT,                              -- Побочные эффекты
        storage_conditions TEXT,                        -- Условия хранения
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        deleted_at INTEGER,
        FOREIGN KEY (form_id) REFERENCES medication_forms(id),
        FOREIGN KEY (category_id) REFERENCES medication_categories(id)
      );
    `);

        // 19. Справочник частот приема лекарств
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS medication_frequencies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,                      -- 'daily', '2x_daily', 'weekly'
        description TEXT,                               -- Описание частоты
        times_per_day INTEGER,                          -- Раз в день: 1, 2, 3
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        deleted_at INTEGER
      );
    `);

        // 20. Справочник дней недели
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS days_of_week (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,                      -- 'monday', 'tuesday'
        short_name TEXT NOT NULL,                       -- 'mon', 'tue'
        day_number INTEGER NOT NULL,                    -- Номер дня: 1-7
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        deleted_at INTEGER
      );
    `);

        // 21. Графики приема лекарств
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS medication_schedules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,                       -- Кто принимает лекарство
        medication_id INTEGER NOT NULL,                 -- Какое лекарство
        planned_time TEXT NOT NULL,                     -- Время приема: '08:00'
        dosage TEXT NOT NULL,                           -- Дозировка: '1 таблетка'
        frequency_id INTEGER NOT NULL,                  -- Частота приема
        days_of_week TEXT,                              -- Дни недели в JSON: '[1,3,5]'
        start_date INTEGER,                             -- Дата начала курса
        end_date INTEGER,                               -- Дата окончания курса
        active BOOLEAN DEFAULT 1,                       -- Активен ли график
        notes TEXT,                                     -- Примечания
        reminder_enabled BOOLEAN DEFAULT 1,             -- Включены ли напоминания
        reminder_offset INTEGER DEFAULT 15,             -- За сколько минут напоминать
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        deleted_at INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (medication_id) REFERENCES medications(id),
        FOREIGN KEY (frequency_id) REFERENCES medication_frequencies(id)
      );
    `);

        // 22. Справочник статусов приема лекарств
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS medication_intake_statuses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,                      -- 'pending', 'taken', 'skipped'
        description TEXT,                               -- Описание статуса
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        deleted_at INTEGER
      );
    `);

        // 23. Справочник уровней настроения
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS mood_levels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,                      -- 'very_bad', 'bad', 'neutral'
        description TEXT,                               -- Описание настроения
        value INTEGER NOT NULL UNIQUE,                  -- Числовое значение: 1-5
        emoji TEXT,                                     -- Эмодзи: '😢', '😊'
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        deleted_at INTEGER
      );
    `);

        // 24. Фактические приемы лекарств
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS medication_intakes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        schedule_id INTEGER NOT NULL,                   -- Ссылка на график
        planned_time INTEGER NOT NULL,                  -- Запланированное время (timestamp)
        dosage TEXT NOT NULL,                           -- Дозировка (дублируется из графика)
        actual_time INTEGER,                            -- Фактическое время приема
        status_id INTEGER NOT NULL,                     -- Статус приема
        side_effects_noted BOOLEAN DEFAULT 0,           -- Отмечены ли побочки
        notes TEXT,                                     -- Примечания
        mood_id INTEGER,                                -- Настроение во время приема
        symptoms_before TEXT,                           -- Симптомы до приема (JSON)
        symptoms_after TEXT,                            -- Симптомы после приема (JSON)
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        FOREIGN KEY (schedule_id) REFERENCES medication_schedules(id),
        FOREIGN KEY (status_id) REFERENCES medication_intake_statuses(id),
        FOREIGN KEY (mood_id) REFERENCES mood_levels(id)
      );
    `);

        // 25. Справочник типов симптомов
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS symptom_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,                      -- 'headache', 'nausea', 'fatigue'
        description TEXT,                               -- Описание симптома
        category TEXT,                                  -- 'common', 'serious', 'side_effect'
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        deleted_at INTEGER
      );
    `);

        // 26. Справочник типов файлов
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS file_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,                      -- 'image', 'pdf', 'document'
        mime_type TEXT NOT NULL,                        -- MIME-тип: 'image/jpeg'
        extension TEXT NOT NULL,                        -- Расширение: 'jpg', 'pdf'
        max_size INTEGER,                               -- Максимальный размер в байтах
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        deleted_at INTEGER
      );
    `);

        // 27. Вложения к различным сущностям
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS attachments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entity_type TEXT NOT NULL,                      -- 'appointment', 'note', 'research'
        entity_id INTEGER NOT NULL,                     -- ID сущности
        file_name TEXT NOT NULL,                        -- Имя файла
        file_path TEXT NOT NULL,                        -- Путь к файлу
        file_type_id INTEGER NOT NULL,                  -- Тип файла
        file_size INTEGER,                              -- Размер файла
        description TEXT,                               -- Описание файла
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        deleted_at INTEGER,
        FOREIGN KEY (file_type_id) REFERENCES file_types(id)
      );
    `);

        // 28. Справочник типов уведомлений
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS notification_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,                      -- 'medication_reminder', 'appointment_reminder'
        description TEXT,                               -- Описание типа уведомления
        default_title TEXT,                             -- Заголовок по умолчанию
        default_message TEXT,                           -- Сообщение по умолчанию
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        deleted_at INTEGER
      );
    `);

        // 29. Уведомления
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,                       -- Кому уведомление
        type_id INTEGER NOT NULL,                       -- Тип уведомления
        title TEXT NOT NULL,                            -- Заголовок
        message TEXT NOT NULL,                          -- Сообщение
        scheduled_time INTEGER NOT NULL,                -- Когда отправить
        sent BOOLEAN DEFAULT 0,                         -- Отправлено ли
        sent_time INTEGER,                              -- Когда отправлено
        read BOOLEAN DEFAULT 0,                         -- Прочитано ли
        read_time INTEGER,                              -- Когда прочитано
        data TEXT,                                      -- Дополнительные данные (JSON)
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        deleted_at INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (type_id) REFERENCES notification_types(id)
      );
    `);

        console.log('✅ All database tables created successfully');

        // Добавляем начальные данные
        await insertInitialData();

    } catch (error) {
        console.log('❌ Error creating database tables:', error);
        throw error;
    }
};

// Функция для добавления начальных данных
const insertInitialData = async (): Promise<void> => {
    try {
        // Роли пользователей
        await db.execAsync(`
      INSERT OR IGNORE INTO user_roles (name, description) VALUES 
      ('mother', 'Беременная женщина'),
      ('baby', 'Ребенок (рожденный или будущий)'),
      ('doctor', 'Медицинский работник'),
      ('partner', 'Партнер (муж/жена)'),
      ('family_member', 'Член семьи');
    `);

        // Статусы беременностей
        await db.execAsync(`
      INSERT OR IGNORE INTO pregnancy_statuses (name, description) VALUES 
      ('active', 'Активная беременность'),
      ('completed', 'Завершенная (роды)'),
      ('miscarriage', 'Выкидыш'),
      ('abortion', 'Аборт');
    `);

        // Категории метрик
        await db.execAsync(`
      INSERT OR IGNORE INTO metric_categories (name, description) VALUES 
      ('vital_signs', 'Жизненные показатели'),
      ('lab_results', 'Лабораторные анализы'),
      ('ultrasound', 'УЗИ исследования'),
      ('personal', 'Персональные данные');
    `);

        // Типы данных метрик
        await db.execAsync(`
      INSERT OR IGNORE INTO metric_data_types (name, regexp, description) VALUES 
      ('number', '^-?\d*\.?\d+$', 'Числовые значения'),
      ('string', '^.+$', 'Текстовые значения'),
      ('boolean', '^(true|false|0|1)$', 'Логические значения'),
      ('date', '^\d+$', 'Дата в timestamp');
    `);

        // Типы метрик
        await db.execAsync(`
      INSERT OR IGNORE INTO metric_types (name, unit, data_type_id, category_id, normal_range_min, normal_range_max, description) VALUES 
      ('Вес', 'кг', 
        (SELECT id FROM metric_data_types WHERE name = 'number'),
        (SELECT id FROM metric_categories WHERE name = 'vital_signs'), 40, 120, 'Масса тела'),
      ('Рост', 'см', 
        (SELECT id FROM metric_data_types WHERE name = 'number'),
        (SELECT id FROM metric_categories WHERE name = 'vital_signs'), 150, 200, 'Рост человека'),
      ('Температура', '°C', 
        (SELECT id FROM metric_data_types WHERE name = 'number'),
        (SELECT id FROM metric_categories WHERE name = 'vital_signs'), 36.0, 37.5, 'Температура тела'),
      ('Группа крови', NULL, 
        (SELECT id FROM metric_data_types WHERE name = 'string'),
        (SELECT id FROM metric_categories WHERE name = 'personal'), NULL, NULL, 'Группа крови и резус-фактор');
    `);

        // Типы приемов
        await db.execAsync(`
      INSERT OR IGNORE INTO appointment_types (name, entity_type, description) VALUES 
      ('Гинеколог', 'appointment', 'Осмотр гинеколога'),
      ('Терапевт', 'appointment', 'Осмотр терапевта'),
      ('УЗИ', 'research', 'Ультразвуковое исследование'),
      ('Анализ крови', 'research', 'Лабораторный анализ крови');
    `);

        // Статусы приемов
        await db.execAsync(`
      INSERT OR IGNORE INTO appointment_statuses (name, description) VALUES 
      ('scheduled', 'Запланирован'),
      ('confirmed', 'Подтвержден'),
      ('completed', 'Завершен'),
      ('cancelled', 'Отменен'),
      ('no_show', 'Не явился');
    `);

        // Приоритеты приемов
        await db.execAsync(`
      INSERT OR IGNORE INTO appointment_priorities (name, description) VALUES 
      ('low', 'Низкий приоритет'),
      ('normal', 'Обычный приоритет'),
      ('high', 'Высокий приоритет'),
      ('urgent', 'Срочный');
    `);

        // Формы выпуска лекарств
        await db.execAsync(`
      INSERT OR IGNORE INTO medication_forms (name, description) VALUES 
      ('таблетки', 'Таблетированная форма'),
      ('капсулы', 'Капсулы'),
      ('сироп', 'Жидкая форма'),
      ('инъекции', 'Инъекционная форма');
    `);

        // Категории лекарств
        await db.execAsync(`
      INSERT OR IGNORE INTO medication_categories (name, description) VALUES 
      ('витамины', 'Витамины и минералы'),
      ('антибиотики', 'Антибактериальные препараты'),
      ('гормоны', 'Гормональные препараты'),
      ('обезболивающие', 'Обезболивающие средства');
    `);

        // Частоты приема лекарств
        await db.execAsync(`
      INSERT OR IGNORE INTO medication_frequencies (name, description, times_per_day) VALUES 
      ('daily', 'Ежедневно', 1),
      ('2x_daily', 'Два раза в день', 2),
      ('3x_daily', 'Три раза в день', 3),
      ('weekly', 'Еженедельно', 0),
      ('monthly', 'Ежемесячно', 0);
    `);

        // Дни недели
        await db.execAsync(`
      INSERT OR IGNORE INTO days_of_week (name, short_name, day_number) VALUES 
      ('monday', 'mon', 1),
      ('tuesday', 'tue', 2),
      ('wednesday', 'wed', 3),
      ('thursday', 'thu', 4),
      ('friday', 'fri', 5),
      ('saturday', 'sat', 6),
      ('sunday', 'sun', 7);
    `);

        // Статусы приема лекарств
        await db.execAsync(`
      INSERT OR IGNORE INTO medication_intake_statuses (name, description) VALUES 
      ('pending', 'Ожидает приема'),
      ('taken', 'Принято'),
      ('skipped', 'Пропущено'),
      ('partial', 'Принято частично');
    `);

        // Уровни настроения
        await db.execAsync(`
      INSERT OR IGNORE INTO mood_levels (name, description, value, emoji) VALUES 
      ('very_bad', 'Очень плохое', 1, '😢'),
      ('bad', 'Плохое', 2, '😔'),
      ('neutral', 'Нормальное', 3, '😐'),
      ('good', 'Хорошее', 4, '😊'),
      ('very_good', 'Отличное', 5, '😄');
    `);

        // Типы симптомов
        await db.execAsync(`
      INSERT OR IGNORE INTO symptom_types (name, description, category) VALUES 
      ('headache', 'Головная боль', 'common'),
      ('nausea', 'Тошнота', 'common'),
      ('fatigue', 'Усталость', 'common'),
      ('dizziness', 'Головокружение', 'serious'),
      ('fever', 'Повышенная температура', 'serious');
    `);

        // Типы файлов
        await db.execAsync(`
      INSERT OR IGNORE INTO file_types (name, mime_type, extension, max_size) VALUES 
      ('image', 'image/jpeg', 'jpg', 10485760),
      ('image', 'image/png', 'png', 10485760),
      ('pdf', 'application/pdf', 'pdf', 52428800),
      ('document', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'docx', 52428800);
    `);

        // Типы уведомлений
        await db.execAsync(`
      INSERT OR IGNORE INTO notification_types (name, description, default_title, default_message) VALUES 
      ('medication_reminder', 'Напоминание о приеме лекарств', 'Время принять лекарство', 'Не забудьте принять {medication_name}'),
      ('appointment_reminder', 'Напоминание о приеме', 'Напоминание о приеме', 'Завтра в {time} у вас прием у {doctor_name}'),
      ('health_check', 'Напоминание о замерах', 'Время для замера', 'Не забудьте измерить {metric_name}');
    `);

        console.log('✅ All initial data inserted successfully');
    } catch (error) {
        console.log('❌ Error inserting initial data:', error);
    }
};