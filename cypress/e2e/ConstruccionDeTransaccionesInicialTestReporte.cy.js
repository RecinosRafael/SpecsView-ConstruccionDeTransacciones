// ============================================
// IMPORTS DE TODOS LOS PAGE OBJECTS
// ============================================

import MetodosGeneralesPom from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy"
import AccionesCondicionadasPom from "../support/PageObjects/Specs-view-PO/AccionesCondicionadasPom.cy"
import CamposDeLaTransaccion from "../support/PageObjects/Specs-view-PO/CamposDeLaTransaccion.cy"
import EnvioDeTransacciones from "../support/PageObjects/Specs-view-PO/EnvioDeTransacciones.cy"
import EquivalenciasPom from "../support/PageObjects/Specs-view-PO/EquivalenciasPom.cy"
import FormatosPom from "../support/PageObjects/Specs-view-PO/FormatosPom.cy"
import GestorDeTransacciones from "../support/PageObjects/Specs-view-PO/GestorDeTransacciones.cy"
import MensajesDeErrorPom from "../support/PageObjects/Specs-view-PO/MensajesDeErrorPom.cy"
import MonedasPom from "../support/PageObjects/Specs-view-PO/MonedasPom.cy"
import NivelesDeCajeroPom from "../support/PageObjects/Specs-view-PO/NivelesDeCajeroPom.cy"
import PaisesPom from "../support/PageObjects/Specs-view-PO/PaisesPom.cy"
import PlantillaDeComprobantePom from "../support/PageObjects/Specs-view-PO/PlantillaDeComprobantePom.cy"
import ProductosPom from "../support/PageObjects/Specs-view-PO/ProductosPom.cy"
import RazonDeReversoPom from "../support/PageObjects/Specs-view-PO/RazonDeReversoPom.cy"
import RazonesDeBloqueoPom from "../support/PageObjects/Specs-view-PO/RazonesDeBloqueoPom.cy"
import RegionesPom from "../support/PageObjects/Specs-view-PO/RegionesPom.cy"
import ReglasPom from "../support/PageObjects/Specs-view-PO/ReglasPom.cy"
import RutinasPom from "../support/PageObjects/Specs-view-PO/RutinasPom.cy"
import TipoCajeroPom from "../support/PageObjects/Specs-view-PO/TipoCajeroPom.cy"
import TipoDeDatoPom from "../support/PageObjects/Specs-view-PO/TipoDeDatoPom.cy"
import TotalDeCajeroPom from "../support/PageObjects/Specs-view-PO/TotalDeCajeroPom.cy"
import UsuarioPom from "../support/PageObjects/Specs-view-PO/UsuarioPom.cy"
import MonedasPomCy from "../support/PageObjects/Specs-view-PO/MonedasPom.cy";
import 'cypress-xpath';
import "cypress-real-events/support";


// ============================================
// INSTANCIAS DE TODOS LOS PAGE OBJECTS
// ============================================

const Generales = new MetodosGeneralesPom()
const AccionCondicionada = new AccionesCondicionadasPom()
const CamposDeTransaccion = new CamposDeLaTransaccion()
const EnvioTransaccion = new EnvioDeTransacciones()
const Equivalencias = new EquivalenciasPom()
const Formatos = new FormatosPom()
const DetalleFormatos = new FormatosPom()
const GestorDeTransaccion = new GestorDeTransacciones()
const MensajeDeError = new MensajesDeErrorPom()
const Monedas = new MonedasPom()
const Denominaciones = new MonedasPomCy()
const PaisesQueLoUsan = new MonedasPomCy()
const NivelCajero = new NivelesDeCajeroPom()
const Paises = new PaisesPom()
const PlantillaComprobante = new PlantillaDeComprobantePom()
const Productos = new ProductosPom()
const RazonesReversa = new RazonDeReversoPom()
const RazonesBloqueo = new RazonesDeBloqueoPom()
const Regiones = new RegionesPom()
const Reglas = new ReglasPom()
const Rutinas = new RutinasPom()
const TipoCajero = new TipoCajeroPom()
const TipoDato = new TipoDeDatoPom()
const TotalesCajero = new TotalDeCajeroPom()
const TotalesACuadrar = new TotalDeCajeroPom()
const MinimosMaximos = new TotalDeCajeroPom()
const Usuarios = new UsuarioPom()


