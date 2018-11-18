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
      <Button
          title="Articles"
          onPress={() =>
            this.props.navigation.navigate('Articles')
          }
      />
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
    articlesButton: {
      height: "20%"
    }
});

