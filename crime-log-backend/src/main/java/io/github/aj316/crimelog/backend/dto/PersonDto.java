package io.github.aj316.crimelog.backend.dto;

import io.github.aj316.crimelog.backend.model.people.Person;
import io.github.aj316.crimelog.backend.model.types.Gender;

import java.time.LocalDate;
import java.util.Base64;

public record PersonDto(
        String nationalId,
        String firstName,
        String middleName,
        String lastName,
        String profilePhotoPath,
    String profilePhotoData,
    String profilePhotoContentType,
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
        person.setProfilePhotoPath(normalizeProfilePhotoPath(profilePhotoPath));
        person.setProfilePhotoData(decodeProfilePhotoData(profilePhotoData));
        person.setProfilePhotoContentType(normalizeProfilePhotoContentType(profilePhotoContentType, profilePhotoData));
        person.setDateOfBirth(dateOfBirth);
        person.setGender(gender);
        person.setNationalityCode(nationalityCode);
        person.setBirthPlace(birthPlace.mapToEntity());
        person.setPermanentAddress(permanentAddress.mapToEntity());
        person.setCurrentAddress(currentAddress.mapToEntity());
        person.setContactPrimary(contactPrimary);
        person.setContactSecondary(contactSecondary == null || contactSecondary.isBlank() ? null : contactSecondary.trim());
        return person;
    }

    public static PersonDto mapToDto(Person person) {
        return new PersonDto(
                person.getNationalId(),
                person.getFirstName(),
                person.getMiddleName(),
                person.getLastName(),
                person.getProfilePhotoPath(),
            encodeProfilePhotoData(person.getProfilePhotoData()),
            person.getProfilePhotoContentType(),
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

    private String normalizeProfilePhotoPath(String profilePhotoPath) {
        if (profilePhotoPath == null || profilePhotoPath.isBlank()) {
            return "images/profiles/default-profile.png";
        }

        return profilePhotoPath.trim();
    }

    private byte[] decodeProfilePhotoData(String profilePhotoData) {
        if (profilePhotoData == null || profilePhotoData.isBlank()) {
            return null;
        }

        String normalizedData = profilePhotoData.trim();
        int separatorIndex = normalizedData.indexOf(',');
        String base64Data = separatorIndex >= 0 ? normalizedData.substring(separatorIndex + 1) : normalizedData;
        return Base64.getDecoder().decode(base64Data);
    }

    private String normalizeProfilePhotoContentType(String profilePhotoContentType, String profilePhotoData) {
        if (profilePhotoContentType == null || profilePhotoContentType.isBlank()) {
            if (profilePhotoData == null || profilePhotoData.isBlank()) {
                return null;
            }

            String normalizedData = profilePhotoData.trim();
            if (normalizedData.startsWith("data:")) {
                int separatorIndex = normalizedData.indexOf(';');
                if (separatorIndex > 5) {
                    return normalizedData.substring(5, separatorIndex);
                }
            }

            return null;
        }

        return profilePhotoContentType.trim();
    }

    private static String encodeProfilePhotoData(byte[] profilePhotoData) {
        if (profilePhotoData == null || profilePhotoData.length == 0) {
            return null;
        }

        return Base64.getEncoder().encodeToString(profilePhotoData);
    }

}
