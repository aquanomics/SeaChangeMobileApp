import React, {Component} from 'react';
import { View, StyleSheet, Image, Text, Platform, KeyboardAvoidingView } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Fumi } from 'react-native-textinput-effects';
import ImagePicker from 'react-native-image-picker';
import { RoundButton } from 'react-native-button-component';
import Dialog, {DialogTitle, ScaleAnimation, DialogFooter, DialogButton} from 'react-native-popup-dialog';
import { material, sanFranciscoWeights, materialColors, robotoWeights } from 'react-native-typography';


const URL = "http://seachange.ca-central-1.elasticbeanstalk.com/post-img/image-upload";
const URL_TEST = "http://192.168.1.84:8080/post-img/image-upload";

export default class ImagePost extends Component{
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
        failAddLocationDialog: false,
        buttonUploadState: 'upload',
        successUploadDialog: false,
        failUploadDialog: false,
    };

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
        var url = setUrlParam(URL, this.state.param);

        fetch(url, {
          method: "POST",
          body: createFormData(this.state.photo, {}),
        })
          .then(response => response.json())
          .then(response => {
            this.setState({ buttonUploadState: 'upload', successUploadDialog: true  });
          })
          .catch(error => {
            console.log(error);
            this.setState({ buttonUploadState: 'upload', failUploadDialog: true, errorDialogMessage: error });
          });
    };

    handleGetUserLocation = () => {
        navigator.geolocation.getCurrentPosition(position => {
          console.log(position.coords);
       
          var currState = this.state
          if (position.coords.latitude == null || position.coords.longitude == null) {
            currState = setUserLocation(currState, null, null, 'init', true);  
          } else {
            currState = setUserLocation(currState, position.coords.latitude, position.coords.longitude, 'done', false);  
          }

          this.setState({currState});
        }, error => {
            console.log(error)
            var currState = setUserLocation(this.state, null, null, 'init', true); 
            this.setState({currState});
        })
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
                    onTouchOutside={() => {this.setState({ successUploadDialog: false });}}
                    width={0.9}
                    visible={this.state.successUploadDialog}
                    dialogAnimation={new ScaleAnimation()}
                    dialogTitle={
                        <DialogTitle
                        title="Photo Successfully Uploaded :)"
                        hasTitleBar={false}
                        />}
                    footer={
                        <DialogFooter>
                            <DialogButton
                            text="Continue"
                            onPress={() => {this.setState({ successUploadDialog: false });}}
                            />
                        </DialogFooter>}     
                />
                <Dialog
                    onTouchOutside={() => {this.setState({ failUploadDialog: false });}}
                    width={0.9}
                    visible={this.state.failUploadDialog}
                    dialogAnimation={new ScaleAnimation()}
                    dialogTitle={
                        <DialogTitle
                        title="Failed to Upload Photo :("
                        hasTitleBar={false}
                        />}
                    footer={
                        <DialogFooter>
                            <DialogButton
                            text="Continue"
                            onPress={() => {this.setState({ failUploadDialog: false });}}
                            />
                        </DialogFooter>}
                />
                <Dialog
                    onTouchOutside={() => {this.setState({ failAddLocationDialog: false });}}
                    width={0.9}
                    visible={this.state.failAddLocationDialog}
                    dialogAnimation={new ScaleAnimation()}
                    dialogTitle={
                        <DialogTitle
                        title="Failed to Include User Location"
                        hasTitleBar={false}
                        />}
                    footer={
                        <DialogFooter>
                            <DialogButton
                            text="Continue"
                            onPress={() => {this.setState({ failAddLocationDialog: false });}}
                            />
                        </DialogFooter>}
                />
                <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                    <Fumi
                        style = {styles.input}
                        label={'Name'}
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
                        label={'Comment'}
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

const setUserLocation = (state, lat, lng, btnState, fail) => {
    state.param.body.lat = lat;
    state.param.body.lng = lng;
    state.failAddLocationDialog = fail;
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
        borderColor: 'black',
        resizeMode: 'cover',
        borderWidth: 2,
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
        ...robotoWeights.condensedBold,
        fontSize: 30,
        marginTop: 10,
        //color: materialColors.whitePrimary,
    },
    buttonTextFont: {
        ...material.button,
        ...sanFranciscoWeights.thin,
        color: materialColors.whitePrimary,
        fontSize: 17,
        textAlign: 'center',
    },
});
