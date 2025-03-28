const redis = require("redis");
require("dotenv").config();

const client = redis.createClient({url: process.env.REDIS_URL});

client.connect()
  .then(async () => {
    await client.set("test:key", "Hello from Redis Cloud!");
    const value = await client.get("test:key");
    console.log(value);
    await client.quit();
  })
  .catch(console.error);
