import React, { Component } from 'react';
import {
  StyleSheet, Image, Text, View, ImageBackground, TouchableOpacity
} from 'react-native';
import { RoundButton } from 'react-native-button-component';
import { material, materialColors, systemWeights } from 'react-native-typography';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { RkTextInput } from 'react-native-ui-kitten';
import Dialog, {
  DialogTitle, ScaleAnimation, DialogFooter, DialogButton
} from 'react-native-popup-dialog';
import firebase from 'react-native-firebase';

export default class ForgotPasswordPage extends Component {
    static navigationOptions = {
      title: 'Forgot Password',
    };

    constructor(props) {
    	super(props);

      this.state = {
        user: null,
        email: '',
        displayDialog: false,
        dialogText: '',
        gotoLogin: false, // used for the <Dialog> callback functions
      };
    }

    onPressSendRecoveryEmail = () => {
      if (this.state.email.length == 0) {
        this.setState({ displayDialog: true, dialogText: 'Error: email field is empty' });
      } else {
        firebase.auth().sendPasswordResetEmail(this.state.email).then(() => {
          // email sent
          const tmpStr = 'Success! Email has been sent! Please check your inbox in order to reset your password';
          this.setState({ displayDialog: true, dialogText: tmpStr, gotoLogin: true });
        }).catch((err) => {
          this.setState({ displayDialog: true, dialogText: `Error: ${err.message}` });
        });
      }
    }

    emailTextHandler = (text) => {
      this.setState({ email: text });
    }

    dialogHandler = () => {
      this.setState({ displayDialog: false }, () => {
        if (this.state.gotoLogin) this.props.navigation.goBack();
      });
    }

    render() {
      return (
        <ImageBackground source={require('../img/backgrounds/sea-background.png')} style={styles.backgroundImage}>
          <View style={styles.loginContainer}>
            <Image
              source={require('../img/icons/key.png')}
              style={styles.image}
            />
            <Text style={styles.boldTitleText}>Need help logging in?</Text>
            <Text style={styles.forgotText}>Tell us your email and we'll send you a link to log in.</Text>
            <RkTextInput
              rkType="topLabel"
              label="email"
              style={styles.textInput}
              labelStyle={{ color: '#D5DBDB' }}
              inputStyle={{ color: '#F4F6F6' }}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={this.emailTextHandler}
            />
            <RoundButton
              style={styles.button}
              type="primary"
              text="Send email"
              textStyle={styles.buttonTextFont}
              backgroundColors={['#2193b0', '#2193b0']}
              gradientStart={{ x: 0.5, y: 1 }}
              gradientEnd={{ x: 1, y: 1 }}
              onPress={this.onPressSendRecoveryEmail}
            />
            <Dialog
              onTouchOutside={this.dialogHandler}
              width={0.9}
              visible={this.state.displayDialog}
              dialogAnimation={new ScaleAnimation()}
              dialogTitle={(
                <DialogTitle
                  title={this.state.dialogText}
                  hasTitleBar={false}
                />
)}
              footer={(
                <DialogFooter>
                  <DialogButton
                    text="Ok"
                    onPress={this.dialogHandler}
                  />
                </DialogFooter>
)}
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
  myContainer: {
    flex: 1,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginTop: 50, // Note: Because elements are not vertically centered, this gap/buffer is required
  },
  loginContainer: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1,
    alignItems: 'center',
    resizeMode: 'cover',
    // justifyContent: 'center',    //Note: I took this out because I wanted everything placed a little more upward
  },
  accountInfoContainer: {
    flex: 1,
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'blue',  //debugging use
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  textInput: {
    marginTop: 20,
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
    alignSelf: 'flex-start',
    marginLeft: 15,
  },
});
