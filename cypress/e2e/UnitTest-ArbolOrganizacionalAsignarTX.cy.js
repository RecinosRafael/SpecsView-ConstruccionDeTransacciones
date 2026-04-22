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

    /*it("Agregar múltiples registros dinámicamente", () => {

    
        cy.readFile('./JsonData/asignarTransaccionesArbol.json',  { timeout: 15000 }).then((data) => {
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
    
    


                //Abrir formulario
//                Generales.BtnIframe('Agregar', { timeout: 10000, force: true, skipContext: true });
                // //Validar que el modal realmente abrió
                // cy.contains('h2', 'Nuevo Registro', { timeout: 10000, force: true})
                //     .should('be.visible')

                // Llenar datos
                ArbolOrganizacional.AsignarTransacciones(item)

        //         // Normalizar el tipo para comparación (opcional)
        // const tipoNormalizado = item.tipo?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

                // //Intercept backend
                // cy.intercept('POST', /\/transactionsByTreebranch\/(administrateAll|assignedAllTransaction)/).as('guardar');
                // // Generales.BtnIframe('Aceptar', { timeout: 10000, force: true, skipContext: true });
                
                // cy.wait('@guardar').then((interception) => {
                //     const status = interception.response.statusCode
                //     if (status === 200 || status === 201) {
                //         cy.log('Registro insertado correctamente')
                //         // Esperar que el modal desaparezca
                //         Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true })
                //         cy.wait(2000) 

                //     } else {
                //         cy.log(`Error detectado. Status: ${status}`)
                //         Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true })
                //         cy.contains('h2', 'Nuevo Registro').should('not.exist')

                //     }
                // })
                cy.get('iframe.frame', { timeout: 10000 })
                .its('0.contentDocument.body')
                .should('not.be.empty')
                .then(cy.wrap)
                .within(() => {

                        Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true })

                })

            })
        })
    })*/

    it("Agregar múltiples registros dinámicamente", () => {
        let contadorGlobal = { valor: 0 };

        cy.readFile('./JsonData/asignarTransaccionesArbol.json', { timeout: 15000 }).then((data) => {
            cy.wrap(data.agregar).each((item, index) => {
                const numero = index + 1;
                
                cy.then(() => {
                    const doc = window.top.document;
                    const logContainer = doc.querySelector('.reporter .commands') ||
                        doc.querySelector('.command-list') ||
                        doc.querySelector('.runnable-commands-region');
                    if (logContainer) logContainer.innerHTML = '';
                });

                cy.log(`Insertando código: ${item.codigo}`);

                ArbolOrganizacional.AsignarTransacciones(item, {
                    contadorObj: contadorGlobal,
                    describeBase: 'Asignar Transacciones a Árbol',
                    crudBase: 'Asignación'
                });

                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true });
                    });
            });
        });
    });

})

