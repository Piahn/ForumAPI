const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({
    replyRepository, commentRepository, threadRepository,
  }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, threadId, commentId, owner) {
    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.verifyCommentExists({ threadId, commentId });

    const newReply = new NewReply({
      content: useCasePayload.content,
      commentId,
      owner,
    });

    return this._replyRepository.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;
