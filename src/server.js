const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose');

const CONFIG = require(`${__dirname}/../config.json`);
const SCHEME = require(`${__dirname}/models.json`);
const URL = process.env.CONFIG_URL;
const PORT = process.env.PORT || CONFIG.PORT;

const { newsScheme } = SCHEME;

mongoose.connect(URL, { useUnifiedTopology: true });
const News = mongoose.model('News', newsScheme);

app.listen(PORT, () => {
  console.log('Server is up!');
});

app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public/`));

app.post('/addNews', (request, response) => {
  console.log('post');
  const { Header } = request.body;
  const { Content } = request.body;
  if (Header.length !== 0 && Content.length !== 0) {
    const news = new News({
      header: Header,
      content: Content,
    });

    news.save(err => {
      if (err) return console.log(err);
      console.log('New object: ', news);

      News.find({}, (err, news) => {
        if (err) return console.log(err);
        response.render(`${__dirname}/views/index.ejs`, { news });
      });
    });
  }
});

app.use('/News/:id', (request, response) => {
  let { id } = request.params;
  app.use(express.static(`${__dirname}/public`));

  id = id.slice(1, id.length);

  News.findOne({ _id: id }, (err, news) => {
    if (err) return console.log(err);

    if (news !== null) {
      response.render(`${__dirname}/views/News.ejs`, { news });
    } else {
      response.sendStatus(404);
    }
  });
});

app.use('/', (request, response) => {
  News.find({}, (err, news) => {
    if (err) return console.log(err);
    response.render(`${__dirname}/views/index.ejs`, { news });
  });
});
