import {View, Text, Button} from "react-native";
import {useRouter} from "expo-router";

export const Authorization = () => {
    const router = useRouter();
    return (
        <View>
            <Button title={'login'} onPress={() => router.replace('/authorization')} />
            <Button title={'private'} onPress={() => router.replace('/home')} />
            <Button title={'(registration)'} onPress={() => router.replace('/select-language')} />
            <Text>Authorization</Text>
        </View>
    );
};

Authorization.displaName = "Authorization";

export default Authorization;
