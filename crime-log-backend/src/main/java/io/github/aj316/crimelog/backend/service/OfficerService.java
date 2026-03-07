package io.github.aj316.crimelog.backend.service;

import io.github.aj316.crimelog.backend.dto.OfficerActionRequestDto;
import io.github.aj316.crimelog.backend.dto.auth.RegisterOfficerRequest;
import io.github.aj316.crimelog.backend.model.OfficerActionRequest;
import io.github.aj316.crimelog.backend.model.institutes.DepartmentUnit;
import io.github.aj316.crimelog.backend.model.people.users.*;
import io.github.aj316.crimelog.backend.model.types.OfficerAction;
import io.github.aj316.crimelog.backend.repository.*;
import org.springframework.stereotype.Service;

@Service
public class OfficerService {

    private final UserRepository userRepository;
    private final DepartmentUnitRepository departmentUnitRepository;
    private final OfficerProfileRepository officerProfileRepository;

    private final OfficerActionRequestRepository officerActionRequestRepository;

    public OfficerService(UserRepository userRepository,
                          DepartmentUnitRepository departmentUnitRepository, OfficerProfileRepository officerProfileRepository, OfficerActionRequestRepository officerActionRequestRepository) {
        this.userRepository = userRepository;
        this.departmentUnitRepository = departmentUnitRepository;
        this.officerProfileRepository = officerProfileRepository;
        this.officerActionRequestRepository = officerActionRequestRepository;
    }

    public String addOfficerActionRequest(OfficerActionRequestDto request) {
        // Find case by ID and validate
        officerActionRequestRepository.save(request.mapToEntity());
        return "";
    }

    public String setOfficerActionRequestStatus(Long requestId, boolean isApproved) { // simple approval logic, can be expanded to giving reason for rejection etc.
        OfficerActionRequest request = officerActionRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Officer Action Request not found"));

        request.setApproved(isApproved);
        officerActionRequestRepository.save(request);

        if(isApproved) handleOfficerActionRequestApproval(request.getAction());

        return "Officer Action(" + requestId + ") was successfully " + (isApproved ? "Approved" : "Rejected");
    }

    public void handleOfficerActionRequestApproval(OfficerAction action) {
        switch (action) {
            // todo Implement logic for each officer action type
        }
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
