import React, { Component } from 'react';
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { RoundButton } from 'react-native-button-component';
import { material, materialColors, systemWeights } from 'react-native-typography';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {RkTextInput} from 'react-native-ui-kitten';
import Dialog, {DialogTitle, ScaleAnimation, DialogFooter, DialogButton} from 'react-native-popup-dialog';
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
			buttonSignUpState: 'signUp',
			displayDialog: false,
			dialogText: '',
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
		if (this.unsubscriber) 
			this.unsubscriber();
    }

		//TODO: NEED TO REMOVE console logs and REFACTOR AND CLEAN UP CODE.!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    onPressSignUp = () => {
		console.log('Sign up pressed');

		//check strings are not empty. Firebase function will give an error saying string is empty, but it won't tell you which string (id or pw) is empty
		//so check it ourselves and give the message

		//add missing fields to the temporary array
		var missingArr = [];
		this.state.email.length == 0 ? missingArr.push('email') : null;
		this.state.username.length == 0 ? missingArr.push('username') : null;
		this.state.password.length == 0 ? missingArr.push('password') : null;

		if(missingArr.length > 0) {	//if there are any missing fields, notify them to the user
			var missingStr = missingArr.join(', ');
			var errorStr = `Error: ${missingStr} ${missingArr.length == 1 ? "field is" : "fields are"} empty`;
			this.setState({buttonSignUpState: 'signUp', displayDialog: true, dialogText: errorStr});
		} else {
			fetch(urlUsernameCheck+`?username=${this.state.username}`)
				.then(response => {		//1st then
					//invalid checking
					if(response.status != 200)
						throw({'message': `Internal server error! Error code ${response.status}`});
					else
						return response.json();
				})
				.then(response => {		//2nd then
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
					//check for invalid
					if(response.status != 200) {
						this.setState({ buttonSignUpState: 'signUp' });
						throw({'message': `Internal server error! Error code ${response.status}`});
					}
					//if it's 200, then user creation is successful
					this.setState({ buttonSignUpState: 'signUp' });
					this.props.navigation.goBack();
					this.registeredOnFirebase = false;	//reset the flag
				})
				.catch(error => {   
					//external and internal server error
					//Note: You can test this by turning off your internet and pressing the button
					var extraErrorStr = '';
					if(this.registeredOnFirebase) {
						firebase.auth().currentUser.delete()
						.then(() => {
							console.log("User deletion successful!");
						})
						.catch(() => {	//THIS IS A VERY RARE OCCASION
							extraErrorStr = `\nError: Corrupted user data deletion FAILED`;
						})
					}
					this.registeredOnFirebase = false;	//reset the flag
					this.setState({
						buttonSignUpState: 'signUp',
						displayDialog: true, 
						dialogText: `Error: ${error.message}${extraErrorStr}`
					});
				});
		}
    }
    
    render(){
        return (
			<ImageBackground source={require('../img/backgrounds/sea-background.png')} style={styles.backgroundImage} >
				<View style={styles.container}>
					<Text style={styles.boldTitleText}>Please enter the necessary information to sign up</Text>
					<View style={styles.textInputContainer}>
						<RkTextInput 
	                        rkType="topLabel" 
	                        label="Username"
	                        style={styles.textInput}
	                        labelStyle={{color: '#D5DBDB'}}
	                        inputStyle={{color: '#F4F6F6'}}
	                        autoCapitalize={'none'}
	                        autoCorrect={false}
							onChangeText={text => this.setState({username: text})}
	                    />
	                    <RkTextInput 
	                        rkType="topLabel" 
	                        label="Email Address"
	                        style={styles.textInput}
	                        labelStyle={{color: '#D5DBDB'}}
	                        inputStyle={{color: '#F4F6F6'}}
	                        autoCapitalize={'none'}
							autoCorrect={false}
							onChangeText={text => this.setState({email: text})}
	                    />
	                    <RkTextInput 
	                        rkType="topLabel" 
	                        label="Password"
	                        style={styles.textInput}
	                        labelStyle={{color: '#D5DBDB'}}
	                        inputStyle={{color: '#F4F6F6'}}
	                        autoCapitalize={'none'}
							autoCorrect={false}
							secureTextEntry={true}
							onChangeText={text => this.setState({password: text})}
	                    />
                    </View>
					<RoundButton 
						style = {styles.button}
						buttonState={this.state.buttonSignUpState}
						textStyle= {styles.buttonTextFont}
						gradientStart={{ x: 0.5, y: 1 }}
						gradientEnd={{ x: 1, y: 1 }}
						states={{
							signUp: {
								text: 'Sign Up',
								backgroundColors: ['#58D68D', '#58D68D'],
								onPress: () => {
									this.setState({ buttonSignUpState: 'signingUp' });
									this.onPressSignUp();
								},
							},
							signingUp: {
								text: 'Signing up...',
								gradientStart: { x: 0.8, y: 1 },
								gradientEnd: { x: 1, y: 1 },
								backgroundColors: ['#FF416C', '#FF4B2B'],
								spinner: true,
								onPress: () => {},
							},
						}} 
					/>
					<Dialog
		                onTouchOutside={() => this.setState({ displayDialog: false })}
		                width={0.9}
		                visible={this.state.displayDialog}
		                dialogAnimation={new ScaleAnimation()}
		                dialogTitle={
		                    <DialogTitle
		                        title={this.state.dialogText}
		                        hasTitleBar={false}
		                    />}
		                footer={
		                    <DialogFooter>
		                        <DialogButton
		                            text="Ok"
		                            onPress={() => this.setState({ displayDialog: false })}
		                        />
		                    </DialogFooter>
		                }     
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
	textInputContainer: {
		marginVertical: 25,
	},
	textInput: {
        height: 60,
        width: 325,
        borderBottomColor: 'white',
        borderBottomWidth: 1,
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
		marginRight: 15,
		marginLeft: 15,
		color: materialColors.whitePrimary,
	},
});