describe("Suite de Contruccion de transacciones iniciales...", () => {

    Cypress.on('uncaught:exception',(err,Runnable) =>{
        return false
    })

    before(() => {
        Generales.Login(
            Cypress.env('BASE_URL'),
            Cypress.env('USER'),
            Cypress.env('PASS')
        )
    })


    describe.skip('001 - Ejecutar script Datos Iniciales', () => {

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
            return cy.task('mysqlQuery', { sql, user });
        };

        // ------------------------------------------------------------
        // PASO 1: Leer y procesar el archivo SQL
        // ------------------------------------------------------------
        it('Paso 1: Leer y procesar archivo ParametrosIniciales.sql', () => {
            todasLasSentencias = [];
            return cy.readFile('cypress/fixtures/ParametrosIniciales.sql', 'utf8').then((sqlContent) => {
                const queries = sqlContent
                    .split(';')
                    .map(q => q.trim())
                    .filter(q => q.length > 0 && !q.startsWith('/*') && !q.startsWith('--'));

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

                cy.log('\===== RESUMEN =====');
                cy.log(`TOTAL SENTENCIAS A EJECUTAR: ${todasLasSentencias.length}`);

                cy.log('\nPrimeras 5 sentencias:');
                todasLasSentencias.slice(0, 5).forEach((s, i) => {
                    cy.log(`   ${i+1}. [${s.user}] ${s.tipo}: ${s.sql.substring(0, 100)}...`);
                });
            });
        });

        // ------------------------------------------------------------
        // PASO 2: Ejecutar todas las sentencias
        // ------------------------------------------------------------
        it('Paso 2: Ejecutar todas las sentencias del script', () => {
            cy.log('\ EJECUTANDO SCRIPT EN MYSQL');
            cy.log('==================================');

            cy.log(`Total a ejecutar: ${todasLasSentencias.length}`);

            if (todasLasSentencias.length === 0) {
                cy.log(' No hay sentencias para ejecutar');
                return;
            }

            resultadosUnificados.total = todasLasSentencias.length;

            const ejecutarSecuencial = (index) => {
                if (index >= todasLasSentencias.length) {
                    cy.log('\n EJECUCIÓN COMPLETADA');

                    // Al terminar, guardar todos los reportes
                    guardarReportes();
                    return;
                }

                const sentencia = todasLasSentencias[index];

                cy.log(`\n [${index + 1}/${todasLasSentencias.length}] Usuario: ${sentencia.user} | DB: ${sentencia.database} | Tipo: ${sentencia.tipo}`);
                cy.log(` ${sentencia.sql.substring(0, 150)}...`);

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
                        cy.log(`Ejecutada correctamente`);
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
                            cy.log(` Registro duplicado (ignorado)`);
                            resultadosUnificados.duplicados++;
                            resultadosUnificados.detalles.duplicados.push({
                                ...detalle,
                                estado: 'DUPLICADO'
                            });
                        } else if (errorMsg.includes('1050') || errorMsg.includes('already exists')) {
                            cy.log(` Tabla ya existe (ignorado)`);
                            resultadosUnificados.duplicados++;
                            resultadosUnificados.detalles.duplicados.push({
                                ...detalle,
                                estado: 'DUPLICADO'
                            });
                        } else {
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
            cy.log(`TOTAL: ${resultadosUnificados.total} sentencias`);
            cy.log(`Exitosos: ${resultadosUnificados.exitosos}`);
            cy.log(`️Duplicados: ${resultadosUnificados.duplicados}`);
            cy.log(`Fallos: ${resultadosUnificados.fallos}`);

            if (resultadosUnificados.errores.length > 0) {
                resultadosUnificados.errores.slice(0, 10).forEach((err, i) => {
                });
            }
            // Guardar todos los reportes
            guardarReportes();

            expect(resultadosUnificados.exitosos + resultadosUnificados.duplicados).to.be.greaterThan(0);
        });

        // ------------------------------------------------------------
        // FUNCIÓN PARA GUARDAR REPORTES (AHORA DENTRO DEL describe.skip)
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
            reporteTXT += `Exitosas: ${reporteJSON.resumen.exitosos}\n`;
            reporteTXT += `Duplicadas: ${reporteJSON.resumen.duplicados}\n`;
            reporteTXT += `Fallidas: ${reporteJSON.resumen.fallos}\n\n`;

            reporteTXT += 'ESTADÍSTICAS\n';
            reporteTXT += '----------------------------------------\n';
            reporteTXT += `Éxito: ${reporteJSON.estadisticas.porcentajeExito}\n`;
            reporteTXT += `Duplicados: ${reporteJSON.estadisticas.porcentajeDuplicados}\n`;
            reporteTXT += `Fallos: ${reporteJSON.estadisticas.porcentajeFallos}\n\n`;

            // Detalle de fallos
            if (resultadosUnificados.detalles.fallos.length > 0) {
                reporteTXT += 'DETALLE DE FALLOS\n';
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
                reporteTXT += '\n️ DETALLE DE DUPLICADOS\n';
                reporteTXT += '----------------------------------------\n';
                resultadosUnificados.detalles.duplicados.forEach((dup, i) => {
                    reporteTXT += `\n${i+1}. [#${dup.indice}] Usuario: ${dup.usuario} | DB: ${dup.database} | Tipo: ${dup.tipo}\n`;
                    reporteTXT += `   Error: ${dup.error}\n`;
                    reporteTXT += `   SQL: ${dup.sql}\n`;
                });
            }

            // Detalle de exitosos (primeros 10)
            if (resultadosUnificados.detalles.exitosos.length > 0) {
                reporteTXT += '\n DETALLE DE EXITOSAS (primeras 10)\n';
                reporteTXT += '----------------------------------------\n';
                resultadosUnificados.detalles.exitosos.slice(0, 10).forEach((exito, i) => {
                    reporteTXT += `\n${i+1}. [#${exito.indice}] Usuario: ${exito.usuario} | DB: ${exito.database} | Tipo: ${exito.tipo}\n`;
                    reporteTXT += `   Filas afectadas: ${exito.rowsAffected}\n`;
                    reporteTXT += `   SQL: ${exito.sql.substring(0, 100)}...\n`;
                });
            }

            cy.writeFile(`cypress/reports/mysql-report-${timestamp}.txt`, reporteTXT, { log: true });

            cy.log(` Reportes guardados en cypress/reports/`);
            cy.log(`   - JSON: mysql-report-${timestamp}.json`);
            cy.log(`   - CSV: mysql-report-${timestamp}.csv`);
            cy.log(`   - TXT: mysql-report-${timestamp}.txt`);
        }
    });

    describe.skip("002 -  Tipo de Dato...", () =>{

        let contador = 0;

        beforeEach(() => {
            Generales.IrAPantalla('dataType')
        })

        it("Agregar múltiples registros en crud Tipo de Dato", () => {
            //cy.fixture('tipoDeDato').then((dataTipoDato) => {
            cy.readFile('./JsonData/tipoDeDato.json').then((dataTipoDato) => {
                cy.wrap(dataTipoDato.agregar).each((item, index) => {
                    cy.log(`Insertando código: ${item.codigo}`)
                    const numero = index + 1;
                    cy.log(`Insertando registro #${numero}: ${item.codigo}`);



                    //Asegurar estado limpio antes de comenzar
                    cy.get('body').then(($body) => {
                        if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                            cy.log('Formulario abierto detectado, cerrando...')
                            Generales.BtnCancelarRegistro()
                        }
                    })

                    //Abrir formulario
                    Generales.BtnAgregarRegistro()

                    //Validar que el modal realmente abrió
                    cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                        .should('be.visible')

                    // Llenar datos
                    TipoDato.TipoDato(
                        item.codigo,
                        item.nombre,
                        item.descripcion
                    )

                    //Intercept backend
                    //cy.intercept('POST', '**/dataType').as('guardar')

                    const alias = `guardar-${numero}`;
                    cy.intercept('POST', '**/dataType').as(alias);

                    Generales.BtnAceptarRegistro()

                    // Esperar respuesta y decidir estado
                    cy.wait(`@${alias}`).then((interception) => {
                        const status = interception.response.statusCode;
                        let estado = 'fallida';
                        let mensaje = '';

                        cy.wait(500);
                        cy.get('body').then(($body) => {
                            const $snack = $body.find('span.message-snack');
                            if ($snack.length) mensaje = $snack.text().trim();
                        }).then(() => {
                            if (status === 200 || status === 201) {
                                estado = 'exitosa';
                                cy.log('Registro insertado correctamente');
                            } else {
                                estado = 'fallida';
                                cy.log(`Error detectado. Status: ${status}`);
                            }
                        }).then(() => {
                            const nombreCaptura = `Captura-${numero}-Tipo de Dato-${estado}`;
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '002 - Tipo de Dato',
                                    crud: "Tipo de Dato",
                                    descripcion: `Código: ${item.codigo} - Nombre: ${item.nombre}`,
                                    estado: estado,
                                    numero: numero,
                                    mensaje: mensaje,
                                    evidencia: `${nombreCaptura}.png`
                                });
                            });
                        }).then(() => {
                            cy.get('body').then(($body) => {
                                const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                                if (modalAbierto) {
                                    cy.log('Modal sigue abierto → cerrando manualmente');
                                    Generales.BtnCancelarRegistro();
                                    cy.wait(2000);
                                    cy.get('body').then(($bodyAfter) => {
                                        if ($bodyAfter.find('h2:contains("Nuevo Registro")').length > 0) {
                                            cy.log('⚠️ El modal no se cerró después de intentarlo, pero continuamos');
                                        } else {
                                            cy.log('Modal cerrado correctamente');
                                        }
                                    });
                                } else {
                                    cy.log('Modal ya cerrado');
                                }
                            });
                        });
                    });



                })
            })
        })

    })

    describe.skip("003 -  Paises...", () =>{


        beforeEach(() => {
            Generales.IrAPantalla('country')
        })

        /*it("Agregar múltiples registros en crud de paises", () => {
            //cy.fixture('pais').then((dataPais) => {
            cy.readFile('./JsonData/pais.json').then((dataPais) => {
                cy.wrap(dataPais.agregar).each((item, index) => {
                    cy.log(`Insertando nombre: ${item.nombre}`)
                    const numero = index + 1;
                    cy.log(`Insertando registro #${numero}: ${item.iso3Code}`);

                    //Asegurar estado limpio antes de comenzar
                    cy.get('body').then(($body) => {
                        if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                            cy.log('Formulario abierto detectado, cerrando...')
                            Generales.BtnCancelarRegistro()
                        }
                    })

                    //Abrir formulario
                    Generales.BtnAgregarRegistro()

                    //Validar que el modal realmente abrió
                    cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                        .should('be.visible')

                    // Llenar datos
                    Paises.Pais(
                        item.nombre,
                        item.iso2Code,
                        item.iso3Code,
                        item.tipo
                    )

                    //Intercept backend
                    const alias = `guardar-${numero}`;
                    cy.intercept('POST', '**!/country').as(alias);


                    Generales.BtnAceptarRegistro()

                    cy.wait(`@${alias}`).then((interception) => {
                        const status = interception.response.statusCode;
                        let estado = 'fallida';
                        let mensaje = '';

                        cy.wait(500);
                        cy.get('body').then(($body) => {
                            const $snack = $body.find('span.message-snack');
                            if ($snack.length) mensaje = $snack.text().trim();
                        }).then(() => {
                            if (status === 200 || status === 201) {
                                estado = 'exitosa';
                                cy.log('Registro insertado correctamente');
                            } else {
                                estado = 'fallida';
                                cy.log(`Error detectado. Status: ${status}`);
                            }
                        }).then(() => {
                            const nombreCaptura = `Captura-${numero}-Países-${estado}`;
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '003 - Países',
                                    crud: "Países",
                                    descripcion: `iso2Code: ${item.iso2Code} - Nombre: ${item.nombre}`,
                                    estado: estado,
                                    numero: numero,
                                    mensaje: mensaje,
                                    evidencia: `${nombreCaptura}.png`
                                });
                            });
                        }).then(() => {
                            cy.get('body').then(($body) => {
                                const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                                if (modalAbierto) {
                                    cy.log('Modal sigue abierto → cerrando manualmente');
                                    Generales.BtnCancelarRegistro();
                                    cy.wait(2000);
                                    cy.get('body').then(($bodyAfter) => {
                                        if ($bodyAfter.find('h2:contains("Nuevo Registro")').length > 0) {
                                            cy.log('El modal no se cerró después de intentarlo, pero continuamos');
                                        } else {
                                            cy.log('Modal cerrado correctamente');
                                        }
                                    });
                                } else {
                                    cy.log('Modal ya cerrado');
                                }
                            });
                        });
                    });

                })
            })
        })*/


        it("Agregar/modificar múltiples registros en crud de países", () => {
            cy.readFile('./JsonData/pais.json').then((data) => {
                let contador = 0; // contador global para números consecutivos

                const procesarRegistro = (item, numero, operacion) => {
                    cy.log(`🔢 Operación: ${operacion} - Código: ${item.iso3Code || item.iso2Code}`);

                    // Asegurar estado limpio
                    cy.get('body').then(($body) => {
                        if ($body.find('h2:contains("Nuevo Registro")').length > 0 ||
                            $body.find('h2:contains("Registro")').length > 0) {
                            cy.log('Formulario abierto detectado, cerrando...');
                            Generales.BtnCancelarRegistro();
                        }
                    });

                    // Abrir formulario según operación
                    if (operacion === 'agregar') {
                        cy.log('Agregando nuevo país');
                        Generales.BtnAgregarRegistro();
                        cy.contains('h2', 'Nuevo Registro', { timeout: 10000 }).should('be.visible');
                    } else if (operacion === 'modificar') {
                        cy.log('Modificando país existente');
                        Generales.BuscarRegistroIso3Code(item.iso3Codellave || item.iso3Code);
                        Generales.BtnModificarRegistro();
                        //cy.contains('h2', 'Registro', { timeout: 10000 }).should('be.visible');
                    } else {
                        cy.log(`Operación desconocida: ${operacion} - se omite`);
                        return;
                    }

                    // Llenar datos
                    Paises.Pais(
                        item.nombre,
                        item.iso2Code,
                        item.iso3Code,
                        item.tipo
                    );

                    // Interceptar según operación (método específico)
                    const alias = `guardarPais-${numero}`;
                    if (operacion === 'agregar') {
                        cy.intercept('POST', '**/country').as(alias);
                        cy.log(`Interceptando POST **/country (alias: ${alias})`);
                    } else if (operacion === 'modificar') {
                        cy.intercept('PATCH', '**/country/*').as(alias);
                        cy.log(`Interceptando PATCH **/country/* (alias: ${alias})`);
                    }

                    Generales.BtnAceptarRegistro();

                    cy.wait(`@${alias}`, { timeout: 10000 }).then((interception) => {
                        const status = interception.response.statusCode;
                        const method = interception.request.method;
                        let estado = 'fallida';
                        let mensaje = '';

                        cy.log(`📡 Método: ${method} - Status: ${status}`);

                        // Capturar mensaje del snackbar
                        cy.wait(500);
                        cy.get('body').then(($body) => {
                            const $snack = $body.find('span.message-snack');
                            if ($snack.length) mensaje = $snack.text().trim();
                            else cy.log('No se encontró snackbar');
                        }).then(() => {
                            if (status >= 200 && status < 300) {
                                estado = 'exitosa';
                                cy.log(`${operacion} correcto: ${item.iso3Code || item.iso2Code}`);
                            } else {
                                estado = 'fallida';
                                cy.log(`Error al ${operacion}. Status: ${status}`);
                            }
                        }).then(() => {
                            const nombreCaptura = `Captura-${numero}-Países-${estado}`;
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '003 - Países',
                                    crud: "Países",
                                    descripcion: `Código: ${item.iso3Code || item.iso2Code} - Nombre: ${item.nombre}`,
                                    estado: estado,
                                    numero: numero,
                                    mensaje: mensaje,
                                    evidencia: `${nombreCaptura}.png`
                                });
                            });
                        }).then(() => {
                            // Cierre del modal según resultado
                            if (estado === 'exitosa') {
                                cy.log('Operación exitosa → cerrando modal con "Atrás"');

                                Generales.Regresar()
                            } else {
                                cy.log('Operación fallida → cerrando modal con "Cancelar"');
                                Generales.BtnCancelarRegistro();
                            }
                            // Esperar a que el modal desaparezca
                            cy.get('mat-dialog-container', { timeout: 5000 }).should('not.exist');
                            cy.wait(1000);
                        });
                    });
                };

                // Procesar en el orden de las propiedades del JSON (primero agregar, luego modificar)
                Object.entries(data).forEach(([key, registros]) => {
                    if (Array.isArray(registros) && registros.length > 0) {
                        const operacion = key.toLowerCase();
                        cy.wrap(registros).each((item) => {
                            contador++;
                            procesarRegistro(item, contador, operacion);
                        });
                    }
                });
            });
        });

    })

   describe.skip("004 -  Monedas...", () =>{

        beforeEach(() => {
            Generales.IrAPantalla('money')
        })

        /*it("Agregar múltiples registros en crud de Monedas", () => {
            cy.readFile('./JsonData/monedas.json').then((dataMonedas) => {
                cy.wrap(dataMonedas.agregar).each((item) => {
                    const numero = index + 1;
                    cy.log(`Insertando código: ${item.codigo}`)

                    //Asegurar estado limpio antes de comenzar
                    cy.get('body').then(($body) => {
                        if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                            cy.log('Formulario abierto detectado, cerrando...')
                            Generales.BtnCancelarRegistro()
                        }
                    })

                    //Abrir formulario
                    Generales.BtnAgregarRegistroSubnivel()

                    //Validar que el modal realmente abrió
                    cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                        .should('be.visible')

                    // Llenar datos
                    Monedas.Monedas(
                        item.codigo,
                        item.codigoIso,
                        item.nombre,
                        item.codigoNumerico,
                        item.decimales,
                        item.puntoFlotante
                    )

                    //Intercept backend
                    //cy.intercept('POST', '**!/money').as('guardar')
                    const alias = `guardar-${numero}`;
                    cy.intercept('POST', '**!/money').as(alias);

                    Generales.BtnAceptarRegistro()


                    cy.wait(`@${alias}`).then((interception) => {
                        const status = interception.response.statusCode;
                        let estado = 'fallida';
                        let mensaje = '';

                        cy.wait(500);
                        cy.get('body').then(($body) => {
                            const $snack = $body.find('span.message-snack');
                            if ($snack.length) mensaje = $snack.text().trim();
                        }).then(() => {
                            if (status === 200 || status === 201) {
                                estado = 'exitosa';
                                cy.log('Registro insertado correctamente');
                            } else {
                                estado = 'fallida';
                                cy.log(`Error detectado. Status: ${status}`);
                            }
                        }).then(() => {
                            const nombreCaptura = `Captura-${numero}-Monedas-${estado}`;
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '004 - Monedas',
                                    crud: "Monedas",
                                    descripcion: `Código: ${item.codigo} - Nombre: ${item.nombre}`,
                                    estado: estado,
                                    numero: numero,
                                    mensaje: mensaje,
                                    evidencia: `${nombreCaptura}.png`
                                });
                            });
                        }).then(() => {
                            cy.get('body').then(($body) => {
                                const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                                if (modalAbierto) {
                                    cy.log('Modal sigue abierto → cerrando manualmente');
                                    Generales.BtnCancelarRegistro();
                                    cy.wait(2000);
                                    cy.get('body').then(($bodyAfter) => {
                                        if ($bodyAfter.find('h2:contains("Nuevo Registro")').length > 0) {
                                            cy.log('⚠️ El modal no se cerró después de intentarlo, pero continuamos');
                                        } else {
                                            cy.log('Modal cerrado correctamente');
                                        }
                                    });
                                } else {
                                    cy.log('Modal ya cerrado');
                                }
                            });
                        });
                    });
                })
            })
        })*/

       it("Agregar/modificar múltiples registros en crud de Monedas", () => {
           cy.readFile('./JsonData/monedas.json').then((data) => {
               let contador = 0;

               const procesarRegistro = (item, numero, operacion) => {
                   cy.log(`🔢 Operación: ${operacion} - Código: ${item.codigo}`);

                   // Asegurar estado limpio
                   cy.get('body').then(($body) => {
                       if ($body.find('h2:contains("Nuevo Registro")').length > 0 ||
                           $body.find('h2:contains("Registro")').length > 0) {
                           cy.log('Formulario abierto detectado, cerrando...');
                           Generales.BtnCancelarRegistro();
                       }
                   });

                   // Abrir formulario según operación
                   if (operacion === 'agregar') {
                       cy.log('Agregando nueva moneda');
                       Generales.BtnAgregarRegistroSubnivel();
                       cy.contains('h2', 'Nuevo Registro', { timeout: 10000 }).should('be.visible');
                   } else if (operacion === 'modificar') {
                       cy.log('Modificando moneda existente');
                       Generales.BuscarRegistroCodigo(item.codigollave);
                       Generales.BtnModificarRegistro();
                       // En lugar de validar un título fijo, esperamos a que el modal esté presente (formulario visible)
                       cy.get('form', { timeout: 10000 }).should('be.visible');
                   } else {
                       cy.log(`⚠️ Operación desconocida: ${operacion} - se omite`);
                       return;
                   }

                   // Llenar datos
                   Monedas.Monedas(
                       item.codigo,
                       item.codigoIso,
                       item.nombre,
                       item.codigoNumerico,
                       item.decimales,
                       item.puntoFlotante
                   );

                   // Interceptar según operación
                   const alias = `guardarMoneda-${numero}`;
                   if (operacion === 'agregar') {
                       cy.intercept('POST', '**/money').as(alias);
                       cy.log(`Interceptando POST **/money (alias: ${alias})`);
                   } else if (operacion === 'modificar') {
                       cy.intercept('PATCH', '**/money/*').as(alias);
                       cy.log(`Interceptando PATCH **/money/* (alias: ${alias})`);
                   }

                   Generales.BtnAceptarRegistro();

                   cy.wait(`@${alias}`, { timeout: 10000 }).then((interception) => {
                       const status = interception.response.statusCode;
                       const method = interception.request.method;
                       let estado = 'fallida';
                       let mensaje = '';

                       cy.log(`Método: ${method} - Status: ${status}`);

                       // Capturar mensaje del snackbar
                       cy.wait(500);
                       cy.get('body').then(($body) => {
                           const $snack = $body.find('span.message-snack');
                           if ($snack.length) mensaje = $snack.text().trim();
                           else cy.log('No se encontró snackbar');
                       }).then(() => {
                           if (status >= 200 && status < 300) {
                               estado = 'exitosa';
                               cy.log(`${operacion} correcto: ${item.codigo}`);
                           } else {
                               estado = 'fallida';
                               cy.log(`Error al ${operacion}. Status: ${status}`);
                           }
                       }).then(() => {
                           const nombreCaptura = `Captura-${numero}-Monedas-${estado}`;
                           cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                               cy.task('guardarResultado', {
                                   describe: '004 - Monedas',
                                   crud: "Monedas",
                                   descripcion: `Código: ${item.codigo} - Nombre: ${item.nombre}`,
                                   estado: estado,
                                   numero: numero,
                                   mensaje: mensaje,
                                   evidencia: `${nombreCaptura}.png`
                               });
                           });
                       }).then(() => {
                           // Cierre del modal según resultado
                           if (estado === 'exitosa') {
                               cy.log('Operación exitosa → esperando cierre automático del modal');
                               // No se hace clic, se espera que el modal se cierre solo
                           } else {
                               cy.log('Operación fallida → cerrando modal con "Cancelar"');
                               Generales.BtnCancelarRegistro();
                           }
                           // Esperar a que el modal desaparezca
                           cy.get('mat-dialog-container', { timeout: 5000 }).should('not.exist');
                           cy.wait(1000);
                       });
                   });
               };

               // Procesar en el orden de las propiedades del JSON (primero agregar, luego modificar según orden)
               Object.entries(data).forEach(([key, registros]) => {
                   if (Array.isArray(registros) && registros.length > 0) {
                       const operacion = key.toLowerCase();
                       cy.wrap(registros).each((item) => {
                           contador++;
                           procesarRegistro(item, contador, operacion);
                       });
                   }
               });
           });
       });


    })

    describe.skip("004.1 - Monedas > Crud Denominaciones...", () => {

        beforeEach(() => {
            Generales.IrAPantalla('money')
            cy.readFile('./JsonData/denominaciones.json').as('dataDenominaciones')
        })

        it("Agregar multiples registros en Subnivel Monedas > Denominaciones", function () {

            const datos = this.dataDenominaciones.agregar

            const agrupadas = datos.reduce((acc, item) => {
                if (!acc[item.codigoMoneda]) {
                    acc[item.codigoMoneda] = []
                }
                acc[item.codigoMoneda].push(item)
                return acc
            }, {})

            let numero = 0 // Contador para alias únicos

            cy.wrap(Object.keys(agrupadas)).each((codigoMoneda) => {
                cy.log('Procesando Moneda con código: ' + codigoMoneda)

                // 🔎 Buscar Moneda
                Generales.BuscarRegistroCodigo(codigoMoneda)
                Generales.NavegacionSubMenu('Denominación de Moneda')

                return cy.wrap(agrupadas[codigoMoneda]).each((registro) => {
                    numero++

                    // Asegurar estado limpio antes de abrir el modal (por si acaso)
                    cy.get('body').then(($body) => {
                        if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                            cy.log('Formulario abierto detectado, cerrando...')
                            Generales.BtnCancelarRegistro()
                        }
                    })

                    // Abrir formulario de Denominación
                    Generales.BtnAgregarRegistroSubnivel()

                    // Validar que el modal realmente abrió
                    cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                        .should('be.visible')

                    // Llenar datos de la Denominación
                    Denominaciones.DenominacionMoneda(
                        registro.nombre,
                        registro.etiqueta,
                        registro.valorTipo,
                        registro.monto
                    )

                    // Interceptar la petición POST al backend (ajustar URL según tu API)
                    const alias = `guardar-${numero}`
                    //cy.intercept('POST', '**/money').as(alias)
                    cy.intercept('POST', '**/denominationSpec').as(alias)

                    Generales.BtnAceptarRegistro()

                    cy.wait(`@${alias}`).then((interception) => {
                        const status = interception.response.statusCode
                        let estado = 'fallida'
                        let mensaje = ''

                        cy.wait(500)
                        cy.get('body').then(($body) => {
                            const $snack = $body.find('span.message-snack')
                            if ($snack.length) mensaje = $snack.text().trim()
                        }).then(() => {
                            if (status === 200 || status === 201) {
                                estado = 'exitosa'
                                cy.log('Denominación insertada correctamente')
                            } else {
                                estado = 'fallida'
                                cy.log(`Error detectado. Status: ${status}`)
                            }
                        }).then(() => {
                            const nombreCaptura = `Captura-${numero}-Denominacion-${estado}`
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '004.1 - Denominaciones',
                                    crud: "Denominación",
                                    descripcion: `Moneda: ${codigoMoneda} - Nombre: ${registro.nombre} - Monto: ${registro.monto}`,
                                    estado: estado,
                                    numero: numero,
                                    mensaje: mensaje,
                                    evidencia: `${nombreCaptura}.png`
                                })
                            })
                        }).then(() => {
                            // Cerrar el modal si aún está abierto
                            cy.get('body').then(($body) => {
                                const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0
                                if (modalAbierto) {
                                    cy.log('Modal sigue abierto → cerrando manualmente')
                                    Generales.BtnCancelarRegistro()
                                    cy.wait(2000)
                                    cy.get('body').then(($bodyAfter) => {
                                        if ($bodyAfter.find('h2:contains("Nuevo Registro")').length > 0) {
                                            cy.log('⚠️ El modal no se cerró después de intentarlo, pero continuamos')
                                        } else {
                                            cy.log('Modal cerrado correctamente')
                                        }
                                    })
                                } else {
                                    cy.log('Modal ya cerrado')
                                }
                            })
                        })
                    })

                    // Opcional: Verificar que el modal de denominación se cerró completamente
                    cy.get('mat-dialog-container', { timeout: 10000 }).should('not.exist')
                }).then(() => {
                    cy.log('🔙 Regresando al nivel principal después de procesar todas las denominaciones de la moneda')

                    // Primer regreso - SALIR DEL SUBNIVEL (listado de denominaciones)
                    cy.wait(3000)
                    Generales.Regresar()
                    // Verificar que salimos del subnivel (modal cerrado)
                    cy.get('mat-dialog-container', { timeout: 5000 }).should('not.exist')

                    // Segundo regreso - SALIR DEL DETALLE DE MONEDA
                    cy.wait(3000)
                    Generales.Regresar()
                    // Verificar que estamos en el listado principal de monedas
                    cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 }).should('be.visible')
                })
            })
        })
    })

    describe.skip('004.2 -  Monedas > Países que usan moneda', () => {

        beforeEach(() => {
            Generales.IrAPantalla('money')
            cy.readFile('./JsonData/paisesQueLoUsan.json').as('dataPaises')
        })

        it("Agregar multiples registros en Subnivel Monedas > Paises que lo usan", function () {

            const datos = this.dataPaises.agregar

            const agrupadas = datos.reduce((acc, item) => {
                if (!acc[item.codigoMoneda]) {
                    acc[item.codigoMoneda] = []
                }
                acc[item.codigoMoneda].push(item)
                return acc
            }, {})

            let numero = 0 // Contador para alias únicos

            cy.wrap(Object.keys(agrupadas)).each((codigoMoneda) => {
                cy.log('Procesando Moneda con código: ' + codigoMoneda)

                // 🔎 Buscar Moneda
                Generales.BuscarRegistroCodigo(codigoMoneda)
                Generales.NavegacionSubMenu('Paises que la usa')

                return cy.wrap(agrupadas[codigoMoneda]).each((registro) => {
                    numero++

                    // Asegurar estado limpio antes de abrir el modal (por si acaso)
                    cy.get('body').then(($body) => {
                        if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                            cy.log('Formulario abierto detectado, cerrando...')
                            Generales.BtnCancelarRegistro()
                        }
                    })

                    // Abrir formulario de Denominación
                    Generales.BtnAgregarRegistroSubnivel()

                    // Validar que el modal realmente abrió
                    cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                        .should('be.visible')

                    // Llenar datos de la Denominación

                    PaisesQueLoUsan.PaisesQueUsan(
                        registro.valorPais
                    )

                    // Interceptar la petición POST al backend (ajustar URL según tu API)
                    const alias = `guardar-${numero}`
                    //cy.intercept('POST', '**/money').as(alias)
                    cy.intercept('POST', '**/countriesUseMoney').as(alias)

                    Generales.BtnAceptarRegistro()

                    cy.wait(`@${alias}`).then((interception) => {
                        const status = interception.response.statusCode
                        let estado = 'fallida'
                        let mensaje = ''

                        cy.wait(500)
                        cy.get('body').then(($body) => {
                            const $snack = $body.find('span.message-snack')
                            if ($snack.length) mensaje = $snack.text().trim()
                        }).then(() => {
                            if (status === 200 || status === 201) {
                                estado = 'exitosa'
                                cy.log(' insertada correctamente')
                            } else {
                                estado = 'fallida'
                                cy.log(`Error detectado. Status: ${status}`)
                            }
                        }).then(() => {
                            const nombreCaptura = `Captura-${numero}-Moneda > Paises que la usan-${estado}`
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '004.2 - Paises que la usan',
                                    crud: "Paises que la usan",
                                    descripcion: `Moneda: ${codigoMoneda} - Pais: ${registro.valorPais}`,
                                    estado: estado,
                                    numero: numero,
                                    mensaje: mensaje,
                                    evidencia: `${nombreCaptura}.png`
                                })
                            })
                        }).then(() => {
                            // Cerrar el modal si aún está abierto
                            cy.get('body').then(($body) => {
                                const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0
                                if (modalAbierto) {
                                    cy.log('Modal sigue abierto → cerrando manualmente')
                                    Generales.BtnCancelarRegistro()
                                    cy.wait(2000)
                                    cy.get('body').then(($bodyAfter) => {
                                        if ($bodyAfter.find('h2:contains("Nuevo Registro")').length > 0) {
                                            cy.log('El modal no se cerró después de intentarlo, pero continuamos')
                                        } else {
                                            cy.log('Modal cerrado correctamente')
                                        }
                                    })
                                } else {
                                    cy.log('Modal ya cerrado')
                                }
                            })
                        })
                    })

                    // Opcional: Verificar que el modal de denominación se cerró completamente
                    cy.get('mat-dialog-container', { timeout: 10000 }).should('not.exist')
                }).then(() => {
                    cy.log('🔙 Regresando al nivel principal después de procesar todas las denominaciones de la moneda')

                    // Primer regreso - SALIR DEL SUBNIVEL (listado de denominaciones)
                    cy.wait(3000)
                    Generales.Regresar()
                    // Verificar que salimos del subnivel (modal cerrado)
                    cy.get('mat-dialog-container', { timeout: 5000 }).should('not.exist')

                    // Segundo regreso - SALIR DEL DETALLE DE MONEDA
                    cy.wait(3000)
                    Generales.Regresar()
                    // Verificar que estamos en el listado principal de monedas
                    cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 }).should('be.visible')
                })


            })
        })


    })

   describe.skip("005 -  Productos...", () =>{

        beforeEach(() => {
            Generales.IrAPantalla('products')
        })

        it("Agregar múltiples registros en crud de productos", () => {
            cy.readFile('./JsonData/productos.json').then((dataProductos) => {
                cy.wrap(dataProductos.agregar).each((item, index) => {
                    cy.log(`Insertando código: ${item.codigo}`)
                    const numero = index + 1;

                    //Asegurar estado limpio antes de comenzar
                    cy.get('body').then(($body) => {
                        if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                            cy.log('Formulario abierto detectado, cerrando...')
                            Generales.BtnCancelarRegistro()
                        }
                    })

                    //Abrir formulario
                    Generales.BtnAgregarRegistroSubnivel()

                    //Validar que el modal realmente abrió
                    cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                        .should('be.visible')

                    // Llenar datos
                    Productos.Productos(
                        //codigo, nombre, descripcion, valorMoneda, valorDigitoVerificador, longCuenta, mascaraCuenta
                        item.codigo,
                        item.nombre,
                        item.descripcion,
                        item.valorMoneda,
                        item.valorDigitoVerificador,
                        item.longCuenta,
                        item.mascaraCuenta
                    )

                    //Intercept backend
                    //cy.intercept('POST', '**/products').as('guardar')

                    const alias = `guardar-${numero}`;
                    cy.intercept('POST', '**/products').as(alias);

                    Generales.BtnAceptarRegistro()

                    cy.wait(`@${alias}`).then((interception) => {
                        const status = interception.response.statusCode;
                        let estado = 'fallida';
                        let mensaje = '';

                        cy.wait(500);
                        cy.get('body').then(($body) => {
                            const $snack = $body.find('span.message-snack');
                            if ($snack.length) mensaje = $snack.text().trim();
                        }).then(() => {
                            if (status === 200 || status === 201) {
                                estado = 'exitosa';
                                cy.log('Registro insertado correctamente');
                            } else {
                                estado = 'fallida';
                                cy.log(`Error detectado. Status: ${status}`);
                            }
                        }).then(() => {
                            const nombreCaptura = `Captura-${numero}-Productos-${estado}`;
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '005 - Productos',
                                    crud: "Productos",
                                    descripcion: `Código: ${item.codigo} - Nombre: ${item.nombre}`,
                                    estado: estado,
                                    numero: numero,
                                    mensaje: mensaje,
                                    evidencia: `${nombreCaptura}.png`
                                });
                            });
                        }).then(() => {
                            cy.get('body').then(($body) => {
                                const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                                if (modalAbierto) {
                                    cy.log('Modal sigue abierto → cerrando manualmente');
                                    Generales.BtnCancelarRegistro();
                                    cy.wait(2000);
                                    cy.get('body').then(($bodyAfter) => {
                                        if ($bodyAfter.find('h2:contains("Nuevo Registro")').length > 0) {
                                            cy.log('⚠️ El modal no se cerró después de intentarlo, pero continuamos');
                                        } else {
                                            cy.log('Modal cerrado correctamente');
                                        }
                                    });
                                } else {
                                    cy.log('Modal ya cerrado');
                                }
                            });
                        });
                    });



                })
            })
        })

    })

    describe.skip("006 -  Razones de reversion ...", () =>{

        beforeEach(() => {
            Generales.IrAPantalla('reasonsReverse')
        })

        it("Agregar múltiples registros dinámicamente", () => {
            cy.readFile('./JsonData/razonesReversa.json').then((data) => {
                cy.wrap(data.agregar).each((item,index) => {
                    cy.log(`Insertando código: ${item.codigo}`)
                    const numero = index + 1;
                    //Asegurar estado limpio antes de comenzar
                    cy.get('body').then(($body) => {
                        if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                            cy.log('Formulario abierto detectado, cerrando...')
                            Generales.BtnCancelarRegistro()
                        }
                    })

                    //Abrir formulario
                    Generales.BtnAgregarRegistros()

                    //Validar que el modal realmente abrió
                    cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                        .should('be.visible')

                    // Llenar datos
                    RazonesReversa.RazonReversion(
                        item.codigo,
                        item.nombre,
                        item.descripcion
                    )

                    //Intercept backend
                    const alias = `guardar-${numero}`;
                    cy.intercept('POST', '**/reasonsReverse').as(alias);


                    Generales.BtnAceptarRegistro()

                    // Esperar respuesta y decidir estado
                    cy.wait(`@${alias}`).then((interception) => {
                        const status = interception.response.statusCode;
                        let estado = 'fallida';
                        let mensaje = '';

                        cy.wait(500);
                        cy.get('body').then(($body) => {
                            const $snack = $body.find('span.message-snack');
                            if ($snack.length) mensaje = $snack.text().trim();
                        }).then(() => {
                            if (status === 200 || status === 201) {
                                estado = 'exitosa';
                                cy.log('Registro insertado correctamente');
                            } else {
                                estado = 'fallida';
                                cy.log(`Error detectado. Status: ${status}`);
                            }
                        }).then(() => {
                            const nombreCaptura = `Captura-${numero}-Razones de Reversión-${estado}`;
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '006 - Razones de Reversión',
                                    crud: "Razones de Reversión",
                                    descripcion: `Código: ${item.codigo} - Nombre: ${item.nombre}`,
                                    estado: estado,
                                    numero: numero,
                                    mensaje: mensaje,
                                    evidencia: `${nombreCaptura}.png`
                                });
                            });
                        }).then(() => {
                            cy.get('body').then(($body) => {
                                const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                                if (modalAbierto) {
                                    cy.log('Modal sigue abierto → cerrando manualmente');
                                    Generales.BtnCancelarRegistro();
                                    cy.wait(2000);
                                    cy.get('body').then(($bodyAfter) => {
                                        if ($bodyAfter.find('h2:contains("Nuevo Registro")').length > 0) {
                                            cy.log('⚠️ El modal no se cerró después de intentarlo, pero continuamos');
                                        } else {
                                            cy.log('Modal cerrado correctamente');
                                        }
                                    });
                                } else {
                                    cy.log('Modal ya cerrado');
                                }
                            });
                        });
                    });



                })
            })
        })

    })

    describe.skip("007 -  Mensajes de Error", () => {

        beforeEach(() => {
            Generales.IrAPantalla('errorMessage');
        });

        it("Agregar múltiples registros en crud de Mensajes de Error", () => {
            cy.readFile('./JsonData/MensajesDeError.json').then((dataMensajesDeError) => {
                cy.wrap(dataMensajesDeError.agregar).each((item, index) => {
                    cy.log(`\n🔵 Insertando código: ${item.codigo}`);
                    const numero = index + 1;

                    // Asegurar estado limpio
                    cy.get('body').then(($body) => {
                        if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                            cy.log('Cerrando formulario abierto...');
                            Generales.BtnCancelarRegistro();
                        }
                    });

                    // Abrir formulario
                    Generales.BtnAgregarRegistroSubnivel();
                    cy.contains('h2', 'Nuevo Registro', { timeout: 10000 }).should('be.visible');

                    // Llenar datos
                    MensajeDeError.MensajesError(
                        item.codigo,
                        item.mensajeError,
                        item.descripcion,
                        item.valorTipoMensaje,
                        item.valorAccion
                    );

                    // 🔧 Interceptar la petición POST antes de hacer clic
                    const alias = `guardar-${numero}`;
                    cy.intercept('POST', '**/errorMessages').as(alias);   // <- URL con 's'

                    // Hacer clic en Aceptar
                    Generales.BtnAceptarRegistro();

                    // Esperar respuesta y decidir estado
                    cy.wait(`@${alias}`, { timeout: 5000 }).then((interception) => {
                        const status = interception.response.statusCode;
                        let estado = 'fallida';
                        let mensaje = '';

                        cy.wait(500);
                        cy.get('body').then(($body) => {
                            const $snack = $body.find('span.message-snack');
                            if ($snack.length) mensaje = $snack.text().trim();
                        }).then(() => {
                            if (status === 200 || status === 201) {
                                estado = 'exitosa';
                                cy.log('Registro insertado correctamente');
                            } else {
                                estado = 'fallida';
                                cy.log(`Error detectado. Status: ${status}`);
                            }
                        }).then(() => {
                            const nombreCaptura = `Captura-${numero}-Mensajes de error-${estado}`;
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '007 - Mensajes de error',
                                    crud: "Mensajes de error",
                                    descripcion: `Código: ${item.codigo} -  ${item.mensajeError}`,
                                    estado: estado,
                                    numero: numero,
                                    mensaje: mensaje,
                                    evidencia: `${nombreCaptura}.png`
                                });
                            });
                        }).then(() => {
                            cy.get('body').then(($body) => {
                                const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                                if (modalAbierto) {
                                    cy.log('Modal sigue abierto → cerrando manualmente');
                                    Generales.BtnCancelarRegistro();
                                    cy.wait(2000);
                                    cy.get('body').then(($bodyAfter) => {
                                        if ($bodyAfter.find('h2:contains("Nuevo Registro")').length > 0) {
                                            cy.log('El modal no se cerró después de intentarlo, pero continuamos');
                                        } else {
                                            cy.log('Modal cerrado correctamente');
                                        }
                                    });
                                } else {
                                    cy.log('Modal ya cerrado');
                                }
                            });
                        });
                    });

                    // Opcional: verificar que el modal se cerró
                    cy.get('mat-dialog-container', { timeout: 10000 }).should('not.exist');
                });
            });
        });

    })

    describe.skip("008 -  Equivalencias ...", () =>{

        beforeEach(() => {
            Generales.IrAPantalla('equivalencies')
        })

        it("Agregar múltiples registros dinámicamente", () => {
            cy.readFile('./JsonData/equivalencias.json').then((data) => {
                cy.wrap(data.agregar).each((item, index) => {
                    cy.log(`Insertando código: ${item.codigo}`)
                    const numero = index + 1;

                    //Asegurar estado limpio antes de comenzar
                    cy.get('body').then(($body) => {
                        if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                            cy.log('Formulario abierto detectado, cerrando...')
                            Generales.BtnCancelarRegistro()
                        }
                    })

                    //Abrir formulario
                    Generales.BtnAgregarRegistros()

                    //Validar que el modal realmente abrió
                    cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                        .should('be.visible')

                    // Llenar datos
                    Equivalencias.Equivalencias(
                        //llave, datosEquivalentes, descripcion
                        item.llave,
                        item.datosEquivalentes,
                        item.descripcion
                    )

                    //Intercept backend
                    const alias = `guardar-${numero}`;
                    cy.intercept('POST', '**/equivalencies').as(alias);

                    Generales.BtnAceptarRegistro()


                    // Esperar respuesta y decidir estado
                    cy.wait(`@${alias}`).then((interception) => {
                        const status = interception.response.statusCode;
                        let estado = 'fallida';
                        let mensaje = '';

                        cy.wait(500);
                        cy.get('body').then(($body) => {
                            const $snack = $body.find('span.message-snack');
                            if ($snack.length) mensaje = $snack.text().trim();
                        }).then(() => {
                            if (status === 200 || status === 201) {
                                estado = 'exitosa';
                                cy.log('Registro insertado correctamente');
                            } else {
                                estado = 'fallida';
                                cy.log(`Error detectado. Status: ${status}`);
                            }
                        }).then(() => {
                            const nombreCaptura = `Captura-${numero}-Equivalencias-${estado}`;
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '008 - Equivalencias',
                                    crud: "Equivalencias",
                                    descripcion: `Llave: ${item.llave} - Dato Equivalente: ${item.datosEquivalentes}`,
                                    estado: estado,
                                    numero: numero,
                                    mensaje: mensaje,
                                    evidencia: `${nombreCaptura}.png`
                                });
                            });
                        }).then(() => {
                            cy.get('body').then(($body) => {
                                const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                                if (modalAbierto) {
                                    cy.log('Modal sigue abierto → cerrando manualmente');
                                    Generales.BtnCancelarRegistro();
                                    cy.wait(2000);
                                    cy.get('body').then(($bodyAfter) => {
                                        if ($bodyAfter.find('h2:contains("Nuevo Registro")').length > 0) {
                                            cy.log('⚠️ El modal no se cerró después de intentarlo, pero continuamos');
                                        } else {
                                            cy.log('Modal cerrado correctamente');
                                        }
                                    });
                                } else {
                                    cy.log('Modal ya cerrado');
                                }
                            });
                        });
                    });



                })
            })
        })

    })

    describe.skip("009 -  Regiones ...", () =>{

        beforeEach(() => {
            Generales.IrAPantalla('region')
        })

        it("Agregar múltiples registros en crud de Region", () => {
            cy.readFile('./JsonData/regiones.json').then((data) => {
                cy.wrap(data.agregar).each((item, index) => {
                    cy.log(`Insertando código: ${item.codigo}`)
                    const numero = index + 1;

                    //Asegurar estado limpio antes de comenzar
                    cy.get('body').then(($body) => {
                        if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                            cy.log('Formulario abierto detectado, cerrando...')
                            Generales.BtnCancelarRegistro()
                        }
                    })

                    //Abrir formulario
                    Generales.BtnAgregarRegistros()

                    //Validar que el modal realmente abrió
                    cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                        .should('be.visible')

                    // Llenar datos
                    Regiones.Region(
                        //codigo, nombre, descipcion
                        item.codigo,
                        item.nombre,
                        item.descripcion
                    )

                    //Intercept backend
                    const alias = `guardar-${numero}`;
                    cy.intercept('POST', '**/region').as(alias);

                    Generales.BtnAceptarRegistro()

// Esperar respuesta y decidir estado
                    cy.wait(`@${alias}`).then((interception) => {
                        const status = interception.response.statusCode;
                        let estado = 'fallida';
                        let mensaje = '';

                        cy.wait(500);
                        cy.get('body').then(($body) => {
                            const $snack = $body.find('span.message-snack');
                            if ($snack.length) mensaje = $snack.text().trim();
                        }).then(() => {
                            if (status === 200 || status === 201) {
                                estado = 'exitosa';
                                cy.log('Registro insertado correctamente');
                            } else {
                                estado = 'fallida';
                                cy.log(`Error detectado. Status: ${status}`);
                            }
                        }).then(() => {
                            const nombreCaptura = `Captura-${numero}-Regiones-${estado}`;
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '009 - Regiones',
                                    crud: "Regiones",
                                    descripcion: `Código: ${item.codigo} - Nombre: ${item.nombre}`,
                                    estado: estado,
                                    numero: numero,
                                    mensaje: mensaje,
                                    evidencia: `${nombreCaptura}.png`
                                });
                            });
                        }).then(() => {
                            cy.get('body').then(($body) => {
                                const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                                if (modalAbierto) {
                                    cy.log('Modal sigue abierto → cerrando manualmente');
                                    Generales.BtnCancelarRegistro();
                                    cy.wait(2000);
                                    cy.get('body').then(($bodyAfter) => {
                                        if ($bodyAfter.find('h2:contains("Nuevo Registro")').length > 0) {
                                            cy.log('⚠️ El modal no se cerró después de intentarlo, pero continuamos');
                                        } else {
                                            cy.log('Modal cerrado correctamente');
                                        }
                                    });
                                } else {
                                    cy.log('Modal ya cerrado');
                                }
                            });
                        });
                    });



                })
            })
        })

    })

   describe.skip("010 -  Niveles de Cajero...", () =>{

        beforeEach(() => {
            Generales.IrAPantalla('cashierLevel')
        })

        it("Agregar múltiples registros en crud de Niveles de cajero", () => {
            cy.readFile('./JsonData/NivelDeCajero.json').then((dataNivelDeCajero) => {
                cy.wrap(dataNivelDeCajero.agregar).each((item, index) => {
                    cy.log(`Insertando código: ${item.codigo}`)
                    const numero = index + 1;

                    //Asegurar estado limpio antes de comenzar
                    cy.get('body').then(($body) => {
                        if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                            cy.log('Formulario abierto detectado, cerrando...')
                            Generales.BtnCancelarRegistro()
                        }
                    })

                    //Abrir formulario
                    Generales.BtnAgregarRegistroSubnivel()

                    //Validar que el modal realmente abrió
                    cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                        .should('be.visible')

                    // Llenar datos
                    NivelCajero.NivelCajero(
                        //ccodigo, valorArbolRaiz, nombre, descripcion, valorNivelAutorizacion, rolKeycloak
                        item.codigo,
                        item.valorArbolRaiz,
                        item.nombre,
                        item.descripcion,
                        item.valorNivelAutorizacion,
                        item.rolKeycloak
                    )

                    //Intercept backend
                    const alias = `guardar-${numero}`;
                    cy.intercept('POST', '**/cashierLevel').as(alias);

                    Generales.BtnAceptarRegistro()

// Esperar respuesta y decidir estado
                    cy.wait(`@${alias}`).then((interception) => {
                        const status = interception.response.statusCode;
                        let estado = 'fallida';
                        let mensaje = '';

                        cy.wait(500);
                        cy.get('body').then(($body) => {
                            const $snack = $body.find('span.message-snack');
                            if ($snack.length) mensaje = $snack.text().trim();
                        }).then(() => {
                            if (status === 200 || status === 201) {
                                estado = 'exitosa';
                                cy.log('Registro insertado correctamente');
                            } else {
                                estado = 'fallida';
                                cy.log(`Error detectado. Status: ${status}`);
                            }
                        }).then(() => {
                            const nombreCaptura = `Captura-${numero}-Niveles de Cajero-${estado}`;
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '010- Niveles de Cajero',
                                    crud: "Niveles de Cajero",
                                    descripcion: `Código: ${item.codigo} - Nombre: ${item.nombre}`,
                                    estado: estado,
                                    numero: numero,
                                    mensaje: mensaje,
                                    evidencia: `${nombreCaptura}.png`
                                });
                            });
                        }).then(() => {
                            cy.get('body').then(($body) => {
                                const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                                if (modalAbierto) {
                                    cy.log('Modal sigue abierto → cerrando manualmente');
                                    Generales.BtnCancelarRegistro();
                                    cy.wait(2000);
                                    cy.get('body').then(($bodyAfter) => {
                                        if ($bodyAfter.find('h2:contains("Nuevo Registro")').length > 0) {
                                            cy.log('⚠️ El modal no se cerró después de intentarlo, pero continuamos');
                                        } else {
                                            cy.log('Modal cerrado correctamente');
                                        }
                                    });
                                } else {
                                    cy.log('Modal ya cerrado');
                                }
                            });
                        });
                    });

                })
            })
        })

    })

   describe.skip("011 -  Tipo de Cajero...", () =>{

        beforeEach(() => {
            Generales.IrAPantalla('typeCashier')
        })

        it("Agregar múltiples registros en crud Tipo de Cajero", () => {
            cy.readFile('./JsonData/tipoCajero.json').then((data) => {
                cy.wrap(data.agregar).each((item,index) => {
                    cy.log(`Insertando código: ${item.codigo}`)
                    const numero = index + 1;

                    //Asegurar estado limpio antes de comenzar
                    cy.get('body').then(($body) => {
                        if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                            cy.log('Formulario abierto detectado, cerrando...')
                            Generales.BtnCancelarRegistro()
                        }
                    })

                    //Abrir formulario
                    Generales.BtnAgregarRegistros()

                    //Validar que el modal realmente abrió
                    cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                        .should('be.visible')

                    // Llenar datos
                    TipoCajero.TipoCajero(
                        //codigo, descripcion, verTotales, permiteTotalizar, permiteRepetirLlave
                        item.codigo,
                        item.descripcion,
                        item.verTotales,
                        item.permiteTotalizar,
                        item.permiteRepetirLlave
                    )

                    //Intercept backend
                    const alias = `guardar-${numero}`;
                    cy.intercept('POST', '**/typeCashier').as(alias);

                    Generales.BtnAceptarRegistro()

                    // Esperar respuesta y decidir estado
                    cy.wait(`@${alias}`).then((interception) => {
                        const status = interception.response.statusCode;
                        let estado = 'fallida';
                        let mensaje = '';

                        cy.wait(500);
                        cy.get('body').then(($body) => {
                            const $snack = $body.find('span.message-snack');
                            if ($snack.length) mensaje = $snack.text().trim();
                        }).then(() => {
                            if (status === 200 || status === 201) {
                                estado = 'exitosa';
                                cy.log('Registro insertado correctamente');
                            } else {
                                estado = 'fallida';
                                cy.log(`Error detectado. Status: ${status}`);
                            }
                        }).then(() => {
                            const nombreCaptura = `Captura-${numero}-Niveles de Cajero-${estado}`;
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '011 - Niveles de Cajero',
                                    crud: "Niveles de Cajero",
                                    descripcion: `Código: ${item.codigo} - Descripción: ${item.descripcion}`,
                                    estado: estado,
                                    numero: numero,
                                    mensaje: mensaje,
                                    evidencia: `${nombreCaptura}.png`
                                });
                            });
                        }).then(() => {
                            cy.get('body').then(($body) => {
                                const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                                if (modalAbierto) {
                                    cy.log('Modal sigue abierto → cerrando manualmente');
                                    Generales.BtnCancelarRegistro();
                                    cy.wait(2000);
                                    cy.get('body').then(($bodyAfter) => {
                                        if ($bodyAfter.find('h2:contains("Nuevo Registro")').length > 0) {
                                            cy.log('El modal no se cerró después de intentarlo, pero continuamos');
                                        } else {
                                            cy.log('Modal cerrado correctamente');
                                        }
                                    });
                                } else {
                                    cy.log('Modal ya cerrado');
                                }
                            });
                        });
                    });


                })
            })
        })

    })

   describe.skip("012 - Usuario", () => {

        beforeEach(() => {
            Generales.IrAPantalla('user');
        });

       it("Buscar persona y agregar múltiples registros en crud Usuarios", () => {
           cy.readFile('./JsonData/usuarios.json').then((dataUsuarios) => {
               cy.wrap(dataUsuarios.agregar).each((item, index) => {
                   const numero = index + 1;
                   cy.log(`\n🔵 Procesando registro ${numero}: ${item.usuario}`);

                   // Asegurar estado limpio
                   cy.get('body').then(($body) => {
                       if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                           cy.log('Cerrando formulario abierto...');
                           Generales.BtnCancelarRegistro();
                       }
                   });

                   // 1. Buscar persona (modal de búsqueda)
                   cy.log('🔍 Buscando persona...');
                   Generales.BtnAgregarRegistroSubnivel();
                   cy.contains('h2', 'Buscar persona', { timeout: 10000 }).should('be.visible');

                   Usuarios.BuscarPersona(
                       item.tipoIdentificacion,
                       item.numeroIdentificacion
                   );

                   // Verificar si la búsqueda falló
                   let busquedaExitosa = true;
                   cy.get('body', { timeout: 5000 }).then(($body) => {
                       const hayErrorBusqueda =
                           $body.text().includes('no encontrado') ||
                           $body.text().includes('no existe') ||
                           $body.text().includes('invalid') ||
                           $body.find('.error-message, .alert-danger, .toast-error, .mat-error').length > 0;

                       if (hayErrorBusqueda) {
                           busquedaExitosa = false;
                           cy.log('❌ Error en búsqueda de persona');
                           cy.get('button').contains('Cancelar').click();
                           cy.contains('h2', 'Buscar persona').should('not.exist');
                       } else {
                           cy.log('✅ Búsqueda exitosa');
                       }
                   }).then(() => {
                       if (!busquedaExitosa) {
                           // Fallo en búsqueda → guardar resultado
                           const nombreCaptura = `Captura-${numero}-Usuarios-fallida`;
                           cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                               cy.task('guardarResultado', {
                                   describe: '012 - Usuario',
                                   crud: "Usuario",
                                   descripcion: `Usuario: ${item.usuario} - Identificación: ${item.numeroIdentificacion}`,
                                   estado: 'fallida',
                                   numero: numero,
                                   mensaje: 'Error en búsqueda de persona: no encontrada',
                                   evidencia: `${nombreCaptura}.png`
                               });
                           });
                           return;
                       }

                       // 2. Llenar datos de usuario (modal ahora es "Nuevo Registro")
                       cy.log('✍️ Agregando usuario...');
                       cy.contains('h2', 'Nuevo Registro', { timeout: 10000 }).should('be.visible');

                       Usuarios.Usuario(
                           item.codigo,
                           item.usuario,
                           item.pNombre,
                           item.sNombre,
                           item.pApellido,
                           item.sApellido,
                           item.valorPais,
                           item.codigoEbs,
                           item.correo,
                           item.telTrabajo,
                           item.codigoEmpleado,
                           item.valorArbolRaiz,
                           item.valorRamaArbol,
                           item.valorDepartamento,
                           item.valorTipoCajero,
                           item.valorJornadaLaboral,
                           item.valorNivelCajero,
                           item.puertoImpre
                       );

                       // Verificar errores en combos
                       let comboError = false;
                       cy.get('body', { timeout: 5000 }).then(($body) => {
                           const hayErrorCombos =
                               $body.find('.error-message, .alert-danger, .toast-error, .mat-error').length > 0 ||
                               $body.text().includes('requerido') ||
                               $body.text().includes('obligatorio');

                           if (hayErrorCombos) {
                               comboError = true;
                               cy.log('❌ Error en combos detectado');
                           }
                       }).then(() => {
                           if (comboError) {
                               const nombreCaptura = `Captura-${numero}-Usuarios-fallida`;
                               cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                   cy.task('guardarResultado', {
                                       describe: '012 - Usuario',
                                       crud: "Usuario",
                                       descripcion: `Usuario: ${item.usuario} - Identificación: ${item.numeroIdentificacion}`,
                                       estado: 'fallida',
                                       numero: numero,
                                       mensaje: 'Error en combos: algún campo requerido no seleccionado',
                                       evidencia: `${nombreCaptura}.png`
                                   });
                               }).then(() => {
                                   Generales.BtnCancelarRegistro();
                                   cy.contains('h2', 'Nuevo Registro').should('not.exist');
                               });
                               return;
                           }

                           // 3. Enviar y capturar respuesta
                           const alias = `guardar-${numero}`;
                           cy.intercept('POST', '**/user').as(alias);
                           Generales.BtnAceptarRegistro();

                           cy.wait(`@${alias}`, { timeout: 10000 }).then((interception) => {
                               const status = interception.response.statusCode;
                               let estado = 'fallida';
                               let mensaje = '';

                               cy.wait(500);
                               cy.get('body').then(($body) => {
                                   const $snack = $body.find('span.message-snack');
                                   if ($snack.length) mensaje = $snack.text().trim();
                               }).then(() => {
                                   if (status === 200 || status === 201) {
                                       estado = 'exitosa';
                                       cy.log('✅ Usuario insertado correctamente');
                                   } else {
                                       estado = 'fallida';
                                       cy.log(`❌ Error detectado. Status: ${status}`);
                                   }
                               }).then(() => {
                                   const nombreCaptura = `Captura-${numero}-Usuarios-${estado}`;
                                   cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                       cy.task('guardarResultado', {
                                           describe: '012 - Usuario',
                                           crud: "Usuario",
                                           descripcion: `Usuario: ${item.usuario} - Identificación: ${item.numeroIdentificacion}`,
                                           estado: estado,
                                           numero: numero,
                                           mensaje: mensaje,
                                           evidencia: `${nombreCaptura}.png`
                                       });
                                   });
                               }).then(() => {
                                   // Cerrar modal si aún está abierto
                                   cy.get('body').then(($body) => {
                                       if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                                           cy.log('Modal sigue abierto → cerrando manualmente');
                                           Generales.BtnCancelarRegistro();
                                           cy.wait(2000);
                                       }
                                   });
                               });
                           });
                       });
                   });
                   cy.wait(1000);
               });
           });
       });
    });

    describe.skip("013 -  Razones de Bloqueo de Usuario...", () =>{


        beforeEach(() => {
            Generales.IrAPantalla('reasonsUserBlock')
        })

        it("Agregar múltiples registros en el crud Razones de Bloqueo de Usuarios", () => {
            cy.readFile('./JsonData/razonesBloqueoUsuario.json').then((data) => {
                cy.wrap(data.agregar).each((item, index) => {
                    cy.log(`Insertando código: ${item.codigo}`)
                    const numero = index + 1;

                    //Asegurar estado limpio antes de comenzar
                    cy.get('body').then(($body) => {
                        if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                            cy.log('Formulario abierto detectado, cerrando...')
                            Generales.BtnCancelarRegistro()
                        }
                    })

                    //Abrir formulario
                    Generales.BtnAgregarRegistros()

                    //Validar que el modal realmente abrió
                    cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                        .should('be.visible')

                    // Llenar datos
                    RazonesBloqueo.RazonesBloqueoUsuarios(
                        //cocodigo, razon, mensaje
                        item.codigo,
                        item.razon,
                        item.mensaje
                    )

                    //Intercept backend
                    const alias = `guardar-${numero}`;
                    cy.intercept('POST', '**/reasonsUserBlock').as(alias);

                    Generales.BtnAceptarRegistro()

// Esperar respuesta y decidir estado
                    cy.wait(`@${alias}`).then((interception) => {
                        const status = interception.response.statusCode;
                        let estado = 'fallida';
                        let mensaje = '';

                        cy.wait(500);
                        cy.get('body').then(($body) => {
                            const $snack = $body.find('span.message-snack');
                            if ($snack.length) mensaje = $snack.text().trim();
                        }).then(() => {
                            if (status === 200 || status === 201) {
                                estado = 'exitosa';
                                cy.log('Registro insertado correctamente');
                            } else {
                                estado = 'fallida';
                                cy.log(`Error detectado. Status: ${status}`);
                            }
                        }).then(() => {
                            const nombreCaptura = `Captura-${numero}-Razones de Bloqueo de Usuarios-${estado}`;
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '013 - Razones de Bloqueo de Usuarios',
                                    crud: "Razones de Bloqueo de Usuarios",
                                    descripcion: `Código: ${item.codigo} - Razón: ${item.razon}`,
                                    estado: estado,
                                    numero: numero,
                                    mensaje: mensaje,
                                    evidencia: `${nombreCaptura}.png`
                                });
                            });
                        }).then(() => {
                            cy.get('body').then(($body) => {
                                const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                                if (modalAbierto) {
                                    cy.log('Modal sigue abierto → cerrando manualmente');
                                    Generales.BtnCancelarRegistro();
                                    cy.wait(2000);
                                    cy.get('body').then(($bodyAfter) => {
                                        if ($bodyAfter.find('h2:contains("Nuevo Registro")').length > 0) {
                                            cy.log('El modal no se cerró después de intentarlo, pero continuamos');
                                        } else {
                                            cy.log('Modal cerrado correctamente');
                                        }
                                    });
                                } else {
                                    cy.log('Modal ya cerrado');
                                }
                            });
                        });
                    });

                })
            })
        })

    })

   describe.skip("014 -  Campos de la transacción ...", () =>{

        beforeEach(() => {
            Generales.IrAPantalla('characteristicSpec')
        })

        it("Agregar múltiples registros en el crud Campos de la transacción", () => {
            cy.readFile('./JsonData/camposTransaccion.json').then((data) => {
                cy.wrap(data.agregar).each((item, index) => {
                    cy.log(`Insertando código: ${item.codigo}`)
                    const numero = index + 1;

                    //Asegurar estado limpio antes de comenzar
                    cy.get('body').then(($body) => {
                        if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                            cy.log('Formulario abierto detectado, cerrando...')
                            Generales.BtnCancelarRegistro()
                        }
                    })

                    //Abrir formulario
                    Generales.BtnAgregarRegistros()

                    //Validar que el modal realmente abrió
                    cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                        .should('be.visible')

                    // Llenar datos
                    CamposDeTransaccion.CamposTransaccion(

                        item.codigo, item.nombre, item.etiqueta, item.descripcion, item.tieneDatosSensibles, item.Tipo, item.longitudMin, item.longitudMax, item.longitudEnvio,
                        item.digitoVerificador, item.mascara, item.listaValores, item.rangoValores, item.limiteInferior, item.limiteSuperior, item.llenadoAutomatico, item.etiquetaJson,
                        item.valorDefecto, item.ayuda, item.moneda, item.rutina, item.implListaVista, item.implServicio, item.endpointAyuda, item.estado, item.validoDesde, item.validoHasta, item.usaSumadora,
                        item.idCampoEscuchar, item.requiereDetalleEfectivo, item.archivoYML, item.datosTachados, item.caracterVisualizar, item.esControlEfectivo
                    )

                    //Intercept backend
                    const alias = `guardar-${numero}`;
                    cy.intercept('POST', '**/characteristicSpec').as(alias);

                    Generales.BtnAceptarRegistro()

                    // Esperar respuesta y decidir estado
                    cy.wait(`@${alias}`).then((interception) => {
                        const status = interception.response.statusCode;
                        let estado = 'fallida';
                        let mensaje = '';

                        cy.wait(500);
                        cy.get('body').then(($body) => {
                            const $snack = $body.find('span.message-snack');
                            if ($snack.length) mensaje = $snack.text().trim();
                        }).then(() => {
                            if (status === 200 || status === 201) {
                                estado = 'exitosa';
                                cy.log('Registro insertado correctamente');
                            } else {
                                estado = 'fallida';
                                cy.log(`Error detectado. Status: ${status}`);
                            }
                        }).then(() => {
                            const nombreCaptura = `Captura-${numero}-Campos de transacción-${estado}`;
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '014 - Campos de transacción',
                                    crud: "Campos de transacción",
                                    descripcion: `Código: ${item.codigo} - Nombre: ${item.nombre}`,
                                    estado: estado,
                                    numero: numero,
                                    mensaje: mensaje,
                                    evidencia: `${nombreCaptura}.png`
                                });
                            });
                        }).then(() => {
                            cy.get('body').then(($body) => {
                                const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                                if (modalAbierto) {
                                    cy.log('Modal sigue abierto → cerrando manualmente');
                                    Generales.BtnCancelarRegistro();
                                    cy.wait(2000);
                                    cy.get('body').then(($bodyAfter) => {
                                        if ($bodyAfter.find('h2:contains("Nuevo Registro")').length > 0) {
                                            cy.log('⚠️ El modal no se cerró después de intentarlo, pero continuamos');
                                        } else {
                                            cy.log('Modal cerrado correctamente');
                                        }
                                    });
                                } else {
                                    cy.log('Modal ya cerrado');
                                }
                            });
                        });
                    });


                })
            })
        })

    })

    describe.skip("014.1 -  transacció > Valores de Caracteristicas...", () =>{


        beforeEach(() => {
            Generales.IrAPantalla('characteristicSpec')
            cy.readFile('./JsonData/valoresCaracteristicas.json').as('valoresCaracteristicas')
        })

        it("Agregar multiples registros en Subnivel Campos de la transacció > Valores de Caracteristica ", function () {

            const datos = this.valoresCaracteristicas.agregar

            const agrupadas = datos.reduce((acc, item) => {
                if (!acc[item.codigo]) {
                    acc[item.codigo] = []
                }
                acc[item.codigo].push(item)
                return acc
            }, {})

            cy.wrap(Object.keys(agrupadas)).each((codigo,index) => {
                cy.log('Procesando Regla con nombre: ' + codigo)

                const numero = index + 1;
                // 🔎 Buscar Regla
                Generales.BuscarRegistroCodigo(codigo)
                Generales.NavegacionSubMenu('Valores de Característica')

                return cy.wrap(agrupadas[codigo]).each((registro) => {
                    Generales.BtnAgregarRegistroSubnivel()
                    CamposDeTransaccion.ValoresDeCaracteristica(
                        //valor, valorDefecto, descriptor, descriptor2, descriptor3, descriptor4
                        registro.valor,
                        registro.valorDefecto,
                        registro.descriptor,
                        registro.descriptor2,
                        registro.descriptor3,
                        registro.descriptor4
                    )

                    const alias = `guardar-${numero}`
                    cy.intercept('POST', '**/characteristicSpecValue').as(alias)

                    Generales.BtnAceptarRegistro();


                    cy.wait(`@${alias}`).then((interception) => {
                        const status = interception.response.statusCode
                        let estado = 'fallida'
                        let mensaje = ''

                        cy.wait(500)
                        cy.get('body').then(($body) => {
                            const $snack = $body.find('span.message-snack')
                            if ($snack.length) mensaje = $snack.text().trim()
                        }).then(() => {
                            if (status === 200 || status === 201) {
                                estado = 'exitosa'
                                cy.log('Denominación insertada correctamente')
                            } else {
                                estado = 'fallida'
                                cy.log(`Error detectado. Status: ${status}`)
                            }
                        }).then(() => {
                            const nombreCaptura = `Captura-${numero}-Campos de la transccion > Valores de Característica-${estado}`
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '014.1 - Valores de Característica',
                                    crud: "Valores de Característica",
                                    descripcion: `Código: ${codigo} - Valor: ${registro.valor} - Descriptor: ${registro.descriptor}`,
                                    estado: estado,
                                    numero: numero,
                                    mensaje: mensaje,
                                    evidencia: `${nombreCaptura}.png`
                                })
                            })
                        }).then(() => {
                            // Cerrar el modal si aún está abierto
                            cy.get('body').then(($body) => {
                                const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0
                                if (modalAbierto) {
                                    cy.log('Modal sigue abierto → cerrando manualmente')
                                    Generales.BtnCancelarRegistro()
                                    cy.wait(2000)
                                    cy.get('body').then(($bodyAfter) => {
                                        if ($bodyAfter.find('h2:contains("Nuevo Registro")').length > 0) {
                                            cy.log('El modal no se cerró después de intentarlo, pero continuamos')
                                        } else {
                                            cy.log('Modal cerrado correctamente')
                                        }
                                    })
                                } else {
                                    cy.log('Modal ya cerrado')
                                }
                            })
                        })
                    })

                    // Opcional: Verificar que el modal de denominación se cerró completamente
                    cy.get('mat-dialog-container', { timeout: 10000 }).should('not.exist')
                }).then(() => {
                    cy.log('🔙 Regresando al nivel principal después de procesar todas las denominaciones de la moneda')

                    // Primer regreso - SALIR DEL SUBNIVEL (listado de denominaciones)
                    cy.wait(3000)
                    Generales.Regresar()
                    // Verificar que salimos del subnivel (modal cerrado)
                    cy.get('mat-dialog-container', { timeout: 5000 }).should('not.exist')

                    // Segundo regreso - SALIR DEL DETALLE DE MONEDA
                    cy.wait(3000)
                    Generales.Regresar()
                    // Verificar que estamos en el listado principal de monedas
                    cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 }).should('be.visible')
                })


            })
        })

    })

    describe.skip("014.2 -  transacción > Sub Características...", () =>{


        beforeEach(() => {
            Generales.IrAPantalla('characteristicSpec')
            cy.readFile('./JsonData/subCaracteristicas.json').as('subCaracteristicas')

        })

        it("Agregar multiples registros en Subnivel Campos de la transacció > Sub Características", function () {

            const datos = this.subCaracteristicas.agregar

            const agrupadas = datos.reduce((acc, item) => {
                if (!acc[item.codigo]) {
                    acc[item.codigo] = []
                }
                acc[item.codigo].push(item)
                return acc
            }, {})

            cy.wrap(Object.keys(agrupadas)).each((codigo, index) => {
                cy.log('Procesando subCaracteristicas con codigo: ' + codigo)
                const numero = index + 1;

                // 🔎 Buscar Regla
                Generales.BuscarRegistroCodigo(codigo)
                Generales.NavegacionSubMenu('Sub Características')

                return cy.wrap(agrupadas[codigo]).each((registro) => {
                    Generales.BtnAgregarRegistroSubnivel()
                    CamposDeTransaccion.SubCaracteristicas(
                        registro.correlativo,
                        registro.subCaracteristica,
                        registro.campoTotalizable,
                        registro.TipoOperacion,
                        registro.campoMandatorio,
                        registro.campoVisualizable,
                        registro.campoProtegido
                    )

                    const alias = `guardar-${numero}`
                    //cy.intercept('POST', '**/money').as(alias)
                    cy.intercept('POST', '**/subCharacteristicSpec').as(alias)

                    Generales.BtnAceptarRegistro();

                    cy.wait(`@${alias}`).then((interception) => {
                        const status = interception.response.statusCode
                        let estado = 'fallida'
                        let mensaje = ''

                        cy.wait(500)
                        cy.get('body').then(($body) => {
                            const $snack = $body.find('span.message-snack')
                            if ($snack.length) mensaje = $snack.text().trim()
                        }).then(() => {
                            if (status === 200 || status === 201) {
                                estado = 'exitosa'
                                cy.log('Denominación insertada correctamente')
                            } else {
                                estado = 'fallida'
                                cy.log(`Error detectado. Status: ${status}`)
                            }
                        }).then(() => {
                            const nombreCaptura = `Captura-${numero}-Campos de transacción > Sub Características-${estado}`
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '014.2 - Sub Características',
                                    crud: "Sub-característica",
                                    descripcion: `Código: ${codigo} - Correlativo: ${registro.correlativo} - Sub-característica: ${registro.subCaracteristica}`,
                                    estado: estado,
                                    numero: numero,
                                    mensaje: mensaje,
                                    evidencia: `${nombreCaptura}.png`
                                })
                            })
                        }).then(() => {
                            // Cerrar el modal si aún está abierto
                            cy.get('body').then(($body) => {
                                const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0
                                if (modalAbierto) {
                                    cy.log('Modal sigue abierto → cerrando manualmente')
                                    Generales.BtnCancelarRegistro()
                                    cy.wait(2000)
                                    cy.get('body').then(($bodyAfter) => {
                                        if ($bodyAfter.find('h2:contains("Nuevo Registro")').length > 0) {
                                            cy.log('El modal no se cerró después de intentarlo, pero continuamos')
                                        } else {
                                            cy.log('Modal cerrado correctamente')
                                        }
                                    })
                                } else {
                                    cy.log('Modal ya cerrado')
                                }
                            })
                        })
                    })

                    // Opcional: Verificar que el modal de denominación se cerró completamente
                    cy.get('mat-dialog-container', { timeout: 10000 }).should('not.exist')
                }).then(() => {
                    cy.log('🔙 Regresando al nivel principal después de procesar todas las denominaciones de la moneda')

                    // Primer regreso - SALIR DEL SUBNIVEL (listado de denominaciones)
                    cy.wait(3000)
                    Generales.Regresar()
                    // Verificar que salimos del subnivel (modal cerrado)
                    cy.get('mat-dialog-container', { timeout: 5000 }).should('not.exist')

                    // Segundo regreso - SALIR DEL DETALLE DE MONEDA
                    cy.wait(3000)
                    Generales.Regresar()
                    // Verificar que estamos en el listado principal de monedas
                    cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 }).should('be.visible')
                })



            })
        })

    })

    describe.skip("015 -  Formatos...", () =>{

        beforeEach(() => {
            Generales.IrAPantalla('format')
        })

        it("Agregar múltiples registros en crud de Formatos", () => {
            cy.readFile('./JsonData/formatos.json').then((dataFormatos) => {
                cy.wrap(dataFormatos.agregar).each((item,index) => {
                    cy.log(`Insertando código: ${item.codigo}`)
                    const numero = index + 1;

                    //Asegurar estado limpio antes de comenzar
                    cy.get('body').then(($body) => {
                        if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                            cy.log('Formulario abierto detectado, cerrando...')
                            Generales.BtnCancelarRegistro()
                        }
                    })

                    //Abrir formulario
                    Generales.BtnAgregarRegistroSubnivel()

                    //Validar que el modal realmente abrió
                    cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                        .should('be.visible')

                    // Llenar datos
                    Formatos.Formato(
                        item.codigo,
                        item.nombre,
                        item.nombreAbreviado,
                        item.descripcion,
                        item.plantilla,
                        item.extencion,
                        item.valorDatosTachados,
                        item.valorIncluirImagen,
                        item.posicion,
                        item.tamanioImagen,
                        item.valorParaCatalogos,
                        item.codigoPlantillaAlternativa,
                        item.poscEtiquetaComprobante,
                        item.poscEtiquetaReimprimir
                    )

                    //Intercept backend
                    const alias = `guardar-${numero}`;
                    cy.intercept('POST', '**/format').as(alias);

                    Generales.BtnAceptarRegistro()

                    // Esperar respuesta y decidir estado
                    cy.wait(`@${alias}`).then((interception) => {
                        const status = interception.response.statusCode;
                        let estado = 'fallida';
                        let mensaje = '';

                        cy.wait(500);
                        cy.get('body').then(($body) => {
                            const $snack = $body.find('span.message-snack');
                            if ($snack.length) mensaje = $snack.text().trim();
                        }).then(() => {
                            if (status === 200 || status === 201) {
                                estado = 'exitosa';
                                cy.log('Registro insertado correctamente');
                            } else {
                                estado = 'fallida';
                                cy.log(`Error detectado. Status: ${status}`);
                            }
                        }).then(() => {
                            const nombreCaptura = `Captura-${numero}-Formatos-${estado}`;
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '015 - Formatos',
                                    crud: "Formatos",
                                    descripcion: `Código: ${item.codigo} - Nombre: ${item.nombre}`,
                                    estado: estado,
                                    numero: numero,
                                    mensaje: mensaje,
                                    evidencia: `${nombreCaptura}.png`
                                });
                            });
                        }).then(() => {
                            cy.get('body').then(($body) => {
                                const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                                if (modalAbierto) {
                                    cy.log('Modal sigue abierto → cerrando manualmente');
                                    Generales.BtnCancelarRegistro();
                                    cy.wait(2000);
                                    cy.get('body').then(($bodyAfter) => {
                                        if ($bodyAfter.find('h2:contains("Nuevo Registro")').length > 0) {
                                            cy.log('⚠️ El modal no se cerró después de intentarlo, pero continuamos');
                                        } else {
                                            cy.log('Modal cerrado correctamente');
                                        }
                                    });
                                } else {
                                    cy.log('Modal ya cerrado');
                                }
                            });
                        });
                    });



                })
            })
        })

    })

    describe.skip("015.1 - Formato > Detalle de Formato...", () =>{

        beforeEach(() => {
            Generales.IrAPantalla('format')
            cy.readFile('./JsonData/detalleDeFormato.json').as('dataDetalleFromato')
        })

        it("Agregar registros a subnivel Detalle de Formatos", function () {

            const datos = this.dataDetalleFromato.agregar

            const agrupadas = datos.reduce((acc, item) => {
                if (!acc[item.codigoFormato]) {
                    acc[item.codigoFormato] = []
                }
                acc[item.codigoFormato].push(item)
                return acc
            }, {})

            let numero = 0

            cy.wrap(Object.keys(agrupadas)).each((codigoFormato) => {
                cy.log('Procesando Regla con nombre: ' + codigoFormato)
                numero++

                // 🔎 Buscar Formato
                Generales.BuscarRegistroCodigo(codigoFormato)
                Generales.NavegacionSubMenu('Detalle de Formato')

                return cy.wrap(agrupadas[codigoFormato]).each((registro) => {


                    Generales.BtnAgregarRegistroSubnivel()
                    cy.log("y el agregar que pedo")
                    //  const pais = registro.valorPais || registro.nombre
                    DetalleFormatos.DetalleFormato(
                        //
                        registro.correlativo,
                        registro.descripcion,
                        registro.valorTipoDatos,
                        registro.constante,
                        registro.removerCeros,
                        registro.mascaraImpresion,
                        registro.valorEspecificacionCaracteristica1,
                        registro.valorOperador,
                        registro.valorEspecificaciOnCaracteristica2,
                        registro.leerPosInicial,
                        registro.leerTamDatos,
                        registro.imprimirFila,
                        registro.imprimirTamDatos,
                        registro.imprimirPosicionColumna,
                        registro.expresionDatosRecurso,
                        registro.expresion1,
                        registro.valorOperacion,
                        registro.expresion2,
                        registro.valorTipoExpresion
                    )

                    const alias = `guardar-${numero}`
                    cy.intercept('POST', '**/formatDetail').as(alias)

                    Generales.BtnAceptarRegistro();


                    cy.wait(`@${alias}`).then((interception) => {
                        const status = interception.response.statusCode
                        let estado = 'fallida'
                        let mensaje = ''

                        cy.wait(500)
                        cy.get('body').then(($body) => {
                            const $snack = $body.find('span.message-snack')
                            if ($snack.length) mensaje = $snack.text().trim()
                        }).then(() => {
                            if (status === 200 || status === 201) {
                                estado = 'exitosa'
                                cy.log('Denominación insertada correctamente')
                            } else {
                                estado = 'fallida'
                                cy.log(`Error detectado. Status: ${status}`)
                            }
                        }).then(() => {
                            const nombreCaptura = `Captura-${numero}-Formato > Detalle de Formato-${estado}`
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '015.1 - Detalle de Formato',
                                    crud: "Detalle de Formato",
                                    descripcion: `Código: ${codigoFormato} - Correlativo: ${registro.correlativo} - Descripción: ${registro.descripcion}`,
                                    estado: estado,
                                    numero: numero,
                                    mensaje: mensaje,
                                    evidencia: `${nombreCaptura}.png`
                                })
                            })
                        }).then(() => {
                            // Cerrar el modal si aún está abierto
                            cy.get('body').then(($body) => {
                                const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0
                                if (modalAbierto) {
                                    cy.log('Modal sigue abierto → cerrando manualmente')
                                    Generales.BtnCancelarRegistro()
                                    cy.wait(2000)
                                    cy.get('body').then(($bodyAfter) => {
                                        if ($bodyAfter.find('h2:contains("Nuevo Registro")').length > 0) {
                                            cy.log('⚠️ El modal no se cerró después de intentarlo, pero continuamos')
                                        } else {
                                            cy.log('Modal cerrado correctamente')
                                        }
                                    })
                                } else {
                                    cy.log('Modal ya cerrado')
                                }
                            })
                        })
                    })

                    // Opcional: Verificar que el modal de denominación se cerró completamente
                    cy.get('mat-dialog-container', { timeout: 10000 }).should('not.exist')
                }).then(() => {
                    cy.log('🔙 Regresando al nivel principal después de procesar todas las denominaciones de la moneda')

                    // Primer regreso - SALIR DEL SUBNIVEL (listado de denominaciones)
                    cy.wait(3000)
                    Generales.Regresar()
                    // Verificar que salimos del subnivel (modal cerrado)
                    cy.get('mat-dialog-container', { timeout: 5000 }).should('not.exist')

                    // Segundo regreso - SALIR DEL DETALLE DE MONEDA
                    cy.wait(3000)
                    Generales.Regresar()
                    // Verificar que estamos en el listado principal de monedas
                    cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 }).should('be.visible')
                })




            })
        })



    })

    describe.skip("016 -  Rutinas...", () =>{

        beforeEach(() => {
            Generales.IrAPantalla('routine')
        })

        it("Agregar múltiples registros en Crud de Rutinas", () => {
            cy.readFile('./JsonData/rutinas.json').then((dataRutinas) => {

                cy.wrap(dataRutinas.agregar).each((item, index) => {
                    cy.log(`\n ===== Insertando código: ${item.codigo} =====`);
                    const numero = index + 1;

                    // Asegurar estado limpio antes de comenzar
                    cy.get('body').then(($body) => {
                        if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                            cy.log('Formulario abierto detectado, cerrando...');
                            Generales.BtnCancelarRegistro();
                            cy.wait(500);
                        }
                    });

                    // Abrir formulario
                    Generales.BtnAgregarRegistro();

                    // Validar que el modal realmente abrió
                    cy.contains('h2', 'Nuevo Registro', { timeout: 10000 }).should('be.visible');

                    // Llenar datos
                    Rutinas.Rutinas(
                        item.codigo,
                        item.nombre,
                        item.nombreRecurso,
                        item.endpointRutinaRutaComponenteAngular,
                        item.tipoRutina,
                        item.capaEjecucion,
                        item.descripcion,
                        item.parametros,
                        item.tipoOperacion,
                        item.esLogin,
                        item.formatoEnvio,
                        item.formatoRecibido,
                        item.expresion1,
                        item.operacion,
                        item.expresion2,
                        item.tipoExpresion,
                        item.endpointRutinaSecundario,
                        item.enviarListaRecursos,
                        item.ofline,
                        item.online,
                        item.noGuardarLOG
                    );

                    // Intercept backend
                    const alias = `guardar-${numero}`;
                    cy.intercept('POST', '**/routine').as(alias);

                    // Hacer clic en Aceptar
                    Generales.BtnAceptarRegistro();

                        // Esperar respuesta y decidir estado
                        cy.wait(`@${alias}`).then((interception) => {
                            const status = interception.response.statusCode;
                            let estado = 'fallida';
                            let mensaje = '';

                            cy.wait(500);
                            cy.get('body').then(($body) => {
                                const $snack = $body.find('span.message-snack');
                                if ($snack.length) mensaje = $snack.text().trim();
                            }).then(() => {
                                if (status === 200 || status === 201) {
                                    estado = 'exitosa';
                                    cy.log('Registro insertado correctamente');
                                } else {
                                    estado = 'fallida';
                                    cy.log(`Error detectado. Status: ${status}`);
                                }
                            }).then(() => {
                                const nombreCaptura = `Captura-${numero}-Rutinas-${estado}`;
                                cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                    cy.task('guardarResultado', {
                                        describe: '016 - Rutinas',
                                        crud: "Rutinas",
                                        descripcion: `Código: ${item.codigo} - Nombre: ${item.nombre}`,
                                        estado: estado,
                                        numero: numero,
                                        mensaje: mensaje,
                                        evidencia: `${nombreCaptura}.png`
                                    });
                                });
                            }).then(() => {
                                cy.get('body').then(($body) => {
                                    const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                                    if (modalAbierto) {
                                        cy.log('Modal sigue abierto → cerrando manualmente');
                                        Generales.BtnCancelarRegistro();
                                        cy.wait(2000);
                                        cy.get('body').then(($bodyAfter) => {
                                            if ($bodyAfter.find('h2:contains("Nuevo Registro")').length > 0) {
                                                cy.log('⚠️ El modal no se cerró después de intentarlo, pero continuamos');
                                            } else {
                                                cy.log('Modal cerrado correctamente');
                                            }
                                        });
                                    } else {
                                        cy.log('Modal ya cerrado');
                                    }
                                });
                            });
                        });

                }
                );


            });
        });

    })

   describe.skip("017 -  Totales de Cajero...", () =>{


        beforeEach(() => {
            Generales.IrAPantalla('totalCashier')
        })

        it("Agregar múltiples registros en crud Totales de cajero", () => {
            cy.readFile('./JsonData/totalesDeCajero.json').then((dataTotalesDeCajero) => {
                cy.wrap(dataTotalesDeCajero.agregar).each((item, index) => {
                    cy.log(`Insertando código: ${item.codigo}`)
                    const numero = index + 1;

                    //Asegurar estado limpio antes de comenzar
                    cy.get('body').then(($body) => {
                        if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                            cy.log('Formulario abierto detectado, cerrando...')
                            Generales.BtnCancelarRegistro()
                        }
                    })

                    //Abrir formulario
                    Generales.BtnAgregarRegistroSubnivel()

                    //Validar que el modal realmente abrió
                    cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                        .should('be.visible')
                    // Llenar datos
                    TotalesCajero.TotalesCajero(
                        item.codigo,
                        item.arbolRaiz,
                        item.nombre,
                        item.nombreCorto,
                        item.descripcion,
                        item.validaMontos,
                        item.minimoRequiereAutorizacion,
                        item.maximoRequiereAutorizacion,
                        item.correlativoImpreso,
                        item.enviarHost,
                        item.cicloVida,
                        item.validoDesde,
                        item.validoHasta,
                        item.totalMonitoreado,
                        item.rutinaCalculamontoConciliar,
                        item.rutinacalculaMontoConciliado,
                        item.esControlEfectivo,
                    )

                    //Intercept backend
                    const alias = `guardar-${numero}`;
                    cy.intercept('POST', '**/totalCashier').as(alias);

                    Generales.BtnAceptarRegistro()

                    // Esperar respuesta y decidir estado
                    cy.wait(`@${alias}`).then((interception) => {
                        const status = interception.response.statusCode;
                        let estado = 'fallida';
                        let mensaje = '';

                        cy.wait(500);
                        cy.get('body').then(($body) => {
                            const $snack = $body.find('span.message-snack');
                            if ($snack.length) mensaje = $snack.text().trim();
                        }).then(() => {
                            if (status === 200 || status === 201) {
                                estado = 'exitosa';
                                cy.log('Registro insertado correctamente');
                            } else {
                                estado = 'fallida';
                                cy.log(`Error detectado. Status: ${status}`);
                            }
                        }).then(() => {
                            const nombreCaptura = `Captura-${numero}-Totales de cajero-${estado}`;
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '017 - Totales de cajero',
                                    crud: "Totales de cajero",
                                    descripcion: `Código: ${item.codigo} - Nombre: ${item.nombre}`,
                                    estado: estado,
                                    numero: numero,
                                    mensaje: mensaje,
                                    evidencia: `${nombreCaptura}.png`
                                });
                            });
                        }).then(() => {
                            cy.get('body').then(($body) => {
                                const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                                if (modalAbierto) {
                                    cy.log('Modal sigue abierto → cerrando manualmente');
                                    Generales.BtnCancelarRegistro();
                                    cy.wait(2000);
                                    cy.get('body').then(($bodyAfter) => {
                                        if ($bodyAfter.find('h2:contains("Nuevo Registro")').length > 0) {
                                            cy.log('⚠️ El modal no se cerró después de intentarlo, pero continuamos');
                                        } else {
                                            cy.log('Modal cerrado correctamente');
                                        }
                                    });
                                } else {
                                    cy.log('Modal ya cerrado');
                                }
                            });
                        });
                    });


                })
            })
        })

    })

    describe.skip("017.1 -  Totales de Cajero > Totales a cuadrar...", () =>{

        beforeEach(() => {
            Generales.IrAPantalla('totalCashier')
            cy.readFile('./JsonData/totalesACuadrar.json').as('dataTotalesACuadrar')
        })

        it("Agregar registros a sub nivel Totales A cuadrar", function () {

            const datos = this.dataTotalesACuadrar.agregar

            const agrupadas = datos.reduce((acc, item) => {
                if (!acc[item.codigoTotCaj]) {
                    acc[item.codigoTotCaj] = []
                }
                acc[item.codigoTotCaj].push(item)
                return acc
            }, {})

            cy.wrap(Object.keys(agrupadas)).each((codigoTotCaj, index) => {
                cy.log('Procesando Regla con nombre: ' + codigoTotCaj)
                const numero = index + 1;

                // Buscar Formato
                Generales.BuscarRegistroCodigo(codigoTotCaj)
                Generales.NavegacionSubMenu('Totales a Cuadrar')

                return cy.wrap(agrupadas[codigoTotCaj]).each((registro) => {

                    cy.get('body').then(($body) => {
                        if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                            cy.log('Formulario abierto detectado, cerrando...')
                            Generales.BtnCancelarRegistro()
                        }
                    })

                    Generales.BtnAgregarRegistroSubnivel()

                    cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                        .should('be.visible')

                    TotalesACuadrar.TotalesCuadra(
                        registro.tipoCajero,
                        registro.cuadraEfectivo
                    )

                    const alias = `guardar-${numero}`
                    cy.intercept('POST', '**/totalsToSquare').as(alias)

                    Generales.BtnAceptarRegistro();

                    cy.wait(`@${alias}`).then((interception) => {
                        const status = interception.response.statusCode
                        let estado = 'fallida'
                        let mensaje = ''

                        cy.wait(500)
                        cy.get('body').then(($body) => {
                            const $snack = $body.find('span.message-snack')
                            if ($snack.length) mensaje = $snack.text().trim()
                        }).then(() => {
                            if (status === 200 || status === 201) {
                                estado = 'exitosa'
                                cy.log('Denominación insertada correctamente')
                            } else {
                                estado = 'fallida'
                                cy.log(`Error detectado. Status: ${status}`)
                            }
                        }).then(() => {
                            const nombreCaptura = `Captura-${numero}-Totales de cajero > Totales a Cuadrar-${estado}`
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '004.1 - Totales a Cuadrar',
                                    crud: "Totales a Cuadrar",
                                    descripcion: `Código: ${codigoTotCaj} - Tipo de cajero: ${registro.tipoCajero} - Cuadra Efectivo: ${registro.cuadraEfectivo}`,
                                    estado: estado,
                                    numero: numero,
                                    mensaje: mensaje,
                                    evidencia: `${nombreCaptura}.png`
                                })
                            })
                        }).then(() => {
                            // Cerrar el modal si aún está abierto
                            cy.get('body').then(($body) => {
                                const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0
                                if (modalAbierto) {
                                    cy.log('Modal sigue abierto → cerrando manualmente')
                                    Generales.BtnCancelarRegistro()
                                    cy.wait(2000)
                                    cy.get('body').then(($bodyAfter) => {
                                        if ($bodyAfter.find('h2:contains("Nuevo Registro")').length > 0) {
                                            cy.log('El modal no se cerró después de intentarlo, pero continuamos')
                                        } else {
                                            cy.log('Modal cerrado correctamente')
                                        }
                                    })
                                } else {
                                    cy.log('Modal ya cerrado')
                                }
                            })
                        })
                    })

                    // Opcional: Verificar que el modal de denominación se cerró completamente
                    cy.get('mat-dialog-container', { timeout: 10000 }).should('not.exist')
                }).then(() => {
                    cy.log('Regresando al nivel principal después de procesar todas las denominaciones de la moneda')

                    // Primer regreso - SALIR DEL SUBNIVEL (listado de denominaciones)
                    cy.wait(3000)
                    Generales.Regresar()
                    // Verificar que salimos del subnivel (modal cerrado)
                    cy.get('mat-dialog-container', { timeout: 5000 }).should('not.exist')

                    // Segundo regreso - SALIR DEL DETALLE DE MONEDA
                    cy.wait(3000)
                    Generales.Regresar()
                    // Verificar que estamos en el listado principal de monedas
                    cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 }).should('be.visible')
                })


            })
        })



    })

    describe.skip("017.2 -   Totales de Cajero > Minimos y Maximos...", () =>{

        beforeEach(() => {
            Generales.IrAPantalla('totalCashier')
            cy.readFile('./JsonData/minimosYmaximos.json').as('dataDinimosYmaximos')

        })

        it("Agregar registros a sub nivel Totales de Cajero > Minimos y Maximos", function () {

            const datos = this.dataDinimosYmaximos.agregar

            const agrupadas = datos.reduce((acc, item) => {
                if (!acc[item.codigoTotCaj]) {
                    acc[item.codigoTotCaj] = []
                }
                acc[item.codigoTotCaj].push(item)
                return acc
            }, {})

            let numero = 0

            cy.wrap(Object.keys(agrupadas)).each((codigoTotCaj) => {
                cy.log('Procesando Regla con nombre: ' + codigoTotCaj)


                Generales.BuscarRegistroCodigo(codigoTotCaj)
                Generales.NavegacionSubMenu('Mínimos y Máximos')

                return cy.wrap(agrupadas[codigoTotCaj]).each((registro) => {

                    numero++

                    Generales.BtnAgregarRegistroSubnivel()
                    cy.wait(1000)
                    MinimosMaximos.MinimosMaximos(
                        registro.tipoRama,
                        registro.tipoCajero,
                        registro.moneda,
                        registro.minimoCajero,
                        registro.maximoCajero,
                        registro.minimoTipoRama,
                        registro.maximoTipoRama,
                    )

                    const alias = `guardar-${numero}`
                    cy.intercept('POST', '**/minMaxTypeTreebranch').as(alias)

                    Generales.BtnAceptarRegistro();


                    cy.wait(`@${alias}`).then((interception) => {
                        const status = interception.response.statusCode
                        let estado = 'fallida'
                        let mensaje = ''

                        cy.wait(500)
                        cy.get('body').then(($body) => {
                            const $snack = $body.find('span.message-snack')
                            if ($snack.length) mensaje = $snack.text().trim()
                        }).then(() => {
                            if (status === 200 || status === 201) {
                                estado = 'exitosa'
                                cy.log('Denominación insertada correctamente')
                            } else {
                                estado = 'fallida'
                                cy.log(`Error detectado. Status: ${status}`)
                            }
                        }).then(() => {
                            const nombreCaptura = `Captura-${numero}-Totales de cajero > Mínimos y Máximos-${estado}`
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '017.2 - Mínimos y Máximos',
                                    crud: "Mínimos y Máximos",
                                    descripcion: `Código: ${codigoTotCaj} - Moneda: ${registro.moneda} - Tipo de Rama: ${registro.tipoRama} - Tipo de cajero: ${registro.tipoCajero}`,
                                    estado: estado,
                                    numero: numero,
                                    mensaje: mensaje,
                                    evidencia: `${nombreCaptura}.png`
                                })
                            })
                        }).then(() => {
                            // Cerrar el modal si aún está abierto
                            cy.get('body').then(($body) => {
                                const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0
                                if (modalAbierto) {
                                    cy.log('Modal sigue abierto → cerrando manualmente')
                                    Generales.BtnCancelarRegistro()
                                    cy.wait(2000)
                                    cy.get('body').then(($bodyAfter) => {
                                        if ($bodyAfter.find('h2:contains("Nuevo Registro")').length > 0) {
                                            cy.log('El modal no se cerró después de intentarlo, pero continuamos')
                                        } else {
                                            cy.log('Modal cerrado correctamente')
                                        }
                                    })
                                } else {
                                    cy.log('Modal ya cerrado')
                                }
                            })
                        })
                    })

                    // Opcional: Verificar que el modal de denominación se cerró completamente
                    cy.get('mat-dialog-container', { timeout: 10000 }).should('not.exist')
                }).then(() => {
                    cy.log('Regresando al nivel principal después de procesar todas las denominaciones de la moneda')

                    // Primer regreso - SALIR DEL SUBNIVEL (listado de denominaciones)
                    cy.wait(3000)
                    Generales.Regresar()
                    // Verificar que salimos del subnivel (modal cerrado)
                    cy.get('mat-dialog-container', { timeout: 5000 }).should('not.exist')

                    // Segundo regreso - SALIR DEL DETALLE DE MONEDA
                    cy.wait(3000)
                    Generales.Regresar()
                    // Verificar que estamos en el listado principal de monedas
                    cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 }).should('be.visible')
                })





            })
        })




    })

    describe.skip("018 -  Plantilla de comprobantes...", () =>{

        beforeEach(() => {
            Generales.IrAPantalla('voucherTemplate')
        })

        it("Agregar múltiples registros en crud plantilla de comprobante", () => {
            cy.readFile('./JsonData/plantillasDeComprobante.json').then((dataPlantillasDeComprobante) => {

                cy.wrap(dataPlantillasDeComprobante.agregar).each((item, index) => {
                    cy.log(`\n🔵 Insertando key: ${item.key}`);
                    const numero = index + 1;

                    // Limpiar estado
                    cy.get('body').then(($body) => {
                        if ($body.find('h2:contains("Nuevo registro")').length > 0) {
                            Generales.BtnCancelarRegistro();
                        }
                        if ($body.find('h2:contains("Comprobante desde automatizacion")').length > 0) {
                            cy.get('button.back').first().click({ force: true });
                        }
                    });

                    // Abrir y llenar
                    Generales.BtnAgregarRegistro();
                    cy.contains('h2', 'Nuevo registro', { timeout: 10000 }).should('be.visible');

                    PlantillaComprobante.PlantillasComprobantes(
                        item.key,
                        item.nombre,
                        item.descripcion,
                        item.archivo
                    );
                    const alias = `guardar-${numero}`;
                    cy.intercept('POST', '**/report').as(alias);

                    // Guardar
                    Generales.BtnAceptarRegistro();

                    // Esperar respuesta y decidir estado
                    cy.wait(`@${alias}`).then((interception) => {
                        const status = interception.response.statusCode;
                        let estado = 'fallida';
                        let mensaje = '';

                        cy.wait(500);
                        cy.get('body').then(($body) => {
                            const $snack = $body.find('span.message-snack');
                            if ($snack.length) mensaje = $snack.text().trim();
                        }).then(() => {
                            if (status === 200 || status === 201) {
                                estado = 'exitosa';
                                cy.log('Registro insertado correctamente');
                            } else {
                                estado = 'fallida';
                                cy.log(`Error detectado. Status: ${status}`);
                            }
                        }).then(() => {
                            const nombreCaptura = `Captura-${numero}-Plantillas de Comprobantes-${estado}`;
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '00x - Plantillas de Comprobantes',
                                    crud: "Plantillas de Comprobantes",
                                    descripcion: `Key: ${item.key} - Nombre: ${item.nombre}`,
                                    estado: estado,
                                    numero: numero,
                                    mensaje: mensaje,
                                    evidencia: `${nombreCaptura}.png`
                                });
                            });
                        }).then(() => {
                            cy.get('body').then(($body) => {
                                const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                                if (modalAbierto) {
                                    cy.log('Modal sigue abierto → cerrando manualmente');
                                    Generales.BtnCancelarRegistro();
                                    cy.wait(2000);
                                    cy.get('body').then(($bodyAfter) => {
                                        if ($bodyAfter.find('h2:contains("Nuevo Registro")').length > 0) {
                                            cy.log('⚠️ El modal no se cerró después de intentarlo, pero continuamos');
                                        } else {
                                            cy.log('Modal cerrado correctamente');
                                        }
                                    });
                                } else {
                                    cy.log('Modal ya cerrado');
                                }
                            });
                        });
                    });

                })



            });
        });

    })

   describe.skip("019 -  Gestor de Transacciones ...", () =>{

        beforeEach(() => {
            Generales.IrAPantalla('transactionManager')
        })

        it("Agregar múltiples registros en crud Gestor de transacciones", () => {


            cy.readFile('./JsonData/gestorTransaccion.json').then((data) => {
                cy.wrap(data.agregar).each((item, index) => {
                    const numero = index + 1;
                    cy.then(() => {
                        const doc = window.top.document;
                        // Intentamos con varios selectores que usa Cypress para su log
                        const logContainer = doc.querySelector('.reporter .commands') ||
                            doc.querySelector('.command-list') ||
                            doc.querySelector('.runnable-commands-region');

                        if (logContainer) {
                            logContainer.innerHTML = '';
                        }
                    });
                    cy.log(`Insertando código: ${item.codigo}`)


                    cy.get('iframe.frame', { timeout: 10000 })
                        .its('0.contentDocument.body')
                        .should('not.be.empty')
                        .then(cy.wrap)
                        .within(() => {

                            //Abrir formulario
                            Generales.BtnIframe('Agregar', { timeout: 10000, force: true, skipContext: true });
                            // //Validar que el modal realmente abrió
                            // cy.contains('h2', 'Nuevo Registro', { timeout: 10000, force: true})
                            //     .should('be.visible')

                            // Llenar datos
                            GestorDeTransaccion.GestorTransacciones(

                                item.tipo, item.codigo, item.codAlternativo, item.nombre, item.etiqueta, item.estado, item.validoDesde, item.validoHasta, item.tipoMovimientoBoveda,
                                item.descripcion, item.esconderMenu, item.permiteReversion, item.modoOffline, item.requiereSupervisor, item.requiereValidarAcceso, item.seEnviaHost,
                                item.tiempoEspera, item.accionPorDemora, item.tienePagoServicio, item.PagoServicio, item.pasoConfirmacionServicio, item.permiteReimpresion,
                                item.diasPermitidoReimpresion, item.presentarResumen, item.mensajeResumen, item.tipoMensaje, item.icono, item.DepartamentodeAutorizacion, item.textoAyuda, item.logo

                            )
                            // Normalizar el tipo para comparación (opcional)
                            const tipoNormalizado = item.tipo?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

                            //Intercept backend
                            const alias = `guardar-${numero}`;
                            cy.intercept('POST', '**/transactionSpec').as(alias);


                            Generales.BtnIframe('Aceptar', { timeout: 10000, force: true, skipContext: true });

                            /*cy.wait('@guardar').then((interception) => {
                                const status = interception.response.statusCode
                                if (status === 200 || status === 201) {
                                    cy.log('Registro insertado correctamente')
                                    // Esperar que el modal desaparezca
                                    Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true })
                                    cy.wait(2000)
                                    if (tipoNormalizado === "administrativas") {
                                        cy.log('✅ Es tipo ADMINISTRATIVAS, ejecutando acción especial');
                                        Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true })
                                    } else {
                                        cy.log('➡️ No es ADMINISTRATIVAS, continuando con flujo normal');
                                        Generales.BtnIframe('Sí', { timeout: 10000, force: true, skipContext: true });
                                        Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true })
                                    }
                                } else {
                                    cy.log(`Error detectado. Status: ${status}`)
                                    Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true })
                                    cy.contains('h2', 'Nuevo Registro').should('not.exist')
                                }
                            })*/

                            //casi funciona
                            /*cy.wait(`@${alias}`).then((interception) => {
                                const status = interception.response.statusCode;
                                let estado = 'fallida';
                                let mensaje = '';

                                // Capturar mensaje del snackbar usando el documento principal
                                cy.wait(500);
                                cy.document().then((doc) => {
                                    if (doc && doc.body) {
                                        const $body = Cypress.$(doc.body);
                                        const $snack = $body.find('.snackbar');
                                        if ($snack.length) mensaje = $snack.text().trim();
                                    } else {
                                        mensaje = 'No se pudo acceder al body del documento';
                                    }
                                }).then(() => {
                                    if (status === 200 || status === 201) {
                                        estado = 'exitosa';
                                        cy.log('Registro insertado correctamente');

                                        // --- Lógica original de éxito (con iframe y condicional) ---
                                        Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true });
                                        cy.wait(2000);
                                        if (tipoNormalizado === "administrativas") {
                                            cy.log('✅ Es tipo ADMINISTRATIVAS, ejecutando acción especial');
                                            Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true });
                                        } else {
                                            cy.log('➡️ No es ADMINISTRATIVAS, continuando con flujo normal');
                                            Generales.BtnIframe('Sí', { timeout: 10000, force: true, skipContext: true });
                                            Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true });
                                        }
                                    } else {
                                        estado = 'fallida';
                                        cy.log(`Error detectado. Status: ${status}`);

                                        // --- Lógica original de error ---
                                        Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true });
                                        cy.contains('h2', 'Nuevo Registro').should('not.exist');
                                    }
                                }).then(() => {
                                    // --- Captura de pantalla y guardado en reporte ---
                                    const nombreCaptura = `Captura-${numero}-Gestor de transacciones-${estado}`;
                                    cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                        cy.task('guardarResultado', {
                                            describe: '019 - Gestor de transacciones',
                                            crud: "Gestor de transacciones",
                                            descripcion: `Código: ${item.codigo} - Nombre: ${item.nombre}`,
                                            estado: estado,
                                            numero: numero,
                                            mensaje: mensaje,
                                            evidencia: `${nombreCaptura}.png`
                                        });
                                    });
                                }).then(() => {
                                    // (Opcional) Verificar que el modal se cerró, si es necesario
                                    cy.document().then((doc) => {
                                        if (doc && doc.body) {
                                            const $body = Cypress.$(doc.body);
                                            const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                                            if (modalAbierto) {
                                                cy.log('Modal sigue abierto → cerrando manualmente');
                                                Generales.BtnCancelarRegistro();
                                                cy.wait(2000);
                                                cy.document().then((doc2) => {
                                                    if (doc2 && doc2.body) {
                                                        const $bodyAfter = Cypress.$(doc2.body);
                                                        if ($bodyAfter.find('h2:contains("Nuevo Registro")').length > 0) {
                                                            cy.log('⚠️ El modal no se cerró, pero continuamos');
                                                        } else {
                                                            cy.log('Modal cerrado correctamente');
                                                        }
                                                    }
                                                });
                                            } else {
                                                cy.log('Modal ya cerrado');
                                            }
                                        }
                                    });
                                });
                            });*/

                            cy.wait(`@${alias}`).then((interception) => {
                                const status = interception.response.statusCode;
                                let estado = 'fallida';
                                let mensaje = '';

                                // -----------------------------------------------------------------
                                // 1. Capturar mensaje de error de validación si la petición no se envió
                                // -----------------------------------------------------------------
                                // Si la petición no se envió (timeout), intentamos capturar el error en el modal
                                if (!interception) {
                                    cy.log('⚠️ No se recibió respuesta del servidor. Buscando mensaje de validación en el modal...');
                                    cy.get('body', { timeout: 3000 }).then(($body) => {
                                        // Buscar mensajes de error dentro del modal (pueden estar en .mat-error o divs con clases)
                                        const $error = $body.find('.mat-error, .error-message, .alert-danger, .toast-error');
                                        if ($error.length) {
                                            mensaje = $error.first().text().trim();
                                            cy.log(`📢 Mensaje de validación: "${mensaje}"`);
                                        } else {
                                            // También puede ser un texto plano dentro del modal
                                            const $textError = $body.find('h2:contains("Nuevo Registro")').parents('form').find('div:contains("seleccionado")');
                                            if ($textError.length) {
                                                mensaje = $textError.first().text().trim();
                                            } else {
                                                mensaje = 'Error desconocido: formulario inválido';
                                            }
                                        }
                                        // Cerrar el modal manualmente
                                        Generales.BtnCancelarRegistro();
                                        cy.contains('h2', 'Nuevo Registro').should('not.exist');
                                    }).then(() => {
                                        // Guardar resultado fallido
                                        const nombreCaptura = `Captura-${numero}-Gestor de transacciones-fallida`;
                                        cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                            cy.task('guardarResultado', {
                                                describe: '019 - Gestor de transacciones',
                                                crud: "Gestor de transacciones",
                                                descripcion: `Código: ${item.codigo} - Nombre: ${item.nombre}`,
                                                estado: 'fallida',
                                                numero: numero,
                                                mensaje: mensaje,
                                                evidencia: `${nombreCaptura}.png`
                                            });
                                        });
                                    });
                                    return; // Salir del bloque, no continuar con el flujo de éxito
                                }

                                // -----------------------------------------------------------------
                                // 2. Si la petición se envió, capturar snackbar (si existe)
                                // -----------------------------------------------------------------
                                cy.wait(500);
                                cy.document().then((doc) => {
                                    if (doc && doc.body) {
                                        const $body = Cypress.$(doc.body);
                                        const $snack = $body.find('.snackbar, .mat-mdc-snack-bar-label');
                                        if ($snack.length) {
                                            mensaje = $snack.text().trim();
                                            cy.log(`📢 Snackbar: "${mensaje}"`);
                                        }
                                    }
                                }).then(() => {
                                    // Lógica de éxito/error con iframes
                                    if (status === 200 || status === 201) {
                                        estado = 'exitosa';
                                        cy.log('Registro insertado correctamente');
                                        Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true });
                                        cy.wait(2000);
                                        if (tipoNormalizado === "administrativas") {
                                            cy.log('✅ Es tipo ADMINISTRATIVAS, ejecutando acción especial');
                                            Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true });
                                        } else {
                                            cy.log('➡️ No es ADMINISTRATIVAS, continuando con flujo normal');
                                            Generales.BtnIframe('Sí', { timeout: 10000, force: true, skipContext: true });
                                            Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true });
                                        }
                                    } else {
                                        estado = 'fallida';
                                        cy.log(`Error detectado. Status: ${status}`);
                                        Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true });
                                        cy.contains('h2', 'Nuevo Registro').should('not.exist');
                                    }
                                }).then(() => {
                                    // Captura de pantalla y guardado en reporte
                                    const nombreCaptura = `Captura-${numero}-Gestor de transacciones-${estado}`;
                                    cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                        cy.task('guardarResultado', {
                                            describe: '019 - Gestor de transacciones',
                                            crud: "Gestor de transacciones",
                                            descripcion: `Código: ${item.codigo} - Nombre: ${item.nombre}`,
                                            estado: estado,
                                            numero: numero,
                                            mensaje: mensaje,
                                            evidencia: `${nombreCaptura}.png`
                                        });
                                    });
                                });
                            });




                        })

                })
            })
        })

    })

   describe.skip("019.1 -  Gestor de Transacciones > Caracteristicas de la transaccione ...", () =>{


        beforeEach(() => {
            Generales.IrAPantalla('transactionManager')
            cy.readFile('./JsonData/caracteristicasTrx.json').as('dataCaracteristicasTrx')
        })

        /*it("Agregar multiples registros a sub nivel Transacciones > Caracteristicas de la transaccione", function () {
            const datos = this.dataCaracteristicasTrx.agregar;

            // Agrupar manteniendo el orden del JSON original
            const agrupadas = {};
            const ordenCodigos = [];

            datos.forEach(item => {
                if (!agrupadas[item.codigoTRX]) {
                    agrupadas[item.codigoTRX] = [];
                    ordenCodigos.push(item.codigoTRX);
                }
                agrupadas[item.codigoTRX].push(item);
            });

            cy.get('iframe.frame', { timeout: 10000 })
                .its('0.contentDocument.body')
                .should('not.be.empty')
                .then(cy.wrap)
                .within(() => {

                    cy.wrap(ordenCodigos).each((codigoTRX) => {
                        cy.log(`\n🔄 Procesando transacción con código: ${codigoTRX}`);

                        // PASO 1: Filtrar por código
                        Generales.filtrarPorCodigo(codigoTRX);

                        // PASO 2: Verificar que se encontró el registro
                        cy.contains('td.mat-column-codeOfTheTransaction', codigoTRX, { timeout: 10000 })
                            .should('be.visible')
                            .then(() => {
                                cy.log(`✅ Registro ${codigoTRX} encontrado y seleccionado`);
                            });

                        // PASO 3: Abrir panel Opciones
                        cy.xpath("//mat-expansion-panel-header[.//h2[normalize-space()='Opciones']]")
                            .then($header => {
                                if ($header.attr('aria-expanded') !== 'true') {
                                    cy.wrap($header).click({ force: true });
                                    cy.wait(500);
                                }
                            });

                        // PASO 4: Procesar características
                        return cy.wrap(agrupadas[codigoTRX]).each((registro, index) => {
                            GestorDeTransaccion.CaracteristicasTrx(registro.caracteristicasTrx);
                        }).then(() => {

                            //PRIMER ATRÁS - Salir del detalle de características
                            cy.wait(2000);
                            Generales.BtnIframe("Atrás", { timeout: 10000, force: true, skipContext: true });

                            // VERIFICAR DIÁLOGO DE CONFIRMACIÓN
                            cy.wait(1000);
                            cy.get('mat-dialog-container', { timeout: 5000 }).then($dialog => {
                                if ($dialog.length > 0) {
                                    cy.xpath("//mat-dialog-actions//button[.//mat-icon[text()='check']]")
                                        .click({ force: true });
                                    cy.wait(1000);
                                }
                            });

                            // Verificación 1: Panel Filtros (siempre visible en listado principal)
                            cy.get('mat-expansion-panel-header').contains('Filtros', { timeout: 15000 })
                                .should('be.visible');
                            // Verificación 2: Tabla (siempre visible en listado principal)
                            cy.get('table', { timeout: 10000 }).should('be.visible');

                            // Verificación 3: "Buscar por" (opcional, no obligatorio)
                            cy.document().then($document => {
                                const $body = Cypress.$($document).find('body');
                                const $span = $body.find('span.mat-button-wrapper:contains("Buscar por")');

                                if ($span.length > 0) {
                                } else {
                                    cy.log('Elemento "Buscar por" no encontrado (no es obligatorio)');
                                }
                            });
                        });
                    });
                });
        });*/

       it("Agregar multiples registros a sub nivel Transacciones > Caracteristicas de la transaccione", function () {
           const datos = this.dataCaracteristicasTrx.agregar;

           // Agrupar manteniendo el orden del JSON original
           const agrupadas = {};
           const ordenCodigos = [];

           datos.forEach(item => {
               if (!agrupadas[item.codigoTRX]) {
                   agrupadas[item.codigoTRX] = [];
                   ordenCodigos.push(item.codigoTRX);
               }
               agrupadas[item.codigoTRX].push(item);
           });

           let numero = 0;

           cy.get('iframe.frame', { timeout: 10000 })
               .its('0.contentDocument.body')
               .should('not.be.empty')
               .then(cy.wrap)
               .within(() => {
                   cy.wrap(ordenCodigos).each((codigoTRX) => {
                       cy.log(`\n🔄 Procesando transacción con código: ${codigoTRX}`);

                       // PASO 1: Filtrar por código
                       Generales.filtrarPorCodigo(codigoTRX);

                       // PASO 2: Verificar que se encontró el registro
                       cy.contains('td.mat-column-codeOfTheTransaction', codigoTRX, { timeout: 10000 })
                           .should('be.visible')
                           .then(() => {
                               cy.log(`✅ Registro ${codigoTRX} encontrado y seleccionado`);
                           });

                       // PASO 3: Abrir panel Opciones
                       cy.xpath("//mat-expansion-panel-header[.//h2[normalize-space()='Opciones']]")
                           .then($header => {
                               if ($header.attr('aria-expanded') !== 'true') {
                                   cy.wrap($header).click({ force: true });
                                   cy.wait(500);
                               }
                           });

                       // PASO 4: Procesar características con reporte
                       return cy.wrap(agrupadas[codigoTRX]).each((registro, index) => {
                           numero++;
                           const alias = `guardarCaracteristica-${numero}`;

                           // Interceptar la petición POST que hace CaracteristicasTrx
                           cy.intercept('POST', '**/transactionCharacteristicSpec').as(alias);

                           // Llamar al método que llena y envía el formulario
                           GestorDeTransaccion.CaracteristicasTrx(registro.caracteristicasTrx);

                           // Esperar la respuesta y procesar reporte
                           cy.wait(`@${alias}`, { timeout: 10000 }).then((interception) => {
                               const status = interception.response.statusCode;
                               let estado = 'fallida';
                               let mensaje = '';

                               // Capturar snackbar (usando documento principal para evitar contexto)
                               cy.wait(500);
                               cy.document().then((doc) => {
                                   if (doc && doc.body) {
                                       const $body = Cypress.$(doc.body);
                                       const $snack = $body.find('.snackbar, .mat-mdc-snack-bar-label');
                                       if ($snack.length) mensaje = $snack.text().trim();
                                   }
                               }).then(() => {
                                   if (status === 200 || status === 201) {
                                       estado = 'exitosa';
                                       cy.log(`✅ Característica insertada correctamente: ${registro.caracteristicasTrx}`);
                                   } else {
                                       estado = 'fallida';
                                       cy.log(`❌ Error al insertar característica. Status: ${status}`);
                                   }
                               }).then(() => {
                                   // Captura de pantalla y guardado en reporte
                                   const nombreCaptura = `Captura-${numero}-Caracteristicas-${estado}`;
                                   cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                       cy.task('guardarResultado', {
                                           describe: '019.1 - Características de la transacción',
                                           crud: "Características",
                                           descripcion: `Transacción: ${codigoTRX} - Característica: ${registro.caracteristicasTrx}`,
                                           estado: estado,
                                           numero: numero,
                                           mensaje: mensaje,
                                           evidencia: `${nombreCaptura}.png`
                                       });
                                   });
                               });
                           });
                       }).then(() => {
                           // Después de procesar todas las características de esta transacción
                           cy.wait(2000);
                           Generales.BtnIframe("Atrás", { timeout: 10000, force: true, skipContext: true });

                           cy.wait(1000);
                           cy.get('mat-dialog-container', { timeout: 5000 }).then($dialog => {
                               if ($dialog.length > 0) {
                                   cy.xpath("//mat-dialog-actions//button[.//mat-icon[text()='check']]")
                                       .click({ force: true });
                                   cy.wait(1000);
                               }
                           });

                           cy.get('mat-expansion-panel-header').contains('Filtros', { timeout: 15000 })
                               .should('be.visible');
                           cy.get('table', { timeout: 10000 }).should('be.visible');

                           cy.document().then($document => {
                               const $body = Cypress.$($document).find('body');
                               const $span = $body.find('span.mat-button-wrapper:contains("Buscar por")');
                               if ($span.length === 0) {
                                   cy.log('Elemento "Buscar por" no encontrado (no es obligatorio)');
                               }
                           });
                       });
                   });
               });
       });



    })

   describe.skip("019.2 -  Gestor de Transacciones > Pasos de la transaccion ...", function() {

        beforeEach(function() {
            Generales.IrAPantalla('transactionManager');
            cy.readFile('./JsonData/creacionDePasosTRX.json').as('data')
            cy.wait(3000)
        });


        //este funciona sin reporte
        /*it("Agregar múltiples registros dinámicamente", function() {
            cy.log('Datos cargados:', JSON.stringify(this.data));

            // Agrupar los items por código de transacción
            const transacciones = this.data.agregar.reduce((acc, item) => {
                if (!acc[item.codigoTRX]) {
                    acc[item.codigoTRX] = [];
                }
                acc[item.codigoTRX].push(item);
                return acc;
            }, {});

            // Procesar cada transacción y TODOS sus pasos
            Object.entries(transacciones).forEach(([codigoTRX, pasos]) => {
                cy.then(() => {
                    // Limpiar logs de Cypress (opcional)
                    const doc = window.top.document;
                    const logContainer = doc.querySelector('.reporter .commands') ||
                        doc.querySelector('.command-list') ||
                        doc.querySelector('.runnable-commands-region');
                    if (logContainer) {
                        logContainer.innerHTML = '';
                    }
                });

                cy.log(`🔄 Procesando transacción: ${codigoTRX} (${pasos.length} pasos)`);

                // Entrar al iframe para procesar TODOS los pasos de esta transacción
                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        cy.wait(1500);

                        // Filtrar por el código de transacción actual
                        Generales.filtrarPorCodigo(codigoTRX);
                        Generales.abrirPanel("Opciones");

                        // Procesar TODOS los pasos de esta transacción SIN SALIR
                        pasos.forEach((paso, index) => {
                            cy.log(`📝 Paso ${index + 1}/${pasos.length}: ${paso.nombrePaso}`);

                            GestorDeTransaccion.definirPaso(
                                paso.nombrePaso,
                                paso.tieneReglaCondionanteDePaso,
                                paso.typeReglaParaCondicionarPaso,
                                paso.descripcionPasoTrx
                            );

                            // Pequeña pausa entre pasos si es necesario
                            cy.wait(500);
                        });

                        cy.log(`✅ Todos los ${pasos.length} pasos de ${codigoTRX} han sido creados`);
                    }); // Salimos del iframe SOLO después de crear TODOS los pasos

                // Esperamos un tiempo para que la operación se complete
                cy.wait(2000);

                // Volvemos a entrar al iframe para hacer clic en "Atrás"
                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true });
                    });

                // Espera a que el posible diálogo aparezca
                cy.wait(2000);


                // Verificar si aparece el diálogo de confirmación DENTRO del iframe
                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(($body) => {
                        // Buscar el diálogo por su TÍTULO "Confirmar"
                        const $dialog = Cypress.$('mat-dialog-container:contains("Confirmar")', $body);

                        if ($dialog.length > 0) {
                            cy.log('✅ Diálogo Confirmar detectado');

                            // DENTRO del diálogo, buscar el botón que tiene mat-icon con texto "check"
                            const $btnSi = Cypress.$('button mat-icon:contains("check")', $dialog).parents('button');

                            if ($btnSi.length > 0) {
                                cy.log('✅ Botón Sí encontrado dentro del diálogo, haciendo clic');
                                $btnSi.first().click();
                                cy.wait(1000);
                                cy.log('✅ Clic en Sí realizado');
                            } else {
                                cy.log('⚠️ No se encontró botón con icono check dentro del diálogo');
                            }
                        } else {
                            cy.log('ℹ️ No apareció diálogo de confirmación - continuando flujo normal');
                        }
                    });


            });
        });*/

       it("Agregar múltiples registros dinámicamente", function() {
           cy.log('Datos cargados:', JSON.stringify(this.data));

           const transacciones = this.data.agregar.reduce((acc, item) => {
               if (!acc[item.codigoTRX]) acc[item.codigoTRX] = [];
               acc[item.codigoTRX].push(item);
               return acc;
           }, {});

           let contadorPasos = 0;

           Object.entries(transacciones).forEach(([codigoTRX, pasos]) => {
               cy.then(() => {
                   // limpiar logs opcional
                   const doc = window.top.document;
                   const logContainer = doc.querySelector('.reporter .commands') ||
                       doc.querySelector('.command-list') ||
                       doc.querySelector('.runnable-commands-region');
                   if (logContainer) logContainer.innerHTML = '';
               });

               cy.log(`🔄 Procesando transacción: ${codigoTRX} (${pasos.length} pasos)`);

               cy.get('iframe.frame', { timeout: 10000 })
                   .its('0.contentDocument.body')
                   .should('not.be.empty')
                   .then(cy.wrap)
                   .within(() => {
                       cy.wait(1500);
                       Generales.filtrarPorCodigo(codigoTRX);
                       Generales.abrirPanel("Opciones");

                       pasos.forEach((paso, index) => {
                           cy.log(` Paso ${index + 1}/${pasos.length}: ${paso.nombrePaso}`);
                           contadorPasos++;
                           const alias = `guardarPaso-${contadorPasos}`;
                           cy.log(` Contador actual: ${contadorPasos}, alias: ${alias}`);

                           cy.intercept('POST', '**/transactionFlow').as(alias);

                           GestorDeTransaccion.definirPaso(
                               paso.nombrePaso,
                               paso.tieneReglaCondionanteDePaso,
                               paso.typeReglaParaCondicionarPaso,
                               paso.descripcionPasoTrx
                           );

                           cy.wait(`@${alias}`, { timeout: 10000 }).then((interception) => {
                               const status = interception.response.statusCode;
                               let estado = 'fallida';
                               let mensaje = '';

                               // Capturar mensaje desde el documento principal (fuera del iframe)
                               cy.wait(500);
                               cy.document().then((doc) => {
                                   const $body = Cypress.$(doc.body);
                                   const $snack = $body.find('.snackbar, .mat-mdc-snack-bar-label');
                                   if ($snack.length) mensaje = $snack.text().trim();
                               }).then(() => {
                                   if (status === 200 || status === 201) {
                                       estado = 'exitosa';
                                       cy.log(`✅ Paso insertado correctamente: ${paso.nombrePaso}`);
                                   } else {
                                       estado = 'fallida';
                                       cy.log(` Error al insertar paso. Status: ${status}`);
                                   }
                               }).then(() => {
                                   // Tomar captura de pantalla del viewport completo (desde el documento principal)
                                   cy.screenshot(`Captura-${contadorPasos}-Paso-${estado}`, { capture: 'viewport' }).then(() => {
                                       cy.task('guardarResultado', {
                                           describe: '019.2 - Pasos de la transacción',
                                           crud: "Paso de transacción",
                                           descripcion: `Transacción: ${codigoTRX} - Paso: ${paso.nombrePaso}`,
                                           estado: estado,
                                           numero: contadorPasos,
                                           mensaje: mensaje,
                                           evidencia: `Captura-${contadorPasos}-Paso-${estado}.png`
                                       });
                                   });
                               });
                           });

                           cy.wait(500);
                       });

                       cy.log(`Todos los ${pasos.length} pasos de ${codigoTRX} han sido creados`);
                   });

               cy.wait(2000);

               // Salir del detalle de pasos
               cy.get('iframe.frame', { timeout: 10000 })
                   .its('0.contentDocument.body')
                   .should('not.be.empty')
                   .then(cy.wrap)
                   .within(() => {
                       Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true });
                   });

               cy.wait(2000);

               // Manejar diálogo de confirmación si aparece
               cy.get('iframe.frame', { timeout: 10000 })
                   .its('0.contentDocument.body')
                   .should('not.be.empty')
                   .then(($body) => {
                       const $dialog = Cypress.$('mat-dialog-container:contains("Confirmar")', $body);
                       if ($dialog.length) {
                           cy.log(' Diálogo Confirmar detectado');
                           const $btnSi = Cypress.$('button mat-icon:contains("check")', $dialog).parents('button');
                           if ($btnSi.length) {
                               cy.log('Botón Sí encontrado, haciendo clic');
                               $btnSi.first().click();
                               cy.wait(1000);
                           }
                       } else {
                           cy.log('ℹ️ No apareció diálogo de confirmación');
                       }
                   });
           });
       });

    });

   describe.skip("019.3 -  Gestor de Transacciones > Asignar Caracteristicas de la transaccione a pasos ...", function() {

        beforeEach(function() {
            Generales.IrAPantalla('transactionManager');
            cy.readFile('./JsonData/asignacionDeCaracteristicas.json').as('data');

        });

            //Funciona sin reporte
        /*it("Agregar múltiples registros dinámicamente", function() {
            const datos = this.data.agregar;

            const agrupadas = datos.reduce((acc, item) => {
                if (!acc[item.codigoTX]) {
                    acc[item.codigoTX] = [];
                }
                acc[item.codigoTX].push(item);
                return acc;
            }, {});

            cy.wrap(Object.keys(agrupadas)).each((codigoTX) => {
                cy.log('Procesando Tx: ' + codigoTX);

                // Opcional: limpiar logs de Cypress
                cy.then(() => {
                    const doc = window.top.document;
                    const logContainer = doc.querySelector('.reporter .commands') ||
                        doc.querySelector('.command-list') ||
                        doc.querySelector('.runnable-commands-region');
                    if (logContainer) {
                        logContainer.innerHTML = '';
                    }
                });

                // Entrar al iframe y realizar acciones
                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        // Dentro del iframe: acciones de edición
                        Generales.filtrarPorCodigo(codigoTX);

                        // Variable para recordar el paso actualmente seleccionado
                        let pasoActual = null;

                        return cy.wrap(agrupadas[codigoTX]).each((item) => {
                            Generales.abrirPanel("Opciones", { timeout: 20000, force: true });
                            cy.wait(500);

                            // Verificar si necesitamos cambiar de paso
                            const pasoRequerido = item.paso ? item.paso.toString().trim() : null;
                            if (pasoRequerido && pasoRequerido !== pasoActual) {
                                cy.log(`Cambiando de paso "${pasoActual}" a "${pasoRequerido}"`);
                                Generales.seleccionarPaso(item.paso, { timeout: 10000, skipContext: true, force: true });
                                pasoActual = pasoRequerido;
                            } else if (!pasoRequerido) {
                                // Fallback si no hay paso
                                Generales.BtnIframe("Cuenta", { timeout: 10000, force: true, skipContext: true });
                                cy.wait(1500)
                            } else {
                                cy.log(`Paso "${pasoRequerido}" ya está seleccionado, se omite clic.`);
                            }


                            cy.wait(2500)
                            GestorDeTransaccion.AsignacionDCaracteristicaAPaso(
                                item.caracteristica,
                                item.tamanioLetra,
                                item.visualizar,
                                item.proteger,
                                item.obligatorio,
                                item.negrita,
                                item.verFirmas,
                                item.expresionCalcularCampo,
                                item.ReglasCondicionarCampo,
                                item.operacion,
                                item.expresionParaValidar,
                                item.mensajeError,
                                item.correlativo,
                                item.productos
                            );

                            // Hacemos clic en Guardar sin interceptar
                            Generales.BtnIframe('Aceptar', { timeout: 10000, force: true, skipContext: true });
                        });
                    }).then(() => {
                    // Esperamos un tiempo para que la operación se complete
                    cy.wait(2000);

                    // Volvemos a entrar al iframe para hacer clic en "Atrás"
                    cy.get('iframe.frame', { timeout: 10000 })
                        .its('0.contentDocument.body')
                        .should('not.be.empty')
                        .then(cy.wrap)
                        .within(() => {
                            Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true });
                        });

                    cy.wait(2000);

                    // Verificar si aparece el diálogo de confirmación DENTRO del iframe
                    cy.get('iframe.frame', { timeout: 10000 })
                        .its('0.contentDocument.body')
                        .should('not.be.empty')
                        .then(($body) => {
                            const $dialog = Cypress.$('mat-dialog-container:contains("Confirmar")', $body);
                            if ($dialog.length > 0) {
                                cy.log('✅ Diálogo Confirmar detectado');
                                const $btnSi = Cypress.$('button mat-icon:contains("check")', $dialog).parents('button');
                                if ($btnSi.length > 0) {
                                    cy.log('✅ Botón Sí encontrado dentro del diálogo, haciendo clic');
                                    $btnSi.first().click();
                                    cy.wait(1000);
                                    cy.log('✅ Clic en Sí realizado');
                                } else {
                                    cy.log('⚠️ No se encontró botón con icono check dentro del diálogo');
                                }
                            } else {
                                cy.log('ℹ️ No apareció diálogo de confirmación - continuando flujo normal');
                            }
                        });
                });
            });
        });*/

       it("Agregar múltiples registros dinámicamente", function() {
           const datos = this.data.agregar;

           const agrupadas = datos.reduce((acc, item) => {
               if (!acc[item.codigoTX]) {
                   acc[item.codigoTX] = [];
               }
               acc[item.codigoTX].push(item);
               return acc;
           }, {});

           let contadorAsignaciones = 0;

           cy.wrap(Object.keys(agrupadas)).each((codigoTX) => {
               cy.log('Procesando Tx: ' + codigoTX);

               // Opcional: limpiar logs de Cypress
               cy.then(() => {
                   const doc = window.top.document;
                   const logContainer = doc.querySelector('.reporter .commands') ||
                       doc.querySelector('.command-list') ||
                       doc.querySelector('.runnable-commands-region');
                   if (logContainer) {
                       logContainer.innerHTML = '';
                   }
               });

               cy.get('iframe.frame', { timeout: 10000 })
                   .its('0.contentDocument.body')
                   .should('not.be.empty')
                   .then(cy.wrap)
                   .within(() => {
                       Generales.filtrarPorCodigo(codigoTX);
                       let pasoActual = null;

                       return cy.wrap(agrupadas[codigoTX]).each((item) => {
                           Generales.abrirPanel("Opciones", { timeout: 20000, force: true });
                           cy.wait(500);

                           const pasoRequerido = item.paso ? item.paso.toString().trim() : null;
                           if (pasoRequerido && pasoRequerido !== pasoActual) {
                               cy.log(`Cambiando de paso "${pasoActual}" a "${pasoRequerido}"`);
                               Generales.seleccionarPaso(item.paso, { timeout: 10000, skipContext: true, force: true });
                               pasoActual = pasoRequerido;
                           } else if (!pasoRequerido) {
                               Generales.BtnIframe("Cuenta", { timeout: 10000, force: true, skipContext: true });
                               cy.wait(1500);
                           } else {
                               cy.log(`Paso "${pasoRequerido}" ya está seleccionado, se omite clic.`);
                           }

                           cy.wait(2500);
                           GestorDeTransaccion.AsignacionDCaracteristicaAPaso(
                               item.caracteristica,
                               item.tamanioLetra,
                               item.visualizar,
                               item.proteger,
                               item.obligatorio,
                               item.negrita,
                               item.verFirmas,
                               item.expresionCalcularCampo,
                               item.ReglasCondicionarCampo,
                               item.operacion,
                               item.expresionParaValidar,
                               item.mensajeError,
                               item.correlativo,
                               item.productos
                           );

                           // ========== REPORTE ==========
                           contadorAsignaciones++;
                           const alias = `guardarAsignacion-${contadorAsignaciones}`;
                           cy.log(`🔢 Asignación #${contadorAsignaciones} para característica: ${item.caracteristica}`);

                           // 🔧 URL CORRECTA según el log
                           cy.intercept('POST', '**/transactionCharactByStep').as(alias);

                           Generales.BtnIframe('Aceptar', { timeout: 10000, force: true, skipContext: true });

                           cy.wait(`@${alias}`, { timeout: 10000 }).then((interception) => {
                               const status = interception.response.statusCode;
                               let estado = 'fallida';
                               let mensaje = '';

                               cy.wait(500);
                               cy.document().then((doc) => {
                                   const $body = Cypress.$(doc.body);
                                   const $snack = $body.find('.snackbar, .mat-mdc-snack-bar-label');
                                   if ($snack.length) mensaje = $snack.text().trim();
                               }).then(() => {
                                   if (status === 200 || status === 201) {
                                       estado = 'exitosa';
                                       cy.log(`Asignación guardada correctamente: ${item.caracteristica}`);
                                   } else {
                                       estado = 'fallida';
                                       cy.log(`Error al guardar asignación. Status: ${status}`);
                                   }
                               }).then(() => {
                                   const nombreCaptura = `Captura-${contadorAsignaciones}-AsignacionCaracteristica-${estado}`;
                                   cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                       cy.task('guardarResultado', {
                                           describe: '019.3 - Asignar Características a Pasos',
                                           crud: "Asignación Característica-Paso",
                                           descripcion: `Transacción: ${codigoTX} - Paso: ${item.paso || 'desconocido'} - Característica: ${item.caracteristica}`,
                                           estado: estado,
                                           numero: contadorAsignaciones,
                                           mensaje: mensaje,
                                           evidencia: `${nombreCaptura}.png`
                                       });
                                   });
                               });
                           });
                           // ========== FIN REPORTE ==========
                       });
                   }).then(() => {
                   cy.wait(2000);
                   cy.get('iframe.frame', { timeout: 10000 })
                       .its('0.contentDocument.body')
                       .should('not.be.empty')
                       .then(cy.wrap)
                       .within(() => {
                           Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true });
                       });

                   cy.wait(2000);
                   cy.get('iframe.frame', { timeout: 10000 })
                       .its('0.contentDocument.body')
                       .should('not.be.empty')
                       .then(($body) => {
                           const $dialog = Cypress.$('mat-dialog-container:contains("Confirmar")', $body);
                           if ($dialog.length) {
                               cy.log('Diálogo Confirmar detectado');
                               const $btnSi = Cypress.$('button mat-icon:contains("check")', $dialog).parents('button');
                               if ($btnSi.length) {
                                   cy.log('Botón Sí encontrado, haciendo clic');
                                   $btnSi.first().click();
                                   cy.wait(1000);
                               }
                           } else {
                               cy.log('ℹ️ No apareció diálogo de confirmación');
                           }
                       });
               });
           });
       });
    });

    describe.skip("019.4 -  Gestor de Transacciones > Creacion de rutinas PRE...", function() {

        beforeEach(function() {
            Generales.IrAPantalla('transactionManager');
            cy.readFile('./JsonData/rutinaPre.json').as('data');
            cy.wait(3000)
        });


        //Sirve sin reporte
        /*it("Agregar múltiples registros dinámicamente", function() {

            const datos = this.data.agregar

            const agrupadas = datos.reduce((acc, item) => {
                if (!acc[item.codigoTRX]) {
                    acc[item.codigoTRX] = []
                }
                acc[item.codigoTRX].push(item)
                return acc
            }, {})


            cy.wrap(Object.keys(agrupadas)).each((codigoTRX) => {
                cy.log('Procesando Tx: ' + codigoTRX)

                cy.then(() => {
                    // Limpiar logs de Cypress (opcional)
                    const doc = window.top.document;
                    const logContainer = doc.querySelector('.reporter .commands') ||
                        doc.querySelector('.command-list') ||
                        doc.querySelector('.runnable-commands-region');
                    if (logContainer) {
                        logContainer.innerHTML = '';
                    }
                });

                // Entrar al iframe y realizar acciones
                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        // Dentro del iframe: acciones de edición
                        Generales.filtrarPorCodigo(codigoTRX);

                        return cy.wrap(agrupadas[codigoTRX]).each((item) => {
                            Generales.abrirPanel("Opciones", {timeout: 20000, force: true});
                            cy.wait(500)

                            if (item.paso) {
                                Generales.seleccionarPaso(item.paso, { timeout: 10000, skipContext: true, force: true });
                            } else {
                                // Fallback al método anterior si no hay paso en el JSON
                                Generales.BtnIframe("Cuenta", { timeout: 10000, force: true, skipContext: true });
                            }

                            cy.wait(500)
                            Generales.agregarRutinaTRX("pre")
                            cy.wait(3000);

                            GestorDeTransaccion.RutinasTRX(
                                item.rutina,
                                item.estado,
                                item.correlativo,
                                item.requiereLogin,
                                item.descripcion,
                                item.fechaInicio,
                                item.fechaFin,
                                item.paremetros
                            );

                            cy.xpath("//button[.//mat-icon[text()='check']]")
                                .scrollIntoView({ duration: 500 })
                                .click({ force: true });

                        });
                    }).then(() => {

                    cy.wait(2000);

                    cy.get('iframe.frame', { timeout: 10000 })
                        .its('0.contentDocument.body')
                        .should('not.be.empty')
                        .then(cy.wrap)
                        .within(() => {
                            Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true });
                        });

                    cy.wait(2000);

                    // Verificar si aparece el diálogo de confirmación DENTRO del iframe
                    cy.get('iframe.frame', { timeout: 10000 })
                        .its('0.contentDocument.body')
                        .should('not.be.empty')
                        .then(($body) => {
                            // Buscar el diálogo por su TÍTULO "Confirmar"
                            const $dialog = Cypress.$('mat-dialog-container:contains("Confirmar")', $body);

                            if ($dialog.length > 0) {
                                cy.log('✅ Diálogo Confirmar detectado');

                                // DENTRO del diálogo, buscar el botón que tiene mat-icon con texto "check"
                                const $btnSi = Cypress.$('button mat-icon:contains("check")', $dialog).parents('button');

                                if ($btnSi.length > 0) {
                                    cy.log('✅ Botón Sí encontrado dentro del diálogo, haciendo clic');
                                    $btnSi.first().click();
                                    cy.wait(1000);
                                    cy.log('✅ Clic en Sí realizado');
                                } else {
                                    cy.log('⚠️ No se encontró botón con icono check dentro del diálogo');
                                }
                            } else {
                                cy.log('ℹ️ No apareció diálogo de confirmación - continuando flujo normal');
                            }
                        });

                })

            });
        });*/

        it("Agregar múltiples registros dinámicamente", function() {
            const datos = this.data.agregar;

            const agrupadas = datos.reduce((acc, item) => {
                if (!acc[item.codigoTRX]) {
                    acc[item.codigoTRX] = [];
                }
                acc[item.codigoTRX].push(item);
                return acc;
            }, {});

            let contadorRutinas = 0; // Contador global para reportes

            cy.wrap(Object.keys(agrupadas)).each((codigoTRX) => {
                cy.log('Procesando Tx: ' + codigoTRX);

                cy.then(() => {
                    const doc = window.top.document;
                    const logContainer = doc.querySelector('.reporter .commands') ||
                        doc.querySelector('.command-list') ||
                        doc.querySelector('.runnable-commands-region');
                    if (logContainer) {
                        logContainer.innerHTML = '';
                    }
                });

                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        Generales.filtrarPorCodigo(codigoTRX);

                        return cy.wrap(agrupadas[codigoTRX]).each((item) => {
                            Generales.abrirPanel("Opciones", { timeout: 20000, force: true });
                            cy.wait(500);

                            if (item.paso) {
                                Generales.seleccionarPaso(item.paso, { timeout: 10000, skipContext: true, force: true });
                            } else {
                                Generales.BtnIframe("Cuenta", { timeout: 10000, force: true, skipContext: true });
                            }

                            cy.wait(500);
                            Generales.agregarRutinaTRX("pre");
                            cy.wait(3000);

                            // ========== REPORTE ==========
                            contadorRutinas++;
                            const alias = `guardarRutina-${contadorRutinas}`;
                            cy.log(`🔢 Rutina #${contadorRutinas} para: ${item.rutina || 'sin nombre'}`);

                            // Interceptar la petición POST (ajustar URL si es diferente)
                            cy.intercept('POST', '**/transactionFlowRoutine').as(alias);

                            GestorDeTransaccion.RutinasTRX(
                                item.rutina,
                                item.estado,
                                item.correlativo,
                                item.requiereLogin,
                                item.descripcion,
                                item.fechaInicio,
                                item.fechaFin,
                                item.paremetros
                            );

                            cy.xpath("//button[.//mat-icon[text()='check']]")
                                .scrollIntoView({ duration: 500 })
                                .click({ force: true });

                            // Esperar respuesta y procesar reporte
                            cy.wait(`@${alias}`, { timeout: 10000 }).then((interception) => {
                                const status = interception.response.statusCode;
                                let estado = 'fallida';
                                let mensaje = '';

                                cy.wait(500);
                                cy.document().then((doc) => {
                                    const $body = Cypress.$(doc.body);
                                    const $snack = $body.find('.snackbar, .mat-mdc-snack-bar-label');
                                    if ($snack.length) mensaje = $snack.text().trim();
                                }).then(() => {
                                    if (status === 200 || status === 201) {
                                        estado = 'exitosa';
                                        cy.log(`Rutina guardada correctamente: ${item.rutina}`);
                                    } else {
                                        estado = 'fallida';
                                        cy.log(`Error al guardar rutina. Status: ${status}`);
                                    }
                                }).then(() => {
                                    const nombreCaptura = `Captura-${contadorRutinas}-Rutina PRE-${estado}`;
                                    cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                        cy.task('guardarResultado', {
                                            describe: '019.4 - Creación de rutinas PRE',
                                            crud: "Rutina PRE",
                                            descripcion: `Transacción: ${codigoTRX} - Paso: ${item.paso || 'desconocido'} - Rutina: ${item.rutina}`,
                                            estado: estado,
                                            numero: contadorRutinas,
                                            mensaje: mensaje,
                                            evidencia: `${nombreCaptura}.png`
                                        });
                                    });
                                });
                            });
                            // ========== FIN REPORTE ==========
                        });
                    }).then(() => {
                    cy.wait(2000);

                    cy.get('iframe.frame', { timeout: 10000 })
                        .its('0.contentDocument.body')
                        .should('not.be.empty')
                        .then(cy.wrap)
                        .within(() => {
                            Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true });
                        });

                    cy.wait(2000);

                    cy.get('iframe.frame', { timeout: 10000 })
                        .its('0.contentDocument.body')
                        .should('not.be.empty')
                        .then(($body) => {
                            const $dialog = Cypress.$('mat-dialog-container:contains("Confirmar")', $body);
                            if ($dialog.length > 0) {
                                cy.log('Diálogo Confirmar detectado');
                                const $btnSi = Cypress.$('button mat-icon:contains("check")', $dialog).parents('button');
                                if ($btnSi.length > 0) {
                                    cy.log('Botón Sí encontrado, haciendo clic');
                                    $btnSi.first().click();
                                    cy.wait(1000);
                                }
                            } else {
                                cy.log('ℹ️ No apareció diálogo de confirmación');
                            }
                        });
                });
            });
        });



    });

    describe.skip("019.5 -  Gestor de Transacciones > Creacion de rutinas POS...", function() {

        beforeEach(function() {
            Generales.IrAPantalla('transactionManager');
            cy.readFile('./JsonData/rutinaPos.json').as('data');
            cy.wait(5000)
        });

        //Sirve sin reporte
        /*it("Agregar múltiples registros dinámicamente", function() {

            const datos = this.data.agregar

            const agrupadas = datos.reduce((acc, item) => {
                if (!acc[item.codigoTRX]) {
                    acc[item.codigoTRX] = []
                }
                acc[item.codigoTRX].push(item)
                return acc
            }, {})


            cy.wrap(Object.keys(agrupadas)).each((codigoTRX) => {
                cy.log('Procesando Tx: ' + codigoTRX)

                cy.then(() => {
                    // Limpiar logs de Cypress (opcional)
                    const doc = window.top.document;
                    const logContainer = doc.querySelector('.reporter .commands') ||
                        doc.querySelector('.command-list') ||
                        doc.querySelector('.runnable-commands-region');
                    if (logContainer) {
                        logContainer.innerHTML = '';
                    }
                });

                // Entrar al iframe y realizar acciones
                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        // Dentro del iframe: acciones de edición
                        Generales.filtrarPorCodigo(codigoTRX);

                        return cy.wrap(agrupadas[codigoTRX]).each((item) => {
                            Generales.abrirPanel("Opciones", {timeout: 20000, force: true});
                            cy.wait(500)

                            // 🔴 USAR EL NUEVO MÉTODO PARA SELECCIONAR EL PASO
                            if (item.paso) {
                                Generales.seleccionarPaso(item.paso, { timeout: 10000, skipContext: true, force: true });
                            } else {
                                // Fallback al método anterior si no hay paso en el JSON
                                Generales.BtnIframe("Cuenta", { timeout: 10000, force: true, skipContext: true });
                            }

                            cy.wait(500)
                            Generales.agregarRutinaTRX("pos")
                            cy.wait(3000);

                            GestorDeTransaccion.RutinasTRX(
                                item.rutina,
                                item.estado,
                                item.correlativo,
                                item.requiereLogin,
                                item.descripcion,
                                item.fechaInicio,
                                item.fechaFin,
                                item.paremetros
                            );

                            cy.xpath("//button[.//mat-icon[text()='check']]")
                                .scrollIntoView({ duration: 500 })
                                .click({ force: true });

                        });
                    }).then(() => {

                    cy.wait(2000);

                    cy.get('iframe.frame', { timeout: 10000 })
                        .its('0.contentDocument.body')
                        .should('not.be.empty')
                        .then(cy.wrap)
                        .within(() => {
                            Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true });
                        });

                    cy.wait(2000);

                    // Verificar si aparece el diálogo de confirmación DENTRO del iframe
                    cy.get('iframe.frame', { timeout: 10000 })
                        .its('0.contentDocument.body')
                        .should('not.be.empty')
                        .then(($body) => {
                            // Buscar el diálogo por su TÍTULO "Confirmar"
                            const $dialog = Cypress.$('mat-dialog-container:contains("Confirmar")', $body);

                            if ($dialog.length > 0) {
                                cy.log('✅ Diálogo Confirmar detectado');

                                // DENTRO del diálogo, buscar el botón que tiene mat-icon con texto "check"
                                const $btnSi = Cypress.$('button mat-icon:contains("check")', $dialog).parents('button');

                                if ($btnSi.length > 0) {
                                    cy.log('✅ Botón Sí encontrado dentro del diálogo, haciendo clic');
                                    $btnSi.first().click();
                                    cy.wait(1000);
                                    cy.log('✅ Clic en Sí realizado');
                                } else {
                                    cy.log('⚠️ No se encontró botón con icono check dentro del diálogo');
                                }
                            } else {
                                cy.log('ℹ️ No apareció diálogo de confirmación - continuando flujo normal');
                            }
                        });
                })

            });
        });*/

        it("Agregar múltiples registros dinámicamente", function() {
            const datos = this.data.agregar;

            const agrupadas = datos.reduce((acc, item) => {
                if (!acc[item.codigoTRX]) {
                    acc[item.codigoTRX] = [];
                }
                acc[item.codigoTRX].push(item);
                return acc;
            }, {});

            let contadorRutinas = 0; // Contador global para reportes

            cy.wrap(Object.keys(agrupadas)).each((codigoTRX) => {
                cy.log('Procesando Tx: ' + codigoTRX);

                cy.then(() => {
                    // Limpiar logs de Cypress (opcional)
                    const doc = window.top.document;
                    const logContainer = doc.querySelector('.reporter .commands') ||
                        doc.querySelector('.command-list') ||
                        doc.querySelector('.runnable-commands-region');
                    if (logContainer) {
                        logContainer.innerHTML = '';
                    }
                });

                // Entrar al iframe y realizar acciones
                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        // Dentro del iframe: acciones de edición
                        Generales.filtrarPorCodigo(codigoTRX);

                        return cy.wrap(agrupadas[codigoTRX]).each((item) => {
                            Generales.abrirPanel("Opciones", { timeout: 20000, force: true });
                            cy.wait(500);

                            // Seleccionar paso
                            if (item.paso) {
                                Generales.seleccionarPaso(item.paso, { timeout: 10000, skipContext: true, force: true });
                            } else {
                                Generales.BtnIframe("Cuenta", { timeout: 10000, force: true, skipContext: true });
                            }

                            cy.wait(500);
                            Generales.agregarRutinaTRX("pos"); // "pre" o "pos" según datos
                            cy.wait(3000);

                            GestorDeTransaccion.RutinasTRX(
                                item.rutina,
                                item.estado,
                                item.correlativo,
                                item.requiereLogin,
                                item.descripcion,
                                item.fechaInicio,
                                item.fechaFin,
                                item.paremetros
                            );

                            // ========== INICIO REPORTE ==========
                            contadorRutinas++;
                            const alias = `guardarRutina-${contadorRutinas}`;
                            cy.log(`Rutina #${contadorRutinas}: ${item.rutina}`);

                            // Interceptar la petición POST (URL real según logs anteriores)
                            cy.intercept('POST', '**/transactionFlowRoutine').as(alias);

                            // Hacer clic en el botón de guardar (check)
                            cy.xpath("//button[.//mat-icon[text()='check']]")
                                .scrollIntoView({ duration: 500 })
                                .click({ force: true });

                            cy.wait(`@${alias}`, { timeout: 10000 }).then((interception) => {
                                const status = interception.response.statusCode;
                                let estado = 'fallida';
                                let mensaje = '';

                                cy.wait(500);
                                cy.document().then((doc) => {
                                    const $body = Cypress.$(doc.body);
                                    const $snack = $body.find('.snackbar, .mat-mdc-snack-bar-label');
                                    if ($snack.length) mensaje = $snack.text().trim();
                                }).then(() => {
                                    if (status === 200 || status === 201) {
                                        estado = 'exitosa';
                                        cy.log(`Rutina guardada: ${item.rutina}`);
                                    } else {
                                        estado = 'fallida';
                                        cy.log(`Error al guardar rutina. Status: ${status}`);
                                    }
                                }).then(() => {
                                    const nombreCaptura = `Captura-${contadorRutinas}-Rutina POS-${estado}`;
                                    cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                        cy.task('guardarResultado', {
                                            describe: '019.5 - Rutina PRE',
                                            crud: "Rutina PRE",
                                            descripcion: `Transacción: ${codigoTRX} - Rutina POS: ${item.rutina}`,
                                            estado: estado,
                                            numero: contadorRutinas,
                                            mensaje: mensaje,
                                            evidencia: `${nombreCaptura}.png`
                                        });
                                    });
                                });
                            });
                            // ========== FIN REPORTE ==========
                        });
                    }).then(() => {
                    // Salir del detalle (botón Atrás)
                    cy.wait(2000);
                    cy.get('iframe.frame', { timeout: 10000 })
                        .its('0.contentDocument.body')
                        .should('not.be.empty')
                        .then(cy.wrap)
                        .within(() => {
                            Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true });
                        });

                    cy.wait(1500);

                    // Manejar diálogo de confirmación si aparece
                    cy.get('iframe.frame', { timeout: 10000 })
                        .its('0.contentDocument.body')
                        .should('not.be.empty')
                        .then(($body) => {
                            const $dialog = Cypress.$('mat-dialog-container:contains("Confirmar")', $body);
                            if ($dialog.length > 0) {
                                cy.log('Diálogo Confirmar detectado');
                                const $btnSi = Cypress.$('button mat-icon:contains("check")', $dialog).parents('button');
                                if ($btnSi.length > 0) {
                                    cy.log('Botón Sí encontrado, haciendo clic');
                                    $btnSi.first().click();
                                    cy.wait(1000);
                                }
                            } else {
                                cy.log('No apareció diálogo de confirmación');
                            }
                        });
                });
            });
        });





    });

   describe.skip("019.6 -  Gestor de Transacciones > Asignacion de Mooneda ...", function() {

        beforeEach(function() {
            Generales.IrAPantalla('transactionManager');
            cy.readFile('./JsonData/subTxAsignacionMoneda.json').as('data');
            cy.wait(5000)
        });

        //Sin reporte
        /*it("Agregar múltiples registros dinámicamente", function() {
            cy.log('Datos cargados:', JSON.stringify(this.data));

            cy.wrap(this.data.agregar).each((item) => {
                cy.then(() => {
                    // // Limpiar logs de Cypress (opcional)
                    // const doc = window.top.document;
                    // const logContainer = doc.querySelector('.reporter .commands') ||
                    //                     doc.querySelector('.command-list') ||
                    //                     doc.querySelector('.runnable-commands-region');
                    // if (logContainer) {
                    //     logContainer.innerHTML = '';
                    // }
                });

                cy.log("📝 Procesando item:", item);
                cy.log(`🔢 Código TX: ${item.codigoTX}`);

                // Entrar al iframe y realizar acciones
                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        // Dentro del iframe: acciones de edición
                        Generales.filtrarPorCodigo(item.codigoTX); // o item.codigoTX - 777 para pruebas
                        Generales.abrirPanel("Opciones", {timeout: 20000, force: true});
                        Generales.abrirPanel("Totales a Afectar", {timeout: 20000, force: true});
                        Generales.abrirPanel("Asignación de moneda", {timeout: 20000, force: true})
                        GestorDeTransaccion.AsignarMoneda(
                            //formaAfectarTotales, metodoAsignacionMoneda, correlativoMoneda
                            item.formaAfectarTotales, item.metodoAsignacionMoneda, item.correlativoMoneda
                        );
                        // Hacemos clic en Guardar sin interceptar
                        Generales.BtnIframe('Guardar', { timeout: 10000, force: true, skipContext: true });
                    }); // Salimos del iframe

                // Esperamos un tiempo para que la operación se complete (ajusta según sea necesario)
                cy.wait(2000);

                // Volvemos a entrar al iframe para hacer clic en "Atrás"
                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true });
                    });

                // Espera a que el posible diálogo aparezca
                cy.wait(2000);

                // Verificar si aparece el diálogo de confirmación DENTRO del iframe
                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(($body) => {
                        // Buscar el diálogo de confirmación de forma síncrona (no lanza error si no existe)
                        const $dialog = Cypress.$('mat-dialog-container', $body);
                        if ($dialog.length > 0) {
                            cy.log('✅ Diálogo de confirmación detectado');
                            // Hacer clic en el botón primario (color="primary") dentro del diálogo
                            cy.wrap($dialog).find('button[color="primary"]').click();
                            // Opcional: esperar a que el diálogo desaparezca
                            cy.get('mat-dialog-container', { timeout: 5000 }).should('not.exist');
                        } else {
                            cy.log('ℹ️ No apareció diálogo de confirmación');
                        }
                    });
            });
        });*/


       it("Agregar múltiples registros dinámicamente", function() {
           cy.log('Datos cargados:', JSON.stringify(this.data));

           let contadorAsignaciones = 0; // Contador global para reportes

           cy.wrap(this.data.agregar).each((item) => {
               cy.log("📝 Procesando item:", item);
               cy.log(`🔢 Código TX: ${item.codigoTX}`);

               // Entrar al iframe y realizar acciones
               cy.get('iframe.frame', { timeout: 10000 })
                   .its('0.contentDocument.body')
                   .should('not.be.empty')
                   .then(cy.wrap)
                   .within(() => {
                       Generales.filtrarPorCodigo(item.codigoTX);
                       Generales.abrirPanel("Opciones", { timeout: 20000, force: true });
                       Generales.abrirPanel("Totales a Afectar", { timeout: 20000, force: true });
                       Generales.abrirPanel("Asignación de moneda", { timeout: 20000, force: true });

                       // ========== INICIO REPORTE ==========
                       contadorAsignaciones++;
                       const alias = `guardarAsignacionMoneda-${contadorAsignaciones}`;
                       cy.log(`🔢 Asignación de moneda #${contadorAsignaciones} para TX: ${item.codigoTX}`);

                       // Interceptar el PATCH que actualiza la transacción (incluye la asignación de moneda)
                       cy.intercept('PATCH', '**/transactionSpec/*').as(alias);

                       GestorDeTransaccion.AsignarMoneda(
                           item.formaAfectarTotales,
                           item.metodoAsignacionMoneda,
                           item.correlativoMoneda
                       );

                       Generales.BtnIframe('Guardar', { timeout: 10000, force: true, skipContext: true });

                       cy.wait(`@${alias}`, { timeout: 10000 }).then((interception) => {
                           const status = interception.response.statusCode;
                           let estado = 'fallida';
                           let mensaje = '';

                           cy.wait(500);
                           cy.document().then((doc) => {
                               const $body = Cypress.$(doc.body);
                               const $snack = $body.find('.snackbar, .mat-mdc-snack-bar-label');
                               if ($snack.length) mensaje = $snack.text().trim();
                           }).then(() => {
                               if (status === 200 || status === 201) {
                                   estado = 'exitosa';
                                   cy.log(`✅ Asignación de moneda guardada correctamente para TX: ${item.codigoTX}`);
                               } else {
                                   estado = 'fallida';
                                   cy.log(`❌ Error al guardar asignación de moneda. Status: ${status}`);
                               }
                           }).then(() => {
                               const nombreCaptura = `Captura-${contadorAsignaciones}-AsignacionMoneda-${estado}`;
                               cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                   cy.task('guardarResultado', {
                                       describe: '019.6 - Asignación de Moneda',
                                       crud: "Asignación de Moneda",
                                       descripcion: `Transacción: ${item.codigoTX} - Forma afectar: ${item.formaAfectarTotales} - Método asignación: ${item.metodoAsignacionMoneda}`,
                                       estado: estado,
                                       numero: contadorAsignaciones,
                                       mensaje: mensaje,
                                       evidencia: `${nombreCaptura}.png`
                                   });
                               });
                           });
                       });
                       // ========== FIN REPORTE ==========
                   });

               cy.wait(2000);

               cy.get('iframe.frame', { timeout: 10000 })
                   .its('0.contentDocument.body')
                   .should('not.be.empty')
                   .then(cy.wrap)
                   .within(() => {
                       Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true });
                   });

               cy.wait(2000);

               cy.get('iframe.frame', { timeout: 10000 })
                   .its('0.contentDocument.body')
                   .should('not.be.empty')
                   .then(($body) => {
                       const $dialog = Cypress.$('mat-dialog-container', $body);
                       if ($dialog.length > 0) {
                           cy.log('Diálogo de confirmación detectado');
                           cy.wrap($dialog).find('button[color="primary"]').click();
                           cy.get('mat-dialog-container', { timeout: 5000 }).should('not.exist');
                       } else {
                           cy.log('No apareció diálogo de confirmación');
                       }
                   });
           });
       });






    });

   describe.skip("019.7 -  Gestor de Transacciones > Totales a Afectar ..." , function() {

        beforeEach(function() {
            Generales.IrAPantalla('transactionManager');
            cy.readFile('./JsonData/subTxAfectaTotales.json').as('data');
            cy.wait(5000)
        });

        /*it("Agregar múltiples registros dinámicamente", function() {

            const datos = this.data.agregar

            const agrupadas = datos.reduce((acc, item) => {
                if (!acc[item.codigoTX]) {
                    acc[item.codigoTX] = []
                }
                acc[item.codigoTX].push(item)
                return acc
            }, {})


            cy.wrap(Object.keys(agrupadas)).each((codigoTX) => {
                cy.log('Procesando Tx: ' + codigoTX)

                cy.then(() => {
                    // Limpiar logs de Cypress (opcional)
                    const doc = window.top.document;
                    const logContainer = doc.querySelector('.reporter .commands') ||
                        doc.querySelector('.command-list') ||
                        doc.querySelector('.runnable-commands-region');
                    if (logContainer) {
                        logContainer.innerHTML = '';
                    }
                });

                // Entrar al iframe y realizar acciones
                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        // Dentro del iframe: acciones de edición
                        Generales.filtrarPorCodigo(codigoTX); // o item.codigoTX - 777 para pruebas

                        return cy.wrap(agrupadas[codigoTX]).each((item) => {
                            Generales.abrirPanel("Totales a Afectar", {timeout: 20000, force: true});
                            cy.wait(500)
                            GestorDeTransaccion.TotalesAfectar(
                                //caracteristica, totalCajero, operacion, exp1, operacion2, exp2

                                item.caracteristica, item.totalCajero, item.operacion,  item.exp1, item.operacion2, item.exp2
                            );
                            // Hacemos clic en Guardar sin interceptar
                            Generales.BtnIframe('Guardar', { timeout: 10000, force: true, skipContext: true });
                        }); // Salimos del iframe
                    }).then(() => {

                    // Esperamos un tiempo para que la operación se complete (ajusta según sea necesario)
                    cy.wait(2000);

                    // Volvemos a entrar al iframe para hacer clic en "Atrás"
                    cy.get('iframe.frame', { timeout: 10000 })
                        .its('0.contentDocument.body')
                        .should('not.be.empty')
                        .then(cy.wrap)
                        .within(() => {
                            Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true });
                        });

                    // Espera a que el posible diálogo aparezca
                    cy.wait(2000);

                    // Verificar si aparece el diálogo de confirmación DENTRO del iframe
                    cy.get('iframe.frame', { timeout: 10000 })
                        .its('0.contentDocument.body')
                        .should('not.be.empty')
                        .then(($body) => {
                            // Buscar el diálogo por su TÍTULO "Confirmar"
                            const $dialog = Cypress.$('mat-dialog-container:contains("Confirmar")', $body);

                            if ($dialog.length > 0) {
                                cy.log('✅ Diálogo Confirmar detectado');

                                // DENTRO del diálogo, buscar el botón que tiene mat-icon con texto "check"
                                const $btnSi = Cypress.$('button mat-icon:contains("check")', $dialog).parents('button');

                                if ($btnSi.length > 0) {
                                    cy.log('✅ Botón Sí encontrado dentro del diálogo, haciendo clic');
                                    $btnSi.first().click();
                                    cy.wait(1000);
                                    cy.log('✅ Clic en Sí realizado');
                                } else {
                                    cy.log('⚠️ No se encontró botón con icono check dentro del diálogo');
                                }
                            } else {
                                cy.log('ℹ️ No apareció diálogo de confirmación - continuando flujo normal');
                            }
                        });
                })

            });
        });*/

       it("Agregar múltiples registros dinámicamente", function() {
           const datos = this.data.agregar;

           const agrupadas = datos.reduce((acc, item) => {
               if (!acc[item.codigoTX]) {
                   acc[item.codigoTX] = [];
               }
               acc[item.codigoTX].push(item);
               return acc;
           }, {});

           let contadorTotales = 0; // contador global para reportes

           cy.wrap(Object.keys(agrupadas)).each((codigoTX) => {
               cy.log('Procesando Tx: ' + codigoTX);

               cy.then(() => {
                   // Limpiar logs de Cypress (opcional)
                   const doc = window.top.document;
                   const logContainer = doc.querySelector('.reporter .commands') ||
                       doc.querySelector('.command-list') ||
                       doc.querySelector('.runnable-commands-region');
                   if (logContainer) {
                       logContainer.innerHTML = '';
                   }
               });

               // Entrar al iframe y realizar acciones
               cy.get('iframe.frame', { timeout: 10000 })
                   .its('0.contentDocument.body')
                   .should('not.be.empty')
                   .then(cy.wrap)
                   .within(() => {
                       // Dentro del iframe: acciones de edición
                       Generales.filtrarPorCodigo(codigoTX);

                       return cy.wrap(agrupadas[codigoTX]).each((item) => {
                           Generales.abrirPanel("Totales a Afectar", { timeout: 20000, force: true });
                           cy.wait(500);

                           // ========== INICIO REPORTE ==========
                           contadorTotales++;
                           const alias = `guardarTotal-${contadorTotales}`;
                           cy.log(`🔢 Total a afectar #${contadorTotales}: ${item.caracteristica}`);

                           // 🔧 AJUSTA ESTA URL SEGÚN LA PETICIÓN REAL (revisa Network)
                           // Posibles candidatos:
                           // - 'POST', '**/totalCashierAffect'
                           // - 'POST', '**/transactionTotalToAffect'
                           // - 'PATCH', '**/transactionSpec/*' (si actualiza la transacción principal)
                           cy.intercept('POST', '**/totalCashierAffect').as(alias); // <-- CAMBIA SEGÚN LOGS

                           GestorDeTransaccion.TotalesAfectar(
                               item.caracteristica, item.arbolRaiz, item.totalCajero, item.operacion, item.exp1, item.operacion2, item.exp2
                           );

                           // Hacemos clic en Guardar
                           Generales.BtnIframe('Guardar', { timeout: 10000, force: true, skipContext: true });

                           cy.wait(`@${alias}`, { timeout: 10000 }).then((interception) => {
                               const status = interception.response.statusCode;
                               let estado = 'fallida';
                               let mensaje = '';

                               cy.wait(500);
                               cy.document().then((doc) => {
                                   const $body = Cypress.$(doc.body);
                                   const $snack = $body.find('.snackbar, .mat-mdc-snack-bar-label');
                                   if ($snack.length) mensaje = $snack.text().trim();
                               }).then(() => {
                                   if (status === 200 || status === 201) {
                                       estado = 'exitosa';
                                       cy.log(`Total a afectar guardado: ${item.caracteristica}`);
                                   } else {
                                       estado = 'fallida';
                                       cy.log(`Error al guardar total a afectar. Status: ${status}`);
                                   }
                               }).then(() => {
                                   const nombreCaptura = `Captura-${contadorTotales}-TotalAfectar-${estado}`;
                                   cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                       cy.task('guardarResultado', {
                                           describe: '019.7 - Totales a Afectar',
                                           crud: "Total a afectar",
                                           descripcion: `TX: ${codigoTX} - Característica: ${item.caracteristica} - Total Cajero: ${item.totalCajero}`,
                                           estado: estado,
                                           numero: contadorTotales,
                                           mensaje: mensaje,
                                           evidencia: `${nombreCaptura}.png`
                                       });
                                   });
                               });
                           });
                           // ========== FIN REPORTE ==========
                       });
                   }).then(() => {
                   // Esperamos un tiempo para que la operación se complete
                   cy.wait(2000);

                   // Volvemos a entrar al iframe para hacer clic en "Atrás"
                   cy.get('iframe.frame', { timeout: 10000 })
                       .its('0.contentDocument.body')
                       .should('not.be.empty')
                       .then(cy.wrap)
                       .within(() => {
                           Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true });
                       });

                   cy.wait(2000);

                   // Verificar si aparece el diálogo de confirmación DENTRO del iframe
                   cy.get('iframe.frame', { timeout: 10000 })
                       .its('0.contentDocument.body')
                       .should('not.be.empty')
                       .then(($body) => {
                           const $dialog = Cypress.$('mat-dialog-container:contains("Confirmar")', $body);
                           if ($dialog.length > 0) {
                               cy.log('Diálogo Confirmar detectado');
                               const $btnSi = Cypress.$('button mat-icon:contains("check")', $dialog).parents('button');
                               if ($btnSi.length > 0) {
                                   cy.log('✅ Botón Sí encontrado dentro del diálogo, haciendo clic');
                                   $btnSi.first().click();
                                   cy.wait(1000);
                                   cy.log('Clic en Sí realizado');
                               } else {
                                   cy.log('No se encontró botón con icono check dentro del diálogo');
                               }
                           } else {
                               cy.log('No apareció diálogo de confirmación - continuando flujo normal');
                           }
                       });
               });
           });
       });

    });

   describe.skip("019.8 -  Gestor de Transacciones > Características del resultado ...", function() {


        beforeEach(function() {
            Generales.IrAPantalla('transactionManager');
            cy.readFile('./JsonData/subTxCaracteristicResult.json').as('data');
            cy.wait(2500)
        });

        /*it("Agregar múltiples registros dinámicamente", function() {

            const datos = this.data.agregar

            const agrupadas = datos.reduce((acc, item) => {
                if (!acc[item.codigoTX]) {
                    acc[item.codigoTX] = []
                }
                acc[item.codigoTX].push(item)
                return acc
            }, {})


            cy.wrap(Object.keys(agrupadas)).each((codigoTX) => {
                cy.log('Procesando Tx: ' + codigoTX)

                cy.then(() => {
                    // Limpiar logs de Cypress (opcional)
                    const doc = window.top.document;
                    const logContainer = doc.querySelector('.reporter .commands') ||
                        doc.querySelector('.command-list') ||
                        doc.querySelector('.runnable-commands-region');
                    if (logContainer) {
                        logContainer.innerHTML = '';
                    }
                });

                // Entrar al iframe y realizar acciones
                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        // Dentro del iframe: acciones de edición
                        Generales.filtrarPorCodigo(codigoTX); // o item.codigoTX - 777 para pruebas

                        return cy.wrap(agrupadas[codigoTX]).each((item) => {
                            Generales.abrirPanel("Características del resultado", {timeout: 20000, force: true});
                            cy.wait(500)
                            GestorDeTransaccion.CaracteristicaResultado(
                                //caracteristica, caracteristicaOperar, operacioncaracteristicaOperar

                                item.caracteristica, item.caracteristicaOperar, item.operacioncaracteristicaOperar
                            );
                            // Hacemos clic en Guardar sin interceptar
                            Generales.BtnIframe('Aceptar', { timeout: 10000, force: true, skipContext: true });
                        }); // Salimos del iframe
                    }).then(() => {

                    // Esperamos un tiempo para que la operación se complete (ajusta según sea necesario)
                    cy.wait(2000);

                    // Volvemos a entrar al iframe para hacer clic en "Atrás"
                    cy.get('iframe.frame', { timeout: 10000 })
                        .its('0.contentDocument.body')
                        .should('not.be.empty')
                        .then(cy.wrap)
                        .within(() => {
                            Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true });
                        });

                    // Espera a que el posible diálogo aparezca
                    cy.wait(2000);

                    // Verificar si aparece el diálogo de confirmación DENTRO del iframe
                    cy.get('iframe.frame', { timeout: 10000 })
                        .its('0.contentDocument.body')
                        .should('not.be.empty')
                        .then(($body) => {
                            // Buscar el diálogo por su TÍTULO "Confirmar"
                            const $dialog = Cypress.$('mat-dialog-container:contains("Confirmar")', $body);

                            if ($dialog.length > 0) {
                                cy.log('✅ Diálogo Confirmar detectado');

                                // DENTRO del diálogo, buscar el botón que tiene mat-icon con texto "check"
                                const $btnSi = Cypress.$('button mat-icon:contains("check")', $dialog).parents('button');

                                if ($btnSi.length > 0) {
                                    cy.log('✅ Botón Sí encontrado dentro del diálogo, haciendo clic');
                                    $btnSi.first().click();
                                    cy.wait(1000);
                                    cy.log('✅ Clic en Sí realizado');
                                } else {
                                    cy.log('⚠️ No se encontró botón con icono check dentro del diálogo');
                                }
                            } else {
                                cy.log('ℹ️ No apareció diálogo de confirmación - continuando flujo normal');
                            }
                        });
                })

            });
        });*/

       it("Agregar múltiples registros dinámicamente", function() {
           const datos = this.data.agregar;

           const agrupadas = datos.reduce((acc, item) => {
               if (!acc[item.codigoTX]) {
                   acc[item.codigoTX] = [];
               }
               acc[item.codigoTX].push(item);
               return acc;
           }, {});

           let contadorCaracteristicas = 0;

           cy.wrap(Object.keys(agrupadas)).each((codigoTX) => {
               cy.log('Procesando Tx: ' + codigoTX);

               cy.then(() => {
                   const doc = window.top.document;
                   const logContainer = doc.querySelector('.reporter .commands') ||
                       doc.querySelector('.command-list') ||
                       doc.querySelector('.runnable-commands-region');
                   if (logContainer) logContainer.innerHTML = '';
               });

               cy.get('iframe.frame', { timeout: 10000 })
                   .its('0.contentDocument.body')
                   .should('not.be.empty')
                   .then(cy.wrap)
                   .within(() => {
                       Generales.filtrarPorCodigo(codigoTX);

                       return cy.wrap(agrupadas[codigoTX]).each((item) => {
                           Generales.abrirPanel("Características del resultado", { timeout: 20000, force: true });
                           cy.wait(500);

                           contadorCaracteristicas++;
                           const alias = `guardarCaracteristicaResultado-${contadorCaracteristicas}`;
                           cy.log(`Característica resultado #${contadorCaracteristicas}: ${item.caracteristica}`);

                           // URL CORRECTA según el log
                           cy.intercept('POST', '**/resultCharacteristic/dynamicUpdate').as(alias);

                           GestorDeTransaccion.CaracteristicaResultado(
                               item.caracteristica,
                               item.caracteristicaOperar,
                               item.operacioncaracteristicaOperar
                           );

                           Generales.BtnIframe('Aceptar', { timeout: 10000, force: true, skipContext: true });

                           cy.wait(`@${alias}`, { timeout: 10000 }).then((interception) => {
                               const status = interception.response.statusCode;
                               let estado = 'fallida';
                               let mensaje = '';

                               cy.wait(500);
                               cy.document().then((doc) => {
                                   const $body = Cypress.$(doc.body);
                                   const $snack = $body.find('.snackbar, .mat-mdc-snack-bar-label');
                                   if ($snack.length) mensaje = $snack.text().trim();
                               }).then(() => {
                                   if (status === 200 || status === 201) {
                                       estado = 'exitosa';
                                       cy.log(`Característica resultado guardada: ${item.caracteristica}`);
                                   } else {
                                       estado = 'fallida';
                                       cy.log(`Error al guardar característica resultado. Status: ${status}`);
                                   }
                               }).then(() => {
                                   const nombreCaptura = `Captura-${contadorCaracteristicas}-CaracteristicaResultado-${estado}`;
                                   cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                       cy.task('guardarResultado', {
                                           describe: '019.8 - Características del resultado',
                                           crud: "Característica resultado",
                                           descripcion: `Transacción: ${codigoTX} - Característica: ${item.caracteristica} - Opera: ${item.caracteristicaOperar}`,
                                           estado: estado,
                                           numero: contadorCaracteristicas,
                                           mensaje: mensaje,
                                           evidencia: `${nombreCaptura}.png`
                                       });
                                   });
                               });
                           });
                       });
                   }).then(() => {
                   cy.wait(2000);
                   cy.get('iframe.frame', { timeout: 10000 })
                       .its('0.contentDocument.body')
                       .should('not.be.empty')
                       .then(cy.wrap)
                       .within(() => {
                           Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true });
                       });

                   cy.wait(2000);
                   cy.get('iframe.frame', { timeout: 10000 })
                       .its('0.contentDocument.body')
                       .should('not.be.empty')
                       .then(($body) => {
                           const $dialog = Cypress.$('mat-dialog-container:contains("Confirmar")', $body);
                           if ($dialog.length) {
                               cy.log('Diálogo Confirmar detectado');
                               const $btnSi = Cypress.$('button mat-icon:contains("check")', $dialog).parents('button');
                               if ($btnSi.length) {
                                   $btnSi.first().click();
                                   cy.wait(1000);
                               }
                           } else {
                               cy.log('No apareció diálogo de confirmación');
                           }
                       });
               });
           });
       });


    });

    describe.skip("019.9 -  Gestor de Transacciones > Tipos de cajero ...", function() {

        beforeEach(function() {
            Generales.IrAPantalla('transactionManager');
            cy.readFile('./JsonData/subTxTipoCajero.json').as('data');
            cy.wait(5000)
        });

        /*it("Agregar múltiples registros dinámicamente", function() {
            cy.log('Datos cargados:', JSON.stringify(this.data));

            cy.wrap(this.data.agregar).each((item) => {
                cy.then(() => {
                    // Limpiar logs de Cypress (opcional)
                    const doc = window.top.document;
                    const logContainer = doc.querySelector('.reporter .commands') ||
                        doc.querySelector('.command-list') ||
                        doc.querySelector('.runnable-commands-region');
                    if (logContainer) {
                        logContainer.innerHTML = '';
                    }
                });

                cy.log("📝 Procesando item:", item);
                cy.log(`🔢 Código TX: ${item.codigoTX}`);

                // Entrar al iframe y realizar acciones
                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        // Dentro del iframe: acciones de edición
                        Generales.filtrarPorCodigo(item.codigoTX); // o item.codigoTX - 777 para pruebas
                        Generales.abrirPanel("Opciones");
                        Generales.BtnIframe("Tipos de cajero", { timeout: 10000, force: true, skipContext: true });
                        GestorDeTransaccion.TiposCajero(item);
                        // Hacemos clic en Guardar sin interceptar
                        Generales.BtnIframe('Guardar', { timeout: 10000, force: true, skipContext: true });
                    }); // Salimos del iframe

                // Esperamos un tiempo para que la operación se complete (ajusta según sea necesario)
                cy.wait(2000);

                // Volvemos a entrar al iframe para hacer clic en "Atrás"
                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true });
                    });

                // Espera a que el posible diálogo aparezca
                cy.wait(2000);

                // Verificar si aparece el diálogo de confirmación DENTRO del iframe
                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        // Buscar el botón con color primary (el de confirmar)
                        cy.get('button[color="primary"]').then($btn => {
                            if ($btn.length > 0) {
                                cy.log('✅ Diálogo detectado, haciendo clic en Confirmar');
                                cy.wrap($btn.first()).click({ force: true });
                                // Opcional: esperar a que el diálogo desaparezca
                                cy.wait(1000);
                            } else {
                                cy.log('ℹ️ No apareció diálogo de confirmación');
                            }
                        });
                    });
            });
        });*/

        it("Agregar múltiples registros dinámicamente", function() {
            cy.log('Datos cargados:', JSON.stringify(this.data));

            let contadorTipos = 0;

            cy.wrap(this.data.agregar).each((item) => {
                cy.then(() => {
                    const doc = window.top.document;
                    const logContainer = doc.querySelector('.reporter .commands') ||
                        doc.querySelector('.command-list') ||
                        doc.querySelector('.runnable-commands-region');
                    if (logContainer) logContainer.innerHTML = '';
                });

                cy.log("Procesando item:", item);
                cy.log(`Código TX: ${item.codigoTX}`);

                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        Generales.filtrarPorCodigo(item.codigoTX);
                        Generales.abrirPanel("Opciones");
                        Generales.BtnIframe("Tipos de cajero", { timeout: 10000, force: true, skipContext: true });

                        contadorTipos++;
                        cy.log(`Tipo de cajero #${contadorTipos} para TX: ${item.codigoTX}`);

                        // Interacción que togglea los roles (puede no generar petición)
                        GestorDeTransaccion.TiposCajero(item);

                        // Hacemos clic en Guardar (solo cierra el modal, sin petición)
                        Generales.BtnIframe('Guardar', { timeout: 10000, force: true, skipContext: true });

                        // Esperamos un momento para que aparezca algún snackbar de error si lo hay
                        cy.wait(1000);

                        // Verificamos si hay algún mensaje de error en el documento principal
                        cy.document().then((doc) => {
                            const $body = Cypress.$(doc.body);
                            const $snack = $body.find('.snackbar, .mat-mdc-snack-bar-label');
                            let mensaje = '';
                            let estado = 'exitosa';

                            if ($snack.length) {
                                mensaje = $snack.text().trim();
                                // Si el snackbar contiene palabras como "error", "fallo", etc., marcamos como fallida
                                const textoLower = mensaje.toLowerCase();
                                if (textoLower.includes('error') || textoLower.includes('fallo') || textoLower.includes('no se pudo')) {
                                    estado = 'fallida';
                                    cy.log(`Error detectado: ${mensaje}`);
                                } else {
                                    cy.log(`${mensaje}`);
                                }
                            } else {
                                cy.log('No se detectaron errores, operación exitosa');
                            }

                            // Captura de pantalla y guardado en reporte
                            const nombreCaptura = `Captura-${contadorTipos}-TipoCajero-${estado}`;
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '019.9 - Tipos de cajero',
                                    crud: "Tipo de cajero",
                                    descripcion: `Transacción: ${item.codigoTX} - Tipos: ${JSON.stringify(item.roles)}`,
                                    estado: estado,
                                    numero: contadorTipos,
                                    mensaje: mensaje || (estado === 'exitosa' ? 'Operación completada' : 'Error desconocido'),
                                    evidencia: `${nombreCaptura}.png`
                                });
                            });
                        });
                    });

                cy.wait(2000);

                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true });
                    });

                cy.wait(2000);

                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        cy.get('button[color="primary"]').then($btn => {
                            if ($btn.length > 0) {
                                cy.log('Diálogo detectado, haciendo clic en Confirmar');
                                cy.wrap($btn.first()).click({ force: true });
                                cy.wait(1000);
                            } else {
                                cy.log('No apareció diálogo de confirmación');
                            }
                        });
                    });
            });
        });


    });

    describe.skip("019.10 -  Gestor de Transacciones > Comprobantes de Impresión ...", function() {

        beforeEach(function() {
            Generales.IrAPantalla('transactionManager');
            cy.readFile('./JsonData/subTxTipoComprobantesImpresiopn.json').as('data');
            cy.wait(5000)
        });

        /*it("Agregar múltiples registros dinámicamente", function() {
            cy.log('Datos cargados:', JSON.stringify(this.data));

            cy.wrap(this.data.agregar).each((item) => {
                cy.then(() => {
                    // Limpiar logs de Cypress (opcional)
                    const doc = window.top.document;
                    const logContainer = doc.querySelector('.reporter .commands') ||
                        doc.querySelector('.command-list') ||
                        doc.querySelector('.runnable-commands-region');
                    if (logContainer) {
                        logContainer.innerHTML = '';
                    }
                });

                cy.log("📝 Procesando item:", item);
                cy.log(`🔢 Código TX: ${item.codigoTX}`);

                // Entrar al iframe y realizar acciones
                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        cy.wait(1500)
                        Generales.filtrarPorCodigo(item.codigoTX); // o item.codigoTX - 777 para pruebas
                        Generales.abrirPanel("Opciones");
                        Generales.BtnIframe("Comprobantes", { timeout: 10000, force: true, skipContext: true });
                        Generales.BtnIframe("Agregar", { timeout: 10000, force: true, skipContext: true }, 'add-button');
//                        GestorDeTransaccion.ComprobantesImpresion(item);
                        GestorDeTransaccion.ComprobantesImpresion(
                            //item.tipoFormato, item.comprobante, item.esMandatorio, item.verComprobante, item.notificaComprobante,
                            // item.impAntesConsultarFirmas, item.copiasImprimir, item.etiqueta, item.etiqueta2

                            item.tipoFormato, item.comprobante, item.esMandatorio, item.verComprobante, item.notificaComprobante,
                            item.impAntesConsultarFirmas, item.copiasImprimir, ...item.etiquetas


                        );

                        Generales.BtnIframe('Guardar', { timeout: 10000, force: true, skipContext: true });
                    }); // Salimos del iframe

                // Esperamos un tiempo para que la operación se complete (ajusta según sea necesario)
                cy.wait(2000);

                // Volvemos a entrar al iframe para hacer clic en "Atrás"
                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true });
                    });

                // Espera a que el posible diálogo aparezca
                cy.wait(2000);
                // Verificar si aparece el diálogo de confirmación DENTRO del iframe
                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(($body) => {
                        // Buscar el diálogo de confirmación de forma síncrona (no lanza error si no existe)
                        const $dialog = Cypress.$('mat-dialog-container', $body);
                        if ($dialog.length > 0) {
                            cy.log('✅ Diálogo de confirmación detectado');
                            // Hacer clic en el botón primario (color="primary") dentro del diálogo
                            cy.wrap($dialog).find('button[color="primary"]').click();
                            // Opcional: esperar a que el diálogo desaparezca
                            cy.get('mat-dialog-container', { timeout: 5000 }).should('not.exist');
                        } else {
                            cy.log('ℹ️ No apareció diálogo de confirmación');
                        }
                    });
            });
        });*/

        it("Agregar múltiples registros dinámicamente", function() {
            cy.log('Datos cargados:', JSON.stringify(this.data));

            let contadorComprobantes = 0;

            cy.wrap(this.data.agregar).each((item) => {
                cy.then(() => {
                    const doc = window.top.document;
                    const logContainer = doc.querySelector('.reporter .commands') ||
                        doc.querySelector('.command-list') ||
                        doc.querySelector('.runnable-commands-region');
                    if (logContainer) logContainer.innerHTML = '';
                });

                cy.log("Procesando item:", item);
                cy.log(`Código TX: ${item.codigoTX}`);

                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        cy.wait(1500);
                        Generales.filtrarPorCodigo(item.codigoTX);
                        Generales.abrirPanel("Opciones");
                        Generales.BtnIframe("Comprobantes", { timeout: 10000, force: true, skipContext: true });
                        Generales.BtnIframe("Agregar", { timeout: 10000, force: true, skipContext: true }, 'add-button');

                        contadorComprobantes++;
                        const alias = `guardarComprobante-${contadorComprobantes}`;
                        cy.log(`Comprobante #${contadorComprobantes} para TX: ${item.codigoTX}`);

                        // URL CORRECTA según el log
                        cy.intercept('POST', '**/formatsPrintTransaction').as(alias);

                        GestorDeTransaccion.ComprobantesImpresion(
                            item.tipoFormato, item.comprobante, item.esMandatorio, item.verComprobante, item.notificaComprobante,
                            item.impAntesConsultarFirmas, item.copiasImprimir, ...item.etiquetas
                        );

                        Generales.BtnIframe('Guardar', { timeout: 10000, force: true, skipContext: true });

                        cy.wait(`@${alias}`, { timeout: 10000 }).then((interception) => {
                            const status = interception.response.statusCode;
                            let estado = 'fallida';
                            let mensaje = '';

                            cy.wait(500);
                            cy.document().then((doc) => {
                                const $body = Cypress.$(doc.body);
                                const $snack = $body.find('.snackbar, .mat-mdc-snack-bar-label');
                                if ($snack.length) mensaje = $snack.text().trim();
                            }).then(() => {
                                if (status === 200 || status === 201) {
                                    estado = 'exitosa';
                                    cy.log(`Comprobante guardado correctamente para TX: ${item.codigoTX}`);
                                } else {
                                    estado = 'fallida';
                                    cy.log(`Error al guardar comprobante. Status: ${status}`);
                                }
                            }).then(() => {
                                const nombreCaptura = `Captura-${contadorComprobantes}-Comprobante de Impresión-${estado}`;
                                cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                    cy.task('guardarResultado', {
                                        describe: '019.10 - Comprobantes de Impresión',
                                        crud: "Comprobante",
                                        descripcion: `Transacción: ${item.codigoTX} - Comprobante: ${item.comprobante}`,
                                        estado: estado,
                                        numero: contadorComprobantes,
                                        mensaje: mensaje,
                                        evidencia: `${nombreCaptura}.png`
                                    });
                                });
                            });
                        });
                    });

                cy.wait(2000);

                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true });
                    });

                cy.wait(2000);

                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(($body) => {
                        const $dialog = Cypress.$('mat-dialog-container', $body);
                        if ($dialog.length > 0) {
                            cy.log('Diálogo de confirmación detectado');
                            cy.wrap($dialog).find('button[color="primary"]').click();
                            cy.get('mat-dialog-container', { timeout: 5000 }).should('not.exist');
                        } else {
                            cy.log('No apareció diálogo de confirmación');
                        }
                    });
            });
        });


    });

    describe.skip("019.11 -  Gestor de Transacciones > Comprobantes de Notificaciones electrónicas ...", function() {

        beforeEach(function() {
            Generales.IrAPantalla('transactionManager');
            cy.readFile('./JsonData/subTxTipoComprobantesNotElectronica.json').as('data');
            cy.wait(2500)
        });

        /*it("Agregar múltiples registros dinámicamente", function() {
            cy.log('Datos cargados:', JSON.stringify(this.data));

            cy.wrap(this.data.agregar).each((item) => {
                cy.then(() => {
                    // Limpiar logs de Cypress (opcional)
                    const doc = window.top.document;
                    const logContainer = doc.querySelector('.reporter .commands') ||
                        doc.querySelector('.command-list') ||
                        doc.querySelector('.runnable-commands-region');
                    if (logContainer) {
                        logContainer.innerHTML = '';
                    }
                });

                cy.log("📝 Procesando item:", item);
                cy.log(`🔢 Código TX: ${item.codigoTX}`);

                // Entrar al iframe y realizar acciones
                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        // Dentro del iframe: acciones de edición
                        Generales.filtrarPorCodigo(item.codigoTX); // o item.codigoTX - 777 para pruebas
                        Generales.abrirPanel("Opciones");
                        Generales.BtnIframe("Comprobantes", { timeout: 10000, force: true, skipContext: true });
                        Generales.BtnIframe("Notificaciones electrónicas", { timeout: 10000, skipContext: true }, 'div[role="tab"]', true);
                        cy.wait(1500)
                        Generales.BtnIframe("Agregar", { timeout: 10000, force: true, skipContext: true }, 'add-button');
                        GestorDeTransaccion.ComprobantesNotElectronica(
                            //tipoFormato, comprobante, verComprobante, seNotificaMedio, esMandatorio, notificaComprobante
                            item.tipoFormato, item.comprobante, item.verComprobante, item.seNotificaMedio,
                            item.esMandatorio,  item.notificaComprobante
                        );
                        // Hacemos clic en Guardar sin interceptar
                        Generales.BtnIframe('Guardar', { timeout: 10000, force: true, skipContext: true });
                    }); // Salimos del iframe

                // Esperamos un tiempo para que la operación se complete (ajusta según sea necesario)
                cy.wait(2000);

                // Volvemos a entrar al iframe para hacer clic en "Atrás"
                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true });
                    });

                // Espera a que el posible diálogo aparezca
                cy.wait(2000);

                // Verificar si aparece el diálogo de confirmación DENTRO del iframe
                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        // Buscar el botón con color primary (el de confirmar)
                        cy.get('button[color="primary"]').then($btn => {
                            if ($btn.length > 0) {
                                cy.log('✅ Diálogo detectado, haciendo clic en Confirmar');
                                cy.wrap($btn.first()).click({ force: true });
                                // Opcional: esperar a que el diálogo desaparezca
                                cy.wait(1000);
                            } else {
                                cy.log('ℹ️ No apareció diálogo de confirmación');
                            }
                        });
                    });
            });
        });*/

        it("Agregar múltiples registros dinámicamente", function() {
            cy.log('Datos cargados:', JSON.stringify(this.data));

            let contadorNotificaciones = 0;

            cy.wrap(this.data.agregar).each((item) => {
                cy.then(() => {
                    const doc = window.top.document;
                    const logContainer = doc.querySelector('.reporter .commands') ||
                        doc.querySelector('.command-list') ||
                        doc.querySelector('.runnable-commands-region');
                    if (logContainer) logContainer.innerHTML = '';
                });

                cy.log("Procesando item:", item);
                cy.log(`Código TX: ${item.codigoTX}`);

                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        Generales.filtrarPorCodigo(item.codigoTX);
                        Generales.abrirPanel("Opciones");
                        Generales.BtnIframe("Comprobantes", { timeout: 10000, force: true, skipContext: true });
                        Generales.BtnIframe("Notificaciones electrónicas", { timeout: 10000, skipContext: true }, 'div[role="tab"]', true);
                        cy.wait(1500);
                        Generales.BtnIframe("Agregar", { timeout: 10000, force: true, skipContext: true }, 'add-button');

                        // ========== INICIO REPORTE ==========
                        contadorNotificaciones++;
                        const alias = `guardarNotificacion-${contadorNotificaciones}`;
                        cy.log(`Notificación electrónica #${contadorNotificaciones} para TX: ${item.codigoTX}`);

                        //URL CORRECTA según el log
                        cy.intercept('POST', '**/formatsPrintTransaction/managePrintFormat').as(alias);

                        GestorDeTransaccion.ComprobantesNotElectronica(
                            item.tipoFormato, item.comprobante, item.verComprobante, item.seNotificaMedio,
                            item.esMandatorio, item.notificaComprobante
                        );

                        Generales.BtnIframe('Guardar', { timeout: 10000, force: true, skipContext: true });

                        cy.wait(`@${alias}`, { timeout: 10000 }).then((interception) => {
                            const status = interception.response.statusCode;
                            let estado = 'fallida';
                            let mensaje = '';

                            cy.wait(500);
                            cy.document().then((doc) => {
                                const $body = Cypress.$(doc.body);
                                const $snack = $body.find('.snackbar, .mat-mdc-snack-bar-label');
                                if ($snack.length) mensaje = $snack.text().trim();
                            }).then(() => {
                                if (status === 200 || status === 201) {
                                    estado = 'exitosa';
                                    cy.log(`Notificación electrónica guardada correctamente para TX: ${item.codigoTX}`);
                                } else {
                                    estado = 'fallida';
                                    cy.log(`Error al guardar notificación electrónica. Status: ${status}`);
                                }
                            }).then(() => {
                                const nombreCaptura = `Captura-${contadorNotificaciones}-NotificacionElectronica-${estado}`;
                                cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                    cy.task('guardarResultado', {
                                        describe: '019.11 - Notificaciones electrónicas',
                                        crud: "Notificación electrónica",
                                        descripcion: `Transacción: ${item.codigoTX} - Comprobante: ${item.comprobante}`,
                                        estado: estado,
                                        numero: contadorNotificaciones,
                                        mensaje: mensaje,
                                        evidencia: `${nombreCaptura}.png`
                                    });
                                });
                            });
                        });
                        // ========== FIN REPORTE ==========
                    });

                cy.wait(2000);

                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true });
                    });

                cy.wait(2000);

                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        cy.get('button[color="primary"]').then($btn => {
                            if ($btn.length > 0) {
                                cy.log('Diálogo detectado, haciendo clic en Confirmar');
                                cy.wrap($btn.first()).click({ force: true });
                                cy.wait(1000);
                            } else {
                                cy.log('No apareció diálogo de confirmación');
                            }
                        });
                    });
            });
        });


    });

    describe.skip("020 - Datos en Envio de la transaccion ...", () =>{

        beforeEach(() => {
            Generales.IrAPantalla('transactionSendSpec')
        })

        /*it("Modificar  registro en Envio de la transaccion", () => {
            cy.fixture('envioTransaccionesUpdate').then((data) => {
                cy.wrap(data.modificar).each((item) => {
                    cy.log(`Insertando código: ${item.correlativo}`)

                    //Abrir formulario
                    Generales.BuscarRegistroDescripcion(item.descripcion)

                    Generales.BtnModificarRegistro()

                    //Validar que el modal realmente abrió
                    cy.contains('h2', 'Registro', { timeout: 10000 })
                        .should('be.visible')

                    // Llenar datos
                    EnvioTransaccion.EnvioTransacciones(
                        //transaccion, correlativo, descripcion, pagoServicio, requiereLogin, endpointDeLogueo, formatoDeEnvio,
                        //progGeneraInfoDeEnvio, tipoDatoEnvio, endpointDeEnvio, tipoDatoRecibido, archivoRespuesta, progRecibeInfo, analizaRespuesta

                        item.transaccion,
                        item.correlativo,
                        item.descripcion,
                        item.pagoServicio,
                        item.requiereLogin,
                        item.endpointDeLogueo,
                        item.formatoDeEnvio,
                        item.progGeneraInfoDeEnvio,
                        item.tipoDatoEnvio,
                        item.endpointDeEnvio,
                        item.tipoDatoRecibido,
                        item.archivoRespuesta,
                        item.progRecibeInfo,
                        item.analizaRespuesta
                    )

                    //Intercept backend
                    cy.intercept('POST', '**!/transactionSendSpec').as('guardar')

                    Generales.BtnAceptarRegistro()


                    /!*cy.wait('@guardar').then((interception) => {
                        const status = interception.response.statusCode
                        if (status === 200 || status === 201) {
                            cy.log('Registro insertado correctamente')
                            // Esperar que el modal desaparezca
                            cy.contains('h2', 'Nuevo Registro').should('not.exist')
                        } else {
                            cy.log(`Error detectado. Status: ${status}`)
                            Generales.BtnCancelarRegistro()
                            cy.contains('h2', 'Nuevo Registro').should('not.exist')
                        }
                    })*!/
                })
            })
        })*/

        it("Gestionar registros en Envío de la transacción (agregar/modificar)", () => {
            cy.readFile('./JsonData/envioTransacciones.json').then((data) => {
                let contador = 0;

                const procesarRegistro = (item, numero, operacion) => {
                    cy.log(`Operación: ${operacion} - Correlativo: ${item.correlativo}`);

                    // Asegurar estado limpio
                    cy.get('body').then(($body) => {
                        if ($body.find('h2:contains("Nuevo Registro")').length > 0 ||
                            $body.find('h2:contains("Registro")').length > 0) {
                            cy.log('Formulario abierto detectado, cerrando...');
                            Generales.BtnCancelarRegistro();
                        }
                    });

                    // Abrir formulario según operación
                    if (operacion === 'agregar') {
                        cy.log('➕ Agregando nuevo registro');
                        Generales.BtnAgregarRegistroSubnivel();
                        cy.contains('h2', 'Nuevo Registro', { timeout: 10000 }).should('be.visible');
                    } else if (operacion === 'modificar') {
                        cy.log('Modificando registro existente');
                        Generales.BuscarRegistroDescripcion(item.descripcion);
                        Generales.BtnModificarRegistro();
                        cy.contains('h2', 'Registro', { timeout: 10000 }).should('be.visible');
                    } else {
                        cy.log(`Operación desconocida: ${operacion} - se omite`);
                        return;
                    }

                    // Llenar datos
                    EnvioTransaccion.EnvioTransacciones(
                        item.transaccion,
                        item.correlativo,
                        item.descripcion,
                        item.pagoServicio,
                        item.requiereLogin,
                        item.endpointDeLogueo,
                        item.formatoDeEnvio,
                        item.progGeneraInfoDeEnvio,
                        item.tipoDatoEnvio,
                        item.endpointDeEnvio,
                        item.tipoDatoRecibido,
                        item.archivoRespuesta,
                        item.progRecibeInfo,
                        item.analizaRespuesta
                    );

                    // Interceptar cualquier método hacia rutas que contengan 'transactionSendSpec'
                    const alias = `guardarEnvio-${numero}`;
                    // Interceptar POST y PATCH con el mismo alias
                    cy.intercept('POST', '**/transactionSendSpec').as(alias);
                    cy.intercept('PATCH', '**/transactionSendSpec/*').as(alias);
                    cy.log(`📡 Interceptando POST y PATCH a **/transactionSendSpec* (alias: ${alias})`);

                    Generales.BtnAceptarRegistro();

                    cy.wait(`@${alias}`, { timeout: 10000 }).then((interception) => {
                        const status = interception.response.statusCode;
                        const method = interception.request.method;
                        let estado = 'fallida';
                        let mensaje = '';

                        cy.log(`📡 Método: ${method} - Status: ${status}`);

                        // Capturar mensaje del snackbar (usar el mismo selector que funciona en otros CRUD)
                        cy.wait(500);
                        cy.get('body').then(($body) => {
                            // Intentar con varios selectores comunes
                            let $snack = $body.find('span.message-snack');
                            if (!$snack.length) $snack = $body.find('.snackbar');
                            if (!$snack.length) $snack = $body.find('.mat-mdc-snack-bar-label');
                            if ($snack.length) mensaje = $snack.text().trim();
                            else cy.log('No se encontró snackbar');
                        }).then(() => {
                            if (status >= 200 && status < 300) {
                                estado = 'exitosa';
                                cy.log(`${operacion} correcto: ${item.correlativo}`);
                            } else {
                                estado = 'fallida';
                                cy.log(`Error al ${operacion}. Status: ${status}`);
                            }
                        }).then(() => {
                            // Captura de pantalla y guardado en reporte
                            const nombreCaptura = `Captura-${numero}-EnvioTransaccion-${estado}`;
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '020 - Datos en Envío de la transacción',
                                    crud: "Envío de transacción",
                                    descripcion: `Correlativo: ${item.correlativo} - Descripción: ${item.descripcion}`,
                                    estado: estado,
                                    numero: numero,
                                    mensaje: mensaje,
                                    evidencia: `${nombreCaptura}.png`
                                });
                            });
                        }).then(() => {
                            // Cerrar modal si aún está abierto
                            cy.get('body').then(($body) => {
                                const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0 ||
                                    $body.find('h2:contains("Registro")').length > 0;
                                if (modalAbierto) {
                                    cy.log('Modal sigue abierto → cerrando manualmente');
                                    Generales.Regresar();
                                    cy.wait(2000);
                                } else {
                                    cy.log('Modal ya cerrado');
                                }
                            });
                        });
                    });
                };

                // Procesar en el orden de las propiedades del JSON
                Object.entries(data).forEach(([key, registros]) => {
                    if (Array.isArray(registros) && registros.length > 0) {
                        const operacion = key.toLowerCase();
                        cy.wrap(registros).each((item) => {
                            contador++;
                            procesarRegistro(item, contador, operacion);
                        });
                    }
                });
            });
        });


    })

    describe.skip("021 -  Reglas...", () =>{


        beforeEach(() => {
            cy.wait(5000)
            Generales.IrAPantalla('rulesSpec')
        })

        it("Agregar múltiples registros en crud de Reglas", () => {
            cy.readFile('./JsonData/reglas.json').then((data) => {
                cy.wrap(data.agregar).each((item,index) => {
                    cy.log(`Insertando código: ${item.codigo}`)
                    const numero = index + 1;

                    //Asegurar estado limpio antes de comenzar
                    cy.get('body').then(($body) => {
                        if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                            cy.log('Formulario abierto detectado, cerrando...')
                            Generales.BtnCancelarRegistro()
                        }
                    })

                    //Abrir formulario
                    Generales.BtnAgregarRegistro()

                    //Validar que el modal realmente abrió
                    cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                        .should('be.visible')

                    // Llenar datos
                    Reglas.Reglas(
                        //codigo, nombre, descripcion, valorCicloVida, desde, hasta
                        item.codigo,
                        item.nombre,
                        item.descripcion,
                        item.valorCicloVida,
                        item.desde,
                        item.hasta
                    )

                    //Intercept backend
                    const alias = `guardar-${numero}`;
                    cy.intercept('POST', '**/rulesSpec').as(alias);

                    Generales.BtnAceptarRegistro()

                    // Esperar respuesta y decidir estado
                    cy.wait(`@${alias}`).then((interception) => {
                        const status = interception.response.statusCode;
                        let estado = 'fallida';
                        let mensaje = '';

                        cy.wait(500);
                        cy.get('body').then(($body) => {
                            const $snack = $body.find('span.message-snack');
                            if ($snack.length) mensaje = $snack.text().trim();
                        }).then(() => {
                            if (status === 200 || status === 201) {
                                estado = 'exitosa';
                                cy.log('Registro insertado correctamente');
                            } else {
                                estado = 'fallida';
                                cy.log(`Error detectado. Status: ${status}`);
                            }
                        }).then(() => {
                            const nombreCaptura = `Captura-${numero}-Reglas-${estado}`;
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '021 - Reglas',
                                    crud: "Reglas",
                                    descripcion: `Código: ${item.codigo} - Nombre: ${item.nombre}`,
                                    estado: estado,
                                    numero: numero,
                                    mensaje: mensaje,
                                    evidencia: `${nombreCaptura}.png`
                                });
                            });
                        }).then(() => {
                            cy.get('body').then(($body) => {
                                const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                                if (modalAbierto) {
                                    cy.log('Modal sigue abierto → cerrando manualmente');
                                    Generales.BtnCancelarRegistro();
                                    cy.wait(2000);
                                    cy.get('body').then(($bodyAfter) => {
                                        if ($bodyAfter.find('h2:contains("Nuevo Registro")').length > 0) {
                                            cy.log('El modal no se cerró después de intentarlo, pero continuamos');
                                        } else {
                                            cy.log('Modal cerrado correctamente');
                                        }
                                    });
                                } else {
                                    cy.log('Modal ya cerrado');
                                }
                            });
                        });
                    });




                })
            })
        })

    })

    describe.skip("021.1 - Reglas > Detalle de Reglas...", () =>{

        beforeEach(() => {
            cy.wait(5000)
            Generales.IrAPantalla('rulesSpec')
            cy.readFile('./JsonData/detalleReglas.json').as('dataDetalleReglas')
        })

        it("Agregar Multiples registros a sub nivel Reglas > Detalle de Reglas ", function () {

            const datos = this.dataDetalleReglas.agregar

            const agrupadas = datos.reduce((acc, item) => {
                if (!acc[item.nombreRegla]) {
                    acc[item.nombreRegla] = []
                }
                acc[item.nombreRegla].push(item)
                return acc
            }, {})

            let numero = 0

            cy.wrap(Object.keys(agrupadas)).each((nombreRegla) => {
                cy.log('Procesando Regla con nombre: ' + nombreRegla)

                // 🔎 Buscar Regla
                Generales.BuscarRegistroNombre(nombreRegla)
                Generales.NavegacionSubMenu('Detalle de reglas')

                return cy.wrap(agrupadas[nombreRegla]).each((registro) => {

                    numero++

                    Generales.BtnAgregarRegistroSubnivel()
                    cy.log("y el agregar que pedo")
                    //  const pais = registro.valorPais || registro.nombre
                    Reglas.DetalleReglas(
                        registro.correlativo,
                        registro.exprsion1,
                        registro.operador,
                        registro.expresion2,
                        registro.operadorLogico,
                        registro.tipoExpresion )

                    const alias = `guardar-${numero}`
                    cy.intercept('POST', '**/rulesDetail').as(alias)

                    Generales.BtnAceptarRegistro();
                    cy.wait(2000)

                    cy.wait(`@${alias}`).then((interception) => {
                        const status = interception.response.statusCode
                        let estado = 'fallida'
                        let mensaje = ''

                        cy.wait(500)
                        cy.get('body').then(($body) => {
                            const $snack = $body.find('span.message-snack')
                            if ($snack.length) mensaje = $snack.text().trim()
                        }).then(() => {
                            if (status === 200 || status === 201) {
                                estado = 'exitosa'
                                cy.log('Denominación insertada correctamente')
                            } else {
                                estado = 'fallida'
                                cy.log(`Error detectado. Status: ${status}`)
                            }
                        }).then(() => {
                            const nombreCaptura = `Captura-${numero}-Detalle de reglas-${estado}`
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '021.1 - Detalle de reglas',
                                    crud: "Detalle de reglas",
                                    descripcion: `Correlativo: ${registro.correlativo} - Expresión 1: ${registro.exprsion1}`,
                                    estado: estado,
                                    numero: numero,
                                    mensaje: mensaje,
                                    evidencia: `${nombreCaptura}.png`
                                })
                            })
                        }).then(() => {
                            // Cerrar el modal si aún está abierto
                            cy.get('body').then(($body) => {
                                const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0
                                if (modalAbierto) {
                                    cy.log('Modal sigue abierto → cerrando manualmente')
                                    Generales.BtnCancelarRegistro()
                                    cy.wait(2000)
                                    cy.get('body').then(($bodyAfter) => {
                                        if ($bodyAfter.find('h2:contains("Nuevo Registro")').length > 0) {
                                            cy.log('El modal no se cerró después de intentarlo, pero continuamos')
                                        } else {
                                            cy.log('Modal cerrado correctamente')
                                        }
                                    })
                                } else {
                                    cy.log('Modal ya cerrado')
                                }
                            })
                        })
                    })

                    // Opcional: Verificar que el modal de denominación se cerró completamente
                    cy.get('mat-dialog-container', { timeout: 10000 }).should('not.exist')
                }).then(() => {
                    cy.log('Regresando al nivel principal después de procesar todas las denominaciones de la moneda')

                    // Primer regreso - SALIR DEL SUBNIVEL (listado de denominaciones)
                    cy.wait(1000)
                    Generales.Regresar()
                    // Verificar que salimos del subnivel (modal cerrado)
                    cy.get('mat-dialog-container', { timeout: 5000 }).should('not.exist')

                    // Segundo regreso - SALIR DEL DETALLE DE MONEDA
                    cy.wait(3000)
                    Generales.Regresar()
                    // Verificar que estamos en el listado principal de monedas
                    cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 }).should('be.visible')
                })


            })
        })

    })

    describe.skip("022 -  Acciones Condicionadas ...", () =>{

        beforeEach(() => {
            cy.wait(5000)
            Generales.IrAPantalla('conditionedActions')
        })

        it("Agregar múltiples registros dinámicamente", () => {
            cy.readFile('./JsonData/accionesCondicionadas.json').then((data) => {
                cy.wrap(data.agregar).each((item, index) => {
                    cy.log(`Insertando código: ${item.codigo}`)
                    const numero = index + 1;

                    //Asegurar estado limpio antes de comenzar
                    cy.get('body').then(($body) => {
                        if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                            cy.log('Formulario abierto detectado, cerrando...')
                            Generales.BtnCancelarRegistro()
                        }
                    })

                    //Abrir formulario
                    Generales.BtnAgregarRegistros()
                    cy.wait(1000)

                    //Validar que el modal realmente abrió
                    cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                        .should('be.visible')

                    // Llenar datos
                    AccionCondicionada.AccionCodicionada(
                        item.transaccion,
                        item.correlativo,
                        item.regla,
                        item.accion,
                        item.ejecutar,
                        item.descripcion
                    )

                    //Intercept backend
                    const alias = `guardar-${numero}`;
                    cy.intercept('POST', '**/conditionedActions').as(alias);

                    Generales.BtnAceptarRegistro()

                    cy.wait(1500)
                    // Esperar respuesta y decidir estado
                    cy.wait(`@${alias}`).then((interception) => {
                        const status = interception.response.statusCode;
                        let estado = 'fallida';
                        let mensaje = '';

                        cy.wait(500);
                        cy.get('body').then(($body) => {
                            const $snack = $body.find('span.message-snack');
                            if ($snack.length) mensaje = $snack.text().trim();
                        }).then(() => {
                            if (status === 200 || status === 201) {
                                estado = 'exitosa';
                                cy.log('Registro insertado correctamente');
                            } else {
                                estado = 'fallida';
                                cy.log(`Error detectado. Status: ${status}`);
                            }
                        }).then(() => {
                            const nombreCaptura = `Captura-${numero}-AccionesCondicionadas-${estado}`;
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '022 - Acciones Condicionadas',
                                    crud: "Acciones Condicionadas",
                                    descripcion: `Correlativo: ${item.correlativo} - Acción: ${item.accion}`,
                                    estado: estado,
                                    numero: numero,
                                    mensaje: mensaje,
                                    evidencia: `${nombreCaptura}.png`
                                });
                            });
                        }).then(() => {
                            cy.get('body').then(($body) => {
                                const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                                if (modalAbierto) {
                                    cy.log('Modal sigue abierto → cerrando manualmente');
                                    Generales.BtnCancelarRegistro();
                                    cy.wait(2000);
                                    cy.get('body').then(($bodyAfter) => {
                                        if ($bodyAfter.find('h2:contains("Nuevo Registro")').length > 0) {
                                            cy.log('El modal no se cerró después de intentarlo, pero continuamos');
                                        } else {
                                            cy.log('Modal cerrado correctamente');
                                        }
                                    });
                                } else {
                                    cy.log('Modal ya cerrado');
                                }
                            });
                        });
                    });



                })
            })
        })

    })

    describe.skip("022.1 - AccionesCondicionadas > Afecta totales condicionados...", () =>{

        beforeEach(() => {
            cy.wait(5000)
            Generales.IrAPantalla('conditionedActions')
            cy.fixture('afectaTotalesCondicionados').as('afectarTotalesCondicionados')
        })

        it("Agregar registros a sub nivel", function () {

            const datos = this.afectarTotalesCondicionados.agregar

            // Agrupar por regla + transacción + un identificador de lote
            // Podemos usar el índice para separar los grupos
            let grupoActual = 0
            let ultimaKey = null

            const agrupadas = datos.reduce((acc, item, index) => {
                const keyBase = `${item.nombreReglaAC}|${item.transaccionAC || 'null'}`

                // Si es el primer elemento o cambia la key base, crear nuevo grupo
                if (index === 0 || keyBase !== ultimaKey) {
                    grupoActual++
                    ultimaKey = keyBase
                }

                const keyConLote = `${keyBase}|lote${grupoActual}`

                if (!acc[keyConLote]) {
                    acc[keyConLote] = {
                        nombreRegla: item.nombreReglaAC,
                        transaccion: item.transaccionAC || null,
                        lote: grupoActual,
                        registros: []
                    }
                }
                acc[keyConLote].registros.push(item)
                return acc
            }, {})

            // Iterar sobre las claves del objeto agrupado
            cy.wrap(Object.keys(agrupadas)).each((key) => {
                const grupo = agrupadas[key]

                cy.log(`🔄 Procesando Regla: "${grupo.nombreRegla}", Transacción: "${grupo.transaccion || 'vacía'}"`)

                // 🔎 Buscar por Regla y Transacción (CORREGIDO: usar grupo, no item)
                Generales.BuscarRegistroEnTabla([
                    { columna: 'Regla', valor: grupo.nombreRegla },
                    { columna: 'Transacción', valor: grupo.transaccion || '' }
                ])

                // Navegar al submenú
                Generales.NavegacionSubMenu('Afectar totales condicionados')

                // Agregar cada registro del grupo
                return cy.wrap(grupo.registros).each((registro) => {
                    Generales.BtnAgregarRegistroSubnivel()
                    cy.log(`📝 Agregando registro - Correlativo: ${registro.correlativo}, Caracteristica: ${registro.caracteristica}`)

                    cy.wait(2000)
                    AccionCondicionada.ACAfecTotalCon(
                        registro.correlativo,
                        registro.caracteristica,
                        registro.arbolRaiz,
                        registro.totalCajero,
                        registro.operador,
                        registro.afectar
                    )

                    Generales.BtnAceptarRegistro()
                    cy.wait(2000)

                    return cy.get('body').then(($body) => {
                        // Buscar específicamente el snackbar de error
                        const snackBarError = $body.find('.snack-container__error')

                        if (snackBarError.length > 0) {
                            // Obtener el mensaje específico
                            const mensajeError = snackBarError.find('.message-snack').text()
                            cy.log(`⚠️ Error detectado: ${mensajeError}`)

                            // Cerrar el snackbar si tiene botón de cerrar
                            cy.get('.snack--btn-close').click()

                            Generales.BtnCancelarRegistro()
                            cy.log('❌ Registro duplicado - cancelando')
                        } else {
                            cy.log('✅ Registro agregado correctamente')
                        }

                        return cy.get('mat-dialog-container', { timeout: 10000 })
                            .should('not.exist')
                    })
                }).then(() => {
                    cy.log('🔙 Regresando al nivel principal')

                    // Primer regreso - SALIR DEL SUBNIVEL
                    return cy.then(() => {
                        cy.wait(3000)
                        Generales.Regresar()
                        // Verificar que salimos del subnivel (modal cerrado)
                        return cy.get('mat-dialog-container', { timeout: 5000 })
                            .should('not.exist')
                    }).then(() => {
                        // Segundo regreso - SALIR DEL DETALLE
                        cy.wait(3000)
                        Generales.Regresar()
                        // Verificar que estamos en el listado principal
                        return cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
                            .should('be.visible')
                    })
                })
            })
        })


    })

    describe.skip("022.2 - AccionesCondicionadas > Transacciones asociadas condicionadas ...", () =>{

        before(() => {
            cy.fixture('transaccionesAsociadasCondicionadas').as('transaccionesAsociadasCondicionadas')
        })

        beforeEach(() => {
            Generales.IrAPantalla('conditionedActions')
        })

        it("Agregar registros a sub nivel", function () {

            const datos = this.transaccionesAsociadasCondicionadas.agregar

            // Agrupar por regla + transacción + un identificador de lote
            // Podemos usar el índice para separar los grupos
            let grupoActual = 0
            let ultimaKey = null

            const agrupadas = datos.reduce((acc, item, index) => {
                const keyBase = `${item.nombreReglaAC}|${item.transaccionAC || 'null'}`

                // Si es el primer elemento o cambia la key base, crear nuevo grupo
                if (index === 0 || keyBase !== ultimaKey) {
                    grupoActual++
                    ultimaKey = keyBase
                }

                const keyConLote = `${keyBase}|lote${grupoActual}`

                if (!acc[keyConLote]) {
                    acc[keyConLote] = {
                        nombreRegla: item.nombreReglaAC,
                        transaccion: item.transaccionAC || null,
                        lote: grupoActual,
                        registros: []
                    }
                }
                acc[keyConLote].registros.push(item)
                return acc
            }, {})

            // Iterar sobre las claves del objeto agrupado
            cy.wrap(Object.keys(agrupadas)).each((key) => {
                const grupo = agrupadas[key]

                cy.log(`🔄 Procesando Regla: "${grupo.nombreRegla}", Transacción: "${grupo.transaccion || 'vacía'}"`)

                // 🔎 Buscar por Regla y Transacción (CORREGIDO: usar grupo, no item)
                Generales.BuscarRegistroEnTabla([
                    { columna: 'Regla', valor: grupo.nombreRegla },
                    { columna: 'Transacción', valor: grupo.transaccion || '' }
                ])

                // Navegar al submenú
                Generales.NavegacionSubMenu('Transacciones asociadas condicionadas')

                // Agregar cada registro del grupo
                return cy.wrap(grupo.registros).each((registro) => {
                    Generales.BtnAgregarRegistroSubnivel()
                    cy.log(`📝 Agregando registro - Correlativo: ${registro.correlativo}, Caracteristica: ${registro.caracteristica}`)

                    AccionCondicionada.ACTxAsociadasCondicionadas(
                        registro.txAsociada,
                        registro.correlativo,
                        registro.tipoAsociacion,
                        registro.tipoAccion,
                        registro.descripcion,
                        registro.acumular,
                        registro.permiteRechazo,
                        registro.modoInverso,
                        registro.permiteCanacelacion
                    )

                    Generales.BtnAceptarRegistro()
                    cy.wait(2000)

                    return cy.get('body').then(($body) => {
                        // Buscar específicamente el snackbar de error
                        const snackBarError = $body.find('.snack-container__error')

                        if (snackBarError.length > 0) {
                            // Obtener el mensaje específico
                            const mensajeError = snackBarError.find('.message-snack').text()
                            cy.log(`⚠️ Error detectado: ${mensajeError}`)

                            // Cerrar el snackbar si tiene botón de cerrar
                            cy.get('.snack--btn-close').click()

                            Generales.BtnCancelarRegistro()
                            cy.log('❌ Registro duplicado - cancelando')
                        } else {
                            cy.log('✅ Registro agregado correctamente')
                        }

                        return cy.get('mat-dialog-container', { timeout: 10000 })
                            .should('not.exist')
                    })
                }).then(() => {
                    cy.log('🔙 Regresando al nivel principal')

                    // Primer regreso - SALIR DEL SUBNIVEL
                    return cy.then(() => {
                        cy.wait(3000)
                        Generales.Regresar()
                        // Verificar que salimos del subnivel (modal cerrado)
                        return cy.get('mat-dialog-container', { timeout: 5000 })
                            .should('not.exist')
                    }).then(() => {
                        // Segundo regreso - SALIR DEL DETALLE
                        cy.wait(3000)
                        Generales.Regresar()
                        // Verificar que estamos en el listado principal
                        return cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
                            .should('be.visible')
                    })
                })
            })
        })
    })


})