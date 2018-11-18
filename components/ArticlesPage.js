import React, {Component} from "react";
import {View,Text, StyleSheet } from "react-native";

export default class ArticlesPage extends Component{
    render(){
        return (
            <View style={styles.placeholder}>
                <Text>Article Screen</Text>
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
