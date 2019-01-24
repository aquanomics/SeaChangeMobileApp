/**
 * Tutorial for creating a News Article App
 *
 * @format
 * @flow
 */

import React from 'react';
import { TouchableHighlight, TextInput, Button, FlatList, StyleSheet, View, Text, Alert } from 'react-native';

// Import getNews function from news.js
import { getNews, getArticleSearch } from './ArticlePageComponent/news';
// We'll get to this one later
import Article from './ArticlePageComponent/Article';
import Icon from 'react-native-vector-icons/Ionicons';

import ModalDropdown from 'react-native-modal-dropdown';
const dropdownOptions = ['TopStories', 'Canada', 'World'];

export default class ArticlesPage extends React.Component {
    constructor(props) {
	super(props);
	this.state = { NewsArticle: [],		//for news FlatList
		       SearchArticle: [],	//for search FlatList
		       refreshing: true,	//for news FlatList
		       searchListRefreshing: false,	//for search FlatList
		       category: "TopStories",	//assigned TopStories as default. Changed by using dropdown list in the header
		       searchText: '',
		       searchSubmitted: false,	//to keep track of whether search has been submitted at least once during the search session
		       				//This is used in the logic so that when you first try to search something before submission,
		       				//the empty list doesn't show up
		     };		

	//Handler bindings
	this.fetchNews = this.fetchNews.bind(this);
	this.dropdownHandler = this.dropdownHandler.bind(this);
    }
    
    static navigationOptions = ( {navigation} ) => {
	return {
	    title: navigation.getParam('isSearchActive') ? null : 'Articles',	//This code doesn't seem to work. Maybe if we get rid of the ModalDropdown it will work. Not tried yet
	    headerTitleStyle: {textAlign: 'center', flex: 1, },		//For some reason, flex 1 was required for title to be centered
	    headerLeft: () => {
		//BE CAREFUL: Need to check for undefined because navigationOptions' function parameter is executed before
		//componentDidMount which is when navigation state is set
		if(navigation.getParam('isSearchActive') == false || navigation.getParam('isSearchActive') === undefined) {
		    return (
			<TouchableHighlight
			    style={styles.headerLeft}
			    underlayColor={'#DCDCDC'}
			    onPress={() => navigation.goBack()}
			>
			    <Icon
				name="md-arrow-back"
				size={25}
			    />
			</TouchableHighlight>);
		} else {
		    return (
			<TouchableHighlight
			    style={styles.headerLeft}
			    underlayColor={'#DCDCDC'}
			    onPress={() => {
			    	//IMPORTANT: I just realized we can just pass "this" to navigation.setParams
			    	//Then we don't need to individually pass in each function.
			    	//However, I won't be changing it because this works
			    	navigation.getParam('articlesPageComponent').setState({ SearchArticle: [],
			    								    searchListRefreshing: false,
			    								    searchText: '',	//If we don't clear this and user refreshes, list last time will appear
			    								    searchSubmitted: false,
			    								  });
			    	navigation.getParam('toggleSearchState')();
			    }}
			>
			    <Icon
				name="md-close"
				size={25}
			    />
			</TouchableHighlight>);
		}},

	    //WARNING: headerLeft can take a function and "React Element", but headerRight only takes a "React Element"
	    //Therefore, I can't simply put a function like headerLeft
	    headerRight: (<HeaderRightRender nav={navigation} />),
	};
    };

    // Called after a component is mounted
    componentDidMount() {
	this.fetchNews(this.state.category);	//fetch news for the first time
	console.log("inside articlespage.js");
	console.log(this.props);
	this.props.navigation.setParams({ dropdownHandler: this.dropdownHandler,
					  toggleSearchState: this._toggleSearchState,
					  isSearchActive: false,	//state for search transition
					  updateSearchText: this._updateSearchText,
					  returnSearchText: this._returnSearchText,
					  handleSearch: this._handleSearch,
					  articlesPageComponent: this,
					});	//pass in props to the current component
    }

