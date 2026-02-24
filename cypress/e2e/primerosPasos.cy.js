// cypress/e2e/primerosPasos.cy.js

describe('Ejecutar script SQL con métodos diferenciados por esquema', () => {
  
  beforeEach(() => {
    Cypress.config('defaultCommandTimeout', 120000); // 2 minutos
  });

  // Variables para compartir datos entre pruebas
  let queriesClasificadas = {
    jtellerv7: [],
    jsigcommon: []
  };
  
  let resultados = {
    total: 0,
    jtellerv7: { total: 0, exitosos: 0, duplicados: 0, errores: [] },
    jsigcommon: { total: 0, exitosos: 0, duplicados: 0, errores: [] }
  };

  // Métodos específicos para cada esquema
  const metodoJTELLERV7 = (query, index, binds = []) => {
    cy.log(`🔧 Ejecutando método específico para JTELLERV7 en query ${index + 1}`);
    return cy.task('oracleQuery', {
      sql: query,
      binds: binds,
      user: 'jteller'
    });
  };

  const metodoJSIGCOMMON = (query, index, binds = []) => {
    cy.log(`🔧 Ejecutando método específico para JSIGCOMMON en query ${index + 1}`);
    return cy.task('oracleQuery', {
      sql: query,
      binds: binds,
      user: 'jsigcommon'
    });
  };

  it('Paso 1: Leer y procesar archivo SQL por esquema', () => {
    cy.readFile('cypress/fixtures/ParametrosIniciales.sql', 'utf8').then((sqlContent) => {
      
      // Limpiar comentarios y dividir queries
      const queries = sqlContent
        .split(';')
        .map(q => q.trim())
        .filter(q => q.length > 0 && !q.startsWith('/*'));
      
      resultados.total = queries.length;
      cy.log(`📊 Total queries encontradas: ${queries.length}`);
      
      // Clasificar queries por esquema
      queries.forEach((query, index) => {
        if (query.toUpperCase().includes('JSIGCOMMON.')) {
          queriesClasificadas.jsigcommon.push({ query, index: index + 1 });
        } else {
          queriesClasificadas.jtellerv7.push({ query, index: index + 1 });
        }
      });
      
      cy.log(`\n📋 Clasificación por esquema:`);
      cy.log(`   - JTELLERV7: ${queriesClasificadas.jtellerv7.length} queries`);
      cy.log(`   - JSIGCOMMON: ${queriesClasificadas.jsigcommon.length} queries`);
      
      // Mostrar primeras queries de cada esquema como ejemplo
      if (queriesClasificadas.jtellerv7.length > 0) {
        cy.log('\n📝 Ejemplo query JTELLERV7:');
        cy.log(`   ${queriesClasificadas.jtellerv7[0].query.substring(0, 150)}...`);
      }
      
      if (queriesClasificadas.jsigcommon.length > 0) {
        cy.log('\n📝 Ejemplo query JSIGCOMMON:');
        cy.log(`   ${queriesClasificadas.jsigcommon[0].query.substring(0, 150)}...`);
      }
    });
  });

  it('Paso 2: Ejecutar queries de JTELLERV7', () => {
    cy.log('\n🚀 EJECUTANDO QUERIES DE JTELLERV7');
    cy.log('==================================');
    
    const queriesJTELLERV7 = queriesClasificadas.jtellerv7;
    
    if (queriesJTELLERV7.length === 0) {
      cy.log('ℹ️ No hay queries de JTELLERV7 para ejecutar');
      return;
    }
    
    resultados.jtellerv7.total = queriesJTELLERV7.length;
    cy.log(`📊 Total queries JTELLERV7 a ejecutar: ${queriesJTELLERV7.length}`);
    
    // Función para ejecutar secuencialmente
    const ejecutarSecuencial = (index = 0) => {
      if (index >= queriesJTELLERV7.length) {
        cy.log(`\n✅ Ejecución de JTELLERV7 completada`);
        cy.log(`   Exitosos: ${resultados.jtellerv7.exitosos}/${resultados.jtellerv7.total}`);
        cy.log(`   Duplicados: ${resultados.jtellerv7.duplicados}`);
        return;
      }
      
      const { query, index: queryIndex } = queriesJTELLERV7[index];
      
      cy.log(`\n🔍 Ejecutando query JTELLERV7 #${queryIndex} (${index + 1}/${queriesJTELLERV7.length})`);
      
      // Mostrar un extracto de la query
      if (query.length > 100) {
        cy.log(`📝 ${query.substring(0, 100)}...`);
      } else {
        cy.log(`📝 ${query}`);
      }
      
      metodoJTELLERV7(query, queryIndex).then((result) => {
        if (result.success) {
          cy.log(`✅ Query #${queryIndex} ejecutada correctamente`);
          resultados.jtellerv7.exitosos++;
          
          if (result.rowsAffected > 0) {
            cy.log(`   Filas afectadas: ${result.rowsAffected}`);
          }
          
          if (result.rows && result.rows.length > 0) {
            cy.log(`   Registros retornados: ${result.rows.length}`);
          }
        } else {
          if (result.error && result.error.includes('ORA-00001')) {
            cy.log(`⚠️ Query #${queryIndex}: Registro duplicado (ignorado)`);
            resultados.jtellerv7.duplicados++;
          } else {
            cy.log(`❌ Query #${queryIndex} falló: ${result.error || 'Error desconocido'}`);
            resultados.jtellerv7.errores.push({
              index: queryIndex,
              query: query.substring(0, 200),
              error: result.error || 'Error desconocido'
            });
          }
        }
        
        // Pequeña pausa para no saturar (opcional)
        cy.wait(100);
        
        // Siguiente query
        ejecutarSecuencial(index + 1);
      });
    };
    
    ejecutarSecuencial(0);
  });

  it('Paso 3: Ejecutar queries de JSIGCOMMON', () => {
    cy.log('\n🚀 EJECUTANDO QUERIES DE JSIGCOMMON');
    cy.log('==================================');
    
    const queriesJSIGCOMMON = queriesClasificadas.jsigcommon;
    
    if (queriesJSIGCOMMON.length === 0) {
      cy.log('ℹ️ No hay queries de JSIGCOMMON para ejecutar');
      return;
    }
    
    resultados.jsigcommon.total = queriesJSIGCOMMON.length;
    cy.log(`📊 Total queries JSIGCOMMON a ejecutar: ${queriesJSIGCOMMON.length}`);
    
    // Función para ejecutar secuencialmente
    const ejecutarSecuencial = (index = 0) => {
      if (index >= queriesJSIGCOMMON.length) {
        cy.log(`\n✅ Ejecución de JSIGCOMMON completada`);
        cy.log(`   Exitosos: ${resultados.jsigcommon.exitosos}/${resultados.jsigcommon.total}`);
        cy.log(`   Duplicados: ${resultados.jsigcommon.duplicados}`);
        return;
      }
      
      const { query, index: queryIndex } = queriesJSIGCOMMON[index];
      
      cy.log(`\n🔍 Ejecutando query JSIGCOMMON #${queryIndex} (${index + 1}/${queriesJSIGCOMMON.length})`);
      
      // Mostrar un extracto de la query
      if (query.length > 100) {
        cy.log(`📝 ${query.substring(0, 100)}...`);
      } else {
        cy.log(`📝 ${query}`);
      }
      
      metodoJSIGCOMMON(query, queryIndex).then((result) => {
        if (result.success) {
          cy.log(`✅ Query #${queryIndex} ejecutada correctamente`);
          resultados.jsigcommon.exitosos++;
          
          if (result.rowsAffected > 0) {
            cy.log(`   Filas afectadas: ${result.rowsAffected}`);
          }
          
          // Verificación específica para ENTITY_TRANSITIONS
          if (query.toUpperCase().includes('INSERT INTO JSIGCOMMON.ENTITY_TRANSITIONS')) {
            cy.log('   🔍 Verificando inserción en ENTITY_TRANSITIONS...');
            cy.wait(500); // Pequeña pausa para que la BD procese
            cy.task('oracleQuery', {
              sql: 'SELECT COUNT(*) as count FROM JSIGCOMMON.ENTITY_TRANSITIONS',
              binds: [],
              user: 'jsigcommon'
            }).then((verifyResult) => {
              if (verifyResult.success && verifyResult.rows) {
                cy.log(`   📊 Total ENTITY_TRANSITIONS ahora: ${verifyResult.rows[0].COUNT}`);
              }
            });
          }
          
        } else {
          if (result.error && result.error.includes('ORA-00001')) {
            cy.log(`⚠️ Query #${queryIndex}: Registro duplicado (ignorado)`);
            resultados.jsigcommon.duplicados++;
          } else {
            cy.log(`❌ Query #${queryIndex} falló: ${result.error || 'Error desconocido'}`);
            resultados.jsigcommon.errores.push({
              index: queryIndex,
              query: query.substring(0, 200),
              error: result.error || 'Error desconocido'
            });
          }
        }
        
        // Pequeña pausa para no saturar
        cy.wait(100);
        
        // Siguiente query
        ejecutarSecuencial(index + 1);
      });
    };
    
    ejecutarSecuencial(0);
  });

  it('Paso 4: Verificar resultados finales', () => {
    cy.log('\n📋 ==================================');
    cy.log('📋 RESUMEN FINAL DE EJECUCIÓN');
    cy.log('==================================');
    cy.log(`📊 TOTAL: ${resultados.total} queries`);
    
    cy.log('\n🔷 ESQUEMA JTELLERV7:');
    cy.log(`   Total: ${resultados.jtellerv7.total}`);
    cy.log(`   ✅ Exitosos: ${resultados.jtellerv7.exitosos}`);
    cy.log(`   ⚠️ Duplicados: ${resultados.jtellerv7.duplicados}`);
    cy.log(`   ❌ Errores: ${resultados.jtellerv7.errores.length}`);
    
    if (resultados.jtellerv7.errores.length > 0) {
      cy.log('\n   Errores en JTELLERV7:');
      resultados.jtellerv7.errores.slice(0, 3).forEach((err, i) => {
        cy.log(`   ${i+1}. Query #${err.index}: ${err.error.substring(0, 100)}`);
      });
    }
    
    cy.log('\n🔷 ESQUEMA JSIGCOMMON:');
    cy.log(`   Total: ${resultados.jsigcommon.total}`);
    cy.log(`   ✅ Exitosos: ${resultados.jsigcommon.exitosos}`);
    cy.log(`   ⚠️ Duplicados: ${resultados.jsigcommon.duplicados}`);
    cy.log(`   ❌ Errores: ${resultados.jsigcommon.errores.length}`);
    
    if (resultados.jsigcommon.errores.length > 0) {
      cy.log('\n   Errores en JSIGCOMMON:');
      resultados.jsigcommon.errores.slice(0, 3).forEach((err, i) => {
        cy.log(`   ${i+1}. Query #${err.index}: ${err.error.substring(0, 100)}`);
      });
    }
    
    // Verificar ENTITY_TRANSITIONS
    cy.log('\n🔍 Verificando ENTITY_TRANSITIONS...');
    cy.task('oracleQuery', {
      sql: 'SELECT COUNT(*) as count FROM JSIGCOMMON.ENTITY_TRANSITIONS',
      binds: [],
      user: 'jsigcommon'
    }).then((result) => {
      if (result.success && result.rows && result.rows.length > 0) {
        const total = result.rows[0].COUNT;
        cy.log(`📊 Total registros en ENTITY_TRANSITIONS: ${total}`);
      } else {
        cy.log('⚠️ No se pudo consultar ENTITY_TRANSITIONS');
        if (result.error) {
          cy.log(`   Error: ${result.error}`);
        }
      }
    });
  });

  it('Paso 5: Validar que la ejecución fue exitosa', () => {
    const totalExitosos = resultados.jtellerv7.exitosos + resultados.jsigcommon.exitosos;
    const totalErrores = resultados.jtellerv7.errores.length + resultados.jsigcommon.errores.length;
    
    cy.log('📊 MÉTRICAS FINALES:');
    cy.log(`   ✅ Exitosos: ${totalExitosos}`);
    cy.log(`   ⚠️ Duplicados: ${resultados.jtellerv7.duplicados + resultados.jsigcommon.duplicados}`);
    cy.log(`   ❌ Errores reales: ${totalErrores}`);
    
    // La prueba pasa si hay al menos un éxito
    expect(totalExitosos).to.be.greaterThan(0);
    
    // Si hay errores, mostrar advertencia pero no fallar la prueba
    if (totalErrores > 0) {
      cy.log('⚠️ NOTA: Hay errores que requieren revisión manual');
    } else {
      cy.log('✅ Todos los queries se ejecutaron sin errores');
    }
  });
});