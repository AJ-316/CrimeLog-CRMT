package io.github.aj316.crimelog.backend.service;

import io.github.aj316.crimelog.backend.dto.PersonDto;
import io.github.aj316.crimelog.backend.dto.PersonCaseInvolvementDto;
import io.github.aj316.crimelog.backend.dto.PersonCriminalHistoryDto;
import io.github.aj316.crimelog.backend.dto.PersonOptionDto;
import io.github.aj316.crimelog.backend.exception.PersonAlreadyExistsException;
import io.github.aj316.crimelog.backend.model.cases.parties.CasePerson;
import io.github.aj316.crimelog.backend.model.people.Person;
import io.github.aj316.crimelog.backend.model.types.CaseStage;
import io.github.aj316.crimelog.backend.model.types.CasePersonType;
import io.github.aj316.crimelog.backend.repository.CasePersonRepository;
import io.github.aj316.crimelog.backend.repository.PersonRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Stream;

@Service
public class PersonService {

    private final PersonRepository personRepository;
    private final CasePersonRepository casePersonRepository;

    public PersonService(PersonRepository personRepository, CasePersonRepository casePersonRepository) {
        this.personRepository = personRepository;
        this.casePersonRepository = casePersonRepository;
    }

    public Person addPerson(PersonDto personDto) {
        Person person = personDto.mapToEntity();
        if (personRepository.existsByNationalId(personDto.nationalId()))
            throw new PersonAlreadyExistsException();

        return personRepository.save(person);
    }

        public Person updatePerson(Long personId, PersonDto personDto) {
                Person person = personRepository.findById(personId)
                                .orElseThrow(() -> new NoSuchElementException("Person not found"));

                if (personRepository.existsByNationalIdAndPersonIdNot(personDto.nationalId(), personId)) {
                        throw new PersonAlreadyExistsException();
                }

                Person updatedPerson = personDto.mapToEntity();
                person.setNationalId(updatedPerson.getNationalId());
                person.setFirstName(updatedPerson.getFirstName());
                person.setMiddleName(updatedPerson.getMiddleName());
                person.setLastName(updatedPerson.getLastName());
                person.setProfilePhotoPath(updatedPerson.getProfilePhotoPath());
                person.setProfilePhotoData(updatedPerson.getProfilePhotoData());
                person.setProfilePhotoContentType(updatedPerson.getProfilePhotoContentType());
                person.setDateOfBirth(updatedPerson.getDateOfBirth());
                person.setGender(updatedPerson.getGender());
                person.setNationalityCode(updatedPerson.getNationalityCode());
                person.setBirthPlace(updatedPerson.getBirthPlace());
                person.setPermanentAddress(updatedPerson.getPermanentAddress());
                person.setCurrentAddress(updatedPerson.getCurrentAddress());
                person.setContactPrimary(updatedPerson.getContactPrimary());
                person.setContactSecondary(updatedPerson.getContactSecondary());

                return personRepository.save(person);
        }

        public String deletePerson(Long personId) {
                Person person = personRepository.findById(personId)
                                .orElseThrow(() -> new NoSuchElementException("Person not found"));

                if (casePersonRepository.existsByPerson_PersonId(personId)) {
                        throw new IllegalStateException("Cannot delete person because linked case records exist");
                }

                personRepository.delete(person);
                return "Person(" + personId + ") deleted successfully";
        }

    public List<PersonOptionDto> getPeople() {
        return personRepository.findAllByOrderByFirstNameAscLastNameAsc().stream()
                .map(person -> new PersonOptionDto(
                        person.getPersonId(),
                        buildName(person.getFirstName(), person.getMiddleName(), person.getLastName()),
                        person.getNationalId()
                ))
                .toList();
    }

        public PersonDto getPerson(Long personId) {
                Person person = personRepository.findById(personId)
                                .orElseThrow(() -> new NoSuchElementException("Person not found"));

                return PersonDto.mapToDto(person);
        }

