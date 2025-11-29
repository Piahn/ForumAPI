class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const replies = await this._replyRepository.getRepliesByThreadId(threadId);

    // Process comments
    const processedComments = comments.map((comment) => {
      // Filter replies for this comment
      const commentReplies = replies
        .filter((reply) => reply.comment_id === comment.id)
        .map((reply) => ({
          id: reply.id,
          content: reply.is_deleted ? '**balasan telah dihapus**' : reply.content,
          date: reply.date,
          username: reply.username,
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      return {
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.is_deleted ? '**komentar telah dihapus**' : comment.content,
        replies: commentReplies,
      };
    });

    // Sort comments by date (ascending)
    processedComments.sort((a, b) => new Date(a.date) - new Date(b.date));

    return {
      ...thread,
      comments: processedComments,
    };
  }
}

module.exports = GetThreadUseCase;
