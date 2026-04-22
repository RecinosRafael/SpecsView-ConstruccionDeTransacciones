import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import NivelesDeAutorizacionPomCy from "../support/PageObjects/Specs-view-PO/NivelesDeAutorizacionPom.cy";

const Generales = new metodosGeneralesPomCy()
const nivelDeAutorizacion = new NivelesDeAutorizacionPomCy()

describe("Prueba unitaria del Crud Nivel De Autorizacion...", () =>{
    
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
        Generales.IrAPantalla('authLevel')
        
    })

    it("Agregar múltiples registros dinámicamente", () => {
        cy.readFile('./JsonData/nivelDeAutorizacion.json').then((data) => {
            cy.wrap(data.agregar).each((item, index) => {
                cy.log(`Insertando registro con nombre: ${item.nombre}`)
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
                Generales.clickTooltipButton('Crear', { force: true, timeout: 10000 });

                //Validar que el modal realmente abrió
                cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                    .should('be.visible')

                // Llenar datos
                nivelDeAutorizacion.NivelesDeAutorizacion(item)

                //const alias = `guardar-${numero}`;
                //cy.intercept('POST', '**/authLevel').as(alias);
                const alias = Generales.interceptar('guardar', numero, 'POST', '**/authLevel')

                Generales.BtnAceptarRegistro()

                let nombre = "Nivel de Autorización"
                
                Generales.procesarRespuestaYReportar(alias, {
                    numero,
                    describe: `000 -: ${nombre}`,
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
                            const nombreCaptura = `Captura-${numero}-Nivel De Autorizacion-${estado}`;
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '00x - Nivel De Autorizacion',
                                    crud: "Nivel De Autorizacion",
                                    descripcion: `Arbol: ${item.arbolRaiz} - Nivel: ${item.nivel} - Nombre: ${item.nombre}`,
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
