import React from 'react';
import { FlatList, StyleSheet, View, Text, Alert } from 'react-native';

// We'll get to this one later
import { WebView } from "react-native-webview";

export default class ArticleWebView extends React.Component {
    constructor(props) {
	super(props);
    }

    componentDidMount() {
	console.log(this.props);
    }

    render() {
	return (
		<WebView
            source={{ uri: this.props.navigation.getParam('uri', 'https://www.google.com')}}	//note: 2nd param is default value
            style={{ marginTop: 20 }}
            onLoadProgress={e => console.log(e.nativeEvent.progress)}
		/>
	);
    }
}

const styles = StyleSheet.create({
    container: {
	flex: 1,
	justifyContent: 'center',
	alignItems: 'center',
	backgroundColor: '#F5FCFF',
    },
    welcome: {
	fontSize: 20,
	textAlign: 'center',
	margin: 10,
    },
    instructions: {
	textAlign: 'center',
	color: '#333333',
	marginBottom: 5,
    },
    dropdown: {
	marginHorizontal: 20,
    },
});
