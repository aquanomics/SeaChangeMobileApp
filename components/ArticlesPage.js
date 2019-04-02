import React from 'react';
import { NetInfo, Platform, BackHandler, TouchableHighlight, TextInput, FlatList, StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { Header } from 'react-native-elements';
import { getNews, getArticleSearch } from './ArticlePageComponent/news';
import Article from './ArticlePageComponent/Article';	//Component used to render each entry in the list
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from 'react-native-firebase';
import { HeaderBackButton } from 'react-navigation';

import ModalDropdown from 'react-native-modal-dropdown';
const dropdownOptions = ['TopStories', 'Canada', 'World'];
const LIMIT = 5;	//this is used as a constant for BOTH SearchArticle[] and NewsArticle[]
const OFFSET_CONST = 5;	//this is used as a constant for BOTH SearchArticle[] and NewsArticle[]

export default class ArticlesPage extends React.Component {
    //The 2 lines below are using the technique endorsed by offical react-native-navigation documentation
    //https://reactnavigation.org/docs/en/custom-android-back-button-handling.html
    //Have custom back button actions for when search mode is on
    _didFocusSubscription;
    _willBlurSubscription;

	//gets rid of react-native-navigation library's header. We do this because we're using <Header /> from react-native-elements instead
    static navigationOptions = ({ navigation }) => ({
		header: null,
    });

    constructor(props) {
		super(props);

		//https://stackoverflow.com/questions/47910127/flatlist-calls-onendreached-when-its-rendered
		//we ONLY do this for search and not for news because the normal fetch and onEndReached fetch
		//functions are one and the same.
		this.searchOnEndReachedCalledDuringMomentum = true;	
		this.newsOnEndReachedCalledDuringMomentum = true;	

		this.state = {
			NewsArticle: [],			//for news FlatList
			SearchArticle: [],			//for search FlatList
			refreshing: true,			//for news FlatList
			searchListRefreshing: false,	//for search FlatList
			category: "TopStories",		//assigned TopStories as default. Changed by using dropdown list in the header
			searchText: '',
			searchSubmitted: false,		//to keep track of whether search has been submitted at least once during the search session
								//This is used in the logic so that when you first try to search something before submission,
								//the empty list doesn't show up
			lastSearchText: '',			//We need to "remember" this value for pagination to know what string to query
			isSearchActive: false,        	//state for search transition
			emptySearchReturned: false,		//to keep track if no entries are returned for the given search keyword.
						//This is used in the logic to differentiate whether to say No Internet or No Results
			offset: 0,				//used for offsetting for pagination FOR NewsArticle[]	
			searchOffset: 0,			//used for offsetting for pagination FOR SearchArticle[]
		    connection_Status : "",		//used to check network state	
		};		

		this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
			BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
		);
    }

    componentDidMount() {
    	//Used to detect network status change
	    NetInfo.isConnected.addEventListener(
        	'connectionChange',
        	this._handleConnectivityChange 
	    );
   
	    NetInfo.isConnected.fetch().done((isConnected) => {
	      	if(isConnected == true)
		       	this.setState({connection_Status : "Online"})
	      	else
		        this.setState({connection_Status : "Offline"})
    	});

		this.fetchNews(this.state.category);	//fetch news for the first time
		this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
				BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
		);
    }
    
    componentWillUnmount() {
    	NetInfo.isConnected.removeEventListener(
        	'connectionChange',
        	this._handleConnectivityChange
    	);

		this._didFocusSubscription && this._didFocusSubscription.remove();
		this._willBlurSubscription && this._willBlurSubscription.remove();
    }

    //reference: https://reactnativecode.com/netinfo-example-to-detect-internet-connection/
    _handleConnectivityChange = (isConnected) => {
	    if(isConnected == true)
	        this.setState({connection_Status : "Online"})
	    else
	        this.setState({connection_Status : "Offline"})
  	};

    onBackButtonPressAndroid = () => {
		if (this.state.isSearchActive == true) {
			this.toggleSearchState();
			return true;
		} else {
			return false;
		}
    };

    toggleSearchState = () => {
		if(this.state.isSearchActive == true) {
			this.setState({
				isSearchActive: false,
				SearchArticle: [],
				searchListRefreshing: false,
				searchOffset: 0,
				searchSubmitted: false,
				lastSearchText: this.state.searchText,
			});
		} else {
			this.setState({ isSearchActive: true});
		}
    }

    //WARNING: fetch does not replace the state.NewsArticle anymore. Therefore, before this function is called,
    //NewsArticle should be emptied unless you want the new fetched material to be concatenated with the old array
    //which you sometimes want it to happen aka pagination
    fetchNews = (category) => {
		getNews(category, this.state.offset, LIMIT)
		    .then(response => this.setState({ NewsArticle: [...this.state.NewsArticle, ...response], refreshing: false }))
		    .catch(() => this.setState({NewsArticle: [], refreshing: false }));
    }
    
    dropdownHandler = (value) => {
		this.setState({
			NewsArticle: [],
			refreshing: true,
			category: value,
			offset: 0,
		}, () => this.fetchNews(value));	//Need to update the current category being viewed
    }

    handleRefresh = () => {
    	if(this.state.connection_Status == 'Offline') {
    		this.setState({
    			refreshing: false,
    			offset: 0,
    			NewsArticle: [],
    		});
    	} else {
			this.setState({
				refreshing: true,
				offset: 0,
				NewsArticle: [],
			},
				() => this.fetchNews(this.state.category)
			);
		}
    }

    searchSubmitHandler = (forPagination) => {
		if(forPagination === undefined) {
			this.setState({
				searchSubmitted: true,
				lastSearchText: this.state.searchText,
				SearchArticle: [],			//clear the browser
				searchListRefreshing: true,
				searchOffset: 0,
			}, () => {
				getArticleSearch(this.state.searchText, this.state.searchOffset, LIMIT)
					.then( returnedObject => {
						this.setState({ SearchArticle: returnedObject.SearchArticle, 
							emptySearchReturned: returnedObject.emptySearchReturned, 
							searchListRefreshing: false,
							refreshing: false,
						});
					})
					.catch(() => this.setState({SearchArticle: [], searchListRefreshing: false }));
			});
		} else {
			//this branch is for pagination
			this.setState({
				searchListRefreshing: true,
			}, () => {
				getArticleSearch(this.state.lastSearchText, this.state.searchOffset, LIMIT)
					.then( returnedObject => {
						this.setState({ SearchArticle: [...this.state.SearchArticle, ...returnedObject.SearchArticle], 
							emptySearchReturned: returnedObject.emptySearchReturned, 
							searchListRefreshing: false 
						});
					})
					.catch(() => this.setState({SearchArticle: [], searchListRefreshing: false }));
			});
		}
    }

    newsHandleFetchMore = () => {
			if(!this.newsOnEndReachedCalledDuringMomentum) {
				this.setState({
				offset: this.state.offset + OFFSET_CONST,
				//refreshing: true,
				}, () => this.fetchNews(this.state.category));

				this.newsOnEndReachedCalledDuringMomentum = true;
			}
    }

    searchHandleFetchMore = () => {
		if(!this.searchOnEndReachedCalledDuringMomentum) {
			this.setState({
			searchOffset: this.state.searchOffset + OFFSET_CONST,
			}, () => this.searchSubmitHandler(true));

			this.searchOnEndReachedCalledDuringMomentum = true;
		}
    }


    searchOnEndReachedCalledDuringMomentumHandler = () => {
		this.searchOnEndReachedCalledDuringMomentum = false;
    }

    newsOnEndReachedCalledDuringMomentumHandler = () => {
		this.newsOnEndReachedCalledDuringMomentum = false;
    }

    //render functions that return JSX

    leftComponentJSX = () => {
		//BE CAREFUL: Need to check for undefined because the state parameters can be undefined during state transition
		if(this.state.isSearchActive == false || this.state.isSearchActive === undefined) {
			return (
				<View style={styles.headerLeft}>
					<HeaderBackButton
					    onPress={() => this.props.navigation.goBack()}
				    />
				</View>
			);
		} else {
			return (
				<View style={styles.headerLeft}>
					<TouchableHighlight
						style={styles.headerLeftIcon}
						underlayColor={'#DCDCDC'}
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
    }

    centerComponentJSX = () => {
			if(this.state.isSearchActive == false) {
					return (
					<View style={styles.headerTitleContainer}>
							<Text style={ {
							fontWeight: 'bold',
							textAlign: 'center',
							}}>
								Articles
							</Text>
					</View>
					);
			}
			return null;
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
			//Why didn't we just pass in this.state as a parameter rather than individually identifying what is needed in the component being rendered
			//Answer: Because that is not good for optimization
			return (
				<SafeAreaView style={styles.myContainer}>
						<Header
							outerContainerStyles={{height: Platform.OS === 'ios' ? 70 - 25 :  70 - 13, padding: 0}}	//need padding because by default Header has padding on the sides
							backgroundColor={'white'}
							leftComponent={this.leftComponentJSX()}
							centerComponent={this.centerComponentJSX()}
							rightComponent={this.rightComponentJSX()}
						/>
						<DisplayArticles
							searchSubmitted={this.state.searchSubmitted}
							SearchArticle={this.state.SearchArticle}
							searchListRefreshing={this.state.searchListRefreshing}
							NewsArticle={this.state.NewsArticle}
							refreshing={this.state.refreshing}
							handleRefresh={this.handleRefresh}
							isSearchActive={this.state.isSearchActive}
							navigation={this.props.navigation}
							emptySearchReturned={this.state.emptySearchReturned}
							newsHandleFetchMore={this.newsHandleFetchMore}		//no need to bind if use arrow functions
							searchHandleFetchMore={this.searchHandleFetchMore}	//no need to bind if use arrow functions
							searchOnEndReachedCalledDuringMomentumHandler={this.searchOnEndReachedCalledDuringMomentumHandler}  
							newsOnEndReachedCalledDuringMomentumHandler={this.newsOnEndReachedCalledDuringMomentumHandler} 
				    		connection_Status={this.state.connection_Status} 
						/>
					</SafeAreaView>
			);
    }
}

function DisplayArticles(props) {
    if(props.isSearchActive == false || props.isSearchActive === undefined
       || props.searchSubmitted == false) {
	//when search is not active
	return <FlatList
				data={props.NewsArticle}
				renderItem={({ item }) => <Article article={item} navigation={props.navigation} />}
				keyExtractor={item => item.url}
				refreshing={props.refreshing}
				onRefresh={props.handleRefresh}
        		onEndReached={props.newsHandleFetchMore}
        		onEndReachedThreshold={0.1}
				ListEmptyComponent={
					<DisplayEmptyList 
						styles={styles} 
						emptySearchReturned={props.emptySearchReturned} 
						refreshing={props.refreshing}
						searchListRefreshing={props.searchListRefreshing}
						isSearchActive={props.isSearchActive}
						searchSubmitted={props.searchSubmitted}
						connection_Status={props.connection_Status}
					/>
				}
				onMomentumScrollBegin={() => props.newsOnEndReachedCalledDuringMomentumHandler()}
				onScrollBeginDrag={() => props.newsOnEndReachedCalledDuringMomentumHandler()}
			/>;
    } else {
	//when search is active
	return <FlatList
				data={props.SearchArticle}
				renderItem={({ item }) => <Article article={item} navigation={props.navigation} />}
				keyExtractor={item => item.url}
				refreshing={props.searchListRefreshing}
        		onEndReached={props.searchHandleFetchMore}
        		onEndReachedThreshold={0.1}
				ListEmptyComponent={
					<DisplayEmptyList 
						styles={styles} 
						emptySearchReturned={props.emptySearchReturned}
						refreshing={props.refreshing} 
						searchListRefreshing={props.searchListRefreshing}
						isSearchActive={props.isSearchActive}
						searchSubmitted={props.searchSubmitted}
						connection_Status={props.connection_Status}
					/>
				}
				onMomentumScrollBegin={() => props.searchOnEndReachedCalledDuringMomentumHandler()}
	            onScrollBeginDrag={() => props.searchOnEndReachedCalledDuringMomentumHandler()}
			/>;
    }

}

function DisplayEmptyList(props) {
	if(props.connection_Status == 'Offline') {
		return <View style={styles.container}>
			<Text style={styles.welcome}>No Internet</Text>
       </View>;
	}
	//Note: need to check for undefined because render functions are ran before constructor() is ran which renders (no pun intended)
	//all state variables undefined
	else if(props.refreshing || props.searchListRefreshing || 
		props.refreshing === undefined || props.searchListRefreshing === undefined) {
		return <View style={styles.container}>
					<Text style={styles.welcome}>Loading</Text>
		       </View>;
	} else if(props.emptySearchReturned == true) {
		//empty case
		return <View style={styles.container}>
					<Text style={styles.welcome}>No results</Text>
					{props.isSearchActive == true && props.searchSubmitted == true ? 
						<Text style={styles.instructions}>Try a different keyword</Text> : null
					}
					<Text style={styles.instructions}>If connection was lost previously, try again</Text>
		       </View>;
    } else {
		//not empty case --> means there is no internet
		return <View style={styles.container}>
					<Text style={styles.welcome}>Cannot Load Articles</Text>
					<Text style={styles.instructions}>If connection was lost previously, try again</Text>
		       </View>;
    }
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
	myContainer: {
		flex: 1,
		//paddingTop: Constants.statusBarHeight,
	},
	headerTitleContainer: {
		flex: 1,
		//flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		//backgroundColor: 'blue',	//debugging use
	}, //For some reason, flex 1 was required for title to be centered
	dropdown: {
		//flex direction is column orientation by default
		//marginHorizontal: 20,		//I don't remember what this did
		width: 75,
		height: 30,
		alignItems: 'center',
		justifyContent: 'center', //to make the 
		//backgroundColor: 'cornflowerblue',
	},
	//this below is for the search bar container
	headerRight: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		margin: 0,
		//backgroundColor: 'red',	//debugging use
	},
	headerLeft: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		margin: 0,
		//backgroundColor: 'red',	//debugging use
	},
	headerLeftIcon: {
		marginLeft: 8, //need this to position the back icon on left header like the other react-native-navigation headers
		//because we're not using react-native-navigation headers. We're using react-native-elements header
		paddingTop: 9,
		paddingBottom: 9,
		paddingLeft: 13,
		paddingRight: 13,
		borderRadius: 100, //makes the TouchableHighlight circular
		//backgroundColor: 'red',	//debugging use
	},
	headerSearchIcon: {
		//flex: 1,
		//marginLeft: 8,	//WARNING: The padding cannot be all same like headerLeft. The boundary gets messed up
		paddingTop: 9,
		paddingBottom: 9,
		paddingLeft: 13,
		paddingRight: 13,
		borderRadius: 100, //makes the TouchableHighlight circular
		alignItems: 'center',
		//backgroundColor: 'red',	//debugging use
	}
});
