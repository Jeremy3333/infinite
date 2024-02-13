const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


const writeData = (data, res) => {
    console.log('Received data:', res.body);

    fs.writeFile('public/data.json', JSON.stringify(JSONdata, null, 2), (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error writing to file');
        } else {
            console.log('Data written to file');
            res.status(200).send('Data written to file');
        }
    });
};

app.post('/api/data', (req, res) => {
    // Write the data to a file
    const receivedData = req.body.value;
    JSONdata.element.push(receivedData); // Assuming element is an array within JSONdata
    writeData(JSONdata, res);
});

app.get('/api/data', (req, res) => {
    // Send the data as a response 200 (OK)
    res.status(200).json(JSONdata);
});

app.post('/delete', (req, res) => {
    // Extract the value to delete from the request body
    const receivedValue = req.body.value;

    if (receivedValue < JSONdata.element.length) {
        // If the element is found, delete it
        JSONdata.element.splice(receivedValue, 1);
        writeData(JSONdata, res);
    } else {
        // If the element is not found, send a response with status 404 (Not Found)
        res.status(404).send('Element not found');
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Read initial JSON data when server starts
let JSONdata = { element: [] }; // Initialize JSONdata
fs.readFile('public/data.json', (err, data) => {
    if (err) {
        console.error(err);
    } else {
        JSONdata = JSON.parse(data.toString());
        console.log('Initial JSON data:', JSONdata);
    }
});
