const express = require('express');
const fs = require('fs');
const app = express();

let votes = JSON.parse(fs.readFileSync('votes.json'));

app.use(express.static('public'));
app.use(express.json());

app.get('/election', (req, res) => { 
  res.json([{ id: 1, name: "Class President" }]);
});

app.post('/vote', (req, res) => {
  votes.push(req.body); 
  fs.writeFileSync('votes.json', JSON.stringify(votes));
  res.send("Vote submitted (maybe)");
});

app.get('/admin/results', (req, res) => {
  res.json(votes); 
});

app.listen(3000, () => console.log("Server running (probably)"));