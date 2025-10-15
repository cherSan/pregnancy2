-- database-schema-final.sql
-- Финальная схема с исправлениями и комментариями

-- =====================================================================
-- СПРАВОЧНИКИ
-- =====================================================================

-- Статусы беременности
CREATE TABLE pregnancy_statuses (
                                    id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор статуса
                                    name TEXT NOT NULL UNIQUE,                              -- Название статуса (например, 'active', 'completed')
                                    description TEXT,                                       -- Описание статуса
                                    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),  -- Время создания записи в миллисекундах
                                    updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),  -- Время последнего обновления в миллисекундах
                                    deleted_at INTEGER,                                     -- Время мягкого удаления (NULL если запись активна)
                                    CHECK (name != '')                                      -- Проверка что название не пустое
);

-- Категории метрик (для группировки)
CREATE TABLE metric_categories (
                                   id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор категории
                                   name TEXT NOT NULL UNIQUE,                              -- Название категории (например, 'vital_signs', 'laboratory')
                                   description TEXT,                                       -- Описание категории
                                   created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                   updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                   deleted_at INTEGER,
                                   CHECK (name != '')
);

-- Типы данных для метрик (определяют валидацию значений)
CREATE TABLE metric_data_types (
                                   id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор типа данных
                                   name TEXT NOT NULL UNIQUE,                              -- Название типа (например, 'number', 'text', 'boolean')
                                   "regexp" TEXT,                                          -- Регулярное выражение для валидации (если применимо)
                                   description TEXT,                                       -- Описание типа данных
                                   created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                   updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                   deleted_at INTEGER,
                                   CHECK (name != '')
);

-- Типы сущностей для приемов (определяют категории приемов)
CREATE TABLE entity_types (
                              id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор типа сущности
                              name TEXT NOT NULL UNIQUE,                              -- Название типа ('appointment', 'research')
                              description TEXT,                                       -- Описание типа сущности
                              created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                              updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                              deleted_at INTEGER,
                              CHECK (name IN ('appointment', 'research'))             -- Ограничение допустимых значений
);

-- Типы приемов (консультация, УЗИ, анализы и т.д.)
CREATE TABLE appointment_types (
                                   id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор типа приема
                                   name TEXT NOT NULL,                                     -- Название типа приема
                                   entity_type_id INTEGER NOT NULL,                        -- Ссылка на тип сущности
                                   description TEXT,                                       -- Описание типа приема
                                   created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                   updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                   deleted_at INTEGER,
                                   FOREIGN KEY (entity_type_id) REFERENCES entity_types(id) ON DELETE RESTRICT,
                                   CHECK (name != '')
);

-- Статусы приемов (запланирован, завершен, отменен)
CREATE TABLE appointment_statuses (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор статуса
                                      name TEXT NOT NULL UNIQUE,                              -- Название статуса
                                      description TEXT,                                       -- Описание статуса
                                      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                      updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                      deleted_at INTEGER,
                                      CHECK (name != '')
);

-- Приоритеты приемов (низкий, средний, высокий, срочный)
CREATE TABLE appointment_priorities (
                                        id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор приоритета
                                        name TEXT NOT NULL UNIQUE,                              -- Название приоритета
                                        description TEXT,                                       -- Описание приоритета
                                        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                        deleted_at INTEGER,
                                        CHECK (name != '')
);

-- Вопросы для разных типов приемов (анкетирование)
CREATE TABLE appointment_questions (
                                       id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор вопроса
                                       appointment_type_id INTEGER NOT NULL,                   -- Ссылка на тип приема
                                       question_text TEXT NOT NULL,                            -- Текст вопроса
                                       question_type TEXT NOT NULL,                            -- Тип вопроса: 'text', 'number', 'boolean', 'multiple_choice'
                                       required BOOLEAN NOT NULL DEFAULT 0,                    -- Обязательный ли вопрос
                                       order_index INTEGER,                                    -- Порядок отображения вопросов
                                       created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                       updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                       deleted_at INTEGER,
                                       FOREIGN KEY (appointment_type_id) REFERENCES appointment_types(id) ON DELETE CASCADE,
                                       CHECK (question_text != ''),
                                       CHECK (question_type IN ('text', 'number', 'boolean', 'multiple_choice'))
);

-- Формы выпуска лекарств (таблетки, капсулы, сироп и т.д.)
CREATE TABLE medication_forms (
                                  id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор формы
                                  name TEXT NOT NULL UNIQUE,                              -- Название формы выпуска
                                  description TEXT,                                       -- Описание формы
                                  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                  deleted_at INTEGER,
                                  CHECK (name != '')
);

-- Категории лекарств (антибиотики, витамины, обезболивающие и т.д.)
CREATE TABLE medication_categories (
                                       id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор категории
                                       name TEXT NOT NULL UNIQUE,                              -- Название категории
                                       description TEXT,                                       -- Описание категории
                                       created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                       updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                       deleted_at INTEGER,
                                       CHECK (name != '')
);

