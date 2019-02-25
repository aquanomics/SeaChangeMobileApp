import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, ImageBackground } from "react-native";
import { RoundButton } from 'react-native-button-component';
import { material, materialColors, systemWeights } from 'react-native-typography';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Sae } from 'react-native-textinput-effects';
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
		 //TODO: NEED TO REMOVE console logs.!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
			if (this.unsubscriber) this.unsubscriber();
    }

		//TODO: NEED TO REMOVE console logs and REFACTOR AND CLEAN UP CODE.!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    onPressSignUp = () => {
			console.log('Sign up pressed');

			//check strings are not empty. Firebase function will give an error saying string is empty, but it won't tell you which string (id or pw) is empty
			//so check it ourselves and give the message
			if(this.state.email === "") {
					Alert.alert("Error: Email field is empty");
			} else if(this.state.password === "") {
					Alert.alert("Error: Password field is empty");
			} else {
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
				<ImageBackground source={require('../img/backgrounds/sea-background.png')} style={styles.backgroundImage} >
					<View style={styles.container}>
						<Text style={styles.boldTitleText}>Enter the necessary information to sign up</Text>
						<Sae
								style={styles.textInput}
								label={'Username'}
								iconClass={FontAwesomeIcon}
								iconName={'pencil'}
								iconColor={'#D5DBDB'}
								labelStyle={{ color: '#D5DBDB' }}
								inputStyle={{ color: '#F4F6F6' }}
								inputPadding={16}
								labelHeight={24}
								borderHeight={2}
								autoCapitalize={'none'}
								autoCorrect={false}
								onChangeText={text => this.setState({"username": text})}
						/>
						<Sae
								style={styles.textInput}
								label={'Email Address'}
								iconClass={FontAwesomeIcon}
								iconName={'pencil'}
								iconColor={'#D5DBDB'}
								labelStyle={{ color: '#D5DBDB' }}
								inputStyle={{ color: '#F4F6F6' }}
								inputPadding={16}
								labelHeight={24}
								borderHeight={2}
								autoCapitalize={'none'}
								autoCorrect={false}
								onChangeText={text => this.setState({"email": text})}
						/>
						<Sae
								style={styles.textInput}
								label={'Password'}
								iconClass={FontAwesomeIcon}
								iconName={'pencil'}
								iconColor={'#D5DBDB'}
								labelStyle={{ color: '#D5DBDB' }}
								inputStyle={{ color: '#F4F6F6' }}
								inputPadding={16}
								labelHeight={24}
								borderHeight={2}
								autoCapitalize={'none'}
								autoCorrect={false}
								secureTextEntry={true}
								onChangeText={text => this.setState({"password": text})}
						/>
						<RoundButton 
								style = {styles.button}
								type="primary"
								text="Sign Up"
								textStyle= {styles.buttonTextFont}
								backgroundColors={['#58D68D', '#58D68D']}
								gradientStart={{ x: 0.5, y: 1 }}
								gradientEnd={{ x: 1, y: 1 }}
								onPress={this.onPressSignUp} 
						/>
					</View>
		    </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
  container: {
		backgroundColor: 'rgba(0,0,0,0.4)',
		flex: 1,
		alignItems: 'center',
		resizeMode: 'cover',
		justifyContent: 'center',
	},
	backgroundImage: {
		flex: 1,
		resizeMode: 'cover',
	},
  textInput: {
		margin: 10,
    height: 60,
    width: 350,
  },
  button: {
		margin: 18,
		height: 50,
		width: 300,
	},
	buttonTextFont: {
		...material.button,
		...systemWeights.light,
		color: materialColors.whitePrimary,
		fontSize: 17,
		textAlign: 'center',
	},
	boldTitleText: {
		...material.titleObject,
		...systemWeights.bold,
		fontSize: 20,
		marginTop: 15,
		color: materialColors.whitePrimary,
	},
});
