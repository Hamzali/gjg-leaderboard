const Redis = require('ioredis');
const faker = require('faker');

const redis = new Redis(
  'redis://h:p33eaa662908ffe23142361f8b75e94406fd00d4e45139a9f726b05de50bddfec@ec2-34-228-0-121.compute-1.amazonaws.com:27409',
);

const testCount = 1000;
async function generateMockData() {
  const tasks = [];
  for (let i = 0; i < testCount; i += 1) {
    tasks.push(
      redis.zadd(
        `leaderboard:${faker.address.countryCode()}`,
        faker.random.number(),
        `${faker.name.firstName()}:${faker.random.uuid()}`,
      ),
    );
  }

  await Promise.all(tasks);
}

async function main() {
  //   const rank = await redis.zrevrank(
  //     'leaderboard:HT',
  //     'Marc:80d4e4b9-6bcb-4617-9d10-fb747dce9238',
  //     // 'Amani:a63cdc12-90b3-4ba1-84d5-40572ede2153',
  //   );
  //   console.log('rank', rank);

  const result = await redis.zrangebyscore(
    'leaderboard:HT',
    100,
    90000,
    'WITHSCORES',
  );
  console.log(result);
  redis.disconnect();
}

main().catch(console.error);
