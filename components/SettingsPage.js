import React from 'react';
import { View, Slider,TouchableOpacity} from 'react-native';
import { Text } from 'react-native-elements';


export default class SettingsPage extends React.Component {
    //static navigationOptions = ({ navigation }) => ({
    //  title: navigation.state.params.myTitle,
    //});

    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      settingsObject = this.props.navigation.getParam('settingsObject', {} )
      console.log(settingsObject);
      this.state = {
        settings: settingsObject
      }
      
    }

    handleChange() {
      f = this.props.navigation.getParam("onSettingsChange", {});
      console.log("handling")
      f(this.state.settings);
      //this.props.onSettingsChange(this.state.settings);
    }
/*
    componentDidMount() {
      console.log(settingsObject);
      settingsObject = this.props.navigation.getParam('settingsObject', {} )
      console.log(settingsObject);
      this.setState(
        {settings: settingsObject}
      );
    }
*/
    

    render() {
        //const {} = this.state.settings.maxSearchResults; 
        return(
            <View style={styles.container}>
                <Text style={styles.text1}>{"Max Number of Search Results"}</Text>
                <Text style={styles.text2}>{String(this.state.settings.maxSearchResults)}</Text>
                <View style={{marginLeft: 20, marginRight: 20}}>
                  <Slider
                      step={1}
                      minimumValue={1}
                      maximumValue={50}
                      onValueChange={value => { 
                        this.setState({  
                          settings:{
                            searchUserArea: this.state.settings.searchUserArea,
                            setCustomRadius: this.state.settings.setCustomRadius,
                            customSearchRadius: this.state.settings.customSearchRadius,
                            maxSearchResults: value
                          }
                        })
                      
                      }}
                      value={this.state.settings.maxSearchResults}
                      />
                </View>
                <Text style={styles.text1}>{"Search Radius (km)"}</Text>
                <Text style={styles.text2}>{String(this.state.settings.customSearchRadius)}</Text>
                <View style={{marginLeft: 20, marginRight: 20}}>
                  <Slider
                      step={1}
                      minimumValue={1}
                      maximumValue={100}
                      onValueChange={value => { 
                        this.setState({  
                          settings:{
                            searchUserArea: this.state.settings.searchUserArea,
                            setCustomRadius: this.state.settings.setCustomRadius,
                            customSearchRadius: value,
                            maxSearchResults: this.state.settings.maxSearchResults
                          }
                        })
                      }}
                      value={this.state.settings.maxSearchResults}
                      />
                </View>
                <TouchableOpacity onPress={() => {
                  console.log(this.state.settings);
                  this.handleChange();
                  }}>
                    <Text>Change Settings</Text>                   
                </TouchableOpacity>

            </View>
        );
      
    }
}

const styles = {
    container: {
        flex: 1,
        flexDirection: 'column',
     
    },
    text1: {
        fontSize: 20,
        marginLeft: 20,
        textAlign: 'left',
        fontWeight: "bold",
    },
    text2: {
        fontSize: 20,
        marginLeft: 20,
        textAlign: 'left',
    },
};
