import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import plantillaDeComprobantePomCy from "../support/PageObjects/Specs-view-PO/PlantillaDeComprobantePom.cy";
require('cypress-xpath');

const Generales = new metodosGeneralesPomCy()
const PlantillComprobante = new plantillaDeComprobantePomCy()


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
        Generales.IrAPantalla('voucherTemplate')
    })

    it("Agregar múltiples registros dinámicamente", () => {
        cy.readFile('./JsonData/plantillasDeComprobante.json').then((dataPlantillasDeComprobante) => {
            cy.wrap(dataPlantillasDeComprobante.agregar).each((item, index) => {
                cy.log(`Insertando código: ${item.key}`)
                const numero = index + 1
                cy.log(`Insertando registro #${numero}: ${item.key}`)

                //Asegurar estado limpio antes de comenzar
                cy.get('body').then(($body) => {
                    if ($body.find('h2:contains("Nuevo registro")').length > 0) {
                        cy.log('Formulario abierto detectado, cerrando...')
                        Generales.BtnCancelarRegistro()
                    }
                })

                //Abrir formulario
                Generales.BtnAgregarRegistro()

                //Validar que el modal realmente abrió
                cy.contains('h2', 'Nuevo registro', { timeout: 10000 })
                    .should('be.visible')

                // Llenar datos
                PlantillComprobante.PlantillasComprobantes(
                    item.key,
                    item.nombre,
                    item.descripcion,
                    item.archivo
                )

                //Intercept backend
                //cy.intercept('POST', '**/voucherTemplate').as('guardar')
                const alias = Generales.interceptar('guardar', numero, 'POST', '**/report');

                Generales.BtnAceptarRegistro()

                let nombre = "Plantilla de Comprobante"
                
                Generales.procesarRespuestaYReportar(alias, {
                    numero,
                    describe: `018 -: ${nombre}`,
                    crud: `${nombre}`,
                    descripcion: `Código: ${item.key} - Nombre: ${item.nombre}`
                })

                cy.get('body').then(($body) => {
                        const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                        if (modalAbierto) {
                            cy.log('Modal sigue abierto cerrando manualmente');
                            Generales.BtnCancelarRegistro();
                            cy.wait(500);
                        }
                });

                /*cy.wait('@guardar').then((interception) => {
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