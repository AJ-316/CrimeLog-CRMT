package io.github.aj316.crimelog.backend.dto;

import io.github.aj316.crimelog.backend.model.people.Person;
import io.github.aj316.crimelog.backend.model.types.Gender;

import java.time.LocalDate;

public record PersonDto(
        String nationalId,
        String firstName,
        String middleName,
        String lastName,
        String profilePhotoPath,
        LocalDate dateOfBirth,
        Gender gender,
        String nationalityCode,
        AddressDto birthPlace,
        AddressDto permanentAddress,
        AddressDto currentAddress,
        String contactPrimary,
        String contactSecondary
) implements MapDto<Person> {

    public Person mapToEntity() {
        Person person = new Person();
        person.setNationalId(nationalId);
        person.setFirstName(firstName);
        person.setMiddleName(middleName);
        person.setLastName(lastName);
        person.setProfilePhotoPath(profilePhotoPath);
        person.setDateOfBirth(dateOfBirth);
        person.setGender(gender);
        person.setNationalityCode(nationalityCode);
        person.setBirthPlace(birthPlace.mapToEntity());
        person.setPermanentAddress(permanentAddress.mapToEntity());
        person.setCurrentAddress(currentAddress.mapToEntity());
        person.setContactPrimary(contactPrimary);
        person.setContactSecondary(contactSecondary);
        return person;
    }

    public static PersonDto mapToDto(Person person) {
        return new PersonDto(
                person.getNationalId(),
                person.getFirstName(),
                person.getMiddleName(),
                person.getLastName(),
                person.getProfilePhotoPath(),
                person.getDateOfBirth(),
                person.getGender(),
                person.getNationalityCode(),
                AddressDto.mapToDto(person.getBirthPlace()),
                AddressDto.mapToDto(person.getPermanentAddress()),
                AddressDto.mapToDto(person.getCurrentAddress()),
                person.getContactPrimary(),
                person.getContactSecondary()
        );
    }

}
