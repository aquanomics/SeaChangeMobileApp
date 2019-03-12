import React from 'react';
import { withNavigation } from 'react-navigation';
import { Card, Divider } from 'react-native-elements';
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
    const { noteStyle, featuredTitleStyle } = styles;
    const defaultImg =
      'https://www.serebii.net/magikarpjump/events/3.jpg';
  
    return (
        <TouchableHighlight 
        onPress={() => this.props.navigation.navigate('FishDetails',{code:id})}
        underlayColor={'#fffad8'}
        > 
        <Card
          featuredTitle={name}
          featuredTitleStyle={featuredTitleStyle}
          image={{
            uri: defaultImg
          }}
        >
            <Text style={{ marginBottom: 20 }}> {description} </Text>
            <Divider style={{ backgroundColor: '#dfe6e9' }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ marginBottom: 15 }}> {"Time:\n"+startDate.substring(0, 10) + "   -   " + endDate.substring(0, 10)} </Text>
            </View>
            <Divider style={{ backgroundColor: '#dfe6e9' }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ marginBottom: 10 }}> {"Location:\n"+ location +"," + city} </Text>
            </View>
        </Card>
        </TouchableHighlight>
    );
}
}

const styles = {
  noteStyle: {
    margin: 5,
    fontStyle: 'italic',
    color: '#b2bec3',
    fontSize: 10
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10
  },
  featuredTitleStyle: {
    marginHorizontal: 5,
    textShadowColor: '#00000f',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 3
  }
};
export default withNavigation(EventsPreview);