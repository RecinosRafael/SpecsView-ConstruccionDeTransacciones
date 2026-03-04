import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import MensajesDeErrorPomCy from "../support/PageObjects/Specs-view-PO/MensajesDeErrorPom.cy";
import mensajesDeErrorPomCy from "../support/PageObjects/Specs-view-PO/MensajesDeErrorPom.cy";

const Generales = new metodosGeneralesPomCy()
const MensajeError = new mensajesDeErrorPomCy()


describe("Prueba unitaria del Crud de Mensajes de error...", () =>{

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
        Generales.IrAPantalla('errorMessage')
    })

    it("Agregar múltiples registros dinámicamente", () => {
        cy.fixture('MensajesDeError').then((dataMensajesDeError) => {
            cy.wrap(dataMensajesDeError.agregar).each((item) => {
                cy.log(`Insertando código: ${item.codigo}`)

                //Asegurar estado limpio antes de comenzar
                cy.get('body').then(($body) => {
                    if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                        cy.log('Formulario abierto detectado, cerrando...')
                        Generales.BtnCancelarRegistro()
                    }
                })

                //Abrir formulario
                Generales.BtnAgregarRegistroSubnivel()

                //Validar que el modal realmente abrió
                cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                    .should('be.visible')

                // Llenar datos
                MensajeError.MensajesError(
                    //codigo, mensajeError, descripcion, valorTipoMensaje, valorAccion
                    item.codigo,
                    item.mensajeError,
                    item.descripcion,
                    item.valorTipoMensaje,
                    item.valorAccion
                )

                //Intercept backend
                cy.intercept('POST', '**/errorMessage').as('guardar')

                Generales.BtnAceptarRegistro()


                cy.wait('@guardar').then((interception) => {
                    const status = interception.response.statusCode
                    if (status === 206 || status === 201) {
                        cy.log('Registro insertado correctamente')
                        // Esperar que el modal desaparezca
                        cy.contains('h2', 'Nuevo Registro').should('not.exist')
                    } else {
                        cy.log(`Error detectado. Status: ${status}`)
                        Generales.BtnCancelarRegistro()
                        cy.contains('h2', 'Nuevo Registro').should('not.exist')
                    }
                })
            })
        })
    })

})