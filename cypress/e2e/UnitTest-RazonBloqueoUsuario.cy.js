import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import RazonesDeBloqueoPomCy from "../support/PageObjects/Specs-view-PO/RazonesDeBloqueoPom.cy";

const Generales = new metodosGeneralesPomCy()
const RazonesBloqueo = new RazonesDeBloqueoPomCy()


describe("Prueba unitaria del Crud Razones de Bloqueo de Usuario...", () =>{

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
        Generales.IrAPantalla('reasonsUserBlock')
    })

    it("Agregar múltiples registros dinámicamente", () => {
        cy.readFile('./JsonData/razonesBloqueoUsuario.json').then((data) => {
            cy.wrap(data.agregar).each((item, index) => {
                cy.log(`Insertando código: ${item.codigo}`)
                const numero = index + 1;
                cy.log(`Insertando registro #${numero}: ${item.codigo}`);

                //Asegurar estado limpio antes de comenzar
                cy.get('body').then(($body) => {
                    if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                        cy.log('Formulario abierto detectado, cerrando...')
                        Generales.BtnCancelarRegistro()
                    }
                })

                //Abrir formulario
                Generales.BtnAgregarRegistros()

                //Validar que el modal realmente abrió
                cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                    .should('be.visible')

                // Llenar datos
                RazonesBloqueo.RazonesBloqueoUsuarios(
                    //cocodigo, razon, mensaje
                    item.codigo,
                    item.razon, 
                    item.mensaje
                )

                //Intercept backend
                //cy.intercept('POST', '**/reasonsUserBlock').as('guardar')

                const alias = Generales.interceptar('guardar', numero, 'POST', '**/reasonsUserBlock')

                Generales.BtnAceptarRegistro()

                let nombre = "Razones de Bloqueo de Usuarios"

                
                Generales.procesarRespuestaYReportar(alias, {
                    numero,
                    describe: `013 -: ${nombre}`,
                    crud: `${nombre}`,
                    descripcion: `Código: ${item.codigo} - Razón: ${item.razon}`
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