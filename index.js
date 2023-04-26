const express = require('express'); 
const admin = require('firebase-admin');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const serviceAccount = require('./prova-db-f5dae-firebase-adminsdk-mnhjp-1e79112e04.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL
});
const database = admin.database();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// app.get('/', (req, res) => {
//   // Effettua la query al database di Firebase
//   database.ref('/').once('value')
//     .then((snapshot) => {
//       const data = snapshot.val();
//       // Restituisci i dati come JSON al frontend
//       res.json(data);
//     })
//     .catch((error) => {
//       console.log(error);
//       res.status(500).send('Errore del server');
//     });
// });

//login semplice
app.post('/login', (req, res) => {
  let can_enter = false
  let posizione_utente = null
  const {email, password} = req.body

  database.ref('/users').once('value')
  .then((snapshot) => {
    const data = snapshot.val();

    data.map((elem,i)=>{

      if (elem.email == email && elem.password == password){
        can_enter = true
        posizione_utente = i
      }

    })

    if (can_enter == true){
      res.json({ posizione: posizione_utente });
    } else {
      res.status(401).json({ message: 'Credenziali non valide' });
    }

  })
  .catch((error) => {
    console.log(error);
    res.status(500).send('Errore del server');
  });

})

//registarti
app.post('/register', (req, res) => {
  const { email, password } = req.body;

  database.ref('users').push({
    email,
    password
  })
  .then(() => {
    res.status(200).json({ message: 'Utente registrato con successo' });
  })
  .catch((error) => {
    console.log(error);
    res.status(500).send('Errore del server');
  });
});

app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});
