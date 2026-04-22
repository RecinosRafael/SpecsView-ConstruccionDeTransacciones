import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import MonedasPomCy from "../support/PageObjects/Specs-view-PO/MonedasPom.cy";

const Generales = new metodosGeneralesPomCy()
const PaisesQueLoUsan = new MonedasPomCy()

describe('CRUD Países que usan moneda', () => {

    before(() => {

        Generales.Login(
            Cypress.env('BASE_URL'),
            Cypress.env('USER'),
            Cypress.env('PASS')
        )

        //cy.fixture('paisesQueLoUsan').as('dataPaises')

    })

    beforeEach(() => {
        Generales.IrAPantalla('money')
        cy.readFile('./JsonData/paisesQueLoUsan.json').as('dataPaises')
    })

    it('Insertar países agrupados por moneda', function () {
        
        const datos = this.dataPaises.agregar
        
        const agrupadas = datos.reduce((acc, item) => {
            if (!acc[item.codigoMoneda]) {
                acc[item.codigoMoneda] = []
            }
            acc[item.codigoMoneda].push(item)
            return acc
        }, {})

        let numero = 0

        cy.wrap(Object.keys(agrupadas)).each((codigoMoneda) => {
            cy.log('💰 Procesando moneda: ' + codigoMoneda)

            Generales.BuscarRegistroCodigo(codigoMoneda)
            Generales.NavegacionSubMenu('Paises que la usan')

            return cy.wrap(agrupadas[codigoMoneda]).each((item) => {
                numero++

                cy.get('body').then(($body) => {
                if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                    cy.log('Formulario abierto detectado, cerrando...')
                    Generales.BtnCancelarRegistro()
                    }
                })
                
                Generales.BtnAgregarRegistroSubnivel()

                cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                .should('be.visible')
                
                //const pais = registro.valorPais || registro.nombre
                PaisesQueLoUsan.PaisesQueUsan(item.valorPais)

                const alias = Generales.interceptar('guardar', numero, 'POST', '**/countriesUseMoney')

                Generales.BtnAceptarRegistro();

                let nombre = "Paises por Moneda"

                Generales.procesarRespuestaYReportar(alias, {
                    numero,
                    describe: `004.2 -: ${nombre}`,
                    crud: `${nombre}`,
                    descripcion: `Codigo Moneda: ${item.codigoMoneda} - Valor país: ${item.valorPais}`
                })

                cy.get('body').then(($body) => {
                        const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                        if (modalAbierto) {
                            cy.log('Modal sigue abierto cerrando manualmente');
                            Generales.BtnCancelarRegistro();
                            cy.wait(500);
                        }
                });

                /*return cy.get('@paisExiste').then((existe) => {
                    if (existe) {
                        Generales.BtnAceptarRegistro()
                    } else {
                        Generales.BtnCancelarRegistro()
                    }
                    // SIEMPRE esperar que el modal desaparezca
                    return cy.get('mat-dialog-container', { timeout: 10000 })
                        .should('not.exist')

                })*/
            }).then(() => {
                cy.log('🔙 Regresando al nivel principal')

                // Primer regreso - SALIR DEL SUBNIVEL
                return cy.then(() => {
                    cy.wait(3000)
                    Generales.Regresar()
                    // Verificar que salimos del subnivel (modal cerrado)
                    return cy.get('mat-dialog-container', { timeout: 5000 })
                        .should('not.exist')
                }).then(() => {
                    // Segundo regreso - SALIR DEL DETALLE DE MONEDA
                    cy.wait(3000)
                    Generales.Regresar()
                    // Verificar que estamos en el listado principal
                    return cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
                        .should('be.visible')
                }) 
            })
        })
    })

})