package io.github.aj316.crimelog.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.aj316.crimelog.backend.dto.auth.RegisterOfficerRequest;
import io.github.aj316.crimelog.backend.dto.requests.RequestDto;
import io.github.aj316.crimelog.backend.dto.requests.RequestSummaryDto;
import io.github.aj316.crimelog.backend.model.Request;
import io.github.aj316.crimelog.backend.model.cases.Case;
import io.github.aj316.crimelog.backend.model.cases.CaseLawyer;
import io.github.aj316.crimelog.backend.model.institutes.Agency;
import io.github.aj316.crimelog.backend.model.institutes.DepartmentUnit;
import io.github.aj316.crimelog.backend.model.people.users.LawyerProfile;
import io.github.aj316.crimelog.backend.model.people.users.OfficerProfile;
import io.github.aj316.crimelog.backend.model.people.users.User;
import io.github.aj316.crimelog.backend.model.types.*;
import io.github.aj316.crimelog.backend.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Stream;

@Service
public class OfficerService {

    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;
    private final DepartmentUnitRepository departmentUnitRepository;
    private final OfficerProfileRepository officerProfileRepository;

    private final RequestRepository requestRepository;
    private final CaseRepository caseRepository;
    private final AgencyRepository agencyRepository;
    private final LawyerProfileRepository lawyerProfileRepository;
    private final CaseLawyerRepository caseLawyerRepository;

    public OfficerService(ObjectMapper objectMapper, UserRepository userRepository,
                          DepartmentUnitRepository departmentUnitRepository, OfficerProfileRepository officerProfileRepository, RequestRepository requestRepository, CaseRepository caseRepository, AgencyRepository agencyRepository, LawyerProfileRepository lawyerProfileRepository, CaseLawyerRepository caseLawyerRepository) {
        this.objectMapper = objectMapper;
        this.userRepository = userRepository;
        this.departmentUnitRepository = departmentUnitRepository;
        this.officerProfileRepository = officerProfileRepository;
        this.requestRepository = requestRepository;
        this.caseRepository = caseRepository;
        this.agencyRepository = agencyRepository;
        this.lawyerProfileRepository = lawyerProfileRepository;
        this.caseLawyerRepository = caseLawyerRepository;
    }

    public String addRequest(RequestDto requestDto) {
        Request request = requestDto.mapToEntity();
        Case caseEntity = null;

        if (request.getCaseId() == null) {
            if (request.getFirId() == null) {
                throw new IllegalArgumentException("Either caseId or firId must be provided");
            }

            caseEntity = caseRepository.findByFir_FirId(request.getFirId())
                    .orElseThrow(() -> new NoSuchElementException("No case found for FIR id " + request.getFirId()));
            request.setCaseId(caseEntity.getCaseId());
        }

        if (request.getFirId() == null) {
            caseEntity = caseEntity != null ? caseEntity : caseRepository.findById(request.getCaseId())
                    .orElseThrow(() -> new NoSuchElementException("Case not found"));
            request.setFirId(caseEntity.getFir().getFirId());
        }

        if (request.getRequestType() == null) {
            throw new IllegalArgumentException("requestType is required");
        }

        if (request.getRequestedByUserId() == null) {
            throw new IllegalArgumentException("requestedByUserId is required");
        }

        if (request.getStatus() == null) {
            request.setStatus(Status.PENDING);
        }

        requestRepository.save(request);
        return "Request(" + request.getRequestId() + ") for " + request.getRequestType() + " has been submitted and is pending review.";
    }

    public List<RequestSummaryDto> getPendingRequests() {
        return requestRepository.findByStatusOrderByCreatedAtDesc(Status.PENDING).stream()
                .map(this::toSummary)
                .toList();
    }

