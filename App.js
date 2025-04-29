import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, Text, TextInput, Button, View, StyleSheet, AsyncStorage, TouchableOpacity } from 'react-native';
import axios from 'axios';

const API_URL = 'https://twitterclonebackend-production.up.railway.app/'; // Your backend API URL

export default function App() {
  const [tweets, setTweets] = useState([]);
  const [content, setContent] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [selectedTweetId, setSelectedTweetId] = useState(null);

  const fetchTweets = async () => {
    const res = await axios.get(`${API_URL}/tweets`);
    setTweets(res.data);
  };

  const postTweet = async () => {
    if (!content.trim()) return;
    const token = await AsyncStorage.getItem('token');
    await axios.post(`${API_URL}/tweets`, { user: user.username, content }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setContent('');
    fetchTweets();
  };

  const signup = async () => {
    await axios.post(`${API_URL}/signup`, { username, password });
    login();
  };

  const login = async () => {
    const res = await axios.post(`${API_URL}/login`, { username, password });
    setUser({ username: res.data.username });
    await AsyncStorage.setItem('token', res.data.token);
    fetchTweets();
  };

  const postComment = async () => {
    if (!commentText.trim() || !selectedTweetId) return;
    const token = await AsyncStorage.getItem('token');
    await axios.post(`${API_URL}/tweets/${selectedTweetId}/comments`, 
      { user: user.username, text: commentText }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setCommentText('');
    setSelectedTweetId(null);
    fetchTweets();
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Login" onPress={login} />
        <Button title="Signup" onPress={signup} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="What's happening?"
          value={content}
          onChangeText={setContent}
        />
        <Button title="Tweet" onPress={postTweet} />
      </View>

      <FlatList
        data={tweets}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedTweetId(item._id)}>
            <View style={styles.tweet}>
              <Text style={styles.user}>{item.user}</Text>
              <Text>{item.content}</Text>
              <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>

              {/* Render comments */}
              {item.comments && item.comments.map((comment, index) => (
                <View key={index} style={styles.comment}>
                  <Text style={styles.commentUser}>{comment.user}:</Text>
                  <Text style={styles.commentText}>{comment.text}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        )}
      />

      {selectedTweetId && (
        <View style={styles.commentForm}>
          <TextInput
            style={styles.input}
            placeholder="Write a comment..."
            value={commentText}
            onChangeText={setCommentText}
          />
          <Button title="Post Comment" onPress={postComment} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40 },
  form: { marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 },
  tweet: { marginBottom: 20, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 5 },
  user: { fontWeight: 'bold' },
  date: { fontSize: 10, color: '#555' },
  comment: { marginTop: 5, marginLeft: 10 },
  commentUser: { fontWeight: 'bold' },
  commentText: { marginLeft: 5 },
  commentForm: { padding: 10, backgroundColor: '#eee', marginTop: 10 },
});
