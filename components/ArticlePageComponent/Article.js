import React from 'react';
import { View, Linking, TouchableNativeFeedback, TouchableHighlight } from 'react-native';
import { Text, Button, Card, Divider } from 'react-native-elements';
import moment from 'moment';

export default class Article extends React.Component {
    constructor(props) {
	super(props);
    }

    componentDidMount() {
	console.log("inside Article.js. Below is the this.props");
	console.log(this.props);
    }

  render() {
    const {
      title,
      description,
      published_at,
      source_name,
      urlToImage,
	url,
    } = this.props.article;
      const latitude = this.props.article.lat;
      const longitude = this.props.article["long"];
    const { noteStyle, featuredTitleStyle } = styles;
    const time = moment(published_at || moment.now()).fromNow();
    const MAXLENGTH = 150;
    const defaultImg =
      'https://wallpaper.wiki/wp-content/uploads/2017/04/wallpaper.wiki-Images-HD-Diamond-Pattern-PIC-WPB009691.jpg';

    return (
      <TouchableHighlight
        //onPress={() => Linking.openURL(url)}		//If you want to open in chrome
	//Below is if you want to open up a new WebView to the actual article
        //onPress={() => this.props.navigation.navigate('ArticleWebView', {uri: url})}	//opening another component using <WebView />
        onPress={() => this.props.navigation.navigate('ArticleAbstraction', {articleObject: this.props.article})}	//opens up abstraction page	
	underlayColor={'#fffad8'}
      >
        <Card
          featuredTitle={title}
          featuredTitleStyle={featuredTitleStyle}
          image={{
            uri: urlToImage || defaultImg
          }}
        >
          <Text style={{ marginBottom: 10 }}>
			{description.substring(0, MAXLENGTH)+" ..." || 'Read More..'}
          </Text>
          <Divider style={{ backgroundColor: '#dfe6e9' }} />
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={noteStyle}>{source_name.toUpperCase()}</Text>
            <Text style={noteStyle}>{time}</Text>
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
