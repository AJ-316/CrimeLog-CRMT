package io.github.aj316.crimelog.backend.service;

import io.github.aj316.crimelog.backend.dto.cases.*;
import io.github.aj316.crimelog.backend.model.cases.Case;
import io.github.aj316.crimelog.backend.model.cases.CaseLawyer;
import io.github.aj316.crimelog.backend.model.cases.FIR;
import io.github.aj316.crimelog.backend.model.cases.parties.CasePerson;
import io.github.aj316.crimelog.backend.model.institutes.DepartmentUnit;
import io.github.aj316.crimelog.backend.model.people.Person;
import io.github.aj316.crimelog.backend.repository.*;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Stream;

@Service
public class CaseService {

    private final CaseRepository caseRepository;
    private final FirRepository firRepository;
    private final DepartmentUnitRepository departmentUnitRepository;
    private final CasePersonRepository casePersonRepository;
    private final PersonRepository personRepository;
    private final CaseLawyerRepository caseLawyerRepository;

    public CaseService(CaseRepository caseRepository, FirRepository firRepository, DepartmentUnitRepository departmentUnitRepository, CasePersonRepository casePersonRepository, PersonRepository personRepository, CaseLawyerRepository caseLawyerRepository) {
        this.caseRepository = caseRepository;
        this.firRepository = firRepository;
        this.departmentUnitRepository = departmentUnitRepository;
        this.casePersonRepository = casePersonRepository;
        this.personRepository = personRepository;
        this.caseLawyerRepository = caseLawyerRepository;
    }

    public List<BasicCaseDetailDto> getBasicCaseDetails() {
        return caseRepository.findAllBasic();
    }

    public List<CaseSummaryDto> getCaseSummaries() {
        return caseRepository.findAllByOrderByOpenedOnDesc().stream()
                .map(this::toSummary)
                .toList();
    }

    public CaseDetailDto getCaseDetail(Long caseId) {
        Case caseEntity = caseRepository.findById(caseId)
                .orElseThrow(() -> new NoSuchElementException("Case not found"));

        return toDetail(caseEntity);
    }

    public CaseSummaryDto createCase(CreateCaseRequest request) {
        if (request.caseNumber() == null || request.caseNumber().isBlank()) {
            throw new IllegalArgumentException("Case number is required");
        }

        FIR fir = firRepository.findById(request.firId())
                .orElseThrow(() -> new NoSuchElementException("FIR not found"));

        if (caseRepository.existsByFir_FirId(request.firId())) {
            throw new IllegalStateException("A case already exists for the selected FIR");
        }

        DepartmentUnit investigatingUnit;
        if (request.currentInvestigatingUnitId() != null) {
            investigatingUnit = departmentUnitRepository.findById(request.currentInvestigatingUnitId())
                    .orElseThrow(() -> new NoSuchElementException("Investigating unit not found"));
        } else if (fir.getInitialInvestigatingUnit() != null) {
            investigatingUnit = fir.getInitialInvestigatingUnit();
        } else {
            investigatingUnit = fir.getOriginUnit();
        }

        Case caseEntity = new Case();
        caseEntity.setCaseNumber(request.caseNumber());
        caseEntity.setFir(fir);
        caseEntity.setCurrentInvestigatingUnit(investigatingUnit);

        return toSummary(caseRepository.save(caseEntity));
    }

    public List<CaseParticipantDto> getCaseParticipants(Long caseId) {
        if (!caseRepository.existsById(caseId)) {
            throw new NoSuchElementException("Case not found");
        }

        return casePersonRepository.findByCaseEntity_CaseIdOrderByAddedOnDesc(caseId).stream()
                .map(this::toParticipantDto)
                .toList();
    }

