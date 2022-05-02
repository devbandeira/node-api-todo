const mongoose = require('mongoose');

const User = mongoose.model('User',{
  name: String,
  email: String,
  password: String//(ERRO QUE ESTAVA DANDO ANTES DE PASSAR COMO STRING MESMO SENDO SENHA SO DE NUMERO Error: data must be a string or Buffer and salt must either be a salt string or a number of rounds) A senha aqui e passada como string, porque? Devido o bcrypt.hash(), deseja que seja passado como strning para poder conter numeros, letras, simbolos, etc
});//mongoose pega o User e bota ele plural la na collection, aqui que ele da o nome a uma colletion sem determinar nada. Depois da palavra User eu boto um objeto {} que vai determinar os tipos de dados e propriedades que esse meu objeto MODEL tera

module.exports = User