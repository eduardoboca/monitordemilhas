const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const server = require('http').createServer(app);
const io = require('socket.io')(server);
const Provedor = require('./provedores/provedor');

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const provedor = new Provedor();
provedor.iniciarAtualizacaoMilhas();

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  // Ouvir evento do provedor e emitir dados para o cliente
  provedor.on('dadosAtualizados', (dados) => {
    console.log('Send update to clients');

    socket.emit('update', dados);
  });  
  

  // Enviar os dados em cache assim que um cliente se conectar
  console.log('User connected');
  setTimeout(() => {
    socket.emit('update', provedor.obterDadosMilhas());
    console.log('Enviar dados');
  },500);
  
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
