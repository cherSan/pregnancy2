import { StyleSheet, TextInput, Platform} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {PageTitle} from "@/components/page-title";
import React, {useState} from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/button";

export const RegistrationStep2 = () => {
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const onChange = (event: any, selectedDate?: Date) => {
        setShowPicker(Platform.OS === 'ios'); // на iOS оставляем picker открытым
        if (selectedDate) setDate(selectedDate);
    };
    const { t, i18n } = useTranslation();
    return (
        <LinearGradient colors={['#8e44ad', '#6a1b9a', '#4a148c']} style={styles.container}>
            <PageTitle>{t('personalData')}</PageTitle>
            <TextInput placeholder={'Name'} />
            <Button onPress={() => setShowPicker(true)}>
                {i18n.t('selectDate')}: { date.toLocaleDateString() }
            </Button>
            <DateTimePickerModal
                isVisible={showPicker}
                mode="date"
                display={'spinner'}
                onConfirm={onChange}
                onCancel={() => setShowPicker(false)}
            />
        </LinearGradient>
    );
};

RegistrationStep2.displayName = "RegistrationStep2";

export default RegistrationStep2;

const styles = StyleSheet.create({
    container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
    dateTimePicker: {
        width: 200,
        height: 200,
        backgroundColor: 'transparent',
    }
});