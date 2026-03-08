package io.github.aj316.crimelog.backend.dto.cases;

import io.github.aj316.crimelog.backend.dto.AddressDto;
import io.github.aj316.crimelog.backend.dto.MapDto;
import io.github.aj316.crimelog.backend.model.cases.FIR;
import io.github.aj316.crimelog.backend.model.types.FIR_Type;

import java.time.LocalDateTime;

public record FirRegisterRequest(
        String firNumber,
        FIR_Type firType,
        LocalDateTime registrationDateTime,

        String accusedFirstName,
        String accusedMiddleName,
        String accusedLastName,
        String accusedContact,
        String accusedDescription,
        AddressDto accusedAddress,

        Long initialInvestigatingUnitId,
        Long officerIdCreatedBy, // current logged in officer's id

        AddressDto incidentPlace,
        LocalDateTime incidentDateTime,
        String incidentDescription
) implements MapDto<FIR> {

    @Override
    public FIR mapToEntity() {
        FIR fir = new FIR();
        fir.setFirNumber(firNumber);
        fir.setFirType(firType);
        fir.setRegistrationDateTime(registrationDateTime);
        fir.setAccusedFirstName(accusedFirstName);
        fir.setAccusedMiddleName(accusedMiddleName);
        fir.setAccusedLastName(accusedLastName);
        fir.setAccusedContact(accusedContact);
        fir.setAccusedAddress(accusedAddress.mapToEntity());
        fir.setIncidentPlace(incidentPlace.mapToEntity());
        fir.setIncidentDateTime(incidentDateTime);
        fir.setIncidentDescription(incidentDescription);
        return fir;
    }
}
