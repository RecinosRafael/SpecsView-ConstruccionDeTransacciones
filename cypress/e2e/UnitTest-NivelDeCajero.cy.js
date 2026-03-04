import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import nivelesDeCajeroPomCy from "../support/PageObjects/Specs-view-PO/NivelesDeCajeroPom.cy";

const Generales = new metodosGeneralesPomCy()
const NivelCajero = new nivelesDeCajeroPomCy()


describe("Prueba unitaria del Crud de Productos...", () =>{

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
        Generales.IrAPantalla('cashierLevel')
    })

    it("Agregar múltiples registros dinámicamente", () => {
        cy.fixture('NivelDeCajero').then((dataNivelDeCajero) => {
            cy.wrap(dataNivelDeCajero.agregar).each((item) => {
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
                NivelCajero.NivelCajero(
                    //ccodigo, valorArbolRaiz, nombre, descripcion, valorNivelAutorizacion, rolKeycloak
                    item.codigo,
                    item.valorArbolRaiz,
                    item.nombre,
                    item.descripcion,
                    item.valorNivelAutorizacion,
                    item.rolKeycloak
                )

                //Intercept backend
                cy.intercept('POST', '**/cashierLevel').as('guardar')

                Generales.BtnAceptarRegistro()


                cy.wait('@guardar').then((interception) => {
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
                })
            })
        })
    })

})