import React from 'react';
import { Animated, ListView, Platform, StyleSheet, Text, View, Linking, Image, TouchableHighlight} from 'react-native';
import { material, materialColors, systemWeights } from 'react-native-typography';
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
      SpecCode,
      FBname,
      Genus,
      Species,
      PicPreferredName,
      Length,
      Weight,
      Comments 

    } = this.props.details;
    
    return (
      <Animated.View style={{ opacity: this.state.scaleValue }}>
        <View style={styles.row}>
	    <View>
	    <View style={styles.imageContainer}>
		    <TouchableHighlight 
		      onPress={() => this.props.navigation.navigate('ArticleWebView',
			      {uri: "https://www.fishbase.ca/summary/" + SpecCode})}
		      underlayColor={'#fffad8'} >           
		      <Image
            source={(PicPreferredName != null)
              ? {uri: "https://www.fishbase.ca/images/species/" + PicPreferredName}
              : require('../../img/place_holders/no-image-available.png')}
            resizeMode="stretch"
            style={styles.fishImage}
		      />
		    </TouchableHighlight>
	    </View>
            <Text style={styles.fishName} numberOfLines={1}> {FBname.toUpperCase()}</Text>
            <Text style={styles.fishScienceName} numberOfLines={2}> {Genus + " " + Species} </Text>
            <Text style={styles.fishBio} numberOfLines={2}> {"Weight: "+Weight/1000+" kg "+"  "+" Length: "+Length/100+" m"}</Text>
            <Text style={styles.petDescription} numberOfLines={20}> {Comments.replace(/\//g,"").replace(/<i>/g, "").replace(/ *\([^)]*\) */g, "") } </Text>
          </View>
        </View>
      </Animated.View>
    );
}
}
const styles = StyleSheet.create({
  row: {
    justifyContent: 'center',
    backgroundColor: '#8cdff2',
    flexDirection: 'row',
    borderStyle: 'solid',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    elevation: 2,
    paddingTop: 15,
    paddingBottom: 5,
    paddingLeft: 18,
    paddingRight: 16,
    marginLeft: 14,
    marginRight: 14,
    marginTop: 10,
    marginBottom: 6,

  },
 fishImage:{
    resizeMode: 'contain',
    height: 200,
    width: 300,
    borderRadius: 15,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
  },
  textContainer: {
    flex: 5,
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
    textAlign: 'center',
    flexDirection:'row',
    flex: 1,
    ...material.titleObject,
    ...systemWeights.semibold,
  },
  petBreed: {
    fontSize: 13,
  },
  fishBio: {
    textAlign: 'center',
    flexDirection:'row',
    marginTop: 5,
    paddingBottom: 10,
    flex:1,
    borderBottomColor: '#044554',
    borderBottomWidth: StyleSheet.hairlineWidth,
    ...material.captionObject,
    ...systemWeights.regular,
  },
  fishScienceName: {
    ...material.subheadingObject,
    ...systemWeights.light,
    textAlign: 'center',
    flexDirection:'row',
    marginTop: 5,
    flex:1,
  },
  petDescription: {
    flexDirection:'row',
    paddingTop: 10,
    marginTop: 5,
    flex:1,
    ...material.body2Object,
    ...systemWeights.regular,
  },
  petLocation: {
    fontSize: 12,
    color: 'gray',
  },
});
