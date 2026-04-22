import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import TipoCajeroPomCy from "../support/PageObjects/Specs-view-PO/TipoCajeroPom.cy";

const Generales = new metodosGeneralesPomCy()
const TipoCajero = new TipoCajeroPomCy()


describe("Prueba unitaria del Crud TipoCajero...", () =>{

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
        Generales.IrAPantalla('typeCashier')
    })

    it("Agregar múltiples registros dinámicamente", () => {
        cy.readFile('./JsonData/tipoCajero.json').then((data) => {
            cy.wrap(data.agregar).each((item, index) => {
                const numero = index + 1;
                cy.log(`Insertando código: ${item.codigo}`)

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
                TipoCajero.TipoCajero(
                    //codigo, descripcion, verTotales, permiteTotalizar, permiteRepetirLlave
                    item.codigo,
                    item.descripcion,
                    item.verTotales,
                    item.permiteTotalizar,
                    item.permiteRepetirLlave
                )

                //Intercept backend
                const alias = Generales.interceptar('guardar', numero, 'POST', '**/typeCashier');


                Generales.BtnAceptarRegistro()


                let nombre = "Tipos de cajero"

                Generales.procesarRespuestaYReportar(alias, {
                    numero,
                    describe: `011 -: ${nombre} `,
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