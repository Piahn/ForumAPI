const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(threadId, owner, useCasePayload) {
    await this._threadRepository.verifyThreadExists(threadId);

    const newComment = new NewComment({
      content: useCasePayload.content,
      threadId,
      owner,
    });

    return this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