    public List<RequestSummaryDto> getRequestsForUser(Long userId) {
        return requestRepository.findByRequestedByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toSummary)
                .toList();
    }

    public String updateRequest(Long userId, Long requestId, Status status) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User does not exist"));
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new NoSuchElementException("Request with id " + requestId + " not found"));

        if (status == null) {
            throw new IllegalArgumentException("Status is required");
        }

        if (status.equals(Status.PENDING)) return "Request update to PENDING status is not allowed";

        request.setReviewedAt(LocalDateTime.now());
        request.setReviewedByUserId(userId);

        if(status.equals(Status.REJECTED)) {
            request.setStatus(Status.REJECTED);
            requestRepository.save(request);
            return "Request(" + requestId + ") was successfully Rejected";
        }

        if (user.getRole().equals(Role.OFFICER)) {
            OfficerProfile reviewerProfile = officerProfileRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("Officer profile does not exist"));

            if (!reviewerProfile.getRole().equals(UnitRole.UNIT_HEAD)) {
                throw new IllegalArgumentException("Only unit heads can approve officer requests");
            }
        } else if (!user.getRole().equals(Role.ADMIN)) {
            throw new IllegalArgumentException("Only admins or eligible officers can approve requests");
        }

        request.setStatus(Status.APPROVED);

        Map<String, Object> payload;
        try {
            payload = objectMapper.readValue(
                    request.getPayloadJson(),
                    new TypeReference<>() {}
            );
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            throw new IllegalArgumentException("Invalid payload JSON in request", e);
        }

        switch (request.getRequestType()) {
            case TRANSFER_UNIT -> {
                if (user.getRole().equals(Role.OFFICER)) {
                    OfficerProfile reviewerProfile = officerProfileRepository.findById(userId)
                            .orElseThrow(() -> new IllegalArgumentException("Officer profile does not exist"));
                    if(!reviewerProfile.getRole().equals(UnitRole.UNIT_HEAD)) {
                        throw new IllegalArgumentException("Only unit heads can approve transfer requests");
                    }
                }

                Long targetUnitId = requireLongPayloadField(payload, "targetUnitId", request.getRequestType());

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

                Long targetAgencyId = requireLongPayloadField(payload, "targetAgencyId", request.getRequestType());

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

                String lawyerRoleValue = requireStringPayloadField(payload, "lawyerRole", request.getRequestType());
                caseLawyerRepository.save(new CaseLawyer(caseEntity, lawyer, LawyerRole.valueOf(lawyerRoleValue)));
            }

             case SUBMIT_CHARGE_SHEET -> {
                 if(!user.getRole().equals(Role.ADMIN))
                     throw new IllegalArgumentException("Only admins can approve charge sheet submission requests");

                 Case caseEntity = caseRepository.findById(request.getCaseId()).orElseThrow(() -> new NoSuchElementException("Case not found"));

                 caseEntity.setStage(CaseStage.TRIAL);
                 caseRepository.save(caseEntity);
             }
        }

        requestRepository.save(request);
        return  "Request(" + requestId + ") for " + request.getRequestType() + " has been updated";
    }

    public String deleteRequest(Long actorUserId, Role actorRole, Long requestId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new NoSuchElementException("Request with id " + requestId + " not found"));

        if (request.getStatus() != Status.PENDING) {
            throw new IllegalStateException("Only pending requests can be deleted");
        }

        boolean isAdmin = actorRole == Role.ADMIN;
        boolean isOwner = request.getRequestedByUserId() != null && request.getRequestedByUserId().equals(actorUserId);

        if (!isAdmin && !isOwner) {
            throw new IllegalArgumentException("Only the request owner or an admin can delete this request");
        }

        requestRepository.delete(request);
        return "Request(" + requestId + ") deleted successfully";
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

    private RequestSummaryDto toSummary(Request request) {
        User requester = userRepository.findById(request.getRequestedByUserId())
                .orElseThrow(() -> new NoSuchElementException("Requester not found"));

        Case caseEntity = caseRepository.findById(request.getCaseId())
                .orElse(null);

        return new RequestSummaryDto(
                request.getRequestId(),
                request.getRequestType(),
                request.getCaseId(),
                caseEntity != null ? caseEntity.getCaseNumber() : null,
                request.getFirId(),
                buildName(requester),
                request.getStatus(),
                request.getReason(),
                request.getCreatedAt(),
                request.getReviewedAt(),
                buildTargetLabel(request)
        );
    }

    private String buildTargetLabel(Request request) {
        Map<String, Object> payload;
        try {
            payload = objectMapper.readValue(request.getPayloadJson(), new TypeReference<>() {});
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            return "Unknown target";
        }

        return switch (request.getRequestType()) {
            case TRANSFER_UNIT -> {
                Object targetUnitId = payload.get("targetUnitId");
                if (targetUnitId instanceof Number number) {
                    yield departmentUnitRepository.findById(number.longValue())
                            .map(DepartmentUnit::getName)
                            .orElse(null);
                }
                yield null;
            }
            case TRANSFER_AGENCY -> {
                Object targetAgencyId = payload.get("targetAgencyId");
                if (targetAgencyId instanceof Number number) {
                    yield agencyRepository.findById(number.longValue())
                            .map(Agency::getName)
                            .orElse(null);
                }
                yield null;
            }
            case LAWYER_CASE_REQUEST -> payload.get("lawyerRole") instanceof String role ? role : null;
            case SUBMIT_CHARGE_SHEET -> null;
        };
    }

    private String buildName(User user) {
        if (user.getPerson() == null) {
            return user.getEmail();
        }

        return String.join(" ", Stream.of(user.getPerson().getFirstName(), user.getPerson().getMiddleName(), user.getPerson().getLastName())
                .filter(value -> value != null && !value.isBlank())
                .toList());
    }

    private Long requireLongPayloadField(Map<String, Object> payload, String fieldName, RequestType requestType) {
        Object value = payload.get(fieldName);
        if (!(value instanceof Number number)) {
            throw new IllegalArgumentException(requestType + " payload must include numeric " + fieldName);
        }

        return number.longValue();
    }

    private String requireStringPayloadField(Map<String, Object> payload, String fieldName, RequestType requestType) {
        Object value = payload.get(fieldName);
        if (!(value instanceof String stringValue) || stringValue.isBlank()) {
            throw new IllegalArgumentException(requestType + " payload must include " + fieldName);
        }

        return stringValue;
    }
}
