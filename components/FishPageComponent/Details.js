import React from 'react';
import { Animated, ListView, Platform, StyleSheet, Text, View, Linking, Image, TouchableHighlight} from 'react-native';
export default class Details extends React.Component {


  constructor(props) {
    super(props);
      this.state = {
        scaleValue: new Animated.Value(0)
      }
  }   

  //TODO: IN-PROGESS TO MAKE GOOD ANIMATION FOR EACH CARD RENDER
  componentDidMount() {
    Animated.timing(this.state.scaleValue, {
        toValue: 1,
        duration : 600,
        delay: this.props.index * 300
    }).start();
  } 
   render() {
    const {
      FBname,
      Genus,
      Species,
      PicPreferredName,
      Length,
      Weight,
      Comments
    } = this.props.details;
    const defaultImage = "https://previews.123rf.com/images/shock77/shock770906/shock77090600028/5010370-funny-cartoon-fish.jpg";
    return (
    <TouchableHighlight onPress={() => Linking.openURL("https://www.fishbase.ca/summary/" + SpecCode)}> 
      <Animated.View style={{ opacity: this.state.scaleValue }}>
        <View style={styles.row}>
          <Image
            style={styles.imageContainer}
            source={{uri: "https://www.fishbase.ca/images/species/"+ PicPreferredName || defaultImage}}
            resizeMode="stretch"
          />
          <View style={styles.textContainer}>
            <Text style={styles.fishName} numberOfLines={1}> {FBname} </Text>
            <Text style={styles.petDescription} numberOfLines={2}> {Genus + " " + Species} </Text>
            <Text style={styles.petDescription} numberOfLines={7}> {Comments} </Text>
          </View>
        </View>
      </Animated.View>
    </TouchableHighlight>
    );
}
}
const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    backgroundColor: '#f9f5ed',
    flexDirection: 'row',
    borderStyle: 'solid',
    borderBottomColor: '#dddddd',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderRadius: 15,
    elevation: 2,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 18,
    paddingRight: 16,
    marginLeft: 14,
    marginRight: 14,
    marginTop: 0,
    marginBottom: 6,

  },
  imageContainer: {
    width: 150,
    height: 100,
    borderRadius: 35,
    borderWidth: 1,
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