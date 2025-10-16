import {Platform} from "react-native";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {TimePicker} from "@/components/form/time-picker.component";
import {DatePicker} from "@/components/form/date-picker.component";
import {Page} from "@/components/page";
import {List} from "@/components/list";
import {Input} from "@/components/form/input.component";
import {ModernButton} from "@/components/form/modern-button.component";
import {useRouter} from "expo-router";

export const UserData = () => {
    const router = useRouter();
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [showTPicker, setShowTPicker] = useState(false);

    const onChange = (event: any, selectedDate?: Date) => {
        setShowPicker(Platform.OS === 'ios'); // на iOS оставляем picker открытым
        setShowTPicker(Platform.OS === 'ios'); // на iOS оставляем picker открытым
        if (selectedDate) setDate(selectedDate);
    };

    const { t } = useTranslation();
    return (
        <Page>
            <Page.Header>{t('personalData')}</Page.Header>
            <Page.Content>
                <List>
                    <Input placeholder={'Name'} error={'T'} />
                    <DatePicker title={'TEST1'} />
                </List>
                <ModernButton onPress={() => router.replace('/pin-code')}>{t('next')}</ModernButton>
            </Page.Content>
        </Page>
    );
};

UserData.displayName = "UserData";

export default UserData;