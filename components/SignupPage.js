import React, {Component} from 'react';
import {View,Text, TextInput, StyleSheet, Button, Alert} from "react-native";
import { RoundButton } from 'react-native-button-component';
import { material, materialColors, systemWeights } from 'react-native-typography';
import firebase from 'react-native-firebase';

const urlUsernameCheck = "http://seachange.ca-central-1.elasticbeanstalk.com/users/checkUsername";
const urlUserRegister = "http://seachange.ca-central-1.elasticbeanstalk.com/users/register"; //for our db, not firebase

export default class SignupPage extends Component{
	static navigationOptions = {
        title: 'Sign Up',
    };

    constructor(props) {
		super(props);
		//console.log("Inside constructor of SignupPage. Below is the props passed from the last page");
		//console.log(this.props.navigation.state.params);

		this.registeredOnFirebase = false;
		this.unsubscriber = null;	//this is the listener for authentication. Idk why this isn't in the state, but reference I used did it this way
		this.state = {
		    user: null,
		    email: '',
		    password: '',
		    username: '',
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
				this.setState({'user':user});
				// user.getIdToken().then(function(idToken) {  // <------ Check this line
				//     console.log("Authentication token is: " + idToken); // It shows the Firebase token now
				// });
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
		    fetch(urlUsernameCheck+`?username=${this.state.username}`)
		    .then(response => {		//1st then
		    	console.log("Inside first then chain");
            	//invalid checking
                if(response.status != 200)
                    throw({'message': `Internal server error! Error code ${response.status}`});
                else
                	return response.json();
		    })
            .then(response => {		//2nd then
            	console.log("Inside second then chain");
            	//invalid checking
            	if(response.Users.length != 0) {
					throw({'message': `Username already exists\nPick a different username`});
                }

                //username must now be valid
                return firebase
				.auth()
				.createUserWithEmailAndPassword(this.state.email, this.state.password);
            })
        	.then(() => {	//3rd then
        		this.registeredOnFirebase = true;
        		console.log("Inside second then chain");
        		return firebase.auth().currentUser.getIdToken();
        	})	
        	.then((idToken) => {					//4th then
        		console.log("Inside third then chain");
				return fetch(urlUserRegister, {
	                method: "POST",
	                body: JSON.stringify({
	                    uid: firebase.auth().currentUser.uid,
	                    username: this.state.username,
	                    'idToken': idToken,
	                }),
	                headers: {
	                    "Content-Type": "application/json"
	                }
          		});
        	})
        	.then(response => {					//5th then
        		console.log("Inside fourth then chain");
        		//check for invalid
        		if(response.status != 200) {
                    throw({'message': `Internal server error! Error code ${response.status}`});
                    // this.setState({ buttonUploadState: 'upload', failUploadDialog: true, errorDialogMessage: "internal server error" });
                }

                //if it's 200, then user creation is successful
        		console.log("Going back to the Settings page");
				this.props.navigation.goBack();
				this.registeredOnFirebase = false;	//reset the flag
        	})
            .catch(error => {   //external and internal server error
            	if(this.registeredOnFirebase) {
            		firebase.auth().currentUser.delete()
            		.then(() => {
            			console.log("User deletion successful!");
            		})
            		.catch(() => {	//THIS IS A VERY RARE OCCASION
            			console.log("User deletion FAILED");
            			Alert.alert("User deletion FAILED");
            		})
            	}
            	this.registeredOnFirebase = false;	//reset the flag
	            console.log(error.message);
				Alert.alert(error.message);
            });
        }
    }
    
    render(){
        return (
		    <View style={styles.container}>
				<Text style={styles.text}>Please enter the necessary information in order to sign up.</Text>
				<TextInput
				    style={styles.textInput}
				    onChangeText={text => this.setState({"username": text})}
				    placeholder={'username'}
				/>
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
