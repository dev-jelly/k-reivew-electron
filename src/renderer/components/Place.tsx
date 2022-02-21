import React, { useEffect, useState } from 'react';
import { extractId } from '../App';
import CommentView, { Comment } from 'renderer/components/CommentView';
import { set } from 'husky';

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

const beforeMonth = (date: Date, month: number) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() - month);
  return newDate;
};

export const Place: React.FC<PlaceProps> = ({ url, filter, setError }) => {
  const [place, setPlace] = useState<IPlace | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date(1970, 0, 1, 12));
  const [endDate, setEndDate] = useState<Date>(new Date());
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

  useEffect(() => {
    if (place) {
      setComments(place.comments);
      setStartDate(new Date(1970, 0, 1, 12));
    }
  }, [place]);

  useEffect(() => {
    if (!startDate) {
      setComments(place?.comments ?? []);
    } else {
      setComments(
        place?.comments
          ?.filter(
            (comment) =>
              comment.date >=
              startDate?.toISOString().split('T')[0].replaceAll('-', '.')
          )
          .filter(
            (comment) =>
              comment.date <=
                endDate.toISOString().split('T')[0].replaceAll('-', '.') ??
              '9999.99.99'
          ) ?? []
      );
    }
  }, [startDate, endDate, place]);

  const recentReviews = (month?: number) => {
    if (!month) {
      setStartDate(new Date(1970, 0, 2));
    } else {
      setStartDate(beforeMonth(new Date(), month));
    }
    setEndDate(new Date());
  };

  if (!place) {
    return <></>;
  }

  return (
    <>
      <div className="mt-2 m-1 p-1">
        <span>기간동안 총 {comments.length}개 리뷰 </span>
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
      <div className="mb-8">
        <div className="flex gap-2 justify-around p-1 text-lg text-gray-600 ">
          <button
            type="button"
            onClick={() => recentReviews()}
            className="text-gray-600 hover:text-blue-600"
          >
            전체 보기
          </button>
          <button
            type="button"
            onClick={() => recentReviews(3)}
            className="text-gray-600 hover:text-blue-600"
          >
            최근 3개월
          </button>
          <button
            type="button"
            onClick={() => recentReviews(6)}
            className="text-gray-600 hover:text-blue-600"
          >
            최근 6개월
          </button>
          <button
            type="button"
            onClick={() => recentReviews(12)}
            className="text-gray-600 hover:text-blue-600"
          >
            최근 1년
          </button>
        </div>
        <div className="flex gap-8 text-md">
          <input
            type="date"
            value={startDate?.toISOString().split('T')[0]}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            className="w-full p-2 border border-gray-400 rounded-lg"
          />
          <span className="p-2">~</span>
          <input
            type="date"
            value={endDate.toISOString().split('T')[0]}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            className="w-full p-2 border border-gray-400 rounded-lg"
          />
        </div>
      </div>
      <div className="flex flex-col divide-y overflow-auto">
        {comments
          .filter((c) => filter === 0 || filter === c.point)
          .map((c) => (
            <CommentView key={c.commentid} comment={c} />
          ))}
      </div>
    </>
  );
};
