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
        cy.fixture('subTxAsignacionMoneda').as('data');
    });

    it("Agregar múltiples registros dinámicamente", function() {
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
                    GestorDeTransacciones.AsignarMoneda(
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
    });







});