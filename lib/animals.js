// dependencies
const fs = require("fs");
const path = require("path");

// This function will take in req.query as an argument 
// And filter through the animals accordingly, returning the new filtered array. 
function filterByQuery(query, animalsArray) {
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
        console.log(personalityTraitsArray);
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
        path.join(__dirname, '../data/animals.json'),
        // Save the JavaScript array data as JSON, use JSON.stringify() to convert it.
        // null and 2, are means of keeping our data formatted.
        // The null argument means we don't want to edit any of our existing data; if we did, we could pass something in there. 
        // The 2 indicates we want to create white space between our values to make it more readable. 
        JSON.stringify({ animals: animalsArray }, null, 2)
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

module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
};