import React, {Component} from 'react';
import {View,Text, TextInput, StyleSheet, Button, Alert} from "react-native";
import { RoundButton } from 'react-native-button-component';
import { material, materialColors, systemWeights } from 'react-native-typography';
import firebase from 'react-native-firebase';

export default class SignupPage extends Component{
	static navigationOptions = {
        title: 'Sign Up',
    };

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
				console.log("Inside componentDidMount()'s callback function of SignUpPage. Below is the user");
				console.log(user);
				console.log("Below is the unsubscriber");
				console.log(this.unsubscriber);
				this.setState({'user':user});
				user.getIdToken().then(function(idToken) {  // <------ Check this line
				    console.log("Authentication token is: " + idToken); // It shows the Firebase token now
				});
				console.log("Going back to the Settings page");
				this.props.navigation.goBack();
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
		console.log("Inside componentWillUnmount() of SignUpPage");
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
			.catch(e => {
				console.log(e.message);
				Alert.alert(e.message);
			});
        }
    }
    
    render(){
        return (
		    <View style={styles.container}>
				<Text style={styles.text}>Please enter the necessary information in order to sign up.</Text>
				<TextInput
				    style={styles.textInput}
				    onChangeText={text => this.setState({"email": text})}
				    placeholder={'email'}
				    keyboardType="email-address"
				/>
				<TextInput
				    style={styles.textInput}
				    onChangeText={text => this.setState({"password": text})}
				    placeholder={'password'}
				    secureTextEntry={true}
				/>
				<RoundButton 
                    style = {styles.button}
                    type="primary"
                    text="Sign Up"
                    textStyle= {styles.buttonTextFont}
                    backgroundColors={['#2193b0', '#6dd5ed']}
                    gradientStart={{ x: 0.5, y: 1 }}
                    gradientEnd={{ x: 1, y: 1 }}
                    onPress={this.onPressSignUp} />
		    </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //	backgroundColor: '#F5FCFF',
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
  textInput: {
	height: 40,
	width: 200, 
	borderColor: 'gray', 
	borderWidth: 1,
	marginTop: 4,
  },
  button: {
	//margin: 10,
	height: 50,
	width: 150,
	marginTop: 8,
	marginLeft: 6,
	marginRight: 6,
  },
  text: {
  	textAlign: 'center',
  }
});
