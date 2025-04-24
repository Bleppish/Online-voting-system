const express = require('express');
const fs = require('fs');
const app = express();

let db = {
  elections: [{ id: 1, name: "Class President" }],
  votes: []
};

app.use(express.static('public'));
app.use(express.json());

app.get('/elections', (req, res) => {
  res.json(db.elections); 
});

app.post('/vote', (req, res) => {
  if (!req.body.electionId || !req.body.choice) { 
    return res.status(400).send("Missing data");
  }
  db.votes.push(req.body);
  saveDb();
  res.send("Vote recorded!");
});

app.get('/results', (req, res) => {
  res.json(db.votes); 
});

function saveDb() {
  fs.writeFileSync('votes.db.json', JSON.stringify(db));
}

app.listen(3000, () => console.log("Server started on port 3000"));