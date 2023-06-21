import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ navigation }) => {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [enderecoServidor, setEnderecoServidor] = useState('');

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const configString = await AsyncStorage.getItem('config');
        if (configString) {
          const config = JSON.parse(configString);
          setLogin(config.login);
          setSenha(config.senha);
          setEnderecoServidor(config.enderecoServidor);
        }
      } catch (error) {
        console.log('Erro ao ler as configurações:', error);
      }
    };

    fetchConfig();
  }, []);

  const saveConfig = async () => {
    try {
      const config = {
        login,
        senha,
        enderecoServidor,
      };
      await AsyncStorage.setItem('config', JSON.stringify(config));
      console.log('Configurações salvas:', config);

      navigation.goBack();
    } catch (error) {
      console.log('Erro ao salvar as configurações:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <Text>Login na Hotmilhas:</Text>
        <TextInput
          style={styles.input}
          value={login}
          onChangeText={setLogin}
        />

        <Text>Senha na Hotmilhas:</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <Text>Endereço do servidor de milhas:</Text>
        <TextInput
          style={styles.input}
          value={enderecoServidor}
          onChangeText={setEnderecoServidor}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveConfig}>
        <Text style={styles.saveButtonText}>Salvar Configurações</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loginContainer: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
