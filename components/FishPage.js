import React from 'react';
import { ActivityIndicator, ListView, Platform, StyleSheet, Text, View, Linking, FlatList} from 'react-native';
import { getSpecies } from './FishPageComponent/Fish';
import Species from './FishPageComponent/Species'
import ModalDropdown from 'react-native-modal-dropdown';
//const dropdownOptions = ['animal'];
export default class FishPage extends React.Component {
    constructor(props) {
	super(props);
	this.state = { data: [],
		       refreshing: true,
		       category: "animal",
		   	   isLoading: true,
			   fetching_Status: false,};
		       // dataSource: ds.cloneWithRows(SpeciesList),};
	 this.fetchSpecies = this.fetchSpecies.bind(this);
	this.offset = 0;
    }

	componentDidMount()
  {
  this.fetchSpecies(this.state.category);
  this.props.navigation.setParams({ fetchSpecies: this.Species });
  }

    fetchSpecies = () => {
	getSpecies(this.offset)
	    .then(response => {this.setState({ data:[...this.state.data, ...response], refreshing: false});this.offset = this.offset + 10;})
	    .catch(() => this.setState({data: [], refreshing: false }));
    }

  //   fetchMoreSpecies = () => {
  // getSpecies(this.offset)
  //     .then(List => {this.setState({ List:[...this.state.List, ...List.results], refreshing: false});this.offset = this.offset + 10;})
  //     .catch(() => this.setState({List: [], refreshing: false }));
  //   }

    handleRefresh() {
       this.offset = 0;
	     this.setState(
	     {
		    refreshing: true,
        data : [],
	     },
	       () => this.fetchSpecies(this.offset)
	);
    }

    handleFetchMore() {
  this.setState(
      {
    refreshing: true
      },
      () => this.fetchSpecies(this.offset)
  );
    }
    render() {
	return (
		<DisplaySpecies data={this.state.data} refreshing={this.state.refreshing} handleRefresh={this.handleRefresh.bind(this)} handleFetchMore={this.handleFetchMore.bind(this)}/>
	);
    }
}

function DisplaySpecies(props) {
  return <FlatList
    data={props.data}
    renderItem={({ item }) => <Species species={item} />}
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
	  footerStyle:
  {
    padding: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 2,
    borderTopColor: '#009688'
  },
 
  TouchableOpacity_style:
  {
    padding: 7,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F44336',
    borderRadius: 5,
  },
 
  TouchableOpacity_Inside_Text:
  {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18
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
});
