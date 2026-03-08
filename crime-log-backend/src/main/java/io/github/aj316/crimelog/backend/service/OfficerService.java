package io.github.aj316.crimelog.backend.service;

import io.github.aj316.crimelog.backend.dto.auth.RegisterOfficerRequest;
import io.github.aj316.crimelog.backend.dto.requests.RequestDto;
import io.github.aj316.crimelog.backend.model.Request;
import io.github.aj316.crimelog.backend.model.cases.Case;
import io.github.aj316.crimelog.backend.model.cases.CaseLawyer;
import io.github.aj316.crimelog.backend.model.institutes.Agency;
import io.github.aj316.crimelog.backend.model.institutes.DepartmentUnit;
import io.github.aj316.crimelog.backend.model.people.users.LawyerProfile;
import io.github.aj316.crimelog.backend.model.people.users.OfficerProfile;
import io.github.aj316.crimelog.backend.model.people.users.User;
import io.github.aj316.crimelog.backend.model.requests.OfficerActionRequest;
import io.github.aj316.crimelog.backend.model.types.*;
import io.github.aj316.crimelog.backend.repository.*;
import org.springframework.stereotype.Service;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
public class OfficerService {

    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;
    private final DepartmentUnitRepository departmentUnitRepository;
    private final OfficerProfileRepository officerProfileRepository;

    private final OfficerActionRequestRepository officerActionRequestRepository;

    private final RequestRepository requestRepository;
    private final CaseRepository caseRepository;
    private final AgencyRepository agencyRepository;
    private final LawyerProfileRepository lawyerProfileRepository;
    private final CaseLawyerRepository caseLawyerRepository;

    public OfficerService(ObjectMapper objectMapper, UserRepository userRepository,
                          DepartmentUnitRepository departmentUnitRepository, OfficerProfileRepository officerProfileRepository, OfficerActionRequestRepository officerActionRequestRepository, RequestRepository requestRepository, CaseRepository caseRepository, AgencyRepository agencyRepository, LawyerProfileRepository lawyerProfileRepository, CaseLawyerRepository caseLawyerRepository) {
        this.objectMapper = objectMapper;
        this.userRepository = userRepository;
        this.departmentUnitRepository = departmentUnitRepository;
        this.officerProfileRepository = officerProfileRepository;
        this.officerActionRequestRepository = officerActionRequestRepository;
        this.requestRepository = requestRepository;
        this.caseRepository = caseRepository;
        this.agencyRepository = agencyRepository;
        this.lawyerProfileRepository = lawyerProfileRepository;
        this.caseLawyerRepository = caseLawyerRepository;
    }

    public String addRequest(RequestDto requestDto) {
        Request request = requestDto.mapToEntity();
        requestRepository.save(request);
        return "Request(" + request.getRequestId() + ") for " + request.getRequestType() + " has been submitted and is pending review.";
    }

    public String updateRequest(Long userId, Long requestId, Status status) { // simple approval logic, can be expanded to giving reason for rejection etc.
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User does not exist"));
        OfficerProfile officerProfile = officerProfileRepository.findById(requestId).orElseThrow(() -> new IllegalArgumentException("Officer profile does not exist"));

        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new NoSuchElementException("Request with id " + requestId + " not found"));

        if(status.equals(Status.PENDING)) return "Request update to PENDING status is not allowed";

        if(status.equals(Status.REJECTED)) {
            request.setStatus(Status.REJECTED);
            requestRepository.save(request);
            return "Request(" + requestId + ") was successfully Rejected";
        }

        request.setStatus(Status.APPROVED);

        Map<String, Object> payload = objectMapper.readValue(
                request.getPayloadJson(),
                new TypeReference<>() {}
        );

        switch (request.getRequestType()) {
            case TRANSFER_UNIT -> {
                if(!user.getRole().equals(Role.OFFICER) || !officerProfile.getRole().equals(UnitRole.UNIT_HEAD))
                    throw new IllegalArgumentException("Only unit heads can approve transfer requests");

                Long targetUnitId = ((Number) payload.get("targetUnitId")).longValue();

                Case caseEntity = caseRepository.findById(request.getCaseId())
                        .orElseThrow(() -> new NoSuchElementException("Case not found"));

                DepartmentUnit unit = departmentUnitRepository.findById(targetUnitId)
                        .orElseThrow(() -> new NoSuchElementException("Department unit not found"));

                caseEntity.setCurrentInvestigatingUnit(unit);
                caseRepository.save(caseEntity);
            }

            case TRANSFER_AGENCY -> {
                if(!user.getRole().equals(Role.ADMIN))
                    throw new IllegalArgumentException("Only admins can approve agency transfer requests");

                Long targetAgencyId = ((Number) payload.get("targetAgencyId")).longValue();

                Case caseEntity = caseRepository.findById(request.getCaseId())
                        .orElseThrow(() -> new NoSuchElementException("Case not found"));

                Agency agency = agencyRepository.findById(targetAgencyId)
                        .orElseThrow(() -> new NoSuchElementException("Agency not found"));

                DepartmentUnit newUnit = departmentUnitRepository
                        .findFirstByAgency(agency)
                        .orElseThrow(() -> new NoSuchElementException("No unit found for agency"));

                caseEntity.setCurrentInvestigatingUnit(newUnit);
                caseRepository.save(caseEntity);
            }

            case LAWYER_CASE_REQUEST -> {
                if(!user.getRole().equals(Role.ADMIN))
                    throw new IllegalArgumentException("Only admins can approve lawyer case assignment requests");

                LawyerProfile lawyer = lawyerProfileRepository
                        .findById(request.getRequestedByUserId())
                        .orElseThrow();

                Case caseEntity = caseRepository.findById(request.getCaseId())
                        .orElseThrow();

                caseLawyerRepository.save(new CaseLawyer(caseEntity, lawyer, LawyerRole.valueOf((String) payload.get("lawyerRole"))));
            }

             case SUBMIT_CHARGE_SHEET -> {
                 if(!user.getRole().equals(Role.ADMIN))
                     throw new IllegalArgumentException("Only admins can approve charge sheet submission requests");

                 Case caseEntity = caseRepository.findById(request.getCaseId()).orElseThrow(() -> new NoSuchElementException("Case not found"));

                 caseEntity.setStage(CaseStage.TRIAL);
                 caseRepository.save(caseEntity);
             }
        }

        request.setReviewedAt(LocalDateTime.now());
        request.setReviewedByUserId(userId);

        requestRepository.save(request);
        return  "Request(" + requestId + ") for " + request.getRequestType() + " has been updated";
    }

    public OfficerProfile registerProfile(Long userId, RegisterOfficerRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User does not exist"));

        if (officerProfileRepository.existsById(userId)) {
            throw new IllegalStateException("Officer profile already exists");
        }

        DepartmentUnit unit = departmentUnitRepository.findById(request.departmentUnitId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid department unit"));

        OfficerProfile profile = new OfficerProfile();
        profile.setUser(user);
        profile.setBadgeNumber(request.badgeNumber());
        profile.setCurrentPostingUnit(unit);
        profile.setJoiningDate(request.joiningDate());
        profile.setActiveStatus(request.activeStatus());

        return officerProfileRepository.save(profile);
    }
}
