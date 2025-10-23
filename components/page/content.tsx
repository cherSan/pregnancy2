import {FC, ReactNode} from "react";
import {ScrollView} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
export const PageContent: FC<{ children: ReactNode }> = ({ children }) => {
    const safeArea = useSafeAreaInsets();
    return (
        <ScrollView
            style={{
                paddingTop: safeArea.top,
                paddingLeft: safeArea.left,
                paddingBottom: safeArea.bottom,
                paddingRight: safeArea.right
            }}
        >
            { children }
        </ScrollView>
    );
};