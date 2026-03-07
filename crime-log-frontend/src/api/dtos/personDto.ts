import type {Gender} from "../types.ts";
import type {AddressDto} from "./addressDto.ts";

export interface PersonDto {
    nationalId: string,
    firstName: string,
    middleName: string,
    lastName: string,
    profilePhotoPath: string,
    dateOfBirth: string,
    gender: Gender,
    nationalityCode: string,
    birthPlace: AddressDto,
    permanentAddress: AddressDto,
    currentAddress: AddressDto,
    contactPrimary: string,
    contactSecondary: string
}