import React from 'react';
import {
  NetInfo, Platform, BackHandler, TouchableHighlight, TextInput, FlatList, StyleSheet, View, Text, SafeAreaView
} from 'react-native';
import { Header } from 'react-native-elements';
import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';
import { HeaderBackButton } from 'react-navigation';
import { getSpecies } from './FishPageComponent/Fish';
import { getSpeciesSearch } from './FishPageComponent/Fish';
import Species from './FishPageComponent/Species';

const dropdownOptions = ['All', 18, 21, 67];
const dropdownOptionsLocation = ['All', '18: Arctic Sea', '21: Northwest Atlantic', '67: Pacific, Northeast'];
export default class FishPage extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: null, // gets rid of react-native-navigation library's header. We do this because we're using <Header /> from react-native-elements instead
  });

  _didFocusSubscription;

  _willBlurSubscription;

  constructor(props) {
  	super(props);
  	this.state = {
      data: [],
      search: [],
      refreshing: true,
      refreshingSearch: false,
      category: 'animal',
      searchSubmitted: false, // to keep track of whether search has been submitted at least once during the search session
      // This is used in the logic so that when you first try to search something before submission,
      // the empty list doesn't show up
      lastSearchText: '', // We need to "remember" this value for pagination to know what string to query
      searchText: '',
      // to search at that time, onEndReached() of <FlatList> would constantly fire which is undesirable
      isSearchActive: false, // state for search transition
      emptySearchReturned: false,
      fetching_Status: false,
      connection_Status: '', // used to check network state
    };

    // dataSource: ds.cloneWithRows(SpeciesList),};
    this.fetchSpecies = this.fetchSpecies.bind(this);
    this.offset = 0;
    this.searchOffset = 0;
    this.faoCode = 'All';
    this.keyword = '';
    this.wordDropDown = 'Filter';
    this.searchOnEndReachedCalledDuringMomentum = true;

    this._didFocusSubscription = props.navigation.addListener('didFocus', payload => BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid));
  }

  toggleSearchState = () => {
    if (this.state.isSearchActive == true) {
      this.setState({
        isSearchActive: false,
        search: [],
        refreshingSearch: false,
        searchSubmitted: false,
        // lastSearchText: this.state.searchText,
      });
    } else {
      this.setState({ isSearchActive: true });
    }
  }

  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload => BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid));

    this.fetchSpecies(this.state.category);
    this.props.navigation.setParams({ fetchSpecies: this.Species });

    // Used to detect network status change
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._handleConnectivityChange
    );

    NetInfo.isConnected.fetch().done((isConnected) => {
      if (isConnected == true) this.setState({ connection_Status: 'Online' });
      else this.setState({ connection_Status: 'Offline' });
    });
  }

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();

    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this._handleConnectivityChange
    );
  }

  onBackButtonPressAndroid = () => {
    if (this.state.isSearchActive == true) {
      this.toggleSearchState();
      return true;
    }
    return false;
  };

  // reference: https://reactnativecode.com/netinfo-example-to-detect-internet-connection/
  _handleConnectivityChange = (isConnected) => {
    if (isConnected == true) this.setState({ connection_Status: 'Online' });
    else this.setState({ connection_Status: 'Offline' });
  };

  fetchSpecies = () => {
    getSpecies(this.offset, this.faoCode)
      .then((response) => { this.setState({ data: [...this.state.data, ...response], refreshing: false }); })
      .catch(() => this.setState({ data: [], refreshing: false }));
  }

  fetchSpeciesSearch = () => {
    getSpeciesSearch(this.searchOffset, this.keyword)
      .then((response) => {
        this.setState({
          search: [...this.state.search, ...response],
          refreshingSearch: false,
          lastSearchText: this.keyword,
          emptySearchReturned: response.length == 0,
        });
      })
      .catch(() => this.setState({ search: [], refreshingSearch: false }));
  }

  dropdownHandler = (value) => {
    this.wordDropDown = dropdownOptionsLocation[value];
    this.faoCode = dropdownOptions[value];
    this.offset = 0;
    this.setState({
      data: [],
      refreshing: true
    }, () => this.fetchSpecies(this.offset, this.faoCode)); // Need to update the current category being viewed
  }

  searchSubmitHandler = () => {
    this.keyword = this.state.searchText;
    this.offset = 0;
    this.setState({
      search: [],
      refreshingSearch: true,
      searchSubmitted: true,
      lastSearchText: this.state.searchText,
    }, () => this.fetchSpeciesSearch(this.searchOffset, this.state.searchText)); // Need to update the current category being viewed
  }

  handleSearchRefresh = () => {
    this.searchOffset = 0;
    this.setState({ refreshingSearch: true, search: [], }, () => this.fetchSpeciesSearch(this.searchOffset, this.keyword));
  }

  handleRefresh() {
    this.offset = 0;
    if (this.state.connection_Status == 'Offline') {
      this.setState({
        refreshing: false,
        data: [],
      });
    } else {
      this.setState({ refreshing: true, data: [], }, () => this.fetchSpecies(this.offset, this.faoCode));
    }
  }

  handleFetchMore() {
    this.offset = this.offset + 10;
    this.setState({ refreshing: true }, () => this.fetchSpecies(this.offset, this.faoCode));
  }

  handleSearchFetchMore = () => {
    if (!this.searchOnEndReachedCalledDuringMomentum) {
      this.searchOffset = this.searchOffset + 10;
      this.setState({ refreshingSearch: true }, () => this.fetchSpeciesSearch(this.searchOffset, this.keyword));
      this.searchOnEndReachedCalledDuringMomentum = true;
    }
  }

  onScrollMotionBeginHandler = () => {
    this.searchOnEndReachedCalledDuringMomentum = false;
  }

  onScrollMotionEndHandler = () => {
    this.searchOnEndReachedCalledDuringMomentum = true;
  }


  leftComponentJSX = () => {
    // BE CAREFUL: Need to check for undefined because the state parameters can be undefined during state transition
    if (this.state.isSearchActive == false || this.state.isSearchActive === undefined) {
      return (
        <View style={styles.headerLeft}>
          <HeaderBackButton
            onPress={() => this.props.navigation.goBack()}
          />
        </View>
      );
    }
    return (
      <View style={styles.headerLeft}>
        <TouchableHighlight
          style={styles.headerLeftIcon}
          underlayColor="#DCDCDC"
          onPress={() => {
            this.toggleSearchState();
          }}
        >
          <Icon
            name="md-close"
            size={25}
          />
        </TouchableHighlight>
      </View>
    );
  }

  centerComponentJSX = () => {
    if (this.state.isSearchActive == false) {
      return (
        <View style={styles.headerTitleContainer}>
          <Text style={{
            fontWeight: 'bold',
            textAlign: 'center',
          }}
          >
          Fish
          </Text>
        </View>
      );
    }
    return null;
  }

    rightComponentJSX = () => {
      // we check for undefined because when using setState to change states,
      // the state values can momentarily be undefined
      if (this.state.isSearchActive == false || this.state.isSearchActive === undefined) {
      // When search is not active
        return (
          <View style={styles.headerRight}>
            <TouchableHighlight
              style={styles.headerSearchIcon}
              underlayColor="#DCDCDC"
              onPress={this.toggleSearchState}
            >
              <Icon
                name="md-search"
                size={25}
              />
            </TouchableHighlight>
            <ModalDropdown
              style={styles.dropdown}
              defaultValue={this.wordDropDown}
              options={dropdownOptionsLocation}
              // WARNING: context is lost within onSelect
              // onSelect={(idx, value) => alert("index of " + idx + " and value of " + value + " has been chosen")}
              onSelect={(idx, value) => this.dropdownHandler(idx)}
            />
          </View>
        );
      }
      // When search is active
      return (
        <View style={styles.headerRight}>
          <TextInput
            autoFocus
            style={{
              width: 300, height: 40, borderColor: 'gray', borderWidth: 1
            }}
            placeholder="search all categories"
            enablesReturnKeyAutomatically
            // onSubmitEditing={(value) => {this.searchSubmitHandler(value);} }
            // onChangeText={ (value) => {this.searchSubmitHandler(value);}
            //  }
            onSubmitEditing={() => { this.searchSubmitHandler(); this.searchOffset = 0; }}
            onChangeText={(text) => {
              this.setState({ searchText: text });
            }}
          />
        </View>
      );
    }


    render() {
	  return (
  <SafeAreaView style={styles.myContainer}>
    <Header
      outerContainerStyles={{ height: Platform.OS === 'ios' ? 70 - 25 : 70 - 13, padding: 0 }} // need padding because by default Header has padding on the sides
      backgroundColor="white"
      leftComponent={this.leftComponentJSX()}
      centerComponent={this.centerComponentJSX()}
      rightComponent={this.rightComponentJSX()}
    />
    <DisplaySpecies
      data={this.state.data}
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
      connection_Status={this.state.connection_Status}
    />
  </SafeAreaView>
	  );
    }
}

