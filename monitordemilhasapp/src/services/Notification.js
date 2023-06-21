import PushNotification from 'react-native-push-notification';

const enviarNotificacao = (programName, mileage, days, value) => {
  console.log(`Notificação enviada para o programa ${programName}`);
  console.log(`Programa de milhagem: ${programName}`);
  console.log(`Quantidade de dias: ${days}`);
  console.log(`Quantidade de milhas: ${mileage}`);
  console.log(`Valor da milha: R$${value}`);
  console.log('--------------------------');

/*
  programName = 'SMILES';
    days = 90;
    mileage = 300;
    value = "10.000,00";
*/

  console.log('chamando o PushNotification...');
  PushNotification.localNotification({
    channelId: 'milhas_channel',
    title: `Programa de milhagem: ${programName}`,
    message: `Quantidade de dias: ${days}\nQuantidade de milhas: ${mileage}\nValor da milha: R$${value}`,
    smallIcon: 'ic_milhas.png',
    autoCancel: true,
  }, (notificationId) => {
    if (notificationId) {
      console.log(`Notificação enviada com sucesso. ID: ${notificationId}`);
    } else {
      console.log('Erro ao enviar a notificação.');
    }
  });
  console.log('fim PushNotification');
  
};

const enviarNotificacoes = (programData) => {
    console.log('enviarNotificacoes');
    //enviarNotificacao(null, null, null, null);
  
  const primeiroAlerta = {
    programaMilhagem: 'SMILES',
    quantidadeDias: 90,
    quantidadeMilhas: 300,
    limiteDesejado: 4500,
  };

  const segundoAlerta = {
    programaMilhagem: 'LATAM PASS',
    quantidadeDias: 90,
    quantidadeMilhas: 300,
    limiteDesejado: 4500,
  };

  //console.log('enviarNotificacoes disparado');

  programData.forEach((program) => {
    enviarNotificacao(program.nome, program.milhas, program.dias, program.valor);
  });
  
  /*
  Object.entries(programData).forEach(([programId, program]) => {
    const programName = program.name;

    Object.entries(program.receipts).forEach(([mileage, option]) => {
      Object.entries(option.receipts).forEach(([days, value]) => {
        if (
          programName === primeiroAlerta.programaMilhagem &&
          Number(mileage) === primeiroAlerta.quantidadeMilhas &&
          Number(days) === primeiroAlerta.quantidadeDias &&
          value > primeiroAlerta.limiteDesejado
        ) {
            console.log('enviar notificacao alerta1');
          enviarNotificacao(programName, mileage, days, value);
        }

        if (
          programName === segundoAlerta.programaMilhagem &&
          Number(mileage) === segundoAlerta.quantidadeMilhas &&
          Number(days) === segundoAlerta.quantidadeDias &&
          value > segundoAlerta.limiteDesejado
        ) {
            console.log('enviar notificacao alerta2');
          enviarNotificacao(programName, mileage, days, value);
        }
      });
    });
  }); 
  */

};

const configurarNotificacoes = () => {
    PushNotification.createChannel(
      {
        channelId: 'milhas_channel', // ID único para o canal de notificação
        channelName: 'Milhas Channel', // Nome do canal de notificação
        channelDescription: 'Canal de notificação para milhas', // Descrição do canal de notificação
        importance: 4, // Prioridade do canal de notificação (0 a 4)
        soundName: 'default', // Nome do som da notificação
        vibrate: true, // Habilitar vibração
      },
      (created) => console.log(`Canal de notificação criado: ${created}`)
    );
  
    PushNotification.configure({
      // Configurações do PushNotification
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
            console.log("TOKEN:", token);
      },      
      onNotification: function (notification) {
        console.log('Notificação recebida:', notification);
        // Aqui você pode adicionar a lógica para tratar a interação do usuário com a notificação
      },
      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function(err) {
        console.error(err.message, err);
      },      
      requestPermissions: Platform.OS === 'ios',
    });
  };
  
// Configurar as notificações ao importar o módulo
configurarNotificacoes();

export { enviarNotificacoes };