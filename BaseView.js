import React from 'react';
import { View, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { COLORS } from './src/utils/constants';

export default function BaseView(props) {
    return (
        <>
            <SafeAreaView style={{ ...styles.topSafeArea, ...props.topView }} />
            <SafeAreaView
                style={[{ flex: 1, backgroundColor: '#fff' }, props.safeView]}>
                <StatusBar
                    translucent={false}
                    backgroundColor={
                        props.statusBarColor ? props.statusBarColor : COLORS.white
                    }
                    barStyle="dark-content"
                />

                <View style={{ ...styles.parentView, ...props.baseViewStyle }}>
                    {props.children}
                </View>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    topSafeArea: {
        flex: 0,
        backgroundColor: '#fff',
    },
    safeAreaView: {
        flex: 1,
        backgroundColor: '#fff',
    },
    parentView: {
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboard: {
        flexGrow: 1,
    },
});
