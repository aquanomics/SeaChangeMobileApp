import React from 'react';
import { FlatList, StyleSheet, View, Text, Alert } from 'react-native';

// Import getNews function from news.js
import { getEvent } from './EventPageComponent/events.js';
// We'll get to this one later
import Event from './EventPageComponent/EventCard.js';

import ModalDropdown from 'react-native-modal-dropdown';
const dropdownOptions = [''];

export default class App extends React.Component {
    constructor(props) {
	super(props);
	this.state = { EventCard: [],
		       refreshing: true,
	};	
	    this.fetchEvent = this.fetchEvent.bind(this);
    }
    
    static navigationOptions = ({ navigation }) => {
	return {
	    headerRight: (
		    <ModalDropdown
		style={styles.dropdown}
		defaultValue='Filter'
		options={dropdownOptions}
		onSelect={ (idx, value) => navigation.getParam('fetchEvent')(value)}	
		    />
	    ),
	};
    };

    // Called after a component is mounted
    componentDidMount() {
	this.fetchEvent();
	this.props.navigation.setParams({ fetchEvent: this.fetchEvent });
    }

//    fetchNews = (category) => {
//	getNews(category)
//	    .then(NewsArticle => this.setState({ NewsArticle, refreshing: false }))
//	    .catch(() => this.setState({NewsArticle: [], refreshing: false }));
//    }
	fetchEvent = () =>
		getEvent()
			.then(EventCard => this.setState({EventCard, refreshing:false}))
			.catch(()=> this.setState({EventCard: [], refreshing:false}));
//    
    handleRefresh() {
	this.setState(
	    {
		refreshing: true
	    },
	    () => this.fetchEvent()
	);
    }

    render() {
	return (
		<DisplayEvents EventCard={this.state.EventCard} refreshing={this.state.refreshing} handleRefresh={this.handleRefresh.bind(this)} />
	);
    }
}	

function DisplayEvents(props) {
  return <FlatList
    data={props.EventCard}
    renderItem={({ item }) => <Event e={item} />}
    keyExtractor={item => item.url}
    refreshing={props.refreshing}
    onRefresh={props.handleRefresh}
    ListEmptyComponent={<DisplayNoInternet styles={styles}  />}
  />;
}

function DisplayNoInternet(props) {
  return <View style={styles.container}>
    <Text style={styles.welcome}>Cannot Load Articles</Text>
    <Text style={styles.instructions}>Might want to check your internet</Text>
    </View>;
}

const styles = StyleSheet.create({
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

