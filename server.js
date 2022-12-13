const express = require('express');
const path = require('path');
const PORT = 3001;
const notes = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const app = express();

//middleware
app.use(express.json());

// GET Route for notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// GET Route for index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

// GET notes from db
app.get('/api/notes', (req, res) => {
    return res.status(200).json(notes);
});

//post request to add a note
app.post('api/notes', (req, res) => {
    //log request
    console.log(`${req.method} was received to add a note`);
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            noteId: uuidv4(),
        };

        //reads what's in db.json and adds new note to file    
        fs.readFile('./db/db.json', 'utf-8', (error, data) => {
            if (error) {
                return res.status(500).send("There has been an error.");
            } else {
                const parsedNotes = JSON.parse(data);
                parsedNotes.push(newNote);
            }
        })

        //write new note to db.json
        fs.writeFile(`./db/db.json`, JSON.stringify(parsedNotes, null, 2), (err) => {
            if (error) {
                return res.status(500).send("There has been an error.");
            } else {
                const response = {
                    status: 'success',
                    body: newNote,
                }
            }
        })
        console.log(response);
    res.status(201).json(response);
    } else {
        res.status(500).json('Error in creating note');
    }
}
)

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);