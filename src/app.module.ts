import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './user/user.entity';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TaskModule,
    TypeOrmModule.forRoot(typeOrmConfig),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSourse: DataSource) {}
}
