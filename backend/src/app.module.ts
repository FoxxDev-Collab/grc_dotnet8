import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthModule } from './auth/auth.module';
import { SystemUsersModule } from './system-users/system-users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { RiskProfileModule } from './risk-profile/risk-profile.module';
import { ClientUsersModule } from './client-users/client-users.module';
import { CatalogModule } from './domain/rmf/catalog.module';
import mikroOrmConfig from '../mikro-orm.config';

@Module({
    imports: [
        MikroOrmModule.forRoot(mikroOrmConfig),
        AuthModule,
        SystemUsersModule,
        OrganizationsModule,
        RiskProfileModule,
        ClientUsersModule,
        CatalogModule,
    ],
})
export class AppModule {}
