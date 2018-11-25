import React, {Component} from "react";
import {View,Text, StyleSheet, TouchableOpacity} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

export default class MenuButton extends Component{

    constructor(props){
        super(props);

        this.state = {iconName: props.iconName, buttonTitle: props.buttonTitle};        
    }

    render(){
        console.log(this.state.buttonTitle);
        return (
            <View style={{alignItems:'center', justifyContent:'center',}}>
                <TouchableOpacity style={styles.menuButton} onPress={() => this.props.onClick()}>
                    <Icon  name={this.state.iconName}  size={28} color='#ffffff' />                   
                </TouchableOpacity>  
                <Text >{this.state.buttonTitle}</Text>             
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
    menuButton: { 
        borderWidth:1,
        borderColor:'rgba(0,0,0,0.2)',
        alignItems:'center',
        justifyContent:'center',
        width:45,
        height:45,
        backgroundColor:'#3498db',
        borderRadius:45,
        marginLeft: 30,
        marginRight: 30,
        marginTop: 15
    }
});
