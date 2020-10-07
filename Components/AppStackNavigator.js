import { createStackNavigator } from 'react-navigation-stack';
import BookDonateScreen from '../Screens/BookDonateScreen';
import RecieverDetailScreen from '../Screens/RecieverDetailsScreen';

export const AppStackNavigator = createStackNavigator({
    BookDonateList: {
      screen: BookDonateScreen,
      navigationOptions: {
        headerShown: false,
      }
    },
    RecieverDetails: {
      screen: RecieverDetailScreen,
      navigationOptions: {
        headerShown: false,
      }
    }
  },
  {
    initialRouteName: 'BookDonateList'
  },
)