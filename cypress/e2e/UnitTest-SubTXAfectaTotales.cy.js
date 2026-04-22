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
        //cy.fixture('subTxAfectaTotales').as('data');
        cy.readFile('./JsonData/subTxAfectaTotales.json').as('data');
    });

    it("Agregar múltiples registros dinámicamente", function() {
        
        const datos = this.data.agregar

        const agrupadas = datos.reduce((acc, item) => {
            if (!acc[item.codigoTX]) {
                acc[item.codigoTX] = []
            }
            acc[item.codigoTX].push(item)
            return acc
        }, {})

        let numero = 0

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

                    numero++

                    const alias = Generales.interceptar('guardar', numero, 'POST', '**/totalCashierAffect')

                    GestorDeTransacciones.TotalesAfectar(
                       //caracteristica, totalCajero, operacion, exp1, operacion2, exp2
                       
                        //item.caracteristica, item.totalCajero, item.operacion,  item.exp1, item.operacion2, item.exp2                       
                        item.caracteristica, item.arbolRaiz, item.totalCajero, item.operacion, item.exp1, item.operacion2, item.exp2
                    );
                    // Hacemos clic en Guardar sin interceptar
                    Generales.BtnIframe('Guardar', { timeout: 10000, force: true, skipContext: true });

                    let nombre = "Totales a Afectar"

                        Generales.procesarRespuestaYReportarConFrame(alias, {
                            numero,
                            describe: `019.7 -: ${nombre}`,
                            crud: `${nombre}`,
                            descripcion: `Transacción: ${item.codigoTX} - Característica: ${item.caracteristica} - Total Cajero: ${item.totalCajero}`
                        })
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
    });
});