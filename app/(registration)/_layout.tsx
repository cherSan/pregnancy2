import {Stack} from "expo-router";

export const RegistrationLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="select-language" options={{ headerShown: false }} />
            <Stack.Screen name="user-data" options={{ headerShown: false }} />
        </Stack>
    );
};

RegistrationLayout.displaName = "RegistrationLayout";

export default RegistrationLayout;
