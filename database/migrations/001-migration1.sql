-- database-schema-optimized.sql

-- =====================================================================
-- ДОПОЛНИТЕЛЬНЫЕ УЛУЧШЕНИЯ И ОПТИМИЗАЦИИ
-- =====================================================================

-- 1. ДОБАВИМ ТАБЛИЦУ ДЛЯ СИМПТОМОВ (вместо JSON в medication_intakes)
CREATE TABLE medication_intake_symptoms (
                                            id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор связи симптома и приема
                                            medication_intake_id INTEGER NOT NULL,                  -- Ссылка на прием лекарства
                                            symptom_type_id INTEGER NOT NULL,                       -- Тип симптома
                                            symptom_time TEXT NOT NULL,                             -- Когда проявился симптом: 'before', 'after'
                                            severity INTEGER,                                       -- Интенсивность симптома (1-10)
                                            notes TEXT,                                             -- Дополнительные заметки о симптоме
                                            created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                            updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                            FOREIGN KEY (medication_intake_id) REFERENCES medication_intakes(id) ON DELETE CASCADE,
                                            FOREIGN KEY (symptom_type_id) REFERENCES symptom_types(id) ON DELETE RESTRICT,
                                            CHECK (symptom_time IN ('before', 'after')),
                                            CHECK (severity IS NULL OR (severity BETWEEN 1 AND 10))
);

-- 2. ТАБЛИЦА ДЛЯ КICK COUNTS (подсчет шевелений) - очень важная метрика!
CREATE TABLE fetal_kick_counts (
                                   id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор подсчета
                                   pregnancy_id INTEGER NOT NULL,                          -- Ссылка на беременность
                                   start_time INTEGER NOT NULL,                            -- Время начала подсчета в миллисекундах
                                   end_time INTEGER NOT NULL,                              -- Время окончания подсчета в миллисекундах
                                   kick_count INTEGER NOT NULL,                            -- Количество шевелений
                                   duration_minutes INTEGER NOT NULL,                      -- Продолжительность подсчета в минутах
                                   notes TEXT,                                             -- Заметки о активности
                                   created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                   updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                   deleted_at INTEGER,
                                   FOREIGN KEY (pregnancy_id) REFERENCES pregnancies(id) ON DELETE CASCADE,
                                   CHECK (kick_count >= 0),
                                   CHECK (duration_minutes > 0),
                                   CHECK (end_time > start_time)
);

-- 3. ТАБЛИЦА ДЛЯ КОНТРАКТОВ БРЮКСОНА-ХИКСА (тренировочные схватки)
CREATE TABLE braxton_hicks_contractions (
                                            id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор схватки
                                            pregnancy_id INTEGER NOT NULL,                          -- Ссылка на беременность
                                            start_time INTEGER NOT NULL,                            -- Время начала схватки в миллисекундах
                                            end_time INTEGER,                                       -- Время окончания схватки в миллисекундах
                                            intensity INTEGER,                                      -- Интенсивность (1-10)
                                            notes TEXT,                                             -- Заметки о схватке
                                            created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                            updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                            deleted_at INTEGER,
                                            FOREIGN KEY (pregnancy_id) REFERENCES pregnancies(id) ON DELETE CASCADE,
                                            CHECK (intensity IS NULL OR (intensity BETWEEN 1 AND 10)),
                                            CHECK (end_time IS NULL OR end_time > start_time)
);

-- 4. ТАБЛИЦА ДЛЯ ВОДНОГО БАЛАНСА (гидратация)
CREATE TABLE hydration_logs (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор записи
                                user_id INTEGER NOT NULL,                               -- Ссылка на пользователя
                                log_time INTEGER NOT NULL,                              -- Время записи в миллисекундах
                                amount_ml INTEGER NOT NULL,                             -- Количество жидкости в мл
                                drink_type TEXT,                                        -- Тип напитка: 'water', 'juice', 'tea', 'milk'
                                notes TEXT,                                             -- Заметки
                                created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                deleted_at INTEGER,
                                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                                CHECK (amount_ml > 0),
                                CHECK (drink_type IS NULL OR drink_type IN ('water', 'juice', 'tea', 'milk', 'coffee', 'soda', 'smoothie'))
);

