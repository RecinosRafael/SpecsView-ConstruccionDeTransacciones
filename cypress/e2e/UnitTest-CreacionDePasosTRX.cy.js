import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import GestorPomCy from "../support/PageObjects/Specs-view-PO/GestorDeTransacciones.cy";
import 'cypress-xpath';

const Generales = new metodosGeneralesPomCy();
const GestorDeTransacciones = new GestorPomCy();

describe("Prueba unitaria del Crud Gestor de Transacciones ...", function() {
    Cypress.on('uncaught:exception', (err, Runnable) => {
        return false;
    });

    before(function() {
        Generales.Login(
            Cypress.env('BASE_URL'),
            Cypress.env('USER'),
            Cypress.env('PASS')
        );
    });

    beforeEach(function() {
        Generales.IrAPantalla('transactionManager');
        cy.fixture('creacionDePasosTRX').as('data')
    });


    //este funciona
    it("Agregar múltiples registros dinámicamente", function() {
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

                        GestorDeTransacciones.definirPaso(
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
    });

    /*it("Agregar múltiples registros dinámicamente", function() {
        cy.log('Datos cargados:', JSON.stringify(this.data));

        // Agrupar manteniendo el orden del JSON original
        const agrupadas = {};
        const ordenCodigos = [];

        this.data.agregar.forEach(item => {
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
                    const pasos = agrupadas[codigoTRX];

                    cy.log(`\n🔄 Procesando transacción: ${codigoTRX} (${pasos.length} pasos)`);

                    // PASO 1: Filtrar por código
                    Generales.filtrarPorCodigo(codigoTRX);

                    // PASO 2: Verificar que se encontró el registro y hacer clic para entrar al detalle
                    cy.contains('td.mat-column-codeOfTheTransaction', codigoTRX, { timeout: 10000 })
                        .should('be.visible')
                        .click({ force: true })
                        .then(() => {
                            cy.log(`✅ Registro ${codigoTRX} encontrado y seleccionado`);
                        });

                    // PASO 3: Esperar a que cargue el detalle
                    cy.wait(2000);

                    // PASO 4: Abrir panel Opciones
                    cy.xpath("//mat-expansion-panel-header[.//h2[normalize-space()='Opciones']]")
                        .then($header => {
                            if ($header.attr('aria-expanded') !== 'true') {
                                cy.wrap($header).click({ force: true });
                                cy.wait(500);
                            }
                        });

                    // PASO 5: Procesar TODOS los pasos de esta transacción SIN SALIR
                    cy.wrap(pasos).each((paso, index) => {
                        cy.log(`📝 Paso ${index + 1}/${pasos.length}: ${paso.nombrePaso}`);

                        GestorDeTransacciones.definirPaso(
                            paso.nombrePaso,
                            paso.tieneReglaCondionanteDePaso,
                            paso.typeReglaParaCondicionarPaso,
                            paso.descripcionPasoTrx
                        );

                        cy.wait(500);
                    }).then(() => {
                        cy.log(`✅ Todos los ${pasos.length} pasos de ${codigoTRX} creados`);

                        // PASO 6: ATRÁS - Salir de la transacción
                        cy.wait(2000);
                        Generales.BtnIframe("Atrás", { timeout: 10000, force: true, skipContext: true });

                        // PASO 7: VERIFICAR DIÁLOGO DE CONFIRMACIÓN
                        cy.wait(1000);

                        cy.document().then(doc => {
                            const $dialog = Cypress.$('mat-dialog-container', doc);
                            if ($dialog.length > 0) {
                                cy.log('⚠️ Diálogo de confirmación detectado');

                                // CORRECCIÓN: Buscar el botón que contiene texto "Sí"
                                cy.xpath("//mat-dialog-actions//button[contains(text(), 'Sí')]")
                                    .should('be.visible')

                                Generales.BtnIframe("Si", { timeout: 10000, force: true, skipContext: true });


                                cy.wait(3000);
                                cy.log('✅ Clic en Sí realizado');
                            } else {
                                cy.log('ℹ️ No apareció diálogo de confirmación');
                            }
                        });

                        // PASO 8: ESPERAR A QUE LA UI SE ESTABILICE
                        cy.wait(2000);

                        // PASO 9: VERIFICAR QUE ESTAMOS EN EL LISTADO PRINCIPAL
                        cy.log('🔍 Verificando retorno al listado principal...');

                        // Verificar que estamos de vuelta en el listado
                        cy.get('mat-expansion-panel-header').contains('Filtros', { timeout: 15000 })
                            .should('be.visible');
                        cy.get('table', { timeout: 10000 }).should('be.visible');

                        cy.log(`✅ Transacción ${codigoTRX} completada - listo para siguiente`);
                    });
                });
            });
    });*/

    /*it("Agregar múltiples registros dinámicamente", function() {
        cy.log('Datos cargados:', JSON.stringify(this.data));

        // Agrupar manteniendo el orden del JSON original
        const agrupadas = {};
        const ordenCodigos = [];

        this.data.agregar.forEach(item => {
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
                    const pasos = agrupadas[codigoTRX];

                    cy.log(`\n🔄 Procesando transacción: ${codigoTRX} (${pasos.length} pasos)`);

                    // PASO 1: Filtrar por código
                    Generales.filtrarPorCodigo(codigoTRX);

                    // PASO 2: Verificar que se encontró el registro y hacer clic para entrar al detalle
                    cy.contains('td.mat-column-codeOfTheTransaction', codigoTRX, { timeout: 10000 })
                        .should('be.visible')
                        .click({ force: true })
                        .then(() => {
                            cy.log(`✅ Registro ${codigoTRX} encontrado y seleccionado`);
                        });

                    // PASO 3: Esperar a que cargue el detalle
                    cy.wait(2000);

                    // PASO 4: Abrir panel Opciones
                    cy.xpath("//mat-expansion-panel-header[.//h2[normalize-space()='Opciones']]")
                        .then($header => {
                            if ($header.attr('aria-expanded') !== 'true') {
                                cy.wrap($header).click({ force: true });
                                cy.wait(500);
                            }
                        });

                    // PASO 5: Procesar TODOS los pasos de esta transacción SIN SALIR
                    cy.wrap(pasos).each((paso, index) => {
                        cy.log(`📝 Paso ${index + 1}/${pasos.length}: ${paso.nombrePaso}`);

                        GestorDeTransacciones.definirPaso(
                            paso.nombrePaso,
                            paso.tieneReglaCondionanteDePaso,
                            paso.typeReglaParaCondicionarPaso,
                            paso.descripcionPasoTrx
                        );

                        cy.wait(500);
                    }).then(() => {
                        cy.log(`✅ Todos los ${pasos.length} pasos de ${codigoTRX} creados`);

                        // PASO 6: ATRÁS - Salir de la transacción
                        cy.wait(2000);
                        Generales.BtnIframe("Atrás", { timeout: 10000, force: true, skipContext: true });

                        // PASO 7: VERIFICAR DIÁLOGO DE CONFIRMACIÓN (CORREGIDO)
                        cy.wait(1000);

                        cy.get('iframe.frame', { timeout: 10000 })
                            .its('0.contentDocument.body')
                            .should('not.be.empty')
                            .then(($body) => {
                                // Buscar el diálogo de confirmación de forma síncrona
                                const $dialog = Cypress.$('mat-dialog-container', $body);
                                if ($dialog.length > 0) {
                                    cy.log('✅ Diálogo de confirmación detectado');
                                    // Hacer clic en el botón primario dentro del diálogo
                                    cy.wrap($dialog).find('button[color="primary"]').click();
                                    // Esperar a que el diálogo desaparezca
                                    cy.get('mat-dialog-container', { timeout: 5000 }).should('not.exist');
                                    cy.log('✅ Diálogo cerrado correctamente');
                                } else {
                                    cy.log('ℹ️ No apareció diálogo de confirmación');
                                }
                            });

                        // PASO 8: ESPERAR A QUE LA UI SE ESTABILICE
                        cy.wait(2000);

                        // PASO 9: VERIFICAR QUE ESTAMOS EN EL LISTADO PRINCIPAL
                        cy.log('🔍 Verificando retorno al listado principal...');

                        // Verificar que estamos de vuelta en el listado
                        cy.get('mat-expansion-panel-header').contains('Filtros', { timeout: 15000 })
                            .should('be.visible');
                        cy.get('table', { timeout: 10000 }).should('be.visible');

                        cy.log(`✅ Transacción ${codigoTRX} completada - listo para siguiente`);
                    });
                });
            });
    });*/


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

                        GestorDeTransacciones.definirPaso(
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

            // CORRECCIÓN: Verificar diálogo SIN USAR BtnIframe
            cy.get('iframe.frame', { timeout: 10000 })
                .its('0.contentDocument.body')
                .should('not.be.empty')
                .then(cy.wrap)
                .within(() => {
                    // Buscar el botón con color primary (el de confirmar)
                    cy.get('button[color="primary"]').then($btn => {
                        if ($btn.length > 0) {
                            cy.log('✅ Diálogo detectado, haciendo clic en Confirmar');
                            // ✅ CLICK DIRECTO - NO USA BtnIframe
                            $btn.first().click({ force: true });
                            cy.wait(1000);
                        } else {
                            cy.log('ℹ️ No apareció diálogo de confirmación - continuando flujo normal');
                        }
                    });
                });
        });
    });*/





});