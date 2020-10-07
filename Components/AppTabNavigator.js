import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import BookRequestScreen from '../Screens/BookRequestScreen';
import { AppStackNavigator } from './AppStackNavigator'

export const AppTabNavigator = createBottomTabNavigator({
  DonateBooks: {screen: AppStackNavigator, 
                navigationOptions: {
                  tabBarIcon: <Image style={{width: 20, height: 20}} source={require("../assets/book.png")} />,
                  tabBarLabel: "Donate Books",
                }},

  BookRequest: {screen: BookRequestScreen, 
                  navigationOptions: {
                    tabBarIcon: <Image style={{width: 20, height: 20}} source={require("../assets/searchingbook.png")} />,
                    tabBarLabel: "Book Request",
                  }},
})