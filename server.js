const fs = require("fs");
const express = require("express");
const path = require("path");

const app = express();
// Sets port for listening and let heroku decide on port, if not, use port 3005
const PORT = process.env.PORT || 3005;

//serve images, CSS files, and JavaScript files in a directory named public
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.post("/api/notes", (req, res) => {
    let newNote = req.body;
    let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let notelength = (noteList.length).toString();

    
    newNote.id = notelength;

    noteList.push(newNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
    res.json(noteList);
})

//delete note according to their tagged id.
app.delete("/api/notes/:id", (req, res) => {
    let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteId = (req.params.id).toString();


    noteList = noteList.filter(selected =>{
        return selected.id != noteId;
    })

   fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
    res.json(noteList);
});


app.listen(PORT, () => console.log("Server listening on port " + PORT));