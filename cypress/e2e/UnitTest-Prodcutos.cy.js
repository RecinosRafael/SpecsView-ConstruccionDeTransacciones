import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import productosPomCy from "../support/PageObjects/Specs-view-PO/ProductosPom.cy";

const Generales = new metodosGeneralesPomCy()
const Productos = new productosPomCy()


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
        Generales.IrAPantalla('products')
    })

    it("Agregar múltiples registros dinámicamente", () => {
        cy.readFile('./JsonData/productos.json').then((dataProductos) => {
            cy.wrap(dataProductos.agregar).each((item, index) => {
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
                Generales.BtnAgregarRegistroSubnivel()

                //Validar que el modal realmente abrió
                cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                    .should('be.visible')

                // Llenar datos
                Productos.Productos(
                    //codigo, nombre, descripcion, valorMoneda, valorDigitoVerificador, longCuenta, mascaraCuenta
                    item.codigo,
                    item.nombre,
                    item.descripcion,
                    item.valorMoneda,
                    item.valorDigitoVerificador,
                    item.longCuenta,
                    item.mascaraCuenta
                )

                //Intercept backend
                //cy.intercept('POST', '**/products').as('guardar')

                const alias = Generales.interceptar('guardar', numero, 'POST', '**/products')

                Generales.BtnAceptarRegistro()

                let nombre = "Productos"

                Generales.procesarRespuestaYReportar(alias, {
                    numero,
                    describe: `005 -: ${nombre}`,
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