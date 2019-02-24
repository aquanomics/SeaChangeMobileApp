import React from 'react';
import { Platform, BackHandler, TouchableHighlight, TextInput, FlatList, StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { Header } from 'react-native-elements';
import { getEvents, getCities } from './EventsPageComponent/Event';
import EventsPreview from './EventsPageComponent/EventsPreview';   //Component used to render each entry in the list
import Icon from 'react-native-vector-icons/Ionicons';
import ModalDropdown from 'react-native-modal-dropdown';

const dropdownOptions = [21, 67, 18];
const dropdownOptionsLocation =["21: Northwest Atlantic", "67: Pacific, Northeast", "18: Arctic Sea"]
export default class EventsPage extends React.Component {
    constructor(props) {
  super(props);
  this.state = { EventsList: [],
                 CitiesList: [],
                 search: [],
                refreshing: true,
                refreshingSearch: true,
                category: "animal",
                isLoading: true,
                searchSubmitted: false,   //to keep track of whether search has been submitted at least once during the search session
                //This is used in the logic so that when you first try to search something before submission,
                //the empty list doesn't show up
                lastSearchText: '',     //This is used for searchList during pagination because if the list is at the end and if we were
                searchText: '',
                //to search at that time, onEndReached() of <FlatList> would constantly fire which is undesirable
                isSearchActive: false,          //state for search transition
                emptySearchReturned: false, 
                fetching_Status: false,};
                // dataSource: ds.cloneWithRows(SpeciesList),};
                this.fetchEvents = this.fetchEvents.bind(this);
                this.fetchCities = this.fetchCities.bind(this);
                this.offset = 0;
                this.searchOffset = 0;
                this.city = "Vancouver";
                this.keyword ='';
                this.wordDropDown = "Filter";
                this.searchOnEndReachedCalledDuringMomentum = true; 

  }

  static navigationOptions = {
    title: 'Fishes',
  };

  toggleSearchState = () => {
  if(this.state.isSearchActive == true) {
      this.setState({
        isSearchActive: false,
        search: [],
        searchListRefreshing: false,
        searchSubmitted: false,
        //lastSearchText: this.state.searchText,
      });
  } else {
      this.setState({ isSearchActive: true});
  }
    }

  componentDidMount() {
  this.fetchCities(this.state.category);
  this.fetchEvents(this.state.category);
  this.props.navigation.setParams({ fetchEvents: this.Event });
  }

  fetchEvents = () => {
    getEvents(this.city)
        .then(response => {this.setState({ EventsList:[...this.state.EventsList, ...response], refreshing: false});})
        .catch(() => {this.setState({EventsList: [], refreshing: false });console.log('ERROR')});
  }
  fetchCities = () => {
    getCities()
        .then(response => {this.setState({ CitiesList:[...this.state.CitiesList, ...response], refreshing: false});})
        .catch(() => this.setState({CitiesList: [], refreshing: false }));
  }

  // fetchSpeciesSearch = () => {
  //   getEventsSearch(this.searchOffset, this.keyword)
  //       .then(response => {this.setState({ search:[...this.state.search, ...response], refreshingSearch: false, lastSearchText: this.keyword}, () => {
  //         console.log("Below is the state.search");
  //         console.log("LAST TEXT");
  //         console.log(this.state.lastSearchText);
  //         // tempArray = this.state.search;
  //         // this.state.search = Array.from(new Set(tempArray));
  //       }); console.log("SUCCESS")})
  //       .catch(() => this.setState({search: [], refreshingSearch: false }));
  // }

  dropdownHandler = (value) => {
    //this.fetchNews(value);
    this.wordDropDown = dropdownOptionsLocation[value];
    this.city = dropdownOptions[value];
    this.offset = 0;
    this.setState({
        data: [],
        refreshing: true
    }, () => this.fetchCities(this.offset,this.city));  //Need to update the current category being viewed
  }

  //WARNING: currently does not support pagination
  searchSubmitHandler = () => {
    //this.fetchNews(value);
    this.keyword = this.state.searchText;
    this.offset = 0;
    this.setState({
        search: [],
        refreshingSearch: true,
        searchSubmitted: true,
        lastSearchText: this.state.searchText,
    }, () => this.fetchSpeciesSearch(this.searchOffset,this.state.searchText));  //Need to update the current category being viewed
  }

  handleSearchRefresh = () => {
      this.searchOffset = 0;
      this.setState({refreshingSearch: true, search : [], }, () => this.fetchSpeciesSearch(this.searchOffset,this.keyword));
  }

  handleRefresh() {
      this.offset = 0;
      this.setState({refreshing: true, data : [], }, () => this.fetchEvents(this.offset,this.city));
  }

  handleFetchMore() {
    this.offset = this.offset + 10;
    this.setState({refreshing: true}, () => this.fetchEvents(this.offset,this.city));
  }

  handleSearchFetchMore = () => {
    if(!this.searchOnEndReachedCalledDuringMomentum) {
      this.searchOffset = this.searchOffset + 10; 
      console.log(this.searchOffset);
      this.setState({refreshingSearch: true}, () => this.fetchSpeciesSearch(this.searchOffset,this.keyword));
     this.searchOnEndReachedCalledDuringMomentum = true;
    } else {
       console.log("Inside searchHandleFetchMore. fetch NOT executed");
    }
  }

  onScrollMotionBeginHandler = () => {
    this.searchOnEndReachedCalledDuringMomentum = false;
  }

  onScrollMotionEndHandler = () => {
    this.searchOnEndReachedCalledDuringMomentum = true;
  }


leftComponentJSX = () => {
  //BE CAREFUL: Need to check for undefined because the state parameters can be undefined during state transition
  if(this.state.isSearchActive == true) {
      return (
    <View style={styles.headerLeft}>
        <TouchableHighlight
      style={styles.headerLeftIcon}
      underlayColor={'#DCDCDC'}
      onPress={() => {
          this.toggleSearchState();
      } }
        >
          <Icon
          name="md-close"
          size={25}
          />
        </TouchableHighlight>
    </View>
      );
  }
    }
    rightComponentJSX = () => {
  //we check for undefined because when using setState to change states,
  //the state values can momentarily be undefined
  if(this.state.isSearchActive == false || this.state.isSearchActive === undefined) {
      //When search is not active
            return (
    <View style={styles.headerRight}>
        <TouchableHighlight
          style={styles.headerSearchIcon}
          underlayColor={'#DCDCDC'}
          onPress = {this.toggleSearchState}
        >
                <Icon
                  name="md-search"
                  size={25}
                />
        </TouchableHighlight>
            <ModalDropdown
              style={styles.dropdown}
              defaultValue={this.wordDropDown}
              options={this.state.CitiesList}
              //WARNING: context is lost within onSelect
              //onSelect={(idx, value) => alert("index of " + idx + " and value of " + value + " has been chosen")}
              onSelect={(idx, value) => this.dropdownHandler(idx)}//using getParam is the way to get around "this" context being lost
          />
    </View>
            );
  } else {
      //When search is active
            return (
                <View style={styles.headerRight}>
                  <TextInput
            autoFocus={true}
            style={{width: 300, height: 40, borderColor: 'gray', borderWidth: 1}}
            placeholder={"search all categories"}
            enablesReturnKeyAutomatically={true}
            //onSubmitEditing={(value) => {this.searchSubmitHandler(value);} }
            // onChangeText={ (value) => {this.searchSubmitHandler(value);}
            //  }
            onSubmitEditing={() => {this.searchSubmitHandler();  this.searchOffset = 0;} }
            onChangeText={ (text) => {
              this.setState({searchText: text}, () => console.log(`searchText is: ${this.state.searchText}`));} }
          />
                </View>
            );
  }
    }


  render() {
    return (
    <View style={styles.myContainer} contentContainerStyle={{flex: 1}}>
      <Header
          outerContainerStyles={{height: Platform.OS === 'ios' ? 70 - 5 :  70 - 13, padding: 0}}  //need padding because by default Header has padding on the sides
          backgroundColor={'white'}
          leftComponent={this.leftComponentJSX()}
          rightComponent={this.rightComponentJSX()}
      />
      <DisplayEvents 
        data={this.state.EventsList} 
        data={this.state.CitiesList} 
        search={this.state.search}
        refreshing={this.state.refreshing} 
        handleRefresh={this.handleRefresh.bind(this)} 
        handleFetchMore={this.handleFetchMore.bind(this)}
        handleSearchFetchMore={this.handleSearchFetchMore}
        isSearchActive={this.state.isSearchActive}
        searchSubmitted={this.state.searchSubmitted}
        handleSearchFetchMore={this.handleSearchFetchMore}
        handleSearchRefresh={this.handleSearchRefresh}
        refreshingSearch={this.state.refreshingSearch}
        onScrollMotionBeginHandler={this.onScrollMotionBeginHandler}  
        onScrollMotionEndHandler={this.onScrollMotionEndHandler}
        key={this._keyExtractor}
      />
    </View>
    );
  }
}

function DisplayEvents(props) {
  if(props.isSearchActive == false || props.isSearchActive === undefined
       || props.searchSubmitted == false) {
  return <FlatList
            keyExtractor={props.key}
            data={props.EventsList}
            renderItem={({ item }) => <EventsPreview eventspreview={item} navigation={props.navigation} />}
            //keyExtractor={item => item.SpecCode.toString()}
            refreshing={props.refreshing}
            onRefresh={props.handleRefresh}
            onEndReached={props.handleFetchMore}
            onEndThreshold={0.0}
            ListEmptyComponent={<DisplayNoInternet styles={styles}  />}
          />;
    } else {
  return <FlatList
            keyExtractor={props.key}
            data={props.search}
            renderItem={({ item }) => <EventsPreview eventspreview={item} navigation={props.navigation} />}
            //keyExtractor={item => item.SpecCode.toString()}
            refreshing={props.refreshingSearch}
            onRefresh={props.handleSearchRefresh}
            onEndReached={props.handleSearchFetchMore}
            onEndThreshold={0.01}
            ListEmptyComponent={<DisplayNoInternet styles={styles}  />}
            onMomentumScrollBegin={() => props.onScrollMotionBeginHandler()}
            onScrollBeginDrag={() => props.onScrollMotionBeginHandler()}
          />;
    }

}

function DisplayNoInternet(props) {
  return <View style={styles.container}>
            <Text style={styles.welcome}>Cannot Load Events Nearby</Text>
            <Text style={styles.instructions}>Might want to check your internet</Text>
         </View>;
}

const styles = StyleSheet.create({
  footerStyle: {
    padding: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 2,
    borderTopColor: '#009688'
  },

  TouchableOpacity_style: {
    padding: 7,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F44336',
    borderRadius: 5,
  },

  TouchableOpacity_Inside_Text: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18
  },
  myContainer: {
  flex: 1,
  //paddingTop: Constants.statusBarHeight,
    },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  dropdown: {
    marginHorizontal: 20,
  },
  headerLeft: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  margin: 0,
  //backgroundColor: 'red', //debugging use
  },
    headerLeftIcon: {
  marginLeft: 8,    //need this to position the back icon on left header like the other react-native-navigation headers
        //because we're not using react-native-navigation headers. We're using react-native-elements header
  paddingTop: 9,
  paddingBottom: 9,
  paddingLeft: 13,
  paddingRight: 13,
  borderRadius:100,   //makes the TouchableHighlight circular
  //backgroundColor: 'red', //debugging use
  },
  headerRight: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  margin: 0,
  //backgroundColor: 'red', //debugging use
  },
  headerSearchIcon: {
  //flex: 1,
  //marginLeft: 8,  //WARNING: The padding cannot be all same like headerLeft. The boundary gets messed up
  paddingTop: 9,
  paddingBottom: 9,
  paddingLeft: 13,
  paddingRight: 13,
  borderRadius:100,   //makes the TouchableHighlight circular
  alignItems: 'center',
  //backgroundColor: 'red', //debugging use
    }
});

