import React, {Component} from "react";
import {View, Button, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import { createStackNavigator, StackActions, NavigationActions } from 'react-navigation';

export default class UserMap extends Component{
  render(){
    return (
    <View style={styles.mapContainer}>
      <MapView
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0622,
          longitudeDelta: 0.0421
        }}
        style={styles.map}
      >   
      </MapView>
      <View style={styles.menu}>
        <Button
            title="Articles"
            style="menuButton"
            onPress={() =>
              this.props.navigation.navigate('Articles')
            }
        />
        <Button
            title="Events"
            style="menuButton"
            onPress={() =>
              this.props.navigation.navigate('Events')
            }
        />
        <Button
            title="Settings"
            style="menuButton"
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
    mapContainer: {
      width: "100%",
      height: "100%"
    },
    map: {
      width: "100%",
      height: "80%"
    },
    menu: {
      height: "20%",
      flex: 1, 
      flexDirection: 'row'
    },
    menuButton: {
      height: "100%",
      width: "30%"
      
    }
});

