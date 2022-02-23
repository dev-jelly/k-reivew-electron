import React, { useEffect, useState } from 'react';
import { Comment } from './CommentView';

export interface DateFilterProps {
  comments?: Comment[];
  setDateFilter: (on: boolean) => void;
  setComments: (comments: Comment[]) => void;
}

const beforeMonth = (date: Date, month: number) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() - month);
  return newDate;
};

export const DateFilter: React.FC<DateFilterProps> = ({
  comments,
  setDateFilter,
  setComments,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(
    new Date(2000, 0, 1, 9)
  );
  const [endDate, setEndDate] = useState<Date>(new Date());

  useEffect(() => {
    if (!startDate) {
      setComments(comments ?? []);
    } else {
      setComments(
        comments?.filter((comment) => {
          const start =
            startDate?.toISOString().split('T')[0].replaceAll('-', '.') ?? '';
          const end =
            endDate?.toISOString().split('T')[0].replaceAll('-', '.') ??
            '9999.99.99';
          return comment.date >= start && comment.date <= end;
        }) ?? []
      );
    }
  }, [comments, startDate, endDate]);

  const recentReviews = (month?: number) => {
    if (!month) {
      setStartDate(new Date(2000, 0, 1, 9));
      setDateFilter(false);
    } else {
      setStartDate(beforeMonth(new Date(), month));
    }
    setEndDate(new Date());
  };
  if (!comments) {
    return <></>;
  }
  return (
    <div className="m-auto">
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
      <div className="flex gap-2 text-md">
        <input
          type="date"
          value={
            startDate ? startDate.toISOString().split('T')[0] : '----.--.--'
          }
          onChange={(e) => setStartDate(new Date(e.target.value))}
          disabled={!startDate}
          className="p-1 border border-gray-400 rounded-lg "
        />
        <span className="py-2">~</span>
        <input
          type="date"
          value={endDate.toISOString().split('T')[0]}
          onChange={(e) => setEndDate(new Date(e.target.value))}
          className="p-1 border border-gray-400 rounded-lg disabled:bg-gray-600"
        />
      </div>
    </div>
  );
};
