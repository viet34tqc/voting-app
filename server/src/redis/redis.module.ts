import {
  DynamicModule,
  FactoryProvider,
  Module,
  ModuleMetadata,
} from '@nestjs/common';
import { Redis, RedisOptions } from 'ioredis';

type RedisModuleOptions = {
  connectionOptions: RedisOptions;
  onClientReady?: (client: Redis) => void;
};

type RedisAsyncModuleOptions = {
  // useFactory tells NestJs that we need to resolve any asynchronous data before our module is ready.
  useFactory: (
    ...args: any[]
  ) => Promise<RedisModuleOptions> | RedisModuleOptions;
} & Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider, 'inject'>;

export const IORedisKey = 'IORedis';

@Module({})
export class RedisModule {
  static async registerAsync({
    useFactory,
    imports,
    inject,
  }: RedisAsyncModuleOptions): Promise<DynamicModule> {
    const redisProvider = {
      provide: IORedisKey,
      useFactory: async (...args) => {
        const { connectionOptions, onClientReady } = await useFactory(...args);

        const client = await new Redis(connectionOptions);

        onClientReady(client);

        return client;
      },
      inject,
    };
    return {
      module: RedisModule,
      imports: imports,
      exports: [redisProvider],
      providers: [redisProvider],
    };
  }
}