-- 5. ТАБЛИЦА ДЛЯ СНА
CREATE TABLE sleep_sessions (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор сессии сна
                                user_id INTEGER NOT NULL,                               -- Ссылка на пользователя
                                start_time INTEGER NOT NULL,                            -- Время начала сна в миллисекундах
                                end_time INTEGER,                                       -- Время окончания сна в миллисекундах
                                quality INTEGER,                                        -- Качество сна (1-10)
                                wakeups_count INTEGER,                                  -- Количество пробуждений
                                notes TEXT,                                             -- Заметки о сне
                                created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                deleted_at INTEGER,
                                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                                CHECK (quality IS NULL OR (quality BETWEEN 1 AND 10)),
                                CHECK (wakeups_count IS NULL OR wakeups_count >= 0),
                                CHECK (end_time IS NULL OR end_time > start_time)
);

-- 6. ТАБЛИЦА ДЛЯ ПИТАНИЯ/ПРИЕМОВ ПИЩИ
CREATE TABLE food_intakes (
                              id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор приема пищи
                              user_id INTEGER NOT NULL,                               -- Ссылка на пользователя
                              intake_time INTEGER NOT NULL,                           -- Время приема пищи в миллисекундах
                              meal_type TEXT NOT NULL,                                -- Тип приема: 'breakfast', 'lunch', 'dinner', 'snack'
                              description TEXT,                                       -- Описание что было съедено
                              calories INTEGER,                                       -- Примерная калорийность
                              notes TEXT,                                             -- Заметки
                              created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                              updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                              deleted_at INTEGER,
                              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                              CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
                              CHECK (calories IS NULL OR calories >= 0)
);

-- 7. ТАБЛИЦА ДЛЯ АКТИВНОСТИ/ФИЗИЧЕСКИХ УПРАЖНЕНИЙ
CREATE TABLE physical_activities (
                                     id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор активности
                                     user_id INTEGER NOT NULL,                               -- Ссылка на пользователя
                                     start_time INTEGER NOT NULL,                            -- Время начала активности в миллисекундах
                                     end_time INTEGER,                                       -- Время окончания активности в миллисекундах
                                     activity_type TEXT NOT NULL,                            -- Тип активности: 'walking', 'yoga', 'swimming'
                                     duration_minutes INTEGER,                               -- Продолжительность в минутах
                                     intensity INTEGER,                                      -- Интенсивность (1-10)
                                     calories_burned INTEGER,                                -- Сожженные калории
                                     notes TEXT,                                             -- Заметки
                                     created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                     updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                     deleted_at INTEGER,
                                     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                                     CHECK (intensity IS NULL OR (intensity BETWEEN 1 AND 10)),
                                     CHECK (duration_minutes IS NULL OR duration_minutes > 0),
                                     CHECK (calories_burned IS NULL OR calories_burned >= 0),
                                     CHECK (end_time IS NULL OR end_time > start_time)
);

