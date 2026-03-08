package io.github.aj316.crimelog.backend.service;

import io.github.aj316.crimelog.backend.dto.AddressDto;
import io.github.aj316.crimelog.backend.dto.cases.FirDetailDto;
import io.github.aj316.crimelog.backend.dto.cases.FirRegisterRequest;
import io.github.aj316.crimelog.backend.dto.cases.FirSummaryDto;
import io.github.aj316.crimelog.backend.model.cases.Case;
import io.github.aj316.crimelog.backend.model.cases.FIR;
import io.github.aj316.crimelog.backend.model.institutes.DepartmentUnit;
import io.github.aj316.crimelog.backend.model.people.users.OfficerProfile;
import io.github.aj316.crimelog.backend.repository.CaseRepository;
import io.github.aj316.crimelog.backend.repository.DepartmentUnitRepository;
import io.github.aj316.crimelog.backend.repository.FirRepository;
import io.github.aj316.crimelog.backend.repository.OfficerProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Stream;

@Service
public class FirService {

    private final FirRepository firRepository;
    private final CaseRepository caseRepository;
    private final DepartmentUnitRepository departmentUnitRepository;
    private final OfficerProfileRepository officerProfileRepository;

    public FirService(FirRepository firRepository, CaseRepository caseRepository, DepartmentUnitRepository departmentUnitRepository, OfficerProfileRepository officerProfileRepository) {
        this.firRepository = firRepository;
        this.caseRepository = caseRepository;
        this.departmentUnitRepository = departmentUnitRepository;
        this.officerProfileRepository = officerProfileRepository;
    }

    public List<FirSummaryDto> getFirs() {
        return firRepository.findAllByOrderByRegistrationDateTimeDesc().stream()
                .map(this::toSummary)
                .toList();
    }

    public FirDetailDto getFir(Long firId) {
        FIR fir = firRepository.findById(firId)
                .orElseThrow(() -> new NoSuchElementException("FIR not found"));

        Optional<Case> linkedCase = caseRepository.findByFir_FirId(firId);

        return new FirDetailDto(
                fir.getFirId(),
                fir.getFirNumber(),
                fir.getFirType(),
                fir.getRegistrationDateTime(),
                fir.getCreatedDateTime(),
                buildName(fir.getAccusedFirstName(), fir.getAccusedMiddleName(), fir.getAccusedLastName()),
                fir.getAccusedContact(),
                AddressDto.mapToDto(fir.getAccusedAddress()),
                getUnitName(fir.getOriginUnit()),
                getUnitName(fir.getInitialInvestigatingUnit()),
                AddressDto.mapToDto(fir.getIncidentPlace()),
                fir.getIncidentDateTime(),
                fir.getIncidentDescription(),
                linkedCase.map(Case::getCaseId).orElse(null),
                linkedCase.map(Case::getCaseNumber).orElse(null)
        );
    }

    public String createFir(FirRegisterRequest firRegisterRequest) {
        FIR fir = firRegisterRequest.mapToEntity();
        Optional<OfficerProfile> officerProfile = officerProfileRepository.findById(firRegisterRequest.officerIdCreatedBy());

        if (officerProfile.isEmpty())
            throw new NoSuchElementException("Officer ID who created the FIR must be provided");

        DepartmentUnit originDepartmentUnit = officerProfile.get().getCurrentPostingUnit();

        if (originDepartmentUnit == null || !departmentUnitRepository.existsById(originDepartmentUnit.getId()))
            throw new NoSuchElementException("Origin department unit does not exist");

        Optional<DepartmentUnit> initialInvestigatingUnitId = departmentUnitRepository.findById(firRegisterRequest.initialInvestigatingUnitId());

        if (initialInvestigatingUnitId.isEmpty())
            throw new NoSuchElementException("Initial investigating unit does not exist");

        fir.setOriginUnit(originDepartmentUnit);
        fir.setInitialInvestigatingUnit(initialInvestigatingUnitId.get());
        fir.setCreatedBy(officerProfile.get());

        fir = firRepository.save(fir);
        return "FIR created with ID: " + fir.getFirId();
    }

    private FirSummaryDto toSummary(FIR fir) {
        Optional<Case> linkedCase = caseRepository.findByFir_FirId(fir.getFirId());

        return new FirSummaryDto(
                fir.getFirId(),
                fir.getFirNumber(),
                fir.getFirType(),
                fir.getRegistrationDateTime(),
                buildName(fir.getAccusedFirstName(), fir.getAccusedMiddleName(), fir.getAccusedLastName()),
                getUnitName(fir.getOriginUnit()),
                getUnitName(fir.getInitialInvestigatingUnit()),
                fir.getIncidentDateTime(),
                fir.getIncidentPlace() != null ? fir.getIncidentPlace().getCity() : null,
                linkedCase.map(Case::getCaseId).orElse(null),
                linkedCase.map(Case::getCaseNumber).orElse(null)
        );
    }

    private String getUnitName(DepartmentUnit unit) {
        return unit != null ? unit.getName() : null;
    }

    private String buildName(String firstName, String middleName, String lastName) {
        return String.join(" ", Stream.of(firstName, middleName, lastName)
                .filter(value -> value != null && !value.isBlank())
                .toList());
    }
}
