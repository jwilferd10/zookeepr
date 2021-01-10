// The require() statements will read the index.js files in each of the directories indicated.
// With require(), the index.js file will be the default file read if no other file is provided, which is the coding method we're using here.
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');
const fs = require('fs');
const path = require('path');
const { animals } = require('./data/animals')
const express = require('express');
const PORT = process.env.PORT || 3001; //Applications served over Heroku as well as most hosts must run on port 80. If the host uses HTTPS, then the port would be set to 443.
const app = express();

// Middleware that instructs the server to make certain files readily available and to not gate it behind a server endpoint.
// Provide a file path to a location in our application and instruct the server to make these files static resources.
app.use(express.static('public'));

// Parse incoming string or array data, takes incoming POST data and converts it to key/value pairings that can be accessed in the req.body object.
app.use(express.urlencoded({ extended: true })); // Informs our server that there may be sub-array data nested in it as well
// Parse incoming JSON data
app.use(express.json());

// This is our way of telling the server that any time a client navigates to <ourhost>/api, the app will use the router we set up in apiRoutes. 
// If / is the endpoint, then the router will serve back our HTML routes.
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// This GET route has just one job to do, and that is to respond with an HTML page to display in the browser.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
})

// This route will take us to /animals
app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

// This should always be last
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});