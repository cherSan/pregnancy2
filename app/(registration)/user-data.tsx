import {StyleSheet, Platform, View} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {PageTitle} from "@/components/page-title";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Button, Card, Input, List} from "@ant-design/react-native";
import {TimePicker} from "@/components/time-picker";
import {DatePicker} from "@/components/date-picker";
import {Page} from "@/components/page";

export const RegistrationStep2 = () => {
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [showTPicker, setShowTPicker] = useState(false);

    const onChange = (event: any, selectedDate?: Date) => {
        setShowPicker(Platform.OS === 'ios'); // на iOS оставляем picker открытым
        setShowTPicker(Platform.OS === 'ios'); // на iOS оставляем picker открытым
        if (selectedDate) setDate(selectedDate);
    };

    const { t, i18n } = useTranslation();
    return (
        <Page>
            <PageTitle>{t('personalData')}</PageTitle>
            <List>
                <List.Item>
                    <Input placeholder={'Name'} />
                </List.Item>
                <DatePicker title={'TEST1'} />
                <TimePicker title={'TEST2'} />
            </List>
        </Page>
    );
};

RegistrationStep2.displayName = "RegistrationStep2";

export default RegistrationStep2;