-- Частоты приема лекарств (1 раз в день, 2 раза в день и т.д.)
CREATE TABLE medication_frequencies (
                                        id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор частоты
                                        name TEXT NOT NULL UNIQUE,                              -- Название частоты
                                        description TEXT,                                       -- Описание частоты
                                        times_per_day INTEGER,                                  -- Количество приемов в день
                                        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                        deleted_at INTEGER,
                                        CHECK (name != ''),
                                        CHECK (times_per_day IS NULL OR times_per_day > 0)      -- Проверка корректности количества приемов
);

-- Дни недели (для расписаний)
CREATE TABLE days_of_week (
                              id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор дня
                              name TEXT NOT NULL UNIQUE,                              -- Полное название дня (понедельник)
                              short_name TEXT NOT NULL,                               -- Сокращенное название (пн)
                              day_number INTEGER NOT NULL,                            -- Номер дня (1-понедельник, 7-воскресенье)
                              created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                              updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                              deleted_at INTEGER,
                              CHECK (name != ''),
                              CHECK (short_name != ''),
                              CHECK (day_number BETWEEN 1 AND 7)                      -- Ограничение номера дня
);

-- Статусы приема лекарств (принято, пропущено, отложено)
CREATE TABLE medication_intake_statuses (
                                            id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор статуса
                                            name TEXT NOT NULL UNIQUE,                              -- Название статуса
                                            description TEXT,                                       -- Описание статуса
                                            created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                            updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                            deleted_at INTEGER,
                                            CHECK (name != '')
);

-- Уровни настроения (для отслеживания самочувствия)
CREATE TABLE mood_levels (
                             id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор уровня
                             name TEXT NOT NULL UNIQUE,                              -- Название уровня настроения
                             description TEXT,                                       -- Описание уровня
                             value INTEGER NOT NULL UNIQUE,                          -- Числовое значение (1-10)
                             emoji TEXT,                                             -- Emoji для визуального отображения
                             created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                             updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                             deleted_at INTEGER,
                             CHECK (name != ''),
                             CHECK (value BETWEEN 1 AND 10)                          -- Ограничение значения настроения
);

-- Типы симптомов (тошнота, головная боль, усталость и т.д.)
CREATE TABLE symptom_types (
                               id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор типа симптома
                               name TEXT NOT NULL UNIQUE,                              -- Название симптома
                               description TEXT,                                       -- Описание симптома
                               category TEXT,                                          -- Категория симптома
                               created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                               updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                               deleted_at INTEGER,
                               CHECK (name != '')
);

-- Типы файлов (для валидации загружаемых файлов)
CREATE TABLE file_types (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор типа файла
                            name TEXT NOT NULL UNIQUE,                              -- Название типа файла
                            mime_type TEXT NOT NULL,                                -- MIME-тип
                            extension TEXT NOT NULL,                                -- Расширение файла
                            max_size INTEGER,                                       -- Максимальный размер в байтах
                            created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                            updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                            deleted_at INTEGER,
                            CHECK (name != ''),
                            CHECK (mime_type != ''),
                            CHECK (extension != ''),
                            CHECK (max_size IS NULL OR max_size > 0)                -- Проверка корректности размера
);

-- Специализации врачей (гинеколог, терапевт, педиатр и т.д.)
CREATE TABLE doctor_specializations (
                                        id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор специализации
                                        name TEXT NOT NULL UNIQUE,                              -- Название специализации
                                        description TEXT,                                       -- Описание специализации
                                        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                        deleted_at INTEGER,
                                        CHECK (name != '')
);

-- Типы уведомлений (напоминание о приеме, оповещение о результате и т.д.)
CREATE TABLE notification_types (
                                    id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор типа уведомления
                                    name TEXT NOT NULL UNIQUE,                              -- Название типа уведомления
                                    description TEXT,                                       -- Описание типа
                                    default_title TEXT,                                     -- Заголовок по умолчанию
                                    default_message TEXT,                                   -- Сообщение по умолчанию
                                    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                    updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                    deleted_at INTEGER,
                                    CHECK (name != '')
);

-- =====================================================================
-- ОСНОВНЫЕ ТАБЛИЦЫ
-- =====================================================================

