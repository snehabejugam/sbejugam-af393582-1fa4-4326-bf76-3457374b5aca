import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { Role } from '../entities/role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async seed() {
    // Check if already seeded
    const existingRoles = await this.roleRepository.count();
    if (existingRoles > 0) {
      console.log('✅ Database already seeded!');
      return;
    }

    // Create Roles
    const owner = await this.roleRepository.save({ name: 'Owner' });
    const admin = await this.roleRepository.save({ name: 'Admin' });
    const viewer = await this.roleRepository.save({ name: 'Viewer' });

    // Create Organizations (2-level hierarchy)
    const parentOrg = await this.organizationRepository.save({
      name: 'Parent Company',
      parentOrganizationId: null,
    });
    const childOrg = await this.organizationRepository.save({
      name: 'Child Department',
      parentOrganizationId: parentOrg.id,
    });

    // Create Users
    const hashedPassword = await bcrypt.hash('password123', 10);

    await this.userRepository.save({
      email: 'owner@example.com',
      name: 'Owner User',
      password: hashedPassword,
      roleId: owner.id,
      organizationId: parentOrg.id,
    });

    await this.userRepository.save({
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      roleId: admin.id,
      organizationId: childOrg.id,
    });

    await this.userRepository.save({
      email: 'viewer@example.com',
      name: 'Viewer User',
      password: hashedPassword,
      roleId: viewer.id,
      organizationId: childOrg.id,
    });

    console.log('✅ Database seeded successfully!');
  }
}