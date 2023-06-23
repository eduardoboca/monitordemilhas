import io from 'socket.io-client';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { enviarNotificacoes } from '../services/Notification';

const obterEnderecoIP = async () => {
  const state = NetInfo.fetch();

  console.log('state: ', state);
};

const connectSocket = (setData, setIsConnected, setReconnectionAttempts, setLastUpdate, setLogMsg) => {
  //const enderecoServidor = 'http://192.168.1.6:3000';
  //const enderecoServidor = 'http://ec2-user@ec2-3-21-35-143.us-east-2.compute.amazonaws.com/';
  const enderecoServidor = 'https://monitordemilhas.sleeker.pt/';

  console.log(`Conectar ao servidor: ${enderecoServidor}`);
  const socket = io(enderecoServidor, { allowEIO3: true });
  
  /*
  AsyncStorage.getItem('config')
    .then((configString) => {
      if (configString) {
        const config = JSON.parse(configString);
        const { enderecoServidor } = config;

        if (enderecoServidor) {
          //socket.io.uri = "http://192.168.1.6:3000";
          //socket.io.opts.hostname = '192.168.1.6';
          //socket.io.opts.port = 3000;         
          socket.connect(enderecoServidor); // Conecta ao servidor com o novo URI

          //socket = io(enderecoServidor);
          console.log(`Servidor de milhas: ${enderecoServidor}`);
        }
      }
    })
    .catch((error) => {
      console.log('Erro ao obter as configurações:', error);
    })
*/
  socket.on('connect', () => {
    console.log('Conectado ao servidor');
    setIsConnected(true);
    setReconnectionAttempts(0);
  });

  socket.on('connect_error', (err) => {
    console.log('Falha na conexão ao servidor', err);
    setReconnectionAttempts((prevAttempts) => prevAttempts + 1);
    setLogMsg(`${err.toString()} \n servidor: ${enderecoServidor}`);
    obterEnderecoIP();
    setIsConnected(false);
  });

      

  socket.on('connect_timeout', () => {
    console.log('Falha na conexão ao servidor');
    setReconnectionAttempts((prevAttempts) => prevAttempts + 1);
    setLogMsg('timeout');
    setIsConnected(false);
  });

  socket.on('update', (data) => {
    setIsConnected(true);
    setReconnectionAttempts(0);
    setData(data);

    AsyncStorage.getItem('alertas')
      .then((alertasArmazenados) => {
        if (alertasArmazenados) {
          const alertas = JSON.parse(alertasArmazenados);
          const alertasEncontrados = [];

          console.log(`Alertas: ${alertasArmazenados}`);

          Object.values(data).forEach((programa) => {
            const programaId = programa.id;
            const programaNome = programa.name;
            const receipts = programa.receipts;

            Object.entries(receipts).forEach(([milhas, dadosReceipts]) => {
              Object.entries(dadosReceipts.receipts).forEach(([dias, valor]) => {
                const milhasNumber = parseFloat(milhas) * 1000;
                const valorNumber = parseFloat(valor);

                const alertaEncontrado = alertas.find(
                  (alerta) =>
                    alerta.programa === programaNome &&
                    alerta.milhas == milhasNumber &&
                    parseFloat(alerta.limite) < valorNumber &&
                    alerta.dias === dias
                );

                if (alertaEncontrado) {
                  // Atualizar o alerta correspondente com a data da última notificação
                  const today = new Date();
                  const todayStr = today.toISOString().split('T')[0]; // Obter a parte da data (YYYY-MM-DD)
                 
                  if (!alertaEncontrado.lastNotificationDate || alertaEncontrado.lastNotificationDate !== todayStr) {
                    alertaEncontrado.lastNotificationDate = todayStr;

                    // Encontrar o índice do alerta no array de alertas
                    console.log(`Vai enviar notificação. LastNotification: ${alertaEncontrado.lastNotificationDate}   today: ${todayStr}`);
                    const alertaIndex = alertas.findIndex(
                      (alerta) =>
                        alerta.programa === programaNome &&
                        alerta.milhas == milhasNumber &&
                        parseFloat(alerta.limite) < valorNumber &&
                        alerta.dias === dias
                    );

                    // Substituir o alerta no array de alertas
                    if (alertaIndex !== -1) {
                      alertas[alertaIndex] = alertaEncontrado;
                    }

                    // Atualizar o AsyncStorage com os alertas atualizados
                    AsyncStorage.setItem('alertas', JSON.stringify(alertas)).catch((error) => {
                      console.log('Erro ao atualizar os alertas no AsyncStorage:', error);
                    });
                    alertasEncontrados.push({
                      nome: programaNome,
                      milhas: milhasNumber,
                      valor: valorNumber,
                      dias: dias,
                    });
  
                  }
                }
              });
            });
          });

          if (alertasEncontrados.length > 0) {
            console.log('NOTIFICAR!', alertasEncontrados);
            enviarNotificacoes(alertasEncontrados);
          }
        }
      })
      .catch((error) => {
        console.log('Erro ao obter os alertas configurados:', error);
      });
  });

  socket.on('reconnect_attempt', () => {
    setReconnectionAttempts((prevAttempts) => prevAttempts + 1);
  });


  return socket;
};

export { connectSocket };
