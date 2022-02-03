import React, { useEffect, useState } from 'react';
import CommentView, { Comment } from './CommentView';
import './App.css';

const extractId = (url: string): string => {
  return url
    .replace('https://place.map.kakao.com/m/', '')
    .replace('https://place.map.kakao.com/', '')
    .split('#')[0]
    .trim();
};

function App() {
  const [url, setUrl] = useState<string>(
    'https://place.map.kakao.com/1148545656'
  );
  const [comments, setComments] = useState<Comment[]>([]);
  const [filter, setFilter] = useState<number>(0);
  const [error, setError] = useState<string>('');
  useEffect(() => {
    if (!url || url.match(/w+/)) {
      setComments([]);
    }
    (async () => {
      try {
        const commentList = await fetch(
          `http://localhost:3001/${extractId(url)}`,
          {
            headers: {
              'Content-Type': ' application/json',
              'Sec-Fetch-Site': 'cross-site',
            },
          }
        );
        if (commentList.status === 200) {
          const json = await commentList.json();
          setError('');
          setComments(json);
        } else {
          setError('잘못된 주소입니다.');
          console.error(`${commentList.status} ${commentList.statusText}`);
        }
      } catch (e) {
        console.error(e.message);
      }
    })();
  }, [url]);

  return (
    <div className="App flex flex-col flex items-center max-w-screen-md max-h-screen m-auto mt-2">
      <div className="flex items-center w-full gap-2">
        <input
          className="text-xl border-2 border-gray-300 rounded-lg p-2 min-w-lg w-9/12"
          placeholder="URL을 입력해주세요"
          maxLength={200}
          type="text"
          onChange={(e) => setUrl(e.target.value)}
        />
        {!!error && <div className="text-red-600">{error}</div>}
        <div className="w-3/12">
          <span className="text-xl">필터:</span>
          <select
            className="text-xl border-2 border-gray-300 rounded-lg p-2"
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
      </div>
      {!!comments.length && (
        <>
          <div>
            <span>총 {comments.length}개 리뷰</span>
            <span>
              평점:{' '}
              <b>
                {(
                  comments.reduce((a: Comment, b: Comment) => a + b.point, 0) /
                  comments.length
                ).toFixed(2)}
                점
              </b>{' '}
              {filter !== 0 && (
                <>
                  / {filter}점{' '}
                  {comments.filter((c) => filter === c.point).length}개
                </>
              )}
              ({extractId(url)})
            </span>
          </div>
          <div className="flex flex-col divide-y max-w-xl overflow-auto">
            {comments
              .filter((c) => filter === 0 || filter === c.point)
              .map((c) => (
                <CommentView key={c.commentid} comment={c} />
              ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
