import React from 'react';
import { Comment } from './CommentView';

export interface ScoreBarProps {
  comments: Comment[];
  point: number;
  filter: number;
  setFilter: (filter: number) => void;
}

export const ScoreBar: React.FC<ScoreBarProps> = ({
  comments,
  point,
  filter,
  setFilter,
}) => {
  const percent =
    (comments.filter((c) => c.point === point).length / comments.length) * 100;
  return (
    <div
      onClick={() => setFilter(filter === point ? 0 : point)}
      className="flex w-full hover:opacity-80 cursor-pointer"
    >
      {filter === point && (
        <button type="button" className="text-lg  font-bold text-black">
          {point}
        </button>
      )}
      {filter !== point && (
        <button type="button" className="text-lg text-gray-600">
          {point}
        </button>
      )}
      <div className="flex w-full h-0.5 p-2 py-3 ">
        {filter === point && (
          <div
            style={{ width: `${percent}%`, height: '4px' }}
            className="bg-orange-500"
          >
            {' '}
          </div>
        )}
        {filter !== point && (
          <div
            style={{ width: `${percent}%`, height: '4px' }}
            className="bg-orange-300 "
          >
            {' '}
          </div>
        )}
        <div
          style={{
            width: `${100 - percent}%`,
            height: '4px',
            background: '#eeeeee',
          }}
        >
          {' '}
        </div>
      </div>
    </div>
  );
};
