import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import rutinasPomCy from "../support/PageObjects/Specs-view-PO/RutinasPom.cy";

const Generales = new metodosGeneralesPomCy()
const Rutinas = new rutinasPomCy()


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
        Generales.IrAPantalla('routine')
    })

    it("Agregar múltiples registros dinámicamente", () => {
        cy.readFile('./JsonData/rutinas.json').then((dataRutinas) => {
            cy.wrap(dataRutinas.agregar).each((item, index) => {
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
                Rutinas.Rutinas(
                    item.codigo,
                    item.nombre,
                    item.nombreRecurso,
                    item.endpointRutinaRutaComponenteAngular,
                    item.tipoRutina,
                    item.capaEjecucion,
                    item.descripcion,
                    item.parametros,
                    item.tipoOperacion,
                    item.esLogin,
                    item.formatoEnvio,
                    item.formatoRecibido,
                    item.expresion1,
                    item.operacion,
                    item.expresion2,
                    item.tipoExpresion,
                    item.endpointRutinaSecundario,
                    item.enviarListaRecursos,
                    item.ofline,
                    item.online,
                    item.noGuardarLOG
                )

                //Intercept backend
                //cy.intercept('POST', '**/routine').as('guardar')
                const alias = Generales.interceptar('guardar', numero, 'POST', '**/routine');


                Generales.BtnAceptarRegistro()

                let nombre = "Rutinas"

                
                Generales.procesarRespuestaYReportar(alias, {
                    numero,
                    describe: `016 -: ${nombre}`,
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