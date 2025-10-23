import {FC} from "react";
import {StyleSheet, View} from "react-native";
import {HEADER_HEIGHT, ROUNDED} from "@/components/page/page.const";
import {PageTitle} from "@/components/page-title";
import {useSafeAreaInsets} from "react-native-safe-area-context";

type Props = { children: string };

export const Header: FC<Props> = ({ children }) => {
    const safeArea = useSafeAreaInsets();
    return (
        <View style={[
            styles.header,
            {
                height: HEADER_HEIGHT + safeArea.top,
                paddingTop: safeArea.top,
                paddingLeft: safeArea.left,
                paddingRight: safeArea.right,
            }
        ]}>
            <PageTitle>
                {children}
            </PageTitle>
        </View>
    );
};
const styles = StyleSheet.create({
    header: {
        backgroundColor: "#fff",
        borderBottomLeftRadius: ROUNDED,
        borderBottomRightRadius: ROUNDED,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 20,
        shadowOffset: {
            width: 0,
            height: -5,
        },
        elevation: 10,
    },
});