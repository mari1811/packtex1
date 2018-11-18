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

app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: false}));

// app.get('/inicio', (req, res) =>{ // '/' es la direccion principal de la pagina
//   // res.render('inicio')
//   res.send('<h1>Packtex<h1/>');// al recibir un request (conexion) se envia como respueta "CandyUCAB"
//   ////console.log('Se envio respuesta');
// });

  app.get('/registro', (req, res) =>{
    res.render('registro1')
  });

  app.post('/registro', (req, res) =>{
    const cliente = new Client();
    cliente.connect()
      .then(() => {
        ////console.log('conectado a la base de datos');
        // hacer querys
        const sqlUsuario = 'INSERT INTO usuario (nombre, apellido, correo, clave ) VALUES($1, $2, $3, $4 );'
        const parametrosUsuario = [req.body.nombre, req.body.apellido, req.body.correo, req.body.clave]
        var resultado = {
          usuario:cliente.query(sqlUsuario, parametrosUsuario)
        }
        return resultado
      })
      .then((resultado) => {
        console.log('Resultado usuario: ', resultado.usuario);
        ////console.log('Resultado cliente: ', resultado.cliente);
        res.redirect('/login')
      }).catch((err) => {
        //console.log('err: ', err);
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
          ////console.log('hizo el query');
          return cliente.query(sql, parametros);

        })
        .then((resultado) => {
          console.log(resultado.rows[0]);
          if (req.body.clave === resultado.rows[0].clave){
            var usuario = {
              correo: resultado.rows[0].correo,
            };
            console.log(usuario);
            res.redirect('/inicio')
                //Token
                    // var token = jwt.sign(usuario, 'candyucab',{expiresIn: 60*60});
                    // const cliente = new Client();
                    // cliente.connect()
                    // .then(() => {
                    //   // ////console.log(req.body.username);
                    //    return cliente.query('UPDATE usuario SET token = $1 WHERE username = $2;',[token, req.body.username]);
                    // })
                    // .then(resultado => {
                    //   // ////console.log(resultado);
                    //   res.redirect('/tienda')
                    // })
                    // .catch((err) => {
                    //   return err;
                    // })
          } else {
            res.send('contraña incorrecta')
          }
        }).catch((err) => {
          console.log('err: ', err);
          res.send('Ocurrio un error');
        });
    });

// // USUARIOS

