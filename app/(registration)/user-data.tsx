import {useTranslation} from "react-i18next";
import {useRouter} from "expo-router";
import {Text} from "react-native";
import {DatePicker} from "@/components/form/date-picker.component";
import {Page} from "@/components/page";
import {List} from "@/components/list";
import {Input} from "@/components/form/input.component";
import {ModernButton} from "@/components/form/modern-button.component";

export const UserData = () => {
    const router = useRouter();
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
            <Page.Foreground
                gapContent={<Text>TEST</Text>}
            >
                <ModernButton onPress={() => router.replace('/pin-code')}>{t('next')}</ModernButton>
            </Page.Foreground>
        </Page>
    );
};

UserData.displayName = "UserData";

export default UserData;