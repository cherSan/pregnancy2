import {Stack} from "expo-router";
import {I18nProvider} from "@/i18n/i18n";
import {useFonts} from "expo-font";
import {GreatVibes_400Regular} from "@expo-google-fonts/great-vibes";
import {Nunito_400Regular} from "@expo-google-fonts/nunito";
import {NotoSerifDisplay_400Regular} from "@expo-google-fonts/noto-serif-display";
import {NotoSans_400Regular} from "@expo-google-fonts/noto-sans";
import {UI} from "@/components/ui";

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        GreatVibes_400Regular,
        Nunito_400Regular,
        NotoSans_400Regular,
        NotoSerifDisplay_400Regular,
        antoutline: require('@ant-design/icons-react-native/fonts/antoutline.ttf'),
    });
    if (!fontsLoaded) return null;

    return (
        <I18nProvider>
            <UI>
                <Stack>
                    <Stack.Screen name="index" options={{headerShown: false}}/>
                    <Stack.Screen name="(private)" options={{headerShown: false}}/>
                    <Stack.Screen name="(registration)" options={{headerShown: false}}/>
                    <Stack.Screen name="authorization" options={{headerShown: false}}/>
                </Stack>
            </UI>
        </I18nProvider>
    );
}
