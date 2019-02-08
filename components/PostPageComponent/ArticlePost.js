import React, {Component} from 'react';
import { View, StyleSheet, Image, Text, TextInput, Platform } from 'react-native';
import { RoundButton } from 'react-native-button-component';
import { material, sanFranciscoWeights, materialColors } from 'react-native-typography';

export default class ArticlePost extends Component{
    constructor(props) {
        super(props);
    };

    state = {
        photo: null,
    };

    static navigationOptions = {
        title: 'Article Post',
    };

    render() {
        return ( 
        <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#e6ffff' }}>
            <Image
                source={require('../../img/icons/newspaper.png')}
                style={{ width: 100, height: 100, borderRadius: 15 }}
            />
            <Text style={styles.boldTitleText}>Upload an Article !!</Text> 
            
 
 
            <TextInput
                style={styles.textAreaInput}
                underlineColorAndroid="transparent"
                placeholder={"Input your description here."}
                placeholderTextColor={"#9E9E9E"}
                numberOfLines={10}
                multiline={true}
            />

            

            <RoundButton 
                style = {styles.button}
                type="primary"
                text="Upload"
                backgroundColors={['#2193b0', '#6dd5ed']}
                gradientStart={{ x: 0.5, y: 1 }}
                gradientEnd={{ x: 1, y: 1 }}
                onPress={() => this.setState({photo: null})} />
         
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
    button: {
        margin: 10,
        height: 50,
        width: 250,
    },
    boldTitleText: {
        fontSize: 60,
        ...material.titleObject,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textAreaInput: {
        textAlign: 'center',
        height: 50,
        width: 250,
        borderWidth: 2,
        borderColor: '#9E9E9E',
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        height: 120,
    },
});