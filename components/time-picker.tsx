import React, {ComponentProps, FC, useMemo} from "react";
import {List, Picker} from "@ant-design/react-native";
import {StyleSheet} from "react-native";

type Props = Partial<ComponentProps<typeof Picker>> & {
    onChange?: (value: [number, number]) => void;
}

export const TimePicker: FC<Props> = ({ title, ...props }) => {
    const hours = useMemo(() => (
        Array.from({ length: 24 }, (_, value) => {
            const label = `${value}`.padStart(2, '0')
            return { label, value }
        })
    ), [])

    const minutes = useMemo(() => (
        Array.from({ length: 60 }, (_, value) => {
            const label = `${value}`.padStart(2, '0')
            return { label, value }
        })
    ), []);

    const initialValue = useMemo(() => {
        const date = new Date();
        return [date.getHours(), date.getMinutes()];
    }, []);

    return (
        <Picker
            {...props}
            data={[
                hours,
                minutes,
            ]}
            cols={2}
            cascade={false}
            itemHeight={40}
            defaultValue={initialValue}
            styles={{
                container: styles.container,
                header: styles.header,
                actionText: styles.actionText,
                itemActiveStyle: styles.itemActiveStyle,
                okText: styles.controlOk,
                dismissText: styles.controlCancel,
                title: styles.title,
            }}
            title={title}
            format={(labels) => labels.join(':')}
        >
            <List.Item arrow="horizontal">
                {title}
            </List.Item>
        </Picker>
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