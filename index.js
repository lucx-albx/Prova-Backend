const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
const port = 3000;

// Inizializza Firebase
const serviceAccount = require('./prova-db-f5dae-firebase-adminsdk-mnhjp-1e79112e04.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://prova-db-f5dae-default-rtdb.firebaseio.com'
});
const database = admin.database();

// Abilita l'accesso a tutti gli origini tramite il middleware CORS
app.use(cors());

// Definisci la route per la richiesta GET dal frontend
app.get('/', (req, res) => {
  // Effettua la query al database di Firebase
  database.ref('/').once('value')
    .then((snapshot) => {
      const data = snapshot.val();
      // Restituisci i dati come JSON al frontend
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send('Errore del server');
    });
});

// Avvia il server
app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});
