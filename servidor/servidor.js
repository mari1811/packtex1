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

//tercerovar express = require('express'),
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

var sesion;


app.get('/', (req, res) =>{
  res.redirect('/login')

});
    app.get('/principal', (req, res) =>{
      res.render('inicio1')
    });

app.get('/orden', (req, res) =>{
  res.render('orden')
});

 app.get('/mapa', (req, res) =>{
   res.render('mapa')
 });

app.get('/inicio', (req, res) =>{
res.render('inicio')
    res.redirect('/login');

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
    sesion = req.session;
    sesion.username = req.body.correo;

      console.log('req.body.correo', req.body.correo);
      const cliente = new Client();
      cliente.connect()
        .then(() => {
          const sql = 'SELECT * FROM usuario WHERE correo = $1;'
          const parametros = [req.body.correo]

          return cliente.query(sql, parametros);

        })
        .then((resultado) => {
        //  console.log(resultado.rows[0]);
          console.log(resultado);
          if (req.body.clave === resultado.rows[0].clave){
            var usuario = {
              correo: resultado.rows[0].correo,
              id: resultado.rows[0].idUsuario
            };

          sesion.sIdUsuario = resultado.rows[0].idUsuario;

            res.redirect('/principal')


          } else {
            res.redirect('/login')
          }
        }).catch((err) => {
          console.log('err: ', err);
          res.redirect('/login')
        });
    });

    app.post('/orden', (req, res) =>{
      const cliente = new Client();
      cliente.connect()
        .then(() => {

          const sqlDireccion = 'INSERT INTO direccion_salida (id_usuario , direccion_salida ) VALUES($1, $2) RETURNING *;'
          const parametrosDireccion = [sesion.sIdUsuario, req.body.direccion_salida]
          // var resultadoDireccion = {
          //   direccion:cliente.query(sqlDireccion, parametrosDireccion)
          // }
          return cliente.query(sqlDireccion, parametrosDireccion)
        })
        .then((resultadoDireccion) => {
          console.log('Resultado direccion: ', resultadoDireccion.rows[0]);
                            const cliente = new Client();
                            cliente.connect()
                              .then(() => {

                                const sqlPaquete = 'INSERT INTO paquete (peso_paquete ) VALUES($1) RETURNING *;'
                                const parametrosPaquete = [ req.body.peso_paquete]
                                // var resultadoPaquete = {
                                //   paquete:cliente.query(sqlPaquete, parametrosPaquete)
                                // }
                                return cliente.query(sqlPaquete, parametrosPaquete)
                              })
                              .then((resultadoPaquete) => {
                                console.log('Resultado paquete: ', resultadoPaquete.rows[0]);
                                                      const cliente = new Client();
                                                      cliente.connect()
                                                        .then(() => {

                                                          const sqlOrden = 'INSERT INTO orden (id_paquete, id_direccion_de_salida, direccion_entrega, descripcion_direccion_entrega, nombre_persona_entrega, apellido_persona_entrega, id_usuario ) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *;'
                                                          const parametrosOrden = [ resultadoPaquete.rows[0].idPaquete, resultadoDireccion.rows[0].idDireccionDeSalida, req.body.direccion_entrega, req.body.descripcion_direccion_entrega, req.body.nombre_persona_entrega, req.body.apellido_persona_entrega, sesion.sIdUsuario]
                                                          // var resultadoOrden = {
                                                          //   orden:cliente.query(sqlOrden, parametrosOrden)
                                                          // }
                                                          return cliente.query(sqlOrden, parametrosOrden)
                                                        })
                                                        .then((resultadoOrden) => {
                                                          console.log('Resultado de la orden: ', resultadoOrden.rows[0]);


                                                        }).catch((err) => {
                                                          console.log(err);
                                                          res.send('Error Registrando orden');
                                                        });

                              }).catch((err) => {
                                console.log(err);
                                res.send('Error Registrando paquete');
                              });
          res.redirect('/principal')
        }).catch((err) => {
          console.log(err);
          res.send('Ocurrio un error registrando direccion salida');
        });
    });



app.listen(port, () =>{
  console.log(`Servidor funcionando en el puerto: ${port}`);
});

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
