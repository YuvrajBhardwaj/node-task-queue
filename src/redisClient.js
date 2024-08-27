import redis from 'redis';

let client;

export function createClient() {
  if (!client) {
    client = redis.createClient({
      url: 'redis://redis:6379'
    });

    client.on('error', (err) => {
      console.error('Redis Client Error', err);
    });

    client.connect().catch(err => console.error('Redis Connection Error:', err));
  }

  return client;
}
