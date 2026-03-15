import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import gestorDeTransaccionesCy from "../support/PageObjects/Specs-view-PO/GestorDeTransacciones.cy";

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

    it("Arrastrar características por transacción", function() {
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
    });


});