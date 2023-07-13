/// <reference types="cypress" />
declare global{
namespace Cypress {
    interface Chainable<Subject = any> {
        deleteGroup(value: string): Chainable<any>;
    }
  }
}
export {}