import React, { useEffect, useState, ReactNode } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {getLocales} from 'expo-localization';
import {getItem} from "expo-secure-store";
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
    const language = getItem('language');

    useEffect(() => {
        const init = async () => {
            try {
                const deviceLocale = getLocales()[0]?.languageCode || 'en';
                const lng = deviceLocale in resources ? deviceLocale : 'en';

                await i18n.use(initReactI18next).init({
                    compatibilityJSON: 'v4',
                    resources,
                    lng: language || lng,
                    fallbackLng: 'en',
                    interpolation: { escapeValue: false },
                });

                setReady(true);
            } catch (err) {
                console.error('i18n initialization error:', err);
            }
        };

        init();
    }, [language]);

    if (!ready) return null;

    return <>{children}</>;
};
