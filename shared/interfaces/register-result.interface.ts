import { Tenant } from '../entities/tenant.entity';

export interface RegisterResult {
  success: boolean;
  tenant: Tenant;
}
