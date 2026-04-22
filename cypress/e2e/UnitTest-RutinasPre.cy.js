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
        //cy.fixture('rutinaPre').as('data');
        cy.readFile('./JsonData/rutinaPre.json').as('data');
    });

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
                    Generales.filtrarPorCodigo(codigoTRX); // o item.codigoTX - 777 para pruebas

                    return cy.wrap(agrupadas[codigoTRX]).each((item) => {
                        Generales.abrirPanel("Opciones", {timeout: 20000, force: true});
                        cy.wait(500)
                        Generales.BtnIframe("Cuenta", { timeout: 10000, force: true, skipContext: true });
                        cy.wait(500)
                        Generales.agregarRutinaTRX("pre")

                        GestorDeTransacciones.RutinasPre(
                            //rutina, estado, correlativo, requiereLogin, descripcion, fechaInicio, fechaFin, paremetros)
                            item.rutina,
                            item.estado,
                            item.correlativo,
                            item.requiereLogin,
                            item.descripcion,
                            item.fechaInicio,
                            item.fechaFin,
                            item.paremetros
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
                    .then(cy.wrap)
                    .within(() => {
                        // Buscar el botón con color primary (el de confirmar)
                        cy.get('button[color="primary"]').then($btn => {
                            if ($btn.length > 0) {
                                cy.log('✅ Diálogo detectado, haciendo clic en Confirmar');
                                Generales.BtnIframe('Sí', { timeout: 10000, force: true, skipContext: true });
                                // Opcional: esperar a que el diálogo desaparezca
                                cy.wait(1000);
                            } else {
                                cy.log('ℹ️ No apareció diálogo de confirmación');
                            }
                        });
                    });
            })

        });
    });*/

    it("Agregar múltiples registros dinámicamente", function() {

        const datos = this.data.agregar

        const agrupadas = datos.reduce((acc, item) => {
            if (!acc[item.codigoTRX]) {
                acc[item.codigoTRX] = []
            }
            acc[item.codigoTRX].push(item)
            return acc
        }, {})

        let numero = 0

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

                        numero++

                        const alias = Generales.interceptar('guardar', numero, 'POST', '**/transactionFlowRoutine')

                        GestorDeTransacciones.RutinasTRX(
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

                        let nombre = "Rutina PRE"

                        Generales.procesarRespuestaYReportarConFrame(alias, {
                            numero,
                            describe: `019.4 -: ${nombre}`,
                            crud: `${nombre}`,
                            descripcion: `Transacción: ${codigoTRX} - Paso: ${item.paso || 'desconocido'} - Rutina: ${item.rutina}`
                        })    

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