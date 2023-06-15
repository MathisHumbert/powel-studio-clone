require('dotenv').config();

const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const errorHandler = require('errorhandler');
const logger = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const uaParser = require('ua-parser-js');
const Prismic = require('@prismicio/client');
const PrismicH = require('@prismicio/helpers');

const app = express();
const port = 3000;

app.use(errorHandler());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());

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

  if (doc.type === 'gallery' && doc.uid === 'm13') {
    return '/m13';
  }

  if (doc.type === 'studio') {
    return '/studio';
  }

  return '/';
};

app.use((req, res, next) => {
  const ua = uaParser(req.headers['user-agent']);

  res.locals.isDesktop = ua.device.type === undefined;
  res.locals.isTablet = ua.device.type === 'tablet';
  res.locals.isPhone = ua.device.type === 'mobile';

  res.locals.PrismicH = PrismicH;
  res.locals.Link = HandleLinkResolver;

  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const handleRequest = async (api) => {
  // const meta = await api.getSingle('meta');
  // const preloader = await api.getSingle('preloader');

  const navigation = await api.getByUID('navigation', 'nav');
  const footer = await api.getByUID('navigation', 'footer');

  return { navigation, footer };
};

app.get('/', async (req, res) => {
  const api = initApi(req);

  const home = await api.getByUID('gallery', 'home');
  const defaults = await handleRequest(api);

  res.render('pages/home', { ...defaults, home });
});

app.get('/m13', async (req, res) => {
  const api = initApi(req);

  const m13 = await api.getByUID('gallery', 'm13');
  const defaults = await handleRequest(api);

  res.render('pages/m13', { ...defaults, m13 });
});

app.get('/project/:id', async (req, res) => {
  const api = initApi(req);

  const project = await api.getByUID('project', req.params.id);
  const defaults = await handleRequest(api);

  res.render('pages/project', { ...defaults, project });
});
app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