-- Пользователи системы (матери)
CREATE TABLE users (
                       id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор пользователя
                       name TEXT NOT NULL,                                     -- Полное имя пользователя
                       email TEXT,                                             -- Email адрес
                       phone TEXT,                                             -- Номер телефона
                       dob INTEGER,                                            -- Дата рождения в миллисекундах
                       address TEXT,                                           -- Адрес проживания
                       blood_type TEXT,                                        -- Группа крови: 'A+', 'B-', 'AB+', 'O-'
                       emergency_contact_name TEXT,                            -- Имя контактного лица для экстренных случаев
                       emergency_contact_phone TEXT,                           -- Телефон контактного лица
                       insurance_number TEXT,                                  -- Номер страхового полиса
                       created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                       updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                       deleted_at INTEGER,
                       CHECK (name != ''),
                       CHECK (email IS NULL OR email LIKE '%@%'),              -- Базовая валидация email
                       CHECK (phone IS NULL OR phone GLOB '+*[0-9]*'),         -- Валидация формата телефона
                       CHECK (blood_type IS NULL OR blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'))
);

-- Дети
CREATE TABLE babies (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор ребенка
                        name TEXT,                                              -- Имя ребенка
                        birth_date INTEGER,                                     -- Дата рождения в миллисекундах
                        birth_weight REAL,                                      -- Вес при рождении в граммах
                        birth_height REAL,                                      -- Рост при рождении в сантиметрах
                        birth_place TEXT,                                       -- Место рождения (роддом, больница)
                        birth_city TEXT,                                        -- Город рождения
                        gender TEXT,                                            -- Пол: 'male', 'female'
                        blood_type TEXT,                                        -- Группа крови
                        apgar_score INTEGER,                                    -- Оценка по шкале Апгар (0-10)
                        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                        deleted_at INTEGER,
                        CHECK (name IS NULL OR name != ''),
                        CHECK (birth_weight IS NULL OR birth_weight > 0),       -- Проверка положительного веса
                        CHECK (birth_height IS NULL OR birth_height > 0),       -- Проверка положительного роста
                        CHECK (gender IS NULL OR gender IN ('male', 'female')),
                        CHECK (blood_type IS NULL OR blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
                        CHECK (apgar_score IS NULL OR (apgar_score BETWEEN 0 AND 10))  -- Проверка оценки Апгар
);

-- Врачи
CREATE TABLE doctors (
                         id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор врача
                         name TEXT NOT NULL,                                     -- Полное имя врача
                         specialization_id INTEGER NOT NULL,                     -- Специализация врача
                         phone TEXT,                                             -- Контактный телефон
                         email TEXT,                                             -- Email адрес
                         license_number TEXT,                                    -- Номер лицензии
                         years_of_experience INTEGER,                            -- Стаж работы в годах
                         bio TEXT,                                               -- Биография/информация о враче
                         created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                         updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                         deleted_at INTEGER,
                         FOREIGN KEY (specialization_id) REFERENCES doctor_specializations(id) ON DELETE RESTRICT,
                         CHECK (name != ''),
                         CHECK (email IS NULL OR email LIKE '%@%'),
                         CHECK (phone IS NULL OR phone GLOB '+*[0-9]*'),
                         CHECK (years_of_experience IS NULL OR years_of_experience >= 0)  -- Стаж не может быть отрицательным
);

-- Расписание врачей
CREATE TABLE doctor_schedules (
                                  id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор записи расписания
                                  doctor_id INTEGER NOT NULL,                             -- Ссылка на врача
                                  day_of_week_id INTEGER NOT NULL,                        -- День недели
                                  start_time TEXT NOT NULL,                               -- Время начала приема '09:00'
                                  end_time TEXT NOT NULL,                                 -- Время окончания приема '18:00'
                                  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                  deleted_at INTEGER,
                                  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
                                  FOREIGN KEY (day_of_week_id) REFERENCES days_of_week(id) ON DELETE CASCADE,
                                  CHECK (start_time GLOB '[0-9][0-9]:[0-9][0-9]'),        -- Проверка формата времени
                                  CHECK (end_time GLOB '[0-9][0-9]:[0-9][0-9]'),
                                  CHECK (start_time < end_time)                           -- Время начала должно быть раньше окончания
);

-- Беременности
CREATE TABLE pregnancies (
                             id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор беременности
                             mother_id INTEGER NOT NULL,                             -- Ссылка на мать
                             start_date INTEGER,                                     -- Дата начала беременности в миллисекундах
                             edd INTEGER,                                            -- Предполагаемая дата родов (EDD) в миллисекундах
                             pregnancy_number INTEGER,                               -- Порядковый номер беременности
                             status_id INTEGER NOT NULL,                             -- Текущий статус беременности
                             created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                             updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                             deleted_at INTEGER,
                             FOREIGN KEY (mother_id) REFERENCES users(id) ON DELETE CASCADE,
                             FOREIGN KEY (status_id) REFERENCES pregnancy_statuses(id) ON DELETE RESTRICT,
                             CHECK (pregnancy_number IS NULL OR pregnancy_number > 0)  -- Номер беременности должен быть положительным
);

-- Связь беременностей и детей (многие ко многим)
CREATE TABLE pregnancy_babies (
                                  id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор связи
                                  pregnancy_id INTEGER NOT NULL,                          -- Ссылка на беременность
                                  baby_id INTEGER NOT NULL,                               -- Ссылка на ребенка
                                  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                  deleted_at INTEGER,
                                  FOREIGN KEY (pregnancy_id) REFERENCES pregnancies(id) ON DELETE CASCADE,
                                  FOREIGN KEY (baby_id) REFERENCES babies(id) ON DELETE CASCADE,
                                  UNIQUE(pregnancy_id, baby_id)                           -- Уникальная связь беременности и ребенка
);

-- Типы метрик (артериальное давление, вес, температура и т.д.)
CREATE TABLE metric_types (
                              id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор типа метрики
                              name TEXT NOT NULL,                                     -- Название метрики
                              unit TEXT,                                              -- Единица измерения (мм рт. ст., кг, °C)
                              data_type_id INTEGER NOT NULL,                          -- Тип данных метрики
                              category_id INTEGER NOT NULL,                           -- Категория метрики
                              normal_range_min REAL,                                  -- Минимальное значение нормы
                              normal_range_max REAL,                                  -- Максимальное значение нормы
                              description TEXT,                                       -- Описание метрики
                              created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                              updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                              deleted_at INTEGER,
                              FOREIGN KEY (data_type_id) REFERENCES metric_data_types(id) ON DELETE RESTRICT,
                              FOREIGN KEY (category_id) REFERENCES metric_categories(id) ON DELETE RESTRICT,
                              CHECK (name != ''),
                              CHECK (normal_range_min IS NULL OR normal_range_max IS NULL OR normal_range_min <= normal_range_max)
);

-- Метрики пользователей (матерей)
CREATE TABLE user_metrics (
                              id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор записи метрики
                              metric_type_id INTEGER NOT NULL,                        -- Тип метрики
                              value TEXT NOT NULL,                                    -- Значение метрики
                              user_id INTEGER NOT NULL,                               -- Пользователь, к которому относится метрика
                              measured_time INTEGER NOT NULL,                         -- Время измерения в миллисекундах
                              notes TEXT,                                             -- Дополнительные заметки
                              created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                              updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                              deleted_at INTEGER,
                              FOREIGN KEY (metric_type_id) REFERENCES metric_types(id) ON DELETE RESTRICT,
                              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                              CHECK (value != ''),
                              CHECK (measured_time > 0)                               -- Время измерения должно быть валидным
);

-- Метрики детей
CREATE TABLE baby_metrics (
                              id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор записи метрики
                              metric_type_id INTEGER NOT NULL,                        -- Тип метрики
                              value TEXT NOT NULL,                                    -- Значение метрики
                              baby_id INTEGER NOT NULL,                               -- Ребенок, к которому относится метрика
                              measured_time INTEGER NOT NULL,                         -- Время измерения в миллисекундах
                              notes TEXT,                                             -- Дополнительные заметки
                              created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                              updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                              deleted_at INTEGER,
                              FOREIGN KEY (metric_type_id) REFERENCES metric_types(id) ON DELETE RESTRICT,
                              FOREIGN KEY (baby_id) REFERENCES babies(id) ON DELETE CASCADE,
                              CHECK (value != ''),
                              CHECK (measured_time > 0)
);

-- Больницы/медицинские учреждения
CREATE TABLE hospitals (
                           id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор больницы
                           name TEXT NOT NULL,                                     -- Название медицинского учреждения
                           address TEXT,                                           -- Адрес больницы
                           phone TEXT,                                             -- Контактный телефон
                           website TEXT,                                           -- Веб-сайт
                           created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                           updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                           deleted_at INTEGER,
                           CHECK (name != ''),
                           CHECK (phone IS NULL OR phone GLOB '+*[0-9]*')
);

-- Приемы/визиты к врачу
CREATE TABLE appointments (
                              id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор приема
                              user_id INTEGER NOT NULL,                               -- Пользователь, для которого назначен прием
                              type_id INTEGER NOT NULL,                               -- Тип приема
                              doctor_id INTEGER,                                      -- Врач (может быть NULL)
                              hospital_id INTEGER,                                    -- Больница (может быть NULL)
                              planned_time INTEGER NOT NULL,                          -- Запланированное время приема в миллисекундах
                              status_id INTEGER NOT NULL,                             -- Статус приема
                              priority_id INTEGER NOT NULL,                           -- Приоритет приема
                              reminder_sent BOOLEAN NOT NULL DEFAULT 0,               -- Отправлено ли напоминание
                              created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                              updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                              closed_at INTEGER,                                      -- Время закрытия приема в миллисекундах
                              deleted_at INTEGER,
                              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                              FOREIGN KEY (type_id) REFERENCES appointment_types(id) ON DELETE RESTRICT,
                              FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL,
                              FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE SET NULL,
                              FOREIGN KEY (status_id) REFERENCES appointment_statuses(id) ON DELETE RESTRICT,
                              FOREIGN KEY (priority_id) REFERENCES appointment_priorities(id) ON DELETE RESTRICT,
                              CHECK (planned_time > 0),
                              CHECK (closed_at IS NULL OR closed_at >= planned_time)  -- Время закрытия не может быть раньше запланированного
);

-- Ответы на вопросы приемов
CREATE TABLE appointment_question_answers (
                                              id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор ответа
                                              appointment_id INTEGER NOT NULL,                        -- Ссылка на прием
                                              question_id INTEGER NOT NULL,                           -- Ссылка на вопрос
                                              answer_text TEXT,                                       -- Текстовый ответ
                                              answer_number REAL,                                     -- Числовой ответ
                                              answer_boolean BOOLEAN,                                 -- Булев ответ
                                              created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                              updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                              FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
                                              FOREIGN KEY (question_id) REFERENCES appointment_questions(id) ON DELETE CASCADE
);

-- Метрики, измеренные во время приемов
CREATE TABLE appointment_metrics (
                                     id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор метрики приема
                                     appointment_id INTEGER NOT NULL,                        -- Ссылка на прием
                                     metric_type_id INTEGER NOT NULL,                        -- Тип метрики
                                     value TEXT NOT NULL,                                    -- Значение метрики
                                     subject_type TEXT NOT NULL,                             -- Тип субъекта: 'mother' или 'baby'
                                     subject_id INTEGER NOT NULL,                            -- ID субъекта (user_id или baby_id)
                                     notes TEXT,                                             -- Дополнительные заметки
                                     created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                     updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                     deleted_at INTEGER,
                                     FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
                                     FOREIGN KEY (metric_type_id) REFERENCES metric_types(id) ON DELETE RESTRICT,
                                     CHECK (value != ''),
                                     CHECK (subject_type IN ('mother', 'baby'))              -- Ограничение допустимых типов субъектов
);

-- Лекарственные препараты
CREATE TABLE medications (
                             id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор лекарства
                             name TEXT NOT NULL,                                     -- Название лекарства
                             description TEXT,                                       -- Описание лекарства
                             form_id INTEGER NOT NULL,                               -- Форма выпуска
                             active_substance TEXT,                                  -- Активное вещество
                             manufacturer TEXT,                                      -- Производитель
                             barcode TEXT,                                           -- Штрих-код
                             category_id INTEGER NOT NULL,                           -- Категория лекарства
                             prescription_required BOOLEAN NOT NULL DEFAULT 0,       -- Требуется ли рецепт
                             contraindications TEXT,                                 -- Противопоказания
                             side_effects TEXT,                                      -- Побочные эффекты
                             storage_conditions TEXT,                                -- Условия хранения
                             created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                             updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                             deleted_at INTEGER,
                             FOREIGN KEY (form_id) REFERENCES medication_forms(id) ON DELETE RESTRICT,
                             FOREIGN KEY (category_id) REFERENCES medication_categories(id) ON DELETE RESTRICT,
                             CHECK (name != '')
);

-- Расписания приема лекарств
CREATE TABLE medication_schedules (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор расписания
                                      user_id INTEGER NOT NULL,                               -- Пользователь, для которого назначен прием
                                      medication_id INTEGER NOT NULL,                         -- Лекарство
                                      planned_time TEXT NOT NULL,                             -- Время приема '09:00'
                                      dosage TEXT NOT NULL,                                   -- Дозировка '500mg'
                                      frequency_id INTEGER NOT NULL,                          -- Частота приема
                                      days_of_week TEXT,                                      -- JSON массив дней недели [1,3,5] или NULL для ежедневно
                                      start_date INTEGER,                                     -- Дата начала приема в миллисекундах
                                      end_date INTEGER,                                       -- Дата окончания приема в миллисекундах
                                      active BOOLEAN NOT NULL DEFAULT 1,                      -- Активно ли расписание
                                      notes TEXT,                                             -- Дополнительные заметки
                                      reminder_enabled BOOLEAN NOT NULL DEFAULT 1,            -- Включены ли напоминания
                                      reminder_offset INTEGER NOT NULL DEFAULT 15,            -- За сколько минут напоминать
                                      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                      updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                      deleted_at INTEGER,
                                      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                                      FOREIGN KEY (medication_id) REFERENCES medications(id) ON DELETE CASCADE,
                                      FOREIGN KEY (frequency_id) REFERENCES medication_frequencies(id) ON DELETE RESTRICT,
                                      CHECK (planned_time GLOB '[0-9][0-9]:[0-9][0-9]'),
                                      CHECK (dosage != ''),
                                      CHECK (reminder_offset >= 0),                           -- Смещение не может быть отрицательным
                                      CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)  -- Дата окончания не раньше начала
);

-- Фактические приемы лекарств
CREATE TABLE medication_intakes (
                                    id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор приема
                                    user_id INTEGER NOT NULL,                               -- Кто принял лекарство
                                    medication_id INTEGER NOT NULL,                         -- Какое лекарство принято
                                    dosage TEXT NOT NULL,                                   -- Дозировка '500mg'
                                    planned_time INTEGER,                                   -- Плановое время приема в миллисекундах (может быть NULL)
                                    actual_time INTEGER,                                    -- Фактическое время приема в миллисекундах
                                    status_id INTEGER NOT NULL,                             -- Статус приема
                                    side_effects_noted BOOLEAN NOT NULL DEFAULT 0,          -- Отмечены ли побочные эффекты
                                    notes TEXT,                                             -- Заметки о приеме
                                    mood_id INTEGER,                                        -- Настроение во время приема
                                    symptoms_before TEXT,                                   -- JSON массив симптомов до приема
                                    symptoms_after TEXT,                                    -- JSON массив симптомов после приема
                                    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                    updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                                    FOREIGN KEY (medication_id) REFERENCES medications(id) ON DELETE RESTRICT,
                                    FOREIGN KEY (status_id) REFERENCES medication_intake_statuses(id) ON DELETE RESTRICT,
                                    FOREIGN KEY (mood_id) REFERENCES mood_levels(id) ON DELETE SET NULL,
                                    CHECK (dosage != ''),
                                    CHECK (actual_time IS NULL OR actual_time > 0)          -- Фактическое время должно быть валидным
);

-- Файлы/вложения
CREATE TABLE attachments (
                             id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор файла
                             file_name TEXT NOT NULL,                                -- Оригинальное имя файла
                             file_path TEXT NOT NULL,                                -- Путь к файлу в системе хранения
                             file_type_id INTEGER NOT NULL,                          -- Тип файла
                             file_size INTEGER,                                      -- Размер файла в байтах
                             description TEXT,                                       -- Описание файла
                             category TEXT,                                          -- Категория: 'photo', 'document', 'ultrasound', 'prescription'
                             created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                             updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                             deleted_at INTEGER,
                             FOREIGN KEY (file_type_id) REFERENCES file_types(id) ON DELETE RESTRICT,
                             CHECK (file_name != ''),
                             CHECK (file_path != ''),
                             CHECK (file_size IS NULL OR file_size > 0)              -- Размер должен быть положительным
);

-- Связь файлов с пользователями
CREATE TABLE user_attachments (
                                  id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор связи
                                  user_id INTEGER NOT NULL,                               -- Ссылка на пользователя
                                  attachment_id INTEGER NOT NULL,                         -- Ссылка на файл
                                  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                  deleted_at INTEGER,
                                  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                                  FOREIGN KEY (attachment_id) REFERENCES attachments(id) ON DELETE CASCADE,
                                  UNIQUE(user_id, attachment_id)                          -- Уникальная связь пользователя и файла
);

-- Связь файлов с детьми
CREATE TABLE baby_attachments (
                                  id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор связи
                                  baby_id INTEGER NOT NULL,                               -- Ссылка на ребенка
                                  attachment_id INTEGER NOT NULL,                         -- Ссылка на файл
                                  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                  deleted_at INTEGER,
                                  FOREIGN KEY (baby_id) REFERENCES babies(id) ON DELETE CASCADE,
                                  FOREIGN KEY (attachment_id) REFERENCES attachments(id) ON DELETE CASCADE,
                                  UNIQUE(baby_id, attachment_id)                          -- Уникальная связь ребенка и файла
);

-- Связь файлов с приемами
CREATE TABLE appointment_attachments (
                                         id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор связи
                                         appointment_id INTEGER NOT NULL,                        -- Ссылка на прием
                                         attachment_id INTEGER NOT NULL,                         -- Ссылка на файл
                                         created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                         updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                         deleted_at INTEGER,
                                         FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
                                         FOREIGN KEY (attachment_id) REFERENCES attachments(id) ON DELETE CASCADE,
                                         UNIQUE(appointment_id, attachment_id)                   -- Уникальная связь приема и файла
);

-- Связь файлов с беременностями
CREATE TABLE pregnancy_attachments (
                                       id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор связи
                                       pregnancy_id INTEGER NOT NULL,                          -- Ссылка на беременность
                                       attachment_id INTEGER NOT NULL,                         -- Ссылка на файл
                                       created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                       updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                       deleted_at INTEGER,
                                       FOREIGN KEY (pregnancy_id) REFERENCES pregnancies(id) ON DELETE CASCADE,
                                       FOREIGN KEY (attachment_id) REFERENCES attachments(id) ON DELETE CASCADE,
                                       UNIQUE(pregnancy_id, attachment_id)                     -- Уникальная связь беременности и файла
);

-- Уведомления
CREATE TABLE notifications (
                               id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор уведомления
                               user_id INTEGER NOT NULL,                               -- Пользователь, для которого уведомление
                               type_id INTEGER NOT NULL,                               -- Тип уведомления
                               title TEXT NOT NULL,                                    -- Заголовок уведомления
                               message TEXT NOT NULL,                                  -- Текст уведомления
                               scheduled_time INTEGER NOT NULL,                        -- Время отправки в миллисекундах
                               sent BOOLEAN NOT NULL DEFAULT 0,                        -- Отправлено ли уведомление
                               sent_time INTEGER,                                      -- Время фактической отправки в миллисекундах
                               read BOOLEAN NOT NULL DEFAULT 0,                        -- Прочитано ли уведомление
                               read_time INTEGER,                                      -- Время прочтения в миллисекундах
                               data TEXT,                                              -- JSON дополнительные данные
                               created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                               updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                               deleted_at INTEGER,
                               FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                               FOREIGN KEY (type_id) REFERENCES notification_types(id) ON DELETE RESTRICT,
                               CHECK (title != ''),
                               CHECK (message != ''),
                               CHECK (scheduled_time > 0)                              -- Время отправки должно быть валидным
);

-- Журнал аудита для отслеживания изменений
CREATE TABLE audit_log (
                           id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор записи аудита
                           table_name TEXT NOT NULL,                               -- Название таблицы где произошло изменение
                           record_id INTEGER NOT NULL,                             -- ID измененной записи
                           action TEXT NOT NULL,                                   -- Действие: 'INSERT', 'UPDATE', 'DELETE'
                           old_values TEXT,                                        -- JSON старых значений (для UPDATE/DELETE)
                           new_values TEXT,                                        -- JSON новых значений (для INSERT/UPDATE)
                           user_id INTEGER,                                        -- ID пользователя, совершившего действие
                           changed_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),  -- Время изменения
                           ip_address TEXT,                                        -- IP адрес с которого выполнено действие
                           user_agent TEXT,                                        -- User agent клиента
                           CHECK (action IN ('INSERT', 'UPDATE', 'DELETE'))        -- Ограничение допустимых действий
);

