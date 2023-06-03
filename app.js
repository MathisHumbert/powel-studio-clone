require('dotenv').config();

const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const Prismic = require('@prismicio/client');
const PrismicH = require('@prismicio/helpers');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'dist')));

const initApi = (req) => {
  return Prismic.createClient(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
    fetch,
  });
};

const HandleLinkResolver = (doc) => {
  if (doc.type === 'project') {
    return `/project/${doc.uid}`;
  }

  return '/';
};

app.use((req, res, next) => {
  res.locals.PrismicH = PrismicH;
  res.locals.Link = HandleLinkResolver;

  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', async (req, res) => {
  const api = initApi(req);

  const home = await api.getSingle('home');

  res.render('pages/home', { home });
});

app.get('/project/:id', async (req, res) => {
  const api = initApi(req);

  const project = await api.getByUID('project', req.params.id, {});

  res.render('pages/project', { project });
});
app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
