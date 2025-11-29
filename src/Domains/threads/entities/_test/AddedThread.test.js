const AddedThread = require('../AddedThread');

describe('an AddedThread entity', () => {
  it('should throw new error if payload does not meet criteria', () => {
    // Arrange
    const payload = {
      id: 'thread-1234',
      title: 'Hello World',
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrow('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload has invalid data type', () => {
    // Arrange
    const payload = {
      id: 'thread-1234',
      title: 1290,
      owner: true,
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrow('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-1234',
      title: 'Hello World',
      owner: 'Jhon Smit',
    };

    // Action
    const addedThread = new AddedThread(payload);

    // Assert
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.body).toEqual(payload.body);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});
