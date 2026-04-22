import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import tipoDeDatoCy from "../support/PageObjects/Specs-view-PO/TipoDeDatoPom.cy";
require('cypress-xpath');

const Generales = new metodosGeneralesPomCy()
const TipoDato = new tipoDeDatoCy()


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
        Generales.IrAPantalla('dataType')
    })

    let contador = 0;

    /*it("Agregar múltiples registros dinámicamente", () => {
        cy.fixture('tipoDeDato').then((dataTipoDato) => {
            cy.wrap(dataTipoDato.agregar).each((item) => {
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
                TipoDato.TipoDato(
                    item.codigo,
                    item.nombre,
                    item.descripcion
                )

                //Intercept backend
                cy.intercept('POST', '**!/dataType').as('guardar')

                Generales.BtnAceptarRegistro()


                cy.wait('@guardar').then((interception) => {
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
                })
            })
        })
    })*/

    it("Agregar múltiples registros en crud Tipo de Dato", () => {
        //cy.fixture('tipoDeDato').then((dataTipoDato) => {
        cy.readFile('./JsonData/tipoDeDato.json').then((dataTipoDato) => {
            cy.wrap(dataTipoDato.agregar).each((item, index) => {
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
                Generales.BtnAgregarRegistro()

                //Validar que el modal realmente abrió
                cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                    .should('be.visible')

                // Llenar datos
                TipoDato.TipoDato(
                    item.codigo,
                    item.nombre,
                    item.descripcion
                )

                //Intercept backend
                //cy.intercept('POST', '**/dataType').as('guardar')

                //const alias = `guardar-${numero}`;
                //cy.intercept('POST', '**/dataType').as(alias);

                const alias = Generales.interceptar('guardar', numero, 'POST', '**/dataType');

                Generales.BtnAceptarRegistro()

                let nombre = "Tipo de Dato"

                Generales.procesarRespuestaYReportar(alias, {
                    numero,
                    describe: `002 -: ${nombre}`,
                    crud: `${nombre}`,
                    descripcion: `Código: ${item.codigo} - Nombre: ${item.nombre}`
                })

                cy.get('body').then(($body) => {
                        const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                        if (modalAbierto) {
                            cy.log('Modal sigue abierto cerrando manualmente');
                            Generales.BtnCancelarRegistro();
                            cy.wait(500);
                        }
                });

                // Esperar respuesta y decidir estado
                /*cy.wait(`@${alias}`).then((interception) => {
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
                        const nombreCaptura = `Captura-${numero}-Tipo de Dato-${estado}`;
                        cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                            cy.task('guardarResultado', {
                                describe: '002 - Tipo de Dato',
                                crud: "Tipo de Dato",
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
                                        cy.log('⚠️ El modal no se cerró después de intentarlo, pero continuamos');
                                    } else {
                                        cy.log('Modal cerrado correctamente');
                                    }
                                });
                            } else {
                                cy.log('Modal ya cerrado');
                            
                        });}
                    });
                });*/



            })
        })
    })

})