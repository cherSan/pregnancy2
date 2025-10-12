import {View, Text, Button} from "react-native";
import {useRouter} from "expo-router";

export const Initialization = () => {
    const router = useRouter();
    return (
        <View>
            <Button title={'login'} onPress={() => router.replace('/authorization')} />
            <Button title={'private'} onPress={() => router.replace('/home')} />
            <Button title={'(registration)'} onPress={() => router.replace('/select-language')} />
            <Text>Initialization</Text>
        </View>
    );
};

Initialization.displayName = "Initialization";

export default Initialization;