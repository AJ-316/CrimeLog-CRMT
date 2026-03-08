package io.github.aj316.crimelog.backend.dto.cases;

import io.github.aj316.crimelog.backend.dto.AddressDto;
import io.github.aj316.crimelog.backend.model.types.FIR_Type;

import java.time.LocalDateTime;

public record FirDetailDto(
        Long firId,
        String firNumber,
        FIR_Type firType,
        LocalDateTime registrationDateTime,
        LocalDateTime createdDateTime,
        String accusedName,
        String accusedContact,
        AddressDto accusedAddress,
        String originUnitName,
        String initialInvestigatingUnitName,
        AddressDto incidentPlace,
        LocalDateTime incidentDateTime,
        String incidentDescription,
        Long caseId,
        String caseNumber
) {
}

