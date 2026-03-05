const { defineConfig } = require("cypress");
const fs = require('fs');
const path = require('path');
const oracledb = require("oracledb");
const mysql = require('mysql2/promise');

function loadDatabaseConfig() {
  try {
    const configPath = path.resolve(__dirname, 'cypress/fixtures/database-config.json');
    console.log('📖 Leyendo configuración de BD desde:', configPath);

    if (!fs.existsSync(configPath)) {
      throw new Error(`Archivo no encontrado: ${configPath}`);
    }

    const configFile = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configFile);

    console.log('✅ Configuración cargada exitosamente');
    
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
    console.error('❌ Error CRÍTICO:', error.message);
    throw new Error('No se puede continuar sin configuración de BD');
  }
}

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

      const dbType = process.env.DB_TYPE || config.env.DB_TYPE || 'oracle';
      console.log(`\n🔧 Usando base de datos: ${dbType.toUpperCase()}\n`);
      
      config.env.DB_TYPE = dbType;

      // Función para normalizar strings (quita espacios y pasa a minúsculas para comparar)
      const normalizeString = (str) => {
        return str?.toString().trim().toLowerCase() || '';
      };

      const getConnectionConfig = (user, type = dbType) => {
        console.log(`🔍 Buscando configuración para ${type}:${user}`);
        const userNormalized = normalizeString(user);

        // Mapeo flexible de usuarios
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

        // Buscar la clave ignorando mayúsculas/minúsculas
        let configKey = userMap[userNormalized];
        
        // Si no encuentra, buscar en las claves del mapa
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
          // Buscar en oracle ignorando mayúsculas/minúsculas en las claves
          let oracleConfig = dbConfigs.oracle?.[configKey];
          
          // Si no encuentra, buscar por clave normalizada
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
            user: oracleConfig.user, // Respetar el caso original del JSON
            password: oracleConfig.password,
            connectString: oracleConfig.connectString,
            schema: configKey.toUpperCase(), // El esquema siempre en mayúsculas para Oracle
            originalUser: user
          };
        } 
        else if (type === 'mysql') {
          // Buscar en mysql ignorando mayúsculas/minúsculas en las claves
          let mysqlConfig = dbConfigs.mysql?.[configKey];
          
          // Si no encuentra, buscar por clave normalizada
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
            user: mysqlConfig.user, // Respetar el caso original del JSON
            password: mysqlConfig.password,
            database: mysqlConfig.database,
            originalUser: user
          };
        }
        else {
          throw new Error(`Tipo de BD no soportado: ${type}`);
        }
      };

      on("task", {
        oracleQuery: async ({ sql, binds = [], options = {}, user = 'jteller' }) => {
          console.log(`\n[ORACLE] ===== INICIANDO TAREA =====`);
          console.log(`[ORACLE] Usuario solicitado: ${user}`);
          
          let connection = null;

          try {
            const connectionConfig = getConnectionConfig(user, 'oracle');
            
            console.log(`[ORACLE] Conectando como ${connectionConfig.user}...`);
            
            connection = await oracledb.getConnection({
              user: connectionConfig.user,
              password: connectionConfig.password,
              connectString: connectionConfig.connectString
            });
            
            console.log(`[ORACLE] Conexión exitosa`);
            
            if (connectionConfig.schema) {
              try {
                await connection.execute(`ALTER SESSION SET CURRENT_SCHEMA = ${connectionConfig.schema}`);
                console.log(`[ORACLE] Esquema cambiado a: ${connectionConfig.schema}`);
              } catch (schemaError) {
                console.log(`[ORACLE] ⚠️ No se pudo cambiar esquema: ${schemaError.message}`);
              }
            }

            console.log(`[ORACLE] Ejecutando query...`);
            const result = await connection.execute(sql, binds, {
              outFormat: oracledb.OUT_FORMAT_OBJECT,
              autoCommit: true,
              maxRows: 0,
              fetchArraySize: 1000,
              prefetchRows: 1000,
              ...options
            });

            console.log(`[ORACLE] ✅ Query ejecutada. Filas: ${result.rows?.length || 0}`);

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
                console.log(`[ORACLE] Conexión cerrada`);
              } catch (closeError) {
                console.error(`[ORACLE] Error cerrando conexión:`, closeError);
              }
            }
            console.log(`[ORACLE] ===== TAREA FINALIZADA =====\n`);
          }
        },

        mysqlQuery: async ({ sql, user = 'jteller' }) => {
          console.log(`\n[MYSQL] ===== INICIANDO TAREA =====`);
          console.log(`[MYSQL] Usuario solicitado: ${user}`);
          
          let connection = null;

          try {
            const connectionConfig = getConnectionConfig(user, 'mysql');
            
            console.log(`[MYSQL] Conectando a MySQL...`);
            
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
            console.log(`[MYSQL] ✅ Conectado a ${connectionConfig.host}:${connectionConfig.port}/${connectionConfig.database}`);

            console.log(`[MYSQL] Ejecutando query...`);
            const [rows] = await connection.execute(sql);
            
            console.log(`[MYSQL] ✅ Query ejecutada. Filas: ${rows?.length || 0}`);

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
                console.log(`[MYSQL] Conexión cerrada`);
              } catch (closeError) {
                console.error(`[MYSQL] Error cerrando conexión:`, closeError);
              }
            }
            console.log(`[MYSQL] ===== TAREA FINALIZADA =====\n`);
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

      config.env.database = {
        type: dbType,
        oracle: dbConfigs.oracle || {},
        mysql: dbConfigs.mysql || {}
      };

      return config;
    },

    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    testIsolation: false,
  },
});