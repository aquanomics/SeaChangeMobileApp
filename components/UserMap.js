import React, {Component} from "react";
import {View, Button, StyleSheet,Text ,TouchableOpacity,TouchableHighlight,Dimensions,Animated} from "react-native";
import MapView,{ Marker } from "react-native-maps";
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import MenuButton from './MenuButton'
import { NetInfo } from 'react-native';
import Modal from "react-native-modal";


const haversine = require('haversine');
import { getArticles } from './ServerRequests/nearbyArticles';

import SlidingUpPanel from 'rn-sliding-up-panel'

const {height} = Dimensions.get('window')
const actionButtonOffsetY = 65

export default class UserMap extends Component{

  static defaultProps = {
    draggableRange: {
      //top: height / 1.75,
      top: 320, // make this flexible to screen size later
      bottom: 140
    }
  }

  _draggedValue = new Animated.Value(-120)

  state = {
    userLocation: null,
    region: null,
    events: [],
    articles: [],
    //searchInfo: {},
    result: null,
    isModalVisible: null,
  }
  
  constructor(props){
    super(props);
    this.state = {     
      region: {
        latitude: 37.68825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      searchInfo: {},
      events: [],
      articles: [],

     
    };

    this.getNewUserLocation(); 

    //TEMP SEARCH PARAMS
    //DEFAULT SEARCH AREA FOR NOW
    var params = {
      lat: 49.190077,
      long: -123.103008,
      distance: 100,
      limit: 5
    };
    this.setSearchParameters(params);

  }
  
  getMinMaxLat = () =>{
    var lowest = Number.POSITIVE_INFINITY;
    var highest = Number.NEGATIVE_INFINITY;
    var tmp;
    console.log(this.state.articles.length);
    for (var i=this.state.articles.length-1; i>=0; i--) {
      tmp = this.state.articles[i].lat;
      if (tmp < lowest) lowest = tmp;
      if (tmp > highest) highest = tmp;
    }
    return([highest,lowest]);
  }

  getMinMaxLong = () =>{  
    var lowest = Number.POSITIVE_INFINITY;
    var highest = Number.NEGATIVE_INFINITY;
    var tmp;
    for (var i=this.state.articles.length-1; i>=0; i--) {
      tmp = this.state.articles[i].long;
      if (tmp < lowest) lowest = tmp;
      if (tmp > highest) highest = tmp;
    }
    return([highest,lowest]);
  }
  /*
  fitToArticles = () => {
    latrange = this.getMinMaxLat();
    longrange = this.getMinMaxLong();
    
    lat = (latrange[0] + latrange[1])/2;
    long = (longrange[0] + longrange[1])/2;
    latD = latrange[0] - latrange[1];
    longD = longrange[0] - longrange[1] + .02;
    var region = {
      latitude:lat,
      longitude:long,
      latitudeDelta: latD,
      longitudeDelta: longD
    };
    this.setRegion(region);
  }
  */
  getMapCenter = () => {
    return {
      latitude: this.state.region.latitude,
      longitude: this.state.region.longitude
    };
  }

  goToUserLocation = () => {

    this.setRegion({
      latitude: this.state.userLocation.latitude,
      longitude: this.state.userLocation.longitude,
      latitudeDelta: this.state.region.latitudeDelta,
      longitudeDelta: this.state.region.longitudeDelta
    });
  }

  setRegion = (position) =>{
    this.setState({  
      region: {         
        latitude: position.latitude,
        longitude: position.longitude,
        latitudeDelta: position.latitudeDelta,
        longitudeDelta: position.longitudeDelta
      }
    });
  }

  getEvents = (radius,location) => {

  }

  onRegionChange = (region) => {
    //console.log("region change:");
    //console.log(region);
    this.setState({ region });
  }

  getNewUserLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      console.log(position.coords.latitude);
   
      this.setState({
        userLocation: {         
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        region:{
          latitude: 49.190077,
          longitude: -123.103008,
          latitudeDelta: this.state.region.latitudeDelta,
          longitudeDelta: this.state.region.longitudeDelta
        }
      });
      //TEMP
      this.goToUserLocation();

    }, error => console.log("Error fetching location"))
  }

  setSearchParameters = (params) => {
    if("lat" in params) {
      this.state.searchInfo.lat = params.lat;
    }
    if("long" in params) {
      this.state.searchInfo.long = params.long;
    }
    if("distance" in params) {
      this.state.searchInfo.distance = params.distance;
    }
    if("limit" in params) {
      this.state.searchInfo.limit = params.limit;
    }
  }

  calcDistance = (loc1,loc2) => {
    return haversine(loc1, loc2)
  }

  fetchArticles = () => {
    let loc1 = {
      latitude:this.state.region.latitude,
      longitude:this.state.region.longitude
    }
    let loc2 = {
      latitude:this.state.region.latitude,
      longitude:(this.state.region.longitude + this.state.region.longitudeDelta)
    }
    let distance = this.calcDistance(loc1,loc2)/2;
    //let distance = 30;
    //console.log("DISTANCE");
    console.log(distance);
 
    var params = {lat:this.state.region.latitude, long:this.state.region.longitude,distance};
    console.log(params);
    this.setSearchParameters(params);
  
    NetInfo.isConnected.fetch().then(isConnected => {
      if(isConnected)
      {
        getArticles(this.state.searchInfo.lat,this.state.searchInfo.long,this.state.searchInfo.distance,this.state.searchInfo.limit).then(result => {
          this.setState({ articles:result, refreshing: false });
          if(result.length == 0){
            this.setState({
              isModalVisible: 2           
            });
          }
          console.log("RES2");
          console.log(this.state.articles);
        });  
      }
      else{
        console.log("Internet is not connected");
        this.setState({
          isModalVisible: 1           
        });
      }
    }).catch((error) => console.log(error));
    
  }
 
  _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });

  render(){
    //console.log(this.state.userLocation);
    return (
    
    <View style={{ flex: 1 }}>

      <View>
        <Modal isVisible={this.state.isModalVisible === 1}>      
          <View style={styles.modalContent}>
            <Text>Please Connect to the Internet</Text>
            <TouchableOpacity 
              onPress={() => this.setState({ isModalVisible: null })}>
              <View style={styles.button}>
                <Text>Close</Text>
              </View>
            </TouchableOpacity>            
          </View>
        </Modal>
      </View>

      <View>
        <Modal isVisible={this.state.isModalVisible === 2}>       
          <View style={styles.modalContent}>
            <Text>No articles in this Area</Text>
            <Text>Try somewhere else?</Text>
            <TouchableOpacity 
              onPress={() => this.setState({ isModalVisible: null })}>          
              <View style={styles.button}>
                <Text>Close</Text>
              </View>
            </TouchableOpacity>           
          </View>
        </Modal>
      </View>

      <MapView style={{ flex: 1 }} 
        initialRegion={{
          latitude: 37.68825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}   
        region={this.state.region} 
        onRegionChangeComplete={this.onRegionChange}
        showsUserLocation={true}  
      >
        {this.state.articles.map(marker => (
          <MapView.Marker
              coordinate={{latitude:marker.lat,
                longitude:marker.long}}
              title={marker.title}
              description={marker.description}>
              <MapView.Callout style={styles.plainView} onPress= {() => {this.props.navigation.navigate('ArticleAbstraction', {articleObject: marker});}}>            
                <View>
                  <Text numberOfLines={2}>{marker.title}{"\n"}{marker.description}</Text>
                </View>
              </MapView.Callout>
          </MapView.Marker>
        ))}
      </MapView>

      <ActionButton buttonColor="rgba(255,255,255,1)" buttonTextStyle={{color:'#3498db'}} offsetY={actionButtonOffsetY}>
          <ActionButton.Item buttonColor='#3498db'  onPress={() => console.log("notes tapped!")}>
              <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#3498db' onPress={this.fetchArticles}>
              <Icon name="md-paper" style={styles.actionButtonIcon} />
          </ActionButton.Item>
      </ActionButton>

      <SlidingUpPanel
        visible
        startCollapsed
        showBackdrop={false}
        ref={c => this._panel = c}
        draggableRange={this.props.draggableRange}
        onDrag={v => this._draggedValue.setValue(v)}>
        <View style={styles.panel}>
          <Icon style={styles.dropup} size={30} name='ios-arrow-dropup' />

          <View style={styles.menu}>
            <View style={styles.menuRow}>
              <MenuButton iconName="md-calendar" buttonTitle="Events" onClick={() => this.props.navigation.navigate('Events')}></MenuButton>
              <MenuButton iconName="md-paper" buttonTitle="Articles" onClick={() => this.props.navigation.navigate('Articles')}></MenuButton>
              <MenuButton iconName="ios-cloud-upload" buttonTitle="Posts" onClick={() => this.props.navigation.navigate('Posts')}></MenuButton>
            </View>
            <View style={styles.menuRow}>
              <MenuButton iconName="md-settings" buttonTitle="Settings" onClick={() => this.props.navigation.navigate('Settings')}></MenuButton>
              <MenuButton iconName="md-person" buttonTitle="Profile" onClick={() => this.props.navigation.navigate('Posts')}></MenuButton>
              <MenuButton iconName="ios-boat" buttonTitle="Fishes" onClick={() => this.props.navigation.navigate('Fishes')}></MenuButton>
            </View>
          </View>
        </View>
      </SlidingUpPanel>
    </View>
    );
  }
}

const styles = StyleSheet.create({
    modalContent: {
      backgroundColor: "white",
      padding: 22,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 4,
      borderColor: "rgba(0, 0, 0, 0.1)"
    },
    dropup: {
      //alignItems:"center",
      //justifyContent: "center",
      marginTop: 10,
      
    },
    panel: {
      flex: 1,
      backgroundColor: 'white',
      alignItems:"center",
      position: 'relative',
      marginLeft: 20,
      marginRight: 20,
      borderRadius: 10
    },
    panelHeader: {
      height: 120,
      backgroundColor: '#b197fc',
      alignItems: 'center',
      justifyContent: 'center'
    },
    actionButtonIcon: {
      fontSize: 20,
      height: 22,
      color: 'white',
    },
    menu: {
      marginTop: 10,
    },
    menuRow: {
      flexDirection: 'row',
      justifyContent: 'center', 
      alignItems: 'center'
    },
    plainView: {
      width: 100
    }
});

