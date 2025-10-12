import {View, Text, Button} from "react-native";
import {useRouter} from "expo-router";

export const PrivateHome = () => {
    const router = useRouter();
    return (
        <View>
            <Text>Step1</Text>
        </View>
    );
};

PrivateHome.displayName = "PrivateHome";

export default PrivateHome;