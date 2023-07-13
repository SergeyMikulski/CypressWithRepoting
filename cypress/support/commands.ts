/// <reference types="cypress" />

import{groupsHelper} from '../support/groupsHelper'
import{manageGroupHelper} from '../support/manageGroupHelper'

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('deleteGroup', (groupToBeDeleted:string) => {
  cy.wrap(null, {log:false}).then(() =>{
    groupsHelper.openManageGroupPopup(groupToBeDeleted)
  }).then(() =>{
    manageGroupHelper.pressDeleteButton()
  })
})
