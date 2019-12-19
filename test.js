/**
 * in order to run the test script with parameters use
 * node test.js <app_base_url> <user_count> <submit_score_count> <step_count>
 */
const axios = require('axios');
const faker = require('faker');

const gjgLeaderboardClient = new axios.create({
  baseURL: process.argv[2] || 'http://localhost:3000',
});

/**
 * main request to populate leaderboard and users
 */
async function createUser() {
  try {
    const response = await gjgLeaderboardClient({
      method: 'post',
      url: '/user/create',
      data: {
        display_name: `${faker.name.firstName()}${faker.random.number(100)}`,
        country: faker.address.countryCode(),
      },
    });
    const { user_id } = response.data;
    return user_id;
  } catch (error) {
    console.error('CREATE USER ERROR', error);
  }
}

async function submitScore(userId) {
  await gjgLeaderboardClient({
    method: 'post',
    url: '/score/submit',
    data: {
      user_id: userId,
      score_worth: faker.random.number(1000000),
    },
  }).catch(error => {
    console.error('SUBMIT SCORE ERROR', error);
  });
}

async function bulkSteppedPromiseRunner(method, times, step) {
  const results = [];
  for (let i = 0; i < times; i += step) {
    const result = await Promise.all([...Array(step)].map(() => method()));
    results.push(...result);
  }
  return results;
}

const requestStep = process.argv[5] || 10;

const userRequestCount = process.argv[3] || 100;
async function createUserBulk() {
  return bulkSteppedPromiseRunner(createUser, userRequestCount, requestStep);
}

const scoreSubmitRequestCount = process.argv[4] || 50;
async function submitScores(userIds) {
  bulkSteppedPromiseRunner(
    () => {
      const userIndex = faker.random.number(userIds.length - 1);
      if (userIds[userIndex] == null) {
        return;
      }
      submitScore(userIds[userIndex]);
    },
    scoreSubmitRequestCount,
    requestStep,
  );
}

async function main() {
  const userIds = await createUserBulk();
  await submitScores(userIds);
}

main().catch(console.error);
