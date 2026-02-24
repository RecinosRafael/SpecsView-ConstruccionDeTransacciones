const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");

module.exports = defineConfig({

  viewportWidth: 1500,
  viewportHeight: 900,
  chromeWebSecurity: false,
  experimentalStudio: true,
  scrollBehavior: false,
  screenshotOnRunFailure: true,
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/report',
    charts: true,
    reportPageTitle: 'Reporte pruebas automatizadas specs-view',
    inlineAssets: true,
    saveAllAttempts: false,
    reportFilename: process.env.CYPRESS_reportName
        ? `${process.env.CYPRESS_reportName}-[datetime]`
        : "reporte-[datetime]",
  },



  e2e: {
    setupNodeEvents(on, config) {

      require('cypress-mochawesome-reporter/plugin')(on);

      const filePath = path.resolve("cypress/fixtures/config.json");

      if (fs.existsSync(filePath)) {
        const file = fs.readFileSync(filePath);
        const jsonData = JSON.parse(file);

        config.env = {
          ...config.env,
          ...jsonData
        };
      } else {
        console.log("No se encontró config.json");
      }

      return config;
    },
    testIsolation: false,
  },
});