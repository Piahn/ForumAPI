const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');

describe('/threads endpoints concerning CRUD', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // arrange
      const requestPayload = {
        title: 'lorem ipsum',
        body: 'dolor sit amet',
      };

      const server = await createServer(container);

      // Add user And Get Tokens
      const { accessToken } = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.id).toBeDefined();
      expect(responseJson.data.addedThread.title).toBeDefined();
      expect(responseJson.data.addedThread.owner).toBeDefined();
    });

    it('should respond with 403 when no access token is provided', async () => {
      // arrange
      const requestPayload = {
        title: 'lorem ipsum',
        body: 'dolor sit amet',
      };

      const server = await createServer(container);

      // Mising Users and AccessToken

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response with 400 when payload does not meet structure specifications', async () => {
      // arrange
      const requestPayload = {
        title: 'lorem ipsum',
        // Missing body
      };

      const server = await createServer(container);

      // Add user and login
      const { accessToken } = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response with 400 when payload does not meet data type specifications', async () => {
      // arrange
      const requestPayload = {
        title: 'lorem ipsum',
        body: 123, // should be string
      };

      const server = await createServer(container);

      // Add user and login
      const { accessToken } = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should respond with 200 with thread details and comments', async () => {
      const server = await createServer(container);

      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'JohnDoe' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'JaneDoe' });
      await ThreadableTestHelper.addThread({ id: threadId, owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId, owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-456', threadId, owner: 'user-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-456', owner: 'user-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-456', commentId: 'comment-123', owner: 'user-456' });

      // action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(2);
      expect(responseJson.data.thread.comments[0].replies).toHaveLength(1);
      expect(responseJson.data.thread.comments[1].replies).toHaveLength(1);
    });

    it('should respond with 200 and with thread details with empty comments', async () => {
      const server = await createServer(container);

      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'John Doe' });
      await ThreadableTestHelper.addThread({ id: threadId, owner: 'user-123' });

      // action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(0);
    });

    it('should respond with 404 if thread does not exist', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/xyz',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should respond with 200 with thread details, comments, replies, and correct likeCount', async () => {
      const server = await createServer(container);

      const threadId = 'thread-123';
      // Setup Users
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'JohnDoe' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'JaneDoe' });

      // Setup Thread
      await ThreadableTestHelper.addThread({ id: threadId, owner: 'user-123' });

      // Setup Comments
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId, owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-456', threadId, owner: 'user-123' });

      // Setup Likes (Manual injection via helper)
      // Comment-123 disukai oleh 2 user
      await LikesTableTestHelper.addLike({ id: 'like-1', commentId: 'comment-123', owner: 'user-123' });
      await LikesTableTestHelper.addLike({ id: 'like-2', commentId: 'comment-123', owner: 'user-456' });

      // Setup Replies
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-456', owner: 'user-123' });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();

      const { thread } = responseJson.data;
      expect(thread).toBeDefined();
      expect(thread.id).toEqual(threadId);
      expect(thread.comments).toHaveLength(2);

      // Verifikasi Comment 1 (Harus punya 2 like)
      const comment1 = thread.comments.find((c) => c.id === 'comment-123');
      expect(comment1).toBeDefined();
      expect(comment1.likeCount).toEqual(2); // Validasi likeCount
      expect(typeof comment1.likeCount).toEqual('number');

      // Verifikasi Comment 2 (Harus punya 0 like)
      const comment2 = thread.comments.find((c) => c.id === 'comment-456');
      expect(comment2).toBeDefined();
      expect(comment2.likeCount).toEqual(0); // Validasi likeCount
    });
  });
});
