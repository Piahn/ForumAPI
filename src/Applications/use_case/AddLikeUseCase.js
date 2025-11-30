const NewLike = require('../../Domains/likes/entities/NewLikes');

class AddLikeUseCase {
  constructor({ likeRepository, commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, owner } = useCasePayload;

    // Verify thread exists
    await this._threadRepository.verifyThreadExists(threadId);

    // Verify comment exists in the thread
    await this._commentRepository.verifyCommentExists({ threadId, commentId });

    // Validate input with NewLike entity
    const newLike = new NewLike({ commentId, owner });

    // PERBAIKAN: Kirim parameter terpisah (commentId, owner) bukan object newLike
    const isLiked = await this._likeRepository.verifyLikeExists(newLike.commentId, newLike.owner);

    if (isLiked) {
      // Unlike: delete the like
      await this._likeRepository.deleteLikeByCommentIdAndOwner(
        newLike.commentId,
        newLike.owner,
      );
    } else {
      // Like: add the like
      await this._likeRepository.addLike(newLike.commentId, newLike.owner);
    }
  }
}

module.exports = AddLikeUseCase;
