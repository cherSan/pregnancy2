import {ScrollView, StyleSheet, Text, View} from "react-native";
import {Page} from "@/components/page";
import {Card} from "@/components/card";
import {ModernButton} from "@/components/form/modern-button.component";
import {List} from "@/components/list";

export const PrivateHome = () => {
    return (
        <Page hasTabBar={true}>
            <Page.Header>Step1</Page.Header>
            <Page.Content>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={{  height: 100, display: 'flex', flexDirection: 'row', gap: 10 }}>
                        <Card
                            style={styles.fastCard}
                        >
                            <Text style={styles.fastCardValue}>36.6</Text>
                            <Text style={styles.fastCardDescription}>temperature</Text>
                        </Card>
                        <Card
                            style={styles.fastCard}
                        >
                            <Text style={styles.fastCardValue}>100</Text>
                            <Text style={styles.fastCardDescription}>WEIGHT</Text>
                        </Card>
                        <Card
                            style={styles.fastCard}
                        >
                            <Text style={styles.fastCardValue}>120/100</Text>
                            <Text style={styles.fastCardDescription}>PRESSURE</Text>
                        </Card>
                        <Card
                            style={styles.fastCard}
                        >
                            <Text style={styles.fastCardValue}>100/</Text>
                            <Text style={styles.fastCardDescription}>PULSE</Text>
                        </Card>
                        <Card
                            style={styles.fastCard}
                        >
                            <Text style={styles.fastCardValue}>5</Text>
                            <Text style={styles.fastCardDescription}>MOOD</Text>
                        </Card>
                    </View>
                </ScrollView>
                <ModernButton onPress={() => {}}>KICK</ModernButton>
                <List title={'Calendar'}>
                    <List.Item title={'TEST1'}>
                        <Text>TEST1</Text>
                    </List.Item>
                    <List.Item title={'TEST2'} />
                    <List.Item title={'TEST3'} />
                    <List.Item title={'TEST4'} />
                    <List.Item title={'TEST5'} />
                    <List.Item title={'TEST6'} />
                    <List.Item title={'TEST7'} />
                    <List.Item title={'TEST8'} />
                    <List.Item title={'TEST9'} />
                </List>
            </Page.Content>
            <Page.Foreground
                gapContent={
                    <Card style={styles.pregnancyCard}>
                        <Text style={styles.pregnancyText}>30 weeks 5 days</Text>
                    </Card>
                }
            >
                <List title={'Calendar'}>
                    <List.Item title={'TEST1'}>
                        <Text>TEST1</Text>
                    </List.Item>
                    <List.Item title={'TEST2'} />
                    <List.Item title={'TEST3'} />
                    <List.Item title={'TEST4'} />
                    <List.Item title={'TEST5'} />
                    <List.Item title={'TEST6'} />
                    <List.Item title={'TEST7'} />
                    <List.Item title={'TEST8'} />
                    <List.Item title={'TEST9'} />
                </List>
            </Page.Foreground>
        </Page>
    );
};

PrivateHome.displayName = "PrivateHome";

export default PrivateHome;

const styles = StyleSheet.create({
    fastCard: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 100,
    },
    fastCardDescription: {
        fontSize: 8,
        color: '#8e44ad',
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    fastCardValue: {
        fontSize: 20,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    pregnancyCard: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pregnancyText: { color: '#8e44ad', fontSize: 20, fontWeight: '700', textTransform: 'uppercase' }
});