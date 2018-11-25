import React, {Component} from "react";
import {View,Text, StyleSheet } from "react-native";

export default class EventsPage extends Component{
    render(){
        return (
            <View style={styles.placeholder}>
                <Text>Events Screen</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    placeholder: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});