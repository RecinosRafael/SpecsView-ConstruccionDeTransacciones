import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import bovedaPomCy from "../support/PageObjects/Specs-view-PO/BovedaPom.cy";
require('cypress-xpath');

const Generales = new metodosGeneralesPomCy()
const Boveda = new bovedaPomCy()


describe("Prueba unitaria del Crud Bóvedas...", () =>{

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
        Generales.IrAPantalla('vaultSpec')
    })


    it("Agregar múltiples registros en crud Bóvedas", () => {
        //cy.fixture('tipoDeDato').then((dataTipoDato) => {
        cy.readFile('./JsonData/boveda.json').then((databovedas) => {
            cy.wrap(databovedas.agregar).each((item, index) => {
                cy.log(`Insertando Nombre: ${item.nombre}`)
                const numero = index + 1;
                cy.log(`Insertando registro #${numero}: ${item.nombre}`);



                //Asegurar estado limpio antes de comenzar
                cy.get('body').then(($body) => {
                    if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                        cy.log('Formulario abierto detectado, cerrando...')
                        Generales.BtnCancelarRegistro()
                    }
                })

                //Abrir formulario
                Generales.BtnAgregarRegistroSubnivel()

                //Validar que el modal realmente abrió
                cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                    .should('be.visible')

                // Llenar datos
                Boveda.Boveda(
                    item.nombre,
                    item.descripcion,
                    item.valorArbolRaiz,
                    item.valorRamaArbol,
                    item.valorJornada,
                    item.valorUsuario
                )

                //Intercept backend
                //cy.intercept('POST', '**/dataType').as('guardar')

                //const alias = `guardar-${numero}`;
                //cy.intercept('POST', '**/vaultSpec').as(alias);
                const alias = Generales.interceptar('guardar', numero, 'POST', '**/vaultSpec')

                Generales.BtnAceptarRegistro()

                let nombre = "Bóvedas"

                Generales.procesarRespuestaYReportar(alias, {
                    numero,
                    describe: `000 -: ${nombre}`,
                    crud: `${nombre}`,
                    descripcion: `Nombre: ${item.nombre} - Descripcion: ${item.descripcion}`
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
                        const nombreCaptura = `Captura-${numero}-Bóvedas-${estado}`;
                        cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                            cy.task('guardarResultado', {
                                describe: '00x - Bóvedas',
                                crud: "Bóvedas",
                                descripcion: `Nombre: ${item.nombre} - Descripción: ${item.descripcion}`,
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
                            }
                        });
                    });
                });*/



            })
        })
    })

})