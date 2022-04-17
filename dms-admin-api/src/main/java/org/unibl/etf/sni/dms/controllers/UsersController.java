package org.unibl.etf.sni.dms.controllers;

import lombok.AllArgsConstructor;
import org.keycloak.KeycloakPrincipal;
import org.keycloak.KeycloakSecurityContext;
import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;
import org.keycloak.representations.AccessToken;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.sni.dms.exceptions.BadRequestException;
import org.unibl.etf.sni.dms.models.entities.LogEntity;
import org.unibl.etf.sni.dms.models.entities.UserEntity;
import org.unibl.etf.sni.dms.services.LogService;
import org.unibl.etf.sni.dms.services.UserService;

import javax.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.List;
import java.util.Set;

@RestController
@AllArgsConstructor
@RequestMapping("/users")
public class UsersController {

    private static final String DMS_ADMIN_ROLE = "dms-admin";

    private final UserService userService;
    private final LogService logService;

    @GetMapping
    public List<UserEntity> getAll(HttpServletRequest request) {
        KeycloakAuthenticationToken authenticationToken = (KeycloakAuthenticationToken) request.getUserPrincipal();
        KeycloakPrincipal principal = (KeycloakPrincipal) authenticationToken.getPrincipal();
        KeycloakSecurityContext session = principal.getKeycloakSecurityContext();
        AccessToken accessToken = session.getToken();
        AccessToken.Access access = accessToken.getRealmAccess();
        Set<String> roles = access.getRoles();
        if (!roles.contains(DMS_ADMIN_ROLE))
            throw new BadRequestException("No permission!");

        LogEntity logEntity = new LogEntity(0, "INFO", accessToken.getPreferredUsername() + " required all users", Instant.now());
        logService.insert(logEntity);

        return userService.getAll();
    }

    @PostMapping
    public UserEntity update(@RequestBody UserEntity user, HttpServletRequest request) {
        KeycloakAuthenticationToken authenticationToken = (KeycloakAuthenticationToken) request.getUserPrincipal();
        KeycloakPrincipal principal = (KeycloakPrincipal) authenticationToken.getPrincipal();
        KeycloakSecurityContext session = principal.getKeycloakSecurityContext();
        AccessToken accessToken = session.getToken();
        AccessToken.Access access = accessToken.getRealmAccess();
        Set<String> roles = access.getRoles();

        if (!roles.contains(DMS_ADMIN_ROLE))
            throw new BadRequestException("No permission!");

        LogEntity logEntity = new LogEntity(0, "INFO", accessToken.getPreferredUsername() + " updated user " + user.getId(), Instant.now());
        logService.insert(logEntity);

        return userService.update(user);
    }
}
