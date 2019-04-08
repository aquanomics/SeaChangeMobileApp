/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  Platform, View, StyleSheet, Text, TouchableOpacity, Dimensions, Animated, Image, Linking, NetInfo
} from 'react-native';
import MapView from 'react-native-maps';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { getNearby } from './ServerRequests/getNearby';
import MenuButton from './MenuButton';

const haversine = require('haversine');

const actionButtonOffsetY = 65;

const ARTICLES = 1;
const RESTAURANTS = 2;
const POSTS = 3;
const EVENTS = 4;

const NO_INTERNET_POPUP = 1;
const NO_ARTICLES_POPUP = 2;
const NO_POSTS_POPUP = 3;
const NO_RESTAURANTS_POPUP = 4;
const LOCATION_NOT_SET_POPUP = 5;
const NO_EVENTS_POPUP = 6;

const NO_INTERNET_POPUP_MESSAGE = 'Please connect to the internet';
const NO_ARTICLES_POPUP_MESSAGE = 'No articles in this area';
const NO_POSTS_POPUP_MESSAGE = 'No posts in this area';
const NO_RESTAURANTS_POPUP_MESSAGE = 'No restaurants in this area';
const NO_EVENTS_POPUP_MESSAGE = 'No events in this area';
const LOCATION_NOT_SET_POPUP_MESSAGE = 'Turn on your location settings';

export default class UserMap extends Component {
  static navigationOptions = () => ({
    header: null, // gets rid of react-native-navigation library's header. We do this because we're using <Header /> from react-native-elements instead
  });

  static defaultProps = {
    draggableRange: {
      // top: height / 1.75,
      top: 240, // make this flexible to screen size later
      bottom: 75
    }
  }

  _draggedValue = new Animated.Value(-120)

