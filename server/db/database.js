import Sequelize from 'sequelize';

export const sequelize = new Sequelize(
  process.env.DB_SCHEMA || 'database',
  process.env.DB_USER || null,
  process.env.DB_PASSWORD || null,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || null,
    dialect: 'sqlite',
    storage: process.env.USER_SQLITE_FILE || './users.sqlite'
  }
);

export const User = sequelize.define('User', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
