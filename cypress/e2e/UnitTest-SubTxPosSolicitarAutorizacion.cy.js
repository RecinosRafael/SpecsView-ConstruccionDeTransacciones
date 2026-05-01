import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import GestorPomCy from "../support/PageObjects/Specs-view-PO/GestorDeTransacciones.cy";
import 'cypress-xpath';
import "cypress-real-events/support";


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
        cy.readFile('./JsonData/gestorSolicitarAutoPOS.json').as('data');
    });


    it("Agregar múltiples registros dinámicamente", function() {

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
                        Generales.BtnIframe(item.paso, { timeout: 10000, force: true, skipContext: true });
                        cy.wait(500)
                        const contexto = "//mat-expansion-panel-header[.//h2[contains(text(),'Rutinas o acciones POS')]]";
                        Generales.BtnIframe('Agregar', { timeout: 10000, force: true, skipContext: true }, 
                            null, false, contexto
                        );                        
                        cy.wait(500);
                        cy.xpath("//button[contains(@class,'mat-mdc-menu-item') and contains(., 'Solicitar autorización')]").click({ force: true });

                        GestorDeTransacciones.POSSolicitarAutorizacion(item);

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
    });



});