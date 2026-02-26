import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import MonedasPomCy from "../support/PageObjects/Specs-view-PO/MonedasPom.cy";

const Generales = new metodosGeneralesPomCy()
const Monedas = new MonedasPomCy()

describe('CRUD Denominaciones', () => {

    //Login y visita al Specs-view
    before(() => {
        Generales.Login(
            Cypress.env('BASE_URL'),
            Cypress.env('USER'),
            Cypress.env('PASS')
        )
    })

    beforeEach(() => {
        Generales.IrAPantalla('country')
    })

    before(() => {
        cy.fixture('denominaciones').as('denominacionesData')
    })

    it('Insertar todas las denominaciones agrupadas por moneda', function () {

        // 🔥 Agrupar por monedaCodigo
        const agrupadas = this.denominacionesData.reduce((acc, item) => {

            if (!acc[item.monedaCodigo]) {
                acc[item.monedaCodigo] = []
            }

            acc[item.monedaCodigo].push(item)

            return acc

        }, {})

        // 🔥 Recorrer cada moneda
        Object.keys(agrupadas).forEach(monedaCodigo => {

            cy.log(`Insertando denominaciones para moneda ${monedaCodigo}`)

            // 🔎 Buscar moneda una sola vez
            cy.get('#filtroCodigo').clear().type(monedaCodigo)
            cy.contains('Buscar').click()

            cy.contains(monedaCodigo).click()

            // Entrar al subnivel
            cy.contains('Denominaciones').click()

            // 🔥 Insertar todas sus denominaciones
            agrupadas[monedaCodigo].forEach(deno => {

                cy.contains('Agregar').click()
                cy.get('#valor').clear().type(deno.valor)
                cy.contains('Guardar').click()

            })

            cy.contains('Regresar').click()

        })

    })

})