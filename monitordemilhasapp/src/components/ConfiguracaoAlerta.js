import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { TextInputMask } from 'react-native-masked-text';
import config from '../../config/config.json';

const formatarMilhas = (valor) => {
  const valorFormatado = parseFloat(valor).toFixed(3);
  const partes = valorFormatado.split('.');
  partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adicionar pontos para separar milhares
  return partes.join('.');
};


const ConfiguracaoAlerta = ({ route, navigation }) => {
  const [programas, setProgramas] = useState([]);
  const [programa, setPrograma] = useState('');
  const [milhas, setMilhas] = useState('');
  const [limite, setLimite] = useState('');
  const [dias, setDias] = useState('');

  const limiteInputRef = useRef(null);

  useEffect(() => {
    setProgramas(config.programs);
  }, []);

  const handleSalvar = () => {
    const alerta = {
      programa: programa,
      milhas: parseFloat(milhas.replace('.', '')),
      limite: parseFloat(limiteInputRef.current.getRawValue()), // Obter o valor não formatado do campo limite
      dias: dias,
    };
    route.params.onSalvar(alerta);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Programa:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          style={styles.picker}
          selectedValue={programa}
          onValueChange={(value) => setPrograma(value)}
        >
          <Picker.Item label="Selecione um programa" value="" />
          {programas.map((programa) => (
            <Picker.Item
              key={programa.program.id}
              label={programa.program.name}
              value={programa.program.name}
            />
          ))}
        </Picker>
      </View>
      <Text style={styles.label}>Milhas:</Text>
      <TextInput
        style={styles.input}
        value={milhas.replace('.', '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}
        onChangeText={(text) => setMilhas(text)}
        keyboardType="numeric"
      />


      <Text style={styles.label}>Limite:</Text>
      <TextInputMask
      ref={limiteInputRef}
      style={styles.input}
      type="money"
      options={{
        precision: 2,
        separator: ',',
        delimiter: '.',
        unit: 'R$',
        suffixUnit: '',
      }}
      value={limite}
      onChangeText={(text) => setLimite(text)}
      keyboardType="numeric"
    />


      <Text style={styles.label}>Dias:</Text>
      <TextInput
        style={styles.input}
        value={dias}
        onChangeText={(text) => setDias(text)}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.salvarButton} onPress={handleSalvar}>
        <Text style={styles.salvarButtonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pickerContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
  },
  picker: {
    height: 40,
    paddingHorizontal: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  salvarButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  salvarButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ConfiguracaoAlerta;
