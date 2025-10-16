import React from 'react';
import {View, Text, Dimensions, StyleSheet} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import CountryFlag from 'react-native-country-flag';
import { useRouter } from 'expo-router';
import {Extrapolation, interpolate} from "react-native-reanimated";
import {useTranslation} from "react-i18next";
import {ModernButton} from "@/components/form/modern-button.component";
import {Page} from "@/components/page";

const languages = [
    { code: 'en', name: 'English', countryCode: 'US' },
    { code: 'ru', name: 'Русский', countryCode: 'RU' },
    { code: 'ua', name: 'Українська', countryCode: 'UA' },
    { code: 'th', name: 'ไทย', countryCode: 'TH' },
    { code: 'es', name: 'Español', countryCode: 'ES' },
];

const { width } = Dimensions.get('window');

const PAGE_WIDTH = width / 4;

export const SelectLanguage = () => {
    const { t, i18n } = useTranslation();
    const router = useRouter();

    return (
        <Page>
            <Page.Header>{t('selectLanguage')}</Page.Header>
            <Page.Content>
                <View style={styles.pageContent}>
                    <Carousel
                        loop={false}
                        width={width}
                        height={width/2}
                        data={languages}
                        snapEnabled={true}
                        onSnapToItem={index => i18n.changeLanguage(languages[index].code)}
                        customAnimation={(value: number) => {
                            "worklet";
                            const size = PAGE_WIDTH;
                            const scale = interpolate(
                                value,
                                [-2, -1, 0, 1, 2],
                                [2, 1.2, 1, 1.2, 2],
                                Extrapolation.CLAMP,
                            );

                            const translate = interpolate(
                                value,
                                [-2, -1, 0, 1, 2],
                                [-size * 1.45, -size * 0.9, 0, size * 0.9, size * 1.45],
                            );

                            return  {
                                transform: [
                                    { scale },
                                    {
                                        translateX: translate,
                                    },
                                    { perspective: 150 },
                                    {
                                        rotateY: `${interpolate(value, [-1, 0, 1], [30, 0, -30], Extrapolation.CLAMP)}deg`,
                                    },
                                ],
                            };
                        }}
                        modeConfig={{
                            parallaxScrollingScale: 0.9,
                            parallaxScrollingOffset: 50,
                        }}
                        renderItem={({ item, index }) => (
                            <View style={styles.item} key={item.code}>
                                <CountryFlag isoCode={item.countryCode} size={40} style={styles.flag} />
                                <Text style={styles.text}>{item.name}</Text>
                            </View>
                        )}
                    />
                    <ModernButton onPress={() => router.replace('/user-data')}>{t('next')}</ModernButton>
                </View>
            </Page.Content>
        </Page>
    );
};

SelectLanguage.displayName = "SelectLanguage";

export default SelectLanguage;

const styles = StyleSheet.create({
    flag: {
        elevation: 10
    },
    item: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 12,
        color: '#fff',
        marginTop: 8,
        fontWeight: '700',
        elevation: 10,
    },
    pageContent: {
        flex: 1,
        alignItems: 'center',
    }
});
