const functions = require('firebase-functions');
const admin = require('firebase-admin');
const validateSignUp = require('../validators/validators');
admin.initializeApp();

const app = require('express')();
const db = admin.firestore();

const firebaseConfig = {
    apiKey: "AIzaSyCMz9fjWzb5JtXQyQdDpZymcHkmFm3-FLk",
    authDomain: "essential-cairn-252206.firebaseapp.com",
    databaseURL: "https://essential-cairn-252206.firebaseio.com",
    projectId: "essential-cairn-252206",
    storageBucket: "essential-cairn-252206.appspot.com",
    messagingSenderId: "818429283446",
    appId: "1:818429283446:web:b58c4157f9cd7d1576e357"
}

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

app.get('/orders', (request, response) => {


    db
    .collection('orders')
    .get()
    .then(data => {
        let orders = [];
        data.forEach(doc => {
            orders.push({
                orderId: doc.id,
                username: doc.data().username,
                adress: doc.data().telephone,
                createdAt: doc.data().createdAt
            });
        })
            
        return response.json(orders);
    })
    .catch(error => console.error(error))
});


app.post('/order', (request, response) => {
    const newOrder = {
        adress: request.body.adress,
        /** 
         * TODO: Save geolocation of user
         * createdAt: admin.firestore.Timestamp.fromDate(new Date()),
         *  */
        telephone: request.body.telephone,
        username: request.body.username, 
        createdAt: new Date().toISOString()
    };

    db
    .collection('orders')
    .add(newOrder)
    .then(doc => {
        response.json({
            message: `document ${doc.id} created succesfully`
        });
    })
    .catch(error => {
        response.status(500).json({ error: `something went wrong` });
        console.error(error);
    });
});



app.post('/signup', (request, response) => {
    const newUser = {
        email: request.body.email,
        password: request.body.password,
        confirmPassword: request.body.confirmPassword,     
        username: request.body.username
    }

    const { valid, errors } = validateSignUp(newUser);

    if (!valid) return response.status(400).json(errors);
    
    let token, userId;
    db.doc(`/users/${newUser.email}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                return response.status(400).json({ email: 'this email is already taken' });
            } else {
                return firebase
                        .auth()
                        .createUserWithEmailAndPassword(newUser.email, newUser.password);
            }
        })
        .then((data) => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then((idToken) => {
            token = idToken
            const userCreditials = {
                username: newUser.username,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                userId
            }
            return db.doc(`/users/${newUser.username}`).set(userCreditials);
        })
        .then(() => {
            return response.status(201).json({ token });
        })
        .catch(error => {
            console.error(error)
            if (error.code === 'auth/email-already-in-use') {
                response.status(400).json({ email: 'Email already in use' });
            } else {
                return response.status(500).json({ general: 'Somethnig went wrong, please try again' });
            }
        })
});

app.login('/login', (request, responose) => {
    const user = {
        email: request.body.email,
        password: request.body.password
    }
    firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((data) => {
            return data.getIdToken()
        })
        .then((token) => {
            return token.json()
        })
        .catch((error) => {
            console.error(error);
            return responose.status(403).json({ general: "Wrong credentionals, please try again" });
        });

});

exports.api = functions.region('europe-west1').https.onRequest(app);
