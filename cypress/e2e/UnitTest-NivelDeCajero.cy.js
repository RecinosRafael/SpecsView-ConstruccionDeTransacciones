import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import nivelesDeCajeroPomCy from "../support/PageObjects/Specs-view-PO/NivelesDeCajeroPom.cy";

const Generales = new metodosGeneralesPomCy()
const NivelCajero = new nivelesDeCajeroPomCy()


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
        Generales.IrAPantalla('cashierLevel')
    })

    it("Agregar múltiples registros dinámicamente", () => {
        cy.readFile('./JsonData/NivelDeCajero.json').then((dataNivelDeCajero) => {
            cy.wrap(dataNivelDeCajero.agregar).each((item, index) => {
                cy.log(`Insertando código: ${item.codigo}`)
                const numero = index + 1;

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
                NivelCajero.NivelCajero(
                    //ccodigo, valorArbolRaiz, nombre, descripcion, valorNivelAutorizacion, rolKeycloak
                    item.codigo,
                    item.valorArbolRaiz,
                    item.nombre,
                    item.descripcion,
                    item.valorNivelAutorizacion,
                    item.rolKeycloak
                )

                //Intercept backend
                const alias = Generales.interceptar('guardar', numero, 'POST', '**/cashierLevel');


                Generales.BtnAceptarRegistro()

                let nombre = "Niveles de Cajero"

                Generales.procesarRespuestaYReportar(alias, {
                    numero,
                    describe: `002 -: ${nombre} `,
                    crud: `${nombre} `,
                    descripcion: `Código: ${item.codigo} - Nombre: ${item.nombre}`
                });

                cy.get('body').then(($body) => {
                    const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                    if (modalAbierto) {
                        cy.log('Modal sigue abierto cerrando manualmente');
                        Generales.BtnCancelarRegistro();
                        cy.wait(500);
                    }
                });
            })
        })
    })

})