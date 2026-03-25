import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import TipoRamaAgenciaPomCy from "../support/PageObjects/Specs-view-PO/TipoRamaAgenciaPom.cy";
require('cypress-xpath');

const Generales = new metodosGeneralesPomCy()
const TipoRamaAgencia = new TipoRamaAgenciaPomCy()


describe("Prueba unitaria del Crud Tipo de rama o agencia...", () =>{

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
        Generales.IrAPantalla('typeTreebranch')
    })

    it("Agregar múltiples registros dinámicamente", () => {
        cy.readFile('./JsonData/tipoRamaAgencia.json').then((dataTipoRamaAgencia) => {
            cy.wrap(dataTipoRamaAgencia.agregar).each((item, index) => {
                cy.log(`Insertando código: ${item.codigo}`)

                const numero = index + 1;

                cy.get('body').then(($body) => {
                    if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                        cy.log('Formulario abierto detectado, cerrando...')
                        Generales.BtnCancelarRegistro()
                    }
                })

                Generales.BtnAgregarRegistro()

                cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                    .should('be.visible')

                // Llenar datos
                TipoRamaAgencia.TipoRamaAgencia(
                    item
                )

                //Intercept backend
                const alias = `guardar-${numero}`;
                cy.intercept('POST', '**/typeTreebranch').as(alias);

                Generales.BtnAceptarRegistro()

                // Esperar respuesta y decidir estado
                cy.wait(`@${alias}`).then((interception) => {
                    const status = interception.response.statusCode;
                    let estado = 'fallida';
                    let mensaje = '';

                    cy.wait(500);
                    cy.get('body').then(($body) => {
                        const $snack = $body.find('span.message-snack');
                        if ($snack.length) mensaje = $snack.text().trim();
                    }).then(() => {
                        if (status === 200 || status === 201) {
                            estado = 'exitosa';
                            cy.log('Registro insertado correctamente');
                        } else {
                            estado = 'fallida';
                            cy.log(`Error detectado. Status: ${status}`);
                        }
                    }).then(() => {
                        const nombreCaptura = `Captura-${numero}-Tipo agencia o rama-${estado}`;
                        cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                            cy.task('guardarResultado', {
                                describe: '00x - Tipo agencia o rama',
                                crud: "Tipo agencia o rama",
                                descripcion: `Código: ${item.codigo} - Nombre: ${item.nombre}`,
                                estado: estado,
                                numero: numero,
                                mensaje: mensaje,
                                evidencia: `${nombreCaptura}.png`
                            });
                        });
                    }).then(() => {
                        cy.get('body').then(($body) => {
                            const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                            if (modalAbierto) {
                                cy.log('Modal sigue abierto → cerrando manualmente');
                                Generales.BtnCancelarRegistro();
                                cy.wait(2000);
                                cy.get('body').then(($bodyAfter) => {
                                    if ($bodyAfter.find('h2:contains("Nuevo Registro")').length > 0) {
                                        cy.log('El modal no se cerró después de intentarlo, pero continuamos');
                                    } else {
                                        cy.log('Modal cerrado correctamente');
                                    }
                                });
                            } else {
                                cy.log('Modal ya cerrado');
                            }
                        });
                    });
                });


            })
        })
    })

})