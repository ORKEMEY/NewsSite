const express = require('express');

const app = express();
const server = require('http').createServer(app);

app.listen(3000, () => {
    console.log('Server is up!');
});

app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));

const news = [
    { header: 'Header 1', content: 'News 1' },
    { header: 'Header 2', content: 'News 2' },
];

app.use('/News/:id', (request, response) => {
    const { id } = request.params;
    console.log(id);
    response.render(`${__dirname}/views/News.ejs`, { news: news[id] });
});

app.use('/', (request, response) => {
    response.render(`${__dirname}/views/index.ejs`, { news });
});
