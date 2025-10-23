import {Tabs} from "expo-router";

export const PrivateLayout = () => {
    return (
        <Tabs>
            <Tabs.Screen name="home" options={{ headerShown: false }} />
        </Tabs>
    );
};

PrivateLayout.displaName = "PrivateLayout";

export default PrivateLayout;
