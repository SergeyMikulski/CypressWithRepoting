// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import addContext from "mochawesome/addContext"

// Alternatively you can use CommonJS syntax:
// require('./commands')


// pay attention to the "screenshot" constant because if you specify an incorrect file name mask, the screenshot will not be included in the report
//in order to generate report locally set another root within "const screenshots =":
//const screenshot =`../../screenshots/${Cypress.spec.name}/${runnable.parent.title} -- ${test.title} (failed).png`;
//!!!Do NOT forget to return back!!!! Otherwise GitLab test reports will have no Screenshots!!!
Cypress.on("test:after:run", (test, runnable) => {  
  if (test.state === "failed") {
    const screenshot =`screenshots/${Cypress.spec.name}/${runnable.parent.title} -- ${test.title} (failed).png`;    
  addContext({ test }, screenshot);  
  }
});

//commands to generate report locally (one by one):
//npx cypress run --browser chrome
//npx mochawesome-merge cypress/reports/*.json -o cypress/reports/mocha/output.json
//npx mochawesome-report-generator cypress/reports/mocha/output.json --reportDir ./ --inline
