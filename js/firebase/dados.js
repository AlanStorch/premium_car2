'use strict' //modo estrito

/**
 * obtemDados.
 * Obtem dados da collection a partir do Firebase.
 * @param {string} collection - Nome da collection no Firebase
 * @return {object} - Uma tabela com os dados obtidos
 */
async function obtemDados(collection) {
  let spinner = document.getElementById('carregandoDados')
  let tabela = document.getElementById('tabelaDados')
  await firebase.database().ref(collection).orderByChild('nome').on('value', (snapshot) => {
    tabela.innerHTML = ''
    let cabecalho = tabela.insertRow()
    cabecalho.className = 'fundo-azul-claro'
    cabecalho.insertCell().textContent = 'Proprietário'
    cabecalho.insertCell().textContent = 'Veiculo'
    cabecalho.insertCell().textContent = 'Placa'
    cabecalho.insertCell().textContent = 'Km'
    cabecalho.insertCell().textContent = 'Opções'



    snapshot.forEach(item => {
      // Dados do Firebase
      let db = item.ref._delegate._path.pieces_[0] //collection
      let id = item.ref._delegate._path.pieces_[1] //id do registro   
      //Criando as novas linhas na tabela
      let novaLinha = tabela.insertRow()
      novaLinha.insertCell().innerHTML = '<small>' + item.val().proprietario + '</small>'
      novaLinha.insertCell().innerHTML = '<small>' + item.val().veiculo + '</small>'
      novaLinha.insertCell().innerHTML = '<small>' + item.val().placa + '</small>'
      novaLinha.insertCell().innerHTML = '<small>' + item.val().km + '</small>'
    

      
      novaLinha.insertCell().innerHTML = `<button class='btn btn-sm btn-danger' onclick=remover('${db}','${id}')><i class="bi bi-trash"></i></button>
      <button class='btn btn-sm btn-warning' onclick=carregaDadosAlteracao('${db}','${id}')><i class="bi bi-pencil-square"></i></button>`

    })
    let rodape = tabela.insertRow()
    rodape.className = 'fundo-azul-claro'
    rodape.insertCell().colSpan = "4"
    rodape.insertCell().innerHTML = totalRegistros(collection)

  })
  spinner.classList.add('d-none') //oculta o carregando...
}

/**
 * obtemDados.
 * Obtem dados da collection a partir do Firebase.
 * @param {string} db - Nome da collection no Firebase
 * @param {integer} id - Id do registro no Firebase
 * @return {object} - Os dados do registro serão vinculados aos inputs do formulário.
 */

async function carregaDadosAlteracao(db, id) {
  await firebase.database().ref(db + '/' + id).on('value', (snapshot) => {
    document.getElementById('id').value = id
    document.getElementById('proprietario').value = snapshot.val().proprietario
    document.getElementById('cpf').value = snapshot.val().cpf
    formatarCPF(document.getElementById('cpf'))
    document.getElementById('endereco').value = snapshot.val().endereco
    document.getElementById('numero').value = snapshot.val().numero
    document.getElementById('cep').value = snapshot.val().cep
    formatarCEP(document.getElementById('cep'))
    document.getElementById('email').value = snapshot.val().email
    document.getElementById('montadora').value = snapshot.val().montadora
    document.getElementById('veiculo').value = snapshot.val().veiculo
    document.getElementById('km').value = snapshot.val().km
    document.getElementById('cor').value = snapshot.val().cor
    document.getElementById('modelo').value = snapshot.val().modelo
    document.getElementById('placa').value = snapshot.val().placa

    if (snapshot.val().vistoria === 'aprovada') {
      document.getElementById('vistoria-0').checked = true
    }
    else if (snapshot.val().vistoria === 'com apontamento') {
      document.getElementById('vistoria-1').checked = true
    }
    else {
      document.getElementById('vistoria-2').checked = true
    }
  })

  document.getElementById('veiculo').focus() //Definimos o foco no campo nome
}



/**
 * incluir.
 * Inclui os dados do formulário na collection do Firebase.
 * @param {object} event - Evento do objeto clicado
 * @param {string} collection - Nome da collection no Firebase
 * @return {null} - Snapshot atualizado dos dados
 */

function salvar(event, collection) {
  event.preventDefault() // evita que o formulário seja recarregado
  //Verifica os campos obrigatórios
  if (document.getElementById('proprietario').value === '') { alerta('⚠️É obrigatório informar o proprietário!', 'warning') }
  else if (document.getElementById('email').value === '') { alerta('⚠️É obrigatório informar o email!', 'warning') }
  else if (document.getElementById('modelo').value === '') { alerta('⚠️É obrigatório informar o modelo!', 'warning') }
  else if (document.getElementById('placa').value < 0 || document.getElementById('placa').value > 300) { alerta('⚠️O placa deve ser um número entre 0 a 300', 'warning') }
  else if (document.getElementById('id').value !== '') { alterar(event, collection) }
  else { incluir(event, collection) }
}


