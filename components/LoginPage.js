import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, Button, Alert} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Sae } from 'react-native-textinput-effects';
import firebase from 'react-native-firebase';

export default class LoginPage extends Component {
    static navigationOptions = {
		header: null
    };

    constructor(props) {
			super(props);
			console.log("Inside constructor of Login. Below is the props passed to it");
			console.log(props);

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
		//TODO: NEED TO REMOVE console logs.!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    componentDidMount() {
		this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
		    if(user) {
				console.log("AuthStateChanged Iiside componentDidMount()'s callback function. Below is the user");
				console.log(user);
				console.log("Below is the unsubscribe");
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

    onPressLogIn = () => {
			console.log('Login pressed');
			console.log("this.state.email is: " + this.state.email);

			//check strings are not empty. Firebase function will give an error saying string is empty, but it won't tell you which string (id or pw) is empty
			//so check it ourselves and give the message
			if(this.state.email === "") {
					Alert.alert("Error: Email field is empty");
			}
			else if(this.state.password === "") {
					Alert.alert("Error: Password field is empty");
			}
			else {
				console.log("Got inside the last else statement inside onPressLogIn()");
				firebase
					.auth()
					.signInWithEmailAndPassword(this.state.email, this.state.password)
					.then(() => console.log("Successfully logged in"))
					.catch((e) => { Alert.alert(e.message); });
				}
    }

    onPressSignUp = () => {
			console.log("SignUp pressed");
			this.props.navigation.navigate('Signup');
    }

    render() {
		console.log("this.state inside Login component render() is below");
		console.log(this.state);
		return (
		    <View style={styles.container}>
					<Text>Testing</Text>
					<Sae
						label={'Email Address'}
						iconClass={FontAwesomeIcon}
						iconName={'pencil'}
						iconColor={'white'}
						inputPadding={16}
						labelHeight={24}
						borderHeight={2}
						autoCapitalize={'none'}
						autoCorrect={false}
						onChangeText = {text => this.setState({"email":text})}
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
