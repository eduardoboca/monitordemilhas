const axios = require('axios');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../config/config.json');
const configData = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configData);

class Hotmilhas {
  constructor() {
    this.token = null;
  }

  async performLogin() {
    try {
      const loginData = new URLSearchParams();
      loginData.append('email', config.hotmilhas.email);
      loginData.append('password', config.hotmilhas.senha);

      const response = await axios.post(config.hotmilhas.loginUrl, loginData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      this.token = response.data.auth_token;

      //console.log('Login efetuado com sucesso. Token:', this.token);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  }

  async obterValoresMilhas() {
    try {
      if (!this.token) {
        await this.performLogin();
      }
      const requests = config.hotmilhas.requests;

      const valoresMilhas = {};

      for (const request of requests) {
        const program = request.program;
        const points = request.points;

        for (const point of points) {
          const params = new URLSearchParams();
          params.append('program', program.id);
          params.append('points', point.toString());

          const url = `${config.hotmilhas.apiUrl}?${params.toString()}`;

          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
            validateStatus: (status) => status === 200 || status === 422,
          });

          if (response.status === 200 || response.status === 422) {
            if (!valoresMilhas[program.id]) { 
              valoresMilhas[program.id] = {
                id: program.id,
                name: program.name, 
                receipts: {} 
              };
            }
  
            valoresMilhas[program.id].receipts[point] = response.data; 
  
          } else {
            console.warn('Resposta inválida:', response.status, response.data);
          }
        }
      }

      console.log('Dados de milhas atualizados (3)');
      return valoresMilhas;
    } catch (error) {
      console.error('Erro ao obter os valores de milhas:', error);
    }
  }
}

module.exports = Hotmilhas;
