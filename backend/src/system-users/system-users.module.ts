import { Module } from '@nestjs/common';
import { SystemUsersService } from './system-users.service';
import { SystemUsersController } from './system-users.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SystemUser } from '../entities/system-user.entity';
@Module({
    imports: [
        MikroOrmModule.forFeature([SystemUser])
    ],
    controllers: [SystemUsersController],
    providers: [SystemUsersService],
    exports: [SystemUsersService]
})
export class SystemUsersModule {
}
