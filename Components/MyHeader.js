import React, { Component } from 'react';
import { Header, Icon } from 'react-native-elements';

const MyHeader = props=>{
  return(
    <Header centerComponent={{text: props.title, style:{color: "#ffffff", fontSize: 20, fontWeight: 'bold'}}}
    backgroundColor="#f8be85" />
  )
}

export default MyHeader;