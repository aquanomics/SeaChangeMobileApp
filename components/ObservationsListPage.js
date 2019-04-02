import React from 'react';
import { NetInfo, Dimensions, Image, Platform, BackHandler, TouchableHighlight, TextInput, FlatList, StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { Header } from 'react-native-elements';
import Article from './ArticlePageComponent/Article';	//Component used to render each entry in the list
import Icon from 'react-native-vector-icons/Ionicons';
import { RkCard, RkGalleryImage, RkGallery } from 'react-native-ui-kitten';
import firebase from 'react-native-firebase';
import ResizedImage from './ResizedImage.js';
import ObservationCard from './ObservationComponent/ObservationCard';	//Component used to render each entry in the list
import { HeaderBackButton } from 'react-navigation';

import ModalDropdown from 'react-native-modal-dropdown';
const dropdownOptions = ['TopStories', 'Canada', 'World'];
const LIMIT = 5;	//this is used as a constant for BOTH searchList[] and observationList[]
const DESC_MAXLENGTH = 150;	//description max length
const OFFSET_CONST = 5;	//this is used as a constant for BOTH searchList[] and observationList[]
const urlObservation = 'http://seachange.ca-central-1.elasticbeanstalk.com/api/posts?'
const urlPostSearch = 'http://seachange.ca-central-1.elasticbeanstalk.com/api/postSearch?'

//This default inmage is for testing purposes only
const defaultImg = 'https://wallpaper.wiki/wp-content/uploads/2017/04/wallpaper.wiki-Images-HD-Diamond-Pattern-PIC-WPB009691.jpg';

export default class ObservationsListPage extends React.Component {
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
		    observationList: [],			//for news FlatList
		    searchList: [],			//for search FlatList
		    refreshing: true,			//for news FlatList
		    searchListRefreshing: false,	//for search FlatList
		    searchText: '',
		    searchSubmitted: false,		//to keep track of whether search has been submitted at least once during the search session
		    					//This is used in the logic so that when you first try to search something before submission,
		    					//the empty list doesn't show up
		    lastSearchText: '',			//This is used for searchList during pagination because if the list is at the end and if we were
		    					//to search at that time, onEndReached() of <FlatList> would constantly fire which is undesirable
		    isSearchActive: false,        	//state for search transition
		    emptySearchReturned: false,		//to keep track if no entries are returned for the given search keyword.
							//This is used in the logic to differentiate whether to say No Internet or No Results
		    offset: 0,				//used for offsetting for pagination FOR observationList[]	
		    searchOffset: 0,			//used for offsetting for pagination FOR searchList[]	
		    imageFullscreenOn: false,
		    user: null,
		    connection_Status : "",		//used to check network state
		};

		this.initialFetchExecuted = false;	//REMEMBER to reset when disconnected

        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        );
    }

    componentDidMount() {
	    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
	        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
	    );

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

	    this.unsubscriber = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({'user': user}, () => {
                	//this callback function can be called multiple times when internet is unavailable
                	//This ensures auto fetch is only executed once 
                	if(this.initialFetchExecuted == false) {
	                	this.fetchObservation();	
	                	this.initialFetchExecuted = true;
                	}
                });
            } else {
                //Note: Since this page is only accessible while signed in, when signed out,
                //redirect the user to the log in page
                this.setState({user: null}, () => {
                    this.props.navigation.goBack();     //go back to profile page
                    this.props.navigation.goBack();     //go back to map page
                    //below: go again to profile page. This may sound redundant but is required to display the Dialog
                    this.props.navigation.navigate('Profile', {		
                        externalDisplayDialog: true, 
                        externalDialogText: "You have been signed out due to inactivity. Please sign in again"
                    });  //go to profile screen and pass in prop to display the dialog
                });
            }
        });
    }
    
    componentWillUnmount() {
		this._didFocusSubscription && this._didFocusSubscription.remove();
		this._willBlurSubscription && this._willBlurSubscription.remove();
        if (this.unsubscriber) {
            this.unsubscriber();
        }

        NetInfo.isConnected.removeEventListener(
        	'connectionChange',
        	this._handleConnectivityChange
    	);
    }

	//reference: https://reactnativecode.com/netinfo-example-to-detect-internet-connection/
    _handleConnectivityChange = (isConnected) => {
	    if(isConnected == true)
	        this.setState({connection_Status : "Online"});
	    else
	        this.setState({connection_Status : "Offline"});
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
				searchList: [],
				searchListRefreshing: false,
				searchOffset: 0,
				searchSubmitted: false,
				lastSearchText: this.state.searchText,
		    });
		} else {
		    this.setState({ isSearchActive: true});
		}
    }

    //WARNING: fetch does not replace the state.observationList anymore. Therefore, before this function is called,
    //observationList should be emptied unless you want the new fetched material to be concatenated with the old array
    //which you sometimes want it to happen aka pagination
    //PRECONDITION: Assumes you will call this AFTER this.state.offset has been updated
    fetchObservation = () => {

		this.state.user.getIdToken()
            .then(idToken => {
		    	var completeUrl = urlObservation + 
		    		`uid=${this.state.user.uid}` + 
		    		`&idToken=${idToken}` + 
		    		`&offset=${this.state.offset}` +
		    		`&limit=${LIMIT}`;
		    	return fetch(completeUrl);
            })
            .then(response => {
            	if(response.status != 200) {
                    this.setState({ emptySearchReturned: false});
                    throw {message: `Internal server error! Error code ${response.status}`};
                } else {
                    return response.json();
                }
            })
            .then(response => {
            	//Note: empty search returned is not considered an error
            	this.setState({
            		observationList: [...this.state.observationList, ...response.Posts],
            		refreshing: false,
            		emptySearchReturned: response.Posts.length == 0,
            	});
            })
            .catch(error => {   //for external and internal server error
                console.log(error.message);
                this.setState({observationList: []});
            });;
    }

    //This function is for the observation details page to call if deletion is successful. We need to refresh
    //because deleted observations should not appear in the list after deletion
    deletionRefreshListData = () => {
    	this.handleRefresh();
    	this.searchSubmitHandler();
    }

    handleRefresh = () => {
    	if(this.state.connection_Status == 'Offline') {
    		this.setState({
    			refreshing: false,
    			offset: 0,
    			observationList: [],
    		});
    	} else {
			this.setState({
				refreshing: true,
				offset: 0,
				observationList: [],
		    }, () => {
		    	this.fetchObservation();
		    });
    	}
    }

    //WARNING: Not sure if promise is rejected whether or not it will go to catch inside searchSubmitHandler
    //Post Condition: Returns the relevant array containing the pertinent data
    observationSearch = async (searchText) => {
	    var idToken = await this.state.user.getIdToken();
	    var urlComplete = urlPostSearch + `search=${searchText}` + `&offset=${this.state.searchOffset}`
	    	+ `&limit=${LIMIT}` + `&idToken=${idToken}` + `&uid=${this.state.user.uid}`;
	    var result = await fetch(urlComplete);

        if(result.status != 200) {
        	this.setState({ emptySearchReturned: false});
            throw {message: `Internal server error! Error code ${response.status}`};
        }

        var resultJson = await result.json();

        //Note: empty search returned is not considered an error
    	this.setState({emptySearchReturned: resultJson.List.length == 0});

        return resultJson.List;
	}

    searchSubmitHandler = (forPagination) => {
		if(forPagination === undefined) {
		    this.setState({
				searchSubmitted: true,
				lastSearchText: this.state.searchText,
				searchList: [],			//clear the list
				searchListRefreshing: true,
				searchOffset: 0,		//reset offset
		    }, () => {
				this.observationSearch(this.state.searchText)
				    .then( dataList => {
						this.setState({ 
							searchList: dataList,
							searchListRefreshing: false 
						});
					})
				    .catch(error => {
				    	console.log(error.message);
				    	this.setState({searchList: [], searchListRefreshing: false })
				    });
		    });
		} else {
		    //this branch is for pagination
		    this.observationSearch(this.state.lastSearchText)
				.then( dataList => {
				    this.setState({ searchList: [...this.state.searchList, ...dataList], searchListRefreshing: false });
				})
				.catch(error => {
			    	console.log(error.message);
			    	this.setState({searchList: [], searchListRefreshing: false })
			    });
		}
    }

    observationsFetchMore = () => {
		if(!this.newsOnEndReachedCalledDuringMomentum) {
		    this.setState({
				offset: this.state.offset + OFFSET_CONST,
				//refreshing: true,
		    }, () => this.fetchObservation());
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

    imageOnClick = () => {
    	this.setState({imageFullscreenOn: !this.state.imageFullscreenOn});
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
				} }
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
			    } }>
			    	Your Observations
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
{/*	            <ModalDropdown
	        	    style={styles.dropdown}
	        	    defaultValue='Filter'
	        	    options={dropdownOptions}
	        	    //WARNING: context is lost within onSelect
	        	    //onSelect={(idx, value) => alert("index of " + idx + " and value of " + value + " has been chosen")}
	            	onSelect={(idx, value) => this.dropdownHandler(value)}//using getParam is the way to get around "this" context being lost
	        	/>*/}
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
						onSubmitEditing={() => this.searchSubmitHandler()}
						onChangeText={ (text) => this.setState({searchText: text})}
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
		    		searchList={this.state.searchList}
		    		searchListRefreshing={this.state.searchListRefreshing}
		    		observationList={this.state.observationList}
		    		refreshing={this.state.refreshing}
		    		handleRefresh={this.handleRefresh}
		    		isSearchActive={this.state.isSearchActive}
		    		navigation={this.props.navigation}
		    		emptySearchReturned={this.state.emptySearchReturned}
		    		observationsFetchMore={this.observationsFetchMore}		//no need to bind if use arrow functions
		    		searchHandleFetchMore={this.searchHandleFetchMore}	//no need to bind if use arrow functions
		    		searchOnEndReachedCalledDuringMomentumHandler={this.searchOnEndReachedCalledDuringMomentumHandler}  
		    		newsOnEndReachedCalledDuringMomentumHandler={this.newsOnEndReachedCalledDuringMomentumHandler}
		    		imageOnClick={this.imageOnClick}
		    		imageFullscreenOn={this.imageFullscreenOn}
		    		connection_Status={this.state.connection_Status}
		    		deletionRefreshListData={this.deletionRefreshListData.bind(this)}
		    	/>
		    </SafeAreaView>
		);
    }
}

