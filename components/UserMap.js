import React, {Component} from "react";
import {View, Button, StyleSheet,Text } from "react-native";
import MapView from "react-native-maps";
import { createStackNavigator, StackActions, NavigationActions } from 'react-navigation';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

export default class UserMap extends Component{

  state = {
    userLocation: null
  }

  constructor(props){
    super(props);

    this.getUserLocation();  
    console.log(this.state);
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
      <MapView style={{ flex: 1 }} />
      <View
          style={{
              position: 'absolute',//use absolute position to show button on top of the map
              top: '10%', //for center align
              right: '20%',
              alignSelf: 'flex-end' //for align to right
          }}
      >
        <View style={{flex:1, backgroundColor: '#f3f3f3'}}>
          {/* Rest of the app comes ABOVE the action button component !*/}
          <ActionButton buttonColor="rgba(231,76,60,1)">
            <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={() => console.log("notes tapped!")}>
              <Icon name="md-create" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => {}}>
              <Icon name="md-notifications-off" style={styles.actionButtonIcon} /><Icon name="md-done-all" style={styles.actionButtonIcon} />
           </ActionButton.Item>
            <ActionButton.Item buttonColor='#1abc9c' title="All Tasks" onPress={() => {}}>
              <Icon name="md-done-all" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          </ActionButton>
        </View>
      </View>
    </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex:1
    },
    mapContainer: {
      flex:1,
      
      justifyContent: 'center',
    alignItems: 'center'
    },
    but: {
      color:"#841584",
      backgroundColor: '#2196F3'
    },
    actionButtonIcon: {
      fontSize: 20,
      height: 22,
      color: 'white',
    },


    buttonView:{
      position: 'absolute',
      top: '80%' 
    },


    map: {
      flex:1,
      zIndex: -1
      
    },
    menu: {
      height: "10%",
      flex: 1, 
      flexDirection: 'row'
    },
    menuButton: {
      height: "100%",
      width: "30%"

    }
});

