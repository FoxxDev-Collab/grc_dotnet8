import { Module } from '@nestjs/common';
import { ClientUsersService } from './client-users.service';
import { ClientUsersController } from './client-users.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ClientUser } from '../entities/client-user.entity';
import { Organization } from '../entities/organization.entity';
import { UserOrganization } from '../entities/user-organization.entity';
@Module({
    imports: [
        MikroOrmModule.forFeature([
            ClientUser,
            Organization,
            UserOrganization
        ])
    ],
    controllers: [ClientUsersController],
    providers: [ClientUsersService],
    exports: [ClientUsersService],
})
export class ClientUsersModule {
}
