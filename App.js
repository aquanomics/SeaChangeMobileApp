/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, Button} from 'react-native';
import firebase from 'react-native-firebase';
import Login from './Login.js'; 
import Main from './Main.js'; 

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
	'Double tap R on your keyboard to reload,\n' +
	'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
    constructor() {
	super();
	this.unsubscriber = null;
	this.state = {
	    user: null,
	};
    }

    /**
     * When the App component mounts, we listen for any authentication
     * state changes in Firebase.
     * Once subscribed, the 'user' parameter will either be null 
     * (logged out) or an Object (logged in)
     */
    componentDidMount() {
	this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
	    if(user) {
		console.log("Inside componentDidMount()'s callback function. Below is the user");
		console.log(user);
		console.log("Below is the unsubscriber");
		console.log(this.unsubscriber);
		this.setState({'user':user});
		user.getIdToken().then(function(idToken) {  // <------ Check this line
		    console.log("Authentication token is: " + idToken); // It shows the Firebase token now
		});
	    } else {
		console.log('not logged in');
		this.setState({user: null});
	    }
	});
    }
    /**
     * Don't forget to stop listening for authentication state changes
     * when the component unmounts.
     */
    componentWillUnmount() {
	console.log("Inside componentWillUnmount()");
	if (this.unsubscriber) {
	    this.unsubscriber();
	}
    }

    render() {
	//if logged in, redirect to main page
	if(this.state.user) {
	    return (
	        <Main />
	    );
	}

	//redirect to log in page
	return (
	    <Login />
	);
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
