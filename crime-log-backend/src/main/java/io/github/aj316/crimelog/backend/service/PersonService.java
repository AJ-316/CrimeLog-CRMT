package io.github.aj316.crimelog.backend.service;

import io.github.aj316.crimelog.backend.dto.PersonDto;
import io.github.aj316.crimelog.backend.exception.PersonAlreadyExistsException;
import io.github.aj316.crimelog.backend.model.people.Person;
import io.github.aj316.crimelog.backend.repository.PersonRepository;
import org.springframework.stereotype.Service;

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
}
