const CommentLikeRepository = require('../CommentlikeRepository');

describe('CommentLikeRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const commentLikeRepository = new CommentLikeRepository();

    // Action and Assert
    await expect(commentLikeRepository.addLike('', '')).rejects.toThrow('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentLikeRepository.deleteLikeByCommentIdAndOwner('', '')).rejects.toThrow('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentLikeRepository.verifyLikeExists('', '')).rejects.toThrow('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentLikeRepository.getLikeCountByCommentId('')).rejects.toThrow('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
