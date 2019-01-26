import React from 'react';
import { View, Linking, TouchableNativeFeedback, TouchableHighlight } from 'react-native';
import { Text, Button, Card, Divider } from 'react-native-elements';
import moment from 'moment';

export default class Event extends React.Component {
  render() {
    const {
      name,
      description,
      location,
      startDate,
      endDate,
      lat,
      lng
	} = this.props.Event;
    const { noteStyle, featuredTitleStyle } = styles;
    const defaultImg =
      'https://wallpaper.wiki/wp-content/uploads/2017/04/wallpaper.wiki-Images-HD-Diamond-Pattern-PIC-WPB009691.jpg';
	
    return (
	<TouchableHighlight>
        <Card
          featuredTitle={name}
          featuredTitleStyle={featuredTitleStyle}
          image={{
            uri: urlToImage || defaultImg
          }}
        >
          <Text style={{ marginBottom: 10 }}>
            {description || 'Read More..'}
          </Text>
          <Divider style={{ backgroundColor: '#dfe6e9' }} />
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={noteStyle}>{startDate}</Text>
            <Text style={noteStyle}>{location}</Text>
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

