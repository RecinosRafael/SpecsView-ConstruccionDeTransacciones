import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import totalDeCajeroPomCy from "../support/PageObjects/Specs-view-PO/TotalDeCajeroPom.cy";
require('cypress-xpath');

const Generales = new metodosGeneralesPomCy()
const TotalesCajero = new totalDeCajeroPomCy()


describe("Prueba unitaria del Crud Tipo de Dato...", () =>{

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
        Generales.IrAPantalla('totalCashier')
    })

    it("Agregar múltiples registros dinámicamente", () => {
        cy.fixture('totalesDeCajero').then((dataTotalesDeCajero) => {
            cy.wrap(dataTotalesDeCajero.agregar).each((item) => {
                cy.log(`Insertando código: ${item.codigo}`)

                //Asegurar estado limpio antes de comenzar
                cy.get('body').then(($body) => {
                    if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                        cy.log('Formulario abierto detectado, cerrando...')
                        Generales.BtnCancelarRegistro()
                    }
                })

                //Abrir formulario
                Generales.BtnAgregarRegistro()

                //Validar que el modal realmente abrió
                cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                    .should('be.visible')
                // Llenar datos
                TotalesCajero.TotalesCajero(
                    item.codigo,
                    item.arbolRaiz,
                    item.nombre,
                    item.nombreCorto,
                    item.descripcion,
                    item.validaMontos,
                    item.minimoRequiereAutorizacion,
                    item.maximoRequiereAutorizacion,
                    item.correlativoImpreso,
                    item.enviarHost,
                    item.cicloVida,
                    item.validoDesde,
                    item.validoHasta,
                    item.totalMonitoreado,
                    item.rutinaCalculamontoConciliar,
                    item.rutinacalculaMontoConciliado,
                    item.esControlEfectivo,
                )

                //Intercept backend
                cy.intercept('POST', '**/totalCashier').as('guardar')

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