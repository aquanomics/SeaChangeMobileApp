/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet} from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import UserMap from "./components/UserMap";
import ArticlesPage from "./components/ArticlesPage";
import ProfilePage from "./components/ProfilePage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import EventsPage from "./components/EventsPage";
import PostPage from "./components/PostPage";
import ImagePost from "./components/PostPageComponent/ImagePost";
import ArticlePost from "./components/PostPageComponent/ArticlePost";
import SignupPage from "./components/SignupPage";
import ArticleWebViewPage from "./components/ArticlePageComponent/ArticleWebView";
import ArticleAbstractionPage from "./components/ArticlePageComponent/ArticleAbstraction";
import FishPage from "./components/FishPage";
import FishDetailPage from "./components/FishDetailPage";

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
    Fishes: {
        screen: FishPage
    },
    Signup: {
        screen: SignupPage
    },
    ForgotPassword: {
        screen: ForgotPasswordPage
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
    FishDetails: {
        screen: FishDetailPage,
    },
    Posts: {
        screen: PostPage,
    },
    ImagePost: {
        screen: ImagePost,
    },
    ArticlePost: {
        screen: ArticlePost,
    },
    Profile: {
        screen: ProfilePage,
    },
    ArticleWebView: {
        screen: ArticleWebViewPage,
    },
    ArticleAbstraction: {
        screen: ArticleAbstractionPage,
    },
}, {
    initialRouteName: 'Home',
});
  
  export default createAppContainer(MainNavigator);
