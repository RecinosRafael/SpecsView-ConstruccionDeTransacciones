import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import ArbolOrganizacionalPom from "../support/PageObjects/Specs-view-PO/ArbolOrganizacionalPom.cy";
import 'cypress-xpath';

const Generales = new metodosGeneralesPomCy()
const ArbolOrganizacional = new ArbolOrganizacionalPom()


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
        Generales.IrAPantalla('organizationTree')
    })

    it("Agregar múltiples registros dinámicamente", () => {

    
        cy.readFile('./JsonData/agregarCamposAdicionales.json').then((data) => {
            cy.wrap(data.agregar).each((item) => {
            //para ocultar el log y no se sature y ponga lenta la prueba
            cy.then(() => {

        const doc = window.top.document;
        // Intentamos con varios selectores que usa Cypress para su log
        const logContainer = doc.querySelector('.reporter .commands') || 
                             doc.querySelector('.command-list') ||
                             doc.querySelector('.runnable-commands-region');
                             
        if (logContainer) {
            logContainer.innerHTML = ''; 
        }
            });

            cy.log(`Insertando código: ${item.codigo}`)
    
    
                cy.get('iframe.frame', { timeout: 10000 })
                .its('0.contentDocument.body')
                .should('not.be.empty')
                .then(cy.wrap)
                .within(() => {

                // Llenar datos
                ArbolOrganizacional.AgregarCamposAdicionales(item)

                //Intercept backend
                cy.intercept('POST', /\/transactionsByTreebranch\/(administrateAll|assignedAllTransaction)/).as('guardar');
                
                cy.wait('@guardar').then((interception) => {
                    const status = interception.response.statusCode
                    if (status === 200 || status === 201) {
                        cy.log('Registro insertado correctamente')
                        // Esperar que el modal desaparezca
                        Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true })
                        cy.wait(2000) 

                    } else {
                        cy.log(`Error detectado. Status: ${status}`)
                        Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true })
                        cy.contains('h2', 'Nuevo Registro').should('not.exist')

                    }
                })
            
            
            
            
            
                })

            })
        })
    })

})

