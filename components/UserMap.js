import React, {Component} from "react";
import {Platform, View, Button, StyleSheet,Text ,TouchableOpacity,TouchableHighlight,Dimensions,Animated,Image, Linking} from "react-native";
import MapView,{ Marker } from "react-native-maps";
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import MenuButton from './MenuButton'
import { NetInfo } from 'react-native';
import Modal from "react-native-modal";


const haversine = require('haversine');
import { getArticles } from './ServerRequests/nearbyArticles';
import { getRestaurants } from './ServerRequests/nearbyRestaurants';

import SlidingUpPanel from 'rn-sliding-up-panel';
//import Communications from 'react-native-communications';
const {height} = Dimensions.get('window')
const actionButtonOffsetY = 65

const NO_INTERNET_POPUP = 1
const NO_ARTICLES_POPUP = 2
const NO_RESTAURANTS_POP = 3
const LOCATION_NOT_SET_POP = 4

export default class UserMap extends Component{

  static defaultProps = {
    draggableRange: {
      //top: height / 1.75,
      top: 320, // make this flexible to screen size later
      bottom: 140
    }
  }

  _draggedValue = new Animated.Value(-120)

  //state = {}
  
  constructor(props){
    super(props);
    console.log("why")
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
      restaurants: [],
      result: null,
      isModalVisible: null,
    };
    
    
  }

  componentDidMount(){
    this.getNewUserLocation(); 
    
    //TEMP SEARCH PARAMS
    //when we add a settings page these can be configurable
    var params = {
      lat: 49.190077,
      lng: -123.103008,
      distance: 100,
      limit: 40
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
      tmp = this.state.articles[i].lng;
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
    console.log("GO TO USER LOCATION")
    if(!this.state.userLocation){
      this.setState({
        isModalVisible: LOCATION_NOT_SET_POP         
      });
    }
    else if(this.state.region){
      this.setRegion({
        latitude: this.state.userLocation.latitude,
        longitude: this.state.userLocation.longitude,
        latitudeDelta: this.state.region.latitudeDelta,
        longitudeDelta: this.state.region.longitudeDelta
      });
    }
    else{
      this.setRegion({
        latitude: this.state.userLocation.latitude,
        longitude: this.state.userLocation.longitude,
        latitudeDelta: .09,
        longitudeDelta: .04
      });
    }
      
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

  onRegionChange = (region) => {
    console.log("region change");
    console.log(region);
    this.setState({ region });
    console.log("region change");
    console.log("region.state");
  }

  getNewUserLocation = () => {

    navigator.geolocation.getCurrentPosition(position => {
      console.log(position.coords.latitude);
   
      this.setState({
        userLocation: {         
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
      });

      this.goToUserLocation();

    }, error => console.log("Error fetching location"))
  }

  setSearchParameters = (params) => {
    if("lat" in params) {
      this.state.searchInfo.lat = params.lat;
    }
    if("lng" in params) {
      this.state.searchInfo.lng = params.lng;
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

  /**
   * calculates rough radius or search from how zoomed in the map is on the screen
   */
  getScreenDistance = () => {
    let loc1 = {
      latitude:this.state.region.latitude,
      longitude:this.state.region.longitude
    }
    let loc2 = {
      latitude:this.state.region.latitude,
      longitude:(this.state.region.longitude + this.state.region.longitudeDelta)
    }
    return distance = this.calcDistance(loc1,loc2)/2;
  }
  
  fetchArticles = () => {  
    this.setState({restaurants:[]}); //clear articles from the marker state, so they don't show up on the map

    distance = this.getScreenDistance();
    var params = {lat:this.state.region.latitude, lng:this.state.region.longitude, distance};
    console.log(params);
    this.setSearchParameters(params);
  
    NetInfo.isConnected.fetch().then(isConnected => {
      if(isConnected)
      {
        getArticles(this.state.searchInfo.lat,this.state.searchInfo.lng,this.state.searchInfo.distance,this.state.searchInfo.limit).then(result => {
          this.setState({ articles:result, refreshing: false });
          if(result.length == 0){
            this.setState({
              isModalVisible: NO_ARTICLES_POPUP           
            });
          }
          console.log("Articles:");
          console.log(this.state.articles);
        });  
      }
      else{
        console.log("Internet is not connected");
        this.setState({
          isModalVisible: NO_INTERNET_POPUP           
        });
      }
    }).catch((error) => console.log(error));
    
  }
  fetchRestaurants = () => {
    
    this.setState({articles:[]}); //clear articles from the marker state, so they don't show up on the map


    distance = this.getScreenDistance();
    
    var params = {lat:this.state.region.latitude, lng:this.state.region.longitude, distance};
    console.log(params);
    this.setSearchParameters(params);
  
    NetInfo.isConnected.fetch().then(isConnected => {
      if(isConnected)
      {
        getRestaurants(this.state.searchInfo.lat,this.state.searchInfo.lng,this.state.searchInfo.distance,this.state.searchInfo.limit).then(result => {
          this.setState({ restaurants:result, refreshing: false });
          if(result.length == 0){
            this.setState({
              isModalVisible: NO_RESTAURANTS_POP          
            });
          }
          console.log("Restaurants:");
          console.log(this.state.restaurants);
        });  
      }
      else{
        console.log("Internet is not connected");
        this.setState({
          isModalVisible: NO_INTERNET_POPUP         
        });
      }
    }).catch((error) => console.log(error));
    
  }

 
  _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });

  renderImage(marker){
    console.log("callout");
    if (Platform.OS === 'ios') {
     console.log("ios");
      return (<Image
        source={{ uri: ((marker.urlToImage) ? marker.urlToImage : "") }} resizeMode={"cover"}
        style={{
        width: 145, //static for now...
        height: 110 
      }}/>);
    }
    else return;
  }
    
  render(){
    /*
    if(this.state.region){
      console.log("region")
      console.log(this.state.region)

    }
    else{
      console.log("region not initialized yet")
    }*/


    return (
    
    <View style={{ flex: 1 }}>

      <View>
        <Modal isVisible={this.state.isModalVisible === NO_INTERNET_POPUP}>      
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
        <Modal isVisible={this.state.isModalVisible === NO_ARTICLES_POPUP}>       
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

      <View>
        <Modal isVisible={this.state.isModalVisible === NO_RESTAURANTS_POP}>       
          <View style={styles.modalContent}>
            <Text>No restaurants in this Area</Text>
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

      <View>
        <Modal isVisible={this.state.isModalVisible === LOCATION_NOT_SET_POP}>       
          <View style={styles.modalContent}>
            <Text>Turn on your location settings!</Text>
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

        region={this.state.region} 
        onRegionChangeComplete={this.onRegionChange}
        showsUserLocation={true} 
        //customMapStyle={mapStyle} 
        //provider={PROVIDER_GOOGLE}
      >
        {this.state.articles.map(marker => (
          <MapView.Marker
              coordinate={{latitude:marker.lat,
                longitude:marker.lng}}
              title={marker.title}
              description={marker.description}
              image={require('../img/map_icons/marker.png')}
              >
              <MapView.Callout style={styles.plainView} onPress= {() => {this.props.navigation.navigate('ArticleAbstraction', {articleObject: marker});}}>            
                <View>
                  {this.renderImage(marker)}
                  <Text style={{fontSize:16}} numberOfLines={2}>{marker.title}</Text>

                </View>
              </MapView.Callout>
          </MapView.Marker>
        ))}
        {this.state.restaurants.map(marker => (
          <MapView.Marker
              coordinate={{latitude:marker.latitude, //consistent naming is nessesary
                longitude:marker.longitude}}
              title={marker.partner_name}
              description={marker.address_1}
              image={require('../img/map_icons/marker.png')}
              >
              <MapView.Callout style={styles.plainView} onPress={()=>{(marker.phone_number == "") ? console.log("no num"):Linking.openURL("tel:18008675309")}}>            
                <View>
                  <Text numberOfLines={2} style={{fontSize:18}}>{marker.partner_name}{"\n"}</Text>
                  <Text >{"Address: "}{marker.address_1}</Text>
                  <Text >{"#: "}{marker.phone_number}</Text>
                
                </View>
              </MapView.Callout>
          </MapView.Marker>
        ))}
      </MapView>

      <ActionButton buttonColor="rgba(255,255,255,1)" buttonTextStyle={{color:'#3B3BD4'}} offsetY={actionButtonOffsetY}>
          <ActionButton.Item buttonColor='#3B3BD4' onPress={this.goToUserLocation}>
              <Icon name="md-locate" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#3B3BD4'  onPress={this.fetchRestaurants}>
              <Icon name="md-pizza" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#3B3BD4' onPress={this.fetchArticles}>
              <Icon name="md-paper" style={styles.actionButtonIcon} />
          </ActionButton.Item>

      </ActionButton>

      <SlidingUpPanel
        visible
        startCollapsed
        showBackdrop={false}
        ref={c => this._panel = c}
        draggableRange={this.props.draggableRange}
        onDrag={v => this._draggedValue.setValue(v)}
        minimunDistanceThreshold={0.5}
        >
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
      height: 26,
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
      width: 150
    }
});

