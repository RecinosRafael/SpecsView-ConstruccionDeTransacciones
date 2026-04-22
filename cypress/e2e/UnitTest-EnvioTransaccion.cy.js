import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import EnvioDeTransaccionesCy from "../support/PageObjects/Specs-view-PO/EnvioDeTransacciones.cy";

const Generales = new metodosGeneralesPomCy()
const EnvioTransaccion = new EnvioDeTransaccionesCy()


describe("Prueba unitaria del Crud envio de transacción ...", () =>{

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
        Generales.IrAPantalla('transactionSendSpec')
    })

    it("Agregar múltiples registros dinámicamente", () => {
        cy.readFile('./JsonData/envioTransacciones.json').then((data) => {
            cy.wrap(data.agregar).each((item, index) => {
                cy.log(`Insertando código: ${item.correlativo}`)
                const numero = index + 1
                cy.log(`Insertando registro #${numero}: ${item.correlativo}`)

                //Asegurar estado limpio antes de comenzar
                cy.get('body').then(($body) => {
                    if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                        cy.log('Formulario abierto detectado, cerrando...')
                        Generales.BtnCancelarRegistro()
                    }
                })

                //Abrir formulario
                Generales.BtnAgregarRegistros()

                //Validar que el modal realmente abrió
                cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                    .should('be.visible')

                // Llenar datos
                EnvioTransaccion.EnvioTransacciones(
                    //transaccion, correlativo, descripcion, pagoServicio, requiereLogin, endpointDeLogueo, formatoDeEnvio, 
                    //progGeneraInfoDeEnvio, tipoDatoEnvio, endpointDeEnvio, tipoDatoRecibido, archivoRespuesta, progRecibeInfo, analizaRespuesta 
                    
                    item.transaccion,
                    item.correlativo,
                    item.descripcion,
                    item.pagoServicio,
                    item.requiereLogin,
                    item.endpointDeLogueo,
                    item.formatoDeEnvio,
                    item.progGeneraInfoDeEnvio,
                    item.tipoDatoEnvio,
                    item.endpointDeEnvio,
                    item.tipoDatoRecibido,
                    item.archivoRespuesta,
                    item.progRecibeInfo,
                    item.analizaRespuesta                                   
                )

                //Intercept backend
                //cy.intercept('POST', '**/transactionSendSpec').as('guardar')
                const alias = Generales.interceptar('guardar', numero, 'POST', '**/transactionSendSpec')

                Generales.BtnAceptarRegistro()

                let nombre = "Envío de Transacciones"

                
                Generales.procesarRespuestaYReportar(alias, {
                    numero,
                    describe: `000 -: ${nombre}`,
                    crud: `${nombre}`,
                    descripcion: `Transacción: ${item.transaccion} - Correlativo: ${item.correlativo}`
                })

                cy.get('body').then(($body) => {
                        const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                        if (modalAbierto) {
                            cy.log('Modal sigue abierto cerrando manualmente');
                            Generales.BtnCancelarRegistro();
                            cy.wait(500);
                        }
                });

                /*cy.wait('@guardar').then((interception) => {
                    const status = interception.response.statusCode
                    if (status === 200 || status === 201) {
                        cy.log('Registro insertado correctamente')
                        // Esperar que el modal desaparezca
                        cy.contains('h2', 'Nuevo Registro').should('not.exist')
                    } else {
                        cy.log(`Error detectado. Status: ${status}`)
                        Generales.BtnCancelarRegistro()
                        cy.contains('h2', 'Nuevo Registro').should('not.exist')
                    }
                })*/
            })
        })
    })

})