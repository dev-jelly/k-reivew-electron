import React, { useEffect, useState } from 'react';
import { extractId } from '../App';
import CommentView, { Comment } from 'renderer/components/CommentView';
import { DateFilter } from './DateFilter';
import { ScoreBar } from './ScoreBar';

export interface IPlace {
  id: string;
  name: string;
  avgScore: number;
  sumScore: number;
  comments: Comment[];
}

export interface PlaceProps {
  url: string;
  setError: (error: string) => void;
}

export const Place: React.FC<PlaceProps> = ({ url, setError }) => {
  const [place, setPlace] = useState<IPlace | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [dateFilter, setDateFilter] = useState<boolean>(false);
  const [filter, setFilter] = useState<number>(0);

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
          setDateFilter(false);
          setFilter(0);
        } else {
          setError('잘못된 주소입니다.');
          console.error(`${commentList.status} ${commentList.statusText}`);
        }
      } catch (e) {
        console.error(e.message);
      }
    })();
  }, [setError, url]);

  useEffect(() => {
    if (place) {
      setComments(place.comments);
    }
  }, [dateFilter]);

  if (!place) {
    return <></>;
  }

  return (
    <>
      <div className="mt-2 m-1 p-1">
        <span>
          {dateFilter && '기간동안'} 총 {comments.length}개 리뷰{' '}
        </span>
        <span>
          평점:{' '}
          <b>
            {(
              comments.reduce((a, b) => a + b.point, 0) / (comments.length || 1)
            ).toFixed(2)}
            점
          </b>{' '}
          {filter !== 0 && (
            <>
              / {filter}점{' '}
              {place.comments.filter((c) => filter === c.point).length}개
            </>
          )}
          ({place.name})
        </span>
      </div>
      <div className="flex w-full mb-2">
        <div className="w-1/3">
          {[1, 2, 3, 4, 5].map((point) => (
            <ScoreBar
              key={point}
              comments={comments}
              point={point}
              filter={filter}
              setFilter={setFilter}
            />
          ))}
        </div>

        <div className="flex w-full  justify-center">
          {dateFilter && (
            <DateFilter
              setDateFilter={setDateFilter}
              setComments={setComments}
              comments={place.comments}
            />
          )}
          {dateFilter || (
            <button
              type="button"
              onClick={() => setDateFilter(true)}
              className="text-gray-600 hover:text-blue-600 text-lg "
            >
              기간설정
            </button>
          )}
        </div>
      </div>
      <div className="flex w-full py-4 justify-center">
        <div className="w-2/3 h-0.5 bg-gray-100" />
      </div>
      <div className="flex flex-col divide-y overflow-auto w-full">
        {comments
          .filter((c) => filter === 0 || filter === c.point)
          .map((c) => (
            <CommentView key={c.commentid} comment={c} />
          ))}
      </div>
    </>
  );
};