function DisplayArticles(props) {
	//check if image fullscreen mode is on
	if(props.imageFullscreenOn) {
		return (
			<RkGalleryImage
				source={{'uri': 'https://kidmania.files.wordpress.com/2010/11/smile.png'}}
			/>
		)
	}

    if(props.isSearchActive == false || props.isSearchActive === undefined
       || props.searchSubmitted == false) {
		//when search is not active
		return (
			<FlatList
				data={props.observationList}
				renderItem={({item}) => <ObservationCard item={item} navigation={props.navigation} deletionRefreshListData={props.deletionRefreshListData} />}
				keyExtractor={item => item.imageKey}
				refreshing={props.refreshing}
				onRefresh={props.handleRefresh}
        		onEndReached={props.observationsFetchMore}
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
			/>
		);
    } else {
		//when search is active
		return (
			<FlatList
				data={props.searchList}
				renderItem={({item}) => <ObservationCard item={item} navigation={props.navigation} deletionRefreshListData={props.deletionRefreshListData} />}
				keyExtractor={item => item.imageKey}
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
			/>
		);
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
					<Text style={styles.welcome}>Cannot Load Observations</Text>
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
    },		//For some reason, flex 1 was required for title to be centered
    dropdown: {
		//flex direction is column orientation by default
		//marginHorizontal: 20,		//I don't remember what this did
		width: 75,
		height: 30,
		alignItems: 'center',
		justifyContent: 'center',	//to make the 
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
		marginLeft: 8,		//need this to position the back icon on left header like the other react-native-navigation headers
					//because we're not using react-native-navigation headers. We're using react-native-elements header
		paddingTop: 9,
		paddingBottom: 9,
		paddingLeft: 13,
		paddingRight: 13,
		borderRadius:100, 	//makes the TouchableHighlight circular
		//backgroundColor: 'red',	//debugging use
    },
    headerSearchIcon: {
		//flex: 1,
		//marginLeft: 8,	//WARNING: The padding cannot be all same like headerLeft. The boundary gets messed up
		paddingTop: 9,
		paddingBottom: 9,
		paddingLeft: 13,
		paddingRight: 13,
		borderRadius:100, 	//makes the TouchableHighlight circular
		alignItems: 'center',
		//backgroundColor: 'red',	//debugging use
    },
    cardContainer: {
    	// alignItems: 'center',
    	marginVertical: 5,
    	marginHorizontal: 10,
    },
    image: {
    	//NOTE: images from online url requires width and height for react native. Cannot use flex
		width: Math.round(Dimensions.get('window').width * (.94)),
        height: 200,
        resizeMode: 'cover',
        // borderWidth: 2,
        alignSelf: 'center'
    },
    cardHeaderContainer: {
    	alignItems: 'flex-start',
    	marginHorizontal: 10,
    	marginTop: 10,
    },
    cardHeader: {
    	fontWeight: 'bold',
    	fontSize: 25,
    },
    cardTextDescriptionContainer: {
    	alignItems: 'flex-start',
    	marginHorizontal: 10,
    	marginVertical: 8,
    },
    cardDescription: {
    },
    cardDate: {
    	color: '#A9A9A9',
    	fontSize: 10,
    },
    featuredTitleStyle: {
	    marginHorizontal: 5,
	    textShadowColor: '#00000f',
	    textShadowOffset: { width: 3, height: 3 },
	    textShadowRadius: 3
	},
	noteStyle: {
	    margin: 5,
	    fontStyle: 'italic',
	    color: '#b2bec3',
	    fontSize: 10
	},
});
