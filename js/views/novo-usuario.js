'use strict' //modo estrito


// Atalhos para os elementos DOM - Document Object Model
const formNovoUsuario = document.getElementById('formNovoUsuario')

//Adiciona um Listener no formulário
formNovoUsuario.addEventListener('submit', (event) => {
 const email = document.getElementById('emailNovo').value
 const senha = document.getElementById('senhaNovo').value
 event.preventDefault()
novoUsuario(email, senha)
}
)