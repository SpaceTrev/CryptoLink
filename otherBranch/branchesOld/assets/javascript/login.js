var config = {
  apiKey: "AIzaSyD4WpXJE_OjEOIdB9pHDMGofStkUiENuGk",
  authDomain: "cryptoproject-e243e.firebaseapp.com",
  databaseURL: "https://cryptoproject-e243e.firebaseio.com",
  projectId: "cryptoproject-e243e",
  storageBucket: "cryptoproject-e243e.appspot.com",
  messagingSenderId: "754040931090"
};

firebase.initializeApp(config);
const txtEmail = document.getElementById("user");
const txtPassword = document.getElementById("pass");
const btnLogin = document.getElementById("login");
const btnSignUp = document.getElementById('signup');
const btnSignOut = document.getElementById('logout');

btnLogin.addEventListener('click', e => {
  e.preventDefault();
  const email = txtEmail.value;
  const pass = txtPassword.value;
  const auth = firebase.auth();
  const promise = auth.signInWithEmailAndPassword(email, pass);
  promise.catch(e => console.log(e.message));

});
btnSignUp.addEventListener('click', e => {
  e.preventDefault();
  const email = txtEmail.value;
  const pass = txtPassword.value;
  const auth = firebase.auth();
  const promise = auth.createUserWithEmailAndPassword(email, pass);
  promise
    .catch(e => console.log(e.message));
});
btnSignOut.addEventListener('click', e => {
  firebase.auth().signOut();
})
firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    console.log(firebaseUser);
    btnSignOut.classList.remove('invisible');
    window.location = 'index.html';
  } else {
    console.log("not logged in");
  }
});