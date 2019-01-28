import React from 'react';
import { Dimensions, StyleSheet, View, ScrollView } from 'react-native';
import { Text } from 'react-native-elements';
import { Button } from 'react-native-elements';
import ResizedImage from '../ResizedImage.js';
import MapView from "react-native-maps";

export default class ArticleAbstraction extends React.Component {
    static navigationOptions = ({ navigation }) => ({
	title: navigation.state.params.myTitle,
    });

    constructor(props) {
	super(props);
    }

    componentDidMount() {
	//debugging
	console.log("inside ArticleAbstraction.js. Below is the props passed to it");
	console.log(this.props.navigation.getParam('articleObject', {} ));

	//This below is a method of passing data to the navigationOptions.
	//I think navigation.state is different from the component's state
	this.props.navigation.setParams({ myTitle: this.props.navigation.getParam('articleObject', {} ).title});
    }

    render() {
	//const time = moment(this.props.article.published_at || moment.now()).fromNow();
	const defaultImg = 'https://wallpaper.wiki/wp-content/uploads/2017/04/wallpaper.wiki-Images-HD-Diamond-Pattern-PIC-WPB009691.jpg';
//	coordinate={{latitude: 37.78825,
//		     longitude: -122.4324}}
	const articleObject = this.props.navigation.getParam('articleObject', {});

	if (!articleObject.lat || !articleObject["long"]) {
	return (
	    <ScrollView style={styles.container}>
			<View style={styles.imageContainer}>
				<ResizedImage
					source={{uri: articleObject.urlToImage || defaultImg}}
					margin={14}
				/>
			</View>

			<View style={styles.titleContainer}>
				<Text style={styles.title}> {articleObject.title} </Text>
			</View>

			<View style={styles.summaryContainer}>
				<Text style={styles.summary}> {articleObject.description} </Text>
			</View>

			<View style={styles.buttonContainer}>
					<Button
						onPress={() => this.props.navigation.navigate('ArticleWebView', {uri: articleObject.url})}	//opening another component using <WebView />
						title="See Full Article"
					/>
			</View>
        </ScrollView>
	);
	} else {
	return (
	    <ScrollView style={styles.container}>
			<View style={styles.imageContainer}>
				<ResizedImage
						source={{uri: articleObject.urlToImage || defaultImg}}
					margin={14}
				/>
			</View>

			<View style={styles.titleContainer}>
				<Text style={styles.title}> {articleObject.title} </Text>
			</View>

			<View style={styles.summaryContainer}>
				<Text style={styles.summary}> {articleObject.description} </Text>
			</View>

			<View style={styles.buttonContainer}>
					<Button
						onPress={() => this.props.navigation.navigate('ArticleWebView', {uri: articleObject.url})}	//opening another component using <WebView />
						title="See Full Article"
					/>
			</View>

			<View style={styles.mapContainer}>
				<MapView style={StyleSheet.absoluteFillObject} 
					initialRegion={{
						latitude: articleObject.lat,
						longitude: articleObject["long"],
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421,
					}}
				>
					<MapView.Marker
					coordinate={{latitude: articleObject.lat,
					longitude: articleObject["long"]}}
					title={"Article Location"}
					description={"..."}
					/>
				</MapView>
		
			</View>
        </ScrollView>
	);
	}
    }
}

const styles = {
    container: {
        //alignItems: 'stretch',
        //justifyContent: 'center',
    },
    buttonContainer: {
	marginTop: 20,	//adds space at the top so that the buttons don't go underneath the header
    },
    imageContainer:{
	justifyContent: 'center',
	alignItems: 'center',
	paddingLeft: 8,		//BE CAREFUL: If the padding number is changed, remember to update the prop to ResizedImage.js
	paddingRight: 8,
	marginTop: 20,
    },
    titleContainer: {
	justifyContent: 'center',
	marginTop: 12,
	marginLeft: 14,
	marginRight: 14,
    },
    title: {
	fontWeight: 'bold',
	fontSize: 20,
    },
    summaryContainer:{
	justifyContent: 'center',
	alignItems: 'center',
	marginLeft: 14,
	marginRight: 14,
    },
    summary: {
	//textAlign: 'center',
    },
    mapContainer: {
	height: Dimensions.get("window").width - 14*2,	//WARNING: This is for MapView to be rendered
	marginTop: 25,
	marginLeft: 14,
	marginRight: 14,
	backgroundColor:'green',
    },
};
