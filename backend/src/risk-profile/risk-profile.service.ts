import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { RiskProfile } from '../entities/risk-profile.entity';
import { UpdateRiskProfileDto } from './dto/update-risk-profile.dto';
@Injectable()
export class RiskProfileService {
    constructor(private readonly em: EntityManager) { }
    async update(id: string, updateRiskProfileDto: UpdateRiskProfileDto): Promise<RiskProfile> {
        const riskProfile = await this.em.findOne(RiskProfile, { id });
        if (!riskProfile) {
            throw new NotFoundException(`Risk profile with ID ${id} not found`);
        }
        // Update risk profile properties
        this.em.assign(riskProfile, updateRiskProfileDto);
        // Save changes
        await this.em.flush();
        return riskProfile;
    }
    async findOne(id: string): Promise<RiskProfile> {
        const riskProfile = await this.em.findOne(RiskProfile, { id }, {
            populate: ["organization"]
        });
        if (!riskProfile) {
            throw new NotFoundException(`Risk profile with ID ${id} not found`);
        }
        return riskProfile;
    }
}
