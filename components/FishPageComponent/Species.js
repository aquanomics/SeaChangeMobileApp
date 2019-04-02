import React from 'react';
import { withNavigation } from 'react-navigation';
import {
  Animated, StyleSheet, Text, View, Image, TouchableHighlight
} from 'react-native';
import { material, systemWeights } from 'react-native-typography';

class Species extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scaleValue: new Animated.Value(0)
    };
    this.render = this.render.bind(this);
  }

  // TODO: IN-PROGESS TO MAKE GOOD ANIMATION FOR EACH CARD RENDER
  componentDidMount() {
    Animated.timing(this.state.scaleValue, {
      toValue: 1,
      duration: 600,
      delay: this.props.index * 300
    }).start();
  }

  render() {
    const {
    	SpecCode,
    	FBname,
    	Genus,
    	Species,
    	PicPreferredName
    } = this.props.species;

    return (
      <TouchableHighlight
        onPress={() => this.props.navigation.navigate('FishDetails', { code: SpecCode })}
        underlayColor="#fffad8"
      >
        <Animated.View style={{ opacity: this.state.scaleValue }}>
          <View style={styles.row}>
            <Image
              style={styles.imageContainer}
              source={(PicPreferredName != null)
                ? { uri: `https://www.fishbase.ca/images/species/${PicPreferredName}` }
                : require('../../img/place_holders/no-image-available.png')}
            />
            <View style={styles.textContainer}>
              <Text style={styles.fishName} numberOfLines={2}>
                {' '}
                {FBname}
                {' '}
              </Text>
              <Text style={styles.petDescription} numberOfLines={2}>
                {' '}
                {`${Genus} ${Species}`}
                {' '}
              </Text>
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
    backgroundColor: '#ffffff',
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
    resizeMode: 'contain',
    width: 150,
    height: 100,
    paddingRight: 5,
    borderRadius: 15,
  },
  textContainer: {
    flex: 1,
    paddingLeft: 5,
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
    ...material.subheadingObject,
    ...systemWeights.semibold,
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
export default withNavigation(Species);
