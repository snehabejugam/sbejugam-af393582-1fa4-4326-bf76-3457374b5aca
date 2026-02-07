import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-super-secret-jwt-key-change-this-in-production',
    });
  }

  async validate(payload: any) {
    // Load user with role and organization relations
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      relations: ['role', 'organization'],
    });
    
    if (!user) {
      throw new UnauthorizedException();
    }

    // Remove password before returning
    const { password, ...userWithoutPassword } = user;
    
    // This will be available as req.user in controllers
    return userWithoutPassword;
  }
}