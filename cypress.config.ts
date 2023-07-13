import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'https://app.com/',
    "reporter": "mochawesome",
    "reporterOptions": {
    "reportDir": "cypress/reports",
    "inline": true,
    "charts": true,
    // disable overwrite to generate many JSON reports
    "overwrite": false,
    // do not generate intermediate HTML reports
    "html": false,
    // generate intermediate JSON reports
    "json": true,
    "reportTitle": "UI Automation Test Report",
    "reportPageTitle": "E2E Reports",
    "reportFilename": "TestReport",
    "quiet": false,
    "includeScreenshots": true,
    "timestamp": true,
    "code": false,
    //"screenshotsFolder": "cypress/reports/mocha/assets"
    }
  },
})