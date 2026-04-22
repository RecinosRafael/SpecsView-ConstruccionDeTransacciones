import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import CamposDeLaTransaccionPomCy from "../support/PageObjects/Specs-view-PO/CamposDeLaTransaccion.cy";

const Generales = new metodosGeneralesPomCy()
const CamposDeLaTransaccion = new CamposDeLaTransaccionPomCy()


describe("Prueba unitaria del Crud Campos de la transacción ...", () =>{

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
        Generales.IrAPantalla('characteristicSpec')
    })

    it("Agregar múltiples registros dinámicamente", () => {
        cy.readFile('./JsonData/camposTransaccion.json').then((data) => {
            cy.wrap(data.agregar).each((item, index) => {
                cy.log(`Insertando código: ${item.codigo}`)
                const numero = index + 1
                cy.log(`Insertando registro #${numero}: ${item.codigo}`)

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
                CamposDeLaTransaccion.CamposTransaccion(
                    //codigo, nombre, etiqueta, descripcion,  tieneDatosSensibles, Tipo, longitudMin, longitudMax, longitudEnvio, digitoVerificador, mascara, listaValores, rangoValores, 
                    // limiteInferior, limiteSuperior, llenadoAutomatico, etiquetaJson, valorDefecto, ayuda, moneda, rutina, implListaVista, implServicio, endpointAyuda, estado, validoDesde, 
                    // validoHasta, usaSumadora, idCampoEscuchar, requiereDetalleEfectivo, archivoYML, datosTachados, caracterVisualizar, esControlEfectivo
                    
                    item.codigo, item.nombre, item.etiqueta, item.descripcion, item.tieneDatosSensibles, item.Tipo, item.longitudMin, item.longitudMax, item.longitudEnvio, 
                    item.digitoVerificador, item.mascara, item.listaValores, item.rangoValores, item.limiteInferior, item.limiteSuperior, item.llenadoAutomatico, item.etiquetaJson, 
                    item.valorDefecto, item.ayuda, item.moneda, item.rutina, item.implListaVista, item.implServicio, item.endpointAyuda, item.estado, item.validoDesde, item.validoHasta, item.usaSumadora, 
                    item.idCampoEscuchar, item.requiereDetalleEfectivo, item.archivoYML, item.datosTachados, item.caracterVisualizar, item.esControlEfectivo                                   
                )

                //Intercept backend
                //cy.intercept('POST', '**/characteristicSpec').as('guardar')

                const alias = Generales.interceptar('guardar', numero, 'POST', '**/characteristicSpec')

                Generales.BtnAceptarRegistro()

                let nombre = "Campos de transacción"

                Generales.procesarRespuestaYReportar(alias, {
                    numero,
                    describe: `014 -: ${nombre}`,
                    crud: `${nombre}`,
                    descripcion: `Código: ${item.codigo} - Nombre: ${item.nombre}`
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