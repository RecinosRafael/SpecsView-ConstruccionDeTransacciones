import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import paisesPomCy from "../support/PageObjects/Specs-view-PO/PaisesPom.cy";

const Generales = new metodosGeneralesPomCy()
const Pais = new paisesPomCy()

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
        Generales.IrAPantalla('country')
    })

    /*it("Agregar múltiples registros dinámicamente", () => {
        cy.fixture('pais').then((dataPais) => {
            cy.wrap(dataPais.agregar).each((item) => {
                cy.log(`Insertando nombre: ${item.nombre}`)

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
                Pais.Pais(
                    item.nombre,
                    item.iso2Code,
                    item.iso3Code,
                    item.tipo
                )

                //Intercept backend
                cy.intercept('POST', '**!/country').as('guardar')

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

    it("Agregar/modificar múltiples registros en crud de países", () => {
        cy.readFile('./JsonData/pais.json').then((data) => {
            let contador = 0; // contador global para números consecutivos

            const procesarRegistro = (item, numero, operacion) => {
                cy.log(`🔢 Operación: ${operacion} - Código: ${item.iso3Code || item.iso2Code}`);

                // Asegurar estado limpio
                cy.get('body').then(($body) => {
                    if ($body.find('h2:contains("Nuevo Registro")').length > 0 ||
                        $body.find('h2:contains("Registro")').length > 0) {
                        cy.log('Formulario abierto detectado, cerrando...');
                        Generales.BtnCancelarRegistro();
                    }
                });

                // Abrir formulario según operación
                if (operacion === 'agregar') {
                    cy.log('Agregando nuevo país');
                    Generales.BtnAgregarRegistro();
                    cy.contains('h2', 'Nuevo Registro', { timeout: 10000 }).should('be.visible');
                } else if (operacion === 'modificar') {
                    cy.log('Modificando país existente');
                    Generales.BuscarRegistroIso3Code(item.iso3Codellave || item.iso3Code);
                    Generales.BtnModificarRegistro();
                    //cy.contains('h2', 'Registro', { timeout: 10000 }).should('be.visible');
                } else {
                    cy.log(`Operación desconocida: ${operacion} - se omite`);
                    return;
                }

                // Llenar datos
                Pais.Pais(
                    item.nombre,
                    item.iso2Code,
                    item.iso3Code,
                    item.tipo
                );

                // Interceptar según operación (método específico)
                const alias = `guardarPais-${numero}`;
                if (operacion === 'agregar') {
                    cy.intercept('POST', '**/country').as(alias);
                    cy.log(`Interceptando POST **/country (alias: ${alias})`);
                } else if (operacion === 'modificar') {
                    cy.intercept('PATCH', '**/country/*').as(alias);
                    cy.log(`Interceptando PATCH **/country/* (alias: ${alias})`);
                }

                Generales.BtnAceptarRegistro();

                let nombre = "Países"

                Generales.procesarRespuestaYReportar(alias, {
                    numero,
                    describe: `003 -: ${nombre}`,
                    crud: `${nombre}`,
                    descripcion: `Código: ${item.iso2Code || item.iso3Code} - Nombre: ${item.nombre}`
                })

                cy.get('body').then(($body) => {
                        const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                        if (modalAbierto) {
                            cy.log('Modal sigue abierto cerrando manualmente');
                            Generales.BtnCancelarRegistro();
                            cy.wait(500);
                        }
                });

                /*cy.wait(`@${alias}`, { timeout: 10000 }).then((interception) => {
                    const status = interception.response.statusCode;
                    const method = interception.request.method;
                    let estado = 'fallida';
                    let mensaje = '';

                    cy.log(`📡 Método: ${method} - Status: ${status}`);

                    // Capturar mensaje del snackbar
                    cy.wait(500);
                    cy.get('body').then(($body) => {
                        const $snack = $body.find('span.message-snack');
                        if ($snack.length) mensaje = $snack.text().trim();
                        else cy.log('No se encontró snackbar');
                    }).then(() => {
                        if (status >= 200 && status < 300) {
                            estado = 'exitosa';
                            cy.log(`${operacion} correcto: ${item.iso3Code || item.iso2Code}`);
                        } else {
                            estado = 'fallida';
                            cy.log(`Error al ${operacion}. Status: ${status}`);
                        }
                    }).then(() => {
                        const nombreCaptura = `Captura-${numero}-Países-${estado}`;
                        cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                            cy.task('guardarResultado', {
                                describe: '003 - Países',
                                crud: "Países",
                                descripcion: `Código: ${item.iso3Code || item.iso2Code} - Nombre: ${item.nombre}`,
                                estado: estado,
                                numero: numero,
                                mensaje: mensaje,
                                evidencia: `${nombreCaptura}.png`
                            });
                        });
                    }).then(() => {
                        // Cierre del modal según resultado
                        if (estado === 'exitosa') {
                            cy.log('Operación exitosa → cerrando modal con "Atrás"');

                            Generales.Regresar()
                        } else {
                            cy.log('Operación fallida → cerrando modal con "Cancelar"');
                            Generales.BtnCancelarRegistro();
                        }
                        // Esperar a que el modal desaparezca
                        cy.get('mat-dialog-container', { timeout: 5000 }).should('not.exist');
                        cy.wait(1000);
                    });
                });*/
            };

            // Procesar en el orden de las propiedades del JSON (primero agregar, luego modificar)
            Object.entries(data).forEach(([key, registros]) => {
                if (Array.isArray(registros) && registros.length > 0) {
                    const operacion = key.toLowerCase();
                    cy.wrap(registros).each((item) => {
                        contador++;
                        procesarRegistro(item, contador, operacion);
                    });
                }
            });
        });
    });

})