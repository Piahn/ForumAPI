const CommentLikeRepository = require('../../Domains/likes/CommentlikeRepository');

class LikesRepositoryPostgres extends CommentLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(commentId, owner) {
    const id = `like-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3, $4)',
      values: [id, commentId, owner, date],
    };

    await this._pool.query(query);
  }

  async verifyLikeExists(commentId, owner) {
    const query = {
      text: 'SELECT * FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);

    return result.rowCount > 0;
  }

  async deleteLikeByCommentIdAndOwner(commentId, owner) {
    const query = {
      text: 'DELETE FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    await this._pool.query(query);
  }

  async getLikeCountByCommentId(commentId) {
    const query = {
      text: 'SELECT COUNT(*)::int as like_count FROM likes WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rows[0].like_count;
  }
}

module.exports = LikesRepositoryPostgres;
