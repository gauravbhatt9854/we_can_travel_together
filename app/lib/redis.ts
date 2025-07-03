
// lib/redis.ts
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});

// 🟢 Log successful connection
redis.on('connect', () => {
  console.log('✅ Redis: Connection established');
});

// 🔄 When Redis is ready to use
redis.on('ready', () => {
  console.log('🚀 Redis: Ready to use');
});

// 🔴 Log errors
redis.on('error', (err) => {
  console.error('❌ Redis: Connection error →', err);
});

// 🟡 When Redis disconnects
redis.on('end', () => {
  console.warn('⚠️ Redis: Connection closed');
});


export default redis;