-- =====================================================================
-- ТРИГГЕРЫ ДЛЯ АВТОМАТИЧЕСКОГО ОБНОВЛЕНИЯ UPDATED_AT
-- =====================================================================

-- Триггеры для всех таблиц (пример для основных таблиц)
CREATE TRIGGER update_pregnancy_statuses_updated_at AFTER UPDATE ON pregnancy_statuses
BEGIN
    UPDATE pregnancy_statuses SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_metric_categories_updated_at AFTER UPDATE ON metric_categories
BEGIN
    UPDATE metric_categories SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_metric_data_types_updated_at AFTER UPDATE ON metric_data_types
BEGIN
    UPDATE metric_data_types SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_entity_types_updated_at AFTER UPDATE ON entity_types
BEGIN
    UPDATE entity_types SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_appointment_types_updated_at AFTER UPDATE ON appointment_types
BEGIN
    UPDATE appointment_types SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_appointment_statuses_updated_at AFTER UPDATE ON appointment_statuses
BEGIN
    UPDATE appointment_statuses SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_appointment_priorities_updated_at AFTER UPDATE ON appointment_priorities
BEGIN
    UPDATE appointment_priorities SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_appointment_questions_updated_at AFTER UPDATE ON appointment_questions
BEGIN
    UPDATE appointment_questions SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_medication_forms_updated_at AFTER UPDATE ON medication_forms
