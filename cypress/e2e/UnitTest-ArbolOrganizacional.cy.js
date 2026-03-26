import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import ArbolOrganizacionalPom from "../support/PageObjects/Specs-view-PO/ArbolOrganizacionalPom.cy";

const Generales = new metodosGeneralesPomCy()
const ArbolOrganizacional = new ArbolOrganizacionalPom()

describe("Prueba metodo de carga", () =>{
    Cypress.on('uncaught:exception',(err,Runnable) =>{
        return false
    })

    before(() => {
        Generales.Login(
            Cypress.env('BASE_URL'),
            Cypress.env('USER'),
            Cypress.env('PASS')
        )
    })

    beforeEach(() => {
        Generales.IrAPantalla('organizationTree')
    })

    it("Agrear registro", () => {
        cy.fixture('arbolOrganizacional').then((dataArbol) => {
            cy.wrap(dataArbol.agregar).each((item) => {
                cy.log(`Insertando codigo: ${item.codigo}`)
            
                cy.get('body').then(($body) => {
                    if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                        cy.log('Formulario abierto detectado, cerrando...')
                        Generales.BtnCancelarRegistro()
                    }
                })

                Generales.BtnAgregarRegistros()

                cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                    .should('be.visible')

                ArbolOrganizacional.ArbolOrganizacional(
                    item.codigo,
                    item.nombre,
                    item.descripcion,
                    item.responsable,
                    item.cicloDeVida,
                    item.canal,
                    item.validoDesde,
                    item.validoHasta,
                    item.esRaiz,
                    item.padre,
                    item.tipoRama,
                    item.puesto,
                    item.codigoEquivalente,
                    item.nivelArbol,
                    item.nombreUsuario,
                    item.complementoDireccion,
                    item.tiempoLimite,
                    item.nivelGeografico1,
                    item.nivelGeografico2,
                    item.nivelGeografico3,
                    item.region,
                    item.latitud,
                    item.longitud
                )

                cy.intercept('POST', '**/organizationTree').as('guardar')

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