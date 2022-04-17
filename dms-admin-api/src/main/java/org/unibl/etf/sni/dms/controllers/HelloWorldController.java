package org.unibl.etf.sni.dms.controllers;

import lombok.AllArgsConstructor;
import org.keycloak.KeycloakPrincipal;
import org.keycloak.KeycloakSecurityContext;
import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;
import org.keycloak.representations.AccessToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.unibl.etf.sni.dms.models.entities.LogEntity;
import org.unibl.etf.sni.dms.services.LogService;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;

@RestController
@RequestMapping
@AllArgsConstructor
public class HelloWorldController {

    private static final String DMS_ADMIN_ROLE = "dms-admin";

    private final LogService logService;

    @GetMapping(path = "/logout")
    private void logout(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String user = getKeycloakUser(request).getPreferredUsername();
        LogEntity logEntity = new LogEntity(0, "INFO", user + " logged out", Instant.now());
        logService.insert(logEntity);

        request.logout();
        response.sendRedirect("https://localhost:4201");
    }

    private AccessToken getKeycloakUser(HttpServletRequest request) {
        KeycloakAuthenticationToken authenticationToken = (KeycloakAuthenticationToken) request.getUserPrincipal();
        KeycloakPrincipal principal = (KeycloakPrincipal) authenticationToken.getPrincipal();
        KeycloakSecurityContext session = principal.getKeycloakSecurityContext();
        return session.getToken();
    }
}
