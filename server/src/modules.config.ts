import { Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from './redis/redis.module';

// redisModule is a dynamic module
// It's different from normal module (or static module)
// Dynamic module allows us pass argurment at run time using static `register` or `registerAsync` method
// What returned by `registerAsync` is a dynamic module
// Dynamic modules must return an object with the exact same interface, plus one additional property called `module`
// In the case of Redis, we want to make sure that we connect to Redis before making our Redis client available to the modules that use it. That's why we use `registerAsync`

export const RedisDynamicModule = RedisModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  // configService is get from 'inject' above
  useFactory: async (configService: ConfigService) => {
    const logger = new Logger('RedisModule');

    return {
      connectionOptions: {
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
      },
      onClientReady: (client) => {
        logger.log('Redis client ready');

        client.on('error', (err) => {
          logger.error('Redis Client Error: ', err);
        });

        client.on('connect', () => {
          logger.log(
            `Connected to redis on ${client.options.host}:${client.options.port}`,
          );
        });
      },
    };
  },
});

export const JwtDynamicModule = JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get('JWT_SECRET'),
    signOptions: {
      expiresIn: parseInt(configService.get('POLL_DURATION')),
    },
  }),
});
