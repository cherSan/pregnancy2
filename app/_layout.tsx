import {Stack} from "expo-router";
import {I18nProvider} from "@/i18n/i18n";
import {useFonts} from "expo-font";
import {GreatVibes_400Regular} from "@expo-google-fonts/great-vibes";
import {Nunito_400Regular} from "@expo-google-fonts/nunito";
import {NotoSerifDisplay_400Regular} from "@expo-google-fonts/noto-serif-display";
import {NotoSans_400Regular} from "@expo-google-fonts/noto-sans";
import {
    setThemePreference,
    useThemePreference,
} from '@vonovak/react-native-theme-control';

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        GreatVibes_400Regular,
        Nunito_400Regular,
        NotoSans_400Regular,
        NotoSerifDisplay_400Regular,
    });
    setThemePreference('dark');
    if (!fontsLoaded) return null;

  return (
      <I18nProvider>
          <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(private)" options={{ headerShown: false }} />
              <Stack.Screen name="(registration)" options={{ headerShown: false }} />
              <Stack.Screen name="authorization" options={{ headerShown: false }} />
          </Stack>
      </I18nProvider>
  );
}
