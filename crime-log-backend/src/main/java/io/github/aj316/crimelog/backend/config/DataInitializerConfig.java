package io.github.aj316.crimelog.backend.config;

import io.github.aj316.crimelog.backend.model.Address;
import io.github.aj316.crimelog.backend.model.cases.Case;
import io.github.aj316.crimelog.backend.model.cases.FIR;
import io.github.aj316.crimelog.backend.model.institutes.Agency;
import io.github.aj316.crimelog.backend.model.institutes.Court;
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
import java.util.ArrayList;
import java.util.List;

@Configuration
public class DataInitializerConfig {

    @Bean
    CommandLineRunner seedDatabase(
            UserRepository userRepo,
            PersonRepository personRepo,
            AgencyRepository agencyRepo,
            DepartmentUnitRepository unitRepo,
            CourtRepository courtRepo,
            RankRepository rankRepo,
            OfficerProfileRepository officerProfileRepo,
            FirRepository firRepo,
            CaseRepository caseRepo,
            PasswordEncoder encoder) {

        return args -> {
            // Seed Agencies (hierarchical - Indian states and cities)
            List<Agency> stateAgencies = new ArrayList<>();
            List<DepartmentUnit> allUnits = new ArrayList<>();
            
            if (agencyRepo.count() == 0) {
                // Create State Agencies
                String[] states = {"Maharashtra Police", "Tamil Nadu Police", "Karnataka Police", "Delhi Police", "Rajasthan Police"};
                
                for (int i = 0; i < states.length; i++) {
                    Agency stateAgency = new Agency();
                    stateAgency.setName(states[i]);
                    stateAgency.setAgencyType(AgencyType.STATE);
                    stateAgency.setParentAgency(null);
                    Agency saved = agencyRepo.save(stateAgency);
                    stateAgencies.add(saved);
                }
                
                // Create City Agencies under states
                String[][] cities = {
                    {"Thane City Police", "Mumbai City Police", "Pune City Police"},  // Maharashtra
                    {"Chennai City Police", "Coimbatore City Police"},                // Tamil Nadu
                    {"Bangalore City Police", "Mysore City Police"},                 // Karnataka
                    {"North Delhi Police", "South Delhi Police"},                    // Delhi
                    {"Jaipur City Police", "Jodhpur City Police"}                    // Rajasthan
                };
                
                for (int i = 0; i < stateAgencies.size(); i++) {
                    for (String city : cities[i]) {
                        Agency cityAgency = new Agency();
                        cityAgency.setName(city);
                        cityAgency.setAgencyType(AgencyType.CITY);
                        cityAgency.setParentAgency(stateAgencies.get(i));
                        agencyRepo.save(cityAgency);
                    }
                }
            } else {
                stateAgencies = new ArrayList<>(agencyRepo.findByAgencyType(AgencyType.STATE));
            }

            // Seed Ranks
            if (rankRepo.count() == 0) {
                String[] ranks = {"Constable", "Head Constable", "Sub-Inspector", "Inspector", "Senior Inspector"};
                for (int i = 0; i < ranks.length; i++) {
                    Rank rank = new Rank();
                    rank.setRankId((long) (i + 1));
                    rank.setRankName(ranks[i]);
                    rank.setHierarchyLevel(i + 1);
                    rankRepo.save(rank);
                }
            }

            // Seed Department Units (Police Stations)
            if (unitRepo.count() == 0 && !stateAgencies.isEmpty()) {
                String[][] policeStations = {
                    {"Thane Central", "Thane East", "Thane West", "Wagle Estate", "Koparkhairane"},  // Maharashtra
                    {"Teynampet", "Adyar", "MKB Nagar", "Velachery"},                                // Tamil Nadu
                    {"Jayanagar", "Hebbal", "Indiranagar"},                                          // Karnataka
                    {"Malviya Nagar", "Vasant Kunj"},                                                // Delhi
                    {"Jaipur Central", "Jaipur East"}                                                // Rajasthan
                };
                
                String[][] cities = {
                    {"Thane", "Thane", "Thane", "Thane", "Thane"},                                    // Maharashtra
                    {"Chennai", "Chennai", "Chennai", "Chennai"},                                     // Tamil Nadu
                    {"Bangalore", "Bangalore", "Bangalore"},                                          // Karnataka
                    {"Delhi", "Delhi"},                                                              // Delhi
                    {"Jaipur", "Jaipur"}                                                             // Rajasthan
                };
                
                String[][] postalCodes = {
                    {"400601", "400602", "400603", "400604", "400605"},                               // Maharashtra
                    {"600018", "600020", "600022", "600024"},                                        // Tamil Nadu
                    {"560034", "560057", "560038"},                                                  // Karnataka
                    {"110019", "110021"},                                                            // Delhi
                    {"302001", "302002"}                                                             // Rajasthan
                };
                
                for (int i = 0; i < stateAgencies.size(); i++) {
                    List<Agency> cityAgencies = agencyRepo.findByParentAgency(stateAgencies.get(i));
                    
                    for (int j = 0; j < policeStations[i].length; j++) {
                        DepartmentUnit unit = new DepartmentUnit();
                        unit.setUnitCode(String.format("%s-PS-%03d", stateAgencies.get(i).getName().substring(0, 2), j + 1));
                        unit.setName(policeStations[i][j] + " Police Station");
                        unit.setUnitType(UnitType.POLICE_STATION);
                        
                        if (!cityAgencies.isEmpty()) {
                            unit.setAgency(cityAgencies.get(j % cityAgencies.size()));
                        } else {
                            unit.setAgency(stateAgencies.get(i));
                        }
                        
                        Address address = new Address();
                        address.setStreet((j + 1) * 100 + " Police Lane");
                        address.setCity(cities[i][j]);
                        address.setState(stateAgencies.get(i).getName().replace(" Police", ""));
                        address.setPostalCode(postalCodes[i][j]);
                        address.setCountryCode("IN");
                        unit.setAddress(address);
                        
                        DepartmentUnit savedUnit = unitRepo.save(unit);
                        allUnits.add(savedUnit);
                    }
                }
            } else if (unitRepo.count() > 0) {
                allUnits = new ArrayList<>(unitRepo.findAll());
            }

            if (courtRepo.count() == 0) {
                Object[][] courts = {
                    {"Bengaluru City Civil Court", "Bangalore", "Karnataka"},
                    {"Bengaluru High Court Annex", "Bangalore", "Karnataka"},
                    {"Thane District Court", "Thane", "Maharashtra"},
                    {"Mumbai City Civil Court", "Mumbai", "Maharashtra"},
                    {"Pune Sessions Court", "Pune", "Maharashtra"},
                    {"Chennai City Civil Court", "Chennai", "Tamil Nadu"},
                    {"Delhi District Court", "Delhi", "Delhi"},
                    {"Jaipur District Court", "Jaipur", "Rajasthan"},
                    {"Kochi District Court", "Kochi", "Kerala"},
                    {"Hyderabad City Civil Court", "Hyderabad", "Telangana"}
                };

                for (int i = 0; i < courts.length; i++) {
                    Court court = new Court();
                    court.setCourtName((String) courts[i][0]);

                    Address location = new Address();
                    location.setStreet((i + 1) * 10 + " Court Road");
                    location.setCity((String) courts[i][1]);
                    location.setState((String) courts[i][2]);
                    location.setPostalCode(String.format("%06d", 560000 + i * 101));
                    location.setCountryCode("IN");
                    court.setLocation(location);

                    courtRepo.save(court);
                }
            }

            // Seed Officers (at least 10)
            if (userRepo.countByRole(Role.OFFICER) == 0 && !allUnits.isEmpty()) {
                String[] firstNames = {"Rajesh", "Priya", "Amit", "Deepak", "Neha", "Vikram", "Anjali", "Suresh", "Meera", "Arjun", "Pooja", "Sanjay"};
                String[] lastNames = {"Kumar", "Singh", "Sharma", "Patel", "Verma", "Gupta", "Desai", "Nair", "Bhat", "Rao", "Iyer", "Menon"};
                
                for (int i = 1; i <= 12; i++) {
                    Person person = new Person();
                    person.setFirstName(firstNames[(i - 1) % firstNames.length]);
                    person.setLastName(lastNames[(i - 1) % lastNames.length]);
                    person.setGender(i % 3 == 0 ? Gender.FEMALE : Gender.MALE);
                    person.setNationalityCode("IN");
                    person.setDateOfBirth(LocalDate.of(1985 + (i % 10), 1, 1));
                    person.setContactPrimary("+91" + (9800000000L + i * 100000));
                    person.setContactSecondary("+91" + (9900000000L + i * 100000));
                    person.setNationalId(String.format("%012d", i * 123456));
                    
                    // Add addresses for people
                    Address permanent = new Address();
                    permanent.setStreet(i * 10 + " Police Quarters");
                    permanent.setCity("Mumbai");
                    permanent.setState("Maharashtra");
                    permanent.setPostalCode("400001");
                    permanent.setCountryCode("IN");
                    person.setPermanentAddress(permanent);
                    
                    Address current = new Address();
                    current.setStreet(i * 20 + " Service Road");
                    current.setCity("Thane");
                    current.setState("Maharashtra");
                    current.setPostalCode("400601");
                    current.setCountryCode("IN");
                    person.setCurrentAddress(current);
                    
                    Address birth = new Address();
                    birth.setStreet(i * 30 + " Birth Lane");
                    birth.setCity("Pune");
                    birth.setState("Maharashtra");
                    birth.setPostalCode("411001");
                    birth.setCountryCode("IN");
                    person.setBirthPlace(birth);
                    
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
                    profile.setCurrentPostingUnit(allUnits.get((i - 1) % allUnits.size()));
                    profile.setRole(i <= 3 ? UnitRole.UNIT_HEAD : UnitRole.UNIT_OFFICER);
                    profile.setBadgeNumber("BADGE" + String.format("%04d", i));
                    profile.setJoiningDate(LocalDate.of(2019, 1, 1).plusYears(i % 5));
                    profile.setActiveStatus(io.github.aj316.crimelog.backend.model.types.ActiveStatus.ACTIVE);
                    officerProfileRepo.save(profile);
                }
            }

            // Seed Persons (Victims, Witnesses, etc.) - at least 10
            if (personRepo.count() < 30) {
                String[] maleNames = {"Raj", "Arun", "Vikram", "Sanjay", "Nitin", "Karan", "Rohan", "Ashish", "Harish", "Manish"};
                String[] femaleNames = {"Priya", "Anjali", "Divya", "Meera", "Neha", "Pooja", "Sneha", "Kavya", "Swati", "Shreya"};
                String[] surnames = {"Kumar", "Singh", "Sharma", "Patel", "Verma", "Mishra", "Nair", "Menon", "Iyer", "Bhatt"};
                
                for (int i = 20; i <= 30; i++) {
                    Person person = new Person();
                    boolean isFemale = i % 2 == 0;
                    person.setFirstName(isFemale ? femaleNames[(i - 20) % femaleNames.length] : maleNames[(i - 20) % maleNames.length]);
                    person.setLastName(surnames[(i - 20) % surnames.length]);
                    person.setGender(isFemale ? Gender.FEMALE : Gender.MALE);
                    person.setNationalityCode("IN");
                    person.setDateOfBirth(LocalDate.of(1970 + (i % 30), 1, 1));
                    person.setContactPrimary("+91" + (9000000000L + i * 100000));
                    person.setContactSecondary("+91" + (9100000000L + i * 100000));
                    person.setNationalId(String.format("%012d", i * 654321));
                    
                    Address permanent = new Address();
                    permanent.setStreet(i * 50 + " Residential Lane");
                    permanent.setCity(i % 2 == 0 ? "Mumbai" : "Thane");
                    permanent.setState("Maharashtra");
                    permanent.setPostalCode("400" + String.format("%03d", i));
                    permanent.setCountryCode("IN");
                    person.setPermanentAddress(permanent);
                    
                    Address current = new Address();
                    current.setStreet(i * 60 + " Street");
                    current.setCity(i % 3 == 0 ? "Pune" : (i % 3 == 1 ? "Nagpur" : "Aurangabad"));
                    current.setState("Maharashtra");
                    current.setPostalCode("410" + String.format("%03d", i));
                    current.setCountryCode("IN");
                    person.setCurrentAddress(current);
                    
                    Address birth = new Address();
                    birth.setStreet(i * 70 + " Birth Place");
                    birth.setCity("Mumbai");
                    birth.setState("Maharashtra");
                    birth.setPostalCode("420" + String.format("%03d", i));
                    birth.setCountryCode("IN");
                    person.setBirthPlace(birth);
                    
                    personRepo.save(person);
                }
            }

            // Seed FIRs (at least 10)
            if (firRepo.count() == 0 && !allUnits.isEmpty()) {
                for (int i = 1; i <= 10; i++) {
                    FIR fir = new FIR();
                    fir.setFirNumber(String.format("FIR/2024/%05d", i));
                    fir.setRegistrationDateTime(LocalDateTime.now().minusDays(30 + i));
                    
                    // Accused details
                    fir.setAccusedFirstName(new String[]{"Ashok", "Rajesh", "Vikram", "Sanjay", "Nitin", "Karan", "Rohan", "Anil", "Sunil", "Vikas"}[i - 1]);
                    fir.setAccusedLastName(new String[]{"Singh", "Patel", "Sharma", "Kumar", "Verma", "Mishra", "Nair", "Gupta", "Rao", "Bhatt"}[i - 1]);
                    fir.setAccusedContact("+91" + (9500000000L + i * 100000));
                    
                    Address accusedAddr = new Address();
                    accusedAddr.setStreet(i * 100 + " Accused Lane");
                    accusedAddr.setCity(i % 2 == 0 ? "Mumbai" : "Thane");
                    accusedAddr.setState("Maharashtra");
                    accusedAddr.setPostalCode("400" + String.format("%03d", 100 + i));
                    accusedAddr.setCountryCode("IN");
                    fir.setAccusedAddress(accusedAddr);
                    
                    // Officer and unit details
                    fir.setOriginUnit(allUnits.get((i - 1) % allUnits.size()));
                    
                    List<OfficerProfile> officers = officerProfileRepo.findAll();
                    if (!officers.isEmpty()) {
                        fir.setCreatedBy(officers.get((i - 1) % officers.size()));
                        fir.setInitialInvestigatingUnit(officers.get((i - 1) % officers.size()).getCurrentPostingUnit());
                    }
                    
                    fir.setFirType(i % 5 == 0 ? FIR_Type.ZERO : FIR_Type.REGULAR);
                    
                    firRepo.save(fir);
                }
            }

            // Seed Cases (at least 10)
            if (caseRepo.count() == 0) {
                List<FIR> firs = firRepo.findAll();
                if (firs.size() >= 10) {
                    for (int i = 1; i <= 10; i++) {
                        Case caseEntity = new Case();
                        caseEntity.setCaseNumber(String.format("CASE/2024/%05d", i));
                        caseEntity.setStage(new CaseStage[]{CaseStage.INVESTIGATION, CaseStage.TRIAL, CaseStage.APPEAL, CaseStage.CLOSED}[i % 4]);
                        caseEntity.setFir(firs.get(i - 1));
                        
                        if (!allUnits.isEmpty()) {
                            caseEntity.setCurrentInvestigatingUnit(allUnits.get((i - 1) % allUnits.size()));
                        }
                        
                        caseEntity.setOpenedOn(LocalDate.now().minusDays(60 + i * 5));
                        if (caseEntity.getStage() == CaseStage.CLOSED) {
                            caseEntity.setClosedOn(LocalDate.now().minusDays(10 + i));
                        }
                        
                        caseRepo.save(caseEntity);
                    }
                }
            }
        };
    }
}
