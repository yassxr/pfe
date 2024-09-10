package com.example.pfe.responses;

public class LoginResponse {
    private String token;

    private long expiresIn;

    public String getToken() {
        return token;
    }

    public LoginResponse setToken(String token) {
        this.token = token;
        return this;  // Return 'this' to allow method chaining
    }

    // Modified setExpiresIn method to return LoginResponse
    public LoginResponse setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
        return this;  // Return 'this' to allow method chaining
    }

    public long getExpiresIn() {
        return expiresIn;
    }


}