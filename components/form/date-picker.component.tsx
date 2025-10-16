import { DatePicker as AntDatePicker } from "@ant-design/react-native";
import React, {ComponentProps, FC} from "react";
import {StyleSheet} from "react-native";
import { List } from "../list";
import {purpleTheme} from "@/theme/main";

type Props = Partial<ComponentProps<typeof AntDatePicker>> & {
    title?: string;
}

export const DatePicker: FC<Props> = ({
    title,
    ...props
}) => {
    return (
        <AntDatePicker
            precision={'day'}
            title={title}
            minDate={new Date(1950, 0, 1)}
            maxDate={new Date(2100, 11, 31)}
            {...props}
            styles={{
                container: styles.container,
                header: styles.header,
                actionText: styles.actionText,
                itemActiveStyle: styles.itemActiveStyle,
                okText: styles.controlOk,
                dismissText: styles.controlCancel,
                title: styles.title,
            }}
        >
            <List.Item arrow={true} title={title} />
        </AntDatePicker>
    )
}

const styles = StyleSheet.create({
    container: {
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        elevation: 6,
        backgroundColor: 'transparent',
        overflow: 'hidden',
    },
    header: {
        borderBottomWidth: 1,
        backgroundColor: purpleTheme.brand_primary_tap,
        elevation: 10,
    },
    actionText: {
        color: '#ccc',
    },
    title: {
        color: '#B59FFF'
    },
    itemActiveStyle: {
        color: purpleTheme.color_text_base,
        fontSize: 18,
        fontWeight: '700',
    },
    controlOk: {
        color: purpleTheme.brand_success,
    },
    controlCancel: {
        color: purpleTheme.brand_error,
    }
});