import {useEffect, useState} from "react";
import {Text, Button, View} from "react-native";
import {useRouter} from "expo-router";
import {Page} from "@/components/page";
import {initUserTable} from "@/database/schemas/user";
import {ActivityIndicator} from "@ant-design/react-native";
import db from "@/database";

export const Initialization = () => {
    const [dbReady, setDbReady] = useState(false);
    const [user, setUser] = useState<any>(undefined);

    const router = useRouter();
    useEffect(() => {
        const initializeDb = async () => {
            await initUserTable();
            setDbReady(true);
        };
        initializeDb();
    }, []);

    useEffect(() => {
        if (dbReady) {
            try {
                const result = db.getFirstSync('SELECT * FROM users LIMIT 1');
                setUser(result);
                if (result) {
                    db.execAsync(`
                        DELETE FROM users WHERE id = ${result.id};
                    `);
                }
                console.log('User check result:', result);
            } catch (e) {
                console.error('Error checking user:', e);
            }
        }
    }, [dbReady]);


    if (!dbReady || !user) {
        return (
            <Page>
                <Page.Content>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" />
                        <Text>Загрузка...</Text>
                    </View>
                </Page.Content>
            </Page>
        );
    }

    return (
        <Page>
            <Page.Content>
                <Button title={'login'} onPress={() => router.replace('/authorization')} />
                <Button title={'private'} onPress={() => router.replace('/home')} />
                <Button title={'(registration)'} onPress={() => router.replace('/select-language')} />
                <Text>Initialization</Text>
            </Page.Content>
        </Page>
    );
};

Initialization.displayName = "Initialization";

export default Initialization;