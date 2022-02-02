import React, { useEffect, useState } from 'react';
import CommentView, { Comment } from './CommentView';
import './App.css';

const extractId = (url: string): string => {
  return url.replace('https://place.map.kakao.com/', '').split('#')[0].trim();
};

function App() {
  const [url, setUrl] = useState<string>(
    'https://place.map.kakao.com/1148545656'
  );
  const [comments, setComments] = useState<Comment[]>([]);
  const [filter, setFilter] = useState<number>(0);

  useEffect(() => {
    if (!url) return;
    (async () => {
      const commentList = await fetch(
        `http://localhost:3001/${extractId(url)}`,
        {
          headers: {
            'Content-Type': ' application/json',
            'Sec-Fetch-Site': 'cross-site',
          },
        }
      );
      const json = await commentList.json();
      setComments(json);
    })();
  }, [url]);

  return (
    <div className="App flex flex-col flex items-center max-w-screen-2xl ">
      {' '}
      <div>
        <input
          placeholder="URL을 입력해주세요"
          type="text"
          onChange={(e) => setUrl(e.target.value)}
        />
        <select
          name="point"
          id="point"
          defaultValue="0"
          onChange={(e) => setFilter(parseInt(e.target.value, 10))}
        >
          <option value="0">전체</option>
          <option value="1">1점</option>
          <option value="2">2점</option>
          <option value="3">3점</option>
          <option value="4">4점</option>
          <option value="5">5점</option>
        </select>
      </div>
      <div>
        <span>총 {comments.length}개 리뷰</span>
        <span>
          평점:{' '}
          {(
            comments.reduce((a: Comment, b: Comment) => a + b.point, 0) /
            comments.length
          ).toFixed(2)}
          점 ({extractId(url)})
        </span>
      </div>
      <div className="flex flex-col divide-y max-w-xl">
        {comments
          .filter((c) => filter === 0 || filter === c.point)
          .map((c) => (
            <CommentView key={c.commentid} comment={c} />
          ))}
      </div>
    </div>
  );
}

export default App;
