import { BadRequestException, ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CreateVesselDetailsDto, CreateVesselWithDetailsDto } from './dto/vessel.dto';

@Injectable()
export class VesselService {
    constructor (private readonly prisma: PrismaService) {}

    async getVessels(user: RequestUser) {
        // Auth check first
        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: {
                employee: {
                include: {
                    person: true,
                    position: true,
                },
                },
                user_roles: true,
            },
        });
    
        if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
            throw new BadRequestException(`User does not exist.`);
        }
    
        const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
        const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));
    
        if (!canView) {
            throw new ForbiddenException('You are not authorized to perform this action');
        }

        const vessels = await this.prisma.vessel.findMany({
            where: {
                is_active: true
            },
            include: {
                vesselDetails: true,
            }
        })

        return {
            status: 'success',
            message: 'Here is the list of Vessels',
            vessels,
        }
    }

    async getVessel(user: RequestUser, vesselId: string) {
        // Auth check first
        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: {
                employee: {
                include: {
                    person: true,
                    position: true,
                },
                },
                user_roles: true,
            },
        });

        if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
            throw new BadRequestException(`User does not exist.`);
        }
    
        const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
        const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));
    
        if (!canView) {
            throw new ForbiddenException('You are not authorized to perform this action');
        }

        const vessel = await this.prisma.vessel.findUnique({
            where: { id: vesselId, is_active: true },
            include: {
                vesselDetails: true,
            }
        })

        if (vessel?.is_active === false) {
            throw new BadRequestException ('Vessel is not active or deactivated')
        }

        return {
            status: 'success',
            message: 'Here is the Vessel',
            vessel
        }
    }

    async createVessel(user: RequestUser, dto: CreateVesselWithDetailsDto) {
        const { vessel, vessel_details } = dto;

        // Auth check first
        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: {
                employee: {
                include: {
                    person: true,
                    position: true,
                },
                },
                user_roles: true,
            },
        });

        if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
            throw new BadRequestException(`User does not exist.`);
        }
    
        const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
        const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));
    
        if (!canView) {
            throw new ForbiddenException('You are not authorized to perform this action');
        }

        const existingVessel = await this.prisma.vessel.findFirst({
            where: {
                name: vessel.name
            },
        });

        if (existingVessel) {
            throw new ConflictException('Vessel already exist!');
        }

        const newVessel = await this.prisma.vessel.create({
            data: {
                company_id: vessel.company_id,
                name: vessel.name,
                type: vessel.type,
                vesselDetails: {
                    create: {
                        price_sold: vessel_details.price_sold,
                        price_paid: vessel_details.price_paid,
                        length_loa: vessel_details.length_loa,
                        length_lbp: vessel_details.length_lbp,
                        breadth: vessel_details.breadth,
                        depth: vessel_details.depth,
                        draft: vessel_details.draft,
                        year_built: vessel_details.year_built,
                        builder: vessel_details.builder,
                        place_built: vessel_details.place_built,
                        jap_dwt: vessel_details.jap_dwt,
                        bale_capacity: vessel_details.bale_capacity,
                        grain_capacity: vessel_details.grain_capacity,
                        hatch_size: vessel_details.hatch_size,
                        hatch_type: vessel_details.hatch_type,
                        hull_type: vessel_details.hull_type,
                        hull_number: vessel_details.hull_number,
                        fuel_type: vessel_details.fuel_type,
                        gearbox_ratio: vessel_details.gearbox_ratio,
                        year_last_drydocked: vessel_details.year_last_drydock,
                        place_last_drydocked: vessel_details.place_last_drydock,
                        phil_dwt: vessel_details.phil_dwt,
                        gross_tonnage: vessel_details.gross_tonnage,
                        net_tonnage: vessel_details.net_tonnage,
                        main_engine: vessel_details.main_engine_rating,
                        main_engine_rating: vessel_details.main_engine_rating,
                        main_engine_actual_rating: vessel_details.main_engine_actual_rating,
                        model_serial_no: vessel_details.model_serial_no,
                        estimated_fuel_consumption: vessel_details.estimated_fuel_consumption,
                        bow_thrusters: vessel_details.bow_thrusters,
                        propeller: vessel_details.propeller,
                        call_sign: vessel_details.call_sign,
                        imo_no: vessel_details.imo_no,
                        mmsi_no: vessel_details.mmsi_no,
                        maiden_voyage: vessel_details.maiden_voyage
                            ? new Date(vessel_details.maiden_voyage)
                            : undefined,
                        min_main_engine_rating: vessel_details.min_main_engine_rating,
                        max_main_engine_rating: vessel_details.max_main_engine_rating,
                        auxillary_engine_1_rating: vessel_details.auxillary_engine_1_rating,
                        auxillary_engine_2_rating: vessel_details.auxillary_engine_2_rating,
                        auxillary_engine_3_rating: vessel_details.auxillary_engine_3_rating,
                        generator_set_rating: vessel_details.generator_set_rating,
                        crane_rating: vessel_details.crane_rating,
                        is_coupled_generator: vessel_details.is_coupled_generator,
                        min_service_knots: vessel_details.min_service_knots,
                        max_service_knots: vessel_details.max_service_knots,
                        bank_account_number: vessel_details.bank_account_number,
                        bank_account_name: vessel_details.bank_account_name,
                    }
                }
            }
        })

        return {
            status: 'success',
            message: 'New vessel has been created',
            newVessel
        }
    }
}