function DisplaySpecies(props) {
  if (props.isSearchActive == false || props.isSearchActive === undefined
       || props.searchSubmitted == false) {
    return (
      <FlatList
        style={{ paddingTop: 7 }}
        keyExtractor={props.key}
        data={props.data}
        renderItem={({ item }) => <Species species={item} index={item.index} />}
            // keyExtractor={item => item.SpecCode.toString()}
        refreshing={props.refreshing}
        onRefresh={props.handleRefresh}
        onEndReached={props.handleFetchMore}
        onEndThreshold={0.0}
        ListEmptyComponent={(
          <DisplayEmptyList
            styles={styles}
            refreshingSearch={props.refreshingSearch}
            refreshing={props.refreshing}
            emptySearchReturned={props.emptySearchReturned}
            isSearchActive={props.isSearchActive}
            searchSubmitted={props.searchSubmitted}
            connection_Status={props.connection_Status}
          />
)}
      />
    );
  }
  return (
    <FlatList
      keyExtractor={props.key}
      data={props.search}
      renderItem={({ item }) => <Species species={item} index={item.index} />}
      refreshing={props.refreshingSearch}
      onRefresh={props.handleSearchRefresh}
      onEndReached={props.handleSearchFetchMore}
      onEndThreshold={0.01}
      ListEmptyComponent={(
        <DisplayEmptyList
          styles={styles}
          refreshingSearch={props.refreshingSearch}
          refreshing={props.refreshing}
          emptySearchReturned={props.emptySearchReturned}
          isSearchActive={props.isSearchActive}
          searchSubmitted={props.searchSubmitted}
          connection_Status={props.connection_Status}
        />
)}
      onMomentumScrollBegin={() => props.onScrollMotionBeginHandler()}
      onScrollBeginDrag={() => props.onScrollMotionBeginHandler()}
    />
  );
}

