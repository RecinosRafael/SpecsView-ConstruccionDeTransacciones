import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import MensajesDeErrorPomCy from "../support/PageObjects/Specs-view-PO/MensajesDeErrorPom.cy";

const Generales = new metodosGeneralesPomCy();
const MensajeError = new MensajesDeErrorPomCy();

describe("Prueba unitaria del CRUD Mensajes de Error", () => {

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
    });

    before(() => {
        Generales.Login(
            Cypress.env('BASE_URL'),
            Cypress.env('USER'),
            Cypress.env('PASS')
        );
    });

    beforeEach(() => {
        Generales.IrAPantalla('errorMessage');
    });

    it("Agregar múltiples registros dinámicamente", () => {
        cy.readFile('./JsonData/mensajesDeError.json').then((dataMensajesDeError) => {
            cy.wrap(dataMensajesDeError.agregar).each((item, index) => {
                cy.log(`Insertando código: ${item.codigo}`)
                const numero = index + 1
                cy.log(`Insertando registro #${numero}: ${item.codigo}`)

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
                MensajeError.MensajesError(
                    item.codigo,
                    item.mensajeError,
                    item.descripcion,
                    item.valorTipoMensaje,
                    item.valorAccion
                )

                //Intercept backend
                //cy.intercept('POST', '**/errorMessage').as('guardar')
                const alias = Generales.interceptar('guardar', numero, 'POST', '**/errorMessages')

                Generales.BtnAceptarRegistro()

                let nombre = "Mensaje de Error"
                
                Generales.procesarRespuestaYReportar(alias, {
                    numero,
                    describe: `007 -: ${nombre}`,
                    crud: `${nombre}`,
                    descripcion: `Código: ${item.codigo} - Nombre: ${item.mensajeError}`
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

});