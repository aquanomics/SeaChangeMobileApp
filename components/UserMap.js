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
import { getPosts } from './ServerRequests/nearbyPosts';
import { getEvents } from './ServerRequests/nearbyEvents';


import SlidingUpPanel from 'rn-sliding-up-panel';
//import Communications from 'react-native-communications';
const {height} = Dimensions.get('window')
const actionButtonOffsetY = 65

const NO_INTERNET_POPUP = 1
const NO_ARTICLES_POPUP = 2
const NO_POSTS_POPUP = 3
const NO_RESTAURANTS_POPUP = 4
const LOCATION_NOT_SET_POPUP = 5
const NO_EVENTS_POPUP = 6

const NO_INTERNET_POPUP_MESSAGE = "Please connect to the internet"
const NO_ARTICLES_POPUP_MESSAGE = "No articles in this area"
const NO_POSTS_POPUP_MESSAGE = "No posts in this area"
const NO_RESTAURANTS_POPUP_MESSAGE = "No restaurants in this area"
const NO_EVENTS_POPUP_MESSAGE = "No events in this area"
const LOCATION_NOT_SET_POPUP_MESSAGE = "Turn on your location settings"
const TRY_AGAIN_MESSAGE = "Try somewhere else?"

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
    this.state = {     
      region: {
        latitude: 56.130367,
        longitude: -106.346771,
        latitudeDelta: 40,
        longitudeDelta: 40
      },
      searchInfo: {},
      events: [],
      articles: [],
      restaurants: [],
      posts:[],
      result: null,
      isModalVisible: null,
    };
  }

  componentDidMount(){
    this.getInitialUserLocation(); 
    
    //TEMP SEARCH PARAMS
    //when we add a settings page these can be configurable
    var params = {
      lat: 53.760860,
      lng: -98.813873,
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
        isModalVisible: LOCATION_NOT_SET_POPUP         
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
    //console.log("region change");
    //console.log(region);
    this.setState({ region });
    //console.log("region change");
    //console.log("region.state");
  }
  getInitialUserLocation = () => {

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position.coords.latitude);
    
        this.setState({
          userLocation: {         
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        });
        console.log("setting user location");
        this.goToUserLocation();

      }, 
      (error) => {
        console.log(error);
      }
    );
  }
  getNewUserLocation = () => {

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position.coords.latitude);
    
        this.setState({
          userLocation: {         
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        });
        console.log("setting user location");
        this.goToUserLocation();

      }, 
      (error) => {
        console.log(error);
        this.setState({
          isModalVisible: LOCATION_NOT_SET_POPUP        
        });

      }
    );
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
    this.setState({restaurants:[],articles:[],posts:[], events:[]}); //clear articles from the marker state, so they don't show up on the map

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
    
    this.setState({restaurants:[],articles:[],posts:[], events:[]}); //clear articles from the marker state, so they don't show up on the map
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
              isModalVisible: NO_RESTAURANTS_POPUP          
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

  fetchPosts = () => {
    
    this.setState({restaurants:[],articles:[],posts:[], events:[]}); //clear articles from the marker state, so they don't show up on the map

    distance = this.getScreenDistance();
    
    var params = {lat:this.state.region.latitude, lng:this.state.region.longitude, distance};
    console.log(params);
    this.setSearchParameters(params);
  
    NetInfo.isConnected.fetch().then(isConnected => {
      if(isConnected)
      {
        getPosts(this.state.searchInfo.lat,this.state.searchInfo.lng,this.state.searchInfo.distance,this.state.searchInfo.limit).then(result => {
          this.setState({ posts:result, refreshing: false });
          if(result.length == 0){
            this.setState({
              isModalVisible: NO_POSTS_POPUP          
            });
          }
          console.log("Posts:");
          console.log(this.state.posts);
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

  fetchEvents = () => {
    
    this.setState({restaurants:[],articles:[],posts:[], events:[]}); //clear articles from the marker state, so they don't show up on the map

    distance = this.getScreenDistance();
    
    var params = {lat:this.state.region.latitude, lng:this.state.region.longitude, distance};
    console.log(params);
    this.setSearchParameters(params);
  
    NetInfo.isConnected.fetch().then(isConnected => {
      if(isConnected)
      {
        getEvents(this.state.searchInfo.lat,this.state.searchInfo.lng,this.state.searchInfo.distance,this.state.searchInfo.limit).then(result => {
          this.setState({ events: result, refreshing: false });
          if(result.length == 0){
            this.setState({
              isModalVisible: NO_EVENTS_POPUP          
            });
          }
          console.log("Events:");
          console.log(this.state.events);
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

  renderImage(image_url){
    console.log("callout");
    if (Platform.OS === 'ios') {
     console.log("ios");
      return (<Image
        source={{ uri: ((image_url) ? image_url : "") }} resizeMode={"cover"}
        style={{
        width: 145, //static for now...
        height: 110 
      }}/>);
    }
    else return;
  }
    
  renderModal(type, heading, subheading){
    return(
    <View>
      <Modal isVisible={this.state.isModalVisible === type}>      
        <View style={styles.modalContent}>
          <Text style={{fontWeight: "bold"}}>{heading}</Text>
          <Text>{subheading}</Text>

          <TouchableOpacity 
            onPress={() => this.setState({ isModalVisible: null })}>
            <View style={styles.button}>
              <Text>Close</Text>
            </View>
          </TouchableOpacity>            
        </View>
      </Modal>
    </View>
    )
  }

  renderActionButton(){
    return(
      <ActionButton buttonColor="rgba(255,255,255,1)" buttonTextStyle={{color:'#3B3BD4'}} offsetY={actionButtonOffsetY}>
          <ActionButton.Item buttonColor='#3B3BD4' onPress={this.getNewUserLocation}>
              <Icon name="md-locate" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#3B3BD4' onPress={this.fetchPosts}>
              <Icon name="md-images" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#3B3BD4'  onPress={this.fetchRestaurants}>
            <Icon name="md-restaurant" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#3B3BD4' onPress={this.fetchArticles}>
              <Icon name="md-list" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#3B3BD4' onPress={this.fetchEvents}>
              <Icon name="md-calendar" style={styles.actionButtonIcon} />
          </ActionButton.Item>

      </ActionButton>
    )
  }
  renderPanel(){
    return(
      <SlidingUpPanel
        visible
        startCollapsed
        showBackdrop={false}
        minimumDistanceThreshold={10}
        draggableRange={this.props.draggableRange}
        onDrag={v => this._draggedValue.setValue(v)}     
        >
        <View style={styles.panel}>
          <Icon style={styles.dropup} size={30} name='ios-arrow-dropup' />

          <View style={styles.menu}>
            <View style={styles.menuRow}>
              <MenuButton iconName="md-calendar" buttonTitle="Events" onClick={() => this.props.navigation.navigate('Events')}></MenuButton>
              <MenuButton iconName="md-list" buttonTitle="Articles" onClick={() => this.props.navigation.navigate('Articles')}></MenuButton>
              <MenuButton iconName="ios-images" buttonTitle="Posts" onClick={() => this.props.navigation.navigate('Posts')}></MenuButton>
            </View>
            <View style={styles.menuRow}>
              <MenuButton iconName="md-settings" buttonTitle="Settings" onClick={() => console.log('TODO: settings page tapped')}></MenuButton>
              <MenuButton iconName="md-person" buttonTitle="Profile" onClick={() => this.props.navigation.navigate('Profile')}></MenuButton>
              <MenuButton iconName="ios-boat" buttonTitle="Fish" onClick={() => this.props.navigation.navigate('Fish')}></MenuButton>
            </View>
          </View>
        </View>
      </SlidingUpPanel>
    )
  }

  render(){

    return (  
    <View style={{ flex: 1 }}>

      {this.renderModal(NO_INTERNET_POPUP,NO_INTERNET_POPUP_MESSAGE)}
      {this.renderModal(NO_ARTICLES_POPUP,NO_ARTICLES_POPUP_MESSAGE, TRY_AGAIN_MESSAGE)}
      {this.renderModal(NO_RESTAURANTS_POPUP,NO_RESTAURANTS_POPUP_MESSAGE, TRY_AGAIN_MESSAGE)}
      {this.renderModal(NO_POSTS_POPUP,NO_POSTS_POPUP_MESSAGE,TRY_AGAIN_MESSAGE)}
      {this.renderModal(LOCATION_NOT_SET_POPUP,LOCATION_NOT_SET_POPUP_MESSAGE)}
      {this.renderModal(NO_EVENTS_POPUP,NO_EVENTS_POPUP_MESSAGE)}

      <MapView style={{ flex: 1 }} 
        region={this.state.region} 
        onRegionChangeComplete={this.onRegionChange}
        showsUserLocation={true} 
      >
        {this.state.articles.map(marker => (
          <MapView.Marker
              coordinate={{latitude:marker.lat,
                longitude:marker.lng}}
              title={marker.title}
              description={marker.description}
              image={require('../img/map_icons/article-marker-wide6.png')}
              >
              <MapView.Callout style={styles.plainView} onPress= {() => {this.props.navigation.navigate('ArticleAbstraction', {articleObject: marker});}}>            
                <View>
                  {this.renderImage(marker.urlToImage)}
                  <Text style={{fontSize:16}} numberOfLines={2}>{marker.title}</Text>

                </View>
              </MapView.Callout>
          </MapView.Marker>
        ))}
        {this.state.restaurants.map(marker => (
          <MapView.Marker
              coordinate={{latitude:marker.latitude,
                longitude:marker.longitude}}
              title={marker.partner_name}
              description={marker.address_1}
              image={require('../img/map_icons/restaurant-icon-wide.png')}
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
        {this.state.posts.map(marker => (
          <MapView.Marker
              coordinate={{latitude:marker.lat,
                longitude:marker.lng}}
              title={marker.name}
              description={marker.comment}
              image={require('../img/map_icons/post-marker-wide.png')}
              >
              <MapView.Callout style={styles.plainView} onPress= {() => {this.props.navigation.navigate('ObservationDetails', {postObject: marker});}}>            
                <View>
                  {this.renderImage(marker.urlToImage)}
                  <Text style={{fontSize:16}} numberOfLines={2}>{marker.comment}</Text>

                </View>
              </MapView.Callout>
          </MapView.Marker>
        ))}
        {this.state.events.map(marker => (
          <MapView.Marker
              coordinate={{latitude:marker.lat,
                longitude:marker.lng}}
              title={marker.name}
              description={marker.description}
              image={require('../img/map_icons/event-marker.png')}
              >
              <MapView.Callout style={styles.plainView} onPress= {() => {this.props.navigation.navigate('EventsAbstraction', {eventsObject: marker});}}>            
                <View>
                  {this.renderImage(marker.urlToImage)}
                  <Text style={{fontSize:16}} numberOfLines={1}>{marker.name}</Text>
                  <Text style={{fontSize:16}} numberOfLines={2}>{marker.description}</Text>

                </View>
              </MapView.Callout>
          </MapView.Marker>
        ))}


      </MapView>
      {this.renderActionButton()}
      {this.renderPanel()}
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
    actionButtonIcon: {
      fontSize: 20,
      height: 20,
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
