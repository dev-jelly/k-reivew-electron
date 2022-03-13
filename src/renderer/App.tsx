import React, { useEffect, useState } from 'react';
import './App.css';
import { Place } from './components/Place';

export const App: React.FC = () => {
  const [url, setUrl] = useState<string>(
    'https://place.map.kakao.com/1148545656'
  );
  const [error, setError] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      setDarkMode(true);
    }
  }, []);
  useEffect(
    () =>
      darkMode
        ? document.body.classList.add('dark')
        : document.body.classList.remove('dark'),
    [darkMode]
  );
  return (
    <div className="App h-screen w-screen overflow-hidden dark:bg-gray-800 dark:text-gray-200">
      <div className="absolute">
        <button
          className="text-gray-200 p-2 rounded-full shadow-lg"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
      <div className="flex flex-col flex items-center max-w-screen-md max-h-screen m-auto mt-2 p-4">
        <div className="flex items-center w-full gap-2 justify-between ">
          <h2 className="m-auto text-lg">URL</h2>
          <input
            className="text-xl border-2 border-gray-300 rounded-lg p-2 min-w-lg w-11/12 dark:text-gray-800"
            placeholder="URL을 입력해주세요"
            maxLength={200}
            type="text"
            onChange={(e) => setUrl(e.target.value)}
          />
          {!!error && <div className="text-red-600">{error}</div>}
        </div>
        <Place url={url} setError={setError} />
      </div>
    </div>
  );
};

export default App;
