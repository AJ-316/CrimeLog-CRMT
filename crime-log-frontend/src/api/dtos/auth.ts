import type {PersonDto} from "./personDto.ts";
import type {
    ActiveStatus,
    LawyerSpecialization,
    LicenseStatus,
    Role
} from "../types.ts";
import type {AddressDto} from "./addressDto.ts";

export interface LoginRequest {
    email: string,
    password: string
}

export interface RegisterRequestDto {
    email: string,
    password: string,
    role: Role,
    personDto: PersonDto
}

export type RegisterUserRequest = RegisterRequestDto;

export interface RegisterLawyerRequest extends RegisterRequestDto {
    barCouncilId: number,
    barRegistrationNumber: string,
    enrollmentDate: string,
    yearsOfExperience: number,
    specialization: LawyerSpecialization,
    licenseStatus: LicenseStatus,
    firmName: string,
    officeAddress: AddressDto,
    officialContact: string,
    isPublicDefender: boolean
}

export interface RegisterOfficerRequest extends RegisterRequestDto {
    badgeNumber: string,
    departmentUnitId: number,
    joiningDate: string,
    activeStatus: ActiveStatus
}

export type RegisterRequest =
    | RegisterUserRequest
    | RegisterLawyerRequest
    | RegisterOfficerRequest