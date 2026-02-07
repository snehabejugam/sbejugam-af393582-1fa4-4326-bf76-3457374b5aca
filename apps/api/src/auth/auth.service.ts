// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import * as bcrypt from 'bcrypt';
// import { User } from '../entities/user.entity';
// import { LoginDto } from './dto/login.dto';
// import { RegisterDto } from './dto/register.dto';

// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//     private jwtService: JwtService,
//   ) {}

//   async register(registerDto: RegisterDto) {
//     const { email, password, name, roleId, organizationId } = registerDto;

//     // Check if user already exists
//     const existingUser = await this.userRepository.findOne({ where: { email } });
//     if (existingUser) {
//       throw new UnauthorizedException('User already exists');
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     const user = this.userRepository.create({
//       email,
//       name,
//       password: hashedPassword,
//       roleId,
//       organizationId,
//     });

//     await this.userRepository.save(user);

//     // Return user without password and with token
//     const { password: _, ...userWithoutPassword } = user;
//     return {
//       user: userWithoutPassword,
//       access_token: this.generateToken(user),
//     };
//   }

//   async login(loginDto: LoginDto) {
//     const { email, password } = loginDto;

//     // Find user with role and organization
//     const user = await this.userRepository.findOne({
//       where: { email },
//       relations: ['role', 'organization'],
//     });

//     if (!user) {
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     // Verify password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     // Generate JWT token
//     const token = this.generateToken(user);

//     // Return user without password
//     const { password: _, ...userWithoutPassword } = user;

//     return {
//       access_token: token,
//       user: userWithoutPassword,
//     };
//   }

//   async validateUser(userId: number) {
//     const user = await this.userRepository.findOne({
//       where: { id: userId },
//       relations: ['role', 'organization'],
//     });

//     if (!user) {
//       throw new UnauthorizedException('User not found');
//     }

//     const { password: _, ...userWithoutPassword } = user;
//     return userWithoutPassword;
//   }

//   private generateToken(user: User): string {
//     const payload = {
//       sub: user.id,
//       email: user.email,
//       roleId: user.roleId,
//       organizationId: user.organizationId,
//     };

//     return this.jwtService.sign(payload);
//   }
// }
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name, roleId, organizationId } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = this.userRepository.create({
      email,
      name,
      password: hashedPassword,
      roleId,
      organizationId,
    });

    await this.userRepository.save(user);

    // Return user without password and with token
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      access_token: this.generateToken(user),
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user with role and organization - MUST load relations!
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role', 'organization'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const token = this.generateToken(user);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return {
      access_token: token,
      user: userWithoutPassword,
    };
  }

  async validateUser(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role', 'organization'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      roleId: user.roleId,
      organizationId: user.organizationId,
    };

    return this.jwtService.sign(payload);
  }
}