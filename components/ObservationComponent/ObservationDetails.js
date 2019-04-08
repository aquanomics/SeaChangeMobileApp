import React from 'react';
import {
  Dimensions, StyleSheet, View, ScrollView
} from 'react-native';
import { Text } from 'react-native-elements';
import { Divider } from 'react-native-elements';
import { RoundButton } from 'react-native-button-component';
import Dialog, {
  DialogTitle, ScaleAnimation, DialogFooter, DialogButton
} from 'react-native-popup-dialog';
import { material, materialColors, systemWeights } from 'react-native-typography';
import MapView from 'react-native-maps';
import ResizedImage from '../ResizedImage.js';
import { DisplayApproval } from './ObservationCard';

const URL = 'http://seachange.ca-central-1.elasticbeanstalk.com/post-img/image-delete';

export default class ObservationDetails extends React.Component {
    static navigationOptions = ({ navigation }) => ({
      title: 'Observation Details'
      // title: navigation.state.params.myTitle,	//if you want dynamic titles depending on the observation
    });

    constructor(props) {
      super(props);
    }

	state = {
	  buttonDeleteState: 'delete',
	  displayResultDialog: false,
	  deleteDialog: false,
    dialogText: '',
    disableDelete: false,
	};

	handleDeleteObservation = (imageKey) => {
	  const resultUrl = `${URL}?imageKey=${imageKey}`;
	  fetch(resultUrl, { method: 'DELETE' })
	    .then((response) => {
	      if (response.status != 200) { // internal server error
	        this.setState({ buttonDeleteState: 'delete', displayResultDialog: true, dialogText: 'Failed to Delete Observation.' });
	      } else {
	        this.setState({ buttonDeleteState: 'delete', displayResultDialog: true, dialogText: 'Delete Successful!' });
	      }
	    })
	    .catch((error) => { // external server error
	      this.setState({ buttonUploadState: 'delete', displayResultDialog: true, dialogText: error.message });
	    });
	};

