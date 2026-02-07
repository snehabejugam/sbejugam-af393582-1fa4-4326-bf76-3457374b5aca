import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { Role } from '../entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Organization, Role])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}