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
          <TouchableHighlight 
          onPress={() => this.props.navigation.navigate('ArticleWebView', {uri: "https://www.fishbase.ca/summary/" + SpecCode})}
          underlayColor={'#fffad8'}
          >           
          <Image
            style={styles.imageContainer}
            source={(PicPreferredName != null)
              ? {uri: "https://www.fishbase.ca/images/species/" + PicPreferredName}                      
              : require('../../img/place_holders/no-image-available.png')}
            resizeMode="stretch"
          />
          </TouchableHighlight>
            <Text style={styles.fishName} numberOfLines={1}> {FBname} </Text>
            <Text style={styles.fishScienceName} numberOfLines={2}> {Genus + " " + Species} </Text>
            <Text style={styles.fishBio} numberOfLines={2}> {"Weight:"+Weight/1000+"kg"+"||"+"Length:"+Length/100+"m"}</Text>
            <Text style={styles.petDescription} numberOfLines={20}> {Comments} </Text>
          </View>
        </View>
      </Animated.View>
    );
}
}
const styles = StyleSheet.create({
  row: {
    justifyContent: 'center',
    backgroundColor: '#f9f5ed',
    flexDirection: 'row',
    borderStyle: 'solid',
    borderBottomColor: '#dddddd',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderRadius: 15,
    elevation: 2,
    paddingTop: 15,
    paddingBottom: 5,
    paddingLeft: 18,
    paddingRight: 16,
    marginLeft: 14,
    marginRight: 14,
    marginTop: 0,
    marginBottom: 6,

  },
  imageContainer: {
    width: 290,
    height: 225,
    //justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
    borderWidth: 1,
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
    fontSize: 18,
    fontWeight: '500',
  },
  petBreed: {
    fontSize: 13,
  },
  fishBio: {
    textAlign: 'center',
    flexDirection:'row',
    fontSize: 16,
    marginTop: 5,
    flex:1,
    fontWeight: '300',
  },
  fishScienceName: {
    textAlign: 'center',
    flexDirection:'row',
    fontSize: 16,
    marginTop: 5,
    flex:1,
    fontWeight: '500',
  },
  petDescription: {
    textAlign: 'center',
    flexDirection:'row',
    fontSize: 12,
    marginTop: 5,
    flex:1,
  },
  petLocation: {
    fontSize: 12,
    color: 'gray',
  },
});