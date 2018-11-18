const jwt = require('jsonwebtoken'); //esta es la libreria
// Creamos un usuario ejemplo
usuario = {
  id: 12,
  username: 'prueba'
};
// Vamos a firmar este usuario en un token;
// Partes del token
// var token = jwt.sign({objeto a firmar}, 'secreto', {tiempo de expiracion});
// jwt.sign()---> es la funcnion que firma, es decir genera al jsonwebtoken
// {objeto a firmar} ----> es lo que voy a enviar codficado, es decir el usuario con sus datos
// 'secreto' ----> un secreto por seguridad, no nos importa mucho, aqui se pondra "candyucab"
// {tiempo de expiracion} -----> en cuanto tiempo vence el token, es decir vence el login
// el tiempo de expiracion es un objeto de esta forma
// {
// expiresIn: cantidad de segundos
// }
var token = jwt.sign(usuario, 'candyucab',{expiresIn: 60 * 60 }); //token con el objeto usuario, secreto 'candyucab' y vence en una hora

console.log(`token: ${token}`);

// ahora vamos a decodificar un token
// partes del token a decodificar
// var decoded = jwt.verify(token, 'secreto');
// jwt.verify() es la funcion que decodifica el jsonwebtoken
// token es el token que se va decodificar
// 'secreto' es el secreto con que firmamos el primer token

var decoded = jwt.verify(token, 'candyucab');

console.log(`decodificado: ${JSON.stringify(decoded, undefined, 2)}`);

// decoded es un objeto, con los atributos del objeto usuario
// si quiero el id del usuario haria algo asi decoded.idea

console.log(`id del objeto usuario en el token: ${decoded.id}`);


// para mas dudas la documentacion https://github.com/auth0/node-jsonwebtoken
