import React, { Component } from "react";
import { StyleSheet, Image, Text, View, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import { RoundButton } from 'react-native-button-component';
import { material, materialColors, systemWeights } from 'react-native-typography';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {RkTextInput} from 'react-native-ui-kitten';
import Dialog, {DialogTitle, ScaleAnimation, DialogFooter, DialogButton} from 'react-native-popup-dialog';
import firebase from 'react-native-firebase';

export default class ProfilePage extends Component{
    static navigationOptions = {
        title: 'Profile',
    };

    constructor(props) {
    	super(props);


        //Purpose of logic below: if you want pop up Dialog from the start by providing props a message and a boolean.
        //Application: ArticlePost.js uses this functionality in case the user is signed out due to inactivity
        //I use if and else because you can do if(object) to evaluate true, but can't do object ? true : false.
        //Note: This logic below has been manually tested
        var externalDisplayDialog = this.props.navigation.getParam('externalDisplayDialog', undefined);
        if(externalDisplayDialog)
            externalDisplayDialog = true;
        else
            externalDisplayDialog = false;

        this.state = {
            user: null,
            email: '',
            password: '',
            displayDialog: externalDisplayDialog,   //if props is not given, this will be false by default
            dialogText: externalDisplayDialog ? this.props.navigation.getParam('externalDialogText') : '',
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
                console.log("Inside componentDidMount()'s AuthStateChanged callback function. Below is the user");
                console.log(user);
                console.log("Retrieving uid of user");
                console.log(user.uid);

                //Setting the state for user object may seem unnecessary because we can use firebase.auth().currentUser;
                //however, in render() comment section, it explains why we need this
                this.setState({'user': user});
                // console.log("Executing navigation switch to new component (UserMap)");
                // this.props.navigation.navigate('Home', { user: user });
            } else {
                console.log("Inside componentDidMount()'s AuthStateChanged callback function. Not logged in");
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

        //check strings are not empty. Firebase function will give an error saying string is empty, 
        //but it won't tell you which string (id or pw) is empty so check it ourselves and give the message

        //add missing fields to the temporary array
        var missingArr = [];
        this.state.email.length == 0 ? missingArr.push('email') : null;
        this.state.password.length == 0 ? missingArr.push('password') : null;

        if(missingArr.length > 0) { //if there are any missing fields, notify them to the user
            var missingStr = missingArr.join(' and ');
            var errorStr = `Error: ${missingStr} ${missingArr.length == 1 ? "field is" : "fields are"} empty`;
            this.setState({displayDialog: true, dialogText: errorStr});
        } else {
            console.log("Got inside the last else statement inside onPressLogIn()");
            firebase
                .auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(() => console.log("successfully logged on"))
                .catch((e) => {
                    console.log(e.message);
                    this.setState({displayDialog: true, dialogText: e.message});
                });
        }
    }

    onPressSignOut = () => {
    	firebase.auth().signOut();
    }

    onPressSignUp = () => {
        this.props.navigation.navigate('Signup', {});
    }

    onPressForgotPassword = () => {
        this.props.navigation.navigate('ForgotPassword', {});   
    }

    emailTextHandler = (text) => {
        this.setState({"email":text});
    }

    passwordTextHandler = (text) => {
        this.setState({"password":text});
    }
 
    render(){
        return (
            <View style={styles.myContainer}>
                <DisplayAccountInfo
                    user={this.state.user}
                    onPressLogIn={this.onPressLogIn}
                    onPressSignUp={this.onPressSignUp}
                    onPressSignOut={this.onPressSignOut}
                    onPressForgotPassword={this.onPressForgotPassword}
                    emailTextHandler={this.emailTextHandler}
                    passwordTextHandler={this.passwordTextHandler}
                />
                <Dialog
                    onTouchOutside={() => this.setState({ displayDialog: false, dialogText: '' })}
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
                                onPress={() => this.setState({ displayDialog: false, dialogText: '' })}
                            />
                        </DialogFooter>
                    }     
                />
            </View>
        );
    }
}

function DisplayAccountInfo(props) {

    //if props is given from an external page to display dialog, display it
    //For now, this option can be set by the ArticlePost.js page
    //WARNING: I already tried using if(!firebase.auth().currentUser), but even after successfully logging in
    //and after auth().currentUser changes, render() doesn't recognize the change in auth().currentUser.
    //Therefore, we need the state to dynamically render this page.

    //HOWEVER, using the if(!firebase.auth().currentUser), if I were to go back to the userMap and come back to 
    //this page, then the render()'s conditional would properly work.
    //In short, when using if(!firebase.auth().currentUser) inside render(), the conditional is only evaluated once

    //if user is not signed in yet
    if(!props.user) {
        return (
            <ImageBackground source={require('../img/backgrounds/sea-background.png')} style={styles.backgroundImage} >
                <View style={styles.loginContainer}>
                    <Image
                        source={require('../img/icons/login.png')}
                        style={{ width: 100, height: 100, borderRadius: 15 }}
                    />
                    <Text style={styles.boldTitleText}>Login to Unlock More Features!!</Text>
                    <View style={styles.textInputContainer}>
                        <RkTextInput 
                            rkType="topLabel" 
                            label="Email Address"
                            style={styles.textInput}
                            labelStyle={{color: '#D5DBDB'}}
                            inputStyle={{color: '#F4F6F6'}}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            onChangeText = {props.emailTextHandler}
                        />
                        <RkTextInput 
                            rkType="topLabel" 
                            label="password"
                            style={styles.textInput}
                            labelStyle={{color: '#D5DBDB'}}
                            inputStyle={{color: '#F4F6F6'}}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            secureTextEntry={true}
                            onChangeText = {props.passwordTextHandler}
                        />
                    </View>
                    <TouchableOpacity 
                        style={styles.forgotTouchableOpacity}
                        onPress={props.onPressForgotPassword}
                    >
                        <Text style={styles.forgotText}>Forgot password?</Text>
                    </TouchableOpacity>
                    <RoundButton 
                        style = {styles.button}
                        type="primary"
                        text="Login"
                        textStyle= {styles.buttonTextFont}
                        backgroundColors={['#2193b0', '#2193b0']}
                        gradientStart={{ x: 0.5, y: 1 }}
                        gradientEnd={{ x: 1, y: 1 }}
                        onPress={props.onPressLogIn} 
                    />
                    <RoundButton 
                        style = {styles.button}
                        type="primary"
                        text="Sign Up"
                        textStyle= {styles.buttonTextFont}
                        backgroundColors={['#58D68D', '#58D68D']}
                        gradientStart={{ x: 0.5, y: 1 }}
                        gradientEnd={{ x: 1, y: 1 }}
                        onPress={props.onPressSignUp} 
                    />
                </View>    
            </ImageBackground>
        );

    } else {    //else, user must be signed in
        return (
            <View style={styles.accountInfoContainer}>
                <Text>User is signed in!</Text>
                <View style={styles.buttonsContainer}>
                    <RoundButton 
                            style = {styles.signOutButton}
                            type="primary"
                            text="Sign Out"
                            textStyle= {styles.buttonTextFont}
                            backgroundColors={['#2193b0', '#6dd5ed']}
                            gradientStart={{ x: 0.5, y: 1 }}
                            gradientEnd={{ x: 1, y: 1 }}
                            onPress={props.onPressSignOut} />
                </View>
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
    myContainer: {
        flex: 1,
    },
    loginContainer: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        flex: 1,
        alignItems: 'center',
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    accountInfoContainer: {
        flex: 1,
        //flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'blue',  //debugging use
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    textInputContainer: {
        marginTop: 15,
    },
    textInput: {
        height: 60,
        width: 325,
        borderBottomColor: 'white',
        borderBottomWidth: 1,
    },
    button: {
        marginRight: 18,
        marginLeft: 18,
        marginTop: 25,
        height: 50,
        width: 300,
    },
    signOutButton: {
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
    buttonsContainer: {
        marginTop: 8,
        flexDirection: 'row',
    },
    forgotText: {
        ...material.titleObject,
        ...systemWeights.bold,
        fontSize: 16,
        color: materialColors.whitePrimary,
    },
    forgotTouchableOpacity: {
        alignSelf: 'flex-end', 
        marginRight: 15,
    },
});
