// AccountsModule
//---------------------------------

import { Logger, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

// storage layer
import { AccountQueryImplement } from 'src/accounts/storagelayer/queries/account.query.impl';
import { AccountRepositoryImplement } from 'src/accounts/storagelayer/repositories/account.repository';

// interface / system border
import { AccountsController } from 'src/accounts/interface/accounts.controller';

// all command handlers listed here
import { CloseAccountHandler } from 'src/accounts/application/commands/close-account.handler';
import { DepositHandler } from 'src/accounts/application/commands/deposit.handler';
import { OpenAccountHandler } from 'src/accounts/application/commands/open-account.handler';
import { RemitHandler } from 'src/accounts/application/commands/remit.handler';
import { UpdatePasswordHandler } from 'src/accounts/application/commands/update-password.handler';
import { WithdrawHandler } from 'src/accounts/application/commands/withdraw.handler';
import { FindAccountByIdHandler } from 'src/accounts/application/queries/find-account-by-id.handler';
import { FindAccountsHandler } from 'src/accounts/application/queries/find-accounts.handler';

// Factories and Services of Account domain
import { AccountService } from 'src/accounts/domain/service';
import { AccountFactory } from 'src/accounts/domain/factory';

// implementations of torage layer
const storagelayer = [
  AccountRepositoryImplement,
  AccountQueryImplement,
];

const application = [
  CloseAccountHandler,
  DepositHandler,
  OpenAccountHandler,
  RemitHandler,
  UpdatePasswordHandler,
  WithdrawHandler,
  FindAccountByIdHandler,
  FindAccountsHandler,
];

// Services / Factories of domains accounts
const domain = [AccountService, AccountFactory];

@Module({
  imports: [CqrsModule],
  controllers: [AccountsController],
  providers: [Logger, ...storagelayer, ...application, ...domain],
})
export class AccountsModule {}
