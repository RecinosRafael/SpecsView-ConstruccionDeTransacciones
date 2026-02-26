const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");
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
    console.log('   - jsigperson_data:', config.oracle.jsigperson_data.connectString);
    console.log('   - logdat:', config.oracle.logdat.connectString);
    console.log('   - security:', config.oracle.security.connectString);
    console.log('   - distributor:', config.oracle.distributor.connectString);
    console.log('   - jsignature:', config.oracle.jsignature.connectString);
    console.log('   - jsigperson_conf:', config.oracle.jsigperson_conf.connectString);

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

        const userMap = {
          'jtellerv7': 'jteller',
          'jteller': 'jteller',
          'jsigcommon': 'jsigcommon',
          'jsigperson_data': 'jsigperson_data',
          'logdat': 'logdat',
          'security': 'security',
          'distributor': 'distributor',
          'jsignature': 'jsignature',
          'jsigperson_conf': 'jsigperson_conf'
          
          // Añade más si es necesario
        };

        const configKey = userMap[userLower];
        if (!configKey) {
          throw new Error(`Usuario no reconocido: ${user}. Válidos: ${Object.keys(userMap).join(', ')}`);
        }

        const config = dbConfigs[configKey];
        if (!config) {
          throw new Error(`Configuración no encontrada para clave: ${configKey}`);
        }

        console.log(`✅ Usando configuración: ${configKey} (${config.user})`);
        return config;
      };

on("task", {
  oracleQuery: async ({ sql, binds = [], options = {}, user = 'jteller' }) => {
    console.log(`\n[oracleQuery] ===== INICIANDO TAREA =====`);
    console.log(`[oracleQuery] Usuario: ${user}`);
    console.log(`[oracleQuery] SQL: ${sql.substring(0, 200)}...`);
    
    let connection = null;
    
    try {
      // 1. Obtener configuración
      console.log(`[oracleQuery] Obteniendo configuración para ${user}...`);
      let connectionConfig;
      try {
        connectionConfig = getConnectionConfig(user);
        console.log(`[oracleQuery] Configuración obtenida: ${connectionConfig.user}@${connectionConfig.connectString}`);
      } catch (configError) {
        console.error(`[oracleQuery] ERROR en getConnectionConfig:`, configError.message);
        return { 
          success: false, 
          error: `Error de configuración: ${configError.message}`,
          user,
          sql 
        };
      }

      // 2. Conectar
      console.log(`[oracleQuery] Conectando a Oracle...`);
      try {
        connection = await oracledb.getConnection(connectionConfig);
        console.log(`[oracleQuery] Conexión exitosa`);
      } catch (connError) {
        console.error(`[oracleQuery] ERROR de conexión:`, connError.message);
        return { 
          success: false, 
          error: `Error de conexión: ${connError.message}`,
          user,
          sql 
        };
      }

      // 3. Ejecutar query con opciones optimizadas
      console.log(`[oracleQuery] Ejecutando query...`);
      
      // OPCIONES MEJORADAS para manejar grandes volúmenes de datos
      const defaultOptions = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        autoCommit: true,
        maxRows: 0,              // 0 = sin límite (todas las filas)
        fetchArraySize: 1000,     // Traer 1000 filas por lote
        prefetchRows: 1000,       // Pre-cargar 1000 filas
        ...options
      };
      
      let result;
      try {
        result = await connection.execute(sql, binds, defaultOptions);
        console.log(`[oracleQuery] Query ejecutada. Filas: ${result.rows?.length || 0}, Afectadas: ${result.rowsAffected || 0}`);
        
        // Log adicional si hay muchas filas
        if (result.rows?.length > 500) {
          console.log(`[oracleQuery] ⚠️ Gran volumen de datos: ${result.rows.length} filas`);
        }
      } catch (execError) {
        console.error(`[oracleQuery] ERROR de ejecución:`, execError.message);
        console.error(`[oracleQuery] Código de error:`, execError.errorNum);
        return { 
          success: false, 
          error: execError.message,
          errorCode: execError.errorNum,
          user,
          sql,
          binds
        };
      }

      // 4. Éxito
      return {
        success: true,
        rows: result.rows || [],
        rowsAffected: result.rowsAffected || 0,
        metaData: result.metaData || [],
        user,
        sql
      };

    } catch (error) {
      // Capturar cualquier error no esperado
      console.error(`[oracleQuery] ERROR INESPERADO:`, error);
      console.error(`[oracleQuery] Stack:`, error.stack);
      return {
        success: false,
        error: `Error inesperado: ${error.message}`,
        user,
        sql
      };
    } finally {
      // 5. Cerrar conexión (pero sin afectar el return)
      if (connection) {
        try {
          console.log(`[oracleQuery] Cerrando conexión...`);
          await connection.close();
          console.log(`[oracleQuery] Conexión cerrada`);
        } catch (closeError) {
          console.error(`[oracleQuery] Error cerrando conexión:`, closeError);
          // No afectamos el resultado, solo logueamos
        }
      }
      console.log(`[oracleQuery] ===== TAREA FINALIZADA =====\n`);
    }
  }
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
          },
          jsigperson_data: {
            user: dbConfigs.jsigperson_data.user,
            connectString: dbConfigs.jsigperson_data.connectString
          },
          logdat: {
            user: dbConfigs.logdat.user,
            connectString: dbConfigs.logdat.connectString
          },
          security: {
            user: dbConfigs.security.user,
            connectString: dbConfigs.security.connectString
          },
          distributor: {
            user: dbConfigs.distributor.user,
            connectString: dbConfigs.distributor.connectString
          },
          jsignature: {
            user: dbConfigs.jsignature.user,
            connectString: dbConfigs.jsignature.connectString
          },
          jsigperson_conf: {
            user: dbConfigs.jsigperson_conf.user,
            connectString: dbConfigs.jsigperson_conf.connectString
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