const { defineConfig } = require("cypress");
const fs = require('fs');
const path = require('path');
const oracledb = require("oracledb");
const mysql = require('mysql2/promise');

// ============================================
// CARGA DE CONFIGURACIÓN DE BASE DE DATOS
// ============================================
function loadDatabaseConfig() {
  try {
    const configPath = path.resolve(__dirname, 'cypress/fixtures/database-config.json');
    console.log('📖 Leyendo configuración de BD desde:', configPath);

    if (!fs.existsSync(configPath)) {
      throw new Error(`Archivo no encontrado: ${configPath}`);
    }

    const configFile = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configFile);

    console.log('✅ Configuración de BD cargada exitosamente');
    
    if (config.oracle) {
      console.log('📊 ORACLE - Usuarios disponibles:');
      Object.keys(config.oracle).forEach(key => {
        console.log(`   - ${key}: ${config.oracle[key].connectString} (user: ${config.oracle[key].user})`);
      });
    }
    
    if (config.mysql) {
      console.log('📊 MYSQL - Usuarios disponibles:');
      Object.keys(config.mysql).forEach(key => {
        console.log(`   - ${key}: ${config.mysql[key].host}:${config.mysql[key].port}/${config.mysql[key].database} (user: ${config.mysql[key].user})`);
      });
    }

    return config;

  } catch (error) {
    console.error('❌ Error CRÍTICO en BD:', error.message);
    throw new Error('No se puede continuar sin configuración de BD');
  }
}

// ============================================
// CARGA DE VARIABLES DE ENTORNO (cypress.env.json)
// ============================================
function loadEnvConfig() {
  try {
    const envPath = path.resolve(__dirname, 'cypress.env.json');
    console.log('📖 Leyendo configuración de entorno desde:', envPath);

    if (fs.existsSync(envPath)) {
      const envFile = fs.readFileSync(envPath, 'utf8');
      const envConfig = JSON.parse(envFile);
      console.log('✅ Configuración de entorno cargada exitosamente');
      console.log(`   - BASE_URL: ${envConfig.BASE_URL}`);
      console.log(`   - USER: ${envConfig.USER}`);
      return envConfig;
    } else {
      console.log('⚠️ No se encontró cypress.env.json, usando variables de entorno del sistema');
      return {};
    }
  } catch (error) {
    console.error('❌ Error cargando cypress.env.json:', error.message);
    return {};
  }
}

// Cargar configuraciones
const dbConfigs = loadDatabaseConfig();
const envConfig = loadEnvConfig();

