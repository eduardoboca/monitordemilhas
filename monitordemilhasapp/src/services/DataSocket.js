import io from 'socket.io-client';
import { enviarNotificacoes } from '../services/Notification';

/*
setInterval(() => {
  enviarNotificacoes(null);
}, 30000);
*/

const connectSocket = (setData, setIsConnected, setReconnectionAttempts, setLastUpdate) => {
    const socket = io('http://192.168.1.4:3000');

  socket.on('connect', () => {
    console.log('Conectado ao servidor');
    setIsConnected(true);
    setReconnectionAttempts(0);
  });

  socket.on('connect_error', () => {
    console.log('Falha na conexão ao servidor');
    setIsConnected(false);
  });

  socket.on('connect_timeout', () => {
    console.log('Falha na conexão ao servidor');
    setIsConnected(false);
  });

  socket.on('update', (data) => {
    //console.log(`update: ${new Date().toLocaleString()}`);
    setIsConnected(true);
    setReconnectionAttempts(0);
    setData(data);
    //console.log('enviarNotificacoes');
    enviarNotificacoes(data);
  });

  socket.on('reconnect_attempt', () => {
    setReconnectionAttempts((prevAttempts) => prevAttempts + 1);
  });

  return socket;
};

export { connectSocket };
