#!/bin/bash

npx cypress run --browser chrome
npx mochawesome-merge cypress/reports/*.json -o cypress/reports/mocha/index.json
npx mochawesome-report-generator cypress/reports/mocha/index.json --reportDir ./cypress/reports/mocha/ --inline
