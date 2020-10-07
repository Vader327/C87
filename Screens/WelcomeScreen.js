import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Modal, ScrollView, KeyboardAvoidingView } from 'react-native';
import BookSanta from '../Components/BookSantaAnimation.js';
import firebase from 'firebase';
import db from '../config';

export default class WelcomeScreen extends React.Component{
	constructor(){
		super();
		this.state={
			username: '',
			password: '',
			firstName: '',
			lastName: '',
			contact: 0,
			address: '',
			confirmPassword: '',
			isModalVisible: 'false',
		}
	}

	userSignup=(username, password, confirmPassword)=>{
		if(password !== confirmPassword){
			return Alert.alert("Passwords do not match!")
		}
		else{
			firebase.auth().createUserWithEmailAndPassword(username, password)
			.then(()=>{
				db.collection('users').add({
					first_name: this.state.firstName,
					last_name: this.state.lastName,
					address: this.state.address,
					contact: this.state.contact,
					email_id: this.state.username,
				})
				return Alert.alert("User added successfully!", '', [{
					text: 'Ok',
					onPress: ()=>{this.setState({"isModalVisible": false})}}])
			})
			.catch(function(error){
				var errorCode = error.code;
				var errorMessage = error.message;
				return Alert.alert(errorMessage);
			})
		}
	}

	userLogin=(username, password)=>{
		firebase.auth().signInWithEmailAndPassword(username, password)
		.then(()=>{
			this.props.navigation.navigate("DonateBooks")
		})
		.catch(function(error){
			var errorCode = error.code;
			var errorMessage = error.message;
			return Alert.alert(errorMessage);
		})
	}

	showModal=()=>{
		return(
			<Modal animationType="fade" transparent={true} visible={this.state.isModalVisible}>
				<View style={styles.modalContainer}>
					<ScrollView style={{width: '100%', marginTop: 40,}}>
						<KeyboardAvoidingView behavior="position" enabled style={{flexGrow: 1}}>
							<Text style={{fontWeight: '600', alignSelf: 'center', fontSize: 25, color:'#ff5722'}}>Registration</Text>

							<TextInput style={styles.input} placeholder="First Name"
							onChangeText={(text)=>{this.setState({firstName: text})}} />
							
							<TextInput style={styles.input} placeholder="Last Name"
							onChangeText={(text)=>{this.setState({lastName: text})}} />

							<TextInput style={styles.input} placeholder="Email ID" keyboardType="email-address"
							onChangeText={(text)=>{this.setState({username: text})}} />

							<TextInput style={styles.input} placeholder="Contact" keyboardType="number-pad" maxLength={10}
							onChangeText={(text)=>{this.setState({contact: text})}} />

							<TextInput style={styles.input} placeholder="Address" multiline={true}
							onChangeText={(text)=>{this.setState({address: text})}} />

							<TextInput style={styles.input} placeholder="Password" secureTextEntry={true}
							onChangeText={(text)=>{this.setState({password: text})}} />

							<TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry={true}
							onChangeText={(text)=>{this.setState({confirmPassword: text})}} />

							<View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 30, marginBottom: 30, justifyContent: 'space-evenly'}}>
							<TouchableOpacity style={styles.modalButton}
								onPress={()=>{this.setState({isModalVisible: false})}}>
									<Text style={styles.buttonText}>Cancel</Text>
								</TouchableOpacity>

								<TouchableOpacity style={styles.modalButton}
								onPress={()=>{this.userSignup(this.state.username, this.state.password, this.state.confirmPassword)}}>
									<Text style={styles.buttonText}>Register</Text>
								</TouchableOpacity>
							</View>
						</KeyboardAvoidingView>
					</ScrollView>	
				</View>
			</Modal>
		)
	}

  render(){
		return (
			<View style={{height: '100%', backgroundColor: '#f8be85'}}>
				<View style={{alignContent: 'center', justifyContent: 'center'}}>
					{this.showModal()}
				</View>

				<View style={{alignItems:'center',}}>
					<BookSanta />
					<Text style={{fontSize:30, fontWeight:'600', paddingBottom:30, color:'#ff3d00'}}>
						Book Santa</Text>
				</View>

				<View>
					<TextInput style={styles.input} placeholder="Email" placeholderTextColor = "#ffff"
					onChangeText={(text)=>{this.setState({username: text})}}
					keyboardType="email-address" />

					<TextInput style={styles.input} placeholder="Password" placeholderTextColor = "#ffff"
					onChangeText={(text)=>{this.setState({password: text})}}
					secureTextEntry={true} />
				</View>

				<TouchableOpacity style={styles.login}
				onPress={()=>{this.userLogin(this.state.username, this.state.password)}}>
					<Text style={styles.buttonText}>Login</Text>
				</TouchableOpacity>

				<TouchableOpacity style={[styles.login, {bottom: 20}]}
				onPress={()=>{this.setState({isModalVisible: true})}}>
					<Text style={styles.buttonText}>Sign Up</Text>
				</TouchableOpacity>
			</View>
		);
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
	login:{
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
	buttonText:{
		color: '#ffffff',
		fontSize: 17,
		fontWeight: '600',
		alignSelf: 'center',
	},
	modalButton:{
		width: 100,
		backgroundColor: '#ff9800',
		padding: 7,
		borderRadius: 50,
	},
	modalContainer:{
		top: '5%',
		width: '90%',
		alignSelf: 'center',
		borderRadius: 10,
		backgroundColor: '#ffffff',
		shadowColor: "#000",
    shadowOffset: {
			width: 0,
			height: 8,
    },
    shadowOpacity: 0.30,
    shadowRadius: 10,
    elevation: 16,
	}
});