//   });
//   app.get('/no_autorizado', (req,res) =>{
//     res.render('no_autorizado')
//   })
//   app.post('/usuario/login', (req, res) =>{
//     sess = req.session; // declarando que sess ser;a la variable de la sesion
//     sess.username = req.body.username; // guardando el nombre de usuario en la variable username de la session
//     //////console.log(req.body.username, req.body.contrasena, sess.username);
//     const cliente = new Client();
//     cliente.connect()
//       .then(() => {
//         ////console.log('conectado a la base de datos');
//         // hacer querys
//         const sql = 'SELECT * FROM usuario WHERE username = $1;'
//         const parametros = [req.body.username]
//         ////console.log('hizo el query');
//         return cliente.query(sql, parametros);
//
//       })
//       .then((resultado) => {
//         // ////console.log('resultado.row[0]: ', resultado.rows[0]);
//         if (req.body.contrasena === resultado.rows[0].contrasena){
//           var usuario = {
//             username: resultado.rows[0].username,
//             id: resultado.rows[0].idUsuario,
//           };
//           sess.sIdUsuario = resultado.rows[0].idUsuario; //guardando el id del usuario en la variable sIdUduario de la session
//           sess.sNatural = resultado.rows[0].fkClienteNatural;
//           sess.sJuridico = resultado.rows[0].fkClienteJuridico;
//           //console.log('natural:',sess.sNatural );
//           //console.log('juridico:',sess.sJuridico);
//
//           sess.sIdEmpleado = resultado.rows[0].fkEmpleado;
//           //console.log(sess);
//           var token = jwt.sign(usuario, 'candyucab',{expiresIn: 60*60});
//           // ////console.log(token);
//           // var token = null;
//           const cliente = new Client();
//           cliente.connect()
//           .then(() => {
//             // ////console.log(req.body.username);
//              return cliente.query('UPDATE usuario SET token = $1 WHERE username = $2;',[token, req.body.username]);
//           })
//           .then(resultado => {
//             // ////console.log(resultado);
//             res.redirect('/tienda')
//           })
//           .catch((err) => {
//             return err;
//         })
//         } else {
//           res.send('contraña incorrecta')
//         }
//       }).catch((err) => {
//         //console.log('err: ', err);
//         res.send('Ocurrio un error');
//       });
//   });
//
//   app.get('/usuario/lista',autenticar,empleado,rol([10,9]), (req, res) =>{
//     const cliente = new Client();
//     cliente.connect()
//       .then(() => {
//           //////console.log('conectado a la base de datos');
//           // hacer querys
//           const sql = 'SELECT * FROM usuario'
//           return cliente.query(sql)
//       })
//       .then((resultado) => {
//         ////console.log('resultado: ', resultado);
//         res.render('lista-usuario', {
//           usuario: resultado.rows
//         });
//       }).catch((err) => {
//         //console.log('err: ', err);
//         res.redirect('/ocurrido_error')
//       });
//     // res.render('lista-producto');
//   });
//
//
//   app.get('/usuario/editar/:idUsuario', autenticar,empleado,rol([10,9]),(req,res) => {
//
//     const cliente = new Client();
//     cliente.connect()
//       .then(() => {
//         const sql = 'SELECT * FROM usuario WHERE id_usuario = $1;'
//         const parametros = [req.params.idUsuario];
//         return cliente.query(sql,parametros);
//       })
//       .then((resultado) => {
//
//         if (resultado.rowCount === 0) {
//           res.redirect('/usuario/lista')
//           return ;
//         }
//
//         ////console.log('resultados: ', resultado);
//         res.render('editar-usuario', {
//           usuario: resultado.rows[0]
//         })
//       })
//       .catch((err) => {
//         //console.log('err: ', err);
//         res.redirect('/usuario/lista')
//       })
//   });
//
//   app.post('/usuario/editar/:idUsuario',autenticar,empleado,rol([10,9]), (req, res) =>{
//
//     const cliente = new Client();
//     cliente.connect()
//       .then(() => {
//         const sql = 'UPDATE usuario SET username = $1, contrasena = $2 WHERE id_usuario = $3;'
//         const parametros = [req.body.username, req.body.contrasena, Number(req.params.idUsuario)];
//
//         return cliente.query(sql,parametros);
//       })
//       .then((resultado) => {
//         //console.log('resultado actualizado: ', resultado);
//         res.redirect('lista-usuario');
//       })
//       .catch((err) => {
//         //console.log('err: ', err);
//         res.redirect('lista-usuario')
//       });
//   })
//
//   app.post('/usuario/eliminar/:idUsuario',autenticar,empleado,rol([10,9]), (req, res) => {
//     ////console.log('eliminando id: ', req.params.idUsuario);
//
//     const cliente = new Client();
//     cliente.connect()
//       .then(() => {
//           ////console.log('conectado a la base de datos');
//           // hacer querys
//           const sql = 'DELETE FROM usuario WHERE id_usuario = $1;'
//           const parametros = [req.params.idUsuario]
//           return cliente.query(sql, parametros)
//       })
//       .then((resultado) => {
//         ////console.log('resultado de eliminar: ', resultado);
//         res.redirect('/usuario/lista')
//       }).catch((err) => {
//         //console.log('err: ', err);
//         res.redirect('/usuario/lista');
//       });
//
//   });
//   app.get('/usuario/registro/cliente_natural', (req, res) =>{
//     res.render('registro-usuario-cliente-natural')
//   });
//
//   app.get('/usuario/registro/cliente_juridico', (req, res) =>{
//     res.render('registro-usuario-cliente-juridico')
//   });
//
//   app.post('/usuario/registro/cliente_natural', (req, res) =>{
//     const cliente = new Client();
//     cliente.connect()
//       .then(() => {
//         ////console.log('conectado a la base de datos');
//         // hacer querys
//         const sqlUsuario = 'INSERT INTO usuario (username, contrasena, fk_cliente_natural) VALUES($1, $2, (SELECT id_cliente_natural FROM cliente_natural WHERE cedula = $3) );'
//         const parametrosUsuario = [req.body.username, req.body.contrasena, req.body.cedula]
//         const sqlCliente = 'INSERT INTO cliente_natural (rif, correo, cedula, nombre, apellido) VALUES($1, $2, $3, $4, $5);'
//         const parametrosCliente = [req.body.rif, req.body.correo, req.body.cedula, req.body.nombre, req.body.apellido]
//         var resultado = {
//           cliente:cliente.query(sqlCliente,parametrosCliente),
//           usuario:cliente.query(sqlUsuario, parametrosUsuario)
//         }
//         return resultado
//       })
//       .then((resultado) => {
//         ////console.log('Resultado usuario: ', resultado.usuario);
//         ////console.log('Resultado cliente: ', resultado.cliente);
//         res.redirect('/inicio')
//       }).catch((err) => {
//         //console.log('err: ', err);
//         res.send('Ocurrio un error registrando el cliente');
//       });
//   });
//
//   app.post('/usuario/registro/cliente_juridico', (req, res) =>{
//     const cliente = new Client();
//     cliente.connect()
//       .then(() => {
//         ////console.log('conectado a la base de datos');
//         // hacer querys
//         const sqlUsuario = 'INSERT INTO usuario (username, contrasena, fk_cliente_juridico) VALUES($1, $2, (SELECT id_cliente_juridico FROM cliente_juridico WHERE rif = $3) );'
//         const parametrosUsuario = [req.body.username, req.body.contrasena, req.body.rif]
//         const sqlCliente = 'INSERT INTO cliente_juridico (rif, correo, capital_disponible, pagina_web, den_comercial, razon_social) VALUES($1, $2, $3, $4, $5, $6);'
//         const parametrosCliente = [req.body.rif, req.body.correo, req.body.capital_disponible, req.body.pagina_web, req.body.denominacion_comercial, req.body.razon_social]
//         var resultado = {
//           cliente:cliente.query(sqlCliente,parametrosCliente),
//           usuario:cliente.query(sqlUsuario, parametrosUsuario)
//         }
//         return resultado
//       })
//       .then((resultado) => {
//         ////console.log('Resultado usuario: ', resultado.usuario);
//         ////console.log('Resultado cliente: ', resultado.cliente);
//         res.redirect('/inicio')
//       }).catch((err) => {
//         //console.log('err: ', err);
//         res.send('Ocurrio un error registrando el cliente');
//       });
//   });
//
//
//   //AQUIIII
//   app.get('/registro/cliente_natural', (req, res) =>{
//     res.render('registro-cliente-natural')
//   });
//
//   app.get('/registro/cliente_juridico', (req, res) =>{
//     res.render('registro-cliente-juridico')
//   });
//
//   app.post('/registro/cliente_natural', (req, res) =>{
//     const cliente = new Client();
//     cliente.connect()
//       .then(() => {
//          //console.log('requsername ', req.session.username);
//         const sqlCliente = 'SELECT cn.id_cliente_natural, u.fk_tienda FROM cliente_natural cn, usuario u WHERE cn.cedula= $1, u.username=$2;'
//         const parametrosCliente = [req.body.cedula, req.session.username]
//         return cliente.query(sqlCliente,parametrosCliente)
//
//         //hacer consulta de si la cedula existe en la base de datos
//         //si existe entonces asignar a req.session.sNatural
//         //si no existe  entonces insert
//
//       })
//       .then((resultado) => {
//         //console.log('Resultado: ', resultado);
//         var aux = Number(resultado.rowCount);
//         if (aux!=0){var aux2= resultado.rows[0].idClienteNatural;}
//         //req.session.sNatural= resultado.cli.
//         ////console.log('Resultado cliente: ', resultado.cliente);
//         const cliente = new Client();
//         cliente.connect()
//         .then(() => {
//           if (aux == 0){
//             const sqlCliente = 'INSERT INTO cliente_natural (rif, correo, cedula, nombre, apellido) VALUES($1, $2, $3, $4, $5);'
//             const parametrosCliente = [req.body.rif, req.body.correo, req.body.cedula, req.body.nombre, req.body.apellido]
//             const sqlConsulta= 'SELECT MAX(id_cliente_natural) FROM cliente_natural;'
//
//             return cliente.query(sqlCliente,parametrosCliente), cliente.query(sqlConsulta)
//           }else{
//             req.session.sNatural = aux2
//           }
//         })
//         .then((resultado) => {
//           //console.log('Resultado cli: ', resultado);
//           //console.log('req.session.sNatural', req.session.sNatural);
//           req.session.sNatural= resultado.rows[0].max //guardando el id del cliente para las compras que haga
//           //console.log('req.session.sNatural', req.session.sNatural);
//         }).catch((err) => {
//           //console.log('err: ', err);
//           res.send('Ocurrio un error registrando el cliente');
//         });
//
//
//
//         res.redirect('/tienda/producto/:idTienda')
//       }).catch((err) => {
//         //console.log('err: ', err);
//         res.send('Ocurrio un error registrando el cliente afuera');
//       });
//   });
//
//   app.post('/registro/cliente_juridico', (req, res) =>{
//     const cliente = new Client();
//     cliente.connect()
//       .then(() => {
//         ////console.log('conectado a la base de datos');
//         // hacer querys
//         const sqlUsuario = 'INSERT INTO usuario (username, contrasena, fk_cliente_juridico) VALUES($1, $2, (SELECT id_cliente_juridico FROM cliente_juridico WHERE rif = $3) );'
//         const parametrosUsuario = [req.body.username, req.body.contrasena, req.body.rif]
//         const sqlCliente = 'INSERT INTO cliente_juridico (rif, correo, capital_disponible, pagina_web, den_comercial, razon_social) VALUES($1, $2, $3, $4, $5, $6);'
//         const parametrosCliente = [req.body.rif, req.body.correo, req.body.capital_disponible, req.body.pagina_web, req.body.denominacion_comercial, req.body.razon_social]
//         var resultado = {
//           cliente:cliente.query(sqlCliente,parametrosCliente),
//           usuario:cliente.query(sqlUsuario, parametrosUsuario)
//         }
//         return resultado
//       })
//       .then((resultado) => {
//         ////console.log('Resultado usuario: ', resultado.usuario);
//         ////console.log('Resultado cliente: ', resultado.cliente);
//         res.redirect('/inicio')
//       }).catch((err) => {
//         //console.log('err: ', err);
//         res.send('Ocurrio un error registrando el cliente');
//       });
//   });

app.listen(port, () =>{ // para que express se mantenga escuchando peticiones
  console.log(`Servidor funcionando en el puerto: ${port}`);
});