function DisplayEmptyList(props) {
  if (props.connection_Status == 'Offline') {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>No Internet</Text>
      </View>
    );
  }
  // Note: need to check for undefined because render functions are ran before constructor() is ran which renders (no pun intended)
  // all state variables undefined
  if (props.refreshing || props.refreshingSearch
    || props.refreshing === undefined || props.refreshingSearch === undefined) {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Loading</Text>
      </View>
    );
  } if (props.emptySearchReturned == true) {
    // empty case
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>No results</Text>
        {props.isSearchActive == true && props.searchSubmitted == true
          ? <Text style={styles.instructions}>Try a different keyword</Text> : null
              }
        <Text style={styles.instructions}>If connection was lost previously, try again</Text>
      </View>
    );
  }
  // not empty case --> means there is no internet
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Cannot Load Data</Text>
      <Text style={styles.instructions}>If connection was lost previously, try again</Text>
    </View>
  );
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
    backgroundColor: '#8cdff2'
    // paddingTop: Constants.statusBarHeight,
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
    // backgroundColor: 'red', //debugging use
  },
  headerLeftIcon: {
    marginLeft: 8, // need this to position the back icon on left header like the other react-native-navigation headers
    // because we're not using react-native-navigation headers. We're using react-native-elements header
    paddingTop: 9,
    paddingBottom: 9,
    paddingLeft: 13,
    paddingRight: 13,
    borderRadius: 100, // makes the TouchableHighlight circular
    // backgroundColor: 'red', //debugging use
  },
  headerTitleContainer: {
    flex: 1,
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  // backgroundColor: 'blue',  //debugging use
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 0,
    // backgroundColor: 'red', //debugging use
  },
  headerSearchIcon: {
    // flex: 1,
    // marginLeft: 8,  //WARNING: The padding cannot be all same like headerLeft. The boundary gets messed up
    paddingTop: 9,
    paddingBottom: 9,
    paddingLeft: 13,
    paddingRight: 13,
    borderRadius: 100, // makes the TouchableHighlight circular
    alignItems: 'center',
    // backgroundColor: 'red', //debugging use
  }
});
