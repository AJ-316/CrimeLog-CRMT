package io.github.aj316.crimelog.backend.service;

import io.github.aj316.crimelog.backend.dto.auth.RegisterLawyerRequest;
import io.github.aj316.crimelog.backend.model.people.users.LawyerProfile;
import io.github.aj316.crimelog.backend.model.people.users.User;
import io.github.aj316.crimelog.backend.repository.LawyerProfileRepository;
import io.github.aj316.crimelog.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class LawyerService {

    private final UserRepository userRepository;
    private final LawyerProfileRepository lawyerProfileRepository;

    public LawyerService(UserRepository userRepository, LawyerProfileRepository lawyerProfileRepository) {
        this.userRepository = userRepository;
        this.lawyerProfileRepository = lawyerProfileRepository;
    }

    public LawyerProfile registerProfile(Long userId, RegisterLawyerRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User does not exist"));

        if (lawyerProfileRepository.existsById(userId)) {
            throw new IllegalStateException("Lawyer profile already exists for user: " + user.getEmail());
        }

        LawyerProfile profile = new LawyerProfile();
        profile.setUser(user);
        profile.setBarCouncilId(request.barCouncilId());
        profile.setBarRegistrationNumber(request.barRegistrationNumber());
        profile.setEnrollmentDate(request.enrollmentDate());
        profile.setYearsOfExperience(request.yearsOfExperience());
        profile.setSpecialization(request.specialization());
        profile.setLicenseStatus(request.licenseStatus());
        profile.setFirmName(request.firmName());
        profile.setOfficeAddress(request.officeAddress().mapToEntity());
        profile.setOfficialContact(request.officialContact());
        profile.setIsPublicDefender(request.isPublicDefender());

        return lawyerProfileRepository.save(profile);
    }
}
