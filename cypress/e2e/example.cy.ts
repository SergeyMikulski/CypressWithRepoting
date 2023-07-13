/// <reference types="cypress" />

import{loginHelper} from '../support/loginHelper'

before(() =>{
  cy.on('uncaught:exception', (err, runnable) => {
    return false
  })
  loginHelper.initialLogin()
})

describe('Failed test just to show error hadling in report. To be deleted later', () => {
  it('Failed test just to show error hadling in report. To be deleted later', () => {
    cy.get('a.Group_link__k5Wuq').eq(0).click()
    cy.get('.MuiButton-containedPrimary').should('have.text', 'Add a template 1231233123')
  })
})