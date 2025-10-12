const { withAndroidStyles } = require('@expo/config-plugins');

const withCustomDatePicker = (config) => {
    return withAndroidStyles(config, async (config) => {
        const styles = config.modResults;

        // Добавляем кастомные стили для DatePicker
        if (!styles.resources.style) {
            styles.resources.style = [];
        }

        // Находим или создаем AppTheme
        let appTheme = styles.resources.style.find(
            style => style.$.name === 'AppTheme'
        );

        if (!appTheme) {
            appTheme = {
                $: { name: 'AppTheme', parent: 'Theme.AppCompat.DayNight.DarkActionBar' },
                item: []
            };
            styles.resources.style.push(appTheme);
        }

        // Добавляем кастомизацию DatePicker
        const datePickerItems = [
            {
                $: { name: 'android:datePickerStyle' },
                _: '@style/MyDatePickerStyle'
            },
            {
                $: { name: 'android:spinnerDatePickerStyle' },
                _: '@style/MySpinnerDatePickerStyle'
            }
        ];

        appTheme.item = [...appTheme.item, ...datePickerItems];

        // Добавляем кастомные стили
        const customStyles = [
            {
                $: { name: 'MyDatePickerStyle', parent: 'android:Widget.Material.DatePicker' },
                item: [
                    {
                        $: { name: 'android:datePickerMode' },
                        _: 'spinner'
                    },
                    {
                        $: { name: 'android:headerBackground' },
                        _: '#6a1b9a'
                    },
                    {
                        $: { name: 'android:headerTextColor' },
                        _: '#FFFFFF'
                    }
                ]
            },
            {
                $: { name: 'MySpinnerDatePickerStyle', parent: 'android:Widget.Material.DatePicker.Spinner' },
                item: [
                    {
                        $: { name: 'android:backgroundColor' },
                        _: '#1e1e1e'
                    },
                    {
                        $: { name: 'android:headerBackground' },
                        _: '#6a1b9a'
                    },
                    {
                        $: { name: 'android:headerTextColor' },
                        _: '#FFFFFF'
                    }
                ]
            }
        ];

        styles.resources.style = [...styles.resources.style, ...customStyles];

        return config;
    });
};

module.exports = withCustomDatePicker;