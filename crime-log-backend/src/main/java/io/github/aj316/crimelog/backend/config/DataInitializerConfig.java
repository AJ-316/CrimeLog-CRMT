package io.github.aj316.crimelog.backend.config;

import io.github.aj316.crimelog.backend.model.Address;
import io.github.aj316.crimelog.backend.model.institutes.Agency;
import io.github.aj316.crimelog.backend.model.institutes.DepartmentUnit;
import io.github.aj316.crimelog.backend.model.people.Person;
import io.github.aj316.crimelog.backend.model.people.users.OfficerProfile;
import io.github.aj316.crimelog.backend.model.people.users.Rank;
import io.github.aj316.crimelog.backend.model.people.users.User;
import io.github.aj316.crimelog.backend.model.types.*;
import io.github.aj316.crimelog.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
public class DataInitializerConfig {

    @Bean
    CommandLineRunner seedDatabase(
            UserRepository userRepo,
            PersonRepository personRepo,
            AgencyRepository agencyRepo,
            DepartmentUnitRepository unitRepo,
            RankRepository rankRepo,
            OfficerProfileRepository officerProfileRepo,
            PasswordEncoder encoder) {

        return args -> {
            // Seed Agencies (hierarchical)
            Agency stateAgency = null, cityAgency = null;
            
            if (agencyRepo.count() == 0) {
                // State agencies
                stateAgency = new Agency();
                stateAgency.setName("Maharashtra Police");
                stateAgency.setAgencyType(AgencyType.STATE);
                stateAgency.setParentAgency(null);
                agencyRepo.save(stateAgency);

                // City agencies (under state)
                cityAgency = new Agency();
                cityAgency.setName("Thane City Police");
                cityAgency.setAgencyType(AgencyType.CITY);
                cityAgency.setParentAgency(stateAgency);
                agencyRepo.save(cityAgency);
            } else {
                stateAgency = agencyRepo.findByName("Maharashtra Police").orElse(null);
                cityAgency = agencyRepo.findByName("Thane City Police").orElse(null);
            }

            // Seed Ranks
            if (rankRepo.count() == 0) {
                for (int i = 1; i <= 5; i++) {
                    Rank rank = new Rank();
                    rank.setRankId((long) i);
                    rank.setRankName("Rank_" + i);
                    rank.setHierarchyLevel(i);
                    rankRepo.save(rank);
                }
            }

            // Seed Department Units
            DepartmentUnit defaultUnit = null;
            if (unitRepo.count() == 0 && cityAgency != null) {
                defaultUnit = new DepartmentUnit();
                defaultUnit.setUnitCode("THC-PS-001");
                defaultUnit.setName("Thane Central Police Station");
                defaultUnit.setUnitType(UnitType.POLICE_STATION);
                defaultUnit.setAgency(cityAgency);
                Address address = new Address();
                address.setStreet("123 Main Street");
                address.setCity("Thane");
                address.setState("Maharashtra");
                address.setPostalCode("400601");
                address.setCountryCode("IN");
                defaultUnit.setAddress(address);
                unitRepo.save(defaultUnit);
            } else if (unitRepo.count() > 0) {
                defaultUnit = unitRepo.findAll().stream().findFirst().orElse(null);
            }

            // Seed Officers
            if (userRepo.countByRole(Role.OFFICER) == 0 && defaultUnit != null) {
                
                for (int i = 1; i <= 3; i++) {
                    Person person = new Person();
                    person.setFirstName("Officer");
                    person.setLastName("User" + i);
                    person.setGender(Gender.MALE);
                    person.setNationalityCode("IN");
                    person.setDateOfBirth(LocalDate.of(1990, 1, 1));
                    person.setContactPrimary("98" + String.format("%08d", i * 1000000));
                    person.setContactSecondary("98" + String.format("%08d", i * 2000000));
                    person.setNationalId(String.format("%012d", i));
                    personRepo.save(person);

                    User officer = new User();
                    officer.setPerson(person);
                    officer.setEmail("officer" + i + "@crimelog.com");
                    officer.setPassword(encoder.encode("officer123"));
                    officer.setRole(Role.OFFICER);
                    officer.setAccountStatus(Status.APPROVED);
                    userRepo.save(officer);

                    OfficerProfile profile = new OfficerProfile();
                    profile.setUser(officer);
                    profile.setCurrentPostingUnit(defaultUnit);
                    profile.setRole(UnitRole.UNIT_OFFICER);
                    profile.setBadgeNumber("BADGE" + String.format("%04d", i));
                    profile.setJoiningDate(LocalDate.of(2020, 1, 1));
                    profile.setActiveStatus(io.github.aj316.crimelog.backend.model.types.ActiveStatus.ACTIVE);
                    officerProfileRepo.save(profile);
                }
            }

            // Seed Lawyers
            if (userRepo.countByRole(Role.LAWYER) == 0) {
                for (int i = 1; i <= 2; i++) {
                    Person person = new Person();
                    person.setFirstName("Lawyer");
                    person.setLastName("Advocate" + i);
                    person.setGender(i % 2 == 0 ? Gender.FEMALE : Gender.MALE);
                    person.setNationalityCode("IN");
                    person.setDateOfBirth(LocalDate.of(1985, 1, 1));
                    person.setContactPrimary("99" + String.format("%08d", i * 1000000));
                    person.setContactSecondary("99" + String.format("%08d", i * 2000000));
                    person.setNationalId(String.format("%012d", 100 + i));
                    personRepo.save(person);

                    User lawyer = new User();
                    lawyer.setPerson(person);
                    lawyer.setEmail("lawyer" + i + "@crimelog.com");
                    lawyer.setPassword(encoder.encode("lawyer123"));
                    lawyer.setRole(Role.LAWYER);
                    lawyer.setAccountStatus(Status.APPROVED);
                    userRepo.save(lawyer);
                }
            }
        };
    }
}
