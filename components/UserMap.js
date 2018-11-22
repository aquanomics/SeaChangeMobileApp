import React, {Component} from "react";
import {View, Button, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import { createStackNavigator, StackActions, NavigationActions } from 'react-navigation';

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
    <View style={styles.container}>
      <View style={styles.mapContainer}>
      
        <MapView
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,}
          }
          region={this.props.userLocation}
          style={styles.map}
        >   
        </MapView>
        <Button
          title="Hey"
          style={styles.but}
          onPress={() =>
            this.props.navigation.navigate('Articles')
          }
        />
        
      </View>

      <View style={styles.menu}>
        <Button
            title="Articles"
            style={styles.menuButton}
            onPress={() =>
              this.props.navigation.navigate('Articles')
            }
        />
        <Button
            title="Events"
            style={styles.menuButton}
            onPress={() =>
              this.props.navigation.navigate('Events')
            }
        />
        <Button
            title="Settings"
            style={styles.menuButton}
            onPress={() =>
              this.props.navigation.navigate('Settings')
            }
        />
      </View>   
    </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex:0
    },
    mapContainer: {
      width: "100%",
      height: "90%",
      position:"relative"
    },
    but: {
      position: "absolute",
      top:200
    },
    map: {

      margin: 0
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

