const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Serve static files from public directory
app.use('/public', express.static('public'));

app.get('/fonts', (req, res) => {
    const fontsFolder = path.join(__dirname, 'public', 'fonts');
    fs.readdir(fontsFolder, (err, files) => {
        if (err) return res.status(500).send('Unable to read font files');
        res.json(files);
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
