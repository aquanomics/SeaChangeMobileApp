/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { createStackNavigator, StackActions, NavigationActions,createAppContainer } from 'react-navigation';

import UserMap from "./components/UserMap";
import ArticlesPage from "./components/ArticlesPage";
import SettingsPage from "./components/SettingsPage";
import EventsPage from "./components/EventsPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import ArticleWebViewPage from "./components/ArticlePageComponent/ArticleWebView";
import ArticleAbstractionPage from "./components/ArticlePageComponent/ArticleAbstraction";
import ArticleSearchPage from "./components/ArticlePageComponent/ArticleSearch"

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  /*
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
  */
});

const MainNavigator = createStackNavigator({
    Login: {
	screen: LoginPage
    },
    Signup: {
	screen: SignupPage
    },
    Home: {
	screen: UserMap,
    },
    Articles: {
	screen: ArticlesPage,
    },
    Events: {
	screen: EventsPage,
    },
    Settings: {
	screen: SettingsPage,
    },
    ArticleWebView: {
	screen: ArticleWebViewPage,
    },
    ArticleAbstraction: {
	screen: ArticleAbstractionPage,
    },
    ArticleSearch: {
	screen: ArticleSearchPage, 
    },
}, {
    initialRouteName: 'Home',
});
  
  export default createAppContainer(MainNavigator);
