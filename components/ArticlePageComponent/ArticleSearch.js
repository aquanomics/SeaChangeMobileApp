/**
 * Tutorial for creating a News Article App
 *
 * @format
 * @flow
 */

import React from 'react';
import {TextInput, Button, FlatList, StyleSheet, View, Text, Alert } from 'react-native';

// Import getArticleSearch function from news.js
import { getArticleSearch } from './news';
// We'll get to this one later
import Article from './Article';
import Icon from 'react-native-vector-icons/Ionicons';

import ModalDropdown from 'react-native-modal-dropdown';
const dropdownOptions = ['TopStories', 'Canada', 'World'];

export default class ArticleSearch extends React.Component {
    constructor(props) {
	super(props);
	this.state = { NewsArticle: [],
		       refreshing: false,	//is true in ArticlePage.js
		       searchText: '',
		       };
    }
    
    static navigationOptions = ({ navigation }) => {
	//NOTE: fetch occurs only when user submits, NOT when there is change in TextInput
	return {
	    headerRight: (
		<View style={styles.headerRight}>
		    <TextInput
		style={{width: 300, height: 40, borderColor: 'gray', borderWidth: 1}}
		placeholder={"search all categories"}
		onSubmitEditing={ () => {
		    var stateText = navigation.getParam('returnStateText')();
		    navigation.getParam('handleSearch')(stateText);
		}}
		onChangeText={navigation.getParam('updateStateText')}
		    />
		</View>
	    ),
	};
    };

    // Called after a component is mounted
    componentDidMount() {
	//this.fetchNews(this.state.category);	//fetch news for the first time		//not needed for articleSearch page
	this.props.navigation.setParams({ updateStateText: this._updateStateText,
					  returnStateText: this._returnStateText,
					  handleSearch: this._handleSearch,
					});

	console.log("inside articleSearch.js componentDidMount(). Below is the props passed to it");
	console.log(this.props);
    }

    _updateStateText = (text) => {
	console.log("Inside _updateStateText");
	this.setState({searchText: text}, () => console.log(this.state.searchText));
    }

    _returnStateText = () => {
	return this.state.searchText;
    }

    _handleSearch = (search) => {
	console.log("Inside _handleSearch(). Search is being submitted. Input to this function was: " + search);
	getArticleSearch(search)
	    .then(NewsArticle => { console.log("Below is the NewsArticle passed from the server"); console.log(NewsArticle);this.setState({ NewsArticle, refreshing: false })} )
	    .catch(() => this.setState({NewsArticle: [], refreshing: false }));
    }

    handleRefresh() {
	this.setState(
	    {
		refreshing: true
	    },
	    () => this._handleSearch(this.state.searchText)
	);
    }

    render() {
	return (
		<DisplayArticles NewsArticle={this.state.NewsArticle} refreshing={this.state.refreshing} handleRefresh={this.handleRefresh.bind(this)} navigation={this.props.navigation} stateText={this.state.searchText} />
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
    ListEmptyComponent={<DisplayEmptyList styles={styles} stateText={props.stateText} />}
  />;
}

function DisplayEmptyList(props) {
	return (
	<View style={styles.container}>
	    <Text style={styles.welcome}>Cannot Load Articles</Text>
	    <Text style={styles.instructions}>No articles with the given search keywords or you might want to check your internet</Text>
	</View>);
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
