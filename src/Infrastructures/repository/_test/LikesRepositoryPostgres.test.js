const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const LikesRepositoryPostgres = require('../LikesRepositoryPostgres');
const pool = require('../../database/postgres/pool');

describe('LikesRepositoryPostgres', () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLike function', () => {
    it('should persist new like and return correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikesRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepositoryPostgres.addLike('comment-123', 'user-123');

      // Assert
      // PERBAIKAN: Menggunakan parameter object sesuai refactor helper
      const like = await LikesTableTestHelper.getLikeByCommentIdAndOwner({
        commentId: 'comment-123',
        owner: 'user-123',
      });

      expect(like).toBeDefined();
      expect(like.id).toEqual('like-123');
      expect(like.comment_id).toEqual('comment-123');
      expect(like.owner).toEqual('user-123');
    });
  });

  describe('verifyLikeExists function', () => {
    it('should return false when like does not exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      const likeRepositoryPostgres = new LikesRepositoryPostgres(pool, {});

      // Action
      const exists = await likeRepositoryPostgres.verifyLikeExists('comment-123', 'user-123');

      // Assert
      expect(exists).toEqual(false);
    });

    it('should return true when like exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      await LikesTableTestHelper.addLike({
        id: 'like-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const likeRepositoryPostgres = new LikesRepositoryPostgres(pool, {});

      // Action
      const exists = await likeRepositoryPostgres.verifyLikeExists('comment-123', 'user-123');

      // Assert
      expect(exists).toEqual(true);
    });
  });

  describe('deleteLikeByCommentIdAndOwner function', () => {
    it('should delete like from database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      await LikesTableTestHelper.addLike({
        id: 'like-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const likeRepositoryPostgres = new LikesRepositoryPostgres(pool, {});

      // Action
      await likeRepositoryPostgres.deleteLikeByCommentIdAndOwner('comment-123', 'user-123');

      // Assert
      // PERBAIKAN: Menggunakan parameter object sesuai refactor helper
      const like = await LikesTableTestHelper.getLikeByCommentIdAndOwner({
        commentId: 'comment-123',
        owner: 'user-123',
      });
      expect(like).toBeUndefined();
    });
  });

  describe('getLikeCountByCommentId function', () => {
    it('should return correct like count for a comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding2' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      await LikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });
      await LikesTableTestHelper.addLike({ id: 'like-456', commentId: 'comment-123', owner: 'user-456' });

      const likeRepositoryPostgres = new LikesRepositoryPostgres(pool, {});

      // Action
      const likeCount = await likeRepositoryPostgres.getLikeCountByCommentId('comment-123');

      // Assert
      expect(likeCount).toEqual(2);
    });

    it('should return 0 when comment has no likes', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      const likeRepositoryPostgres = new LikesRepositoryPostgres(pool, {});

      // Action
      const likeCount = await likeRepositoryPostgres.getLikeCountByCommentId('comment-123');

      // Assert
      expect(likeCount).toEqual(0);
    });
  });
});
