/* eslint-disable camelcase */
exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'comments(id)',
      onDelete: 'CASCADE',
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    date: {
      type: 'TEXT',
      notNull: true,
    },
  });

  // Add unique constraint to prevent duplicate likes
  pgm.addConstraint('likes', 'unique_comment_id_and_owner', 'UNIQUE(comment_id, owner)');
};

exports.down = (pgm) => {
  pgm.dropTable('likes');
};