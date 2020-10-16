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
      requestId: '',
      IsBookRequestActive: "",
      requestedBookName: "",
      bookStatus: "",
      userDocId: '',
      docId: '',
    }
  }

  createUniqeId(){
    return Math.random().toString(36).substring(7)
  }

  addRequest=async(bookName, reasonToRequest)=>{
    var userID = this.state.userID;
    var randomRequestId = this.createUniqeId();

    db.collection('requested_books').add({
      "user_id": userID,
      'book_name': bookName,
      'reason_to_request': reasonToRequest,
      'request_id': randomRequestId,
      'book_status': 'requested',
      'date': firebase.firestore.FieldValue.serverTimestamp()
    })

    await this.getBookRequest();

    db.collection('users').where('email_id', '==', userID).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        db.collection('users').doc(doc.id).update({
          IsBookRequestActive: true,
        })
      })
    })

    this.setState({bookName: '', reasonToRequest: '', requestId: randomRequestId})

    return Alert.alert("Book Requested Successfully!")
  }

  receivedBooks=(bookName)=>{
    db.collection('received_books').add({
      'user_id': this.state.userID,
      'book_name': bookName,
      'request_id': this.state.requestId,
      'book_status': 'received',
    })
  }

  getIsBookRequestActive(){
    db.collection('users').where('email_id', '==', this.state.userID).onSnapshot(snapshot=>{
      snapshot.forEach(doc=>{
        this.setState({
          IsBookRequestActive: doc.data().IsBookRequestActive,
          userDocId: doc.id,
        })
      })
    })
  }

  getBookRequest=()=>{
    db.collection('requested_books').where('user_id', '==', this.state.userID).get()
    .then(snapshot=>{
      snapshot.forEach(doc=>{
        if(doc.data().book_status !== 'received'){
          this.setState({
            requestId: doc.data().request_id,
            requestedBookName: doc.data().book_name,
            bookStatus: doc.data().book_status,
            docId: doc.id,
          })
        }
      })
    })
  }

  sendNotification=()=>{
    db.collection('users').where('email_id', '==', this.state.userID).get().then(snapshot=>{
      snapshot.forEach(doc=>{
        var name = doc.data().first_name;
        var lastName = doc.data().last_name;

        db.collection('all_notifications').where('request_id', '==', this.state.requestId).get().then(snapshot=>{
          snapshot.forEach(doc=>{
            var donorId = doc.data().donor_id;
            var bookName = doc.data().book_name;

            db.collection('all_notifications').add({
              'targeted_user_id': donorId,
              'message': name + " " + lastName + " received the book " + bookName,
              'notification_status': 'unread',
              'book_name': bookName,
            })
          })
        })
      })
    })
  }

  componentDidMount(){
    this.getBookRequest();
    this.getIsBookRequestActive();
  }

  updateBookRequestStatus=()=>{
    console.log("hello" + this.state.docId + " 1")
    db.collection('requested_books').doc(this.state.docId).update({book_status: 'received'})
    db.collection("users").where("email_id", "==", this.state.userID).get().then((snapshot)=>{
      snapshot.forEach((doc)=>{
        db.collection("users").doc(doc.id).update({
          IsBookRequestActive: false,
        });
      });
    });
  }

  render(){
    if(this.state.IsBookRequestActive){
      return(
        <View style={{flex: 1, justifyContent: 'center'}}>
          <View style={styles.container}>
            <Text>Book Name</Text>
            <Text>{this.state.requestedBookName}</Text>
          </View>
          <View style={styles.container}>
            <Text>Book Status</Text>
            <Text>{this.state.bookStatus}</Text>
          </View>

          <TouchableOpacity style={styles.receivedButton}
          onPress={()=>{
            this.sendNotification()
            this.updateBookRequestStatus();
            this.receivedBooks(this.state.requestedBookName)
          }}>
            <Text>I have received the book</Text>
          </TouchableOpacity>
        </View>
      )
    }
    else{
      return(
        <View style={{height: "100%"}}>
          <MyHeader title="Request Book" navigation={this.props.navigation} />

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
  },
  container:{
    borderColor: "orange",
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    margin: 10
  },
  receivedButton:{
    borderWidth: 1,
    borderColor: 'orange',
    backgroundColor: "orange",
    width: 300,
    alignSelf: 'center',
    alignItems: 'center',
    height: 30,
    marginTop: 30
  }
})