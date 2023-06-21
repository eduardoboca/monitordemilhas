import React, { useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';

const DebugScreen = () => {
    const [logMessages, setLogMessages] = useState([]);
  
    const addToLog = (message) => {
      setLogMessages((prevMessages) => [...prevMessages, message]);
    };
  
    return (
      <ScrollView>
        <View>
          <Text>Debug Messages:</Text>
          {logMessages.map((message, index) => (
            <Text key={index}>{message}</Text>
          ))}
        </View>
      </ScrollView>
    );
  };
  
  export default DebugScreen;
  