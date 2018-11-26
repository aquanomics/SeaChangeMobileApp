import React, {Component} from "react";
import {View, Button, StyleSheet,Text ,TouchableOpacity, ToastAndroid, BackHandler} from "react-native";
import MapView from "react-native-maps";
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import MenuButton from './MenuButton'
import firebase from 'react-native-firebase';

export default class UserMap extends Component{
    static navigationOptions = {
	header: null,
    };
    
    state = {
	userLocation: null
    }
    
    constructor(props){
	super(props);
	console.log("Inside constructor of UserMap. Below is the props NOT from navigation");
	console.log(props);
	console.log("Inside constructor of UserMap. Below is the props passed from the last page");
	console.log(this.props.navigation.state.params);
	console.log("TESTING: Below is the object from firebase.auth().currentUser");
	console.log(firebase.auth().currentUser);
	
	this.getUserLocation();  
	console.log(this.state);
    }

    //componentDidMount only is executed once in stackNavigator. One way around this is to put this in the constructor so it's called everytime component is added to the stack
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
    //componentWillUnmount is NEVER executed in stackNavigator. One way around this is to call statements here before navigating to new pages
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        ToastAndroid.show('Back button is pressed', ToastAndroid.SHORT);
        return true;
    }
    
    getUserLocation = () => {
	navigator.geolocation.getCurrentPosition(position => {
	    console.log(position.coords.latitude);
	    
	    /*this.setState(
              
	      loc = {
              userLocation: {         
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
              }
	      });*/
	    this.setState({
		userLocation: {         
		    latitude: position.coords.latitude,
		    longitude: position.coords.longitude,
		    latitudeDelta: 0.0922,
		    longitudeDelta: 0.0421
		}
	    });
	}, error => console.log("Error fetching location"))
    }

  render(){
    console.log(this.state.userLocation);
    return (
    
    <View style={{ flex: 1 }}>
      <View style={{height:"75%"}}>
        <MapView style={{ flex: 1 }} />
        <ActionButton buttonColor="rgba(255,255,255,1)" buttonTextStyle={{color:'#3498db'}}>
            <ActionButton.Item buttonColor='#3498db'  onPress={() => console.log("notes tapped!")}>
                <Icon name="md-create" style={styles.actionButtonIcon} />
            </ActionButton.Item>
                <ActionButton.Item buttonColor='#3498db' onPress={() => {}}>
                    <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
              	</ActionButton.Item>
            </ActionButton>
        <View
            style={{
                position: 'absolute',//use absolute position to show button on top of the map
                bottom: '20%', //for center align
                right: '20%',
                backgroundColor: '#f3f3f3'
            }}
        >
        </View>
      </View>

      <View style={styles.menu}>
        <View style={styles.menuRow}>
          <MenuButton iconName="md-calendar" buttonTitle="Events" onClick={() => this.props.navigation.navigate('Events')}></MenuButton>
          <MenuButton iconName="md-paper" buttonTitle="Articles" onClick={() => this.props.navigation.navigate('Articles')}></MenuButton>
          <MenuButton iconName="ios-cloud-upload" buttonTitle="Posts" onClick={() => this.props.navigation.navigate('Events')}></MenuButton>
        </View>
        <View style={styles.menuRow}>
            <MenuButton iconName="md-settings" buttonTitle="Settings" onClick={() => this.props.navigation.navigate('Settings')}></MenuButton>
          <MenuButton iconName="md-person" buttonTitle="Profile" onClick={() => this.props.navigation.navigate('Events')}></MenuButton>
          <MenuButton iconName="md-create" buttonTitle="Feed" onClick={() => this.props.navigation.navigate('Events')}></MenuButton>
        </View>
      </View>

    </View>
    );
  }
}

const styles = StyleSheet.create({

    actionButtonIcon: {
      fontSize: 20,
      height: 22,
      color: 'white',
    },

    menu: {
      height: "25%",
      flex: 1, 
    },

    menuRow: {
      flexDirection: 'row',
      justifyContent: 'center', 
      alignItems: 'center'
    }
});
