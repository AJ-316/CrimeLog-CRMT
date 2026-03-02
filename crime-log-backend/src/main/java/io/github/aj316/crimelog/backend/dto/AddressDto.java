package io.github.aj316.crimelog.backend.dto;

import io.github.aj316.crimelog.backend.model.Address;

public record AddressDto(
        String street,
        String city,
        String state,
        String postalCode,
        String countryCode
) implements MapDto<Address> {

    public Address mapToEntity() {
        Address address = new Address();
        address.setStreet(street);
        address.setCity(city);
        address.setState(state);
        address.setPostalCode(postalCode);
        address.setCountryCode(countryCode);
        return address;
    }

    public static AddressDto mapToDto(Address address) {
        if (address == null) return null;
        return new AddressDto(
                address.getStreet(),
                address.getCity(),
                address.getState(),
                address.getPostalCode(),
                address.getCountryCode()
        );
    }

}