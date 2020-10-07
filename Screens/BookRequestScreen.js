import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Modal, ScrollView, KeyboardAvoidingView } from 'react-native';
import MyHeader from '../Components/MyHeader';
import firebase from 'firebase';
import db from '../config';

export default class BookRequestScreen extends React.Component{
  constructor(){
    super();
    this.state={
      userID: firebase.auth().currentUser.email,
      bookName: "",
      reasonToRequest: "",
    }
  }

  createUniqeId(){
    return Math.random().toString(36).substring(7)
  }

  addRequest=(bookName, reasonToRequest)=>{
    var userID = this.state.userID;
    var randomRequestId = this.createUniqeId();

    db.collection('requested_books').add({
      "user_id": userID,
      'book_name': bookName,
      'reason_to_request': reasonToRequest,
      'request_id': randomRequestId,
    })

    this.setState({bookName: "", reasonToRequest: ""})

    return Alert.alert("Book Requested Successfully!")
  }

  render(){
    return(
      <View style={{height: "100%"}}>
        <MyHeader title="Request Book" />

        <KeyboardAvoidingView style={{height: '100%'}} enabled behavior="padding">
          <TextInput style={styles.formatTextInput} placeholder="Enter Book Name"
          onChangeText={(text)=>{this.setState({bookName: text})}} value={this.state.bookName} />

          <TextInput style={styles.formatTextInput}
          placeholder="Why do you need the book?" multiline numberOfLines={8}
          onChangeText={(text)=>{this.setState({reasonToRequest: text})}} value={this.state.reasonToRequest} />

          <TouchableOpacity style={styles.button}
          onPress={()=>{this.addRequest(this.state.bookName, this.state.reasonToRequest)}}>
            <Text style={{color: '#ffffff', fontWeight: '600', fontSize: 20,}}>Request</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  formatTextInput:{
    borderBottomColor: '#ff3d00',
		borderBottomWidth: 3,
		marginTop: 30,
		width: '80%',
		alignSelf: 'center',
  },
  button:{
    position: 'absolute',
		bottom: 80,
		alignSelf: 'center',
		backgroundColor: '#ff9800',
		width: 150,
		height: 40,
		borderRadius: 50,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: "#000",
    shadowOffset: {
			width: 0,
			height: 8,
    },
    shadowOpacity: 0.30,
    shadowRadius: 10.32,
    elevation: 16,
  }
})