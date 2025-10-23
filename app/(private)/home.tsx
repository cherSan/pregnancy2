import {Text} from "react-native";
import {Page} from "@/components/page";

export const PrivateHome = () => {
    return (
        <Page>
            <Page.Header>Step1</Page.Header>
            <Page.Content>
                <Text>Home</Text>
            </Page.Content>
            <Page.Foreground gapContent={<Text>ForegroundGAP</Text>}>
                <Text>Foreground</Text>
            </Page.Foreground>
        </Page>
    );
};

PrivateHome.displayName = "PrivateHome";

export default PrivateHome;