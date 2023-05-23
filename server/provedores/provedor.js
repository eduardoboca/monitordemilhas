const Hotmilhas = require('./hotmilhas');
const { EventEmitter } = require('events');

class Provedor extends EventEmitter {
  constructor() {
    super();
    this.provedor = new Hotmilhas();
    this.cachedData = null;
  }

  iniciarAtualizacaoMilhas() {
    //this.provedor.performLogin();
    this.provedor.obterValoresMilhas();
    //console.log('Dados de milhas atualizados:', JSON.stringify(this.cachedData, null, 2))
    this.atualizarMilhasPeriodicamente();
  }

  atualizarMilhasPeriodicamente() {
    setInterval(() => {
      this.provedor.obterValoresMilhas()
        .then((data) => {
          this.cachedData = data;
          //console.log('Dados de milhas atualizados:', JSON.stringify(this.cachedData, null, 2));

          // Emitir evento personalizado          
          this.emit('dadosAtualizados', this.cachedData);
        })
        .catch((error) => {
          console.error('Erro ao obter os valores de milhas:', error);
        });
    }, 30000);
  }

  obterDadosMilhas() {
    return this.cachedData;
  }
}

module.exports = Provedor;
