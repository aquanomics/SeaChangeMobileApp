import React, {Component} from "react";
import {View,Text, StyleSheet, Button, Alert } from "react-native";
import firebase from 'react-native-firebase';

import ModalDropdown from 'react-native-modal-dropdown';
const DEMO_OPTIONS_1 = ['TopStories', 'Canada', 'World'];

export default class SettingsPage extends Component{
    constructor(props) {
	super(props);
	console.log("Inside constructor of SettingsPage. Below is the props passed from the last page");
	console.log(this.props.navigation.state.params);
    }

    static navigationOptions = {
	headerRight: (
		<ModalDropdown options={DEMO_OPTIONS_1}
	    	onSelect={(idx, value) => alert("index of " + idx + " and value of " + value + "has been chosen")}
		/>
	),
    };

    signOut = () => {
	//firebase.auth().signOut();
	//this.props.navigation.navigate('Login');
    }
    
    render(){
        return (
            <View style={styles.placeholder}>
                <Text>Settings Screen</Text>
		<Button
	    	    onPress={this.signOut}
	    	    title="Sign Out"
	    	/>
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