    public PersonCriminalHistoryDto getCriminalHistory(Long personId) {
        Person person = personRepository.findById(personId)
                .orElseThrow(() -> new NoSuchElementException("Person not found"));

        List<CasePerson> involvements = casePersonRepository.findByPerson_PersonIdOrderByAddedOnDesc(personId);

        List<PersonCaseInvolvementDto> involvementDtos = involvements.stream()
                .map(involvement -> new PersonCaseInvolvementDto(
                        involvement.getCaseEntity().getCaseId(),
                        involvement.getCaseEntity().getCaseNumber(),
                        involvement.getCaseEntity().getStage(),
                        involvement.getCasePersonType(),
                        involvement.getCaseEntity().getOpenedOn(),
                        involvement.getCaseEntity().getClosedOn(),
                        involvement.getCaseEntity().getCurrentInvestigatingUnit() != null
                                ? involvement.getCaseEntity().getCurrentInvestigatingUnit().getName()
                                : null,
                        involvement.getCaseEntity().getFir() != null ? involvement.getCaseEntity().getFir().getFirNumber() : null,
                        involvement.getAddedOn()
                ))
                .toList();

        long activeCases = involvements.stream()
                .map(CasePerson::getCaseEntity)
                .filter(caseEntity -> caseEntity.getStage() != CaseStage.CLOSED)
                .count();

        long closedCases = involvements.stream()
                .map(CasePerson::getCaseEntity)
                .filter(caseEntity -> caseEntity.getStage() == CaseStage.CLOSED)
                .count();

        return new PersonCriminalHistoryDto(
                person.getPersonId(),
                buildName(person.getFirstName(), person.getMiddleName(), person.getLastName()),
                person.getNationalId(),
                involvementDtos.size(),
                activeCases,
                closedCases,
                involvementDtos
        );
    }

    public PersonCriminalHistoryDto getSuspectHistory(Long personId) {
        Person person = personRepository.findById(personId)
                .orElseThrow(() -> new NoSuchElementException("Person not found"));

        List<CasePerson> involvements = casePersonRepository
                .findByPerson_PersonIdAndCasePersonTypeOrderByAddedOnDesc(personId, CasePersonType.SUSPECT);

        List<PersonCaseInvolvementDto> involvementDtos = involvements.stream()
                .map(involvement -> new PersonCaseInvolvementDto(
                        involvement.getCaseEntity().getCaseId(),
                        involvement.getCaseEntity().getCaseNumber(),
                        involvement.getCaseEntity().getStage(),
                        involvement.getCasePersonType(),
                        involvement.getCaseEntity().getOpenedOn(),
                        involvement.getCaseEntity().getClosedOn(),
                        involvement.getCaseEntity().getCurrentInvestigatingUnit() != null
                                ? involvement.getCaseEntity().getCurrentInvestigatingUnit().getName()
                                : null,
                        involvement.getCaseEntity().getFir() != null ? involvement.getCaseEntity().getFir().getFirNumber() : null,
                        involvement.getAddedOn()
                ))
                .toList();

        long activeCases = involvements.stream()
                .map(CasePerson::getCaseEntity)
                .filter(caseEntity -> caseEntity.getStage() != CaseStage.CLOSED)
                .count();

        long closedCases = involvements.stream()
                .map(CasePerson::getCaseEntity)
                .filter(caseEntity -> caseEntity.getStage() == CaseStage.CLOSED)
                .count();

        return new PersonCriminalHistoryDto(
                person.getPersonId(),
                buildName(person.getFirstName(), person.getMiddleName(), person.getLastName()),
                person.getNationalId(),
                involvementDtos.size(),
                activeCases,
                closedCases,
                involvementDtos
        );
    }

    private String buildName(String firstName, String middleName, String lastName) {
        return String.join(" ", Stream.of(firstName, middleName, lastName)
                .filter(value -> value != null && !value.isBlank())
                .toList());
    }
}
