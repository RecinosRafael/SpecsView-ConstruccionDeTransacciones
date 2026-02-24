const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");
const OracleDatabase = require("./cypress/support/oracle-database");
const fs = require('fs');
const path = require('path');
const oracledb = require("oracledb");

function loadDatabaseConfig() {
  try {
    const configPath = path.resolve(__dirname, 'cypress/fixtures/database-config.json');
    console.log('📖 Leyendo configuración de BD desde:', configPath);

    if (!fs.existsSync(configPath)) {
      throw new Error(`Archivo no encontrado: ${configPath}`);
    }

    const configFile = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configFile);

    if (!config.oracle) {
      throw new Error('El JSON no tiene la propiedad "oracle"');
    }

    console.log('✅ Configuración cargada exitosamente');
    console.log('📊 Usuarios disponibles:');
    console.log('   - jteller:', config.oracle.jteller.connectString);
    console.log('   - jsigcommon:', config.oracle.jsigcommon.connectString);

    return config.oracle;

  } catch (error) {
    console.error('❌ Error CRÍTICO:', error.message);
    throw new Error('No se puede continuar sin configuración de BD');
  }
}

// Cargar configuración
const dbConfigs = loadDatabaseConfig();

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

;

      // Función helper para obtener conexión según usuario
      const getConnectionConfig = (user) => {
        console.log(`🔍 Buscando configuración para usuario solicitado: ${user}`);

        const userLower = user.toLowerCase();

        // MAPEO CORREGIDO: convertir los nombres de usuario a las claves correctas
        const userMap = {
          // Nombres que pueden venir de las pruebas -> claves en dbConfigs
          'jtellerv7': 'jteller',
          'jteller': 'jteller',
          'jsigcommon': 'jsigcommon',
          'jsigcommon': 'jsigcommon'
        };

        // Obtener la clave correcta del mapa
        const configKey = userMap[userLower];

        if (!configKey) {
          console.error(`❌ Usuario no mapeado: ${user}`);
          throw new Error(`Usuario no reconocido: ${user}. Usa 'jteller' o 'jsigcommon'`);
        }

        const config = dbConfigs[configKey];

        if (!config) {
          console.error(`❌ Configuración no encontrada para clave: ${configKey}`);
          throw new Error(`Configuración no encontrada para ${user} (clave: ${configKey})`);
        }

        console.log(`✅ Usando configuración: ${configKey} (${config.user})`);
        return config;
      };

      on("task", {
        async oracleQuery({ sql, binds = [], options = {}, user = 'jteller' }) {
          let connection = null;
          try {
            const connectionConfig = getConnectionConfig(user);

            console.log(`🔌 Conectando como ${connectionConfig.user}...`);
            connection = await oracledb.getConnection(connectionConfig);

            const defaultOptions = {
              outFormat: oracledb.OUT_FORMAT_OBJECT,
              autoCommit: true,
              ...options
            };

            const result = await connection.execute(sql, binds, defaultOptions);

            return {
              success: true,
              rows: result.rows || [],
              rowsAffected: result.rowsAffected || 0,
              metaData: result.metaData || [],
              user: user,
              sql: sql // Incluir el SQL en el resultado
            };

          } catch (error) {
            console.error(`❌ Error en oracleQuery (${user}):`, error.message);
            console.error('📝 Query que falló:', sql); // Mostrar en consola

            // Devolver información detallada del error incluyendo el SQL
            return {
              success: false,
              error: error.message,
              errorCode: error.errorNum,
              user: user,
              sql: sql, // Incluir el SQL que falló
              binds: binds,
              rows: [],
              rowsAffected: 0,
              metaData: []
            };
          } finally {
            if (connection) {
              try {
                await connection.close();
              } catch (error) {
                console.error('Error cerrando conexión:', error);
              }
            }
          }
        },
      });

      // Pasar configuración a las pruebas
      config.env.database = {
        users: {
          jteller: {
            user: dbConfigs.jteller.user,
            connectString: dbConfigs.jteller.connectString
          },
          jsigcommon: {
            user: dbConfigs.jsigcommon.user,
            connectString: dbConfigs.jsigcommon.connectString
          }
        }
      };

      return config;
    },

    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
      testIsolation: false,
  },
});