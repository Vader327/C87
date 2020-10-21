import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { DrawerItems } from 'react-navigation-drawer';
import { Avatar, BottomSheet } from 'react-native-elements';
import firebase from 'firebase';
import * as ImagePicker from "expo-image-picker";
import * as Permissions from 'expo-permissions';
import db from "../config";

export default class CustomSideBarMenu extends React.Component{
  constructor(){
    super();
    this.state={
      userId: firebase.auth().currentUser.email,
      image: '#',
      name: "",
      docId: "",
      isModalVisible: false,
      hasCameraPermisson: false,
    }
  }

  getCameraPermission=async()=>{
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermisson: status === "granted"})
}

  selectPicture=async(type)=>{
    if(type=="gallery"){
      const {cancelled, uri} = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })
      if(!cancelled){this.uploadImage(uri, this.state.userId)}
      this.setState({isModalVisible: false})
    }
    else if(type=="camera"){
      this.getCameraPermission()
      if(this.state.hasCameraPermisson){
        const {cancelled, uri} = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        })
        if(!cancelled){this.uploadImage(uri, this.state.userId)}
        this.setState({isModalVisible: false})
      }
    }
  }

  uploadImage=async(uri, imageName)=>{
    var response = await fetch(uri);
    var blob = await response.blob();
    var ref = firebase.storage().ref().child('user_profiles/' + imageName)

    return ref.put(blob).then((response)=>{this.fetchImage(response)})
  }

  fetchImage=(imageName)=>{
    var ref = firebase.storage().ref().child('user_profiles/' + imageName)      
    ref.getDownloadURL()
    .then((url)=>{this.setState({image: url})})
    .catch((err)=>{this.setState({image: '#'})})
  }

  getUserProfile(){
    db.collection('users').where('email_id', '==', this.state.userId).onSnapshot((snapshot)=>{
      snapshot.forEach((doc)=>{
        this.setState({
          name: doc.data().first_name + " " + doc.data().last_name,
          docId: doc.id,
          image: doc.data().image,
        })
      })
    })
  }

  componentDidMount(){
    this.fetchImage(this.state.userId);
    this.getUserProfile();
  }

  render(){
    return(
      <View style={{flex: 1}}>
        <View style={{flex: 0.5, alignItems: 'center', backgroundColor: 'orange', justifyContent: 'center'}}>
          <Avatar rounded source={{uri: this.state.image}} size="large" showAccessory
          onPress={()=>{this.setState({isModalVisible: true})}} />
          <Text style={{fontWeight: "300", fontSize: 20, color: 'white', marginTop: 10,}}>
            {this.state.name}
          </Text>
          <BottomSheet isVisible={this.state.isModalVisible}>
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity style={styles.menuButton} onPress={()=>{this.selectPicture("camera")}}><Text style={styles.menuText}>Camera</Text></TouchableOpacity>
              <TouchableOpacity style={styles.menuButton} onPress={()=>{this.selectPicture("gallery")}}><Text style={styles.menuText}>Gallery</Text></TouchableOpacity>
              <TouchableOpacity style={styles.menuButton} onPress={()=>{this.setState({isModalVisible: false})}}><Text style={styles.menuText}>Cancel</Text></TouchableOpacity>
            </View>
          </BottomSheet>
        </View>
        <View style={styles.drawerItemsContainer}>
          <DrawerItems {...this.props} />
        </View>
        <View style={styles.logOutContainer}>
          <TouchableOpacity style={styles.logOutButton}
          onPress={()=>{
            this.props.navigation.navigate("WelcomeScreen");
            firebase.auth().signOut();
          }}>
            <Text style={styles.logOutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  drawerItemsContainer:{
    flex: 0.8,
  },
  logOutContainer:{
    flex: 0.2,
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  logOutText:{
    fontWeight: 'bold',
  },
  logOutButton:{
    width: '100%',
    justifyContent: 'center',
    padding: 10,
  },
  menuButton:{
    backgroundColor: 'white',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    width: '95%',
    borderRadius: 10,
  },
  menuText:{
    fontSize: 18,
    fontWeight: '500',
  }
})