BEGIN
    UPDATE medication_forms SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_medication_categories_updated_at AFTER UPDATE ON medication_categories
BEGIN
    UPDATE medication_categories SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_medication_frequencies_updated_at AFTER UPDATE ON medication_frequencies
BEGIN
    UPDATE medication_frequencies SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_days_of_week_updated_at AFTER UPDATE ON days_of_week
BEGIN
    UPDATE days_of_week SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_medication_intake_statuses_updated_at AFTER UPDATE ON medication_intake_statuses
BEGIN
    UPDATE medication_intake_statuses SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_mood_levels_updated_at AFTER UPDATE ON mood_levels
BEGIN
    UPDATE mood_levels SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_symptom_types_updated_at AFTER UPDATE ON symptom_types
BEGIN
    UPDATE symptom_types SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_file_types_updated_at AFTER UPDATE ON file_types
BEGIN
    UPDATE file_types SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_doctor_specializations_updated_at AFTER UPDATE ON doctor_specializations
BEGIN
    UPDATE doctor_specializations SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_notification_types_updated_at AFTER UPDATE ON notification_types
BEGIN
    UPDATE notification_types SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_users_updated_at AFTER UPDATE ON users
BEGIN
    UPDATE users SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_babies_updated_at AFTER UPDATE ON babies
