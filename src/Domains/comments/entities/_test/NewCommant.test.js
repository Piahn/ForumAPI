const NewComment = require('../NewComment');

describe('a NewComment entities', () => {
  it('should throw error if payload does not meet criteria', () => {
    // arrange
    const payload = {
      content: 'is comment',
      threadId: 'thread-123,',
      userId: 'user-123',
    };

    // action & assert
    expect(() => new NewComment(payload)).toThrow('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload has invalid data type', () => {
    const payload = {
      content: {},
      threadId: 678,
      owner: 234,
      username: {},
    };

    // action & assert
    expect(() => new NewComment(payload)).toThrow('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewComment object properly', () => {
    // Arrange
    const payload = {
      content: 'some kind of body',
      threadId: 'thread-123',
      owner: 'user-123',
      username: 'John Doe',
    };

    // Action
    const newComment = new NewComment(payload);

    // Assert
    expect(newComment.content).toEqual(payload.content);
    expect(newComment.threadId).toEqual(payload.threadId);
    expect(newComment.owner).toEqual(payload.owner);
  });
});
