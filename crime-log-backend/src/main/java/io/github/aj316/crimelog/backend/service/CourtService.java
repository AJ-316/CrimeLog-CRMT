package io.github.aj316.crimelog.backend.service;

import io.github.aj316.crimelog.backend.dto.CourtOptionDto;
import io.github.aj316.crimelog.backend.repository.CourtRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourtService {

    private final CourtRepository courtRepository;

    public CourtService(CourtRepository courtRepository) {
        this.courtRepository = courtRepository;
    }

    public List<CourtOptionDto> getCourts() {
        return courtRepository.findAllByOrderByCourtNameAsc().stream()
                .map(court -> new CourtOptionDto(court.getCourtId(), court.getCourtName()))
                .toList();
    }
}