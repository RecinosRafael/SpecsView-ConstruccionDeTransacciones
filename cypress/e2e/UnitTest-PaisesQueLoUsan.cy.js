import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import MonedasPomCy from "../support/PageObjects/Specs-view-PO/MonedasPom.cy";

const Generales = new metodosGeneralesPomCy()
const PaisesQueLoUsan = new MonedasPomCy()

describe('CRUD Países que usan moneda', () => {

    before(() => {

        Generales.Login(
            Cypress.env('BASE_URL'),
            Cypress.env('USER'),
            Cypress.env('PASS')
        )

        cy.fixture('paisesQueLoUsan').as('dataPaises')

    })

    beforeEach(() => {
        Generales.IrAPantalla('money')
    })

    it('Insertar países agrupados por moneda', function () {
        const datos = this.dataPaises.agregar
        const agrupadas = datos.reduce((acc, item) => {
            if (!acc[item.codigoMoneda]) {
                acc[item.codigoMoneda] = []
            }
            acc[item.codigoMoneda].push(item)
            return acc
        }, {})

        cy.wrap(Object.keys(agrupadas)).each((codigoMoneda) => {
            cy.log('💰 Procesando moneda: ' + codigoMoneda)

            Generales.BuscarRegistroCodigo(codigoMoneda)
            Generales.NavegacionSubMenu('Paises que la usan')

            return cy.wrap(agrupadas[codigoMoneda]).each((registro) => {
                Generales.BtnAgregarRegistroSubnivel()
                const pais = registro.valorPais || registro.nombre
                PaisesQueLoUsan.PaisesQueUsan(pais)

                return cy.get('@paisExiste').then((existe) => {
                    if (existe) {
                        Generales.BtnAceptarRegistro()
                    } else {
                        Generales.BtnCancelarRegistro()
                    }
                    // SIEMPRE esperar que el modal desaparezca
                    return cy.get('mat-dialog-container', { timeout: 10000 })
                        .should('not.exist')

                })
            }).then(() => {
                cy.log('🔙 Regresando al nivel principal')

                // Primer regreso - SALIR DEL SUBNIVEL
                return cy.then(() => {
                    cy.wait(3000)
                    Generales.Regresar()
                    // Verificar que salimos del subnivel (modal cerrado)
                    return cy.get('mat-dialog-container', { timeout: 5000 })
                        .should('not.exist')
                }).then(() => {
                    // Segundo regreso - SALIR DEL DETALLE DE MONEDA
                    cy.wait(3000)
                    Generales.Regresar()
                    // Verificar que estamos en el listado principal
                    return cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
                        .should('be.visible')
                })
            })
        })
    })

})