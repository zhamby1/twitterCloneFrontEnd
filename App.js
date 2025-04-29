// App.js
import React, { useEffect, useState } from 'react';
import {FlatList, Text, TextInput, Button, View, StyleSheet, AsyncStorage } from 'react-native';
import axios from 'axios';
import styles from './styles';

const API_URL = 'https://twitterclonebackend-production.up.railway.app'; // Your backend IP

export default function App() {
  const [tweets, setTweets] = useState([]);
  const [content, setContent] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

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

  useEffect(() => {
    fetchTweets();
  }, []);

  if (!user) {
    return (
      <View style={styles.container}>
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
          <View style={styles.tweet}>
            <Text style={styles.user}>{item.user}</Text>
            <Text>{item.content}</Text>
            <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

