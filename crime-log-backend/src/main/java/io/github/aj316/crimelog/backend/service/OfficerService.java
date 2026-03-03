package io.github.aj316.crimelog.backend.service;

import io.github.aj316.crimelog.backend.dto.RegisterLawyerRequest;
import io.github.aj316.crimelog.backend.dto.RegisterOfficerRequest;
import io.github.aj316.crimelog.backend.model.institutes.DepartmentUnit;
import io.github.aj316.crimelog.backend.model.people.users.*;
import io.github.aj316.crimelog.backend.repository.*;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class OfficerService {

    private final UserRepository userRepository;
    private final RankRepository rankRepository;
    private final AgencyRepository agencyRepository;
    private final DepartmentUnitRepository departmentUnitRepository;
    private final OfficerProfileRepository officerProfileRepository;

    public OfficerService(UserRepository userRepository, RankRepository rankRepository, AgencyRepository agencyRepository,
                          DepartmentUnitRepository departmentUnitRepository, OfficerProfileRepository officerProfileRepository) {
        this.userRepository = userRepository;
        this.rankRepository = rankRepository;
        this.agencyRepository = agencyRepository;
        this.departmentUnitRepository = departmentUnitRepository;
        this.officerProfileRepository = officerProfileRepository;
    }

    public OfficerProfile registerProfile(Long userId, RegisterOfficerRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User does not exist"));

        if (officerProfileRepository.existsById(userId)) {
            throw new IllegalStateException("Officer profile already exists");
        }

        Rank rank = rankRepository.findById(request.rankId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid rank"));

        Agency agency = agencyRepository.findById(request.agencyId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid agency"));

        DepartmentUnit unit = departmentUnitRepository.findById(request.departmentUnitId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid department unit"));

        OfficerProfile profile = new OfficerProfile();
        profile.setUser(user);
        profile.setBadgeNumber(request.badgeNumber());
        profile.setRank(rank);
        profile.setAgency(agency);
        profile.setCurrentPostingUnit(unit);
        profile.setJoiningDate(request.joiningDate());
        profile.setActiveStatus(request.activeStatus());

        return officerProfileRepository.save(profile);
    }
}
