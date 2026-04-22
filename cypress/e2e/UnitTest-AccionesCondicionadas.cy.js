import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import AccionesCondicionadasPomCy from "../support/PageObjects/Specs-view-PO/AccionesCondicionadasPom.cy";

const Generales = new metodosGeneralesPomCy()
const AccionCondicionada = new AccionesCondicionadasPomCy()


describe("Prueba unitaria del Crud Acciones Condicionadas ...", () =>{

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
        Generales.IrAPantalla('conditionedActions')
    })

    it("Agregar múltiples registros dinámicamente", () => {
        cy.readFile('./JsonData/accionesCondicionadas.json').then((data) => {
            cy.wrap(data.agregar).each((item, index) => {
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
                Generales.BtnAgregarRegistros()

                //Validar que el modal realmente abrió
                cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                    .should('be.visible')

                // Llenar datos
                AccionCondicionada.AccionCodicionada(
                //transaccion, correlativo, regla, accion, ejecutar, descripcion
                    item.transaccion, 
                    item.correlativo, 
                    item.regla, 
                    item.accion, 
                    item.ejecutar,
                    item.descripcion
                )

                //Intercept backend
                //cy.intercept('POST', '**/conditionedActions').as('guardar')
                const alias = Generales.interceptar('guardar', numero, 'POST', '**/conditionedActions')
                
                Generales.BtnAceptarRegistro()

                let nombre = "Acciones Condicionadas"

                Generales.procesarRespuestaYReportar(alias, {
                    numero,
                    describe: `000 -: ${nombre}`,
                    crud: `${nombre}`,
                    descripcion: `Código: ${item.transaccion} - Nombre: ${item.correlativo}`
                })

                cy.get('body').then(($body) => {
                        const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                        if (modalAbierto) {
                            cy.log('Modal sigue abierto cerrando manualmente');
                            Generales.BtnCancelarRegistro();
                            cy.wait(500);
                        }
                });

                cy.wait(1500)
                return cy.get('body').then(($body) => {
                    // Buscar específicamente el snackbar de error
                    const snackBarError = $body.find('.snack-container__error');
                    
                    if (snackBarError.length > 0) {
                        // Obtener el mensaje específico
                        const mensajeError = snackBarError.find('.message-snack').text();
                        cy.log(`⚠️ Error detectado: ${mensajeError}`);
                        
                        // Cerrar el snackbar si tiene botón de cerrar
                        cy.get('.snack--btn-close').click();
                        
                        Generales.BtnCancelarRegistro();
                        cy.log('❌ Registro duplicado - cancelando');
                    } else {
                        cy.log('✅ No hay errores - aceptando');
                    }
                    
                    return cy.get('mat-dialog-container', { timeout: 10000 })
                        .should('not.exist');
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