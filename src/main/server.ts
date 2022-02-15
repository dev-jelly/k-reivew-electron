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

const requestComment = async (id: string, page?: number): Promise<any[]> => {
  const commentList = await axios.get(commentListUrl(id, page));
  const {
    data: { comment },
  } = commentList;
  if (!comment?.list) return [];

  const definedList = comment?.list?.map((comment: any) => {
    const { commentid, contents, point, username, date } = comment;
    return { commentid, contents, point, username, date };
  });
  return definedList;
};
// main information
// main url https://place.map.kakao.com/main/v/17733090?_=1644854828810
router.get('/:id', async (ctx: Context, next: Next) => {
  const id = ctx.params.id.match(/\d/g)?.join('') as string;

  try {
    const commentList = await axios.get(commentListUrl(id));
    const {
      data: { comment },
    } = commentList;
    console.log('data', comment);
    const pages =
      Math.floor((comment.kamapComntcnt as number) / 5) +
      ((comment.kamapComntcnt as number) % 5 > 0 ? 1 : 0);
    let comments = [...comment.list];

    const requestList = [];
    // Extract request
    for (let i = 2; i <= pages; i++) {
      requestList.push(requestComment(id, i));
    }

    comments = [
      ...comments,
      ...(await Promise.all(requestList)).flatMap((x) => x),
    ];

    ctx.body = comments;
  } catch (e) {
    const error = e as Error;
    console.error(error.message);
    ctx.body = { error: error.message };
  }
  await next();
});

app.use(cors({ origin: '*' }));
app.use(router.routes());
app.use(router.allowedMethods());

console.log('server start');
app.listen(3001);
