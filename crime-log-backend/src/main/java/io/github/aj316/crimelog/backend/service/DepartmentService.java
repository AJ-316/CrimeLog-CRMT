package io.github.aj316.crimelog.backend.service;

import io.github.aj316.crimelog.backend.dto.DepartmentUnitDto;
import io.github.aj316.crimelog.backend.model.institutes.DepartmentUnit;
import io.github.aj316.crimelog.backend.repository.AgencyRepository;
import io.github.aj316.crimelog.backend.repository.DepartmentUnitRepository;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class DepartmentService {

    private final DepartmentUnitRepository departmentUnitRepository;
    private final AgencyRepository agencyRepository;

    public DepartmentService(DepartmentUnitRepository departmentUnitRepository, AgencyRepository agencyRepository) {
        this.departmentUnitRepository = departmentUnitRepository;
        this.agencyRepository = agencyRepository;
    }

    public String createDepartmentUnit(DepartmentUnitDto departmentUnitDto) {
        DepartmentUnit departmentUnit = departmentUnitDto.mapToEntity();

        departmentUnit.setAgency(agencyRepository.findById(departmentUnitDto.agencyId())
                        .orElseThrow(() -> new NoSuchElementException("Agency with provided ID does not exist")));

        departmentUnitRepository.save(departmentUnit);
        return "Department Unit created successfully";
    }
}