-- 8. ТАБЛИЦА ДЛЯ МЕДИЦИНСКИХ РЕКОМЕНДАЦИЙ
CREATE TABLE medical_recommendations (
                                         id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор рекомендации
                                         user_id INTEGER NOT NULL,                               -- Ссылка на пользователя
                                         doctor_id INTEGER,                                      -- Врач, давший рекомендацию
                                         title TEXT NOT NULL,                                    -- Заголовок рекомендации
                                         description TEXT NOT NULL,                              -- Текст рекомендации
                                         recommendation_type TEXT NOT NULL,                      -- Тип: 'diet', 'activity', 'medication', 'lifestyle'
                                         priority TEXT NOT NULL,                                 -- Приоритет: 'low', 'medium', 'high', 'critical'
                                         start_date INTEGER,                                     -- Дата начала действия
                                         end_date INTEGER,                                       -- Дата окончания действия
                                         completed BOOLEAN NOT NULL DEFAULT 0,                   -- Выполнена ли рекомендация
                                         completed_date INTEGER,                                 -- Дата выполнения
                                         created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                         updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                         deleted_at INTEGER,
                                         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                                         FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL,
                                         CHECK (title != ''),
    CHECK (description != ''),
    CHECK (recommendation_type IN ('diet', 'activity', 'medication', 'lifestyle', 'other')),
    CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

-- 9. УЛУЧШЕННАЯ ТАБЛИЦА ДЛЯ РАСПИСАНИЯ ВРАЧЕЙ С УЧЕТОМ ПЕРЕРЫВОВ
CREATE TABLE doctor_schedule_breaks (
                                        id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор перерыва
                                        doctor_schedule_id INTEGER NOT NULL,                    -- Ссылка на расписание врача
                                        break_type TEXT NOT NULL,                               -- Тип перерыва: 'lunch', 'break', 'meeting'
                                        start_time TEXT NOT NULL,                               -- Время начала перерыва '13:00'
                                        end_time TEXT NOT NULL,                                 -- Время окончания перерыва '14:00'
                                        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                        deleted_at INTEGER,
                                        FOREIGN KEY (doctor_schedule_id) REFERENCES doctor_schedules(id) ON DELETE CASCADE,
                                        CHECK (break_type IN ('lunch', 'break', 'meeting', 'procedure', 'other')),
                                        CHECK (start_time GLOB '[0-9][0-9]:[0-9][0-9]'),
    CHECK (end_time GLOB '[0-9][0-9]:[0-9][0-9]'),
    CHECK (start_time < end_time)
);

-- 10. ТАБЛИЦА ДЛЯ ОТСЛЕЖИВАНИЯ ВАКЦИН ДЛЯ ДЕТЕЙ
CREATE TABLE baby_vaccinations (
                                   id INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Уникальный идентификатор вакцинации
                                   baby_id INTEGER NOT NULL,                               -- Ссылка на ребенка
                                   vaccine_name TEXT NOT NULL,                             -- Название вакцины
                                   scheduled_date INTEGER,                                 -- Планируемая дата вакцинации
                                   administered_date INTEGER,                              -- Фактическая дата вакцинации
                                   dose_number INTEGER,                                    -- Номер дозы (1, 2, 3...)
                                   total_doses INTEGER,                                    -- Всего доз требуется
                                   hospital_id INTEGER,                                    -- Где сделана прививка
                                   doctor_id INTEGER,                                      -- Кто сделал прививку
                                   notes TEXT,                                             -- Заметки о реакции
                                   created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                   updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                                   deleted_at INTEGER,
                                   FOREIGN KEY (baby_id) REFERENCES babies(id) ON DELETE CASCADE,
                                   FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE SET NULL,
                                   FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL,
                                   CHECK (vaccine_name != ''),
    CHECK (dose_number IS NULL OR dose_number > 0),
    CHECK (total_doses IS NULL OR total_doses > 0),
    CHECK (dose_number IS NULL OR total_doses IS NULL OR dose_number <= total_doses)
);

-- =====================================================================
-- ОПТИМИЗАЦИИ СУЩЕСТВУЮЩИХ ТАБЛИЦ
-- =====================================================================

-- 11. ДОБАВИМ ПОЛЕ ДЛЯ ГЕСТАЦИОННОГО ВОЗРАСТА В БЕРЕМЕННОСТИ
ALTER TABLE pregnancies ADD COLUMN gestational_weeks INTEGER;  -- Текущий гестационный возраст в неделях
ALTER TABLE pregnancies ADD COLUMN gestational_days INTEGER;   -- Текущий гестационный возраст в днях

-- 12. ДОБАВИМ ПОЛЕ ДЛЯ ВЕСА И РОСТА В МОМЕНТ ИЗМЕРЕНИЯ МЕТРИК
ALTER TABLE user_metrics ADD COLUMN weight_kg REAL;         -- Вес в кг на момент измерения
ALTER TABLE user_metrics ADD COLUMN height_cm REAL;         -- Рост в см на момент измерения

-- 13. УЛУЧШИМ ТАБЛИЦУ METRIC_TYPES - ДОБАВИМ ВАЖНЫЕ ФЛАГИ
ALTER TABLE metric_types ADD COLUMN is_critical BOOLEAN NOT NULL DEFAULT 0;  -- Критическая ли метрика
ALTER TABLE metric_types ADD COLUMN requires_attention BOOLEAN NOT NULL DEFAULT 0;  -- Требует внимания врача
ALTER TABLE metric_types ADD COLUMN trend_analysis BOOLEAN NOT NULL DEFAULT 1;  -- Нужно ли анализировать тренд

-- 14. ДОБАВИМ ПОЛЕ ДЛЯ ЛОКАЦИИ ИЗМЕРЕНИЯ МЕТРИК
ALTER TABLE user_metrics ADD COLUMN location TEXT;          -- Где измерялось: 'home', 'hospital', 'clinic'
ALTER TABLE baby_metrics ADD COLUMN location TEXT;

-- 15. УЛУЧШИМ ТАБЛИЦУ NOTIFICATIONS ДЛЯ ПОВТОРЯЮЩИХСЯ УВЕДОМЛЕНИЙ
ALTER TABLE notifications ADD COLUMN is_recurring BOOLEAN NOT NULL DEFAULT 0;  -- Повторяющееся уведомление
ALTER TABLE notifications ADD COLUMN recurrence_pattern TEXT;  -- Паттерн повторения: 'daily', 'weekly', 'monthly'
ALTER TABLE notifications ADD COLUMN recurrence_end_date INTEGER;  -- Дата окончания повторений

-- =====================================================================
-- ДОПОЛНИТЕЛЬНЫЕ ИНДЕКСЫ ДЛЯ ЧАСТЫХ ЗАПРОСОВ
-- =====================================================================

-- Индексы для новых таблиц
CREATE INDEX idx_fetal_kick_counts_pregnancy_time ON fetal_kick_counts(pregnancy_id, start_time);
CREATE INDEX idx_braxton_hicks_pregnancy_time ON braxton_hicks_contractions(pregnancy_id, start_time);
CREATE INDEX idx_hydration_logs_user_time ON hydration_logs(user_id, log_time);
CREATE INDEX idx_sleep_sessions_user_time ON sleep_sessions(user_id, start_time);
CREATE INDEX idx_food_intakes_user_time ON food_intakes(user_id, intake_time);
CREATE INDEX idx_physical_activities_user_time ON physical_activities(user_id, start_time);
CREATE INDEX idx_medical_recommendations_user_priority ON medical_recommendations(user_id, priority, completed);
CREATE INDEX idx_baby_vaccinations_baby_date ON baby_vaccinations(baby_id, administered_date, scheduled_date);

-- Составные индексы для сложных запросов
CREATE INDEX idx_user_metrics_comprehensive ON user_metrics(user_id, metric_type_id, measured_time) WHERE deleted_at IS NULL;
CREATE INDEX idx_medication_intakes_comprehensive ON medication_intakes(user_id, actual_time, status_id) WHERE actual_time IS NOT NULL;
CREATE INDEX idx_appointments_comprehensive ON appointments(user_id, planned_time, status_id) WHERE deleted_at IS NULL;

-- Индексы для поиска по датам
CREATE INDEX idx_pregnancies_dates ON pregnancies(start_date, edd) WHERE deleted_at IS NULL;
CREATE INDEX idx_babies_birth_date ON babies(birth_date) WHERE deleted_at IS NULL;

-- =====================================================================
-- ТРИГГЕРЫ ДЛЯ АВТОМАТИЧЕСКИХ РАСЧЕТОВ
-- =====================================================================

-- Триггер для автоматического расчета гестационного возраста
CREATE TRIGGER calculate_gestational_age AFTER UPDATE OF start_date ON pregnancies
    WHEN NEW.start_date IS NOT NULL
BEGIN
    UPDATE pregnancies
    SET
        gestational_weeks = CAST((julianday('now') - julianday(NEW.start_date / 1000, 'unixepoch')) / 7 AS INTEGER),
        gestational_days = CAST((julianday('now') - julianday(NEW.start_date / 1000, 'unixepoch')) % 7 AS INTEGER)
    WHERE id = NEW.id;
END;

-- Триггер для автоматического создания напоминаний о приеме лекарств
CREATE TRIGGER create_medication_reminders AFTER INSERT ON medication_schedules
    WHEN NEW.active = 1 AND NEW.reminder_enabled = 1
BEGIN
    INSERT INTO notifications (
        user_id,
        type_id,
        title,
        message,
        scheduled_time,
        is_recurring,
        recurrence_pattern,
        recurrence_end_date
    )
    SELECT
        NEW.user_id,
        (SELECT id FROM notification_types WHERE name = 'medication_reminder' LIMIT 1),
        'Напоминание о приеме лекарства',
        'Примите ' || m.name || ' - ' || NEW.dosage,
        -- Здесь должна быть логика расчета времени напоминания
        (strftime('%s', 'now') * 1000) + (NEW.reminder_offset * 60 * 1000),
        1,
        'daily',
        NEW.end_date
    FROM medications m
    WHERE m.id = NEW.medication_id;
END;

-- Триггер для проверки критических значений метрик
CREATE TRIGGER check_critical_metrics AFTER INSERT ON user_metrics
    WHEN (SELECT is_critical FROM metric_types WHERE id = NEW.metric_type_id) = 1
BEGIN
    -- Логика проверки выходит за пределы нормального диапазона
    -- и создания уведомления при необходимости
UPDATE user_metrics
SET notes = COALESCE(notes, '') || ' [ТРЕБУЕТ ВНИМАНИЯ]'
WHERE id = NEW.id
  AND (NEW.value < (SELECT normal_range_min FROM metric_types WHERE id = NEW.metric_type_id)
    OR NEW.value > (SELECT normal_range_max FROM metric_types WHERE id = NEW.metric_type_id));
END;

-- =====================================================================
-- ПРЕДСТАВЛЕНИЯ (VIEWS) ДЛЯ УДОБНЫХ ЗАПРОСОВ
-- =====================================================================

-- Представление для ежедневного дашборда метрик
CREATE VIEW daily_metrics_dashboard AS
SELECT
    u.id as user_id,
    u.name as user_name,
        date(datetime(um.measured_time / 1000, 'unixepoch')) as measurement_date,
        mt.name as metric_name,
        mt.unit,
        um.value,
        um.measured_time
        FROM users u
        JOIN user_metrics um ON u.id = um.user_id
        JOIN metric_types mt ON um.metric_type_id = mt.id
        WHERE um.deleted_at IS NULL
        AND date(datetime(um.measured_time / 1000, 'unixepoch')) = date('now');

-- Представление для сегодняшних приемов лекарств
CREATE VIEW today_medication_schedule AS
SELECT
    ms.user_id,
    m.name as medication_name,
    ms.dosage,
    ms.planned_time,
    ms.reminder_offset,
    u.name as user_name
FROM medication_schedules ms
         JOIN medications m ON ms.medication_id = m.id
         JOIN users u ON ms.user_id = u.id
WHERE ms.active = 1
  AND ms.deleted_at IS NULL
  AND (ms.end_date IS NULL OR ms.end_date >= (strftime('%s', 'now') * 1000))
  AND (ms.start_date IS NULL OR ms.start_date <= (strftime('%s', 'now') * 1000));

-- Представление для беременностей с текущим статусом
CREATE VIEW current_pregnancies AS
SELECT
    p.*,
    u.name as mother_name,
    ps.name as status_name,
    p.gestational_weeks || ' недель ' || p.gestational_days || ' дней' as gestational_age
FROM pregnancies p
         JOIN users u ON p.mother_id = u.id
         JOIN pregnancy_statuses ps ON p.status_id = ps.id
WHERE p.deleted_at IS NULL
  AND ps.name != 'completed'
AND ps.name != 'cancelled';

-- =====================================================================
-- ДОПОЛНИТЕЛЬНЫЕ CHECK CONSTRAINTS ДЛЯ ДАННЫХ
-- =====================================================================

-- Триггер для проверки что measured_time не слишком в будущем
CREATE TRIGGER validate_measured_time_range BEFORE INSERT ON user_metrics
BEGIN
    SELECT
        CASE
            WHEN NEW.measured_time > (strftime('%s', 'now') * 1000) + (365 * 24 * 60 * 60 * 1000) THEN
                RAISE(ABORT, 'Measurement time cannot be more than 1 year in the future')
            END;
END;

-- Триггер для проверки дат рождения
CREATE TRIGGER validate_dob BEFORE INSERT ON users
BEGIN
    SELECT
        CASE
            WHEN NEW.dob IS NOT NULL AND NEW.dob > (strftime('%s', 'now') * 1000) THEN
                RAISE(ABORT, 'Date of birth cannot be in the future')
            END;
END;

-- Триггер для проверки дат рождения детей
CREATE TRIGGER validate_baby_birth_date BEFORE INSERT ON babies
BEGIN
    SELECT
        CASE
            WHEN NEW.birth_date IS NOT NULL AND NEW.birth_date > (strftime('%s', 'now') * 1000) THEN
                RAISE(ABORT, 'Birth date cannot be in the future')
            END;
END;