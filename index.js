document.addEventListener('keydown', function (event) {
  if (event.key === 'Enter'){
      login();
  }
});

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDuIxogdpkOWG0aGjrhRRkURnXaa7A2g1A",
    authDomain: "constraints-acs.firebaseapp.com",
    databaseURL: "https://constraints-acs-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "constraints-acs",
    storageBucket: "constraints-acs.appspot.com",
    messagingSenderId: "22930316111",
    appId: "1:22930316111:web:0d32e26cc7fe2d7fef033a",
    measurementId: "G-1CPJYVLCFF"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Initialize variables
  const auth = firebase.auth()
  const database = firebase.database()
  
  
  // Set up our register function
  function register () {
    // Get all our input fields
    email = document.getElementById('email').value
    password = document.getElementById('password').value
    full_name = document.getElementById('full_name').value
  
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
      alert('Email or Password is wrong!')
      return
      // Don't continue running the code
    }
    if (validate_field(full_name) == false) {
      alert('Full name is wrong!')
      return
    }
   
    // Move on with Auth
    auth.createUserWithEmailAndPassword(email, password)
    .then(function() {
      // Declare user variable
      var user = auth.currentUser
  
      // Add this user to Firebase Database
      var database_ref = database.ref()
  
      // Create User data
      var user_data = {
        email : email,
        full_name : full_name,
        last_login : Date.now()
      }
  
      // Push to Firebase Database
      database_ref.child('users/' + user.uid).set(user_data)
  
      // DOne
      alert('User Created!')
    })
    .catch(function(error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code
      var error_message = error.message
  
      alert(error_message)
    })
  }

  function hideLogin(){
    var LoginMenu = document.getElementById("form_container");
    var InputMenu = document.getElementById("input_containter");

    LoginMenu.style.display = "none";
    InputMenu.style.display = "flex";
  }
  
  // Set up our login function
  function login () {
    // Get all our input fields
    email = document.getElementById('email').value
    password = document.getElementById('password').value
  
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
      alert('Email or Password is wrong!')
      return
      // Don't continue running the code
    }
  
    auth.signInWithEmailAndPassword(email, password)
    .then(function() {
      // Declare user variable
      var user = auth.currentUser
  
      // Add this user to Firebase Database
      var database_ref = database.ref()
  
      // Create User data
      var user_data = {
        last_login : Date.now()
      }
  
      // Push to Firebase Database
      database_ref.child('users/' + user.uid).update(user_data)
  
      // DOne
      alert('User Logged In!')
      hideLogin();
  
    })
    .catch(function(error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code
      var error_message = error.message
  
      alert(error_message)
    })
  }
  
  
  
  
  // Validate Functions
  function validate_email(email) {
    expression = /^[^@]+@\w+(\.\w+)+\w$/
    if (expression.test(email) == true) {
      // Email is good
      return true
    } else {
      // Email is not good
      return false
    }
  }
  
  function validate_password(password) {
    // Firebase only accepts lengths greater than 6
    if (password < 6) {
      return false
    } else {
      return true
    }
  }
  
  function validate_field(field) {
    if (field == null) {
      return false
    }
  
    if (field.length <= 0) {
      return false
    } else {
      return true
    }
  }


  // Add entry to the database
function addEntry() {
    var user = auth.currentUser;
    if (user) {
        var honnan = document.getElementById('honnan').value;
        var hova = document.getElementById('hova').value;

        var database_ref = database.ref('constraints/' + user.uid);
        var newEntry = {
            honnan: honnan,
            hova: hova
        };

        database_ref.push(newEntry)
        .then(() => alert('Entry added!'))
        .catch(error => alert('Error: ' + error.message));
    } else {
        alert('You must be logged in to add an entry.');
    }
}

// Update entry in the database (assuming you know the entry ID)
function updateEntry() {
    var user = auth.currentUser;
    if (user) {
        var entryId = prompt("Enter the entry ID to update:");
        var honnan = document.getElementById('honnan').value;
        var hova = document.getElementById('hova').value;

        var database_ref = database.ref('constraints/' + user.uid + '/' + entryId);
        database_ref.update({
            honnan: honnan,
            hova: hova
        })
        .then(() => alert('Entry updated!'))
        .catch(error => alert('Error: ' + error.message));
    } else {
        alert('You must be logged in to update an entry.');
    }
}

// Delete entry from the database
function deleteEntry() {
    var user = auth.currentUser;
    if (user) {
        var entryId = prompt("Enter the entry ID to delete:");

        var database_ref = database.ref('constraints/' + user.uid + '/' + entryId);
        database_ref.remove()
        .then(() => alert('Entry deleted!'))
        .catch(error => alert('Error: ' + error.message));
    } else {
        alert('You must be logged in to delete an entry.');
    }
}

//Read entry from the database
function readEntry() {
    var user = auth.currentUser;
    if (user) {
        var entryId = prompt("Enter the entry ID to read:");

        var database_ref = database.ref('constraints/' + user.uid + '/' + entryId);
        database_ref.once('value')
            .then((snapshot) => {
                if (snapshot.exists()) {
                    var data = snapshot.val();
                    document.getElementById('honnan').value = data.honnan; // Set the "honnan" field
                    document.getElementById('hova').value = data.hova; // Set the "hova" field
                    alert('Entry retrieved!');
                } else {
                    alert('No entry found with this ID.');
                }
            })
            .catch((error) => {
                alert('Error: ' + error.message);
            });
    } else {
        alert('You must be logged in to read an entry.');
    }
}

// Log out the user on page refresh
window.addEventListener('beforeunload', function() {
    if (auth.currentUser) {
        auth.signOut().then(() => {
            console.log('User signed out on page refresh.');
        }).catch((error) => {
            console.error('Error signing out:', error);
        });
    }
});