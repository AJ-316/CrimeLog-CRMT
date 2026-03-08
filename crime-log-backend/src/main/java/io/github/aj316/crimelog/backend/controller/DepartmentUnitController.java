package io.github.aj316.crimelog.backend.controller;

import io.github.aj316.crimelog.backend.dto.ApiResponse;
import io.github.aj316.crimelog.backend.dto.DepartmentUnitDto;
import io.github.aj316.crimelog.backend.dto.DepartmentUnitOptionDto;
import io.github.aj316.crimelog.backend.service.DepartmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/department-unit", "/api/department-units"})
public class DepartmentUnitController {

    private final DepartmentService departmentService;

    public DepartmentUnitController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DepartmentUnitOptionDto>>> getDepartmentUnits() {
        return ResponseEntity.ok(ApiResponse.success(departmentService.getDepartmentUnits(), "Department units retrieved successfully"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<String>> createDepartmentUnit(@RequestBody DepartmentUnitDto departmentUnitDto) {
        return ResponseEntity.ok(ApiResponse.success(departmentService.createDepartmentUnit(departmentUnitDto), "Department Unit created successfully"));
    }
}
