import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import ArbolOrganizacionalPom from "../support/PageObjects/Specs-view-PO/ArbolOrganizacionalPom.cy";

const Generales = new metodosGeneralesPomCy()
const ArbolOrganizacional = new ArbolOrganizacionalPom()

describe("Prueba metodo de carga", () =>{
    Cypress.on('uncaught:exception',(err,Runnable) =>{
        return false
    })

    before(() => {
        Generales.Login(
            Cypress.env('BASE_URL'),
            Cypress.env('USER'),
            Cypress.env('PASS')
        )
    })

    beforeEach(() => {
        Generales.IrAPantalla('organizationTree')
    })
})