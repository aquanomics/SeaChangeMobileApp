import React from 'react';
import { Dimensions, StyleSheet, View, ScrollView } from 'react-native';
import { Text } from 'react-native-elements';
import { Divider } from 'react-native-elements';
import ResizedImage from '../ResizedImage.js';
import MapView from "react-native-maps";
import moment from 'moment';

export default class EventsAbstraction extends React.Component {
    static navigationOptions = ({ navigation }) => ({
      title: navigation.state.params.myTitle,
    });

    constructor(props) {
      super(props);
    }

    componentDidMount() {
      //debugging
      console.log("inside ArticleAbstraction.js. Below is the props passed to it");
      console.log(this.props.navigation.getParam('eventsObject', {}));

      //This below is a method of passing data to the navigationOptions.
      //I think navigation.state is different from the component's state
      this.props.navigation.setParams({
        myTitle: this.props.navigation.getParam('eventsObject', {}).name
      });
    }

    render() {
      const eventsObject = this.props.navigation.getParam('eventsObject', {});

      if (!eventsObject.lat || !eventsObject["lng"]) {
      return (
          <ScrollView style={styles.container}>
          <View style={styles.imageContainer}>
            <ResizedImage
              source={(eventsObject.urlToImage != null)
                ? {uri: eventsObject.urlToImage}                      
                : require('../../img/place_holders/no-image-event.png')}
              margin={14}
            />
          </View>
          <Text style={{ marginBottom: 20 }}> {eventsObject.description} </Text>
          <Divider style={{ backgroundColor: '#dfe6e9' }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ marginBottom: 15 }}> {"Time:\n" + "   " + moment(startDate).format('LLLL') + "\n  To\n" + "   " + moment(endDate).format('LLLL')}</Text>
          </View>
          <Divider style={{ backgroundColor: '#dfe6e9' }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ marginBottom: 10 }}> {"Location:\n" + "   " + location + "," + city} </Text>
          </View>
          </ScrollView>
      );
      } else {
        return (
            <ScrollView style={styles.container}>
            <View style={styles.imageContainer}>
              <ResizedImage
                source={(eventsObject.urlToImage != null)
                  ? {uri: eventsObject.urlToImage}                      
                  : require('../../img/place_holders/no-image-event.png')}
                margin={14}
              />
            </View>

            <Text style={{ marginBottom: 20, marginLeft: 15 }}> {eventsObject.description} </Text>
            <Divider style={{ backgroundColor: '#dfe6e9' }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ marginBottom: 15, marginLeft: 15 }}> {"Time:\n" + "   " + moment(eventsObject.startDate).format('LLLL') + "\n  To\n" + "   " + moment(eventsObject.endDate).format('LLLL')}</Text>
            </View>
            <Divider style={{ backgroundColor: '#dfe6e9' }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ marginBottom: 10, marginLeft: 15 }}> {"Location:\n" + "   " + eventsObject.location + "," + eventsObject.city} </Text>
            </View>

            <View style={styles.mapContainer}>
              <MapView style={StyleSheet.absoluteFillObject} 
                initialRegion={{
                  latitude: eventsObject.lat,
                  longitude: eventsObject["lng"],
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
              <MapView.Marker
                  coordinate={{latitude: eventsObject.lat,
                  longitude: eventsObject["lng"]}}
                  title={eventsObject.name}
                  description={eventsObject.description}
              />
              </MapView>
            </View>
              </ScrollView>
        );
      }
    }
}

const styles = {
  container: {
    //alignItems: 'stretch',
    //justifyContent: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20, //adds space at the top so that the buttons don't go underneath the header
  },
  button: {
    height: 50,
    width: 250,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8, //BE CAREFUL: If the padding number is changed, remember to update the prop to ResizedImage.js
    paddingRight: 8,
    marginTop: 20,
  },
  titleContainer: {
    justifyContent: 'center',
    marginTop: 12,
    marginLeft: 14,
    marginRight: 14,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  summaryContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 14,
    marginRight: 14,
  },
  summary: {
    //textAlign: 'center',
  },
  mapContainer: {
    height: Dimensions.get("window").width - 14 * 2, //WARNING: This is for MapView to be rendered
    marginTop: 25,
    marginLeft: 14,
    marginRight: 14,
    backgroundColor: 'green',
  },
};
