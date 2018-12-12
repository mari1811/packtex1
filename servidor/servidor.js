var express = require('express'),
    authentication = require('express-authentication'),
    app = express();

const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const {Client} = require('pg');
const pgCamelCase = require('pg-camelcase');
const jwt = require('jsonwebtoken');

//tercero
const cookieParser = require('cookie-parser');
const session = require('express-session');

pgCamelCase.inject(require('pg'))
require('dotenv').config();

 const port = process.env.PORT || 3000; // el puerto process.env.PORT es para heroku, el 3000 es para el pruebas locales

//tercero
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))


const mustache = mustacheExpress();
mustache.cache = null;
app.engine('mustache', mustache);
app.set('view engine', 'mustache')
app.use(express.static('views'))

app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: false}));

    app.get('/principal', (req, res) =>{
      res.render('inicio1') 
    });
    app.get('/principal', (req, res) =>{
     res.send('/login')    
    });

app.get('/orden', (req, res) =>{
  res.render('orden')
});

 app.get('/mapa', (req, res) =>{
   res.render('mapa')
 });

app.get('/inicio', (req, res) =>{ 
res.render('inicio')
    res.send('<h1>Packtex<h1/>');

 });

  app.get('/registro', (req, res) =>{
    res.render('registro1')
  });

  app.post('/registro', (req, res) =>{
    const cliente = new Client();
    cliente.connect()
      .then(() => {
     
          const sqlUsuario = 'INSERT INTO usuario (nombre, apellido, fecha_de_nacimiento, correo, clave ) VALUES($1, $2, $3, $4, $5);'
        const parametrosUsuario = [req.body.nombre, req.body.apellido, req.body.fecha_de_nacimiento, req.body.correo, req.body.clave]
        var resultado = {
          usuario:cliente.query(sqlUsuario, parametrosUsuario)
        }
        return resultado
      })
      .then((resultado) => {
        console.log('Resultado usuario: ', resultado.usuario);
        
        res.redirect('/login')
      }).catch((err) => {
      
        res.send('Ocurrio un error registrando el usuario');
      });
  });

  app.get('/login', (req, res) =>{
    res.render('login1')
  });

  app.post('/login', (req, res) =>{
      console.log('req.body.correo', req.body.correo);
      const cliente = new Client();
      cliente.connect()
        .then(() => {
          const sql = 'SELECT * FROM usuario WHERE correo = $1;'
          const parametros = [req.body.correo]
         
          return cliente.query(sql, parametros);

        })
        .then((resultado) => {
          console.log(resultado.rows[0]);
          if (req.body.clave === resultado.rows[0].clave){
            var usuario = {
              correo: resultado.rows[0].correo,
            };
            console.log(usuario);
            res.redirect('/principal')
               
              
          } else {
            res.redirect('/login')
          }
        }).catch((err) => {
          console.log('err: ', err);
          res.redirect('/login')
        });
    });




app.listen(port, () =>{ 
  console.log(`Servidor funcionando en el puerto: ${port}`);
});
