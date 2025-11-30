class GetThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(
      threadId,
    );
    const replies = await this._replyRepository.getRepliesByThreadId(threadId);

    const commentsWithDetails = await Promise.all(
      comments.map(async (comment) => {
        const likeCount = await this._likeRepository.getLikeCountByCommentId(
          comment.id,
        );

        const commentReplies = replies
          .filter((reply) => reply.comment_id === comment.id)
          .map((reply) => ({
            id: reply.id,
            content: reply.is_deleted
              ? '**balasan telah dihapus**'
              : reply.content,
            date: reply.date,
            username: reply.username,
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        return {
          id: comment.id,
          username: comment.username,
          date: comment.date,
          replies: commentReplies,
          content: comment.is_deleted
            ? '**komentar telah dihapus**'
            : comment.content,
          likeCount: parseInt(likeCount, 10),
        };
      }),
    );

    commentsWithDetails.sort((a, b) => new Date(a.date) - new Date(b.date));

    return {
      ...thread,
      comments: commentsWithDetails,
    };
  }
}

module.exports = GetThreadUseCase;
