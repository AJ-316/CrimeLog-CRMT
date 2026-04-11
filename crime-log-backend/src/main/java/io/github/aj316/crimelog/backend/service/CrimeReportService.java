package io.github.aj316.crimelog.backend.service;

import io.github.aj316.crimelog.backend.dto.reports.BroadcastCrimeReportRequest;
import io.github.aj316.crimelog.backend.dto.reports.CrimeReportDetailDto;
import io.github.aj316.crimelog.backend.dto.reports.CrimeReportSummaryDto;
import io.github.aj316.crimelog.backend.dto.reports.CrimeReportTimelineDto;
import io.github.aj316.crimelog.backend.dto.reports.UpdateCrimeReportStatusRequest;
import io.github.aj316.crimelog.backend.model.CrimeReport;
import io.github.aj316.crimelog.backend.model.CrimeReportTimelineEntry;
import io.github.aj316.crimelog.backend.model.people.users.User;
import io.github.aj316.crimelog.backend.model.types.AlertSeverity;
import io.github.aj316.crimelog.backend.model.types.CrimeReportStatus;
import io.github.aj316.crimelog.backend.model.types.Role;
import io.github.aj316.crimelog.backend.repository.CrimeReportRepository;
import io.github.aj316.crimelog.backend.repository.CrimeReportTimelineRepository;
import io.github.aj316.crimelog.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class CrimeReportService {

    private final CrimeReportRepository crimeReportRepository;
    private final CrimeReportTimelineRepository crimeReportTimelineRepository;
    private final UserRepository userRepository;
    private final AlertService alertService;

    public CrimeReportService(CrimeReportRepository crimeReportRepository,
                              CrimeReportTimelineRepository crimeReportTimelineRepository,
                              UserRepository userRepository,
                              AlertService alertService) {
        this.crimeReportRepository = crimeReportRepository;
        this.crimeReportTimelineRepository = crimeReportTimelineRepository;
        this.userRepository = userRepository;
        this.alertService = alertService;
    }

    @Transactional
    public CrimeReportDetailDto submitReport(String title, String description, String location, LocalDateTime incidentDateTime, Long reporterUserId, Role reporterRole) {
        CrimeReport report = new CrimeReport();
        report.setTitle(title.trim());
        report.setDescription(description.trim());
        report.setLocation(location.trim());
        report.setIncidentDateTime(incidentDateTime);
        report.setReporterUserId(reporterUserId);
        report.setStatus(CrimeReportStatus.SENT_TO_POLICE);
        report.setPublicBroadcasted(false);

        CrimeReport savedReport = crimeReportRepository.save(report);
        appendTimeline(savedReport.getReportId(), CrimeReportStatus.SENT_TO_POLICE, "Report submitted and sent to police", reporterUserId, reporterRole);
        return toDetail(savedReport, reporterUserId, reporterRole);
    }

    public List<CrimeReportSummaryDto> getReportsForUser(Long reporterUserId) {
        return crimeReportRepository.findByReporterUserIdOrderByCreatedAtDesc(reporterUserId).stream()
                .map(this::toSummary)
                .toList();
    }

    public List<CrimeReportSummaryDto> getAllReports() {
        return crimeReportRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toSummary)
                .toList();
    }

    public CrimeReportDetailDto getReport(Long reportId, Long viewerUserId, Role viewerRole) {
        CrimeReport report = findAccessibleReport(reportId, viewerUserId, viewerRole);
        return toDetail(report, viewerUserId, viewerRole);
    }

    public List<CrimeReportTimelineDto> getTimeline(Long reportId, Long viewerUserId, Role viewerRole) {
        findAccessibleReport(reportId, viewerUserId, viewerRole);
        return crimeReportTimelineRepository.findByReportIdOrderByCreatedAtAsc(reportId).stream()
                .map(entry -> CrimeReportTimelineDto.from(entry, buildName(entry.getChangedByUserId())))
                .toList();
    }

    @Transactional
    public CrimeReportDetailDto updateStatus(Long reportId, Long actorUserId, Role actorRole, UpdateCrimeReportStatusRequest request) {
        if (actorRole != Role.ADMIN && actorRole != Role.OFFICER) {
            throw new IllegalArgumentException("Only admins or officers can update crime reports");
        }

        CrimeReport report = crimeReportRepository.findById(reportId)
                .orElseThrow(() -> new NoSuchElementException("Crime report not found"));

        CrimeReportStatus nextStatus = request.status();
        report.setStatus(nextStatus);
        if (report.getAcknowledgedAt() == null && nextStatus != CrimeReportStatus.SENT_TO_POLICE) {
            report.setAcknowledgedAt(LocalDateTime.now());
            report.setAcknowledgedByUserId(actorUserId);
        }

        crimeReportRepository.save(report);
        appendTimeline(reportId, nextStatus, StringUtils.hasText(request.note()) ? request.note().trim() : "Status updated to " + nextStatus, actorUserId, actorRole);
        return toDetail(report, actorUserId, actorRole);
    }

    @Transactional
    public CrimeReportDetailDto broadcastReport(Long reportId, Long actorUserId, Role actorRole, BroadcastCrimeReportRequest request) {
        if (actorRole != Role.ADMIN && actorRole != Role.OFFICER) {
            throw new IllegalArgumentException("Only admins or officers can broadcast crime reports");
        }

        CrimeReport report = crimeReportRepository.findById(reportId)
                .orElseThrow(() -> new NoSuchElementException("Crime report not found"));

        if (!Boolean.TRUE.equals(report.getPublicBroadcasted())) {
            String message = StringUtils.hasText(request.message())
                    ? request.message().trim()
                    : "Public safety alert: " + report.getTitle() + " at " + report.getLocation();

            AlertSeverity severity = request.severity() != null ? request.severity() : AlertSeverity.HIGH;
            alertService.createAlert(message, severity, actorUserId, actorRole, reportId);
            report.setPublicBroadcasted(true);
            report.setPublicBroadcastedAt(LocalDateTime.now());
            report.setPublicBroadcastedByUserId(actorUserId);
            crimeReportRepository.save(report);
            appendTimeline(reportId, report.getStatus(), "Broadcasted to public alerts", actorUserId, actorRole);
        }

        return toDetail(report, actorUserId, actorRole);
    }

    private void appendTimeline(Long reportId, CrimeReportStatus status, String note, Long changedByUserId, Role changedByRole) {
        CrimeReportTimelineEntry entry = new CrimeReportTimelineEntry();
        entry.setReportId(reportId);
        entry.setStatus(status);
        entry.setNote(note);
        entry.setChangedByUserId(changedByUserId);
        entry.setChangedByRole(changedByRole);
        crimeReportTimelineRepository.save(entry);
    }

    private CrimeReport findAccessibleReport(Long reportId, Long viewerUserId, Role viewerRole) {
        CrimeReport report = crimeReportRepository.findById(reportId)
                .orElseThrow(() -> new NoSuchElementException("Crime report not found"));

        if (viewerRole == Role.ADMIN || viewerRole == Role.OFFICER || report.getReporterUserId().equals(viewerUserId)) {
            return report;
        }

        throw new IllegalArgumentException("You do not have permission to view this crime report");
    }

    private CrimeReportSummaryDto toSummary(CrimeReport report) {
        return new CrimeReportSummaryDto(
                report.getReportId(),
                report.getTitle(),
                report.getLocation(),
                report.getStatus(),
                report.getReporterUserId(),
                buildName(report.getReporterUserId()),
                report.getIncidentDateTime(),
                report.getCreatedAt(),
                report.getUpdatedAt(),
                report.getAcknowledgedAt(),
                report.getPublicBroadcasted()
        );
    }

    private CrimeReportDetailDto toDetail(CrimeReport report, Long viewerUserId, Role viewerRole) {
        List<CrimeReportTimelineDto> timeline = crimeReportTimelineRepository.findByReportIdOrderByCreatedAtAsc(report.getReportId()).stream()
                .map(entry -> CrimeReportTimelineDto.from(entry, buildName(entry.getChangedByUserId())))
                .toList();

        return new CrimeReportDetailDto(
                report.getReportId(),
                report.getTitle(),
                report.getDescription(),
                report.getLocation(),
                report.getStatus(),
                report.getReporterUserId(),
                buildName(report.getReporterUserId()),
                report.getIncidentDateTime(),
                report.getCreatedAt(),
                report.getUpdatedAt(),
                report.getAcknowledgedAt(),
                report.getAcknowledgedByUserId() != null ? buildName(report.getAcknowledgedByUserId()) : null,
                report.getPublicBroadcasted(),
                report.getPublicBroadcastedAt(),
                report.getPublicBroadcastedByUserId() != null ? buildName(report.getPublicBroadcastedByUserId()) : null,
                timeline
        );
    }

    private String buildName(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || user.getPerson() == null) {
            return user != null ? user.getEmail() : "Unknown user";
        }

        return String.join(" ", java.util.stream.Stream.of(
                user.getPerson().getFirstName(),
                user.getPerson().getMiddleName(),
                user.getPerson().getLastName()
        ).filter(value -> value != null && !value.isBlank()).toList());
    }
}
