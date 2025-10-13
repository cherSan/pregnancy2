import {FC, ReactNode} from "react";
import {StyleSheet, View} from "react-native";
import {HEADER_HEIGHT} from "@/components/page/page.const";

type Props = { children: ReactNode };

export const Header: FC<Props> = ({ children }) => <View style={styles.header}>{children}</View>

const styles = StyleSheet.create({
    header: {
        height: HEADER_HEIGHT
    },
});