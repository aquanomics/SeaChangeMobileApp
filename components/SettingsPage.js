import React from 'react';
import { View, Slider, Switch} from 'react-native';
import { Text } from 'react-native-elements';
import { RoundButton } from 'react-native-button-component';
import { material, materialColors, systemWeights } from 'react-native-typography';

export default class SettingsPage extends React.Component {
    static navigationOptions = ({ navigation }) => ({
      title: navigation.state.params.myTitle,
    });
    
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      settingsObject = this.props.navigation.getParam('settingsObject', {} )
      console.log(settingsObject);
      
      this.state = {
        settings: settingsObject,
        text: (settingsObject.setCustomRadius ? "#222222":"#6d6d6d"),
        text2: (settingsObject.searchUserArea ? "#222222":"#6d6d6d")
        
      }     
    }

    handleChange() {
      f = this.props.navigation.getParam("onSettingsChange", {});
      console.log("handling")
      f(this.state.settings);
      this.props.navigation.goBack();
    }

    render() {
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
                <View style={styles.switchrow}>
                  <Switch
                    style={{marginLeft: 20}}
                    onValueChange = {value => { 
                      this.setState({  
                        settings:{
                          searchUserArea: this.state.settings.searchUserArea,
                          setCustomRadius: value,
                          customSearchRadius: this.state.settings.customSearchRadius,
                          maxSearchResults: this.state.settings.maxSearchResults
                        },
                        text: ((value) ? "#222222" : "#6d6d6d")
                      })
                    }}
                    value = {this.state.settings.setCustomRadius}/>
                  <Text style={[styles.text1,{color:this.state.text}]}>Custom Radius</Text>
                </View>
                <Text style={[styles.text1,{color:this.state.text}]}>{"Search Radius (km)"}</Text>
                <Text style={[styles.text2,{color:this.state.text}]}>{String(this.state.settings.customSearchRadius)}</Text>
                <View style={{marginLeft: 20, marginRight: 20}}>
                  <Slider
                      step={1}
                      disabled={!this.state.settings.setCustomRadius}
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
                      value={this.state.settings.customSearchRadius}
                      />
                </View>
                <View style={styles.switchrow}>
                  <Switch
                    style={{marginLeft: 20, marginBottom : 20}}
                    onValueChange = {value => { 
                      this.setState({  
                        settings:{
                          searchUserArea: value,
                          setCustomRadius: this.state.settings.setCustomRadius,
                          customSearchRadius: this.state.settings.customSearchRadius,
                          maxSearchResults: this.state.settings.maxSearchResults
                        },
                        text2: ((value) ? "#222222" : "#6d6d6d")

                      })
                    }}
                    value = {this.state.settings.searchUserArea}/>
                  <Text style={[styles.text1,{color:this.state.text2}]}>Search User Area</Text>
                </View>
                <RoundButton 
                    style = {styles.button}
                    type="primary"
                    text="Modify Settings"
                    textStyle= {styles.buttonTextFont}
                    backgroundColors={['#2193b0', '#6dd5ed']}
                    gradientStart={{ x: 0.5, y: 1 }}
                    gradientEnd={{ x: 1, y: 1 }}
                    onPress={() => {
                      console.log(this.state.settings);
                      this.handleChange();
                    }} />    
            </View>
        );
      
    }
}

const styles = {
    container: {
      flex: 1,
      flexDirection: 'column',
    },
    switchrow: {
      flexDirection: 'row',
    },
    button: {
      alignSelf:'center',
      height: 50,
      width: 300,
      
    },
    //button: {
    //  justifyContent: 'center', 
    //  alignItems: 'center'
    //},
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
    buttonTextFont: {
      ...material.button,
      ...systemWeights.light,
      color: materialColors.whitePrimary,
      fontSize: 17,
      textAlign: 'center',
  }
};
