import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, Button } from 'react-native';
import {useDatabaseStore} from '@/stores/database';
import {Redirect} from "expo-router";
import {getItem} from "expo-secure-store";

export const DatabaseInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isInitialized, error, initialize } = useDatabaseStore();
    const language = getItem('language');

    useEffect(() => {
        initialize();
    }, [initialize]);

    useEffect(() => {
        if (isInitialized) {
        }
    }, [isInitialized]);

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Text style={{ fontSize: 18, color: 'red', marginBottom: 20, textAlign: 'center' }}>
                    Ошибка загрузки базы данных
                </Text>
                <Text style={{ color: 'red', marginBottom: 20, textAlign: 'center' }}>{error}</Text>
                <Button title="Попробовать снова" onPress={initialize} />
            </View>
        );
    }

    if (!isInitialized) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
                <Text style={{ marginTop: 16 }}>Инициализация базы данных...</Text>
            </View>
        );
    }
    if (!language) return <Redirect href={"/select-language"} />;
    return <Redirect href={"/user-data"} />;
};

export default DatabaseInitializer;