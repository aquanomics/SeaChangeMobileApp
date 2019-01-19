/**
 * Tutorial for creating a News Article App
 *
 * @format
 * @flow
 */

import React from 'react';
import {Button, FlatList, StyleSheet, View, Text, Alert } from 'react-native';

// Import getNews function from news.js
import { getNews } from './ArticlePageComponent/news';
// We'll get to this one later
import Article from './ArticlePageComponent/Article';
import Icon from 'react-native-vector-icons/Ionicons';

import ModalDropdown from 'react-native-modal-dropdown';
const dropdownOptions = ['TopStories', 'Canada', 'World'];

export default class ArticlesPage extends React.Component {
    constructor(props) {
	super(props);
	this.state = { NewsArticle: [],
		       refreshing: true,
		       category: "TopStories",};		//assigned TopStories as default. Changed by using dropdown list in the header

	//Handler bindings
	this.fetchNews = this.fetchNews.bind(this);
	this.dropdownHandler = this.dropdownHandler.bind(this);
    }
    
    static navigationOptions = ({ navigation }) => {
	return {
	    title: 'Articles',	//This code doesn't seem to work. Maybe if we get rid of the ModalDropdown it will work. Not tried yet
	    headerTitleStyle: {textAlign: 'center', flex: 1, },		//For some reason, flex 1 was required for title to be centered
	    headerRight: (
		<View style={styles.headerRight}>
		    <Icon
		    name="ios-search"
		    size={25}
		    onPress={() => navigation.navigate('ArticleSearch')}	//opening another component using <WebView />
		    />

	            <ModalDropdown
		        style={styles.dropdown}
		        defaultValue='Filter'
		        options={dropdownOptions}
		        //WARNING: context is lost within onSelect
		        //onSelect={(idx, value) => alert("index of " + idx + " and value of " + value + " has been chosen")}
		        onSelect={ (idx, value) => {navigation.getParam('dropdownHandler')(value);}}//using getParam is the way to get around "this" context being lost
		    />
		</View>
	    ),
	};
    };

    // Called after a component is mounted
    componentDidMount() {
	this.fetchNews(this.state.category);	//fetch news for the first time
	console.log("inside articlespage.js");
	console.log(this.props);
	this.props.navigation.setParams({ dropdownHandler: this.dropdownHandler });	//pass in props to the current component
    }

    fetchNews = (category) => {
	getNews(category)
	    .then(NewsArticle => this.setState({ NewsArticle, refreshing: false }))
	    .catch(() => this.setState({NewsArticle: [], refreshing: false }));
    }
    
    dropdownHandler = (value) => {
	console.log("Inside dropdownHandler");
	this.fetchNews(value);
	//this.props.navigation.getParam('fetchNews')(value);
	this.setState({category: value });	//Need to update the current category being viewed
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
		<DisplayArticles NewsArticle={this.state.NewsArticle} refreshing={this.state.refreshing} handleRefresh={this.handleRefresh.bind(this)} navigation={this.props.navigation} />
	);
    }
}

function DisplayArticles(props) {
  return <FlatList
    data={props.NewsArticle}
    renderItem={({ item }) => <Article article={item} navigation={props.navigation} />}
    keyExtractor={item => item.url}
    refreshing={props.refreshing}
    onRefresh={props.handleRefresh}
    ListEmptyComponent={<DisplayEmptyList styles={styles}  />}
  />;
}

function DisplayEmptyList(props) {
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
    headerRight: {
	flexDirection: 'row',
	alignItems: 'center',
    },
});
