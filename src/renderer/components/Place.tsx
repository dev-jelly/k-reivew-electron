import React, { useEffect, useState } from 'react';
import { extractId } from 'renderer/App';
import CommentView, { Comment } from 'renderer/components/CommentView';

export interface PlaceProps {
  url: string;
  filter: number;
  setError: (error: string) => void;
}

export const Place: React.FC<PlaceProps> = ({ url, filter, setError }) => {
  const [comments, setComments] = useState<Comment[]>([]);
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
    <>
      {!!comments.length && (
        <>
          <div className="mb-8">
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
          <div className="flex flex-col divide-y overflow-auto">
            {comments
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
