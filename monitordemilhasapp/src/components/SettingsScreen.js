import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput } from 'react-native';

const SettingsScreen = () => {
  const [configValues, setConfigValues] = useState([]);
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');

  const addConfigValue = () => {
    const newConfigValue = {
      programa: '',
      milhas: 0,
      dias: 0,
    };
    setConfigValues([...configValues, newConfigValue]);
  };

  const removeConfigValue = (index) => {
    const updatedConfigValues = [...configValues];
    updatedConfigValues.splice(index, 1);
    setConfigValues(updatedConfigValues);
  };

  const renderConfigItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.configItem}
        onPress={() => removeConfigValue(index)}
      >
        <Text style={styles.programa}>{item.programa}</Text>
        <Text style={styles.milhas}>{`${item.milhas} milhas`}</Text>
        <Text style={styles.dias}>{`${item.dias} dias`}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <Text>Login:</Text>
        <TextInput
          style={styles.input}
          value={login}
          onChangeText={setLogin}
        />

        <Text>Senha:</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
      </View>

      <FlatList
        data={configValues}
        renderItem={renderConfigItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity style={styles.addButton} onPress={addConfigValue}>
        <Text style={styles.addButtonText}>Adicionar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContent: {
    flexGrow: 1,
  },
  configItem: {
    backgroundColor: '#ffffff',
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  programa: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  milhas: {
    fontSize: 16,
    marginBottom: 4,
  },
  dias: {
    fontSize: 16,
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
  addButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
