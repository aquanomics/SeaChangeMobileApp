import React, { Component } from "react";
import { getSpeciesDetails } from './FishPageComponent/Fish';
import Details from './FishPageComponent/Details'
import { StyleSheet, Text, View, FlatList } from 'react-native';

export default class FishDetailPage extends Component{
    constructor(props) {
      super(props);
      this.state = { data: [],
                  refreshing: true,
                  category: "animal",
                  isLoading: true,
                  fetching_Status: false,};
                  // dataSource: ds.cloneWithRows(SpeciesList),};
                  this.fetchDetails = this.fetchDetails.bind(this);
                  //this.{ navigation } = this.props;
                  this.itemId = this.props.navigation.getParam('code', 'NO-ID');
                  this.SpeciesCode = this.itemId;
                  //console.log(this.itemId)
  }
  componentDidMount() {
    this.fetchDetails(this.state.category);
    this.props.navigation.setParams({ fetchDetails: this.Details });
  }

  fetchDetails = () => {
    getSpeciesDetails(this.SpeciesCode)
        .then(response => {
          this.setState({ data:response, refreshing: false});
          console.log("SUCCESS")})
        .catch(() => {this.setState({data: [], refreshing: false }); console.log("ERROR");});
  }

  handleRefresh() {
    this.setState({refreshing: true, data : [], }, () => this.fetchDetails(this.SpeciesCode));
  }

  render() {
        return (
        <DisplaySpecies 
          data={this.state.data} 
          refreshing={this.state.refreshing} 
          handleRefresh={this.handleRefresh.bind(this)} 
          //handleFetchMore={this.handleFetchMore.bind(this)}
          key={this._keyExtractor}
          navigation={this.props.navigation}
        />
        );
  }
}

function DisplaySpecies(props) {
  return <FlatList
            keyExtractor={props.key}
            data={props.data}
            renderItem={({ item }) => <Details navigation={props.navigation} details={item} index={item.index} />}
            refreshing={props.refreshing}
            onRefresh={props.handleRefresh}
            ListEmptyComponent={<DisplayNoInternet styles={styles}  />}
          />;
}

function DisplayNoInternet(props) {
  return <View style={styles.container}>
            <Text style={styles.welcome}>Cannot Load Information</Text>
            <Text style={styles.instructions}>Might want to check your internet</Text>
         </View>;
}

const styles = StyleSheet.create({
    placeholder: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});