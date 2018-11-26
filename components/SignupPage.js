import React, {Component} from 'react';
import {View,Text, TextInput, StyleSheet, Button } from "react-native";
import firebase from 'react-native-firebase';

export default class SignupPage extends Component{
    constructor(props) {
	super(props);
	//console.log("Inside constructor of SignupPage. Below is the props passed from the last page");
	//console.log(this.props.navigation.state.params);

	this.unsubscriber = null;	//this is the listener for authentication. Idk why this isn't in the state, but reference I used did it this way
	this.state = {
	    user: null,
	    email: '',
	    password: ''
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
		console.log("Executing navigation switch to new component (UserMap)");
		this.props.navigation.navigate('Home', { user: user });
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

    onPressSignUp = () => {
	console.log('Sign up pressed');

	//check strings are not empty. Firebase function will give an error saying string is empty, but it won't tell you which string (id or pw) is empty
	//so check it ourselves and give the message
	if(this.state.email === "") {
	    Alert.alert("Error: Email field is empty");
	}
	else if(this.state.password === "") {
	    Alert.alert("Error: Password field is empty");
	}
        else {
	    console.log("Got inside the last else statement inside onPressSignup()");
	    firebase
		.auth()
		.createUserWithEmailAndPassword(this.state.email, this.state.password)
		.then(() => console.log("successfully signed up"))
		.catch(e => console.log(e.message));
        }
    }
    
    render(){
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
		    onPress={this.onPressSignUp}
		    title="SignUp"
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
