import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AlertsScreen = ({ navigation }) => {
  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    carregarAlertas();
  }, []);

  useEffect(() => {
    console.log('Alertas atualizados:', JSON.stringify(alertas));
    salvarAlertas();
  }, [alertas]);

  const carregarAlertas = async () => {
    try {
      console.log('carregando alertas');
      const alertasArmazenados = await AsyncStorage.getItem('alertas');
      if (alertasArmazenados) {
        console.log(alertasArmazenados);
        setAlertas(JSON.parse(alertasArmazenados));
      } else {
        console.log('O arquivo de alertas não existe.');
      }
    } catch (error) {
      console.log('Erro ao carregar os alertas:', error);
    }
  };

  const salvarAlertas = async () => {
    try {
      // Converter os valores para números antes de salvar
      const alertasNumeros = alertas.map((alerta) => ({
        ...alerta,
        milhas: parseFloat(alerta.milhas),
        limite: parseFloat(alerta.limite),
      }));

      await AsyncStorage.setItem('alertas', JSON.stringify(alertasNumeros));
      console.log('Arquivo de alertas criado. Alertas:', JSON.stringify(alertas));

    } catch (error) {
      console.log('Erro ao salvar os alertas:', error);
    }
  };

  const adicionarAlerta = () => {
    navigation.navigate('ConfiguracaoAlerta', {
      onSalvar: (alerta) => {
        console.log('Adicionar novo alerta: ', JSON.stringify(alerta));
        setAlertas((prevAlertas) => [...prevAlertas, alerta]);
      },
    });
  };

  const handleExcluirAlerta = (item) => {
    const novosAlertas = alertas.filter((alerta) => alerta !== item);
    setAlertas(novosAlertas);
  };

  const renderItem = ({ item }) => {
    // Formatar os valores exibidos na tela
    const milhasFormatadas = `${item.milhas.toLocaleString()}`;
    const limiteFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.limite);

    return (
      <View style={styles.alertItem}>
        <Text style={styles.programa}>{item.programa}</Text>
        <Text style={styles.milhas}>{`Quantidade de milhas: ${milhasFormatadas}`}</Text>
        <Text style={styles.limite}>{`Valor limite: ${limiteFormatado}`}</Text>
        <Text style={styles.dias}>{`Dias: ${item.dias}`}</Text>
        <TouchableOpacity
          style={styles.excluirButton}
          onPress={() => handleExcluirAlerta(item)}
        >
          <Text style={styles.excluirButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    );
  };
  

  return (
    <View style={styles.container}>
      {alertas.length > 0 ? (
        <FlatList
          data={alertas}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Text style={styles.emptyText}>Não há alertas disponíveis.</Text>
      )}

      <TouchableOpacity style={styles.addButton} onPress={adicionarAlerta}>
        <Text style={styles.addButtonText}>Adicionar Alerta</Text>
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
  alertItem: {
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
  limite: {
    fontSize: 16,
  },
  excluirButton: {
    backgroundColor: '#ff0000',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  excluirButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
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
  dias: {
    fontSize: 16,
  },
});

export default AlertsScreen;
