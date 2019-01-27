import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, Button, Platform, TextInput} from 'react-native';
import ImagePicker from 'react-native-image-picker';


const URL = "http://seachange.ca-central-1.elasticbeanstalk.com/post-img/image-upload";
const URL_TEST = "http://192.168.1.84:8080/post-img/image-upload";

export default class PostsPage extends Component{
    state = {
        photo: null,
        param: {
            name: null,
            body: {
                comment: null,
            }
        },
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
            console.log("upload success", response);
            alert("Upload success!");
            this.setState({ photo: null });
          })
          .catch(error => {
            console.log("upload error", error);
            alert("Upload failed!");
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

    render() {
        const { photo } = this.state
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {photo && (
              <React.Fragment>
                <Image
                  source={{ uri: photo.uri }}
                  style={{ width: 300, height: 300 }}
                />
                <TextInput
                   style = {styles.input}
                   placeholder="Input Name"
                   onChangeText = {this.handleNameInput}
                />
                <TextInput
                   style = {styles.input}
                   placeholder="Input Comments"
                   onChangeText={this.handleCommentsInput}
                />
                <Button title="Upload" onPress={() => this.handleUploadPhoto()} />
               </React.Fragment>
            )}
            <Button title="Choose existing Photo from Phone" onPress={() => this.handleGetPhoto(false)} />
            <Button title="Take Picture" onPress={() => this.handleGetPhoto(true)} />
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

const styles = StyleSheet.create({
    placeholder: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    input: {
        margin: 15,
        height: 40,
        borderColor: '#7a42f4',
        borderWidth: 1
     }
});