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
    })

    beforeEach(() => {
        Generales.IrAPantalla('transactionManager')
    })

    it("Agregar múltiples registros dinámicamente", () => {

    
        cy.fixture('gestorTransaccion').then((data) => {
            cy.wrap(data.agregar).each((item) => {
                cy.log(`Insertando código: ${item.codigo}`)
    
    
                cy.get('iframe.frame', { timeout: 10000 })
                .its('0.contentDocument.body')
                .should('not.be.empty')
                .then(cy.wrap)
                .within(() => {
                //Asegurar estado limpio antes de comenzar
                // cy.get('body').then(($body) => {
                //     if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                //         cy.log('Formulario abierto detectado, cerrando...')
                //         Generales.BtnCancelarRegistro()
                //     }
                // })

                //Abrir formulario
                Generales.BtnIframe('Agregar', { timeout: 10000, force: true, skipContext: true });
                // //Validar que el modal realmente abrió
                // cy.contains('h2', 'Nuevo Registro', { timeout: 10000, force: true})
                //     .should('be.visible')

                // Llenar datos
                GestorDeTransacciones.GestorTransacciones(
                    
                // tipo, codigo, codAlternativo, nombre, etiqueta, estado, validoDesde, validoHasta, tipoMovimientoBoveda, descripcion,
                // esconderMenu, permiteReversion, modoOffline, requiereSupervisor, requiereValidarAcceso, seEnviaHost, tiempoEspera, 
                // accionPorDemora, tienePagoServicio, PagoServicio, pasoConfirmacionServicio, permiteReimpresion, diasPermitidoReimpresion, 
                // presentarResumen, mensajeResumen, tipoMensaje, icono, DepartamentodeAutorizacion, textoAyuda, logo
                   
                item.tipo, item.codigo, item.codAlternativo, item.nombre, item.etiqueta, item.estado, item.validoDesde, item.validoHasta, item.tipoMovimientoBoveda, 
                item.descripcion, item.esconderMenu, item.permiteReversion, item.modoOffline, item.requiereSupervisor, item.requiereValidarAcceso, item.seEnviaHost, 
                item.tiempoEspera, item.accionPorDemora, item.tienePagoServicio, item.PagoServicio, item.pasoConfirmacionServicio, item.permiteReimpresion, 
                item.diasPermitidoReimpresion, item.presentarResumen, item.mensajeResumen, item.tipoMensaje, item.icono, item.DepartamentodeAutorizacion, item.textoAyuda, item.logo

            )
        // Normalizar el tipo para comparación (opcional)
        const tipoNormalizado = item.tipo?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

                //Intercept backend
                cy.intercept('POST', '**/transactionSpec').as('guardar')
                Generales.BtnIframe('Aceptar', { timeout: 10000, force: true, skipContext: true });
                
                cy.wait('@guardar').then((interception) => {
                    const status = interception.response.statusCode
                    if (status === 200 || status === 201) {
                        cy.log('Registro insertado correctamente')
                        // Esperar que el modal desaparezca
                        Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true })
                        cy.wait(2000) 
                            if (tipoNormalizado === "administrativas") {
                                cy.log('✅ Es tipo ADMINISTRATIVAS, ejecutando acción especial');
                                Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true })
                            } else {
                                cy.log('➡️ No es ADMINISTRATIVAS, continuando con flujo normal');
                                Generales.BtnIframe('Sí', { timeout: 10000, force: true, skipContext: true });
                                Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true })
                            }
                    } else {
                        cy.log(`Error detectado. Status: ${status}`)
                        Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true })
                        cy.contains('h2', 'Nuevo Registro').should('not.exist')
                    }
                })
            
            
            
            
            
                })

            })
        })
    })

})