import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import DivGeografica from "../support/PageObjects/Specs-view-PO/DivGeografica.cy";

const Generales = new metodosGeneralesPomCy()
const DivGeo = new DivGeografica()


describe("Prueba unitaria del Crud Division Geografica...", () =>{

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
        Generales.IrAPantalla('geographicLevel1')
    })

    it("Agregar múltiples registros dinámicamente", () => {
        cy.readFile('./JsonData/divGeografica.json').then((data) => {
            cy.wrap(data.agregar).each((item, index) => {
                const numero = index + 1;
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
                DivGeo.DivisionGeografica(
                    //codigo, nombre
                    item.codigo,
                    item.nombre
                )

                //Intercept backend
                //cy.intercept('POST', '**/geographicLevel1').as('guardar')

                const alias = Generales.interceptar('guardar', numero, 'POST', '**/geographicLevel1');


                Generales.BtnAceptarRegistro()

                let nombre = "División geográfica"

                Generales.procesarRespuestaYReportar(alias, {
                    numero,
                    describe: `002 -: ${nombre} `,
                    crud: `${nombre} `,
                    descripcion: `Código: ${item.codigo} - Nombre: ${item.nombre}`
                });

                cy.get('body').then(($body) => {
                    const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                    if (modalAbierto) {
                        cy.log('Modal sigue abierto → cerrando manualmente');
                        Generales.BtnCancelarRegistro();
                        cy.wait(500);
                    }
                });


               /* cy.wait('@guardar').then((interception) => {
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
                })*/
            })
        })
    })

})