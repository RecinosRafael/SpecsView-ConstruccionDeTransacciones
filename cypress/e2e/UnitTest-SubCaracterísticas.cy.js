import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import CamposDeLaTransaccionPomCy from "../support/PageObjects/Specs-view-PO/CamposDeLaTransaccion.cy";

const Generales = new metodosGeneralesPomCy()
const CamposDeLaTransaccion = new CamposDeLaTransaccionPomCy()


describe("Prueba unitaria del submenu del Crud Sub Características...", () =>{

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
        
        cy.fixture('subCaracteristicas').as('subCaracteristicas')

    })

    beforeEach(() => {
        Generales.IrAPantalla('characteristicSpec')
    })

    it("Agregar registros a sub nivel", function () {

        const datos = this.subCaracteristicas.agregar

        const agrupadas = datos.reduce((acc, item) => {
            if (!acc[item.codigo]) {
                acc[item.codigo] = []
            }
            acc[item.codigo].push(item)
            return acc
        }, {})

        cy.wrap(Object.keys(agrupadas)).each((codigo) => {
            cy.log('Procesando subCaracteristicas con codigo: ' + codigo)

            // 🔎 Buscar Regla
            Generales.BuscarRegistroCodigo(codigo)
            Generales.NavegacionSubMenu('Sub Características')

            return cy.wrap(agrupadas[codigo]).each((registro) => {
                Generales.BtnAgregarRegistroSubnivel()
                CamposDeLaTransaccion.SubCaracteristicas(
                //correlativo, subCaracteristica, campoTotalizable, TipoOperacion, campoMandatorio, campoVisualizable, campoProtegido
                    registro.correlativo, 
                    registro.subCaracteristica,   
                    registro.campoTotalizable, 
                    registro.TipoOperacion, 
                    registro.campoMandatorio, 
                    registro.campoVisualizable, 
                    registro.campoProtegido
                )

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


