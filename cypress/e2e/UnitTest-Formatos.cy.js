import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import formatosPomCy from "../support/PageObjects/Specs-view-PO/FormatosPom.cy";

const Generales = new metodosGeneralesPomCy()
const Formatos = new formatosPomCy()


describe("Prueba unitaria del Crud de Productos...", () =>{

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
        Generales.IrAPantalla('format')
    })

    it("Agregar múltiples registros dinámicamente", () => {
        cy.readFile('./JsonData/formatos.json').then((dataFormatos) => {
            cy.wrap(dataFormatos.agregar).each((item, index) => {
                cy.log(`Insertando código: ${item.codigo}`)
                const numero = index + 1;
                cy.log(`Insertando registro #${numero}: ${item.codigo}`)

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
                Formatos.Formato(

                    item.codigo,
                    item.nombre,
                    item.nombreAbreviado,
                    item.descripcion,
                    item.plantilla,
                    item.extencion,
                    item.valorDatosTachados,
                    item.valorIncluirImagen,
                    item.posicion,
                    item.tamanioImagen,
                    item.valorParaCatalogos,
                    item.codigoPlantillaAlternativa,
                    item.poscEtiquetaComprobante,
                    item.poscEtiquetaReimprimir
                )

                //Intercept backend
                //cy.intercept('POST', '**/format').as('guardar')
                const alias = Generales.interceptar('guardar', numero, 'POST', '**/format');


                Generales.BtnAceptarRegistro()

                let nombre = "Formatos"

                
                Generales.procesarRespuestaYReportar(alias, {
                    numero,
                    describe: `015 -: ${nombre}`,
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