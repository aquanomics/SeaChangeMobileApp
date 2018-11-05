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
	    email: '',
	    password: ''
	};

	//explicitly bind the callback handlers
	this.onPressLogIn = this.onPressLogIn.bind(this);
	this.onPressSignUp = this.onPressSignUp.bind(this);
	this.onPressLogOut = this.onPressLogOut.bind(this);

	firebase.auth().onAuthStateChanged(user => {
	    if(user) {
		console.log(user);
		this.setState({'user':user});
	    } else {
		console.log('not logged in');
	    }
	});
    }

    /**
    * Listen for any auth state changes and update component state
    */
    componentDidMount() {
	this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
	    this.setState({ user });
	});
    }

    componentWillUnmount() {
	if (this.unsubscriber) {
	    this.unsubscriber();
	}
    }

    onPressLogIn() {
	console.log('Login pressed');
	firebase
	    .auth()
	    .signInWithEmailAndPassword(this.state.email, this.state.password)
	    .then(() => console.log("successfully logged on"))
	    .catch(e => console.log(e.message));
	console.log('Got here');
    }

    onPressSignUp() {
	//console.log(this.state);
	console.log('Sign up pressed');
	firebase
	    .auth()
	    .createUserWithEmailAndPassword(this.state.email, this.state.password)
	    .then(() => console.log("successfully signed up"))
	    .catch(e => console.log(e.message));
	console.log('Got here');
    }

    onPressLogOut() {
	console.log('LogOut pressed');
    }

    render() {
	//if (!this.state.user) {
	//}
//	console.log(firebase);
	console.log(this.state);
	return (
	    <View style={styles.container}>
		<Text>Testing</Text>
		<TextInput
		    style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 1}}
		    onChangeText={text => this.setState({"email":text})}
		    placeholder={'email'}
		/>
		<TextInput
		    style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 1}}
		    onChangeText={text => this.setState({"password":text})}
		    placeholder={'password'}
		/>
		<Button
		    onPress={this.onPressLogIn}
		    title="Login"
		    color="#841584"
		/>
		<Button
		    onPress={this.onPressSignUp}
		    title="SignUp"
		    color="#841584"
		/>
		<Button
		    onPress={this.onPressLogOut}
		    title="LogOut"
		    color="#841584"
		/>
	    </View>
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
