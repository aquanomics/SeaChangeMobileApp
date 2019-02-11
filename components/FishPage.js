import React from 'react';
import { Platform, BackHandler, TouchableHighlight, TextInput, FlatList, StyleSheet, View, Text } from 'react-native';
import { Header } from 'react-native-elements';
import { getSpecies } from './FishPageComponent/Fish';
import { getSpeciesSearch } from './FishPageComponent/Fish';
import Species from './FishPageComponent/Species'
import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';
const dropdownOptions = [21,67];
export default class FishPage extends React.Component {
    constructor(props) {
	super(props);
	this.state = { data: [],
                 search: [],
		            refreshing: true,
                category: "animal",
                isLoading: true,
                fetching_Status: false,};
                // dataSource: ds.cloneWithRows(SpeciesList),};
                this.fetchSpecies = this.fetchSpecies.bind(this);
                this.offset = 0;
                this.faoCode = 67;
  }

  static navigationOptions = {
    title: 'Fishes',
  };

	componentDidMount() {
  this.fetchSpecies(this.state.category);
  this.props.navigation.setParams({ fetchSpecies: this.Species });
  }

  fetchSpecies = () => {
    getSpecies(this.offset,this.faoCode)
        .then(response => {this.setState({ data:[...this.state.data, ...response], refreshing: false});})
        .catch(() => this.setState({data: [], refreshing: false }));
  }

  //   fetchMoreSpecies = () => {
  // getSpecies(this.offset)
  //     .then(List => {this.setState({ List:[...this.state.List, ...List.results], refreshing: false});this.offset = this.offset + 10;})
  //     .catch(() => this.setState({List: [], refreshing: false }));
  //   }

  dropdownHandler = (value) => {
  //this.fetchNews(value);
  this.faoCode = value;
  this.offset = 0;
  this.setState({
      data: [],
      refreshing: true
  }, () => this.fetchSpecies(this.offset,this.faoCode));  //Need to update the current category being viewed
  }

  handleRefresh() {
      this.offset = 0;
	    this.setState({refreshing: true, data : [], }, () => this.fetchSpecies(this.offset,this.faoCode));
  }

  handleFetchMore() {
    this.offset = this.offset + 10;
    this.setState({refreshing: true}, () => this.fetchSpecies(this.offset,this.faoCode));
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
              defaultValue='Filter'
              options={dropdownOptions}
              //WARNING: context is lost within onSelect
              //onSelect={(idx, value) => alert("index of " + idx + " and value of " + value + " has been chosen")}
              onSelect={(idx, value) => this.dropdownHandler(value)}//using getParam is the way to get around "this" context being lost
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
            onSubmitEditing={() => {this.searchSubmitHandler();} }
            onChangeText={ (text) => {
            this.setState({searchText: text});} }
          />
                </View>
            );
  }
    }


  render() {
	  return (
    <View style={styles.myContainer}>
      <Header
          outerContainerStyles={{height: Platform.OS === 'ios' ? 70 - 5 :  70 - 13, padding: 0}}  //need padding because by default Header has padding on the sides
          backgroundColor={'white'}
          rightComponent={this.rightComponentJSX()}
      />
      <DisplaySpecies 
        data={this.state.data} 
        refreshing={this.state.refreshing} 
        handleRefresh={this.handleRefresh.bind(this)} 
        handleFetchMore={this.handleFetchMore.bind(this)}
        key={this._keyExtractor}
      />
    </View>
	  );
  }
}

function DisplaySpecies(props) {
  return <FlatList
            keyExtractor={props.key}
            data={props.data}
            renderItem={({ item }) => <Species species={item} index={item.index} />}
            //keyExtractor={item => item.SpecCode.toString()}
            refreshing={props.refreshing}
            onRefresh={props.handleRefresh}
            onEndReached={props.handleFetchMore}
            onEndThreshold={0}
            ListEmptyComponent={<DisplayNoInternet styles={styles}  />}
          />;
}

function DisplayNoInternet(props) {
  return <View style={styles.container}>
            <Text style={styles.welcome}>Cannot Load Species Nearby</Text>
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
