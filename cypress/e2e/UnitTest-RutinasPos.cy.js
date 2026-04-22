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
        //cy.fixture('rutinaPos').as('data');
        cy.readFile('./JsonData/rutinaPos.json').as('data');
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

                        let nombre = "Rutina POS"

                        Generales.procesarRespuestaYReportarConFrame(alias, {
                            numero,
                            describe: `019.5 -: ${nombre}`,
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