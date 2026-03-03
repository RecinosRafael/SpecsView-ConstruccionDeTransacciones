describe('Flujo unificado: Ejecutar script SQL y configurar columnas ID como IDENTITY', () => {
  
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
    errores: []
  };

  // Mapeo de owner a usuario
  const ownerToUser = {
    'JTELLERV7': 'jteller',
    'JSIGCOMMON': 'jsigcommon',
    'LOGDAT': 'logdat',
    'SECURITY': 'security',
    'JSIGPERSON_DATA': 'jsigperson_data',
    'JSIGNATURE': 'jsignature',
    'JSIGPERSON_CONF': 'jsigperson_conf',
    'DISTRIBUTOR': 'distributor'
  };

  // Lista de esquemas a procesar
  const esquemas = [
    { nombre: 'JTELLERV7', user: 'jteller' },
    { nombre: 'JSIGCOMMON', user: 'jsigcommon' },
    { nombre: 'LOGDAT', user: 'logdat' },
    { nombre: 'SECURITY', user: 'security' },
    { nombre: 'JSIGPERSON_DATA', user: 'jsigperson_data' },
    { nombre: 'JSIGNATURE', user: 'jsignature' },
    { nombre: 'JSIGPERSON_CONF', user: 'jsigperson_conf' },
    { nombre: 'DISTRIBUTOR', user: 'distributor' }
  ];

  // Método genérico para ejecutar queries
  const metodoQuery = ({ sql, user }) => {
    cy.log(`🔧 Ejecutando query con usuario ${user}`);
    return cy.task('oracleQuery', { sql, user });
  };

  // ------------------------------------------------------------
  // PASO 1: Recopilar sentencias ALTER por cada esquema
  // ------------------------------------------------------------
  it('Paso 1: Recopilar sentencias ALTER por esquema y del script SQL', () => {
    cy.log('📂 INICIANDO RECOPILACIÓN DE SENTENCIAS');
    
    // Limpiar arrays
    todasLasSentencias = [];
    
    let esquemasProcesados = 0;
    let totalAlters = 0;
    
    // Objeto para almacenar resultados por esquema
    const altersPorEsquema = {};

    // Función para procesar cada esquema secuencialmente
    const procesarEsquema = (index) => {
      if (index >= esquemas.length) {
        // Todos los esquemas procesados, ahora leer el script SQL
        cy.log('\n📊 RESUMEN DE ALTERS POR ESQUEMA:');
        
        // Mostrar resultados por cada esquema
        Object.keys(altersPorEsquema).forEach(esquema => {
          cy.log(`   - ${esquema}: ${altersPorEsquema[esquema].length} sentencias ALTER`);
        });
        
        cy.log(`\n📊 TOTAL ALTERS GENERADOS: ${totalAlters}`);
        
        // Ahora leer el archivo SQL
        cy.log('\n📂 Leyendo archivo ParametrosIniciales.sql...');
        return cy.readFile('cypress/fixtures/ParametrosIniciales.sql', 'utf8').then((sqlContent) => {
          
          const queries = sqlContent
            .split(';')
            .map(q => q.trim())
            .filter(q => q.length > 0 && !q.startsWith('/*'));
          
          cy.log(`📊 Total queries en script: ${queries.length}`);
          
          queries.forEach((query) => {
            // Determinar usuario según el contenido
            let user = 'jteller';
            let owner = 'JTELLERV7';
            
            if (query.toUpperCase().includes('JSIGCOMMON.')) {
              user = 'jsigcommon';
              owner = 'JSIGCOMMON';
            } else if (query.toUpperCase().includes('JSIGPERSON_DATA.')) {
              user = 'jsigperson_data';
              owner = 'JSIGPERSON_DATA';
            } else if (query.toUpperCase().includes('LOGDAT.')) {
              user = 'logdat';
              owner = 'LOGDAT';
            } else if (query.toUpperCase().includes('SECURITY.')) {
              user = 'security';
              owner = 'SECURITY';
            } else if (query.toUpperCase().includes('JSIGNATURE.')) {
              user = 'jsignature';
              owner = 'JSIGNATURE';
            } else if (query.toUpperCase().includes('JSIGPERSON_CONF.')) {
              user = 'jsigperson_conf';
              owner = 'JSIGPERSON_CONF';
            } else if (query.toUpperCase().includes('DISTRIBUTOR.')) {
              user = 'distributor';
              owner = 'DISTRIBUTOR';
            }
            
            todasLasSentencias.push({
              sql: query,
              user: user,
              owner: owner,
              tipo: 'SCRIPT'
            });
          });

          // Resumen final
          cy.log('\n📋 ===== RESUMEN UNIFICADO =====');
          cy.log(`TOTAL SENTENCIAS: ${todasLasSentencias.length} (${totalAlters} ALTERs + ${queries.length} scripts)`);
          
          // Mostrar primeras 5 sentencias como ejemplo
          cy.log('\n📝 Primeras 5 sentencias:');
          todasLasSentencias.slice(0, 5).forEach((s, i) => {
            cy.log(`   ${i+1}. [${s.user}] ${s.tipo}: ${s.sql.substring(0, 100)}...`);
          });
        });
      }

      const esquema = esquemas[index];
      cy.log(`Valor de esquema: "${esquema}"`);

      const user = esquemas[index].nombre.toLowerCase();

      cy.log(`\n🔍 Procesando esquema ${index + 1}/${esquemas.length}: ${esquema} (usuario: ${user})`);
      
      // Inicializar array para este esquema
      altersPorEsquema[esquema.nombre] = [];

      const sqlPorEsquema = `
        SELECT 'ALTER TABLE '||owner ||'.'||table_name ||' MODIFY ID GENERATED BY DEFAULT ON NULL AS IDENTITY ( START WITH LIMIT VALUE)' AS alter_sql,
               owner
        FROM all_tab_columns
        WHERE column_name = 'ID'
          AND owner = '${esquema.nombre}'
          AND table_name NOT IN ('DATABASECHANGELOG','DATABASECHANGELOGLOCK','WORKFLOW_DEFINITION_DETAIL','HTE_USER_NOTIFICATION')
          AND table_name NOT LIKE '%_AUD'
        ORDER BY table_name
      `;

      cy.task('oracleQuery', {
        sql: sqlPorEsquema,
        user: user  
      }, { timeout: 60000 }).then((resultado) => {
        if (resultado?.success) {
          const rows = resultado.rows;
          cy.log(`   📊 ${esquema.nombre}: ${rows.length} sentencias ALTER encontradas`);
          
          rows.forEach((row) => {
            // Guardar en el array específico del esquema
            altersPorEsquema[esquema.nombre].push({
              sql: row.ALTER_SQL,
              owner: esquema.nombre,
              user: esquema.user
            });
            
            // También guardar en el array unificado
            todasLasSentencias.push({
              sql: row.ALTER_SQL,
              user: esquema.user,
              owner: esquema.nombre,
              tipo: 'ALTER'
            });
            
            totalAlters++;
          });
          
          // Mostrar las primeras 2 ALTERs de este esquema como ejemplo
          if (rows.length > 0) {
            cy.log(`   📝 Ejemplos de ${esquema.nombre}:`);
            rows.slice(0, 2).forEach((row, i) => {
              cy.log(`      ${i+1}. ${row.ALTER_SQL.substring(0, 100)}...`);
            });
          }
        } else {
          cy.log(`   ⚠️ ${esquema.nombre}: Error o sin resultados`);
        }
        
        esquemasProcesados++;
        cy.wait(500); // Pequeña pausa entre consultas
        procesarEsquema(index + 1);
      });
    };

    // Iniciar procesamiento de esquemas
    procesarEsquema(0);
  });

  // ------------------------------------------------------------
  // PASO 2: Ejecutar todas las sentencias UNA POR UNA
  // ------------------------------------------------------------
  it('Paso 2: Ejecutar todas las sentencias', () => {
    cy.log('\n🚀 EJECUTANDO TODAS LAS SENTENCIAS');
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
        return;
      }

      const sentencia = todasLasSentencias[index];
      
      cy.log(`\n🔍 [${index + 1}/${todasLasSentencias.length}] Usuario: ${sentencia.user} | Tipo: ${sentencia.tipo} | Owner: ${sentencia.owner}`);
      cy.log(`📝 ${sentencia.sql.substring(0, 150)}...`);

      cy.task('oracleQuery', { 
        sql: sentencia.sql, 
        user: sentencia.user 
      }).then((resultado) => {
        if (resultado?.success) {
          cy.log(`✅ Ejecutada correctamente`);
          resultadosUnificados.exitosos++;
        } else {
          const errorMsg = resultado?.error || 'Resultado undefined';
          if (errorMsg.includes('ORA-00001')) {
            cy.log(`⚠️ Registro duplicado`);
            resultadosUnificados.duplicados++;
          } else {
            cy.log(`❌ Falló: ${errorMsg}`);
            resultadosUnificados.fallos++;
            resultadosUnificados.errores.push({
              index: index + 1,
              owner: sentencia.owner,
              tipo: sentencia.tipo,
              error: errorMsg
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
    cy.log('📋 RESUMEN FINAL');
    cy.log('==================================');
    cy.log(`📊 TOTAL: ${resultadosUnificados.total} sentencias`);
    cy.log(`   ✅ Exitosos: ${resultadosUnificados.exitosos}`);
    cy.log(`   ⚠️ Duplicados: ${resultadosUnificados.duplicados}`);
    cy.log(`   ❌ Fallos: ${resultadosUnificados.fallos}`);
    
    // Resumen por tipo
    const alters = todasLasSentencias.filter(s => s.tipo === 'ALTER').length;
    const scripts = todasLasSentencias.filter(s => s.tipo === 'SCRIPT').length;
    cy.log(`\n📊 DESGLOSE:`);
    cy.log(`   - ALTERs: ${alters}`);
    cy.log(`   - Scripts: ${scripts}`);
    
    if (resultadosUnificados.errores.length > 0) {
      cy.log('\n⚠️ ERRORES:');
      resultadosUnificados.errores.slice(0, 10).forEach((err, i) => {
        cy.log(`   ${i+1}. #${err.index} [${err.owner}] ${err.tipo}: ${err.error.substring(0, 150)}`);
      });
    }
    
    expect(resultadosUnificados.exitosos).to.be.greaterThan(0);
  });
});