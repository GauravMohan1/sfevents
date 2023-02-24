const express = require('express');
const mysql = require('mysql');
const ejs = require('ejs');
const path = require('path');
const app = express();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Kuttan2468!',
  database: 'mysfevents'
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 20;
  const offset = (page - 1) * perPage;

  const query = 'SELECT id,venue,event,event_desc,date,price,location,distance FROM events ORDER BY similarity DESC LIMIT 200';
  connection.query(query, [offset, perPage], (err, results) => {
    if (err) throw err;
    res.render('index', { events: results, page: page, perPage: perPage });
  });
});

app.get('/liked-events', (req, res) => {
  const query = 'SELECT events.id, events.venue, events.event, events.event_desc, events.date, events.price, events.location, events.distance FROM events INNER JOIN liked_events ON events.id = liked_events.event_id';
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.render('liked_events', { likedEvents: results });
  });
});


const { spawn } = require('child_process');

app.post('/like', (req, res) => {
  console.log(req.body)
  const eventId = req.body.eventId;
  const query = 'INSERT INTO liked_events (event_id) VALUES (?)';
  connection.query(query, [eventId], (err, result) => {
    if (err) throw err;
    const pyScript = spawn('python', ['/Users/gauravmohan/Documents/SFBars/update_recs.ipynb']);

    pyScript.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    pyScript.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    pyScript.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      res.redirect('/');
    });
  });
});

app.post('/remove', (req, res) => {
  console.log(req.body)
  const likedEventId = req.body.likedEventId;

  const query = 'DELETE FROM liked_events WHERE event_id = ?';
  connection.query(query, [likedEventId], (err, result) => {
    if (err) throw err;
    res.redirect('/liked-events');
  });
});

 

app.listen(3000, () => console.log('Server started on port 3000'));

