
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const express = require('express');
const app = express();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

app.get('/orders', (request, response) => {
    admin
        .firestore()
        .collection('orders')
        .get()
        .then(data => {
            let orders = [];
            data.forEach(doc => {
                orders.push(doc.data());
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
        username: request.body.username        
    };

    admin
        .firestore()
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



exports.api = functions.https.onRequest(app);
