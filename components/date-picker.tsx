import { List, DatePicker as AntDatePicker } from "@ant-design/react-native";
import React, {ComponentProps, FC} from "react";
import {StyleSheet} from "react-native";

export const DatePicker: FC<Partial<ComponentProps<typeof AntDatePicker>>> = ({
    title, ...props
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
            <List.Item arrow="horizontal">
                {title}
            </List.Item>
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
        backgroundColor: '#2E0854',
        elevation: 10,
    },
    actionText: {
        color: '#ccc',
    },
    title: {
        color: '#B59FFF'
    },
    itemActiveStyle: {
        color: '#2E0854',
        fontSize: 18,
        fontWeight: '700',
    },
    controlOk: {
        color: '#6AC191',
    },
    controlCancel: {
        color: '#FF3B30',
    }
});