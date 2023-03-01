import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Calander@28',
  database: 'task',
  synchronize: true,
  entities: [User],
};
