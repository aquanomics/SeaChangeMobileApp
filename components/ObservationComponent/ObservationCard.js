import React from 'react';
import { View, TouchableHighlight } from 'react-native';
import { Text, Card, Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Entypo';

export default class ObservationCard extends React.Component {
  constructor(props) {
  	super(props);
  }

  render() {
    const { noteStyle, featuredTitleStyle } = styles;
    const MAXLENGTH = 150;

    //Note: Regarding the "comment" part, need to check for 'null' not null for some reason
    return (
      <TouchableHighlight
	      underlayColor={'#fffad8'}
        onPress={() => this.props.navigation.navigate('ObservationDetails', {postObject: this.props.item})}
      >
        <Card
          featuredTitle={this.props.item.name == 'default-name' ? '' : this.props.item.name}
          featuredTitleStyle={featuredTitleStyle}
          image={{ uri: this.props.item.urlToImage }}
        >
          <Text style={{ marginBottom: 10 }}>
            {this.props.item.comment == 'null' ? '' : this.props.item.comment.length <= MAXLENGTH ? this.props.item.comment : this.props.item.comment.substring(0, MAXLENGTH)+" ...Read More"}
          </Text>

          <Divider style={{ backgroundColor: '#dfe6e9' }} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

            <DisplayApproval approved={this.props.item.approved}/>

            <Text style={noteStyle}>{this.props.item.uploaded_at.split(' ')[0]}</Text>

          </View>
        </Card>
      </TouchableHighlight>
    );
  }
}

function DisplayApproval(props) {
  if(props.approved == 1) {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Icon
          name="controller-record"
          size={15}
          color='#32CD32'
        />
        <Text style={styles.noteStyle}>{'approved'}</Text>
      </View>
    );
  } else if(props.approved  == 0) {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Icon
          name="controller-record"
          size={15}
          color='#DC143C'
        />
        <Text style={styles.noteStyle}>{'awaiting approval'}</Text>
      </View>
    );
  } else {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Icon
          name="controller-record"
          size={15}
          color='#FFC30B'
        />
        <Text style={styles.noteStyle}>{'error'}</Text>
      </View>
    );
  }
}

export { DisplayApproval };

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
