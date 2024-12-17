import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { RiskProfileController } from './risk-profile.controller';
import { RiskProfileService } from './risk-profile.service';
import { RiskProfile } from '../entities/risk-profile.entity';
@Module({
    imports: [
        MikroOrmModule.forFeature([RiskProfile])
    ],
    controllers: [RiskProfileController],
    providers: [RiskProfileService],
    exports: [RiskProfileService]
})
export class RiskProfileModule {
}
