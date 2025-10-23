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
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
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
                    <List.Item title={'TEST1'} extra={"12:00"} />
                    <List.Item title={'TEST2'} extra={"13:00"} />
                    <List.Item title={'TEST3'} extra={"14:00"} />
                    <List.Item title={'TEST4'} extra={"15:00"} />
                    <List.Item title={'TEST5'} extra={"16:00"} />
                    <List.Item title={'TEST3'} extra={"17:00"} />
                    <List.Item title={'TEST4'} extra={"18:00"} />
                    <List.Item title={'TEST5'} extra={"19:00"} />
                </List>
            </Page.Content>
            <Page.Foreground
                gapContent={
                    <Card style={styles.pregnancyCard}>
                        <Text style={styles.pregnancyText}>30 weeks 5 days</Text>
                    </Card>
                }
            >
                <View style={styles.features}>
                    <Card>
                        <Text>HOSPITAL</Text>
                    </Card>
                    <Card>
                        <Text>DOCTORS</Text>
                    </Card>
                    <Card>
                        <Text>APPOINTMENTS</Text>
                    </Card>
                </View>
                <View style={styles.features}>
                    <Card>
                        <Text>MEDICATIONS</Text>
                    </Card>
                    <Card>
                        <Text>SYMPTOMS</Text>
                    </Card>
                    <Card>
                        <Text>RECOMMENDATIONS</Text>
                    </Card>
                </View>
                <View style={styles.features}>
                    <Card>
                        <Text>ATTACHMENTS</Text>
                    </Card>
                    <Card>
                        <Text>ACTIVITIES</Text>
                    </Card>
                    <Card>
                        <Text>FOOD</Text>
                    </Card>
                </View>
                <View style={styles.features}>
                    <Card>
                        <Text>BABY METRICS</Text>
                    </Card>
                    <Card>
                        <Text>MOTHER METRICS</Text>
                    </Card>
                    <Card>
                        <Text>REPORTS</Text>
                    </Card>
                </View>
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
        width: 120,
        height: 80,
    },
    fastCardDescription: {
        fontSize: 10,
        color: '#8e44ad',
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    fastCardValue: {
        fontSize: 22,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    pregnancyCard: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pregnancyText: { color: '#8e44ad', fontSize: 20, fontWeight: '700', textTransform: 'uppercase' },
    features: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
        paddingHorizontal: 8
    }
});