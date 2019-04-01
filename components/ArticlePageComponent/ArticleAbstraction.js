import React from 'react';
import { Dimensions, StyleSheet, View, ScrollView } from 'react-native';
import { Text, Divider } from 'react-native-elements';
import { RoundButton } from 'react-native-button-component';
import ResizedImage from '../ResizedImage.js';
import MapView from "react-native-maps";
import moment from 'moment';

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
			const articleObject = this.props.navigation.getParam('articleObject', {});
			const time = moment(articleObject.published_at || moment.now()).fromNow();

			if (!articleObject.lat || !articleObject["lng"]) {
				return (
						<ScrollView style={styles.container}>
							<View style={styles.imageContainer}>
								<ResizedImage
									source={(articleObject.urlToImage != null)
										? {uri: articleObject.urlToImage}                      
										: require('../../img/place_holders/no-image-article.png')}
									margin={14}
								/>
							</View>

							<View style={styles.titleContainer}>
								<Text style={styles.title}>{articleObject.title}</Text>
							</View>

							<View style={styles.summaryContainer}>
								<Text style={styles.summary}>{articleObject.description}</Text>
							</View>

							<View style={styles.buttonContainer}>
								<RoundButton
									style = {styles.button}
									onPress={() => this.props.navigation.navigate('ArticleWebView', {uri: articleObject.url})}	//opening another component using <WebView />
									type="primary"
									backgroundColors={['#0099cc', '#0099cc']}
									gradientStart={{ x: 0.5, y: 1 }}
									gradientEnd={{ x: 1, y: 1 }}
									text="See Full Article"
								/>
							</View>

							<Divider style={styles.divider} />

							<View style={styles.footer}>
									<Text style={styles.noteStyle}>{articleObject.source_name.toUpperCase()}</Text>
									<Text style={styles.noteStyle}>{time}</Text>
							</View>
						</ScrollView>
				);
			} else {
				return (
					<ScrollView style={styles.container}>
						<View style={styles.imageContainer}>
							<ResizedImage
								source={(articleObject.urlToImage != null)
									? {uri: articleObject.urlToImage}                      
									: require('../../img/place_holders/no-image-article.png')}
								margin={14}
							/>
						</View>

						<View style={styles.titleContainer}>
							<Text style={styles.title}>{articleObject.title}</Text>
						</View>

						<View style={styles.summaryContainer}>
							<Text style={styles.summary}>{articleObject.description}</Text>
						</View>

						<View style={styles.buttonContainer}>
								<RoundButton
									style = {styles.button}
									onPress={() => this.props.navigation.navigate('ArticleWebView', {uri: articleObject.url})}	//opening another component using <WebView />
									text="See Full Article"
									backgroundColors={['#0099cc', '#0099cc']}
									gradientStart={{ x: 0.5, y: 1 }}
									gradientEnd={{ x: 1, y: 1 }}
								/>
						</View>

						<Divider style={styles.divider} />
									<View style={styles.footer}>
											<Text style={styles.noteStyle}>{articleObject.source_name.toUpperCase()}</Text>
											<Text style={styles.noteStyle}>{time}</Text>
									</View>

						<View style={styles.mapContainer}>
							<MapView style={StyleSheet.absoluteFillObject} 
								initialRegion={{
									latitude: articleObject.lat,
									longitude: articleObject["lng"],
									latitudeDelta: 0.0922,
									longitudeDelta: 0.0421,
								}}
							>
								<MapView.Marker
								coordinate={{latitude: articleObject.lat,
								longitude: articleObject["lng"]}}
								title={articleObject.title}
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
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 18, //adds space at the top so that the buttons don't go underneath the header
	},
	button: {
		height: 50,
		width: 250,
	},
	imageContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingLeft: 8, //BE CAREFUL: If the padding number is changed, remember to update the prop to ResizedImage.js
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
	summaryContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 14,
		marginRight: 14,
	},
	summary: {
		//textAlign: 'center',
	},
	mapContainer: {
		height: Dimensions.get("window").width - 14 * 2, //WARNING: This is for MapView to be rendered
		marginTop: 25,
		marginLeft: 14,
		marginRight: 14,
		backgroundColor: 'green',
	},
	divider: {
		backgroundColor: '#dfe6e9',
		marginTop: 10,
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	noteStyle: {
		margin: 5,
		fontStyle: 'italic',
		color: '#b2bec3',
		fontSize: 10
	},
};
