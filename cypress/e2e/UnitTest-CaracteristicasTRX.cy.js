import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import GestorPomCy from "../support/PageObjects/Specs-view-PO/GestorDeTransacciones.cy";
import 'cypress-xpath';

const Generales = new metodosGeneralesPomCy()
const GestorDeTransacciones = new GestorPomCy()


describe("Prueba unitaria del Crud Gestor de Transacciones ...", () =>{

    Cypress.on('uncaught:exception',(err,Runnable) =>{
        return false
    })

    //Login y visita al Specs-view
    before(() => {
        Generales.Login(
            Cypress.env('BASE_URL'),
            Cypress.env('USER'),
            Cypress.env('PASS')
        )

        cy.fixture('caracteristicasTrx').as('dataCaracteristicasTrx')
    })



    beforeEach(() => {
        Generales.IrAPantalla('transactionManager')
    })

    it("Agregar registros a sub nivel", function () {
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
                        cy.log(`\n📌 Procesando lote de características ${index + 1}/${agrupadas[codigoTRX].length}`);
                        GestorDeTransacciones.CaracteristicasTrx(registro.caracteristicasTrx);
                        cy.log(`✅ Lote ${index + 1} completado`);
                    }).then(() => {
                        cy.log(`\n🔙 Regresando al nivel principal para código ${codigoTRX}`);

                        // ✅ PRIMER ATRÁS - Salir del detalle de características
                        cy.wait(2000);
                        Generales.BtnIframe("Atrás", { timeout: 10000, force: true, skipContext: true });

                        // ✅ VERIFICAR DIÁLOGO DE CONFIRMACIÓN
                        cy.wait(1000);
                        cy.get('mat-dialog-container', { timeout: 5000 }).then($dialog => {
                            if ($dialog.length > 0) {
                                cy.log('⚠️ Diálogo de confirmación detectado');
                                cy.xpath("//mat-dialog-actions//button[.//mat-icon[text()='check']]")
                                    .click({ force: true });
                                cy.wait(1000);
                            }
                        });

                        // 🔹 VERIFICACIÓN MEJORADA - SIN ERRORES
                        cy.log('🔍 Verificando que estamos en el listado principal...');

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
                                cy.log('✅ Elemento "Buscar por" encontrado');
                            } else {
                                cy.log('⚠️ Elemento "Buscar por" no encontrado (no es obligatorio)');
                            }
                        });

                        cy.log(`✅ Transacción ${codigoTRX} completada - listo para siguiente código`);
                    });
                });
            });
    });





})