import React, {useEffect, useState} from 'react';
import { Text, View, FlatList, TextInput, Button } from 'react-native';
import axios from 'axios';
import styles from './styles';


//we are going to make a variable that points to the backend api url
const API_URL = 'https://twitterclonebackend-production.up.railway.app'


export default function App() {

  //state variables for setting the tweets themselves and the tweets contents
  //this state variable will be mainly used to grab the tweets from the backend
  const [tweets, setTweets] = useState([]);
  //this state variable will be used to set the tweet contents
  const [content, setContent] = useState('');

  //Before the return statement, we will make a couple of functions that will fetch or post data to the backend.
  //You could separate this out in a different file, but for simplicity, we will keep it here.

  //fetch all tweets in DB
  const fetchTweets = async () =>{
    //axios call the DB
    //axios uses the HTTP Methods GET, POST, PUT, DELETE
    //To use the GET method, we will use the axios.get() method
    const res = await axios.get(`${API_URL}/tweets`)
    setTweets(res.data);
  }

  //post a tweet to the DB
  const postTweet = async() =>{
    if(content.length === 0){
      alert('Please enter a tweet')
      return
    }
    await axios.post(`${API_URL}/tweets`, {
      //we have to tell the post request what data we are sending
      user: 'User1',
      content})

      //set the textbox to empty again and refetch the tweets
      setContent('');
      fetchTweets();
  }

  //fetch tweets will be called when we post a new tweet, but we also have to fetch our tweets when the app loads to grab all of them at the beginning

  //use useeffect to fetch tweets when the app loads
  useEffect(() => {
    fetchTweets();
  }, [])




  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder='Whats happening?'
          value={content}
          onChangeText={setContent}
        
        />
        <Button title='Tweet' onPress={postTweet} />
      </View>

      <FlatList
        data = {tweets}
        keyExtractor={(item) => item._id}
        renderItem={({item}) => (
          <View style={styles.tweet}>
            <Text style={styles.user}>{item.user}</Text>
            <Text>{item.content}</Text>
            
            <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
    
          </View>

        )}
       
      
      />
 
    </View>
  );
}


