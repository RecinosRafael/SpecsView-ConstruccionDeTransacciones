import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import CamposAdicionalesEntidadPomCy from "../support/PageObjects/Specs-view-PO/CamposAdicionalesEntidadPom.cy";

const Generales = new metodosGeneralesPomCy()
const CamposAdicionalesEntidad = new CamposAdicionalesEntidadPomCy()

describe("Prueba unitaria del Crud Campos Adicionales Por Entidad...", () =>{
    
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
      
        //const folderPath = 'capturas';
        //cy.task('deleteAllFiles', folderPath);

    
    })
    

    beforeEach(() => {
        Generales.IrAPantalla('configureEntityFields')
        
    })

    it("Agregar múltiples registros dinámicamente", () => {
        cy.readFile('./JsonData/CamposAdicionalesEntidad.json').then((data) => {
            cy.wrap(data.agregar).each((item, index) => {
                cy.log(`Insertando registro con caracteristica: ${item.caracteristica}`)


                    const numero = index + 1;
                    cy.log(`Insertando Caracteristica #${numero}: ${item.caracteristica}`);


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
                CamposAdicionalesEntidad.CamposAdicionalesEntidad(item)

                //const alias = `guardar-${numero}`;
                //cy.intercept('POST', '**/additionalFieldsPerEntity').as(alias);

                const alias = Generales.interceptar('guardar', numero, 'POST', '**/additionalFieldsPerEntity')

                Generales.BtnAceptarRegistro()

                let nombre = "Campos Adicionales por Entidad"

                Generales.procesarRespuestaYReportar(alias, {
                    numero,
                    describe: `000 -: ${nombre}`,
                    crud: `${nombre}`,
                    descripcion: `Entidad: ${item.entidad} - Caracteristica: ${item.caracteristica}`
                })
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
                            const nombreCaptura = `Captura-${numero}-Campos Adicionales Por Entidad-${estado}`;
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '00x - Campos Adicionales Por Entidad',
                                    crud: "Campos Adicionales Por Entidad",
                                    descripcion: `Caracteristica: ${item.caracteristica} - Tipo: ${item.tipo}`,
                                    estado: estado,
                                    numero: numero,
                                    mensaje: mensaje,
                                    evidencia: `${nombreCaptura}.png`
                                });
                            });
                        }).then(() => {
                            cy.get('body').then(($body) => {
                                const modalAbierto = $body.find('h2:contains("Nuevo registro")').length > 0;
                                if (modalAbierto) {
                                    cy.log('Modal sigue abierto → cerrando manualmente');
                                    Generales.BtnCancelarRegistro();
                                    cy.wait(2000);
                                    cy.get('body').then(($bodyAfter) => {
                                        if ($bodyAfter.find('h2:contains("Nuevo registro")').length > 0) {
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
