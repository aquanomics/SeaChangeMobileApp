import React, {Component} from "react";
import {View, Button, StyleSheet,Text ,TouchableOpacity} from "react-native";
import MapView from "react-native-maps";
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import MenuButton from './MenuButton'

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
        <View style={styles.menuRow}>
          <MenuButton iconName="md-create" buttonTitle="Events" navPage="Events" onClick={() => this.props.navigation.navigate('Events')}></MenuButton>
          <MenuButton iconName="md-create" buttonTitle="Articles" navPage="Events" onClick={() => this.props.navigation.navigate('Events')}></MenuButton>
          <MenuButton iconName="md-create" buttonTitle="Posts" navPage="Events" onClick={() => this.props.navigation.navigate('Events')}></MenuButton>
        </View>
        <View style={styles.menuRow}>
          <MenuButton iconName="md-create" buttonTitle="Settings" navPage="Events" onClick={() => this.props.navigation.navigate('Events')}></MenuButton>
          <MenuButton iconName="md-create" buttonTitle="Profile" navPage="Events" onClick={() => this.props.navigation.navigate('Events')}></MenuButton>
          <MenuButton iconName="md-create" buttonTitle="Feed" navPage="Events" onClick={() => this.props.navigation.navigate('Events')}></MenuButton>
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

