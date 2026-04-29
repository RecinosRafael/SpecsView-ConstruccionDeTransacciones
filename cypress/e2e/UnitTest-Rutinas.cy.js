import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import rutinasPomCy from "../support/PageObjects/Specs-view-PO/RutinasPom.cy";

const Generales = new metodosGeneralesPomCy()
const Rutinas = new rutinasPomCy()


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
        Generales.IrAPantalla('routine')
    })

    it("Agregar múltiples registros dinámicamente", () => {

        cy.readFile('./JsonData/rutinas.json').then((dataRutinas) => {
            cy.wrap(dataRutinas.agregar).each((item) => {
                cy.log(`Insertando código: ${item.codigo}`)

            // Entrar al iframe y realizar acciones
            cy.get('iframe.frame', { timeout: 10000 })
                .its('0.contentDocument.body')
                .should('not.be.empty')
                .then(cy.wrap)
                .within(() => {
                //Abrir formulario
                Generales.BtnIframe('Agregar', { timeout: 10000, force: true, skipContext: true });
                Rutinas.RutinasIf(item);
                Generales.BtnIframe('Aceptar', { timeout: 10000, force: true, skipContext: true });
                cy.wait(1000) // Esperar que se procese el guardado
                if(item.nombreRecurso !== ""){
                    Rutinas.rutinasJson(item)
                }
                Generales.BtnIframe('atras', { timeout: 10000, force: true, skipContext: true });
                Generales.BtnIframe('atras', { timeout: 10000, force: true, skipContext: true });
                }); // Salimos del iframe

                
                // //Intercept backend
                // cy.intercept('POST', '**/routine').as('guardar')

                // cy.wait('@guardar').then((interception) => {
                //     const status = interception.response.statusCode
                //     if (status === 200 || status === 201) {
                //         cy.log('Registro insertado correctamente')
                //         // Esperar que el modal desaparezca
                //         cy.contains('h2', 'Nuevo Registro').should('not.exist')
                //     } else {
                //         cy.log(`Error detectado. Status: ${status}`)
                //         Generales.BtnCancelarRegistro()
                //         cy.contains('h2', 'Nuevo Registro').should('not.exist')
                //     }
                // })
            })
        })
    })

})