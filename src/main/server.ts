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

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const cache: Record<string, KakaoResponse> = {};

interface KakaoResponse {
  id: string;
  name: string;
  avgScore: number;
  sumScore: number;
  comments: Comment[];
}

interface Comment {
  commentid: string;
  contents: string;
  point: number;
  username: string;
  date: string;
}

const requestComment = async (id: string, page = 1): Promise<Comment[]> => {
  await sleep(page * 150);
  const commentList = await axios.get(commentListUrl(id, page));
  const {
    data: { comment },
  } = commentList;
  if (!comment?.list) return [];

  const definedList = comment?.list?.map((c: Comment) => {
    const { commentid, contents, point, username, date } = c;
    return { commentid, contents, point, username, date };
  });
  return definedList;
};

router.get('/:id', async (ctx: Context, next: Next) => {
  const id = ctx.params.id.match(/\d/g)?.join('') as string;
  if (cache[id]) {
    ctx.body = cache[id];
    await next();
    return;
  }
  try {
    const information = await axios.get(
      `https://place.map.kakao.com/main/v/${id}`
    );

    const { basicInfo, comment } = information.data;

    const pages =
      Math.floor((comment.kamapComntcnt as number) / 5) +
      ((comment.kamapComntcnt as number) % 5 > 0 ? 1 : 0);
    let comments: Comment[] = [...comment.list];

    const requestList = [];
    // Extract request

    for (let i = 2; i <= pages; i += 1) {
      requestList.push(requestComment(id, i));
    }

    comments = [
      ...comments,
      ...(await Promise.all(requestList)).flatMap((x) => x),
    ];
    const response: KakaoResponse = {
      id,
      name: basicInfo.placenamefull,
      avgScore: comment.scocnt !== 0 ? comment.scoresum / comment.scorecnt : 0,
      sumScore: comment.scoresum,
      comments,
    };
    cache[id] = response;
    ctx.body = response;
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
