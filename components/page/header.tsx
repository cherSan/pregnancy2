import {FC, ReactNode} from "react";
import {StyleSheet, View} from "react-native";
import {HEADER_HEIGHT} from "@/components/page/page.const";
import {PageTitle} from "@/components/page-title";

type Props = { children: string };

export const Header: FC<Props> = ({ children }) => (
    <View style={styles.header}>
        <PageTitle>
            {children}
        </PageTitle>
    </View>
);

const styles = StyleSheet.create({
    header: {
        height: HEADER_HEIGHT
    },
});