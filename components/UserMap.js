import React, {Component} from "react";
import {View, Button, StyleSheet,Text ,TouchableOpacity} from "react-native";
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
      <View style={{height:"75%"}}>
        <MapView style={{ flex: 1 }} />
        <View
            style={{
                position: 'absolute',//use absolute position to show button on top of the map
                bottom: '20%', //for center align
                right: '20%',
                backgroundColor: '#f3f3f3'
            }}
        >
          <View style={{width:60, backgroundColor: '#f3f3f3'}}>
            {/* Rest of the app comes ABOVE the action button component !*/}
            <ActionButton buttonColor="rgba(255,255,255,1)" buttonTextStyle={{color:'#3498db'}}>
              <ActionButton.Item buttonColor='#3498db'  onPress={() => console.log("notes tapped!")}>
                <Icon name="md-create" style={styles.actionButtonIcon} />
              </ActionButton.Item>
              <ActionButton.Item buttonColor='#3498db' onPress={() => {}}>
                <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
              </ActionButton.Item>
              
            </ActionButton>
          </View>
            
        </View>
      </View>

      <View style={styles.menu}>

        <View style={{flexDirection: 'row',flexWrap: 'wrap',justifyContent: 'center', alignItems: 'center',}}>
         <TouchableOpacity style={styles.menuButton} onPress={() => this.props.navigation.navigate('Events')}>
            <Icon name={"md-create"}  size={30} color="#01a699" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={() => this.props.navigation.navigate('Events')}>
            <Icon name={"md-create"}  size={30} color="#01a699" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={() => this.props.navigation.navigate('Events')}>
            <Icon name={"md-create"}  size={30} color="#01a699" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={() => this.props.navigation.navigate('Events')}>
            <Icon name={"md-create"}  size={30} color="#01a699" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={() => this.props.navigation.navigate('Events')}>
            <Icon name={"md-create"}  size={30} color="#01a699" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={() => this.props.navigation.navigate('Events')}>
            <Icon name={"md-create"}  size={30} color="#01a699" />
          </TouchableOpacity>   
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
      flexDirection: 'row',  
      paddingLeft: 20
    },

    menuButton: { 
      borderWidth:1,
      borderColor:'rgba(0,0,0,0.2)',
      alignItems:'center',
      justifyContent:'center',
      width:55,
      height:55,
      backgroundColor:'#fff',
      borderRadius:55,
      marginLeft: 20,
      marginRight: 20,
      marginTop: 15
    }
});

