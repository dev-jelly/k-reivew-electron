import React, { useEffect, useState } from 'react';

type Comment = {
  contents: string;
  point: number;
  username: string;
};

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
    <div className="App">
      <input type="text" onChange={(e) => setUrl(e.target.value)} />
      <button>Click me</button>
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
      <div style={{ display: 'flex', maxWidth: 768, flexDirection: 'column' }}>
        {extractId(url)}
        {comments
          .filter((c) => filter === 0 || filter === c.point)
          .map((c) => (
            <div>
              <span style={{ color: 'grey' }}>{c.username}</span>
              <span style={{ color: '#ff5d5d' }}>{'★'.repeat(c.point)}</span>
              <span style={{ color: 'grey' }}>{'★'.repeat(5 - c.point)}</span>
              <b>{c.point}</b>
              <p>{c.contents}</p>
              <hr />
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
