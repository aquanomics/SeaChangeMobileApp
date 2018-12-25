import React, {Component} from "react";
import {View,Text, StyleSheet, Button } from "react-native";
import firebase from 'react-native-firebase';

export default class SettingsPage extends Component{
    constructor(props) {
	super(props);
	console.log("Inside constructor of SettingsPage. Below is the props passed from the last page");
	console.log(this.props.navigation.state.params);
    }

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
