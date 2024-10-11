package com.example.pfe.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfiguration(
        JwtAuthenticationFilter jwtAuthenticationFilter,
        AuthenticationProvider authenticationProvider
    ) {
        this.authenticationProvider = authenticationProvider;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors()
        .and()
        .csrf()
                .disable()
                .authorizeHttpRequests(authorize -> authorize
                    .requestMatchers("/auth/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/documents/user/**").permitAll()
                    .requestMatchers("/auth/signup").permitAll() // Allow all requests under /auth
                    .requestMatchers(HttpMethod.POST, "/documents/upload").permitAll()  // Allow all users to upload documents
                    .requestMatchers(HttpMethod.GET, "/documents/**").permitAll()  // Allow EEP and AGENT to access documents
                    .requestMatchers("/documents/download/**").hasAnyRole("AGENT", "EEP") // Restrict access to download documents to AGENT and EEP
                    .requestMatchers(HttpMethod.GET, "/api/documents/user/**").hasAnyRole("EEP", "AGENT")
                    .anyRequest().authenticated()
                )                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
            CorsConfiguration configuration = new CorsConfiguration();
    
            // Allow the front-end origin (localhost:4200)
            configuration.setAllowedOrigins(List.of("http://localhost:4200"));
    
            // Allow standard HTTP methods
            configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    
            // Allow standard headers (including Authorization for tokens)
            configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    
            // Allow credentials if necessary (for cookies, Authorization headers)
            configuration.setAllowCredentials(true);
    
            // Apply the configuration to all endpoints
            UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
            source.registerCorsConfiguration("/**", configuration);
    
            return source;
        }
    }
    
        

