package io.github.aj316.crimelog.backend.service;

import io.github.aj316.crimelog.backend.dto.FirRegisterRequest;
import io.github.aj316.crimelog.backend.model.FIR;
import io.github.aj316.crimelog.backend.model.institutes.DepartmentUnit;
import io.github.aj316.crimelog.backend.model.people.users.OfficerProfile;
import io.github.aj316.crimelog.backend.repository.DepartmentUnitRepository;
import io.github.aj316.crimelog.backend.repository.FirRepository;
import io.github.aj316.crimelog.backend.repository.OfficerProfileRepository;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class FirService {

    private final FirRepository firRepository;
    private final DepartmentUnitRepository departmentUnitRepository;
    private final OfficerProfileRepository officerProfileRepository;

    public FirService(FirRepository firRepository, DepartmentUnitRepository departmentUnitRepository, OfficerProfileRepository officerProfileRepository) {
        this.firRepository = firRepository;
        this.departmentUnitRepository = departmentUnitRepository;
        this.officerProfileRepository = officerProfileRepository;
    }

    public String createFir(FirRegisterRequest firRegisterRequest) {
        FIR fir = firRegisterRequest.mapToEntity();
        Optional<OfficerProfile> officerProfile = officerProfileRepository.findById(firRegisterRequest.officerIdCreatedBy());

        if(officerProfile.isEmpty())
            throw new NoSuchElementException("Officer ID who created the FIR must be provided");

        DepartmentUnit originDepartmentUnit = officerProfile.get().getCurrentPostingUnit();

        if(originDepartmentUnit == null || !departmentUnitRepository.existsById(originDepartmentUnit.getId()))
            throw new NoSuchElementException("Origin department unit does not exist");

        Optional<DepartmentUnit> initialInvestigatingUnitId = departmentUnitRepository.findById(firRegisterRequest.initialInvestigatingUnitId());

        if(initialInvestigatingUnitId.isEmpty())
            throw new NoSuchElementException("Initial investigating unit does not exist");

        fir.setOriginUnit(originDepartmentUnit);
        fir.setInitialInvestigatingUnit(initialInvestigatingUnitId.get());

        fir = firRepository.save(fir);
        return "FIR created with ID: " + fir.getFirId();
    }
}