async function incluir(event, collection) {
  let usuarioAtual = firebase.auth().currentUser
  let botaoSalvar = document.getElementById('btnSalvar')
  botaoSalvar.innerText = 'Aguarde...'
  event.preventDefault()
  //Obtendo os campos do formulário
  const form = document.forms[0];
  const data = new FormData(form);
  //Obtendo os valores dos campos
  const values = Object.fromEntries(data.entries());
  //Enviando os dados dos campos para o Firebase
  return await firebase.database().ref(collection).push({
    proprietario: values.proprietario,
    cpf: values.cpf,
    endereco: values.endereco,
    cep: values.cep,
    numero: values.numero,
    email: values.email.toLowerCase(),
    montadora: values.montadora,
    veiculo: values.veiculo,
    km: values.km,
    modelo: values.modelo,
    placa: values.placa,
    cor: values.cor,
    vistoria: values.vistoria,
    usuarioInclusao: {
      uid: usuarioAtual.uid,
      nome: usuarioAtual.displayName,
      urlImagem: usuarioAtual.photoURL,
      email: usuarioAtual.email,
      dataInclusao: new Date()
    }
  })
    .then(() => {
      alerta(`✅ Registro incluído com sucesso!`, 'success')
      document.getElementById('formCadastro').reset() //limpa o form
      //Limpamos o avatar do cliente
      botaoSalvar.innerHTML = '<i class="bi bi-save-fill"></i> Salvar'
    })
    .catch(error => {
      alerta('❌ Falha ao incluir: ' + error.message, 'danger')
    })

}

async function alterar(event, collection) {
  let usuarioAtual = firebase.auth().currentUser
  let botaoSalvar = document.getElementById('btnSalvar')
  botaoSalvar.innerText = 'Aguarde...'
  event.preventDefault()
  //Obtendo os campos do formulário
  const form = document.forms[0];
  const data = new FormData(form);
  //Obtendo os valores dos campos
  const values = Object.fromEntries(data.entries());
  //Enviando os dados dos campos para o Firebase
  return await firebase.database().ref().child(collection + '/' + values.id).update({
    proprietario: values.proprietario,
    cpf: values.cpf,
    endereco: values.endereco,
    numero: values.numero,
    cep: values.cep,
    email: values.email.toLowerCase(),
    montadora: values.montadora,
    veiculo: values.veiculo,
    km: values.km,
    modelo: values.modelo,
    placa: values.placa,
    cor: values.cor,
    vistoria: values.vistoria,
    usuarioAlteracao: {
      uid: usuarioAtual.uid,
      nome: usuarioAtual.displayName,
      urlImagem: usuarioAtual.photoURL,
      email: usuarioAtual.email,
      dataAlteracao: new Date()
    }
  })
    .then(() => {
      alerta('✅ Registro alterado com sucesso!', 'success')
      document.getElementById('formCadastro').reset()
      document.getElementById('id').value = ''
      botaoSalvar.innerHTML = '<i class="bi bi-save-fill"></i> Salvar'
    })
    .catch(error => {
      console.error(error.code)
      console.error(error.message)
      alerta('❌ Falha ao alterar: ' + error.message, 'danger')
    })
}

/**
 * remover.
 * Remove os dados da collection a partir do id passado.
 * @param {string} db - Nome da collection no Firebase
 * @param {integer} id - Id do registro no Firebase
 * @return {null} - Snapshot atualizado dos dados
 */
async function remover(db, id) {
  if (window.confirm("⚠️Confirma a exclusão do registro?")) {
    let dadoExclusao = await firebase.database().ref().child(db + '/' + id)
    dadoExclusao.remove()
      .then(() => {
        alerta('✅ Registro removido com sucesso!', 'success')
      })
      .catch(error => {
        console.error(error.code)
        console.error(error.message)
        alerta('❌ Falha ao excluir: ' + error.message, 'danger')
      })
  }
}


/**
 * totalRegistros
 * Retornar a contagem do total de registros da collection informada
 * @param {string} collection - Nome da collection no Firebase
 * @param {integer} id - Id do registro no Firebase
 * @return {null} - Snapshot atualizado dos dados
 */

function totalRegistros(collection) {
  var retorno = '...'
  firebase.database().ref(collection).on('value', (snap) => {
    if (snap.numChildren() === 0) {
      retorno = '⚠️ Ainda não há nenhum registro cadastrado!'
    } else {
      retorno = `Total: <span class="badge fundo-laranja-escuro"> ${snap.numChildren()} </span>`
    }
  })
  return retorno
}

/**
 * Formata o valor do campo de CPF e CEP com pontos e traço enquanto o usuário digita os dados.
 *
 * @param {object} campo - O campo de entrada do CPF.
 */

function formatarCPF(campo) {
  // Remove caracteres não numéricos
  var cpf = campo.value.replace(/\D/g, '');

  if (cpf.length <= 11) {
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  } else {
    cpf = cpf.substring(0, 11); // Limitar o CPF em 12 caracteres
  }

  campo.value = cpf;
}


function formatarCEP(campo) {
  // Remove caracteres não numéricos
  var cep = campo.value.replace(/\D/g, '');

  if (cep.length <= 8) {
    cep = cep.replace(/(\d{2})(\d)/, '$1.$2');
    cep = cep.replace(/(\d{3})(\d{1,3})$/, '$1-$2');
  } else {
    cep = cep.substring(0, 8); // Limitar o CPF em 8 caracteres
  }

  // Atualiza o valor do campo
  campo.value = cep;
}