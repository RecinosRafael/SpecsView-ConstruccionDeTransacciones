const { defineConfig } = require("cypress");
const fs = require('fs');
const path = require('path');
const oracledb = require("oracledb");
const mysql = require('mysql2/promise');
const ExcelJS = require('exceljs');

// ============================================
// CARGA DE CONFIGURACIÓN DE BASE DE DATOS
// ============================================
function loadDatabaseConfig() {
  try {
    const configPath = path.resolve(__dirname, 'cypress/fixtures/database-config.json');
    if (!fs.existsSync(configPath)) {
      throw new Error(`Archivo no encontrado: ${configPath}`);
    }
    const configFile = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configFile);
  } catch (error) {
    console.error(' Error CRÍTICO en BD:', error.message);
    throw new Error('No se puede continuar sin configuración de BD');
  }
}

function loadEnvConfig() {
  try {
    const envPath = path.resolve(__dirname, 'cypress.env.json');
    if (fs.existsSync(envPath)) {
      return JSON.parse(fs.readFileSync(envPath, 'utf8'));
    }
    return {};
  } catch (error) {
    console.error('Error cargando cypress.env.json:', error.message);
    return {};
  }
}

const dbConfigs = loadDatabaseConfig();
const envConfig = loadEnvConfig();

// ============================================
// FUNCIONES DE APOYO
// ============================================
const normalizeString = (str) => str?.toString().trim().toLowerCase() || '';

const getConnectionConfig = (user, type = process.env.DB_TYPE || 'oracle') => {
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
  let configKey = userMap[userNormalized] || userNormalized;

  if (type === 'oracle') {
    let oracleConfig = dbConfigs.oracle?.[configKey];
    if (!oracleConfig) throw new Error(`Configuración Oracle no encontrada para clave: ${configKey}`);
    return {
      user: oracleConfig.user,
      password: oracleConfig.password,
      connectString: oracleConfig.connectString,
      schema: configKey.toUpperCase(),
      originalUser: user
    };
  } else if (type === 'mysql') {
    let mysqlConfig = dbConfigs.mysql?.[configKey];
    if (!mysqlConfig) throw new Error(`Configuración MySQL no encontrada para clave: ${configKey}`);
    return {
      host: mysqlConfig.host,
      port: mysqlConfig.port,
      user: mysqlConfig.user,
      password: mysqlConfig.password,
      database: mysqlConfig.database,
      originalUser: user
    };
  } else {
    throw new Error(`Tipo de BD no soportado: ${type}`);
  }
};

