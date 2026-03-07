export type AccountStatus =
    | "PENDING"
    | "APPROVED"
    | "REJECTED";

export type ActiveStatus =
    | "ACTIVE"
    | "INACTIVE"
    | "ON_LEAVE"
    | "SUSPENDED"
    | "RETIRED"
    | "TERMINATED";

export const ActiveStatusOptions = [
    "ACTIVE",
    "INACTIVE",
    "ON_LEAVE",
    "SUSPENDED",
    "RETIRED",
    "TERMINATED"
] as const satisfies readonly ActiveStatus[];

export type AgencyType =
    | "CITY"
    | "STATE"
    | "CENTRAL";

export type Gender =
    | "MALE"
    | "FEMALE";

export const GenderOptions = ["MALE", "FEMALE"] as const satisfies readonly Gender[];

export type LawyerSpecialization =
    | "CRIMINAL_LAW"
    | "CIVIL_LAW"
    | "FAMILY_LAW"
    | "CORPORATE_LAW"
    | "INTELLECTUAL_PROPERTY_LAW"
    | "LABOR_AND_EMPLOYMENT_LAW"
    | "ENVIRONMENTAL_LAW"
    | "TAX_LAW";

export const LawyerSpecializationOptions = [
    "CRIMINAL_LAW",
    "CIVIL_LAW",
    "FAMILY_LAW",
    "CORPORATE_LAW",
    "INTELLECTUAL_PROPERTY_LAW",
    "LABOR_AND_EMPLOYMENT_LAW",
    "ENVIRONMENTAL_LAW",
    "TAX_LAW"
] as const satisfies readonly LawyerSpecialization[];

export type LicenseStatus =
    | "ACTIVE"
    | "SUSPENDED"
    | "REVOKED";

export const LicenseStatusOptions = [
    "ACTIVE",
    "SUSPENDED",
    "REVOKED"
] as const satisfies readonly LicenseStatus[];

export type Role =
    | "ADMIN"
    | "LAWYER"
    | "OFFICER"
    | "PUBLIC";

export type UnitRole =
    | "UNIT_HEAD"
    | "UNIT_OFFICER";

export type UnitType =
    | "POLICE_STATION"
    | "HEADQUARTERS"
    | "CYBER_CELL"
    | "CRIMINAL_INVESTIGATION_DEPARTMENT"
    | "SPECIAL_TASK_FORCE"
    | "TRAFFIC"
    | "INTELLIGENCE";

export const UnitTypeInfo: Record<UnitType, { code: string; name: string }> = {
    POLICE_STATION:                     {code: "PS", name: "Police Station"},
    HEADQUARTERS:                       {code: "HQ", name: "Headquarters"},
    CYBER_CELL:                         {code: "CYB", name: "Cyber Cell"},
    CRIMINAL_INVESTIGATION_DEPARTMENT:  {code: "CID", name: "Criminal Investigation Department"},
    SPECIAL_TASK_FORCE:                 {code: "STF", name: "Special Task Force"},
    TRAFFIC:                            {code: "TRAF", name: "Traffic"},
    INTELLIGENCE:                       {code: "INT", name: "Intelligence"}
};
