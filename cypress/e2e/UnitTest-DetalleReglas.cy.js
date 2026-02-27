import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import ReglasPomCy from "../support/PageObjects/Specs-view-PO/ReglasPom.cy";

const Generales = new metodosGeneralesPomCy()
const Reglas = new ReglasPomCy()


describe("Prueba unitaria del submenu del Crud Reglas...", () =>{

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

    it("Agregar registros a sub nivel", function () {

        const datos = this.dataDetalleReglas.agregar

        const agrupadas = datos.reduce((acc, item) => {
            if (!acc[item.nombreRegla]) {
                acc[item.nombreRegla] = []
            }
            acc[item.nombreRegla].push(item)
            return acc
        }, {})

        cy.wrap(Object.keys(agrupadas)).each((nombreRegla) => {
            cy.log('Procesando Regla con nombre: ' + nombreRegla)

            // 🔎 Buscar Regla
            Generales.BuscarRegistroNombre(nombreRegla)
            Generales.NavegacionSubMenu('Detalle de reglas')

            return cy.wrap(agrupadas[nombreRegla]).each((registro) => {
                Generales.BtnAgregarRegistroSubnivel()
                cy.log("y el agregar que pedo")
              //  const pais = registro.valorPais || registro.nombre
                Reglas.DetalleReglas(
                    registro.correlativo, 
                    registro.exprsion1, 
                    registro.operador, 
                    registro.expresion2, 
                    registro.operadorLogico, 
                    registro.tipoExpresion )

            Generales.BtnAceptarRegistro();
            cy.wait(2000)
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


