import {View, Text, Button} from "react-native";
import {useRouter} from "expo-router";

export const PrivateLayout = () => {
    const router = useRouter();
    return (
        <View>
            <Button title={'login'} onPress={() => router.replace('/authorization')} />
            <Button title={'private'} onPress={() => router.replace('/user-data')} />
            <Button title={'(registration)'} onPress={() => router.replace('/select-language')} />
            <Text>PRIVATE</Text>
        </View>
    );
};

PrivateLayout.displaName = "PrivateLayout";

export default PrivateLayout;
