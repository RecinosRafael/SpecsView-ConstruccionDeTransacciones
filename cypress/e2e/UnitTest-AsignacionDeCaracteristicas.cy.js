import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import gestorDeTransaccionesCy from "../support/PageObjects/Specs-view-PO/GestorDeTransacciones.cy";
require('@cypress/xpath');
require('cypress-real-events')


const Generales = new metodosGeneralesPomCy();
const GestorDeTransacciones = new gestorDeTransaccionesCy()

describe("Prueba de arrastre de características", () => {

    before(() => {
        Generales.Login(
            Cypress.env('BASE_URL'),
            Cypress.env('USER'),
            Cypress.env('PASS')
        );
        cy.fixture('asignacionDeCaracteristicas').as('dataAsignacionDeCaracteristicas');
    });

    beforeEach(() => {
        Generales.IrAPantalla('transactionManager');
    });

    /*it("Arrastrar características por transacción", function() {
        const transacciones = this.dataAsignacionDeCaracteristicas.agregar;

        cy.log(`📋 Procesando ${transacciones.length} transacciones`);

        cy.get('iframe.frame', { timeout: 10000 })
            .its('0.contentDocument.body')
            .should('not.be.empty')
            .then(cy.wrap)
            .within(() => {

                // Recorrer cada transacción del JSON
                transacciones.forEach((transaccion, indexTransaccion) => {
                    const codigoTRX = transaccion.codigoTRX;
                    const caracteristicas = transaccion.caracteristicasTrx;

                    cy.log(`\n========== TRANSACCIÓN ${indexTransaccion + 1}/${transacciones.length} ==========`);
                    cy.log(`🔍 Código: ${codigoTRX}`);
                    cy.log(`📋 Características a arrastrar: ${caracteristicas.length}`);

                    // PASO 1: Filtrar por código
                    Generales.filtrarPorCodigo(codigoTRX);

                    // PASO 2: Verificar que se encontró el registro
                    cy.contains('td.mat-column-codeOfTheTransaction', codigoTRX, { timeout: 10000 })
                        .should('be.visible')
                        .then(() => {
                            cy.log(`✅ Registro ${codigoTRX} encontrado`);
                        });

                    // PASO 3: Abrir panel Opciones
                    cy.xpath("//mat-expansion-panel-header[.//h2[normalize-space()='Opciones']]")
                        .then($header => {
                            if ($header.attr('aria-expanded') !== 'true') {
                                cy.wrap($header).click({ force: true });
                                cy.wait(500);
                            }
                        });

                    // PASO 4: Arrastrar TODAS las características de ESTA transacción
                    cy.log(`🖱️ Arrastrando ${caracteristicas.length} características...`);

                    caracteristicas.forEach((caracteristica, idx) => {
                        cy.log(`   [${idx + 1}/${caracteristicas.length}] "${caracteristica}"`);

                        // Arrastrar la característica
                        GestorDeTransacciones.arrastrarCaracteristicaAPaso(caracteristica);

                        // Validar que llegó
                        GestorDeTransacciones.validarCaracteristicaEnDestino(caracteristica);
                    });

                    cy.log(`✅ Todas las características de ${codigoTRX} arrastradas`);

                    // PASO 5: Regresar al listado principal para la siguiente transacción
                    cy.log(`\n🔙 Regresando al listado principal...`);

                    // Primer Atrás
                    cy.wait(2000);
                    Generales.BtnIframe("Atrás", { timeout: 10000, force: true, skipContext: true });

                    // Confirmar diálogo si aparece
                    cy.wait(1000);
                    cy.get('mat-dialog-container', { timeout: 5000 }).then($dialog => {
                        if ($dialog.length > 0) {
                            cy.xpath("//mat-dialog-actions//button[.//mat-icon[text()='check']]")
                                .click({ force: true });
                            cy.wait(1000);
                        }
                    });

                    // Segundo Atrás
                    cy.wait(2000);
                    Generales.BtnIframe("Atrás", { timeout: 10000, force: true, skipContext: true });

                    // Verificar que estamos en listado principal
                    cy.get('mat-expansion-panel-header').contains('Filtros', { timeout: 15000 })
                        .should('be.visible');

                    cy.log(`✅ Transacción ${codigoTRX} completada\n`);
                });

                cy.log('\n🎉 TODAS LAS TRANSACCIONES PROCESADAS EXITOSAMENTE');
            });
    });*/

    it("Arrastrar características por transacción", function() {
        const transacciones = this.dataAsignacionDeCaracteristicas.agregar;

        cy.log(`📋 Procesando ${transacciones.length} transacciones`);

        cy.get('iframe.frame', { timeout: 10000 })
            .its('0.contentDocument.body')
            .should('not.be.empty')
            .then(cy.wrap)
            .within(() => {

                transacciones.forEach((transaccion, indexTransaccion) => {
                    const codigoTRX = transaccion.codigoTRX;
                    const caracteristicas = transaccion.caracteristicasTrx;

                    cy.log(`\n========== TRANSACCIÓN ${indexTransaccion + 1}/${transacciones.length} ==========`);
                    cy.log(`🔍 Código: ${codigoTRX}`);
                    cy.log(`📋 Características: ${caracteristicas.length}`);

                    // PASO 1: Filtrar por código
                    Generales.filtrarPorCodigo(codigoTRX);
                    cy.wait(1000);

                    // PASO 2: Abrir panel Opciones (SIN XPath)
                    cy.log('📂 Abriendo Opciones');
                    cy.contains('mat-expansion-panel-header', 'Opciones', { timeout: 10000 })
                        .should('be.visible')
                        .then($header => {
                            const $panel = $header.closest('mat-expansion-panel');
                            if (!$panel.hasClass('mat-expanded')) {
                                cy.wrap($header).click({ force: true });
                                cy.wait(500);
                            }
                        });

                    // PASO 3: Abrir panel Características (USANDO EL NUEVO MÉTODO)
                    GestorDeTransacciones.abrirPanelCaracteristicas();

                    // PASO 4: Verificar que el área de destino está visible
                    cy.get('div.cdk-drop-list#characteristics', { timeout: 10000 })
                        .should('be.visible');

                    // PASO 5: Arrastrar características
                    caracteristicas.forEach((caracteristica, idx) => {
                        cy.log(`   [${idx + 1}/${caracteristicas.length}] "${caracteristica}"`);
                        GestorDeTransacciones.esperarCargaCaracteristicas();

                        GestorDeTransacciones.arrastrarCaracteristicaAPaso(caracteristica);
                        GestorDeTransacciones.validarCaracteristicaEnDestino(caracteristica);

                        cy.wait(500);
                    });

                    cy.log(`✅ Características de ${codigoTRX} arrastradas`);

                    // PASO 6: Regresar al listado
                    cy.wait(2000);
                    Generales.BtnIframe("Atrás", { timeout: 10000, force: true, skipContext: true });

                    cy.wait(1000);

                    // Confirmar diálogo si aparece
                    cy.get('mat-dialog-container', { timeout: 5000 }).then($dialog => {
                        if ($dialog.length > 0) {
                            cy.contains('mat-dialog-actions button', 'check')
                                .click({ force: true });
                            cy.wait(1000);
                        }
                    });

                    // Segundo Atrás
                    Generales.BtnIframe("Atrás", { timeout: 10000, force: true, skipContext: true });

                    // Verificar listado principal
                    cy.contains('mat-expansion-panel-header', 'Filtros', { timeout: 15000 })
                        .should('be.visible');

                    cy.wait(1000);
                });
            });
    });


});