module.exports = defineConfig({
  screenshotsFolder: './capturas',   // carpeta fija para capturas
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
      // Plugin del reporter
      require('cypress-mochawesome-reporter/plugin')(on);

      // ===== VARIABLE GLOBAL PARA RESULTADOS =====
      let resultados = [];

      // ===== COMBINAR VARIABLES DE ENTORNO =====
      const dbType = process.env.DB_TYPE || config.env.DB_TYPE || 'oracle';
      config.env = {
        ...config.env,
        ...envConfig,
        DB_TYPE: dbType,
        database: {
          type: dbType,
          oracle: dbConfigs.oracle || {},
          mysql: dbConfigs.mysql || {}
        }
      };

      console.log(`\n Usando base de datos: ${dbType.toUpperCase()}`);
      console.log(` Usando URL: ${config.env.BASE_URL || 'No definida'}\n`);

      // ===== HOOK: limpiar/crear carpetas antes de ejecutar las pruebas =====
      on('before:run', () => {
        // Carpeta de capturas (fija)
        const capturasPath = config.screenshotsFolder; // './capturas'
        if (fs.existsSync(capturasPath)) {
          fs.rmSync(capturasPath, { recursive: true, force: true });
          console.log(`🗑️ Carpeta de capturas eliminada: ${capturasPath}`);
        }
        fs.mkdirSync(capturasPath, { recursive: true });
        console.log(`📁 Carpeta de capturas creada: ${capturasPath}`);

        // Carpeta de reportes Excel (fija)
        const reportesPath = path.resolve('ReporteXlsx');
        if (fs.existsSync(reportesPath)) {
          fs.rmSync(reportesPath, { recursive: true, force: true });
          console.log(`🗑️ Carpeta de reportes eliminada: ${reportesPath}`);
        }
        fs.mkdirSync(reportesPath, { recursive: true });
        console.log(`📁 Carpeta de reportes creada: ${reportesPath}`);
      });

      // TAREA PARA ELIMINAR LO QUE HAY EN UNA RUTA
      on('task', {
        deleteAllFiles(folderPath) {
          if (!fs.existsSync(folderPath)) return null;
          const files = fs.readdirSync(folderPath);
          files.forEach(file => {
            const filePath = path.join(folderPath, file);
            try {
              if (fs.statSync(filePath).isFile()) {
                fs.unlinkSync(filePath);
              }
            } catch (err) {
              // Ignorar archivos que no se pueden eliminar (en uso, permisos, etc.)
              console.warn(`No se pudo eliminar ${filePath}: ${err.message}`);
            }
          });
          return null;
        }
      });



      // ===== TAREAS (TODO EN UN SOLO OBJETO) =====
      on('task', {
        // --- TAREAS DE BD ---
        oracleQuery: async ({ sql, binds = [], options = {}, user = 'jteller' }) => {
          let connection = null;
          try {
            const connConfig = getConnectionConfig(user, 'oracle');
            connection = await oracledb.getConnection({
              user: connConfig.user,
              password: connConfig.password,
              connectString: connConfig.connectString
            });
            if (connConfig.schema) {
              await connection.execute(`ALTER SESSION SET CURRENT_SCHEMA = ${connConfig.schema}`);
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
            console.error(`[ORACLE] ERROR:`, error.message);
            return { success: false, error: error.message, errorCode: error.errorNum, dbType: 'oracle', user, sql };
          } finally {
            if (connection) try { await connection.close(); } catch(e) {}
          }
        },

        mysqlQuery: async ({ sql, user = 'jteller' }) => {
          let connection = null;
          try {
            const connConfig = getConnectionConfig(user, 'mysql');
            connection = await mysql.createConnection({
              host: connConfig.host,
              port: connConfig.port,
              user: connConfig.user,
              password: connConfig.password,
              database: connConfig.database,
              connectTimeout: 60000,
              multipleStatements: true
            });
            const [rows] = await connection.execute(sql);
            return {
              success: true,
              rows: rows || [],
              rowsAffected: rows.affectedRows || 0,
              fields: rows.fields || [],
              insertId: rows.insertId || null,
              dbType: 'mysql',
              user: connConfig.originalUser,
              database: connConfig.database,
              sql
            };
          } catch (error) {
            console.error(`[MYSQL] ERROR:`, error.message);
            return { success: false, error: error.message, errorCode: error.code, dbType: 'mysql', user, sql };
          } finally {
            if (connection) try { await connection.end(); } catch(e) {}
          }
        },

        dbQuery: async ({ sql, user = 'jteller', type = dbType }) => {
          if (type === 'mysql') {
            return await this.mysqlQuery({ sql, user });
          } else {
            return await this.oracleQuery({ sql, user });
          }
        },

        // --- TAREAS PARA EL REPORTE EXCEL ---
        guardarResultado({ describe, crud, descripcion, estado, numero, mensaje, evidencia }) {
          resultados.push({ describe, crud, descripcion, estado, numero, mensaje, evidencia });
          return null;
        },

        /*generarExcel(ruta = 'reporte.xlsx') {
          const fs = require('fs');
          const path = require('path');

          // Convertir a ruta absoluta para saber exactamente dónde se guarda
          const rutaAbsoluta = path.resolve(ruta);
          console.log(`📂 Ruta absoluta de destino: ${rutaAbsoluta}`);

          // Crear directorio si no existe (aunque ya lo hayas creado manualmente, no duele)
          const dir = path.dirname(rutaAbsoluta);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`📁 Directorio creado: ${dir}`);
          }

          // Agrupar resultados (tu lógica actual)
          const agrupado = {};
          resultados.forEach(r => {
            if (!agrupado[r.describe]) agrupado[r.describe] = [];
            agrupado[r.describe].push(r);
          });

          for (const key in agrupado) {
            agrupado[key].sort((a, b) => a.numero - b.numero);
          }

          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet('Reporte');

          worksheet.columns = [
            { header: 'No de prueba', key: 'noPrueba', width: 15 },
            { header: 'CRUD', key: 'crud', width: 25 },
            { header: 'Descripción', key: 'descripcion', width: 50 },
            { header: 'Estado', key: 'estado', width: 15 },
            { header: 'Mensaje', key: 'mensaje', width: 40 },
            { header: 'Evidencia', key: 'evidencia', width: 50 }
          ];

          let primera = true;
          for (const suite in agrupado) {
            if (!primera) worksheet.addRow({});
            primera = false;
            agrupado[suite].forEach(r => {
              worksheet.addRow({
                noPrueba: r.numero,
                crud: r.crud,
                descripcion: r.descripcion,
                estado: r.estado,
                mensaje: r.mensaje || '',
                evidencia: r.evidencia || ''
              });
            });
          }

          return workbook.xlsx.writeFile(rutaAbsoluta)
              .then(() => {
                if (fs.existsSync(rutaAbsoluta)) {
                  console.log(`✅ Excel generado exitosamente en: ${rutaAbsoluta}`);
                } else {
                  console.error(`❌ Se ejecutó writeFile pero el archivo NO existe en: ${rutaAbsoluta}`);
                }
                resultados = [];
                return null;
              })
              .catch(err => {
                console.error(`❌ Error al generar Excel:`, err);
                return null;
              });
        }*/

        generarExcel(ruta = 'reporte.xlsx') {
          const fs = require('fs');
          const path = require('path');

          const rutaAbsoluta = path.resolve(ruta);
          console.log(`📂 Ruta absoluta de destino: ${rutaAbsoluta}`);

          const dir = path.dirname(rutaAbsoluta);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`📁 Directorio creado: ${dir}`);
          }

          // Mantener el orden de inserción (tal como se guardaron en resultados)
          const datos = resultados; // ya está en orden de ejecución

          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet('Reporte de Pruebas');

          // ========== LOGO (ahora en fixtures) ==========
          const logoPath = path.resolve(__dirname, 'cypress/fixtures/logo.png');
          if (fs.existsSync(logoPath)) {
            const logoId = workbook.addImage({
              filename: logoPath,
              extension: 'png',
            });
            worksheet.addImage(logoId, {
              tl: { col: 0, row: 0 },
              ext: { width: 100, height: 100 },
            });
            console.log(`🖼️ Logo agregado desde: ${logoPath}`);
          } else {
            console.log(`ℹ️ Logo no encontrado en: ${logoPath}`);
          }

          // ========== TÍTULO Y FECHA ==========
          worksheet.mergeCells('B2:F2');
          const titleCell = worksheet.getCell('B2');
          titleCell.value = 'Reporte de Resultados de Pruebas Automatizadas';
          titleCell.font = {
            name: 'Arial',
            size: 18,
            bold: true,
            color: { argb: 'FF0000FF' },
          };
          titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

          const fechaCelda = worksheet.getCell('B3');
          const fechaActual = new Date();
          fechaCelda.value = `Generado: ${fechaActual.toLocaleString('es-ES')}`;
          fechaCelda.font = { italic: true, size: 10 };
          fechaCelda.alignment = { horizontal: 'left' };

          // ========== ENCABEZADOS DE DATOS (fila 5) ==========
          const headerRow = worksheet.getRow(5);
          headerRow.values = [
            'No de prueba',
            'CRUD',
            'Descripción',
            'Estado',
            'Mensaje',
            'Evidencia',
          ];
          headerRow.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
          headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF0070C0' },
          };
          headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
          headerRow.commit();

          // ========== DATOS (desde fila 6) ==========
          datos.forEach((r, idx) => {
            const row = worksheet.getRow(6 + idx);
            row.values = [
              r.numero,
              r.crud,
              r.descripcion,
              r.estado,
              r.mensaje || '',
              r.evidencia || '',
            ];
            if (idx % 2 === 0) {
              row.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFF2F2F2' },
              };
            }
            row.commit();
          });

          // ========== AJUSTE AUTOMÁTICO DE ANCHO DE COLUMNAS ==========
          const columnas = [
            { key: 'noPrueba', width: 15 },
            { key: 'crud', width: 25 },
            { key: 'descripcion', width: 50 },
            { key: 'estado', width: 15 },
            { key: 'mensaje', width: 40 },
            { key: 'evidencia', width: 50 },
          ];
          columnas.forEach((col, colIdx) => {
            let maxLen = col.width;
            datos.forEach(r => {
              let value = '';
              if (col.key === 'noPrueba') value = r.numero?.toString() || '';
              else if (col.key === 'crud') value = r.crud || '';
              else if (col.key === 'descripcion') value = r.descripcion || '';
              else if (col.key === 'estado') value = r.estado || '';
              else if (col.key === 'mensaje') value = r.mensaje || '';
              else if (col.key === 'evidencia') value = r.evidencia || '';
              const len = value.length;
              if (len > maxLen) maxLen = len;
            });
            const headerLen = columnas[colIdx].key.length;
            if (headerLen > maxLen) maxLen = headerLen;
            worksheet.getColumn(colIdx + 1).width = Math.min(maxLen + 2, 80);
          });

          // ========== GUARDAR ARCHIVO ==========
          return workbook.xlsx.writeFile(rutaAbsoluta)
              .then(() => {
                if (fs.existsSync(rutaAbsoluta)) {
                  console.log(`✅ Excel generado exitosamente en: ${rutaAbsoluta}`);
                } else {
                  console.error(`❌ Se ejecutó writeFile pero el archivo NO existe en: ${rutaAbsoluta}`);
                }
                resultados = [];
                return null;
              })
              .catch(err => {
                console.error(`❌ Error al generar Excel:`, err);
                return null;
              });
        }


      });

      return config;
    },

    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    testIsolation: false,
  },
});