BEGIN
    UPDATE babies SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_doctors_updated_at AFTER UPDATE ON doctors
BEGIN
    UPDATE doctors SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_doctor_schedules_updated_at AFTER UPDATE ON doctor_schedules
BEGIN
    UPDATE doctor_schedules SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_pregnancies_updated_at AFTER UPDATE ON pregnancies
BEGIN
    UPDATE pregnancies SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_pregnancy_babies_updated_at AFTER UPDATE ON pregnancy_babies
BEGIN
    UPDATE pregnancy_babies SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_metric_types_updated_at AFTER UPDATE ON metric_types
BEGIN
    UPDATE metric_types SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_user_metrics_updated_at AFTER UPDATE ON user_metrics
BEGIN
    UPDATE user_metrics SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_baby_metrics_updated_at AFTER UPDATE ON baby_metrics
BEGIN
    UPDATE baby_metrics SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_hospitals_updated_at AFTER UPDATE ON hospitals
BEGIN
    UPDATE hospitals SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_appointments_updated_at AFTER UPDATE ON appointments
BEGIN
    UPDATE appointments SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_appointment_question_answers_updated_at AFTER UPDATE ON appointment_question_answers
BEGIN
    UPDATE appointment_question_answers SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_appointment_metrics_updated_at AFTER UPDATE ON appointment_metrics
