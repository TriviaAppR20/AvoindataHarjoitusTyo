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

  //fetch categories
  //on component mount
  useEffect(() => {
    fetchCategories();
    //get api session token here
  }, []);

  
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
