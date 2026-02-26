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

            cy.log('Procesando moneda: ' + codigoMoneda)

            // 🔎 Buscar moneda
            Generales.BuscarRegistroCodigo(codigoMoneda)

            // 📂 Ir al subnivel
            Generales.NavegacionSubMenu('Paises que la usan')

            // 🔁 Procesar países de esa moneda
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

                    // 🔥 Esperar que modal desaparezca
                    cy.get('mat-dialog-container', { timeout: 10000 })
                        .should('not.exist')

                })
            })
                .then(() => {

                    // 🔙 Regresar SOLO cuando termine todo el subnivel
                    Generales.Regresar()

                    Generales.Regresar()

                    cy.url({ timeout: 15000 })
                        .should('include', '/money')

                    cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
                        .should('be.visible')

                })
        })
    })

})