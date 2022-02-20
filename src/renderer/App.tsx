import { useEffect, useState } from 'react';

import './App.css';
import { Place } from './components/Place';

export const extractId = (url: string): string => {
  return url
    .replace('https://place.map.kakao.com/m/', '')
    .replace('https://place.map.kakao.com/', '')
    .split('#')[0]
    .trim();
};

export const App: React.FC = () => {
  const [url, setUrl] = useState<string>(
    'https://place.map.kakao.com/1148545656'
  );
  const [filter, setFilter] = useState<number>(0);
  const [error, setError] = useState<string>('');

  return (
    <div className="App flex flex-col flex items-center  max-w-screen-md max-h-screen m-auto mt-2">
      <div className="flex items-center w-full gap-2 justify-between">
        <h2 className="text-lg">URL</h2>
        <input
          className="text-xl border-2 border-gray-300 rounded-lg p-2 min-w-lg w-9/12"
          placeholder="URL을 입력해주세요"
          maxLength={200}
          type="text"
          onChange={(e) => setUrl(e.target.value)}
        />
        {!!error && <div className="text-red-600">{error}</div>}
        <div className="ml-auto">
          <span className="text-xl pr-2">필터</span>
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
      <Place url={url} filter={filter} setError={setError} />
    </div>
  );
};

export default App;
