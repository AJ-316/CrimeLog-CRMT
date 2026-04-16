package io.github.aj316.crimelog.backend.config;

import io.github.aj316.crimelog.backend.model.Address;
import io.github.aj316.crimelog.backend.model.Alert;
import io.github.aj316.crimelog.backend.model.CrimeReport;
import io.github.aj316.crimelog.backend.model.CrimeReportTimelineEntry;
import io.github.aj316.crimelog.backend.model.Request;
import io.github.aj316.crimelog.backend.model.cases.Case;
import io.github.aj316.crimelog.backend.model.cases.CaseHearing;
import io.github.aj316.crimelog.backend.model.cases.CaseLawyer;
import io.github.aj316.crimelog.backend.model.cases.FIR;
import io.github.aj316.crimelog.backend.model.cases.parties.AccusedDetail;
import io.github.aj316.crimelog.backend.model.cases.parties.CasePerson;
import io.github.aj316.crimelog.backend.model.cases.parties.VictimDetail;
import io.github.aj316.crimelog.backend.model.cases.parties.WitnessDetail;
import io.github.aj316.crimelog.backend.model.institutes.Agency;
import io.github.aj316.crimelog.backend.model.institutes.Court;
import io.github.aj316.crimelog.backend.model.institutes.DepartmentUnit;
import io.github.aj316.crimelog.backend.model.people.Person;
import io.github.aj316.crimelog.backend.model.people.users.LawyerProfile;
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
import java.util.Comparator;
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
            AlertRepository alertRepo,
            RequestRepository requestRepo,
            CrimeReportRepository crimeReportRepo,
            CrimeReportTimelineRepository crimeReportTimelineRepo,
            LawyerProfileRepository lawyerProfileRepo,
            CasePersonRepository casePersonRepo,
            VictimDetailRepository victimDetailRepo,
            AccusedDetailRepository accusedDetailRepo,
            WitnessDetailRepository witnessDetailRepo,
            CaseLawyerRepository caseLawyerRepo,
            CaseHearingRepository caseHearingRepo,
            OfficerActionRequestRepository officerActionRequestRepo,
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

            if (allUnits.stream().noneMatch(unit -> unit.getUnitType() == UnitType.POLICE_STATION)) {
                Agency fallbackAgency;
                if (!stateAgencies.isEmpty()) {
                    fallbackAgency = stateAgencies.getFirst();
                } else {
                    fallbackAgency = agencyRepo.findAll().stream().findFirst().orElseGet(() -> {
                        Agency agency = new Agency();
                        agency.setName("Maharashtra Police");
                        agency.setAgencyType(AgencyType.STATE);
                        agency.setParentAgency(null);
                        return agencyRepo.save(agency);
                    });
                }

                DepartmentUnit demoPoliceStation = new DepartmentUnit();
                demoPoliceStation.setUnitCode("CRIME-PS-100");
                demoPoliceStation.setName("CrimeLog Demo Police Station");
                demoPoliceStation.setUnitType(UnitType.POLICE_STATION);
                demoPoliceStation.setAgency(fallbackAgency);
                demoPoliceStation.setAddress(buildAddress("100 Demo Police Lane", "Mumbai", "Maharashtra", "400001"));

                DepartmentUnit savedPoliceStation = unitRepo.save(demoPoliceStation);
                allUnits.add(savedPoliceStation);
            }

            DepartmentUnit defaultPoliceStation = allUnits.stream()
                    .filter(unit -> unit.getUnitType() == UnitType.POLICE_STATION)
                    .findFirst()
                    .orElse(null);

            if (defaultPoliceStation != null) {
                List<OfficerProfile> profiles = officerProfileRepo.findAll();
                for (OfficerProfile profile : profiles) {
                    boolean assignedToPoliceStation = false;
                    if (profile.getCurrentPostingUnit() != null && profile.getCurrentPostingUnit().getId() != null) {
                        assignedToPoliceStation = unitRepo.findById(profile.getCurrentPostingUnit().getId())
                                .map(unit -> unit.getUnitType() == UnitType.POLICE_STATION)
                                .orElse(false);
                    }

                    if (!assignedToPoliceStation) {
                        profile.setCurrentPostingUnit(defaultPoliceStation);
                        officerProfileRepo.save(profile);
                    }
                }
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
                    person.setNationalId(findNextAvailableNationalId(personRepo, i * 123456L));
                    
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

                    if (personRepo.existsByNationalId(person.getNationalId())) {
                        continue;
                    }
                    
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

            // Seed Persons (Victims, Witnesses, etc.) only for empty datasets
            if (personRepo.count() == 0) {
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
                    person.setNationalId(findNextAvailableNationalId(personRepo, i * 654321L));
                    
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

                    if (personRepo.existsByNationalId(person.getNationalId())) {
                        continue;
                    }
                    
                    personRepo.save(person);
                }
            }

            // Seed FIRs (at least 10)
            List<DepartmentUnit> policeStationUnits = allUnits.stream()
                    .filter(unit -> unit.getUnitType() == UnitType.POLICE_STATION)
                    .toList();

            if (firRepo.count() == 0 && !policeStationUnits.isEmpty()) {
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
                    
                    // Unit details
                    fir.setOriginUnit(policeStationUnits.get((i - 1) % policeStationUnits.size()));

                    // Keep initial investigating unit aligned with origin unit for seed data.
                    // Avoid setting createdBy from detached profiles during startup seeding.
                    fir.setInitialInvestigatingUnit(fir.getOriginUnit());
                    
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

                    seedSupplementaryIndiaData(
                        userRepo,
                        personRepo,
                        courtRepo,
                        unitRepo,
                        firRepo,
                        caseRepo,
                        alertRepo,
                        requestRepo,
                        crimeReportRepo,
                        crimeReportTimelineRepo,
                        lawyerProfileRepo,
                        casePersonRepo,
                        victimDetailRepo,
                        accusedDetailRepo,
                        witnessDetailRepo,
                        caseLawyerRepo,
                        caseHearingRepo,
                        officerActionRequestRepo,
                        encoder
                    );

                        seedDemoHistoryLinks(
                            personRepo,
                            unitRepo,
                            firRepo,
                            caseRepo,
                            casePersonRepo,
                            victimDetailRepo,
                            accusedDetailRepo,
                            witnessDetailRepo
                        );
        };
    }

                private void seedSupplementaryIndiaData(
                    UserRepository userRepo,
                    PersonRepository personRepo,
                    CourtRepository courtRepo,
                    DepartmentUnitRepository unitRepo,
                    FirRepository firRepo,
                    CaseRepository caseRepo,
                    AlertRepository alertRepo,
                    RequestRepository requestRepo,
                    CrimeReportRepository crimeReportRepo,
                    CrimeReportTimelineRepository crimeReportTimelineRepo,
                    LawyerProfileRepository lawyerProfileRepo,
                    CasePersonRepository casePersonRepo,
                    VictimDetailRepository victimDetailRepo,
                    AccusedDetailRepository accusedDetailRepo,
                    WitnessDetailRepository witnessDetailRepo,
                    CaseLawyerRepository caseLawyerRepo,
                    CaseHearingRepository caseHearingRepo,
                    OfficerActionRequestRepository officerActionRequestRepo,
                    PasswordEncoder encoder) {

                ensurePublicUsers(personRepo, userRepo, encoder);
                ensureLawyerUsers(personRepo, userRepo, lawyerProfileRepo, encoder);

                List<User> officerUsers = userRepo.findAll().stream()
                    .filter(user -> user.getRole() == Role.OFFICER)
                    .toList();
                List<User> publicUsers = userRepo.findAll().stream()
                    .filter(user -> user.getRole() == Role.PUBLIC)
                    .toList();
                List<User> lawyerUsers = userRepo.findAll().stream()
                    .filter(user -> user.getRole() == Role.LAWYER)
                    .toList();
                List<LawyerProfile> lawyerProfiles = lawyerProfileRepo.findAll();
                List<Case> cases = caseRepo.findAllByOrderByOpenedOnDesc();
                List<FIR> firs = firRepo.findAllByOrderByRegistrationDateTimeDesc();

                while (alertRepo.count() < 4 && !officerUsers.isEmpty()) {
                    int index = (int) alertRepo.count();
                    User sourceUser = officerUsers.get(index % officerUsers.size());

                    Alert alert = new Alert();
                    alert.setMessage(new String[] {
                        "High-priority burglary complaint reported from Mumbai suburbs.",
                        "Vehicle theft cluster detected around Thane and Navi Mumbai.",
                        "Cyber fraud escalation notice from Bengaluru east division.",
                        "Community safety alert for Delhi market areas after a robbery report."
                    }[index % 4]);
                    alert.setSeverity(new AlertSeverity[] {
                        AlertSeverity.HIGH,
                        AlertSeverity.MEDIUM,
                        AlertSeverity.CRITICAL,
                        AlertSeverity.LOW
                    }[index % 4]);
                    alert.setCreatedByUserId(sourceUser.getUserId());
                    alert.setCreatedByRole(sourceUser.getRole());
                    alert.setSourceReportId(publicUsers.isEmpty() ? null : publicUsers.get(index % publicUsers.size()).getUserId());
                    alertRepo.save(alert);
                }

                while (requestRepo.count() < 4 && !cases.isEmpty() && !firs.isEmpty()) {
                    int index = (int) requestRepo.count();
                    User requestedBy = !officerUsers.isEmpty()
                        ? officerUsers.get(index % officerUsers.size())
                        : (!lawyerUsers.isEmpty() ? lawyerUsers.get(index % lawyerUsers.size()) : publicUsers.get(index % publicUsers.size()));

                    Request request = new Request();
                    request.setRequestType(new RequestType[] {
                        RequestType.TRANSFER_UNIT,
                        RequestType.SUBMIT_CHARGE_SHEET,
                        RequestType.LAWYER_CASE_REQUEST,
                        RequestType.TRANSFER_AGENCY
                    }[index % 4]);
                    request.setRequestedByUserId(requestedBy.getUserId());
                    request.setCaseId(cases.get(index % cases.size()).getCaseId());
                    request.setFirId(firs.get(index % firs.size()).getFirId());
                    request.setStatus(Status.PENDING);
                    request.setReason(new String[] {
                        "Transfer investigation to the Mumbai city unit.",
                        "Charge sheet preparation requested for a Pune property case.",
                        "Lawyer access request for a Delhi family dispute.",
                        "Agency transfer request for a cyber fraud matter."
                    }[index % 4]);
                    request.setPayloadJson(new String[] {
                        "{\"targetUnit\":\"Mumbai City Police\",\"priority\":\"HIGH\"}",
                        "{\"chargeSheetStatus\":\"READY\",\"reviewNotes\":\"Indian demo data\"}",
                        "{\"caseAccess\":\"limited\",\"role\":\"LAWYER\"}",
                        "{\"targetAgency\":\"Central Bureau of Investigation\"}"
                    }[index % 4]);
                    requestRepo.save(request);
                }

                while (crimeReportRepo.count() < 4 && !publicUsers.isEmpty()) {
                    int index = (int) crimeReportRepo.count();
                    User reporter = publicUsers.get(index % publicUsers.size());

                    CrimeReport report = new CrimeReport();
                    report.setTitle(new String[] {
                        "Suspicious activity near Marine Drive",
                        "Mobile snatching near Thane station",
                        "Online payment fraud in Bengaluru",
                        "Missing luggage complaint from Jaipur railway yard"
                    }[index % 4]);
                    report.setDescription(new String[] {
                        "A citizen reported suspicious movement near the Mumbai promenade during evening hours.",
                        "A public report described a mobile snatching incident outside the Thane suburban station.",
                        "A family reported unauthorized UPI transfers linked to a Bengaluru account.",
                        "A tourist reported missing luggage after arriving at Jaipur Junction."
                    }[index % 4]);
                    report.setLocation(new String[] {"Mumbai, Maharashtra", "Thane, Maharashtra", "Bengaluru, Karnataka", "Jaipur, Rajasthan"}[index % 4]);
                    report.setIncidentDateTime(LocalDateTime.now().minusDays(6L + index));
                    report.setReporterUserId(reporter.getUserId());
                    report.setStatus(new CrimeReportStatus[] {
                        CrimeReportStatus.SENT_TO_POLICE,
                        CrimeReportStatus.UNDER_REVIEW,
                        CrimeReportStatus.INVESTIGATING,
                        CrimeReportStatus.SUSPECT_IDENTIFIED
                    }[index % 4]);
                    report.setPublicBroadcasted(index % 2 == 0);
                    if (report.getPublicBroadcasted()) {
                    report.setPublicBroadcastedAt(LocalDateTime.now().minusDays(1L + index));
                    report.setPublicBroadcastedByUserId(officerUsers.isEmpty() ? reporter.getUserId() : officerUsers.get(index % officerUsers.size()).getUserId());
                    }
                    crimeReportRepo.save(report);
                }

                List<CrimeReport> crimeReports = crimeReportRepo.findAllByOrderByCreatedAtDesc();
                while (crimeReportTimelineRepo.count() < 4 && !crimeReports.isEmpty() && !officerUsers.isEmpty()) {
                    int index = (int) crimeReportTimelineRepo.count();
                    CrimeReport report = crimeReports.get(index % crimeReports.size());
                    User officer = officerUsers.get(index % officerUsers.size());

                    CrimeReportTimelineEntry entry = new CrimeReportTimelineEntry();
                    entry.setReportId(report.getReportId());
                    entry.setStatus(report.getStatus());
                    entry.setNote(new String[] {
                        "Report received by Mumbai control room.",
                        "Report assigned for verification at Thane unit.",
                        "Digital evidence review started by Bengaluru cyber team.",
                        "Public broadcast cleared after initial verification."
                    }[index % 4]);
                    entry.setChangedByUserId(officer.getUserId());
                    entry.setChangedByRole(officer.getRole());
                    crimeReportTimelineRepo.save(entry);
                }

                while (caseHearingRepo.count() < 4 && !cases.isEmpty()) {
                    int index = (int) caseHearingRepo.count();
                    Case hearingCase = cases.get(index % cases.size());

                    CaseHearing hearing = new CaseHearing();
                    hearing.setAttachedCase(hearingCase);
                    hearing.setHearingDate(LocalDate.now().minusDays(18L - index * 2L));
                    hearing.setNextDate(LocalDate.now().plusDays(14L + index * 3L));
                    hearing.setProceedingSummary(new String[] {
                        "Initial hearing for a Mumbai burglary matter.",
                        "Evidence submission hearing for a Thane theft case.",
                        "Charge framing review for a Bengaluru cyber-fraud case.",
                        "Status review for a Delhi public safety appeal."
                    }[index % 4]);
                    hearing.setOrdersPassed(new String[] {
                        "Matter adjourned for witness verification.",
                        "Police to submit CCTV extracts before next date.",
                        "Forensic report requested from cyber cell.",
                        "Accused counsel asked to file response."
                    }[index % 4]);
                    caseHearingRepo.save(hearing);
                }

                while (caseLawyerRepo.count() < 4 && !lawyerProfiles.isEmpty() && !cases.isEmpty()) {
                    int index = (int) caseLawyerRepo.count();
                    CaseLawyer caseLawyer = new CaseLawyer(
                        cases.get(index % cases.size()),
                        lawyerProfiles.get(index % lawyerProfiles.size()),
                        index % 2 == 0 ? LawyerRole.DEFENSE : LawyerRole.PROSECUTOR
                    );
                    caseLawyerRepo.save(caseLawyer);
                }

                List<Person> people = personRepo.findAll();
                while (casePersonRepo.count() < 4 && !cases.isEmpty() && !people.isEmpty()) {
                    int index = (int) casePersonRepo.count();
                    Case targetCase = cases.get(index % cases.size());
                    Person person = people.get(index % people.size());
                    CasePersonType type = new CasePersonType[] {
                        CasePersonType.VICTIM,
                        CasePersonType.SUSPECT,
                        CasePersonType.WITNESS,
                        CasePersonType.VICTIM
                    }[index % 4];

                    if (casePersonRepo.existsByCaseEntity_CaseIdAndPerson_PersonIdAndCasePersonType(targetCase.getCaseId(), person.getPersonId(), type)) {
                    continue;
                    }

                    CasePerson casePerson = new CasePerson();
                    casePerson.setCaseEntity(targetCase);
                    casePerson.setPerson(person);
                    casePerson.setCasePersonType(type);
                    CasePerson savedCasePerson = casePersonRepo.save(casePerson);

                    switch (type) {
                    case VICTIM -> {
                        VictimDetail victimDetail = new VictimDetail();
                        victimDetail.setCasePerson(savedCasePerson);
                        victimDetail.setInjurySeverity(new InjurySeverity[] {InjurySeverity.MINOR, InjurySeverity.SERIOUS, InjurySeverity.CRITICAL, InjurySeverity.NONE}[index % 4]);
                        victimDetail.setMedicalAttentionRequired(index % 4 != 3);
                        victimDetail.setStatementRecordedOn(LocalDate.now().minusDays(12L + index));
                        victimDetailRepo.save(victimDetail);
                    }
                    case SUSPECT -> {
                        AccusedDetail accusedDetail = new AccusedDetail();
                        accusedDetail.setCasePerson(savedCasePerson);
                        accusedDetail.setArrestStatus(index % 2 == 0 ? ArrestStatus.ARRESTED : ArrestStatus.NOT_ARRESTED);
                        accusedDetail.setBailStatus(new BailStatus[] {BailStatus.NOT_REQUESTED, BailStatus.DENIED, BailStatus.GRANTED, BailStatus.NOT_REQUESTED}[index % 4]);
                        accusedDetail.setCustodyStatus(new CustodyStatus[] {CustodyStatus.POLICE_CUSTODY, CustodyStatus.NONE, CustodyStatus.JUDICIAL_CUSTODY, CustodyStatus.NONE}[index % 4]);
                        accusedDetailRepo.save(accusedDetail);
                    }
                    case WITNESS -> {
                        WitnessDetail witnessDetail = new WitnessDetail();
                        witnessDetail.setCasePerson(savedCasePerson);
                        witnessDetail.setStatementSummary(new String[] {
                            "Witness saw the accused leave the scene in a white hatchback.",
                            "Witness confirmed the theft occurred near the marketplace.",
                            "Witness identified the online payment trail for police.",
                            "Witness provided a timeline of events at the bus stand."
                        }[index % 4]);
                        witnessDetail.setStatementRecordedOn(LocalDate.now().minusDays(11L + index));
                        witnessDetail.setIsProtected(index % 2 == 0);
                        witnessDetailRepo.save(witnessDetail);
                    }
                    }
                }

                while (officerActionRequestRepo.count() < 4 && !cases.isEmpty()) {
                    int index = (int) officerActionRequestRepo.count();
                    io.github.aj316.crimelog.backend.model.requests.OfficerActionRequest actionRequest = new io.github.aj316.crimelog.backend.model.requests.OfficerActionRequest();
                    actionRequest.setCaseId(cases.get(index % cases.size()).getCaseId());
                    actionRequest.setAction(new OfficerAction[] {
                        OfficerAction.CREATE_CASE,
                        OfficerAction.ADD_CASE_NOTE,
                        OfficerAction.REQUEST_CASE_TRANSFER,
                        OfficerAction.UPDATE_REPORT_STATUS
                    }[index % 4]);
                    actionRequest.setRequestPayload(new String[] {
                        "{\"priority\":\"HIGH\",\"state\":\"Maharashtra\"}",
                        "{\"note\":\"Follow-up visit planned\"}",
                        "{\"transferTo\":\"Delhi Police\"}",
                        "{\"reportStatus\":\"UNDER_REVIEW\"}"
                    }[index % 4]);
                    actionRequest.setReason(new String[] {
                        "Create case for a Mumbai retail theft matter.",
                        "Add investigation note for a Thane complaint.",
                        "Request transfer for inter-state coordination.",
                        "Update the public crime report status after review."
                    }[index % 4]);
                    officerActionRequestRepo.save(actionRequest);
                }
                }

                private void ensurePublicUsers(PersonRepository personRepo, UserRepository userRepo, PasswordEncoder encoder) {
                if (userRepo.countByRole(Role.PUBLIC) >= 4) {
                    return;
                }

                Object[][] seeds = {
                    {"Aarav", "Sharma", "Verma", "900000000101", "+919870001011", "+919770001011", "aarav.sharma@crimelog.in", "Mumbai", "Maharashtra", "400001"},
                    {"Isha", "Patel", "Kumar", "900000000102", "+919870001012", "+919770001012", "isha.patel@crimelog.in", "Pune", "Maharashtra", "411001"},
                    {"Kabir", "Singh", "Rao", "900000000103", "+919870001013", "+919770001013", "kabir.singh@crimelog.in", "Bengaluru", "Karnataka", "560034"},
                    {"Meera", "Iyer", "Nair", "900000000104", "+919870001014", "+919770001014", "meera.iyer@crimelog.in", "Delhi", "Delhi", "110019"}
                };

                long existing = userRepo.countByRole(Role.PUBLIC);
                for (int i = (int) existing; i < 4; i++) {
                    Object[] seed = seeds[i];
                    String nationalId = findNextAvailableNationalId(personRepo, Long.parseLong((String) seed[3]));
                    Person person = buildPerson(
                        (String) seed[0],
                        (String) seed[1],
                        (String) seed[2],
                        Gender.MALE,
                        nationalId,
                        (String) seed[4],
                        (String) seed[5],
                        (String) seed[7],
                        (String) seed[8],
                        (String) seed[9],
                        (String) seed[7],
                        (String) seed[8],
                        (String) seed[9],
                        (String) seed[7],
                        (String) seed[8],
                        (String) seed[9]
                    );
                    personRepo.save(person);

                    User user = new User();
                    user.setPerson(person);
                    user.setEmail((String) seed[6]);
                    user.setPassword(encoder.encode("Test@123"));
                    user.setRole(Role.PUBLIC);
                    user.setAccountStatus(Status.APPROVED);
                    userRepo.save(user);
                }
                }

                private void ensureLawyerUsers(PersonRepository personRepo, UserRepository userRepo, LawyerProfileRepository lawyerProfileRepo, PasswordEncoder encoder) {
                if (userRepo.countByRole(Role.LAWYER) >= 4) {
                    return;
                }

                Object[][] seeds = {
                    {"Riya", "Menon", "Iyer", Gender.FEMALE, "910000000101", "+919880001011", "+919780001011", "riya.menon@crimelog.in", "Mumbai", "Maharashtra", "400020", "Riya Menon Chambers", 11001L, "BAR-MH-0001", LawyerSpecialization.CRIMINAL_LAW, "Bandra West", "Mumbai", "Maharashtra", "400050", "DELHI_HIGH_COURT"},
                    {"Aditya", "Joshi", "Kumar", Gender.MALE, "910000000102", "+919880001012", "+919780001012", "aditya.joshi@crimelog.in", "Pune", "Maharashtra", "411004", "Joshi & Associates", 11002L, "BAR-MH-0002", LawyerSpecialization.CIVIL_LAW, "Shivajinagar", "Pune", "Maharashtra", "411005", "MUMBAI_HIGH_COURT"},
                    {"Sana", "Khan", "Patel", Gender.FEMALE, "910000000103", "+919880001013", "+919780001013", "sana.khan@crimelog.in", "Delhi", "Delhi", "110001", "Khan Legal Services", 11003L, "BAR-DL-0003", LawyerSpecialization.FAMILY_LAW, "Connaught Place", "Delhi", "Delhi", "110001", "DELHI_HIGH_COURT"},
                    {"Kabir", "Rao", "Sharma", Gender.MALE, "910000000104", "+919880001014", "+919780001014", "kabir.rao@crimelog.in", "Bengaluru", "Karnataka", "560001", "Rao Chambers", 11004L, "BAR-KA-0004", LawyerSpecialization.TAX_LAW, "Malleswaram", "Bengaluru", "Karnataka", "560003", "KARNATAKA_HIGH_COURT"}
                };

                long existing = userRepo.countByRole(Role.LAWYER);
                for (int i = (int) existing; i < 4; i++) {
                    Object[] seed = seeds[i];
                    String nationalId = findNextAvailableNationalId(personRepo, Long.parseLong((String) seed[4]));
                    Person person = buildPerson(
                        (String) seed[0],
                        (String) seed[1],
                        (String) seed[2],
                        (Gender) seed[3],
                        nationalId,
                        (String) seed[5],
                        (String) seed[6],
                        (String) seed[8],
                        (String) seed[9],
                        (String) seed[10],
                        (String) seed[8],
                        (String) seed[9],
                        (String) seed[10],
                        (String) seed[8],
                        (String) seed[9],
                        (String) seed[10]
                    );
                    personRepo.save(person);

                    User user = new User();
                    user.setPerson(person);
                    user.setEmail((String) seed[7]);
                    user.setPassword(encoder.encode("Test@123"));
                    user.setRole(Role.LAWYER);
                    user.setAccountStatus(Status.APPROVED);
                    User savedUser = userRepo.save(user);

                    LawyerProfile lawyerProfile = new LawyerProfile();
                    lawyerProfile.setUser(savedUser);
                    lawyerProfile.setBarCouncilId((Long) seed[12]);
                    lawyerProfile.setBarRegistrationNumber((String) seed[13]);
                    lawyerProfile.setEnrollmentDate(LocalDate.of(2012 + i, 1, 15));
                    lawyerProfile.setYearsOfExperience(6 + i);
                    lawyerProfile.setSpecialization((LawyerSpecialization) seed[14]);
                    lawyerProfile.setLicenseStatus(LicenseStatus.ACTIVE);
                    lawyerProfile.setFirmName((String) seed[11]);
                    lawyerProfile.setOfficeAddress(buildAddress((String) seed[15], (String) seed[16], (String) seed[17], (String) seed[18]));
                    lawyerProfile.setOfficialContact((String) seed[5]);
                    lawyerProfile.setIsPublicDefender(i % 2 == 0);
                    lawyerProfileRepo.save(lawyerProfile);
                }
                }

    private void seedDemoHistoryLinks(
            PersonRepository personRepo,
            DepartmentUnitRepository unitRepo,
            FirRepository firRepo,
            CaseRepository caseRepo,
            CasePersonRepository casePersonRepo,
            VictimDetailRepository victimDetailRepo,
            AccusedDetailRepository accusedDetailRepo,
            WitnessDetailRepository witnessDetailRepo) {

        if (casePersonRepo.count() >= 4) {
            return;
        }

        List<Person> historyPeople = personRepo.findAll().stream()
                .filter(person -> person.getPersonId() != null && person.getPersonId() > 4)
                .sorted(Comparator.comparing(Person::getPersonId))
                .limit(4)
                .toList();

        if (historyPeople.size() < 4) {
            return;
        }

        DepartmentUnit originUnit = unitRepo.findAll().stream().findFirst().orElse(null);
        if (originUnit == null) {
            return;
        }

        while (firRepo.count() < 4) {
            long nextIndex = firRepo.count() + 1;

            FIR fir = new FIR();
            fir.setFirNumber(String.format("FIR/2026/%05d", 90000 + nextIndex));
            fir.setRegistrationDateTime(LocalDateTime.now().minusDays(10 + nextIndex));
            fir.setAccusedFirstName(new String[]{"Ashok", "Rajesh", "Vikram", "Sanjay"}[(int) ((nextIndex - 1) % 4)]);
            fir.setAccusedLastName(new String[]{"Singh", "Patel", "Sharma", "Kumar"}[(int) ((nextIndex - 1) % 4)]);
            fir.setAccusedContact(String.format("+919500001%03d", nextIndex));
            fir.setAccusedAddress(buildAddress("Demo Accused Lane " + nextIndex, "Mumbai", "Maharashtra", String.format("4006%02d", nextIndex)));
            fir.setIncidentPlace(buildAddress("Demo Incident Road " + nextIndex, "Mumbai", "Maharashtra", String.format("4007%02d", nextIndex)));
            fir.setIncidentDateTime(LocalDateTime.now().minusDays(12 + nextIndex));
            fir.setIncidentDescription("Indian demo history case " + nextIndex);
            fir.setOriginUnit(originUnit);
            fir.setInitialInvestigatingUnit(originUnit);
            fir.setFirType(nextIndex % 2 == 0 ? FIR_Type.ZERO : FIR_Type.REGULAR);
            firRepo.save(fir);
        }

        while (caseRepo.count() < 4) {
            List<FIR> firs = firRepo.findAllByOrderByRegistrationDateTimeDesc();
            long nextIndex = caseRepo.count() + 1;

            Case caseEntity = new Case();
            caseEntity.setCaseNumber(String.format("CASE/2026/%05d", 90000 + nextIndex));
            caseEntity.setStage(new CaseStage[]{CaseStage.INVESTIGATION, CaseStage.TRIAL, CaseStage.APPEAL, CaseStage.CLOSED}[(int) ((nextIndex - 1) % 4)]);
            caseEntity.setFir(firs.get((int) ((nextIndex - 1) % firs.size())));
            caseEntity.setCurrentInvestigatingUnit(originUnit);
            caseEntity.setOpenedOn(LocalDate.now().minusDays(20 + nextIndex));
            if (caseEntity.getStage() == CaseStage.CLOSED) {
                caseEntity.setClosedOn(LocalDate.now().minusDays(2 + nextIndex));
            }
            caseRepo.save(caseEntity);
        }

        List<Case> cases = caseRepo.findAllByOrderByOpenedOnDesc();
        CasePersonType[] types = {CasePersonType.VICTIM, CasePersonType.SUSPECT, CasePersonType.WITNESS, CasePersonType.VICTIM};

        for (int i = 0; i < 4; i++) {
            Case selectedCase = cases.get(i % cases.size());
            Person selectedPerson = historyPeople.get(i);
            CasePersonType casePersonType = types[i];

            if (casePersonRepo.existsByCaseEntity_CaseIdAndPerson_PersonIdAndCasePersonType(selectedCase.getCaseId(), selectedPerson.getPersonId(), casePersonType)) {
                continue;
            }

            CasePerson casePerson = new CasePerson();
            casePerson.setCaseEntity(selectedCase);
            casePerson.setPerson(selectedPerson);
            casePerson.setCasePersonType(casePersonType);
            CasePerson savedCasePerson = casePersonRepo.save(casePerson);

            switch (casePersonType) {
                case VICTIM -> {
                    VictimDetail victimDetail = new VictimDetail();
                    victimDetail.setCasePerson(savedCasePerson);
                    victimDetail.setInjurySeverity(i == 2 ? InjurySeverity.SERIOUS : InjurySeverity.MINOR);
                    victimDetail.setMedicalAttentionRequired(true);
                    victimDetail.setStatementRecordedOn(LocalDate.now().minusDays(7 + i));
                    victimDetailRepo.save(victimDetail);
                }
                case SUSPECT -> {
                    AccusedDetail accusedDetail = new AccusedDetail();
                    accusedDetail.setCasePerson(savedCasePerson);
                    accusedDetail.setArrestStatus(ArrestStatus.ARRESTED);
                    accusedDetail.setBailStatus(BailStatus.DENIED);
                    accusedDetail.setCustodyStatus(CustodyStatus.POLICE_CUSTODY);
                    accusedDetailRepo.save(accusedDetail);
                }
                case WITNESS -> {
                    WitnessDetail witnessDetail = new WitnessDetail();
                    witnessDetail.setCasePerson(savedCasePerson);
                    witnessDetail.setStatementSummary("Witness statement recorded for the Indian demo history seed.");
                    witnessDetail.setStatementRecordedOn(LocalDate.now().minusDays(6 + i));
                    witnessDetail.setIsProtected(true);
                    witnessDetailRepo.save(witnessDetail);
                }
            }
        }
    }

                private Person buildPerson(
                    String firstName,
                    String lastName,
                    String middleName,
                    Gender gender,
                    String nationalId,
                    String primaryContact,
                    String secondaryContact,
                    String city,
                    String state,
                    String postalCode,
                    String birthCity,
                    String birthState,
                    String birthPostalCode,
                    String permanentCity,
                    String permanentState,
                    String permanentPostalCode) {

                Person person = new Person();
                person.setFirstName(firstName);
                person.setLastName(lastName);
                person.setMiddleName(middleName);
                person.setGender(gender);
                person.setNationalityCode("IN");
                person.setDateOfBirth(LocalDate.of(1988, 1, 1));
                person.setNationalId(nationalId);
                person.setContactPrimary(primaryContact);
                person.setContactSecondary(secondaryContact);
                person.setProfilePhotoPath("images/profiles/default-profile.png");
                person.setBirthPlace(buildAddress("1 Birth Lane", birthCity, birthState, birthPostalCode));
                person.setCurrentAddress(buildAddress("12 Current Street", city, state, postalCode));
                person.setPermanentAddress(buildAddress("24 Permanent Avenue", permanentCity, permanentState, permanentPostalCode));
                return person;
                }

                private Address buildAddress(String street, String city, String state, String postalCode) {
                Address address = new Address();
                address.setStreet(street);
                address.setCity(city);
                address.setState(state);
                address.setPostalCode(postalCode);
                address.setCountryCode("IN");
                return address;
                }

                private String findNextAvailableNationalId(PersonRepository personRepo, long candidate) {
                    long nextCandidate = candidate;

                    while (personRepo.existsByNationalId(String.format("%012d", nextCandidate))) {
                        nextCandidate++;
                    }

                    return String.format("%012d", nextCandidate);
                }
}
