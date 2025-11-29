const NewThread = require('../NewThread');

describe('a NewThread entity', () => {
  it('should throw error when payload does not meet criteria', () => {
    // Arrange
    const payload = {
      title: 'Hello World',
    };

    // Action And Assert
    expect(() => new NewThread(payload)).toThrow('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload has invalid data type', () => {
    // Arrange
    const payload = {
      title: 1995,
      body: true,
      owner: {},
    };

    // Action And Assert
    expect(() => new NewThread(payload)).toThrow('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewTheread object correctly', () => {
    // Arrange
    const payload = {
      title: 'Hello world',
      body: 'Apa Kabar dunia',
      owner: 'user-1234',
    };

    // Action
    const newThread = new NewThread(payload);

    // Assert
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
  });
});