    //this function controls the navigation state which is DIFFERENT from the component's state
    _toggleSearchState = () => {
	console.log("toggleSearchState executed. Current value of isSearchActive is below");
	console.log(this.props.navigation.getParam('isSearchActive'));
	if(this.props.navigation.getParam('isSearchActive') == true) {
	    this.props.navigation.setParams({ isSearchActive: false,});
	    //console.log("true");
	    //this.props.navigation.state.params.isSearchActive = false;
	} else {
//	    this.props.navigation.state.params.isSearchActive = true;
	    this.props.navigation.setParams({ isSearchActive: true,}, () => console.log("state has been set!"));
	}
	
	console.log("after changing isSearchActive, here is the new value below");
	console.log(this.props.navigation.getParam('isSearchActive'));
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

    //Assumes the coder will use it correctly
    handleRefresh(code) {
	if(code == "News") {
	    this.setState(
		{
		    refreshing: true
		},
		() => this.fetchNews(this.state.category)
	    );
	} else if (code == "Search") {
	    this.setState(
		{
		    searchListRefreshing: true
		},
		() => this._handleSearch(this.state.searchText)
	    );
	}
    }

    _handleSearch = (search) => {
	console.log("Inside _handleSearch(). Search is being submitted. Input to this function was: " + search);
	getArticleSearch(search)
	    .then( (NewsArticle) => {
		console.log("Below is the SearchArticle passed from the server.");
		console.log(NewsArticle);
		this.setState({ SearchArticle: NewsArticle, searchListRefreshing: false });
	    })
	    .catch(() => this.setState({SearchArticle: [], searchListRefreshing: false }));
    }

    _returnSearchText = () => {
	return this.state.searchText;
    }

    _updateSearchText = (text) => {
	console.log("Inside _updateSearchText");
	this.setState({searchText: text}, () => console.log("Callback function to setState inside updateSearchText. searchText now is: " + this.state.searchText));
    }

    render() {
	//Why didn't we just pass in this.state as a parameter rather than individually identifying what is needed in the component being rendered
	return (
		<DisplayArticles searchSubmitted={this.state.searchSubmitted} SearchArticle={this.state.SearchArticle} searchListRefreshing={this.state.searchListRefreshing} NewsArticle={this.state.NewsArticle} refreshing={this.state.refreshing} handleRefresh={this.handleRefresh.bind(this)} navigation={this.props.navigation} searchText={this.state.searchText} />
	);
    }
}

function HeaderRightRender(props) {
    console.log("Inside HeaderRightRender. Below is the props.navigation");
    console.log(props.nav);
    if(props === undefined) {
	return;
    }
    if(props.nav.getParam('isSearchActive') == false || props.nav.getParam('isSearchActive') === undefined) {
	//When search is not active
        return (
        	<View style={styles.headerRight}>
		    <TouchableHighlight
	    		style={styles.headerSearchIcon}
	    		underlayColor={'#DCDCDC'}
	    		onPress = {props.nav.getParam('toggleSearchState')}
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
        	        onSelect={ (idx, value) => {props.nav.getParam('dropdownHandler')(value);}}//using getParam is the way to get around "this" context being lost
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
		        onSubmitEditing={ () => {
			    props.nav.getParam('articlesPageComponent').setState({searchSubmitted: true});	//change submission flag
		            var searchText = props.nav.getParam('returnSearchText')();
		            props.nav.getParam('handleSearch')(searchText);
		        }}
		        onChangeText={props.nav.getParam('updateSearchText')}
           	    />
           	</View>
        );
    }
}

function DisplayArticles(props) {
    if(props.navigation.getParam('isSearchActive') == false || props.navigation.getParam('isSearchActive') === undefined
       || props.searchSubmitted == false) {
	//when search is not active
	return <FlatList
	data={props.NewsArticle}
	renderItem={({ item }) => <Article article={item} navigation={props.navigation} />}
	keyExtractor={item => item.url}
	refreshing={props.refreshing}
	onRefresh={() => props.handleRefresh("News")}
	ListEmptyComponent={<DisplayEmptyList styles={styles} searchText={props.searchText} />}
	/>;
    } else {
	//when search is active
	return <FlatList
	data={props.SearchArticle}
	renderItem={({ item }) => <Article article={item} navigation={props.navigation} />}
	keyExtractor={item => item.url}
	refreshing={props.searchListRefreshing}
	onRefresh={() => props.handleRefresh("Search")}
	ListEmptyComponent={<DisplayEmptyList styles={styles} searchText={props.searchText} />}
	/>;
    }

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
    headerLeft: {
	flex: 1,
	marginLeft: 8,
	paddingTop: 9,
	paddingBottom: 9,
	paddingLeft: 13,
	paddingRight: 13,
	borderRadius:100, 	//makes the TouchableHighlight circular
	flexDirection: 'row',
	alignItems: 'center',
	//backgroundColor: 'red',	//debugging use
    },
    headerSearchIcon: {
	//flex: 1,
	//marginLeft: 8,
	paddingTop: 9,
	paddingBottom: 9,
	paddingLeft: 13,
	paddingRight: 13,
	borderRadius:100, 	//makes the TouchableHighlight circular
	alignItems: 'center',
	//backgroundColor: 'red',	//debugging use
    }
});
