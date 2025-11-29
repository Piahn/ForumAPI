const AddedComment = require('../AddedComment');

describe('a AddedComment entities', () => {
  it('should throw error if payload does no meet criteria', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'some comment',
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrow('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload has invalid data type', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 145,
      owner: {},
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrow('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedComment object properly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'somekind content',
      owner: 'user-123',
    };

    // Action
    const addedComment = new AddedComment(payload);

    // Assert
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});
