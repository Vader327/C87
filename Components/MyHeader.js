import React, { Component } from 'react';
import { Header, Icon, Badge } from 'react-native-elements';
import db from '../config';
import { View } from 'react-native';

export default class MyHeader extends Component{
  constructor(props){
    super(props);
    this.state={
      value: ""
    }
  }

  getNumberOfUnreadNotifications(){
    db.collection('all_notifications').where('notification_status', '==', 'unread')
    .onSnapshot((snapshot)=>{
      var unreadNotifications = snapshot.docs.map((doc)=>doc.data());
      this.setState({value: unreadNotifications.length})
    })
  }

  componentDidMount(){
    this.getNumberOfUnreadNotifications();
  }

  BellIconWithBadge=()=>{
    return(
      <View>
        <Icon name='bell' type='feather' color='#ffffff' size={25}
          onPress={()=>this.props.navigation.navigate('Notifications')}/>
        <Badge value={this.state.value} containerStyle={{position: 'absolute', top: -4, right: -4}} />
      </View>
    )
  }


  render(){
    return(
      <Header backgroundColor="#f8be85"
      leftComponent={<Icon name='menu' type='feather' color='#ffffff' onPress={()=>this.props.navigation.toggleDrawer()}/>}
      centerComponent={{text: this.props.title, style:{color: "#ffffff", fontSize: 20, fontWeight: 'bold'}}}
      rightComponent={<this.BellIconWithBadge {...this.props} />} />
    )
  }
}