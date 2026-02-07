// // import { Module } from '@nestjs/common';
// // import { JwtModule } from '@nestjs/jwt';
// // import { PassportModule } from '@nestjs/passport';
// // import { TypeOrmModule } from '@nestjs/typeorm';
// // import { ConfigModule, ConfigService } from '@nestjs/config';
// // import { AuthService } from './auth.service';
// // import { AuthController } from './auth.controller';
// // import { JwtStrategy } from './strategies/jwt.strategy';
// // import { User } from '../entities/user.entity';
// // import { SeedModule } from '../seed/seed.module'; 

// // @Module({
// //   imports: [
// //     TypeOrmModule.forFeature([User]),
// //     PassportModule,
// //     JwtModule.registerAsync({
// //       imports: [ConfigModule, SeedModule, AuthModule],
// //       inject: [ConfigService],
// //       useFactory: (configService: ConfigService) => {
// //         return {
// //           secret: configService.get<string>('JWT_SECRET') || 'your-super-secret-jwt-key-change-this-in-production',
// //           signOptions: {
// //             expiresIn: configService.get('JWT_EXPIRATION') || '24h',
// //           },
// //         };
// //       },
// //     }),
// //   ],
// //   controllers: [AuthController],
// //   providers: [AuthService, JwtStrategy],
// //   exports: [AuthService],
// // })
// // export class AuthModule {}
// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { JwtStrategy } from './strategies/jwt.strategy';
// import { User } from '../entities/user.entity';

// @Module({
//   imports: [
//     ConfigModule,  // ← Add this line
//     TypeOrmModule.forFeature([User]),
//     PassportModule,
//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService) => {
//         return {
//           secret: configService.get<string>('JWT_SECRET') || 'your-super-secret-jwt-key-change-this-in-production',
//           signOptions: {
//             expiresIn: configService.get('JWT_EXPIRATION') || '24h',
//           },
//         };
//       },
//     }),
//   ],
//   controllers: [AuthController],
//   providers: [AuthService, JwtStrategy],
//   exports: [AuthService],
// })
// export class AuthModule {}
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),  // ← Already here, just verify
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET') || 'your-super-secret-jwt-key-change-this-in-production',
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRATION') || '24h',
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
