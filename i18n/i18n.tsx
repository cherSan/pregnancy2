import React, { useEffect, useState, ReactNode } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import translationEn from './locales/en/translation.json';
import translationRu from './locales/ru/translation.json';
import translationTh from './locales/th/translation.json';
import translationEs from './locales/es/translation.json';
import translationUa from './locales/ua/translation.json';

const resources = {
    en: { translation: translationEn },
    ru: { translation: translationRu },
    th: { translation: translationTh },
    es: { translation: translationEs },
    ua: { translation: translationUa },
} as const;

export type LanguageKey = keyof typeof resources;

interface I18nProviderProps {
    children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
    const [ready, setReady] = useState(false);
    useEffect(() => {
        const init = async () => {
            try {
                const deviceLocale = Localization.getLocales()[0]?.languageCode || 'en';
                const lng = deviceLocale in resources ? deviceLocale : 'en';

                await i18n.use(initReactI18next).init({
                    compatibilityJSON: 'v4',
                    resources,
                    lng,
                    fallbackLng: 'en',
                    interpolation: { escapeValue: false },
                });

                setReady(true);
            } catch (err) {
                console.error('i18n initialization error:', err);
            }
        };

        init();
    }, []);

    if (!ready) return null;

    return <>{children}</>;
};

export const changeLanguage = async (lng: LanguageKey) => {
    if (resources[lng]) {
        await i18n.changeLanguage(lng);
    }
};

export default i18n;
