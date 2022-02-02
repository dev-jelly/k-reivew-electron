import { Context, Next } from 'koa';

const Koa = require('koa');
const cors = require('@koa/cors');
const axios = require('axios');
const Router = require('koa-router');

const app = new Koa();

const commentListUrl = (id: string, page: number = 1) => {
  return `https://place.map.kakao.com/commentlist/v/${id}/${page}?platform=`;
};

const router = new Router();

router.get('/:id', async (ctx: Context, next: Next) => {
  const id = ctx.params.id as string;
  try {
    const commentList = await axios.get(commentListUrl(id));
    const {
      data: { comment },
    } = commentList;
    console.log('data', comment);
    const pages = Math.floor((comment.kamapComntcnt as number) / 5) + 1;
    let comments = [...comment.list];
    for (let i = 2; i <= pages; i++) {
      const commentList = await axios.get(commentListUrl(id, i));
      const {
        data: { comment },
      } = commentList;
      comments = [...comments, ...comment?.list];
    }
    ctx.body = comments;
  } catch (e) {
    const error = e as Error;
    console.error(error.message);
    ctx.body = { error: error.message };
    return;
  }
});

app.use(cors({ origin: '*' }));
app.use(router.routes());
app.use(router.allowedMethods());

console.log('server start');
app.listen(3001);
