import constants from './constants';

export default () => ({
  databaseUri: process.env['MONGODB_URI'] || constants.ENV_DEFAULTS.MONGODB_URI,
  redisUrl: process.env['REDIS_URL'] || constants.ENV_DEFAULTS.REDIS_URL,
  setupRedis: /true/i.test(process.env['SETUP_REDIS']),
});
