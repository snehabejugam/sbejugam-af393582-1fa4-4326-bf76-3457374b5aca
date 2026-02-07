// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from '../entities/user.entity';
// import { Organization } from '../entities/organization.entity';
// import { Role } from '../entities/role.entity';
// import { Task } from '../entities/task.entity';
// import { AuditLog } from '../entities/audit-log.entity';
// import { AuthModule } from '../auth/auth.module';

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'sqlite',
//       database: 'database.sqlite',
//       entities: [User, Organization, Role, Task, AuditLog],
//       synchronize: true, // Only for development!
//     }),
//      AuthModule,
//   ],
// })
// export class AppModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { Role } from '../entities/role.entity';
import { Task } from '../entities/task.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { AuthModule } from '../auth/auth.module';
import { TasksModule } from '../tasks/tasks.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { SeedModule } from '../seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, Organization, Role, Task, AuditLog],
      synchronize: true, // Only for development!
    }),
    SeedModule,
    AuthModule,
    TasksModule,
    AuditLogModule,
  ],
})
export class AppModule {}