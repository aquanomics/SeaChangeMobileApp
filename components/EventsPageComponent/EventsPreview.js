import React from 'react';
import { withNavigation } from 'react-navigation';
import { Animated, ListView, Platform, StyleSheet, Text, View, Linking, Image, TouchableHighlight} from 'react-native';
class EventsPreview extends React.Component {


  constructor(props) {
    super(props);
      this.state = {
        scaleValue: new Animated.Value(0)
      }
      this.render = this.render.bind(this);
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
      id,
      name,
      description,
      location,
      city,
      startDate,
      endDate,
      lat,
      lng
    } = this.props.eventspreview;
    const defaultImg =
      'https://wallpaper.wiki/wp-content/uploads/2017/04/wallpaper.wiki-Images-HD-Diamond-Pattern-PIC-WPB009691.jpg';
  
    return (
        <Card
          featuredTitle={name}
          featuredTitleStyle={featuredTitleStyle}
          image={{
            uri: urlToImage || defaultImg
          }}
        >
            <Text style={{ marginBottom: 15 }}> {description} </Text>
            <Divider style={{ backgroundColor: '#dfe6e9' }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ marginBottom: 10 }}> {startDate + "-" + endDate} </Text>
            <Text style={{ marginBottom: 5 }}> {location +"," + city} </Text>
            </View>

        </Card>
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
   featuredTitleStyle: {
    marginHorizontal: 5,
    textShadowColor: '#00000f',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 3
  },
});
export default withNavigation(EventsPreview);