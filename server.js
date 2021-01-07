const fs = require('fs');
const path = require('path');
const {
    animals
} = require('./data/animals')
const express = require('express');
const PORT = process.env.PORT || 3001; //Applications served over Heroku as well as most hosts must run on port 80. If the host uses HTTPS, then the port would be set to 443.
const app = express();

// Parse incoming string or array data
// Takes incoming POST data and converts it to key/value pairings that can be accessed in the req.body object.
app.use(express.urlencoded({
    extended: true
})); // Informs our server that there may be sub-array data nested in it as well
// Parse incoming JSON data
app.use(express.json());

// This function will take in req.query as an argument 
// And filter through the animals accordingly, returning the new filtered array. 
function filterbyQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        // Save personalityTraits as a dedicated array
        // If personalityTraits is a string, place it into a new array and save
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // Loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array.Remember, it is initially a copy of the animalsArray,
            // but here we're updating it for each trait in the .forEach() loop. For each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain the trait, so at the end we'll have an array of animals that have every one 
            // of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet == query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    // Returns the filtered results:
    return filteredResults;
}

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}


// Accepts the POST route's req.body value and the array we want to add the data to.
// When we POST a new animal, we'll add it to the imported animals array from the animals.json file.
function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
        // We want to write to our animals.json file in the data subdirectory, so we use the method path.join() to join the value of __dirname,
        // Which represents the directory of the file we execute the code in, with the path to the animals.json file.
        path.join(__dirname, './data/animals.json'),
        // Save the JavaScript array data as JSON, use JSON.stringify() to convert it.
        // null and 2, are means of keeping our data formatted.
        // The null argument means we don't want to edit any of our existing data; if we did, we could pass something in there. 
        // The 2 indicates we want to create white space between our values to make it more readable. 
        JSON.stringify({
            animals: animalsArray
        }, null, 2)
    );
    return animal; // return finished code to post route for response
}

// Take our new animal data from req.body and check if each key not only exists, but that it is also the right type of data.
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
}

app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterbyQuery(req.query, results);
    }
    res.json(results);
});

// Param route must come after the other GET route.
// This route should only return a single animal, because the id is unique.
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

app.post('/api/animals', (req, res) => {
    // Take the length property of the animals array and set that as the id for the new data.
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        // response method to relay a message to the client making the request.
        res.status(400).send('The animal is not properly formatted.');
    } else {
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }

    // add animal to json file and animals array in this function
    // const animal = createNewAnimal(req.body, animals);

    // req.body is where our incoming content will be
    // console.log(req.body);

    // res.json(animal);
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});