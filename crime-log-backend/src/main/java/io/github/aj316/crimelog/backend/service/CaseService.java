package io.github.aj316.crimelog.backend.service;

import io.github.aj316.crimelog.backend.dto.cases.BasicCaseDetailDto;
import io.github.aj316.crimelog.backend.repository.CaseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CaseService {

    private final CaseRepository caseRepository;

    public CaseService(CaseRepository caseRepository) {
        this.caseRepository = caseRepository;
    }

    public List<BasicCaseDetailDto> getBasicCaseDetails() {
        return caseRepository.findAllBasic();
    }
}
