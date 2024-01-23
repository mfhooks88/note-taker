const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  // Read the db.json file and return all saved notes
  const notes = JSON.parse(fs.readFileSync('db.json', 'utf8'));
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  // Receive a new note and save it to the db.json file
  const newNote = req.body;
  const notes = JSON.parse(fs.readFileSync('db.json', 'utf8'));

  // Assign a unique id to the new note
  newNote.id = Date.now().toString();

  // Add the new note to the array of notes
  notes.push(newNote);

  // Write the updated notes array back to the db.json file
  fs.writeFileSync('db.json', JSON.stringify(notes));

  // Return the new note to the client
  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  let notes = JSON.parse(fs.readFileSync('db.json', 'utf8'));

  // Find the index of the note with the given id
  const noteIndex = notes.findIndex(note => note.id === noteId);

  if (noteIndex !== -1) {
    // Remove the note from the array
    notes.splice(noteIndex, 1);

    // Write the updated notes array back to the db.json file
    fs.writeFileSync('db.json', JSON.stringify(notes));

    res.json({ success: true, message: 'Note deleted successfully' });
  } else {
    res.status(404).json({ success: false, message: 'Note not found' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