BEGIN
    UPDATE appointment_metrics SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_medications_updated_at AFTER UPDATE ON medications
BEGIN
    UPDATE medications SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_medication_schedules_updated_at AFTER UPDATE ON medication_schedules
BEGIN
    UPDATE medication_schedules SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_medication_intakes_updated_at AFTER UPDATE ON medication_intakes
BEGIN
    UPDATE medication_intakes SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_attachments_updated_at AFTER UPDATE ON attachments
BEGIN
    UPDATE attachments SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_user_attachments_updated_at AFTER UPDATE ON user_attachments
BEGIN
    UPDATE user_attachments SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_baby_attachments_updated_at AFTER UPDATE ON baby_attachments
BEGIN
    UPDATE baby_attachments SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_appointment_attachments_updated_at AFTER UPDATE ON appointment_attachments
BEGIN
    UPDATE appointment_attachments SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_pregnancy_attachments_updated_at AFTER UPDATE ON pregnancy_attachments
BEGIN
    UPDATE pregnancy_attachments SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

CREATE TRIGGER update_notifications_updated_at AFTER UPDATE ON notifications
BEGIN
    UPDATE notifications SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

-- =====================================================================
-- ИНДЕКСЫ ДЛЯ УЛУЧШЕНИЯ ПРОИЗВОДИТЕЛЬНОСТИ
-- =====================================================================

