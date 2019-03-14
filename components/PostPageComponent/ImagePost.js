import React, {Component} from 'react';
import { View, StyleSheet, Image, Text, Platform, KeyboardAvoidingView } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Fumi } from 'react-native-textinput-effects';
import ImagePicker from 'react-native-image-picker';
import { RoundButton } from 'react-native-button-component';
import Dialog, {DialogTitle, ScaleAnimation, DialogFooter, DialogButton} from 'react-native-popup-dialog';
import { material, materialColors, systemWeights } from 'react-native-typography';
import firebase from 'react-native-firebase';

const URL = "http://seachange.ca-central-1.elasticbeanstalk.com/post-img/image-upload";
const URL_TEST = "http://192.168.1.67:8080/post-img/image-upload";

export default class ImagePost extends Component{
    constructor(props) {    //This function is needed otherwise props cannot be accessed
        super(props);  
    };

    state = {
        photo: null,
        param: {
            name: null,
            body: {
                comment: null,
                lat: null,
                lng: null,
            }
        },
        buttonFetchLocationState: 'init',
        buttonUploadState: 'upload',
        displayDialog: false,
        dialogText: '',
    };

    /**
     * When the App component mounts, we listen for any authentication
     * state changes in Firebase.
     * Once subscribed, the 'user' parameter will either be null 
     * (logged out) or an Object (logged in)
     */
    componentDidMount() {
        this.unsubscriber = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({'user': user});
            } else {
                //Note: Since this page is only accessible while signed in, when signed out,
                //redirect the user to the log in page
                console.log('not logged in');
                this.setState({user: null}, () => {
                    this.props.navigation.goBack();     //go back to universal post page
                    this.props.navigation.goBack();     //go back to map page
                    this.props.navigation.navigate('Profile', {
                        externalDisplayDialog: true, 
                        externalDialogText: "You have been signed out due to inactivity. Please sign in again"
                    });  //go to profile screen and pass in prop to display the dialog
                });
            }
        });
    }

    /**
     * Don't forget to stop listening for authentication state changes
     * when the component unmounts.
     */
    componentWillUnmount() {
        console.log("Inside componentWillUnmount() of ArticlePostPage");
        if (this.unsubscriber) {
            this.unsubscriber();
        }
    }

    static navigationOptions = {
        title: 'Image Post',
    };

    handleGetPhoto = (fromCamera) => {
        const options = {
            noData: true,
        };

        if (fromCamera) {
            ImagePicker.launchCamera(options, (response) => {
                if (response.uri) {
                    this.setState({
                        photo: response
                    });
                }
            });
        } else {
            ImagePicker.launchImageLibrary(options, response => {
                if (response.uri) {
                    this.setState({
                        photo: response
                    });
                }
            });
        }      
    };

    handleUploadPhoto = () => {
        this.state.user.getIdToken()
            .then(idToken => {
                var tempParam = {};
                Object.assign(tempParam, this.state.param);
                tempParam.body.idToken = idToken;
                tempParam.body.uid = this.state.user.uid;
                console.log("Below is the tempParam");
                console.log(tempParam);

                var url = setUrlParam(URL, tempParam);
                console.log(`This is the upload url: ${url}`);
                return fetch(url, { method: "POST", body: createFormData(this.state.photo, {}) });
            })
            .then(response => {
                if(response.status != 200) {    //internal server error
                    console.log(`Internal server error! Error code ${response.status}`);
                    this.setState({ buttonUploadState: 'upload', displayDialog: true,  dialogText: "Failed to Upload Photo :("});
                } else {
                    this.setState({ buttonUploadState: 'upload', displayDialog: true, dialogText: "Photo Successfully Uploaded :)" });
                }
            })
            .catch(error => {   //external server error
                console.log("External server error")
                this.setState({ buttonUploadState: 'upload', displayDialog: true, dialogText: error.message });
                console.log(error.message);
            });
    };

    handleGetUserLocation = () => {
        navigator.geolocation.getCurrentPosition(position => {
            var currState = this.state
            if (position.coords.latitude == null || position.coords.longitude == null) {
                currState = setUserLocation(currState, null, null, 'init', true, "Failed to Include User Location");  
            } else {
                currState = setUserLocation(currState, position.coords.latitude, position.coords.longitude, 'done', false, '');  
            }

            this.setState({currState});
        }, error => {
            console.log(error)
            var currState = setUserLocation(this.state, null, null, 'init', true, "Failed to Include User Location"); 
            this.setState({currState});
        });
    };

    handleNameInput = (text) => {
        var currState = this.state;
        currState.param.name = text;
        this.setState({currState});
    };

    handleCommentsInput = (text) => {
        var currState = this.state;
        currState.param.body.comment = text;
        this.setState({currState});
    };

    //This function is for testing purposes only.
    //You can use this callback function in a button to simulate being signed out due to inactivity.
    onPressSignOut = () => {
        firebase.auth().signOut();
    }

    render() {
        const { photo } = this.state;
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f5ed' }}>
            {photo && ( 
              <React.Fragment> 
                <Image
                  source={{ uri: photo.uri }}
                  style={ styles.image }
                />
                <Dialog
                    onTouchOutside={() => {
                        this.setState({ displayDialog: false });
                        this.props.navigation.goBack();}}
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
                            text="Continue"
                            onPress={() => {
                                this.setState({ displayDialog: false });
                                this.props.navigation.goBack();}}
                            />
                        </DialogFooter>}     
                />
                <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                    <Fumi
                        style = {styles.input}
                        label={'Title'}
                        labelStyle={{ color: '#a3a3a3' }}
                        inputStyle={{ color: '#f95a25' }}
                        iconClass={FontAwesomeIcon}
                        iconName={'pencil'}
                        iconColor={'#f95a25'}
                        iconSize={15}
                        onChangeText = {this.handleNameInput}
                    />
                    <Fumi
                        style = {styles.input}
                        label={'Description'}
                        labelStyle={{ color: '#a3a3a3' }}
                        inputStyle={{ color: '#f95a25' }}
                        iconClass={FontAwesomeIcon}
                        iconName={'comment'}
                        iconColor={'#f95a25'}
                        iconSize={15}
                        onChangeText={this.handleCommentsInput}
                    />
                </KeyboardAvoidingView>
                <RoundButton   
                    style = {styles.button}        
                    buttonState={this.state.buttonFetchLocationState}
                    gradientStart={{ x: 0.5, y: 1 }}
                    gradientEnd={{ x: 1, y: 1 }}
                    textStyle= {styles.buttonTextFont}
                    states={{
                        init: {
                        text: '+ Include User Location',
                        backgroundColors: ['#56CCF2', '#56CCF2'],
                        onPress: () => {this.handleGetUserLocation();},
                        },
                        done: {
                            text: '- Exclude User Location',
                            backgroundColors: ['#F37335', '#F37335'],
                            onPress: () => {
                                var currState = this.state;
                                currState.param.body.lat = null;
                                currState.param.body.lng = null;
                                currState.buttonFetchLocationState = 'init';
                                this.setState({currState});
                            },
                        },
                    }}/>
                <RoundButton  
                    style = {styles.button}        
                    buttonState={this.state.buttonUploadState}
                    gradientStart={{ x: 0.5, y: 1 }}
                    gradientEnd={{ x: 1, y: 1 }}
                    textStyle= {styles.buttonTextFont}
                    states={{
                        upload: {
                            text: 'Upload Photo',
                            backgroundColors: ['#4DC7A4', '#66D37A'],
                            onPress: () => {
                                //Testing purposes only. Simulates being logged out due to inactivity
                                // this.onPressSignOut();
                                // return;
                                this.setState({ buttonUploadState: 'uploading' });
                                this.handleUploadPhoto();
                            },
                        },
                        uploading: {
                            text: 'Uploading Photo...',
                            gradientStart: { x: 0.8, y: 1 },
                            gradientEnd: { x: 1, y: 1 },
                            backgroundColors: ['#FF416C', '#FF4B2B'],
                            spinner: true,
                            onPress: () => {},
                        },
                    }}/>
                <RoundButton 
                    style = {styles.button}
                    type="primary"
                    text="Choose a different Photo"
                    textStyle= {styles.buttonTextFont}
                    backgroundColors={['#ff5f6d', '#ffC371']}
                    gradientStart={{ x: 0.5, y: 1 }}
                    gradientEnd={{ x: 1, y: 1 }}
                    onPress={() => this.setState({photo: null})} />
            </React.Fragment>
            )}
            {!photo && (
            <React.Fragment> 
                <Image
                    source={require('../../img/icons/camera-logo.png')}
                    style={{ width: 80, height: 80, borderRadius: 15 }}
                />
                <Text style={styles.boldTitleText}>Post Photos !!</Text>   
                <RoundButton 
                    style = {styles.button}
                    type="primary"
                    shape="rectangle"
                    text="Choose existing Photo"
                    textStyle= {styles.buttonTextFont}
                    backgroundColors={['#ff5f6d', '#ffC371']}
                    gradientStart={{ x: 0.5, y: 1 }}
                    gradientEnd={{ x: 1, y: 1 }}
                    onPress={() => this.handleGetPhoto(false)} />
                <RoundButton 
                    style = {styles.button}
                    type="primary"
                    shape="rectangle"
                    text="Take a Photo"
                    textStyle= {styles.buttonTextFont}
                    backgroundColors={['#ff5f6d', '#ffC371']}
                    gradientStart={{ x: 0.5, y: 1 }}
                    gradientEnd={{ x: 1, y: 1 }}
                    onPress={() => this.handleGetPhoto(false)} 
                    onPress={() => this.handleGetPhoto(true)} />
            </React.Fragment>
            )}
          </View>
        )
    }
}

