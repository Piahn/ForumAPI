const NewLikes = require('../NewLikes');

describe('a NewLike entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
    };

    // Action & Assert
    expect(() => new NewLikes(payload)).toThrow('NEW_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload has invalid data type', () => {
    // Arrange
    const payload = {
      commentId: 123,
      owner: true,
    };

    // Action & Assert
    expect(() => new NewLikes(payload)).toThrow('NEW_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewLike object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      owner: 'user-123',
    };

    // Action
    const newLike = new NewLikes(payload);

    // Assert
    expect(newLike).toBeInstanceOf(NewLikes);
    expect(newLike.commentId).toEqual(payload.commentId);
    expect(newLike.userId).toEqual(payload.userId);
  });
});
