import React, { Component } from 'react';
import {
  StyleSheet, Text, View, FlatList, NetInfo
} from 'react-native';
import { getSpeciesDetails } from './FishPageComponent/Fish';
import Details from './FishPageComponent/Details';

export default class FishDetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      refreshing: true,
      category: 'animal',
      fetching_Status: false,
      connection_Status : "",
      noResultReturned: false,
    };

    this.fetchDetails = this.fetchDetails.bind(this);
    this.itemId = this.props.navigation.getParam('code', 'NO-ID');
    this.SpeciesCode = this.itemId;
  }

  componentDidMount() {
    // Used to detect network status change
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._handleConnectivityChange
    );

    NetInfo.isConnected.fetch().done((isConnected) => {
      if (isConnected == true) this.setState({ connection_Status: 'Online' });
      else this.setState({ connection_Status: 'Offline' });
    });

    this.fetchDetails(this.state.category);
    this.props.navigation.setParams({ fetchDetails: this.Details });
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this._handleConnectivityChange
    );
  }

  _handleConnectivityChange = (isConnected) => {
    if (isConnected == true) this.setState({ connection_Status: 'Online' });
    else this.setState({ connection_Status: 'Offline' });
  };

  fetchDetails = () => {
    getSpeciesDetails(this.SpeciesCode)
      .then((response) => {
        response.length == 0 ? this.setState({data: [], refreshing: false, noResultReturned: true}) :
          this.setState({ data: response, refreshing: false, noResultReturned: false });
      })
      .catch(() => { this.setState({ data: [], refreshing: false }); console.log('ERROR'); });
  }

  handleRefresh() {
    this.setState({ refreshing: true, data: [], }, () => this.fetchDetails(this.SpeciesCode));
  }

  render() {
    return (
      <View style={styles.myContainer}>
        <DisplaySpecies
          data={this.state.data}
          refreshing={this.state.refreshing}
          handleRefresh={this.handleRefresh.bind(this)}
            // handleFetchMore={this.handleFetchMore.bind(this)}
          key={this._keyExtractor}
          navigation={this.props.navigation}
          connection_Status={this.state.connection_Status}
          noResultReturned={this.state.noResultReturned}
        />
      </View>
    );
  }
}

function DisplaySpecies(props) {
  return (
    <FlatList
      keyExtractor={props.key}
      data={props.data}
      renderItem={({ item }) => <Details navigation={props.navigation} details={item} index={item.index} />}
      refreshing={props.refreshing}
      onRefresh={props.handleRefresh}
      ListEmptyComponent={
        <DisplayNoInternet 
          styles={styles} 
          connection_Status={props.connection_Status}
          refreshing={props.refreshing}
          noResultReturned={props.noResultReturned}
        />
      }
    />
  );
}

function DisplayNoInternet(props) {
  if (props.connection_Status == 'Offline') {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>No Internet</Text>
      </View>
    );
  }
  // Note: need to check for undefined because render functions are ran before constructor() is ran which renders (no pun intended)
  // all state variables undefined
  if (props.refreshing || props.refreshing === undefined) {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Loading</Text>
      </View>
    );
  } if (props.noResultReturned == true) {
    // empty case
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>No results</Text>
        <Text style={styles.instructions}>If connection was lost previously, try again</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Cannot Load Fish</Text>
      <Text style={styles.instructions}>If connection was lost previously, try again</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
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
});
