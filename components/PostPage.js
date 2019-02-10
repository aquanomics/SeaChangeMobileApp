import React, {Component} from 'react';
import { View, StyleSheet, Image, Text, ImageBackground } from 'react-native';
import { RoundButton } from 'react-native-button-component';
import { material, sanFranciscoWeights, materialColors, robotoWeights } from 'react-native-typography';

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
                    onPress={() => this.props.navigation.navigate('ImagePost', {})}>
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
                    onPress={() => this.props.navigation.navigate('ArticlePost', {})} />
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
        //...robotoWeights.condensedBold,
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
        ...sanFranciscoWeights.thin,
        color: materialColors.whitePrimary,
        fontSize: 17,
        textAlign: 'center',
    }
});
