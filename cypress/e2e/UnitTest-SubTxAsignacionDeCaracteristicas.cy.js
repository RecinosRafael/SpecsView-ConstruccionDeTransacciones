import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import GestorPomCy from "../support/PageObjects/Specs-view-PO/GestorDeTransacciones.cy";
import 'cypress-xpath';
import "cypress-real-events/support";
import '@4tw/cypress-drag-drop'


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
        cy.fixture('asignacionDeCaracteristicas').as('data');
    });

    it("Agregar múltiples registros dinámicamente", function() {
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
                        } else {
                            cy.log(`Paso "${pasoRequerido}" ya está seleccionado, se omite clic.`);
                        }

                        GestorDeTransacciones.AsignacionDCaracteristicaAPasoB(
                            item.paso,
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
    });
});