import React, {Component} from 'react';
import { View, StyleSheet, Image, Text, ImageBackground } from 'react-native';
import { RoundButton } from 'react-native-button-component';
import { material, sanFranciscoWeights, materialColors } from 'react-native-typography';

export default class PostPage extends Component{
    constructor(props) {
        super(props);
    };

    static navigationOptions = {
        title: 'Posts',
    };

    render() {
        return ( 
        //<View style={{ flex: 1, alignItems: 'center', backgroundColor: '#f9f5ed' }}>
        <ImageBackground source={require('../img/backgrounds/post-background-cartoon.png')} style={styles.backgroundImage}>
            <Image
                source={require('../img/icons/upload.png')}
                style={{ width: 100, height: 100, borderRadius: 15 }}
            />
            <Text style={styles.boldTitleText}>Upload Your Findings !!</Text> 
            <RoundButton 
                style = {styles.button}
                type="primary"
                text="Upload a Photo"
                backgroundColors={['#ff5f6d', '#ffC371']}
                gradientStart={{ x: 0.5, y: 1 }}
                gradientEnd={{ x: 1, y: 1 }}
                onPress={() => this.props.navigation.navigate('ImagePost', {})} />
            <RoundButton 
                style = {styles.button}
                type="primary"
                text="Upload an Article"
                backgroundColors={['#2193b0', '#6dd5ed']}
                gradientStart={{ x: 0.5, y: 1 }}
                gradientEnd={{ x: 1, y: 1 }}
                onPress={() => this.props.navigation.navigate('ArticlePost', {})} />
        </ImageBackground>
        //</View>
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
        backgroundColor: 'transparent',
        ...material.titleObject,
        ...sanFranciscoWeights.bold,
      },
      backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        alignItems: 'center', 
        justifyContent: 'center',
      },
});
