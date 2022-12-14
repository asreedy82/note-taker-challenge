const express = require('express');
const path = require('path');
const PORT = 3001;
const notes = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const app = express();

//middleware
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET Route for notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))

    console.info(`${req.method} request received to get notes`);
});



// GET notes from db
app.get('/api/notes', (req, res) => {
    //res.status(200).json(notes);
    res.json(notes);
});

//post request to add a note
app.post('/api/notes', (req, res) => {
    //log request
    console.log(`${req.method} was received to add a note`);
    console.log(req.body);
    const { title, text } = req.body;
    console.log(title);

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
                //add new note
                parsedNotes.push(newNote);

                //write new note to db.json
                fs.writeFile(`./db/db.json`, JSON.stringify(parsedNotes, null, 2), (err) => {
                    if (error) {
                        return res.status(500).send("There has been an error.");
                    } else {
                        console.info('Successfully added note!')
                    }
                }
                );
            };
        });
        const response = {
            status: 'success',
            body: newNote,
        };
        console.log(response);
        //res.status(201).json(response);
        res.json(notes);
    } else {
        res.status(500).json('Error in creating note');
    }
}
);

/*
//delete a note
app.delete('/api/notes/:id', (req, res) => {
    if (req.params.id) {
        //log request
        console.log(`${req.method} was received to delete a note`);
        const id = req.params.id;
        //reads what's in db.json and write new file without deleted note    
        fs.readFile('./db/db.json', 'utf-8', (error, data) => {
            if (error) {
                return res.status(500).send("There has been an error.");
            } else {
                const parsedNotes = JSON.parse(data);
                //find note
                for (let i = 0; i < notes.length; i++) {
                    const deleteNote = notes[i];
                    if (deleteNote.id === id) {
                        parsedNotes.splice(i, 1);
                        console.log(`removing ${deleteNote}`);
                        return;
                    }
                }

                //write new note to db.json
                fs.writeFile(`./db/db.json`, JSON.stringify(parsedNotes, null, 2), (err) => {
                    if (error) {
                        return res.status(500).send("There has been an error.");
                    } else {
                        console.info('Successfully deleted note!')
                    }
                }
                );
            };
        });
    }
})
*/

// GET Route for index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);