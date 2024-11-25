import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect, useContext } from "react";

export default function App() {

  const [categories, setCategories] = useState([]);
  const [amountOfQuestions, setAmountOfQuestions] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [type, setType] = useState("");
  const [apiSessionToken, setApiSessionToken] = useState("");
  const [isTokenEmpty, setIsTokenEmpty] = useState(false);


  //fetch categories
  //from the api
  const fetchCategories = async () => {
    try {
      const response = await fetch("https://opentdb.com/api_category.php");
      const data = await response.json();
      setCategories(data.trivia_categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

   // Fetches a new API session token and returns it
   const fetchApiSessionToken = async () => {
    try {
      const response = await fetch(
        "https://opentdb.com/api_token.php?command=request"
      );
      const data = await response.json();
      if (data.response_code === 0) {
        return data.token;
      } else {
        console.error(
          `Error fetching token: ${data.response_message}. Error code: ${data.response_code}`
        );
        Alert.alert(
          `Error fetching token: ${data.response_message}. Error code: ${data.response_code}`
        );
      }
    } catch (err) {
      console.error(`Unexpected error: ${err}`);
      Alert.alert(`Unexpected error: ${err}`);
    }
  };

   // Requests the api to reset the current API session token
   const resetApiSessionToken = async () => {
    try {
      const response = await fetch(
        `https://opentdb.com/api_token.php?command=reset&token=${apiSessionToken}`
      );
      const data = await response.json();
      if (data.response_code === 0) {
        Alert.alert("Reset successful!");
        hideTokenEmpty();
      } else {
        Alert.alert("Error. Something went wrong while resetting the token");
      }
    } catch (err) {
      console.error(`Error resetting token: ${err}`);
    }
  };

  const getApiSessionToken = async () => {
    try {
      // Get existing token from async storage and make a test query to the api with it
      const existingToken = await AsyncStorage.getItem("API-Token");
      const response = await fetch(
        `https://opentdb.com/api.php?amount=5&token=${existingToken}`
      );
      const data = await response.json();
      // If there was an existing token in async storage and the API doesn't return code 3 (token does not exist)
      if (existingToken !== null && data.response_code !== 3) {
        // Then we set the state variable to the existing token
        setApiSessionToken(existingToken);
      } else {
        // Else we request a new token from the API and save that in state as well as async storage
        const token = await fetchApiSessionToken();
        await AsyncStorage.setItem("API-Token", token);
        setApiSessionToken(token);
      }
    } catch (err) {
      console.error(`Unexpected error: ${err}`);
      Alert.alert(`Unexpected error: ${err}`);
    }
  };

  //fetch categories
  //on component mount
  useEffect(() => {
    fetchCategories();
    getApiSessionToken();
  }, []);

  const showTokenEmpty = () => {
    setIsTokenEmpty(true);
    StatusBar.setBackgroundColor(isDarkMode ? "#000" : "rgba(0,0,0,0.7)");
  };
  const hideTokenEmpty = () => {
    setIsTokenEmpty(false);
    StatusBar.setBackgroundColor(isDarkMode ? "#000" : "#FFF");
  };
  
//fetch questions
//from the api
//using generated query
  const fetchQuestions = async () => {
    try {
      const url = generateQueryUrl();
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching questions", error);
    }
  };


// Fetches session token from API. If successful it is returned.
  const fetchApiSessionToken = async () => {
    try {
      const response = await fetch(
        "https://opentdb.com/api_token.php?command=request"
      );
      const data = await response.json();
      if (data.response_code === 0) {
        return data.token;
      } else {
        console.error(
          `Error fetching token: ${data.response_message}. Error code: ${data.response_code}`
        );
        Alert.alert(
          `Error fetching token: ${data.response_message}. Error code: ${data.response_code}`
        );
      }
    } catch (err) {
      console.error(`Unexpected error: ${err}`);
      Alert.alert(`Unexpected error: ${err}`);
    }
  };


// Generates the url for the query on specified amount, category, difficulty and token
  const generateQueryUrl = () => {
    const apiUrl = "https://opentdb.com/api.php";
    const queryParams = [`amount=${amountOfQuestions}`];

    if (category) queryParams.push(`category=${category}`);
    if (difficulty) queryParams.push(`difficulty=${difficulty}`);
    if (type) queryParams.push(`type=${type}`);
    if (apiSessionToken) queryParams.push(`token=${apiSessionToken}`);

    const queryUrl = `${apiUrl}?${queryParams.join("&")}`;
    return queryUrl;
  };


  return (
    <View style={styles.container}>
      <Text> . </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
