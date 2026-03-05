describe('Flujo MySQL: Ejecutar script ParametrosIniciales.sql', () => {
  
  beforeEach(() => {
    Cypress.config('defaultCommandTimeout', 120000);
  });

  // Variables globales
  let todasLasSentencias = [];
  let resultadosUnificados = {
    total: 0,
    exitosos: 0,
    duplicados: 0,
    fallos: 0,
    errores: [],
    detalles: {
      exitosos: [],
      duplicados: [],
      fallos: []
    }
  };

  // Mapeo de base de datos a usuario
  const databaseToUser = {
    'JTELLERV7': 'jteller',
    'JSIGCOMMON': 'jsigcommon',
    'LOGDAT': 'logdat',
    'SECURITY': 'security',
    'JSIGPERSON_DATA': 'jsigperson_data',
    'JSIGNATURE': 'jsignature',
    'JSIGPERSON_CONF': 'jsigperson_conf',
    'DISTRIBUTOR': 'distributor'
  };

  // Método para ejecutar queries en MySQL
  const metodoQuery = ({ sql, user }) => {
    cy.log(`🔧 Ejecutando query MySQL con usuario ${user}`);
    return cy.task('mysqlQuery', { sql, user });
  };

  // ------------------------------------------------------------
  // PASO 1: Leer y procesar el archivo SQL
  // ------------------------------------------------------------
  it('Paso 1: Leer y procesar archivo ParametrosIniciales.sql', () => {
    cy.log('📂 INICIANDO LECTURA DE ARCHIVO SQL');
    
    todasLasSentencias = [];

    return cy.readFile('cypress/fixtures/ParametrosIniciales.sql', 'utf8').then((sqlContent) => {
      
      const queries = sqlContent
        .split(';')
        .map(q => q.trim())
        .filter(q => q.length > 0 && !q.startsWith('/*') && !q.startsWith('--'));
      
      cy.log(`📊 Total queries en script: ${queries.length}`);
      
      queries.forEach((query, idx) => {
        // Determinar usuario según el contenido
        let user = 'jteller';
        let database = 'JTELLERV7';
        
        if (query.toUpperCase().includes('JSIGCOMMON.')) {
          user = 'jsigcommon';
          database = 'JSIGCOMMON';
        } else if (query.toUpperCase().includes('JSIGPERSON_DATA.')) {
          user = 'jsigperson_data';
          database = 'JSIGPERSON_DATA';
        } else if (query.toUpperCase().includes('LOGDAT.')) {
          user = 'logdat';
          database = 'LOGDAT';
        } else if (query.toUpperCase().includes('SECURITY.')) {
          user = 'security';
          database = 'SECURITY';
        } else if (query.toUpperCase().includes('JSIGNATURE.')) {
          user = 'jsignature';
          database = 'JSIGNATURE';
        } else if (query.toUpperCase().includes('JSIGPERSON_CONF.')) {
          user = 'jsigperson_conf';
          database = 'JSIGPERSON_CONF';
        } else if (query.toUpperCase().includes('DISTRIBUTOR.')) {
          user = 'distributor';
          database = 'DISTRIBUTOR';
        }
        
        // Mapeo correcto de bases de datos Oracle -> MySQL
        let mysqlQuery = query;
        
        const dbMapping = {
          'JTELLERV7.': 'jtellerv7.',
          'JSIGCOMMON.': 'jsigcommon.',
          'JSIGPERSON_DATA.': 'jsigperson_data.',
          'LOGDAT.': 'logdat.',
          'SECURITY.': 'security.',
          'DISTRIBUTOR.': 'distributor.',
          'JSIGNATURE.': 'jsignature.',
          'JSIGPERSON_CONF.': 'jsigperson_conf.'
        };
        
        Object.entries(dbMapping).forEach(([oldDb, newDb]) => {
          mysqlQuery = mysqlQuery.replace(new RegExp(oldDb, 'gi'), newDb);
        });
        
        todasLasSentencias.push({
          id: idx + 1,
          sql: mysqlQuery,
          sqlOriginal: query,
          user: user,
          database: database,
          tipo: query.trim().split(' ')[0].toUpperCase()
        });
      });

      cy.log('\n📋 ===== RESUMEN =====');
      cy.log(`TOTAL SENTENCIAS A EJECUTAR: ${todasLasSentencias.length}`);
      
      cy.log('\n📝 Primeras 5 sentencias:');
      todasLasSentencias.slice(0, 5).forEach((s, i) => {
        cy.log(`   ${i+1}. [${s.user}] ${s.tipo}: ${s.sql.substring(0, 100)}...`);
      });
    });
  });

  // ------------------------------------------------------------
  // PASO 2: Ejecutar todas las sentencias
  // ------------------------------------------------------------
  it('Paso 2: Ejecutar todas las sentencias del script', () => {
    cy.log('\n🚀 EJECUTANDO SCRIPT EN MYSQL');
    cy.log('==================================');
    
    cy.log(`📊 Total a ejecutar: ${todasLasSentencias.length}`);
    
    if (todasLasSentencias.length === 0) {
      cy.log('⚠️ No hay sentencias para ejecutar');
      return;
    }

    resultadosUnificados.total = todasLasSentencias.length;

    const ejecutarSecuencial = (index) => {
      if (index >= todasLasSentencias.length) {
        cy.log('\n✅ EJECUCIÓN COMPLETADA');
        
        // Al terminar, guardar todos los reportes
        guardarReportes();
        return;
      }

      const sentencia = todasLasSentencias[index];
      
      cy.log(`\n🔍 [${index + 1}/${todasLasSentencias.length}] Usuario: ${sentencia.user} | DB: ${sentencia.database} | Tipo: ${sentencia.tipo}`);
      cy.log(`📝 ${sentencia.sql.substring(0, 150)}...`);

      cy.task('mysqlQuery', { 
        sql: sentencia.sql, 
        user: sentencia.user 
      }).then((resultado) => {
        const detalle = {
          id: sentencia.id,
          indice: index + 1,
          usuario: sentencia.user,
          database: sentencia.database,
          tipo: sentencia.tipo,
          sql: sentencia.sql,
          sqlOriginal: sentencia.sqlOriginal,
          timestamp: new Date().toISOString()
        };

        if (resultado?.success) {
          cy.log(`✅ Ejecutada correctamente`);
          resultadosUnificados.exitosos++;
          resultadosUnificados.detalles.exitosos.push({
            ...detalle,
            rowsAffected: resultado.rowsAffected,
            insertId: resultado.insertId,
            estado: 'EXITOSO'
          });
        } else {
          const errorMsg = resultado?.error || 'Resultado undefined';
          detalle.error = errorMsg;
          detalle.errorCode = resultado?.errorCode;
          
          if (errorMsg.includes('1062') || errorMsg.includes('Duplicate entry')) {
            cy.log(`⚠️ Registro duplicado (ignorado)`);
            resultadosUnificados.duplicados++;
            resultadosUnificados.detalles.duplicados.push({
              ...detalle,
              estado: 'DUPLICADO'
            });
          } else if (errorMsg.includes('1050') || errorMsg.includes('already exists')) {
            cy.log(`⚠️ Tabla ya existe (ignorado)`);
            resultadosUnificados.duplicados++;
            resultadosUnificados.detalles.duplicados.push({
              ...detalle,
              estado: 'DUPLICADO'
            });
          } else {
            cy.log(`❌ Falló: ${errorMsg}`);
            resultadosUnificados.fallos++;
            resultadosUnificados.detalles.fallos.push({
              ...detalle,
              estado: 'FALLIDO'
            });
            resultadosUnificados.errores.push({
              index: index + 1,
              database: sentencia.database,
              error: errorMsg,
              sql: sentencia.sql.substring(0, 200)
            });
          }
        }
        
        cy.wait(100).then(() => ejecutarSecuencial(index + 1));
      });
    };

    ejecutarSecuencial(0);
  });

  // ------------------------------------------------------------
  // PASO 3: Verificar resultados
  // ------------------------------------------------------------
  it('Paso 3: Verificar resultados', () => {
    cy.log('\n📋 ==================================');
    cy.log('📋 RESUMEN FINAL - MYSQL');
    cy.log('==================================');
    cy.log(`📊 TOTAL: ${resultadosUnificados.total} sentencias`);
    cy.log(`   ✅ Exitosos: ${resultadosUnificados.exitosos}`);
    cy.log(`   ⚠️ Duplicados: ${resultadosUnificados.duplicados}`);
    cy.log(`   ❌ Fallos: ${resultadosUnificados.fallos}`);
    
    if (resultadosUnificados.errores.length > 0) {
      cy.log('\n⚠️ ERRORES:');
      resultadosUnificados.errores.slice(0, 10).forEach((err, i) => {
        cy.log(`   ${i+1}. #${err.index} [${err.database}]: ${err.error.substring(0, 150)}`);
      });
    }
    
    cy.log('\n📁 Generando reportes detallados...');
    
    // Guardar todos los reportes
    guardarReportes();
    
    expect(resultadosUnificados.exitosos + resultadosUnificados.duplicados).to.be.greaterThan(0);
  });

  // ------------------------------------------------------------
  // FUNCIÓN PARA GUARDAR REPORTES (AHORA DENTRO DEL DESCRIBE)
  // ------------------------------------------------------------
  function guardarReportes() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fecha = new Date().toLocaleString();
    
    // Preparar datos para CSV
    const csvRows = [];
    
    // Cabeceras CSV
    csvRows.push(['ID', 'Índice', 'Usuario', 'Base Datos', 'Tipo', 'Estado', 'Error', 'Código Error', 'Filas Afectadas', 'SQL', 'Timestamp']);
    
    // Agregar exitosos
    resultadosUnificados.detalles.exitosos.forEach(d => {
      csvRows.push([
        d.id,
        d.indice,
        d.usuario,
        d.database,
        d.tipo,
        d.estado,
        '',
        '',
        d.rowsAffected || 0,
        d.sql.replace(/"/g, '""'),
        d.timestamp
      ]);
    });
    
    // Agregar duplicados
    resultadosUnificados.detalles.duplicados.forEach(d => {
      csvRows.push([
        d.id,
        d.indice,
        d.usuario,
        d.database,
        d.tipo,
        d.estado,
        d.error,
        d.errorCode || '',
        '',
        d.sql.replace(/"/g, '""'),
        d.timestamp
      ]);
    });
    
    // Agregar fallos
    resultadosUnificados.detalles.fallos.forEach(d => {
      csvRows.push([
        d.id,
        d.indice,
        d.usuario,
        d.database,
        d.tipo,
        d.estado,
        d.error,
        d.errorCode || '',
        '',
        d.sql.replace(/"/g, '""'),
        d.timestamp
      ]);
    });
    
    // Generar contenido CSV
    const csvContent = csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    // Reporte JSON
    const reporteJSON = {
      fecha: fecha,
      timestamp: timestamp,
      tipoBaseDatos: 'MySQL',
      archivoScript: 'ParametrosIniciales.sql',
      resumen: {
        total: resultadosUnificados.total,
        exitosos: resultadosUnificados.exitosos,
        duplicados: resultadosUnificados.duplicados,
        fallos: resultadosUnificados.fallos
      },
      detalles: {
        exitosos: resultadosUnificados.detalles.exitosos,
        duplicados: resultadosUnificados.detalles.duplicados,
        fallos: resultadosUnificados.detalles.fallos
      },
      estadisticas: {
        porcentajeExito: ((resultadosUnificados.exitosos / resultadosUnificados.total) * 100).toFixed(2) + '%',
        porcentajeDuplicados: ((resultadosUnificados.duplicados / resultadosUnificados.total) * 100).toFixed(2) + '%',
        porcentajeFallos: ((resultadosUnificados.fallos / resultadosUnificados.total) * 100).toFixed(2) + '%'
      }
    };

    // Guardar archivos
    cy.writeFile(`cypress/reports/mysql-report-${timestamp}.json`, reporteJSON, { log: true });
    cy.writeFile(`cypress/reports/mysql-report-${timestamp}.csv`, csvContent, { log: true });
    
    // Reporte TXT (legible)
    let reporteTXT = '========================================\n';
    reporteTXT += 'REPORTE DE EJECUCIÓN MYSQL\n';
    reporteTXT += '========================================\n\n';
    reporteTXT += `Fecha: ${fecha}\n`;
    reporteTXT += `Total Sentencias: ${reporteJSON.resumen.total}\n`;
    reporteTXT += `✅ Exitosas: ${reporteJSON.resumen.exitosos}\n`;
    reporteTXT += `⚠️ Duplicadas: ${reporteJSON.resumen.duplicados}\n`;
    reporteTXT += `❌ Fallidas: ${reporteJSON.resumen.fallos}\n\n`;
    
    reporteTXT += '📊 ESTADÍSTICAS\n';
    reporteTXT += '----------------------------------------\n';
    reporteTXT += `Éxito: ${reporteJSON.estadisticas.porcentajeExito}\n`;
    reporteTXT += `Duplicados: ${reporteJSON.estadisticas.porcentajeDuplicados}\n`;
    reporteTXT += `Fallos: ${reporteJSON.estadisticas.porcentajeFallos}\n\n`;

    // Detalle de fallos
    if (resultadosUnificados.detalles.fallos.length > 0) {
      reporteTXT += '❌ DETALLE DE FALLOS\n';
      reporteTXT += '----------------------------------------\n';
      resultadosUnificados.detalles.fallos.forEach((fallo, i) => {
        reporteTXT += `\n${i+1}. [#${fallo.indice}] Usuario: ${fallo.usuario} | DB: ${fallo.database} | Tipo: ${fallo.tipo}\n`;
        reporteTXT += `   Error: ${fallo.error}\n`;
        reporteTXT += `   Código: ${fallo.errorCode || 'N/A'}\n`;
        reporteTXT += `   SQL: ${fallo.sql}\n`;
      });
    }

    // Detalle de duplicados
    if (resultadosUnificados.detalles.duplicados.length > 0) {
      reporteTXT += '\n⚠️ DETALLE DE DUPLICADOS\n';
      reporteTXT += '----------------------------------------\n';
      resultadosUnificados.detalles.duplicados.forEach((dup, i) => {
        reporteTXT += `\n${i+1}. [#${dup.indice}] Usuario: ${dup.usuario} | DB: ${dup.database} | Tipo: ${dup.tipo}\n`;
        reporteTXT += `   Error: ${dup.error}\n`;
        reporteTXT += `   SQL: ${dup.sql}\n`;
      });
    }

    // Detalle de exitosos (primeros 10)
    if (resultadosUnificados.detalles.exitosos.length > 0) {
      reporteTXT += '\n✅ DETALLE DE EXITOSAS (primeras 10)\n';
      reporteTXT += '----------------------------------------\n';
      resultadosUnificados.detalles.exitosos.slice(0, 10).forEach((exito, i) => {
        reporteTXT += `\n${i+1}. [#${exito.indice}] Usuario: ${exito.usuario} | DB: ${exito.database} | Tipo: ${exito.tipo}\n`;
        reporteTXT += `   Filas afectadas: ${exito.rowsAffected}\n`;
        reporteTXT += `   SQL: ${exito.sql.substring(0, 100)}...\n`;
      });
    }

    cy.writeFile(`cypress/reports/mysql-report-${timestamp}.txt`, reporteTXT, { log: true });
    
    cy.log(`📁 Reportes guardados en cypress/reports/`);
    cy.log(`   - JSON: mysql-report-${timestamp}.json`);
    cy.log(`   - CSV: mysql-report-${timestamp}.csv`);
    cy.log(`   - TXT: mysql-report-${timestamp}.txt`);
  }
});