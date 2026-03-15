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
        cy.fixture('subTxTipoComprobantesNotElectronica').as('data');
    });

    it("Agregar múltiples registros dinámicamente", function() {
        cy.log('Datos cargados:', JSON.stringify(this.data));
        
        cy.wrap(this.data.agregar).each((item) => {
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
                    Generales.abrirPanel("Opciones");
                    Generales.BtnIframe("Comprobantes", { timeout: 10000, force: true, skipContext: true });
                    Generales.BtnIframe("Notificaciones electrónicas", { timeout: 10000, skipContext: true }, 'div[role="tab"]', true);
                    cy.wait(1500)
                    Generales.BtnIframe("Agregar", { timeout: 10000, force: true, skipContext: true }, 'add-button');                    GestorDeTransacciones.ComprobantesImpresion(item);
                    GestorDeTransacciones.ComprobantesNotElectronica(
                       //tipoFormato, comprobante, verComprobante, seNotificaMedio, esMandatorio, notificaComprobante
                        item.tipoFormato, item.comprobante, item.verComprobante, item.seNotificaMedio, 
                        item.esMandatorio,  item.notificaComprobante                       
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
                .then(cy.wrap)
                .within(() => {
                    // Buscar el botón con color primary (el de confirmar)
                    cy.get('button[color="primary"]').then($btn => {
                        if ($btn.length > 0) {
                            cy.log('✅ Diálogo detectado, haciendo clic en Confirmar');
                            cy.wrap($btn.first()).click({ force: true });
                            // Opcional: esperar a que el diálogo desaparezca
                            cy.wait(1000);
                        } else {
                            cy.log('ℹ️ No apareció diálogo de confirmación');
                        }
                    });
                });
        });
    });
});