import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import ReglasPomCy from "../support/PageObjects/Specs-view-PO/ReglasPom.cy";

const Generales = new metodosGeneralesPomCy()
const Reglas = new ReglasPomCy()


describe("Prueba unitaria del Crud Reglas...", () =>{

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
        
        cy.fixture('detalleReglas').as('dataDetalleReglas')

    })

    beforeEach(() => {
        Generales.IrAPantalla('rulesSpec')
    })

    it("Agregar registros a sub nivel", () => {

        const datos = this.dataDetalleReglas.agregar

        const agrupadas = datos.reduce((acc, item) => {
            if (!acc[item.idRegla]) {
                acc[item.idRegla] = []
            }
            acc[item.idRegla].push(item)
            return acc
        }, {})

        cy.wrap(Object.keys(agrupadas)).each((idRegla) => {
            cy.log('Procesando Regla con ID: ' + idRegla)

            // 🔎 Buscar Regla
            Generales.BuscarRegistroCodigo(idRegla)



        })


                //Asegurar estado limpio antes de comenzar
                cy.get('body').then(($body) => {
                    if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                        cy.log('Formulario abierto detectado, cerrando...')
                        Generales.BtnCancelarRegistro()
                    }

                //Abrir formulario
                Generales.BtnAgregarRegistro()

                //Validar que el modal realmente abrió
                cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                    .should('be.visible')

                // Llenar datos
                Reglas.DetalleReglas(
                    //codigo, nombre, descripcion, valorCicloVida, desde, hasta
                    item.codigo,
                    item.nombre,
                    item.descripcion,
                    item.valorCicloVida,
                    item.desde,
                    item.hasta
                )

                //Intercept backend
                cy.intercept('POST', '**/rulesSpec').as('guardar')

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
    })

})