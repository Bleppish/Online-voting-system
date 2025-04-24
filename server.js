const express = require('express');
const { keycloak } = require('./keycloak-config');
const pg = require('pg');

const app = express();
const pool = new pg.Pool({ 
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  database: 'voting_db'
});

app.use(keycloak.middleware());

app.get('/elections', keycloak.protect('voter'), async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM elections');
  res.json(rows);
});

app.post('/vote', keycloak.protect('voter'), async (req, res) => {
  await pool.query(
    'INSERT INTO votes (election_id, user_id, choice) VALUES ($1, $2, $3)',
    [req.body.electionId, req.kauth.grant.access_token.content.sub, req.body.choice]
  );
  res.send("Vote recorded!");
});

app.get('/results', keycloak.protect('admin'), async (req, res) => {
  const { rows } = await pool.query('SELECT choice, COUNT(*) FROM votes GROUP BY choice');
  res.json(rows);
});

app.listen(3000, () => console.log('Server running on port 3000'));