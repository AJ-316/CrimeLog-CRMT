package io.github.aj316.crimelog.backend.service;

import io.github.aj316.crimelog.backend.dto.PersonDto;
import io.github.aj316.crimelog.backend.dto.PersonOptionDto;
import io.github.aj316.crimelog.backend.exception.PersonAlreadyExistsException;
import io.github.aj316.crimelog.backend.model.people.Person;
import io.github.aj316.crimelog.backend.repository.PersonRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Stream;

@Service
public class PersonService {

    private final PersonRepository personRepository;

    public PersonService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    public Person addPerson(PersonDto personDto) {
        Person person = personDto.mapToEntity();
        if (personRepository.existsByNationalId(personDto.nationalId()))
            throw new PersonAlreadyExistsException();

        return personRepository.save(person);
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

    private String buildName(String firstName, String middleName, String lastName) {
        return String.join(" ", Stream.of(firstName, middleName, lastName)
                .filter(value -> value != null && !value.isBlank())
                .toList());
    }
}
