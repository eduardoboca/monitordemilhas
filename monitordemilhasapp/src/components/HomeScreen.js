import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { connectSocket } from '../services/DataSocket';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = ({ setLastUpdate }) => {
  const [programData, setProgramData] = useState({});
  const [isConnected, setIsConnected] = useState(true);
  const [reconnectionAttempts, setReconnectionAttempts] = useState(0);
  const [logMsg, setLogMsg] = useState('');

  const navigation = useNavigation();

  const goToDebugScreen = () => {
    navigation.navigate('Debug');
  };

  useEffect(() => {
    const socket = connectSocket(setProgramData, setIsConnected, setReconnectionAttempts, setLastUpdate, setLogMsg);

    // Retorne uma função de limpeza para desconectar o socket quando o componente for desmontado
    return () => {
      socket.disconnect();
    };
  }, []);

  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const renderPrograms = () => {
    if (!programData) {
      // Exibir uma mensagem de erro ou qualquer outra abordagem adequada
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Falha na conexão com o servidor.</Text>
        </View>
      );
    }

    return (
      <View>
        <Text style={styles.updateTime}>Última atualização: {new Date().toLocaleString()}</Text>

        {Object.entries(programData).map(([programName, program]) => (
          <View key={program.id} style={styles.programContainer}>
            <Text style={[styles.programTitle, { color: 'black' }]}>{program.name}</Text>

            {renderProgramOptions(program.receipts)}
          </View>
        ))}
      </View>
    );
  };

  const renderProgramOptions = (options) => {
    return Object.entries(options).map(([mileage, option]) => (
      <View key={mileage} style={styles.optionContainer}>
        <Text style={styles.optionTitle}>{mileage} mil milhas</Text>
        {renderOptionsTable(option.receipts)}
      </View>
    ));
  };

  const renderOptionsTable = (options) => {
    return (
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.columnHeader}>Dias</Text>
          <Text style={styles.columnHeader}>Valor</Text>
        </View>
        {Object.entries(options).map(([days, value]) => (
          <View key={days} style={styles.tableRow}>
            <Text style={styles.tableCell}>{days}</Text>
            <Text style={styles.tableCell}>{formatCurrency(value)}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
        {/* <Button title="Debug" onPress={goToDebugScreen} /> */}


      {!isConnected && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro de conexão: {logMsg} {'\n'} Tentando reconectar ({reconnectionAttempts} tentativas)...</Text>
        </View>
      )}
      {renderPrograms()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  programContainer: {
    marginBottom: 24,
  },
  programTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  optionContainer: {
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  columnHeader: {
    flex: 1,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  tableCell: {
    flex: 1,
  },
  updateTime: {
    fontSize: 10,
    textAlign: 'right',
    marginTop: -20,
  },
  errorContainer: {
    marginBottom: 24,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
