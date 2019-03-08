import React from 'react';
import { Dimensions, StyleSheet, View, ScrollView } from 'react-native';
import { Text } from 'react-native-elements';
import { Button } from 'react-native-elements';
import { RoundButton } from 'react-native-button-component';
import ResizedImage from '../ResizedImage.js';
import MapView from "react-native-maps";

export default class ObservationDetails extends React.Component {
    static navigationOptions = ({ navigation }) => ({
		title: 'Observation Details'
		// title: navigation.state.params.myTitle,	//if you want dynamic titles depending on the observation
    });

    constructor(props) {
		super(props);
    }

    componentDidMount() {
		//debugging
		console.log("inside ObservationDetails.js. Below is the props passed to it");
		console.log(this.props.navigation.getParam('postObject', {} ));

		//This below is a method of passing data to the navigationOptions.
		//navigation.state is different from the component's this.state
		// this.props.navigation.setParams({ myTitle: this.props.navigation.getParam('postObject', {} ).title});
    }

    render() {
		const postObject = this.props.navigation.getParam('postObject', {});

		if (!postObject.lat || !postObject["lng"]) {
			return (
			    <ScrollView style={styles.container}>
					<View style={styles.imageContainer}>
						<ResizedImage
							source={{uri: postObject.urlToImage}}
							margin={14}
						/>
					</View>

					<View style={styles.titleContainer}>
						<Text style={styles.title}> {postObject.name} </Text>
					</View>

					<View style={styles.summaryContainer}>
						<Text style={styles.summary}> {postObject.comment} </Text>
					</View>
		        </ScrollView>
			);
		} else {
			return (
			    <ScrollView style={styles.container}>
					<View style={styles.imageContainer}>
						<ResizedImage
							source={{uri: postObject.urlToImage}}
							margin={14}
						/>
					</View>

					<View style={styles.titleContainer}>
						<Text style={styles.title}> {postObject.name} </Text>
					</View>

					<View style={styles.summaryContainer}>
						<Text style={styles.summary}> {postObject.comment} </Text>
					</View>

					<View style={styles.mapContainer}>
						<MapView style={StyleSheet.absoluteFillObject} 
							initialRegion={{
								latitude: postObject.lat,
								longitude: postObject["lng"],
								latitudeDelta: 0.0922,
								longitudeDelta: 0.0421,
							}}
						>
							<MapView.Marker
							coordinate={{latitude: postObject.lat,
							longitude: postObject["lng"]}}
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
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 20,	//adds space at the top so that the buttons don't go underneath the header
    },
    button: {
        height: 50,
        width: 250,
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
		// alignItems: 'center',
		marginLeft: 14,
		marginRight: 14,
    },
    summary: {
		// textAlign: 'center',
    },
    mapContainer: {
		height: Dimensions.get("window").width - 14*2,	//WARNING: This is for MapView to be rendered
		marginTop: 25,
		marginLeft: 14,
		marginRight: 14,
		backgroundColor:'green',
    },
};
