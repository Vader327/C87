import { createDrawerNavigator } from 'react-navigation-drawer';
import { AppTabNavigator } from './AppTabNavigator';
import CustomSideBarMenu from './CustomSideBarMenu';
import SettingScreen from '../Screens/SettingScreen';
import MyDonationScreen from '../Screens/MyDonationScreen';
import NotificationScreen from '../Screens/NotificationScreen';
import MyReceivedBooksScreen from '../Screens/MyReceivedBooksScreen';

export const AppDrawerNavigator = createDrawerNavigator({
  Home: {screen: AppTabNavigator},
  "My Donations": {screen: MyDonationScreen},
  Notifications: {screen: NotificationScreen},
  MyReceivedBooks :{screen: MyReceivedBooksScreen},
  Settings: {screen: SettingScreen},
},
{
  contentComponent: CustomSideBarMenu,
}, {
  initialRouteName: 'Home'
})