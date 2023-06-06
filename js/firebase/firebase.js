const firebaseConfig = {
  apiKey: "AIzaSyDb8ds4Pj01iJEXeCFN469ZjEtUDFDkcoY",
  authDomain: "crud-fatec-alan.firebaseapp.com",
  databaseURL: "https://crud-fatec-alan-default-rtdb.firebaseio.com",
  projectId: "crud-fatec-alan",
  storageBucket: "crud-fatec-alan.appspot.com",
  messagingSenderId: "94407929582",
  appId: "1:94407929582:web:5c5919a5981c319d5d0dff",
  measurementId: "G-GHE3MWXKBH"
};
  //inicializando o Firebase
  firebase.initializeApp(firebaseConfig)
  //efetuando a ligação com o database
  const database = firebase.database()