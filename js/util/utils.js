'use strict' //modo estrito


function buscarCep(cep) {
  if (cep.length == 10) {
    fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`)
    // Verifica se a chamada da API está correta
    .then(resposta => {
      if (!resposta.ok) {
        throw new Error('Erro na requisição: ' + resposta.status);
      }
      return resposta.json();
    })
    // Se a chamada estiver correta, retorna os dados da API
    .then(data => {
      console.log(data);
      let endereco = `${data.street}, ${data.neighborhood}, ${data.city} - ${data.state}`;
      document.getElementById('endereco').value = endereco;
    })

    .catch(error => {
      console.error(error);
      alerta(`CEP não encontrado!`, 'info')
    });
  }

  
}
