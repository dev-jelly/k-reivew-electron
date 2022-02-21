import React, { useEffect, useState } from 'react';
import { extractId } from 'renderer/App';
import CommentView, { Comment } from 'renderer/components/CommentView';

export interface IPlace {
  id: string;
  name: string;
  avgScore: number;
  sumScore: number;
  comments: Comment[];
}

export interface PlaceProps {
  url: string;
  filter: number;
  setError: (error: string) => void;
}

export const Place: React.FC<PlaceProps> = ({ url, filter, setError }) => {
  const [place, setPlace] = useState<IPlace | null>(null);
  useEffect(() => {
    if (!url || url.match(/w+/)) {
      setPlace(null);
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
          setPlace(json);
        } else {
          setError('잘못된 주소입니다.');
          console.error(`${commentList.status} ${commentList.statusText}`);
        }
      } catch (e) {
        console.error(e.message);
      }
    })();
  }, [setError, url]);

  return (
    <>
      {place && (
        <>
          <div className="mb-8">
            <span>총 {place.comments.length}개 리뷰</span>
            <span>
              평점: <b>{place.avgScore.toFixed(2)}점</b>{' '}
              {filter !== 0 && (
                <>
                  / {filter}점{' '}
                  {place.comments.filter((c) => filter === c.point).length}개
                </>
              )}
              ({extractId(url)})
            </span>
          </div>
          <div className="flex flex-col divide-y overflow-auto">
            {place.comments
              .filter((c) => filter === 0 || filter === c.point)
              .map((c) => (
                <CommentView key={c.commentid} comment={c} />
              ))}
          </div>
        </>
      )}
    </>
  );
};
