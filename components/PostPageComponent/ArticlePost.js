import React, {Component} from 'react';
import { View, StyleSheet, Image, Text, TextInput, Platform } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Fumi } from 'react-native-textinput-effects';
import { RoundButton } from 'react-native-button-component';
import Dialog, {DialogTitle, ScaleAnimation, DialogFooter, DialogButton} from 'react-native-popup-dialog';
import { material, sanFranciscoWeights, materialColors, robotoWeights } from 'react-native-typography';

const URL = "http://seachange.ca-central-1.elasticbeanstalk.com/post-article/article-upload";

export default class ArticlePost extends Component{
    constructor(props) {
        super(props);
    };

    state = {
        param: {
            url: null,
            description: null,
        },
        noUrlError: false,
        invalidUrl: false,
        buttonUploadState: 'upload',
        successUploadDialog: false,
        failUploadDialog: false,
    };

    static navigationOptions = {
        title: 'Article Post',
    };

    handleUrlInput = (text) => {
        var currState = this.state;
        currState.param.url = text;
        this.setState({currState});
    };

    handleDescriptionInput = (text) => {
        var currState = this.state;
        currState.param.description = text;
        this.setState({currState});
    };

    handleArticleUpload = () => {
        if(this.state.param.url == '' || this.state.param.url == null) {
            this.setState({noUrlError: true, invalidUrl: false, buttonUploadState: 'upload'});
        } else if (!validURL(this.state.param.url)) {
            this.setState({noUrlError: false, invalidUrl: true, buttonUploadState: 'upload'});
        } 
        else {
            console.log(JSON.stringify(this.state.param));
            this.setState({noUrlError: false, invalidUrl: false});
            fetch(URL, {
                method: "POST",
                body: JSON.stringify(this.state.param),
                headers: {
                    "Content-Type": "application/json"
                }
              })
                .then(response => {
                  this.setState({ buttonUploadState: 'upload', successUploadDialog: true });
                })
                .catch(error => {
                  console.log(error);
                  this.setState({ buttonUploadState: 'upload', failUploadDialog: true, errorDialogMessage: error });
                });
        }
    };

    render() {
        return ( 
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e6ffff' }}>
            <Image
                source={require('../../img/icons/newspaper.png')}
                style={{ width: 100, height: 100, borderRadius: 15 }}
            />
            <Text style={styles.boldTitleText}>Upload an Article !!</Text>
            <Dialog
                onTouchOutside={() => {this.setState({ successUploadDialog: false });}}
                width={0.9}
                visible={this.state.successUploadDialog}
                dialogAnimation={new ScaleAnimation()}
                dialogTitle={
                    <DialogTitle
                        title="Article Successfully Uploaded :)"
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
                        title="Failed to Upload Article :("
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
            <Fumi
                style = {styles.input}
                label={'Link to Article'}
                labelStyle={{ color: '#a3a3a3' }}
                inputStyle={{ color: '#f95a25' }}
                iconClass={FontAwesomeIcon}
                iconName={'newspaper-o'}
                iconColor={'#f95a25'}
                iconSize={15}
                onChangeText = {this.handleUrlInput}
            />
            { this.state.noUrlError == true ? (
             <Text style={styles.errorMessage}>
               * Link to Article is missing.
             </Text>
            ) : null  }
            { this.state.invalidUrl == true ? (
             <Text style={styles.errorMessage}>
               * Link is not a valid URL.
             </Text>
            ) : null  }
            <TextInput
                style={styles.textAreaInput}
                underlineColorAndroid="transparent"
                placeholder={"Input your description here."}
                placeholderTextColor={"#9E9E9E"}
                numberOfLines={10}
                multiline={true}
                maxLength={1000}
                onChangeText = {this.handleDescriptionInput}
            />
            <RoundButton  
                    style = {styles.button}        
                    buttonState={this.state.buttonUploadState}
                    gradientStart={{ x: 0.5, y: 1 }}
                    gradientEnd={{ x: 1, y: 1 }}
                    textStyle= {styles.buttonTextFont}
                    states={{
                        upload: {
                        text: 'Upload Article',
                        backgroundColors: ['#2193b0', '#6dd5ed'],
                        onPress: () => {
                            this.setState({ buttonUploadState: 'uploading' });
                            this.handleArticleUpload();
                        },
                        },
                        uploading: {
                        text: 'Uploading Article...',
                        gradientStart: { x: 0.8, y: 1 },
                        gradientEnd: { x: 1, y: 1 },
                        backgroundColors: ['#FF416C', '#FF4B2B'],
                        spinner: true,
                        onPress: () => {},
                        },
                    }}/>
        </View>
        );
    }
}

const validURL = (str) => {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return pattern.test(str);
}

const styles = StyleSheet.create({
    placeholder: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    button: {
        margin: 15,
        height: 50,
        width: 250,
    },
    boldTitleText: {
        ...material.titleObject,
        //...robotoWeights.condensedBold,
        fontSize: 30,
        margin: 15,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        margin: 15,
        height: 60,
        width: 350,
        borderRadius: 15,
        borderColor: '#9E9E9E',
    },
    textAreaInput: {
        textAlign: 'center',
        height: 40,
        width: 350,
        borderWidth: 2,
        borderColor: '#9E9E9E',
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        height: 120,
    },
    buttonTextFont: {
        ...material.button,
        ...sanFranciscoWeights.thin,
        color: materialColors.whitePrimary,
        fontSize: 17,
        textAlign: 'center',
    },
    errorMessage: {
        marginTop: -15,
        marginBottom: 10,
        marginLeft: -120,
        fontSize: 15,
        color:"red",
    },
});