import { getRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { AccountEntity } from 'src/accounts/storagelayer/entities/account.entity';

import {
  Account,
  AccountQuery,
  Accounts,
} from 'src/accounts/application/queries/account.query';

@Injectable()
export class AccountQueryImplement implements AccountQuery {
  async findById(id: string): Promise<undefined | Account> {
    return this.convertAccountFromEntity(
      await getRepository(AccountEntity).findOne(id),
    );
  }

  async find(offset: number, limit: number): Promise<Accounts> {
    return this.convertAccountsFromEntities(
      await getRepository(AccountEntity).find({ skip: offset, take: limit }),
    );
  }

  private convertAccountFromEntity(
    entity?: AccountEntity,
  ): undefined | Account {
    return entity
      ? { ...entity, openedAt: entity.createdAt, closedAt: entity.deletedAt }
      : undefined;
  }

  private convertAccountsFromEntities(entities: AccountEntity[]): Accounts {
    return entities.map((entity) => ({
      ...entity,
      openedAt: entity.createdAt,
      closedAt: entity.deletedAt,
    }));
  }
}