  // state = {}

  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 49.2827,
        longitude: 123.1207,
        latitudeDelta: .05,
        longitudeDelta: .09
      },
      searchInfo: {},
      events: [],
      articles: [],
      restaurants: [],
      posts: [],
      isModalVisible: null,
      settingsObject: {
        searchUserArea: false,
        setCustomRadius: false,
        customSearchRadius: 1,
        maxSearchResults: 50
      }
    };
  }

  componentDidMount() {
    // TEMP SEARCH PARAMS
    // when we add a settings page these can be configurable
    const params = {
      lat: 53.760860,
      lng: -98.813873,
      distance: 100,
      limit: 40
    };
    this.setSearchParameters(params);
  }

  handleSettingsPageChange = (settingsObject) => {
    this.setState({
      settingsObject: {
        searchUserArea: settingsObject.searchUserArea,
        setCustomRadius: settingsObject.setCustomRadius,
        customSearchRadius: settingsObject.customSearchRadius,
        maxSearchResults: settingsObject.maxSearchResults
      }
    });
    console.log('New State:');
    console.log(settingsObject);
  }

  getMapCenter = () => ({
    latitude: this.state.region.latitude,
    longitude: this.state.region.longitude
  })

  goToUserLocation = () => {
    console.log('GO TO USER LOCATION');
    if (!this.state.userLocation) {
      this.setState({
        isModalVisible: LOCATION_NOT_SET_POPUP
      });
    } else if (this.state.region) {
      this.setRegion({
        latitude: this.state.userLocation.latitude,
        longitude: this.state.userLocation.longitude,
        latitudeDelta: this.state.region.latitudeDelta,
        longitudeDelta: this.state.region.longitudeDelta
      });
    } else {
      this.setRegion({
        latitude: this.state.userLocation.latitude,
        longitude: this.state.userLocation.longitude,
        latitudeDelta: 0.09,
        longitudeDelta: 0.04
      });
    }
  }

  setRegion = (position) => {
    this.setState({
      region: {
        latitude: position.latitude,
        longitude: position.longitude,
        latitudeDelta: position.latitudeDelta,
        longitudeDelta: position.longitudeDelta
      }
    });
  }

  getInitialUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position.coords.latitude);

        this.setState({
          userLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05
          }
        });
        console.log('setting user location');
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
        console.log('setting user location');
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
    if ('lat' in params) {
      this.state.searchInfo.lat = params.lat;
    }
    if ('lng' in params) {
      this.state.searchInfo.lng = params.lng;
    }
    if ('distance' in params) {
      this.state.searchInfo.distance = params.distance;
    }
    if ('limit' in params) {
      this.state.searchInfo.limit = params.limit;
    }
  }

  // MAP EVENT HANDLERS
  onRegionChange = (region) => {
    this.setState({ region });
  }

  onMapReady = () => {
    this.getInitialUserLocation();
  }

  /**
   * calculates rough radius or search from how zoomed in the map is on the screen
   */
  getScreenDistance = () => {
    const loc1 = {
      latitude: this.state.region.latitude,
      longitude: this.state.region.longitude
    };
    const loc2 = {
      latitude: this.state.region.latitude,
      longitude: (this.state.region.longitude + this.state.region.longitudeDelta)
    };
    return this.calcDistance(loc1, loc2) / 2;
  }

  calcDistance = (loc1, loc2) => haversine(loc1, loc2)

  /*
    Methods for fetching data from DB
  */
  fetchArticles = () => {
    this.fetchData('getNearbyArticles', ARTICLES);
  }

  fetchRestaurants = () => {
    this.fetchData('getNearbyRestaurants', RESTAURANTS);
  }

  fetchPosts = () => {
    this.fetchData('getNearbyPosts', POSTS);
  }

  fetchEvents = () => {
    this.fetchData('getNearbyEvents', EVENTS);
  }

  fetchData = (queryName, dataType) => {
    this.setState({
      restaurants: [], articles: [], posts: [], events: []
    });
    let distance = this.getScreenDistance();
    if (this.state.settingsObject.setCustomRadius) {
      distance = this.state.settingsObject.customSearchRadius;
    }
    const limit = this.state.settingsObject.maxSearchResults;
    let lat = this.state.region.latitude;
    let lng = this.state.region.longitude;

    if (this.state.settingsObject.searchUserArea) { // add internet check
      if (this.state.userLocation) {
        lat = this.state.userLocation.latitude;
        lng = this.state.userLocation.longitude;
      } else {
        this.setState({
          isModalVisible: LOCATION_NOT_SET_POPUP
        });
        return;
      }
    }
    const params = {
      lat, lng, distance, limit
    };
    console.log(params);
    this.setSearchParameters(params);

    NetInfo.isConnected.fetch().then((isConnected) => {
      if (isConnected) {
        getNearby(queryName, this.state.searchInfo.lat, this.state.searchInfo.lng, this.state.searchInfo.distance, this.state.searchInfo.limit).then((result) => {
          if (dataType === ARTICLES) {
            this.setState({ articles: result, refreshing: false });
            if (result.length === 0) {
              this.setState({
                isModalVisible: NO_ARTICLES_POPUP
              });
            }
          } else if (dataType === RESTAURANTS) {
            this.setState({ restaurants: result, refreshing: false });
            if (result.length === 0) {
              this.setState({
                isModalVisible: NO_RESTAURANTS_POPUP
              });
            }
          } else if (dataType === POSTS) {
            this.setState({ posts: result, refreshing: false });
            if (result.length === 0) {
              this.setState({
                isModalVisible: NO_POSTS_POPUP
              });
            }
          } else if (dataType === EVENTS) {
            this.setState({ events: result, refreshing: false });
            if (result.length === 0) {
              this.setState({
                isModalVisible: NO_EVENTS_POPUP
              });
            }
          }
          console.log('Data:');
          console.log(result);
        });
      } else {
        console.log('Internet is not connected');
        this.setState({
          isModalVisible: NO_INTERNET_POPUP
        });
      }
    }).catch(error => console.log(error));
  }

  _toggleModal = () => this.setState({ isModalVisible: !this.state.isModalVisible });

  renderImage(image_url) {
    console.log('callout');
    if (Platform.OS === 'ios') {
      console.log('ios');
      return (
        <Image
          source={{ uri: ((image_url) || '') }}
          resizeMode="cover"
          style={{
            width: 145, // static for now...
            height: 110
          }}
        />
      );
    }
  }

  renderModal(type, heading, subheading) {
    return (
      <View>
        <Modal isVisible={this.state.isModalVisible === type}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: 'bold' }}>{heading}</Text>
            <Text>{subheading}</Text>

            <TouchableOpacity
              onPress={() => this.setState({ isModalVisible: null })}
            >
              <View style={styles.button}>
                <Text>Close</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }

  renderActionButton() {
    return (
      <ActionButton buttonColor="rgba(255,255,255,1)" buttonTextStyle={{ color: '#3B3BD4' }} offsetY={actionButtonOffsetY}>
        <ActionButton.Item buttonColor="#3B3BD4" onPress={this.getNewUserLocation}>
          <Icon name="md-locate" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item buttonColor="#3B3BD4" onPress={this.fetchPosts}>
          <Icon name="md-images" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item buttonColor="#3B3BD4" onPress={this.fetchRestaurants}>
          <Icon name="md-restaurant" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item buttonColor="#3B3BD4" onPress={this.fetchArticles}>
          <Icon name="md-list" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item buttonColor="#3B3BD4" onPress={this.fetchEvents}>
          <Icon name="md-calendar" style={styles.actionButtonIcon} />
        </ActionButton.Item>

      </ActionButton>
    );
  }

  renderPanel() {
    return (
      <SlidingUpPanel
        visible
        startCollapsed
        showBackdrop={false}
        minimumDistanceThreshold={10}
        draggableRange={this.props.draggableRange}
        onDrag={v => this._draggedValue.setValue(v)}
      >
        <View style={styles.panel}>
          <Icon style={styles.dropup} size={30} name="ios-arrow-dropup" />

          <View style={styles.menu}>
            <View style={styles.menuRow}>
              <MenuButton iconName="md-calendar" buttonTitle="Events" onClick={() => this.props.navigation.navigate('Events')} />
              <MenuButton iconName="md-list" buttonTitle="Articles" onClick={() => this.props.navigation.navigate('Articles')} />
              <MenuButton iconName="ios-images" buttonTitle="Posts" onClick={() => this.props.navigation.navigate('Posts')} />
            </View>
            <View style={styles.menuRow}>
              <MenuButton iconName="md-settings" buttonTitle="Settings" onClick={() => this.props.navigation.navigate('Settings', { settingsObject: this.state.settingsObject, onSettingsChange: this.handleSettingsPageChange })} />
              <MenuButton iconName="md-person" buttonTitle="Profile" onClick={() => this.props.navigation.navigate('Profile')} />
              <MenuButton iconName="ios-boat" buttonTitle="Fish" onClick={() => this.props.navigation.navigate('Fish')} />
            </View>
          </View>
        </View>
      </SlidingUpPanel>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>

        {this.renderModal(NO_INTERNET_POPUP, NO_INTERNET_POPUP_MESSAGE)}
        {this.renderModal(NO_ARTICLES_POPUP, NO_ARTICLES_POPUP_MESSAGE)}
        {this.renderModal(NO_RESTAURANTS_POPUP, NO_RESTAURANTS_POPUP_MESSAGE)}
        {this.renderModal(NO_POSTS_POPUP, NO_POSTS_POPUP_MESSAGE)}
        {this.renderModal(LOCATION_NOT_SET_POPUP, LOCATION_NOT_SET_POPUP_MESSAGE)}
        {this.renderModal(NO_EVENTS_POPUP, NO_EVENTS_POPUP_MESSAGE)}

        <MapView
          style={{ flex: 1 }}
          region={this.state.region}
          onRegionChangeComplete={this.onRegionChange}
          onMapReady={this.onMapReady}
          rotateEnabled={false}
          showsUserLocation
        >
          {this.state.articles.map(marker => (
            <MapView.Marker
              coordinate={{
                latitude: marker.lat,
                longitude: marker.lng
              }}
              title={marker.title}
              description={marker.description}
              image={require('../img/map_icons/article-marker-wide6.png')}
            >
              <MapView.Callout style={styles.plainView} onPress={() => { this.props.navigation.navigate('ArticleAbstraction', { articleObject: marker }); }}>
                <View>
                  {this.renderImage(marker.urlToImage)}
                  <Text style={{ fontSize: 16 }} numberOfLines={2}>{marker.title}</Text>

                </View>
              </MapView.Callout>
            </MapView.Marker>
          ))}
          {this.state.restaurants.map(marker => (
            <MapView.Marker
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude
              }}
              title={marker.partner_name}
              description={marker.address_1}
              image={require('../img/map_icons/restaurant-marker-wide.png')}
            >
              <MapView.Callout style={styles.plainView} onPress={() => { (marker.phone_number == '') ? console.log('no num') : Linking.openURL('tel:18008675309'); }}>
                <View>
                  <Text numberOfLines={2} style={{ fontSize: 18 }}>
                    {marker.partner_name}
                    {'\n'}
                  </Text>
                  <Text>
                    {'Address: '}
                    {marker.address_1}
                  </Text>
                  <Text>
                    {'#: '}
                    {marker.phone_number}
                  </Text>

                </View>
              </MapView.Callout>
            </MapView.Marker>
          ))}
          {this.state.posts.map(marker => (
            <MapView.Marker
              coordinate={{
                latitude: marker.lat,
                longitude: marker.lng
              }}
              title={marker.name}
              description={marker.comment}
              image={require('../img/map_icons/post-marker-wide.png')}
            >
              <MapView.Callout style={styles.plainView} onPress={() => { this.props.navigation.navigate('ObservationDetails', { postObject: marker, fromMap: true }); }}>
                <View>
                  {this.renderImage(marker.urlToImage)}
                  <Text style={{ fontSize: 16 }} numberOfLines={2}>{marker.comment}</Text>

                </View>
              </MapView.Callout>
            </MapView.Marker>
          ))}
          {this.state.events.map(marker => (
            <MapView.Marker
              coordinate={{
                latitude: marker.lat,
                longitude: marker.lng
              }}
              title={marker.name}
              description={marker.description}
              image={require('../img/map_icons/event-marker.png')}
            >
              <MapView.Callout style={styles.plainView} onPress={() => { this.props.navigation.navigate('EventsAbstraction', { eventsObject: marker }); }}>
                <View>
                  {this.renderImage(marker.urlToImage)}
                  <Text style={{ fontSize: 16 }} numberOfLines={1}>{marker.name}</Text>
                  <Text style={{ fontSize: 16 }} numberOfLines={2}>{marker.description}</Text>

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
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  dropup: {
    // alignItems:"center",
    // justifyContent: "center",
    marginTop: 10,
  },
  panel: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
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
