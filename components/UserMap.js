import React from "react";
import { View, StyleSheet } from "react-native";
import MapView from "react-native-maps";

const userMap = () => {
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
        </View>
    );
};

const styles = StyleSheet.create({
    mapContainer: {
      width: "100%",
      height: 200,
      marginTop: 20
    },
    map: {
      width: "100%",
      height: "100%"
    }
});

export default userMap;