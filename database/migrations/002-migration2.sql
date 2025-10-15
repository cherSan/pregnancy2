-- database-schema-critical-additions.sql
-- ТОЛЬКО КРИТИЧЕСКИЕ ДОПОЛНЕНИЯ, КОТОРЫХ НЕТ В ФАЙЛЕ 2

-- =====================================================================
-- САМОЕ ВАЖНОЕ ЧЕГО НЕТ В ФАЙЛЕ 2
-- =====================================================================

-- 1. НАСТРОЙКИ ПОЛЬЗОВАТЕЛЕЙ - ОБЯЗАТЕЛЬНО ДЛЯ КАСТОМИЗАЦИИ
CREATE TABLE user_settings (
                               id INTEGER PRIMARY KEY AUTOINCREMENT,
                               user_id INTEGER NOT NULL UNIQUE,
                               language TEXT DEFAULT 'ru',
                               timezone TEXT DEFAULT 'Europe/Moscow',
                               measurement_system TEXT DEFAULT 'metric',
                               notification_enabled BOOLEAN DEFAULT 1,
                               reminder_offset INTEGER DEFAULT 15,
                               theme TEXT DEFAULT 'light',
                               created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                               updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                               FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================================
-- КРИТИЧЕСКИЕ ИНДЕКСЫ ДЛЯ ПРОИЗВОДИТЕЛЬНОСТИ (упрощенные)
-- =====================================================================

-- Для быстрого поиска сегодняшних приемов лекарств
CREATE INDEX idx_medication_intakes_today ON medication_intakes(
                                                                user_id,
                                                                date(actual_time / 1000, 'unixepoch')
    ) WHERE actual_time IS NOT NULL;

-- Для поиска активных беременностей
CREATE INDEX idx_pregnancies_active ON pregnancies(status_id)
    WHERE deleted_at IS NULL;

-- =====================================================================
-- ВАЖНЫЕ ТРИГГЕРЫ ДЛЯ ЦЕЛОСТНОСТИ ДАННЫХ
-- =====================================================================

-- Автоматическое создание настроек при регистрации пользователя
CREATE TRIGGER create_user_settings AFTER INSERT ON users
BEGIN
    INSERT INTO user_settings (user_id) VALUES (NEW.id);
END;

-- Триггер для обновления updated_at в user_settings
CREATE TRIGGER update_user_settings_updated_at AFTER UPDATE ON user_settings
BEGIN
    UPDATE user_settings SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;

-- =====================================================================
-- ПРАКТИЧНЫЕ ПРЕДСТАВЛЕНИЯ ДЛЯ ЧАСТЫХ ЗАПРОСОВ
-- =====================================================================

-- Дашборд для сегодняшних данных (упрощенный)
CREATE VIEW today_dashboard AS
SELECT
    u.id as user_id,
    u.name,
    (SELECT COUNT(*) FROM medication_intakes
     WHERE user_id = u.id AND date(actual_time / 1000, 'unixepoch') = date('now')) as meds_taken_today,
        (SELECT COUNT(*) FROM user_metrics
        WHERE user_id = u.id AND date(measured_time / 1000, 'unixepoch') = date('now')) as metrics_today
        FROM users u
        WHERE u.deleted_at IS NULL;

-- Текущие беременности с информацией
CREATE VIEW current_pregnancies_overview AS
SELECT
    p.*,
    u.name as mother_name,
    ps.name as status_name
FROM pregnancies p
         JOIN users u ON p.mother_id = u.id
         JOIN pregnancy_statuses ps ON p.status_id = ps.id
WHERE p.deleted_at IS NULL
  AND ps.name NOT IN ('completed', 'cancelled', 'terminated');