import React, {Component} from "react";
import {Platform, StyleSheet, Text, View, TextInput, Button, Alert} from 'react-native';
import firebase from 'react-native-firebase';

export default class SettingsPage extends Component{
    constructor(props) {
    	super(props);
    	console.log("Inside constructor of SettingsPage. Below is the props passed from the last page");
    	console.log(this.props.navigation.state.params);

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
                console.log("Inside componentDidMount()'s AuthStateChanged callback function. Below is the user");
                console.log(user);
                console.log("Below is the unsubscriber");
                console.log(this.unsubscriber);

                //Setting the state for user object may seem unnecessary because we can use firebase.auth().currentUser;
                //however, in render() comment section, it explains why we need this
                this.setState({'user': user});    

                user.getIdToken().then( (idToken) => {  // <------ Check this line
                    console.log("Authentication token is: " + idToken); // It shows the Firebase token now
                });
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
                .then(() => console.log("successfully logged on"))
                .catch((e) => {
                    console.log(e.message);
                    Alert.alert(e.message);
                });
        }
    }

    onPressSignOut = () => {
    	firebase.auth().signOut();
    }

    emailTextHandler = (text) => {
        this.setState({"email":text});
    }

    passwordTextHandler = (text) => {
        this.setState({"password":text});
    }
    
    render(){
        return (
            <View style={styles.placeholder}>
                <DisplayAccountInfo
                    user={this.state.user}
                    onPressLogIn={this.onPressLogIn}
                    onPressSignOut={this.onPressSignOut}
                    emailTextHandler={this.emailTextHandler}
                    passwordTextHandler={this.passwordTextHandler}
                />
            </View>
        );
    }
}

function DisplayAccountInfo(props) {
    //WARNING: I already tried using if(!firebase.auth().currentUser), but even after successfully logging in
    //and after auth().currentUser changes, render() doesn't recognize the change in auth().currentUser.
    //Therefore, we need the state to dynamically render this page.

    //HOWEVER, using the if(!firebase.auth().currentUser), if I were to go back to the userMap and come back to 
    //this page, then the render()'s conditional would properly work.
    //In short, when using if(!firebase.auth().currentUser) inside render(), the conditional is only evaluated once

    //if user is not signed in yet
    if(!props.user) {
        return (
            <View>
                <Text>Settings Screen</Text>
                <TextInput
                    style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={props.emailTextHandler}
                    placeholder={'email'}
                />
                <TextInput
                    style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={props.passwordTextHandler}
                    placeholder={'password'}
                />
                <Button
                    onPress={props.onPressLogIn}
                    title="Login"
                    color="#841584"
                />
            </View>
        );

    } else {    //else, user must be signed in
        return (
            <View>
                <Text>User signed in!</Text>
                <Button
                    onPress={props.onPressSignOut}
                    title="SignOut"
                    color="#841584"
                />
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
});
