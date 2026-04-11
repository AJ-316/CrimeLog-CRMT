package io.github.aj316.crimelog.backend.service;

import io.github.aj316.crimelog.backend.dto.alerts.AlertDto;
import io.github.aj316.crimelog.backend.dto.alerts.CreateAlertRequest;
import io.github.aj316.crimelog.backend.model.Alert;
import io.github.aj316.crimelog.backend.model.types.AlertSeverity;
import io.github.aj316.crimelog.backend.model.types.Role;
import io.github.aj316.crimelog.backend.repository.AlertRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlertService {

    private final AlertRepository alertRepository;

    public AlertService(AlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    public AlertDto createAlert(CreateAlertRequest request, Long createdByUserId, Role createdByRole) {
        return createAlert(request.message().trim(), request.severity(), createdByUserId, createdByRole, null);
    }

    public AlertDto createAlert(String message, AlertSeverity severity, Long createdByUserId, Role createdByRole, Long sourceReportId) {
        Alert alert = new Alert();
        alert.setMessage(message.trim());
        alert.setSeverity(severity);
        alert.setCreatedByUserId(createdByUserId);
        alert.setCreatedByRole(createdByRole);
        alert.setSourceReportId(sourceReportId);
        alert.setActive(true);

        return AlertDto.from(alertRepository.save(alert));
    }

    public List<AlertDto> getActiveAlerts() {
        return alertRepository.findByActiveTrueOrderByCreatedAtDesc().stream()
                .map(AlertDto::from)
                .toList();
    }
}
