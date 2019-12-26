const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const server = require('http').createServer(app);
const crypto = require('crypto');

app.use(bodyParser.urlencoded({ extended: true }));

const { MongoClient } = require('mongodb');
const { ObjectID } = require('mongodb');

const url = 'mongodb+srv://Someone:kpi123@news-e7tux.mongodb.net/news?retryWrites=true&w=majority';

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server is up!');
});

app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public/`));

const news = [
  { header: 'Header 1', content: 'News 1' },
  { header: 'Header 2', content: 'News 2' },
];

app.post('/addNews', (request, response) => {
  console.log('post');
  const { Header } = request.body;
  const { Content } = request.body;
  if (Header.length !== 0 && Content.length !== 0) {
    const mongoClient = new MongoClient(url, { useUnifiedTopology: true });

    mongoClient.connect((err, client) => {
      if (err) {
        return console.log(err);
      }
      const db = client.db('news'); // подключение бд
      const newsdb = db.collection('news'); // создание коллекции

      const hash = crypto
        .createHash('md5')
        .update(Content)
        .digest('hex');
      console.log(hash);
      newsdb.insertOne({ id: hash, header: Header, content: Content }, (err, result) => {
        if (err) return console.log(err);
        console.log(result);
      });
      newsdb.find().toArray((err, results) => {
        if (err) {
          return console.log(err);
        }
        response.render(`${__dirname}/views/index.ejs`, { results });
      });
      client.close();
    });
  }
});

app.use('/News/:id', (request, response) => {
  const { id } = request.params;
  app.use(express.static(`${__dirname}/public`));

  const mongoClient = new MongoClient(url, { useUnifiedTopology: true });

  mongoClient.connect((err, client) => {
    if (err) {
      return console.log(err);
    }
    const db = client.db('news'); // подключение бд
    const newsdb = db.collection('news'); // создание коллекции

    console.log(`idSite: ${String(request.params.id)}`);
    const a = String(id);
    newsdb.findOne({ header: String(request.params.id) }, (err, result) => {
      if (err) { return console.log(err);}

      console.log(`idSite: ${String(id)} ${typeof id}`);
      console.log(`idSite: ${result}`);

      if (result === null) {
        response.render(`${__dirname}/views/News.ejs`, {
          header: 'a' /* result.header */,
          content: 'a' /* result.content */,
        });
      }
    });

    client.close();
  });
});

app.use('/', (request, response) => {
  const mongoClient = new MongoClient(url, { useUnifiedTopology: true });

  mongoClient.connect((err, client) => {
    if (err) {
      return console.log(err);
    }
    const db = client.db('news'); // подключение бд
    const newsdb = db.collection('news'); // создание коллекции

    newsdb.find().toArray((err, results) => {
      if (err) {
        return console.log(err);
      }

      response.render(`${__dirname}/views/index.ejs`, { results });
    });
    client.close();
  });
});
