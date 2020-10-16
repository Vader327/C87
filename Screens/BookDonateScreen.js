import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MyHeader from '../Components/MyHeader';
import db from '../config';
import { ListItem } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';

export default class BookDonateScreen extends React.Component{
  constructor(){
    super();
    this.state={
      requestedBooksList: []
    }

    this.requestRef = null;
  }

  getRequestedBooksList=()=>{
    this.requestRef = db.collection("requested_books")
    .onSnapshot((snapshot)=>{
      var requestedBooksList = snapshot.docs.map(document=>document.data())
      this.setState({requestedBooksList: requestedBooksList})
    })
  }

  componentDidMount(){
    this.getRequestedBooksList();
  }

  componentWillMount(){
    this.requestRef;
  }

  keyExtractor=(item, index)=>index.toString()

  renderItem=({item, i})=>{
    return(
      <ListItem
      key={i}
      title={item.book_name}
      subtitle={item.reason_to_request}
      titleStyle={{color: 'black', fontWeight: 'bold'}}
      rightElement={
      <TouchableOpacity style={styles.button}
      onPress ={()=>{this.props.navigation.navigate("RecieverDetails", {"details": item})}}>
        <Text style={{color: '#ffffff', fontWeight: '600', fontSize: 16}}>View</Text>
      </TouchableOpacity>}
      bottomDivider />
    )
  }
  
  render(){
    return(
      <View style={{height: "100%", flex: 1}}>
        <MyHeader title="Donate Books" navigation={this.props.navigation} />

        <View style={{flex: 1}}>
          {this.state.requestedBooksList.length===0
          ? (<View>
            <Text style={{fontSize: 20}}>List of All Requested Books</Text>
          </View>)
          : (<FlatList keyExtractor={this.keyExtractor}
              data={this.state.requestedBooksList} 
              renderItem={this.renderItem} />)}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  button:{
    backgroundColor: '#f8be85',
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    borderRadius: 7,
  }
})

