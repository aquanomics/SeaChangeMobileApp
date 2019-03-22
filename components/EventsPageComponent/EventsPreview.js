import React from 'react';
import moment from 'moment';
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
      lng,
      urlToImage
    } = this.props.eventspreview;
    const { noteStyle, featuredTitleStyle } = styles;
  
    return (
      <TouchableHighlight
        onPress={() => this.props.navigation.navigate('EventsAbstraction', {eventsObject: this.props.eventspreview})} //opens up abstraction page 
        underlayColor={'#fffad8'}
      >
        <Card
          featuredTitle={name}
          featuredTitleStyle={featuredTitleStyle}
          image={(urlToImage != null)
              ? {uri: urlToImage}                      
              : require('../../img/place_holders/no-image-event.png')}
        >
            <Text style={styles.heading}> {description} </Text>
            <Divider style={{ backgroundColor: '#dfe6e9' }} />
            <Text style={styles.heading}> {"Time:"}</Text>
            <Text style={styles.content}> {"   " + moment(startDate).format('LLLL')}</Text>
            <Text style={styles.heading}> {"To:"}</Text>
            <Text style={styles.content}> {"   " + moment(endDate).format('LLLL')}</Text>                    
            <Divider style={{ backgroundColor: '#dfe6e9' }} />
            <Text style={styles.heading}> {"Location:"}</Text>
            <Text style={styles.content}>{"   " + location + "," + city}</Text>  
        </Card>
        </TouchableHighlight>
    );
}
}

const styles = {
  heading: {
    marginBottom: 10,
    marginTop: 5,
    fontWeight: "bold",
  },
  content:{
    marginBottom: 10
  },

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