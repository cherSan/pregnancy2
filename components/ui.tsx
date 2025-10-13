import React, {FC, ReactNode, useMemo} from "react";
import {Button, Provider} from "@ant-design/react-native";
import {useTranslation} from "react-i18next";
import enUS from '@ant-design/react-native/lib/locale-provider/en_US';
import ruRu from '@ant-design/react-native/lib/locale-provider/ru_RU';
import esEs from '@ant-design/react-native/lib/locale-provider/es_ES';
import {purpleTheme} from "@/theme/main";
const locales = {
    en: enUS,
    ru: ruRu,
    th: enUS,
    es: esEs,
    ua: ruRu,
}

type Props = {
    children: ReactNode;
};

export const UI: FC<Props> = ({ children }) => {
    const { i18n } = useTranslation();
    const isRTL = useMemo(() => i18n.dir(), [i18n]);
    const locale = useMemo(() => locales[i18n.language as keyof typeof locales] || enUS, [i18n]);

    return (
        <Provider
            isRTL={isRTL === 'rtl'}
            locale={locale}
            theme={purpleTheme}
        >
            {children}
        </Provider>
    )
}