// ============================================
// CONFIGURACIÓN PRINCIPAL DE CYPRESS
// ============================================
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
      numTestsKeptInMemory: 0,
      require('cypress-mochawesome-reporter/plugin')(on);
      

      // ============================================
      // COMBINAR VARIABLES DE ENTORNO
      // ============================================
      const dbType = process.env.DB_TYPE || config.env.DB_TYPE || 'oracle';
      
      // Fusionar config.env con envConfig
      config.env = {
        ...config.env,      // Variables existentes
        ...envConfig,       // Variables de cypress.env.json
        DB_TYPE: dbType,    // Tipo de base de datos
        database: {          // Configuración de BD
          type: dbType,
          oracle: dbConfigs.oracle || {},
          mysql: dbConfigs.mysql || {}
        }
      };

      console.log(`\n🔧 Usando base de datos: ${dbType.toUpperCase()}`);
      console.log(`🔧 Usando URL: ${config.env.BASE_URL || 'No definida'}`);
      console.log(`🔧 Usando usuario: ${config.env.USER || 'No definido'}\n`);

      // ============================================
      // FUNCIÓN PARA NORMALIZAR STRINGS
      // ============================================
      const normalizeString = (str) => {
        return str?.toString().trim().toLowerCase() || '';
      };

      // ============================================
      // FUNCIÓN PARA OBTENER CONFIGURACIÓN DE CONEXIÓN
      // ============================================
      const getConnectionConfig = (user, type = dbType) => {
        console.log(`🔍 Buscando configuración para ${type}:${user}`);
        const userNormalized = normalizeString(user);

        const userMap = {
          'jtellerv7': 'jteller',
          'jteller': 'jteller',
          'jsigcommon': 'jsigcommon',
          'jsigperson_data': 'jsigperson_data',
          'logdat': 'logdat',
          'security': 'security',
          'distributor': 'distributor',
          'jsignature': 'jsignature',
          'jsigperson_conf': 'jsigperson_conf',
          'root': 'root'
        };

        let configKey = userMap[userNormalized];
        
        if (!configKey) {
          const foundKey = Object.keys(userMap).find(key => 
            normalizeString(key) === userNormalized
          );
          configKey = foundKey ? userMap[foundKey] : null;
        }

        if (!configKey) {
          throw new Error(`Usuario no reconocido: ${user}. Válidos: ${Object.keys(userMap).join(', ')}`);
        }

        if (type === 'oracle') {
          let oracleConfig = dbConfigs.oracle?.[configKey];
          
          if (!oracleConfig && dbConfigs.oracle) {
            const oracleKey = Object.keys(dbConfigs.oracle).find(key => 
              normalizeString(key) === normalizeString(configKey)
            );
            oracleConfig = oracleKey ? dbConfigs.oracle[oracleKey] : null;
          }
          
          if (!oracleConfig) {
            throw new Error(`Configuración Oracle no encontrada para clave: ${configKey}`);
          }
          
          console.log(`✅ Usando ORACLE: ${oracleConfig.user}@${oracleConfig.connectString}`);
          
          return {
            user: oracleConfig.user,
            password: oracleConfig.password,
            connectString: oracleConfig.connectString,
            schema: configKey.toUpperCase(),
            originalUser: user
          };
        } 
        else if (type === 'mysql') {
          let mysqlConfig = dbConfigs.mysql?.[configKey];
          
          if (!mysqlConfig && dbConfigs.mysql) {
            const mysqlKey = Object.keys(dbConfigs.mysql).find(key => 
              normalizeString(key) === normalizeString(configKey)
            );
            mysqlConfig = mysqlKey ? dbConfigs.mysql[mysqlKey] : null;
          }
          
          if (!mysqlConfig) {
            throw new Error(`Configuración MySQL no encontrada para clave: ${configKey}`);
          }
          
          console.log(`✅ Usando MYSQL: ${mysqlConfig.user}@${mysqlConfig.host}:${mysqlConfig.port}/${mysqlConfig.database}`);
          
          return {
            host: mysqlConfig.host,
            port: mysqlConfig.port,
            user: mysqlConfig.user,
            password: mysqlConfig.password,
            database: mysqlConfig.database,
            originalUser: user
          };
        }
        else {
          throw new Error(`Tipo de BD no soportado: ${type}`);
        }
      };

      // ============================================
      // TAREAS DE CYPRESS
      // ============================================
      on("task", {
        oracleQuery: async ({ sql, binds = [], options = {}, user = 'jteller' }) => {
          console.log(`\n[ORACLE] ===== INICIANDO TAREA =====`);
          console.log(`[ORACLE] Usuario solicitado: ${user}`);
          
          let connection = null;

          try {
            const connectionConfig = getConnectionConfig(user, 'oracle');
            
            connection = await oracledb.getConnection({
              user: connectionConfig.user,
              password: connectionConfig.password,
              connectString: connectionConfig.connectString
            });
            
            if (connectionConfig.schema) {
              try {
                await connection.execute(`ALTER SESSION SET CURRENT_SCHEMA = ${connectionConfig.schema}`);
                console.log(`[ORACLE] Esquema cambiado a: ${connectionConfig.schema}`);
              } catch (schemaError) {
                console.log(`[ORACLE] ⚠️ No se pudo cambiar esquema: ${schemaError.message}`);
              }
            }

            const result = await connection.execute(sql, binds, {
              outFormat: oracledb.OUT_FORMAT_OBJECT,
              autoCommit: true,
              maxRows: 0,
              fetchArraySize: 1000,
              prefetchRows: 1000,
              ...options
            });

            return {
              success: true,
              rows: result.rows || [],
              rowsAffected: result.rowsAffected || 0,
              metaData: result.metaData || [],
              dbType: 'oracle',
              user,
              sql
            };

          } catch (error) {
            console.error(`[ORACLE] ❌ ERROR:`, error.message);
            return {
              success: false,
              error: error.message,
              errorCode: error.errorNum,
              dbType: 'oracle',
              user,
              sql
            };
          } finally {
            if (connection) {
              try {
                await connection.close();
              } catch (closeError) {
                console.error(`[ORACLE] Error cerrando conexión:`, closeError);
              }
            }
          }
        },

        mysqlQuery: async ({ sql, user = 'jteller' }) => {
          console.log(`\n[MYSQL] ===== INICIANDO TAREA =====`);
          console.log(`[MYSQL] Usuario solicitado: ${user}`);
          
          let connection = null;

          try {
            const connectionConfig = getConnectionConfig(user, 'mysql');
            
            const mysqlConfig = {
              host: connectionConfig.host,
              port: connectionConfig.port,
              user: connectionConfig.user,
              password: connectionConfig.password,
              database: connectionConfig.database,
              connectTimeout: 60000,
              multipleStatements: true
            };

            connection = await mysql.createConnection(mysqlConfig);
            console.log(`[MYSQL] ✅ Conectado a ${connectionConfig.database}`);

            const [rows] = await connection.execute(sql);
            
            return {
              success: true,
              rows: rows || [],
              rowsAffected: rows.affectedRows || 0,
              fields: rows.fields || [],
              insertId: rows.insertId || null,
              dbType: 'mysql',
              user: connectionConfig.originalUser,
              database: connectionConfig.database,
              sql
            };

          } catch (error) {
            console.error(`[MYSQL] ❌ ERROR:`, error.message);
            return {
              success: false,
              error: error.message,
              errorCode: error.code,
              dbType: 'mysql',
              user,
              sql
            };
          } finally {
            if (connection) {
              try {
                await connection.end();
              } catch (closeError) {
                console.error(`[MYSQL] Error cerrando conexión:`, closeError);
              }
            }
          }
        },

        dbQuery: async ({ sql, user = 'jteller', type = dbType }) => {
          if (type === 'mysql') {
            return await this.mysqlQuery({ sql, user });
          } else {
            return await this.oracleQuery({ sql, user });
          }
        }
      });

      return config;
    },

    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    testIsolation: false,
  },
});