const createFormData = (photo, body) => {
    const data = new FormData();
  
    data.append("image", {
        name: photo.fileName,
        type: photo.type,
        uri:
        Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
    });
  
    Object.keys(body).forEach(key => {
        data.append(key, body[key]);
    });
  
    return data;
};

const setUrlParam = (url, param) => {
    var name = (param.name == undefined) ? "default-name" : param.name;
    var resultUrl = url + "?name=" + name; 

    if (param.body != undefined) {
        Object.keys(param.body).forEach(key => {
            resultUrl += "&" + key + "=" + param.body[key];
        });
    }

    return resultUrl;
};

const setUserLocation = (state, lat, lng, btnState, fail, dialogText) => {
    state.param.body.lat = lat;
    state.param.body.lng = lng;
    state.displayDialog = fail;
    state.dialogText = dialogText;
    state.buttonFetchLocationState = btnState;
    return state;
};

const styles = StyleSheet.create({
    placeholder: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    image: {
        width: 380,
        height: 250,
        borderRadius: 15,
        resizeMode: 'contain',
    },
    input: {
        margin: 10,
        height: 60,
        width: 350,
        borderRadius: 15
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
    },
    buttonTextFont: {
        ...material.button,
        ...systemWeights.light,
        color: materialColors.whitePrimary,
        fontSize: 17,
        textAlign: 'center',
    },
});
