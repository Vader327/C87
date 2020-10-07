import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, TextInput } from 'react-native';
import { AppDrawerNavigator } from '../Components/AppDrawerNavigator';
import MyHeader from '../Components/MyHeader';
import db from '../config';
import firebase from 'firebase';

export default class SettingScreen extends React.Component{
  constructor(){
    super();
    this.state={
      emailId : '',
			firstName: '',
			lastName: '',
			contact: 0,
			address: '',
			docId: '',
    }
  }

  getUserDetails=()=>{
    var email = firebase.auth().currentUser.email;
    db.collection('users').where('email_id', '==', email).get()
    .then(snapshot=>{
      snapshot.forEach(doc=>{
        var data = doc.data();
        this.setState({
          emailId: data.email_id,
          firstName: data.first_name,
          lastName: data.last_name,
          address: data.address,
          contact: data.contact,
          docId: doc.id,
        })
      })
    })
  }

  updateUserDetails=()=>{
    db.collection('users').doc(this.state.docId).update({
      "first_name": this.state.firstName,
      "last_name": this.state.lastName,
      "contact": this.state.contact,
      "address": this.state.address,
    })

    Alert.alert("Profile Updated Successfully!")
  }

  componentDidMount(){
    this.getUserDetails();
  }

  render(){
    return(
      <View style={{height: '100%'}}>
        <MyHeader title="Settings" />

        <KeyboardAvoidingView behavior="padding" enabled style={{height: '100%'}}>
          <ScrollView style={{height: '100%'}}>
            <Text style={styles.title}>Update Profile</Text>

            <TextInput style={styles.input} placeholder="First Name"
            onChangeText={(text)=>{this.setState({firstName: text})}}  value={this.state.firstName} />
            
            <TextInput style={styles.input} placeholder="Last Name"
            onChangeText={(text)=>{this.setState({lastName: text})}} value={this.state.lastName} />

            <TextInput style={styles.input} placeholder="Contact" keyboardType="number-pad" maxLength={10}
            onChangeText={(text)=>{this.setState({contact: text})}} value={this.state.contact} />

            <TextInput style={styles.input} placeholder="Address" multiline={true}
            onChangeText={(text)=>{this.setState({address: text})}} value={this.state.address} />

          <TouchableOpacity style={styles.updateButton}
          onPress={this.updateUserDetails}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    )
  }  
}

const styles = StyleSheet.create({
  input:{
		borderBottomColor: '#ff3d00',
		borderBottomWidth: 3,
		marginTop: 30,
		width: '80%',
		alignSelf: 'center',
	},
	updateButton:{
    marginTop: 50,
		alignSelf: 'center',
		backgroundColor: '#ff9800',
		width: 150,
		height: 40,
		borderRadius: 50,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: "#000",
    shadowOffset: {width: 0, height: 8,},
    shadowOpacity: 0.30,
    shadowRadius: 10.32,
    elevation: 16,
	},
	buttonText:{
		color: '#ffffff',
		fontSize: 17,
		fontWeight: '600',
		alignSelf: 'center',
  },
  title:{
    alignSelf: 'center',
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
  }
})