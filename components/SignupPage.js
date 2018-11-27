import React, {Component} from 'react';
import {View,Text, TextInput, StyleSheet, Button, Image, Alert } from "react-native";
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
	    password: '',
	    name: ''
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
		firebase.auth().currentUser.updateProfile({displayName: this.state.name, photoURL: null})
		    .then( () => {
			console.log("Updating name in firebase authentication db successful");
			console.log("Below is the new user object. It should contain a displayName field");
			console.log(firebase.auth().currentUser);
			console.log("Executing navigation switch to new component (UserMap)");
			this.setState({'user': firebase.auth().currentUser});

			//CHANGE SCREEN HERE
			this.props.navigation.navigate('Home');
		    })
		    .catch( () => console.log("Updating name failed"));
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
	else if(this.state.name === "") {
	    Alert.alert("Error: Name field is empty");
	}
        else {
	    console.log("Got inside the last else statement inside onPressSignup()");
	    firebase
		.auth()
		.createUserWithEmailAndPassword(this.state.email, this.state.password)
		.then(() => console.log("successfully signed up with email and password. Now update the name in the firebase auth db"))
		.catch(e => console.log(e.message));
        }
    }
    
    render(){
	console.log("this.state inside Login component render() is below");
	console.log(this.state);
        return (
	    <View style={styles.container}>
		<Image
		    source={require('./ocp-blue-main-logo.png')}
		/>
		<Text
                    style= {{color:"#00008b" , fontSize: 30}}
                        >
                Aquanomics
                </Text>
		<View style={{margin: 30}}>	
			<TextInput
			    style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 1}}
			    onChangeText={text => this.setState({"name":text})}
			    placeholder={'name'}
			/>
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
		</View>
		<View style={{margin: 10}}>
			<Button
			    onPress={this.onPressSignUp}
			    title="SignUp"
			    color="#841584"
			/>
		</View>
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
