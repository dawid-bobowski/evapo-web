const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const db = require('../database/requests');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/table/:name', cors(), async (req, res) => {
  const result = await db.getTable(req.params.name);
  res.status(200).json(result);
});

app.listen(3000, () => console.log('Server is running!'));
