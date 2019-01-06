/**
 * Tutorial for creating a News Article App
 *
 * @format
 * @flow
 */

import React from 'react';
import { FlatList, StyleSheet, View, Text, Alert } from 'react-native';

// Import getNews function from news.js
import { getNews } from './ArticlePageComponent/news';
// We'll get to this one later
import Article from './ArticlePageComponent/Article';

import ModalDropdown from 'react-native-modal-dropdown';
const dropdownOptions = ['TopStories', 'Canada', 'World'];

export default class App extends React.Component {
    constructor(props) {
	super(props);
	this.state = { NewsArticle: [],
		       refreshing: true,
		       category: "TopStories",};		//assigned TopStories as default. Changed by using dropdown list in the header
	this.fetchNews = this.fetchNews.bind(this);
    }
    
    static navigationOptions = ({ navigation }) => {
	return {
	    headerRight: (
		    <ModalDropdown
		style={styles.dropdown}
		defaultValue='Filter'
		options={dropdownOptions}
		//onSelect={(idx, value) => alert("index of " + idx + " and value of " + value + " has been chosen")}
		onSelect={ (idx, value) => navigation.getParam('fetchNews')(value)}	//using getParam is the way to get around "this" context being lost
		    />
	    ),
	};
    };

    // Called after a component is mounted
    componentDidMount() {
	this.fetchNews(this.state.category);
	this.props.navigation.setParams({ fetchNews: this.fetchNews });
    }

    fetchNews = (category) => {
	getNews(category)
	    .then(NewsArticle => this.setState({ NewsArticle, refreshing: false }))
	    .catch(() => this.setState({NewsArticle: [], refreshing: false }));
    }
    
    handleRefresh() {
	this.setState(
	    {
		refreshing: true
	    },
	    () => this.fetchNews(this.state.category)
	);
    }

    render() {
	return (
		<DisplayArticles NewsArticle={this.state.NewsArticle} refreshing={this.state.refreshing} handleRefresh={this.handleRefresh.bind(this)} />
	);
    }
}

function DisplayArticles(props) {
  return <FlatList
    data={props.NewsArticle}
    renderItem={({ item }) => <Article article={item} />}
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