-- Индексы для метрик (частые запросы по весу, давлению, настроению)
CREATE INDEX idx_user_metrics_user_id ON user_metrics(user_id);
CREATE INDEX idx_user_metrics_measured_time ON user_metrics(measured_time);
CREATE INDEX idx_user_metrics_type_time ON user_metrics(metric_type_id, measured_time);
CREATE INDEX idx_baby_metrics_baby_id ON baby_metrics(baby_id);
CREATE INDEX idx_baby_metrics_type_time ON baby_metrics(metric_type_id, measured_time);

-- Индексы для приемов
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_planned_time ON appointments(planned_time);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_status_time ON appointments(status_id, planned_time);

-- Индексы для приемов лекарств (частые запросы за сегодня)
CREATE INDEX idx_medication_intakes_user_id ON medication_intakes(user_id);
CREATE INDEX idx_medication_intakes_actual_time ON medication_intakes(actual_time);
CREATE INDEX idx_medication_intakes_user_time ON medication_intakes(user_id, actual_time);
CREATE INDEX idx_medication_intakes_status_time ON medication_intakes(status_id, actual_time);
CREATE INDEX idx_medication_intakes_user_date ON medication_intakes(user_id, date(actual_time / 1000, 'unixepoch'));

-- Индексы для связей многие-ко-многим
CREATE INDEX idx_pregnancy_babies_pregnancy_id ON pregnancy_babies(pregnancy_id);
CREATE INDEX idx_pregnancy_babies_baby_id ON pregnancy_babies(baby_id);

-- Индексы для уведомлений
CREATE INDEX idx_notifications_user_scheduled ON notifications(user_id, scheduled_time);
CREATE INDEX idx_notifications_sent_scheduled ON notifications(sent, scheduled_time);

-- Индексы для расписаний лекарств
CREATE INDEX idx_medication_schedules_user_active ON medication_schedules(user_id, active);
CREATE INDEX idx_medication_schedules_start_end ON medication_schedules(start_date, end_date);

-- Индексы для аудита
CREATE INDEX idx_audit_log_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_changed_at ON audit_log(changed_at);

-- Индексы для связей файлов
CREATE INDEX idx_user_attachments_user_id ON user_attachments(user_id);
CREATE INDEX idx_baby_attachments_baby_id ON baby_attachments(baby_id);
CREATE INDEX idx_appointment_attachments_appointment_id ON appointment_attachments(appointment_id);
CREATE INDEX idx_pregnancy_attachments_pregnancy_id ON pregnancy_attachments(pregnancy_id);