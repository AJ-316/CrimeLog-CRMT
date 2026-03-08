package io.github.aj316.crimelog.backend.service;

import io.github.aj316.crimelog.backend.dto.AgencyDto;
import io.github.aj316.crimelog.backend.dto.AgencyOptionDto;
import io.github.aj316.crimelog.backend.model.institutes.Agency;
import io.github.aj316.crimelog.backend.repository.AgencyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class AgencyService {

    private final AgencyRepository agencyRepository;

    public AgencyService(AgencyRepository agencyRepository) {
        this.agencyRepository = agencyRepository;
    }

    public String createAgency(AgencyDto agencyDto) {
        Agency agency = agencyDto.mapToEntity();

        if (agencyDto.parentAgencyId() != null)
            agency.setParentAgency(agencyRepository.findById(agencyDto.parentAgencyId())
                    .orElseThrow(() -> new NoSuchElementException("Agency with id " + agencyDto.parentAgencyId() + " does not exist")));

        agencyRepository.save(agency);
        return "Agency created successfully";
    }

    public List<AgencyOptionDto> getAgencies() {
        return agencyRepository.findAllByOrderByNameAsc().stream()
                .map(agency -> new AgencyOptionDto(
                        agency.getAgencyId(),
                        agency.getName(),
                        agency.getAgencyType()
                ))
                .toList();
    }
}
