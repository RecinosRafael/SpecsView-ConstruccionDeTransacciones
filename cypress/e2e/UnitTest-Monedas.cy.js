import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import MonedasPomCy from "../support/PageObjects/Specs-view-PO/MonedasPom.cy";

const Generales = new metodosGeneralesPomCy()
const Monedas = new MonedasPomCy()


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
        Generales.IrAPantalla('money')
    })

    /*it("Agregar múltiples registros dinámicamente", () => {
        cy.fixture('monedas').then((dataMonedas) => {
            cy.wrap(dataMonedas.agregar).each((item) => {
                cy.log(`Insertando código: ${item.codigo}`)

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
                Monedas.Monedas(
                    //codigo, codigoIso, nombre, codigoNumerico, decimales, puntoFlotante
                    item.codigo,
                    item.codigoIso,
                    item.nombre,
                    item.codigoNumerico,
                    item.decimales,
                    item.puntoFlotante
                )

                //Intercept backend
                cy.intercept('POST', '**!/money').as('guardar')

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

    it("Agregar/modificar múltiples registros en crud de Monedas", () => {
        cy.readFile('./JsonData/monedas.json').then((data) => {
            let contador = 0;

            const procesarRegistro = (item, numero, operacion) => {
                cy.log(`🔢 Operación: ${operacion} - Código: ${item.codigo}`);

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
                    cy.log('Agregando nueva moneda');
                    Generales.BtnAgregarRegistroSubnivel();
                    cy.contains('h2', 'Nuevo Registro', { timeout: 10000 }).should('be.visible');
                } else if (operacion === 'modificar') {
                    cy.log('Modificando moneda existente');
                    Generales.BuscarRegistroCodigo(item.codigollave);
                    Generales.BtnModificarRegistro();
                    // En lugar de validar un título fijo, esperamos a que el modal esté presente (formulario visible)
                    cy.get('form', { timeout: 10000 }).should('be.visible');
                } else {
                    cy.log(`⚠️ Operación desconocida: ${operacion} - se omite`);
                    return;
                }

                // Llenar datos
                Monedas.Monedas(
                    item.codigo,
                    item.codigoIso,
                    item.nombre,
                    item.codigoNumerico,
                    item.decimales,
                    item.puntoFlotante
                );

                // Interceptar según operación
                const alias = `guardarMoneda-${numero}`;
                if (operacion === 'agregar') {
                    cy.intercept('POST', '**/money').as(alias);
                    cy.log(`Interceptando POST **/money (alias: ${alias})`);
                } else if (operacion === 'modificar') {
                    cy.intercept('PATCH', '**/money/*').as(alias);
                    cy.log(`Interceptando PATCH **/money/* (alias: ${alias})`);
                }

                Generales.BtnAceptarRegistro();

                cy.wait(`@${alias}`, { timeout: 10000 }).then((interception) => {
                    const status = interception.response.statusCode;
                    const method = interception.request.method;
                    let estado = 'fallida';
                    let mensaje = '';

                    cy.log(`Método: ${method} - Status: ${status}`);

                    // Capturar mensaje del snackbar
                    cy.wait(500);
                    cy.get('body').then(($body) => {
                        const $snack = $body.find('span.message-snack');
                        if ($snack.length) mensaje = $snack.text().trim();
                        else cy.log('No se encontró snackbar');
                    }).then(() => {
                        if (status >= 200 && status < 300) {
                            estado = 'exitosa';
                            cy.log(`${operacion} correcto: ${item.codigo}`);
                        } else {
                            estado = 'fallida';
                            cy.log(`Error al ${operacion}. Status: ${status}`);
                        }
                    }).then(() => {
                        const nombreCaptura = `Captura-${numero}-Monedas-${estado}`;
                        cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                            cy.task('guardarResultado', {
                                describe: '004 - Monedas',
                                crud: "Monedas",
                                descripcion: `Código: ${item.codigo} - Nombre: ${item.nombre}`,
                                estado: estado,
                                numero: numero,
                                mensaje: mensaje,
                                evidencia: `${nombreCaptura}.png`
                            });
                        });
                    }).then(() => {
                        // Cierre del modal según resultado
                        if (estado === 'exitosa') {
                            cy.log('Operación exitosa → esperando cierre automático del modal');
                            // No se hace clic, se espera que el modal se cierre solo
                        } else {
                            cy.log('Operación fallida → cerrando modal con "Cancelar"');
                            Generales.BtnCancelarRegistro();
                        }
                        // Esperar a que el modal desaparezca
                        cy.get('mat-dialog-container', { timeout: 5000 }).should('not.exist');
                        cy.wait(1000);
                    });
                });
            };

            // Procesar en el orden de las propiedades del JSON (primero agregar, luego modificar según orden)
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