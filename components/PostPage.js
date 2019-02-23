import React, {Component} from 'react';
import { View, StyleSheet, Image, Text, ImageBackground } from 'react-native';
import { RoundButton } from 'react-native-button-component';
import { material, materialColors, systemWeights } from 'react-native-typography';
import Dialog, {DialogTitle, ScaleAnimation, DialogFooter, DialogButton} from 'react-native-popup-dialog';
import firebase from 'react-native-firebase';

export default class PostPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            userLoggedOut: false,
        };
    };

    static navigationOptions = {
        title: 'Posts',
    };

    render() {
        return ( 
        //<View style={{ flex: 1, alignItems: 'center', backgroundColor: '#f9f5ed' }}>
        <ImageBackground source={require('../img/backgrounds/background-post-ocean-floor.png')} style={styles.backgroundImage} >
            <View style={styles.container}>
                <Image
                    source={require('../img/icons/binoculars.png')}
                    style={{ width: 100, height: 100, borderRadius: 15 }}
                />
                <Text style={styles.boldTitleText}>Upload Your Findings !!</Text> 
                <RoundButton 
                    style = {styles.button}
                    type="primary"
                    text="Upload a Photo"
                    textStyle= {styles.buttonTextFont}
                    backgroundColors={['#ff5f6d', '#ffC371']}
                    gradientStart={{ x: 0.5, y: 1 }}
                    gradientEnd={{ x: 1, y: 1 }}
                    onPress={() => {
                        if(firebase.auth().currentUser === null) {
                            this.setState({userLoggedOut: true});
                        } else {
                            this.props.navigation.navigate('ImagePost', {});
                        }
                    }}>
                    <Text>react-native-button-component</Text>
                    </RoundButton>
                <RoundButton 
                    style = {styles.button}
                    type="primary"
                    text="Upload an Article"
                    textStyle= {styles.buttonTextFont}
                    backgroundColors={['#2193b0', '#6dd5ed']}
                    gradientStart={{ x: 0.5, y: 1 }}
                    gradientEnd={{ x: 1, y: 1 }}
                    onPress={() => {
                        if(firebase.auth().currentUser === null) {
                            this.setState({userLoggedOut: true});
                        } else {
                            this.props.navigation.navigate('ArticlePost', {});
                        }
                    }} />
                <Dialog
                onTouchOutside={() => this.setState({ userLoggedOut: false })}
                width={0.9}
                visible={this.state.userLoggedOut}
                dialogAnimation={new ScaleAnimation()}
                dialogTitle={
                    <DialogTitle
                        title={`Not Logged In D:\nYou must be logged in in order to use this functionality`}
                        hasTitleBar={false}
                    />}
                footer={
                    <DialogFooter>
                        <DialogButton
                            text="Cancel"
                            onPress={() => this.setState({ userLoggedOut: false })}
                        />
                        <DialogButton
                            text="Log In"
                            onPress={() => {
                                this.setState({ userLoggedOut: false }, () => {
                                    this.props.navigation.goBack();
                                    this.props.navigation.navigate('Settings', {});
                                });
                            }}
                        />
                    </DialogFooter>}     
                />
            </View>
        </ImageBackground>
      
        );
    }
}

const styles = StyleSheet.create({
    placeholder: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    button: {
        margin: 10,
        height: 50,
        width: 300,
    },
    boldTitleText: {
        ...material.titleObject,
        ...systemWeights.bold,
        fontSize: 30,
        marginTop: 10,
        color: materialColors.whitePrimary,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        //alignItems: 'center', 
        //justifyContent: 'center',
    },
    container: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        flex: 1,
        alignItems: 'center',
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    buttonTextFont: {
        ...material.button,
        ...systemWeights.light,
        color: materialColors.whitePrimary,
        fontSize: 17,
        textAlign: 'center',
    }
});
