import { Module, Global } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { RolesGuard } from './guards/roles.guard';

@Global()
@Module({
  providers: [PermissionService, RolesGuard],
  exports: [PermissionService, RolesGuard],
})
export class AuthLibModule {}