	render() {
    const postObject = this.props.navigation.getParam('postObject', {});
    const fromMap = this.props.navigation.getParam('fromMap', {});

    console.log("FromMap is: " + fromMap);

    if(fromMap === undefined) {
      fromMap = false;
    }

	  if (!postObject.lat || !postObject.lng) {
	    return (
  <ScrollView style={styles.container}>
    <View style={styles.imageContainer}>
      <ResizedImage
        source={{ uri: postObject.urlToImage }}
        margin={14}
      />
    </View>

    <View style={styles.titleContainer}>
      <Text style={styles.title}>{postObject.name == 'default-name' ? '' : postObject.name}</Text>
    </View>

    <View style={styles.summaryContainer}>
      <Text style={styles.summary}>{postObject.comment == 'null' ? '' : postObject.comment}</Text>
    </View>

    <Dialog
      onTouchOutside={() => {
							  this.setState({ deleteDialog: false });
      }}
      width={0.9}
      visible={this.state.deleteDialog}
      dialogAnimation={new ScaleAnimation()}
      dialogTitle={(
        <DialogTitle
          title="Do you want to delete this observation ?"
          hasTitleBar={false}
        />
)}
      footer={(
        <DialogFooter>
          <DialogButton
            text="Yes"
            onPress={() => {
									  this.setState({ buttonDeleteState: 'deleting' });
									  this.setState({ deleteDialog: false });
									  this.handleDeleteObservation(postObject.imageKey);
            }}
          />
          <DialogButton
            text="No"
            onPress={() => { this.setState({ deleteDialog: false }); }}
          />
        </DialogFooter>
)}
    />

    <Dialog
      onTouchOutside={() => {
							  this.setState({ displayResultDialog: false });
							  this.props.navigation.state.params.deletionRefreshListData();
							  this.props.navigation.goBack();
      }}
      width={0.9}
      visible={this.state.displayResultDialog}
      dialogAnimation={new ScaleAnimation()}
      dialogTitle={(
        <DialogTitle
          title={this.state.dialogText}
          hasTitleBar={false}
        />
)}
      footer={(
        <DialogFooter>
          <DialogButton
            text="Continue"
            onPress={() => {
									  this.setState({ displayResultDialog: false });
									  this.props.navigation.state.params.deletionRefreshListData();
									  this.props.navigation.goBack();
            }}
          />
        </DialogFooter>
)}
    />

    <View style={styles.buttonContainer}>
      {!fromMap && <RoundButton
        style={styles.button}
        buttonState={this.state.buttonDeleteState}
        gradientStart={{ x: 0.5, y: 1 }}
        gradientEnd={{ x: 1, y: 1 }}
        textStyle={styles.buttonTextFont}
        states={{
								  delete: {
								    text: 'Delete Observation',
								    backgroundColors: ['#ff3333', '#ff3333'],
								    onPress: () => {
								      this.setState({ deleteDialog: true });
								    },
								  },
								  deleting: {
								    text: 'Deleting Observation...',
								    gradientStart: { x: 0.8, y: 1 },
								    gradientEnd: { x: 1, y: 1 },
								    backgroundColors: ['#FF416C', '#FF4B2B'],
								    spinner: true,
								    onPress: () => {},
								  },
        }}
      />}
    </View>

    <Divider style={styles.divider} />

    <View style={styles.footer}>
      <DisplayApproval approved={postObject.approved} />
      <Text style={styles.noteStyle}>{postObject.uploaded_at.slice(0, -4)}</Text>
    </View>
  </ScrollView>
	    );
	  }
	  return (
  <ScrollView style={styles.container}>
    <View style={styles.imageContainer}>
      <ResizedImage
        source={{ uri: postObject.urlToImage }}
        margin={14}
      />
    </View>

    <View style={styles.titleContainer}>
      <Text style={styles.title}>{postObject.name == 'default-name' ? '' : postObject.name}</Text>
    </View>

    <View style={styles.summaryContainer}>
      <Text style={styles.summary}>{postObject.comment == 'null' ? '' : postObject.comment}</Text>
    </View>

    <Dialog
      onTouchOutside={() => {
							  this.setState({ deleteDialog: false });
      }}
      width={0.9}
      visible={this.state.deleteDialog}
      dialogAnimation={new ScaleAnimation()}
      dialogTitle={(
        <DialogTitle
          title="Do you want to delete this observation ?"
          hasTitleBar={false}
        />
)}
      footer={(
        <DialogFooter>
          <DialogButton
            text="Yes"
            onPress={() => {
									  this.setState({ buttonDeleteState: 'deleting' });
									  this.setState({ deleteDialog: false });
									  this.handleDeleteObservation(postObject.imageKey);
            }}
          />
          <DialogButton
            text="No"
            onPress={() => { this.setState({ deleteDialog: false }); }}
          />
        </DialogFooter>
)}
    />

    <Dialog
      onTouchOutside={() => {
							  this.setState({ displayResultDialog: false });
							  this.props.navigation.state.params.deletionRefreshListData();
							  this.props.navigation.goBack();
      }}
      width={0.9}
      visible={this.state.displayResultDialog}
      dialogAnimation={new ScaleAnimation()}
      dialogTitle={(
        <DialogTitle
          title={this.state.dialogText}
          hasTitleBar={false}
        />
)}
      footer={(
        <DialogFooter>
          <DialogButton
            text="Continue"
            onPress={() => {
									  this.setState({ displayResultDialog: false });
									  this.props.navigation.state.params.deletionRefreshListData();
									  this.props.navigation.goBack();
            }}
          />
        </DialogFooter>
)}
    />

    <View style={styles.buttonContainer}>
    {!fromMap && <RoundButton
        style={styles.button}
        buttonState={this.state.buttonDeleteState}
        gradientStart={{ x: 0.5, y: 1 }}
        gradientEnd={{ x: 1, y: 1 }}
        textStyle={styles.buttonTextFont}
        states={{
								  delete: {
								    text: 'Delete Observation',
								    backgroundColors: ['#ff3333', '#ff3333'],
								    onPress: () => {
								      this.setState({ deleteDialog: true });
								    },
								  },
								  deleting: {
								    text: 'Deleting Observation...',
								    gradientStart: { x: 0.8, y: 1 },
								    gradientEnd: { x: 1, y: 1 },
								    backgroundColors: ['#FF416C', '#FF4B2B'],
								    spinner: true,
								    onPress: () => {},
								  },
        }}
      />}
    </View>

    <Divider style={styles.divider} />

    <View style={styles.footer}>
      <DisplayApproval approved={postObject.approved} />
      <Text style={styles.noteStyle}>{postObject.uploaded_at.slice(0, -4)}</Text>
    </View>

    <View style={styles.mapContainer}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
								  latitude: postObject.lat,
								  longitude: postObject.lng,
								  latitudeDelta: 0.0922,
								  longitudeDelta: 0.0421,
        }}
      >
        <MapView.Marker
          coordinate={{
            latitude: postObject.lat,
								  longitude: postObject.lng
          }}
          title={postObject.name}
          description={postObject.comment}
        />
      </MapView>
    </View>
  </ScrollView>
	  );
	}
}

const setUrlParam = (url, param) => {
  const name = param.imageKey;
  const resultUrl = `${url}?imageKey=${param.imageKey}`;

  return resultUrl;
};

const styles = {
  container: {
    // alignItems: 'stretch',
    // justifyContent: 'center',
  },
  noteStyle: {
    margin: 5,
    fontStyle: 'italic',
    color: '#b2bec3',
    fontSize: 10
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20, // adds space at the top so that the buttons don't go underneath the header
  },
  button: {
    height: 50,
    width: 250,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8, // BE CAREFUL: If the padding number is changed, remember to update the prop to ResizedImage.js
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
    // alignItems: 'center',
    marginLeft: 14,
    marginRight: 14,
  },
  summary: {
    // textAlign: 'center',
  },
  mapContainer: {
    height: Dimensions.get('window').width - 14 * 2, // WARNING: This is for MapView to be rendered
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
  buttonTextFont: {
    ...material.button,
    ...systemWeights.light,
    color: materialColors.whitePrimary,
    fontSize: 17,
    textAlign: 'center',
  },
};
