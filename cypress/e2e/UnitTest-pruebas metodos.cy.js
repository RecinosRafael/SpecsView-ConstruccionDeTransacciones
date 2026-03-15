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

        cy.get('iframe.frame', { timeout: 10000 })
            .its('0.contentDocument.body')
            .should('not.be.empty')
            .then(cy.wrap)
            .within(() => {

                Generales.filtrarPorCodigo('777');
                //Generales.abrirPanel("Opciones")
                //Generales.clickAddCaracteristica({ timeout: 10000, force: true, skipContext: true })
                //GestorDeTransacciones.caracteristicasTrx2("moneda")
                cy.wait(3000)

                //Generales.BtnIframe("Rutinas de ejecucion",{ timeout: 10000, force: true, skipContext: true })
                //Generales.BtnIframe("Atras",{ timeout: 10000, force: true, skipContext: true })

               // Generales.checkbox("Administrador")



            })




    })

})