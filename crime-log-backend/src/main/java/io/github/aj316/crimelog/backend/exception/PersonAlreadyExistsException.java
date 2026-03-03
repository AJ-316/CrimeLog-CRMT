package io.github.aj316.crimelog.backend.exception;

public class PersonAlreadyExistsException extends AlreadyExistsException {
    public PersonAlreadyExistsException(String person, String field) {
        super("Person", person, field);
    }

    public PersonAlreadyExistsException(String person) {
        super("Person", person);
    }

    public PersonAlreadyExistsException() {
        super("Person");
    }
}