    public CaseParticipantDto addParticipant(Long caseId, CaseParticipantCreateRequest request) {
        Case caseEntity = caseRepository.findById(caseId)
                .orElseThrow(() -> new NoSuchElementException("Case not found"));

        Person person = personRepository.findById(request.personId())
                .orElseThrow(() -> new NoSuchElementException("Person not found"));

        if (request.casePersonType() == null) {
            throw new IllegalArgumentException("Participant role is required");
        }

        if (casePersonRepository.existsByCaseEntity_CaseIdAndPerson_PersonIdAndCasePersonType(caseId, request.personId(), request.casePersonType())) {
            throw new IllegalStateException("Participant is already assigned to the case with this role");
        }

        CasePerson casePerson = new CasePerson();
        casePerson.setCaseEntity(caseEntity);
        casePerson.setPerson(person);
        casePerson.setCasePersonType(request.casePersonType());

        return toParticipantDto(casePersonRepository.save(casePerson));
    }

    public List<CaseSummaryDto> getCasesForLawyer(Long lawyerUserId) {
        LinkedHashMap<Long, CaseSummaryDto> orderedCases = new LinkedHashMap<>();

        for (CaseLawyer caseLawyer : caseLawyerRepository.findByLawyer_UserId(lawyerUserId)) {
            Case caseEntity = caseLawyer.getCaseEntity();
            orderedCases.putIfAbsent(caseEntity.getCaseId(), toSummary(caseEntity));
        }

        return List.copyOf(orderedCases.values());
    }

    private CaseSummaryDto toSummary(Case caseEntity) {
        return new CaseSummaryDto(
                caseEntity.getCaseId(),
                caseEntity.getCaseNumber(),
                caseEntity.getStage(),
                caseEntity.getCourt() != null ? caseEntity.getCourt().getCourtName() : null,
                caseEntity.getOpenedOn(),
                caseEntity.getClosedOn(),
                caseEntity.getCurrentInvestigatingUnit() != null ? caseEntity.getCurrentInvestigatingUnit().getName() : null,
                caseEntity.getFir() != null ? caseEntity.getFir().getFirId() : null,
                caseEntity.getFir() != null ? caseEntity.getFir().getFirNumber() : null
        );
    }

    private CaseDetailDto toDetail(Case caseEntity) {
        List<CaseParticipantDto> participants = getCaseParticipants(caseEntity.getCaseId());
        FIR fir = caseEntity.getFir();
        Optional<Case> linkedCase = caseRepository.findByFir_FirId(fir.getFirId());

        FirSummaryDto firSummary = new FirSummaryDto(
                fir.getFirId(),
                fir.getFirNumber(),
                fir.getFirType(),
                fir.getRegistrationDateTime(),
                buildName(fir.getAccusedFirstName(), fir.getAccusedMiddleName(), fir.getAccusedLastName()),
                fir.getOriginUnit() != null ? fir.getOriginUnit().getName() : null,
                fir.getInitialInvestigatingUnit() != null ? fir.getInitialInvestigatingUnit().getId() : null,
                fir.getInitialInvestigatingUnit() != null ? fir.getInitialInvestigatingUnit().getName() : null,
                fir.getIncidentDateTime(),
                fir.getIncidentPlace() != null ? fir.getIncidentPlace().getCity() : null,
                linkedCase.map(Case::getCaseId).orElse(null),
                linkedCase.map(Case::getCaseNumber).orElse(null)
        );

        return new CaseDetailDto(
                caseEntity.getCaseId(),
                caseEntity.getCaseNumber(),
                caseEntity.getStage(),
                caseEntity.getCourt() != null ? caseEntity.getCourt().getCourtName() : null,
                caseEntity.getOpenedOn(),
                caseEntity.getClosedOn(),
                caseEntity.getCurrentInvestigatingUnit() != null ? caseEntity.getCurrentInvestigatingUnit().getName() : null,
                firSummary,
                participants
        );
    }

    private CaseParticipantDto toParticipantDto(CasePerson casePerson) {
        Person person = casePerson.getPerson();

        return new CaseParticipantDto(
                casePerson.getCasePersonId(),
                person.getPersonId(),
                buildName(person.getFirstName(), person.getMiddleName(), person.getLastName()),
                casePerson.getCasePersonType(),
                person.getContactPrimary(),
                casePerson.getAddedOn()
        );
    }

    private String buildName(String firstName, String middleName, String lastName) {
        return String.join(" ", Stream.of(firstName, middleName, lastName)
                .filter(value -> value != null && !value.isBlank())
                .toList());
    }
}
