import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import ValoresGlobalesPomCy from "../support/PageObjects/Specs-view-PO/ValorGlobalesPom.cy";

const Generales = new metodosGeneralesPomCy()
const ValorGlobal = new ValoresGlobalesPomCy()

describe("Prueba unitaria del Crud Valores Globales...", () =>{
    
    let contador = 0;

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
      
        const folderPath = 'capturas';
        cy.task('deleteAllFiles', folderPath);

    
    })
    

    beforeEach(() => {
        Generales.IrAPantalla('globalValues')
        
    })

    it("Agregar múltiples registros dinámicamente", () => {
        cy.readFile('./JsonData/valorGlobal.json').then((data) => {
            cy.wrap(data.agregar).each((item, index) => {
                cy.log(`Insertando registro con codigo: ${item.codigo}`)
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
                ValorGlobal.ValoresGlobales(item)

                //const alias = `guardar-${numero}`;
                //cy.intercept('POST', '**/globalValues').as(alias);
                const alias = Generales.interceptar('guardar', numero, 'POST', '**/globalValues')

                Generales.BtnAceptarRegistro()

                let nombre = "Valores Globales"

                
                Generales.procesarRespuestaYReportar(alias, {
                    numero,
                    describe: `000 -: ${nombre}`,
                    crud: `${nombre}`,
                    descripcion: `Código: ${item.codigo} - Tipo: ${item.tipo}`
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
                            const nombreCaptura = `Captura-${numero}-Valores Globales-${estado}`;
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '00x - Valores Globales',
                                    crud: "Valores Globales",
                                    descripcion: `Código: ${item.codigo} - Tipo: ${item.tipo}`,
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
