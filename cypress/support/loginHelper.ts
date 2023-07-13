/// <reference types="cypress" />

class LoginHelper{
    initialLogin(){
        cy.visit('/')
        cy.get('#username').type(Cypress.env('adminLogin'))
        cy.get('#password').type(Cypress.env('adminPassword'))
        cy.get('#kc-login').click()
    }
}

export const loginHelper = new LoginHelper()