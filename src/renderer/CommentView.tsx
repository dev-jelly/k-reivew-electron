import React from 'react';

export type Comment = {
  commentid: string;
  contents: string;
  point: number;
  username: string;
};

export type CommentViewProps = {
  comment: Comment;
};

const CommentView: React.FC<CommentViewProps> = ({ comment }) => {
  return (
    <div key={comment.commentid}>
      <span className="text-gray-500 mx-1">{comment.username}</span>
      <span className="text-orange-500">{'★'.repeat(comment.point)}</span>
      <span className="text-gray-300">{'★'.repeat(5 - comment.point)}</span>
      <b className="mx-1">{comment.point}</b>
      <p>{comment.contents}</p>
    </div>
  );
};

export default CommentView;
