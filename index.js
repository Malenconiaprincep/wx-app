const Koa = require('koa');
const Router = require('koa-router');
const render = require('koa-ejs');
const path = require('path');
const rp = require('request-promise');


const app = new Koa();
const router = new Router();

render(app, {
  root: path.join(__dirname, 'view'),
  layout: 'template',
  viewExt: 'html',
  cache: false,
  // debug: true
});

const checkSignApi = 'http://localhost:7002/jsticket'

router.get('/', async function (ctx) {
  const options = {
    url : checkSignApi,
    headers: {
      host: `${ctx.header.host}${ctx.url}`
    }
  }
  const response = await rp(options)
  console.log(response, '>>>>>>')
  await ctx.render('index', {
    response
  });
});

const authApi = 'http://localhost:7002/auth'

router.get('/auth', async function(ctx){
  const {code, state} = ctx.query
  const options = {
    url: authApi,
    qs: {
      code,
      state
    }
  }
  console.log(options)
  const response = await rp(options)
  // console.log(response)
  ctx.body = response
})

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(7001);
