import { Controller, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { RiskProfileService } from './risk-profile.service';
import { UpdateRiskProfileDto } from './dto/update-risk-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
@Controller("risk-profiles")
@UseGuards(JwtAuthGuard, RolesGuard)
export class RiskProfileController {
    constructor(private readonly riskProfileService: RiskProfileService) { }
    @Patch(":id")
    async update(
    @Param("id")
    id: string, 
    @Body()
    updateRiskProfileDto: UpdateRiskProfileDto) {
        const updatedProfile = await this.riskProfileService.update(id, updateRiskProfileDto);
        return {
            success: true,
            data: updatedProfile
        };
    }
}
