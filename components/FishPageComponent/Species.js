import React from 'react';
import { ActivityIndicator, ListView, Platform, StyleSheet, Text, View, Linking, Image, TouchableHighlight} from 'react-native';
export default class Species extends React.Component {
  render() {
    const {
    	SpecCode,
    	FBname,
    	Genus,
    	Species,
    	PicPreferredName
    } = this.props.species;
    const defaultImage = "https://previews.123rf.com/images/shock77/shock770906/shock77090600028/5010370-funny-cartoon-fish.jpg";
    return (
    <TouchableHighlight
        onPress={() => Linking.openURL("https://www.fishbase.ca/summary/" + SpecCode)}
      > 
    	<View>
        <View style={styles.row}>
        <Image
          style={styles.imageContainer}
          source={{uri: "https://www.fishbase.ca/images/species/"+ PicPreferredName || defaultImage}}
        />
          <View style={styles.textContainer}>
            <Text style={styles.fishName} numberOfLines={1}>
              {FBname}
            </Text>
            <Text style={styles.petDescription} numberOfLines={2}>
              {Genus + " " + Species}
            </Text>
          </View>
        </View>
      </View>
      </TouchableHighlight>
    );
}
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    borderStyle: 'solid',
    borderBottomColor: '#dddddd',
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: 5,
  },
  imageContainer: {
    width: 150,
    height: 100,
    marginRight: 10
  },
  textContainer: {
    flex: 1,
  },
  noImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    color: '#aaaaaa',
  },
  petImage: {
    width: 90,
    height: 90,
  },
  fishName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  petBreed: {
    fontSize: 13,
  },
  petDescription: {
    fontSize: 12,
    marginTop: 5,
    marginBottom: 5,
  },
  petLocation: {
    fontSize: 12,
    color: 'gray',
  },
});