import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Connection, createConnection } from 'typeorm';

import { AccountEntity } from 'src/accounts/storagelayer/entities/account.entity';

class DBConfig {
  readonly host: string;
  readonly port: number;
  readonly database: string;
  readonly username: string;
  readonly password: string;
  readonly synchronize: boolean;
  readonly logging: boolean;
}

export class RabbitMQConfig {
  readonly exchange: string;
  readonly hostname: string;
  readonly username: string;
  readonly password: string;
}

export class AppService implements OnModuleInit, OnModuleDestroy {
  private databaseConnection?: Connection | void;

  static port(): number {
    const { PORT } = process.env;
    return PORT && Number(PORT) ? Number(PORT) : 5000;
  }


  static rabbitMQConfig(): RabbitMQConfig {
    return {
      exchange: process.env.RABBIT_MQ_EXCHANGE || 'example-exchange',
      hostname: process.env.RABBIT_MQ_HOSTNAME || 'localhost',
      username: process.env.RABBIT_MQ_USER_NAME || 'root',
      password: process.env.RABBIT_MQ_PASSWORD || 'test',
    };
  }

  async onModuleInit(): Promise<void> {
    const entities = [AccountEntity];

    this.databaseConnection = await createConnection({
      ...this.loadDBConfig(),
      type: 'mysql',
      entities,
    }).catch((error: Error) => this.failToConnectDatabase(error));
  }

  private loadDBConfig(): DBConfig {
    return {
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
      database: process.env.DATABASE_NAME || 'cqrsaccounts',
      username: process.env.DATABASE_USER || 'cqrsaccounts',
      password: process.env.DATABASE_PASSWORD || 'cqrsaccounts',
      synchronize: 'true' === process.env.DATABASE_SYNC || true,
      logging: 'true' === process.env.DATABASE_LOGGING || true,
    };
  }

  private failToConnectDatabase(error: Error): void {
    console.error(error);
    process.exit(1);
  }

  async onModuleDestroy(): Promise<void> {
    if (this.databaseConnection) await this.databaseConnection.close();
  }
}
