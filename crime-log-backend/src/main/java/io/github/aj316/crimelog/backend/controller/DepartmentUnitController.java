package io.github.aj316.crimelog.backend.controller;

import io.github.aj316.crimelog.backend.dto.ApiResponse;
import io.github.aj316.crimelog.backend.dto.DepartmentUnitDto;
import io.github.aj316.crimelog.backend.service.DepartmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/department-unit")
public class DepartmentUnitController {

    private final DepartmentService departmentService;

    public DepartmentUnitController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<String>> createDepartmentUnit(@RequestBody DepartmentUnitDto departmentUnitDto) {
        return ResponseEntity.ok(ApiResponse.success(departmentService.createDepartmentUnit(departmentUnitDto), "Department Unit created successfully"));
    }
}
