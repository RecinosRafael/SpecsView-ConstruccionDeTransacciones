import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import CamposDeLaTransaccionPomCy from "../support/PageObjects/Specs-view-PO/CamposDeLaTransaccion.cy";

const Generales = new metodosGeneralesPomCy()
const CamposDeLaTransaccion = new CamposDeLaTransaccionPomCy()


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
        
        //cy.fixture('valoresCaracteristicas').as('valoresCaracteristicas')

    })

    beforeEach(() => {
        Generales.IrAPantalla('characteristicSpec')
        cy.readFile('./JsonData/valoresCaracteristicas.json').as('valoresCaracteristicas')
    })

    it("Agregar registros a sub nivel", function () {

        const datos = this.valoresCaracteristicas.agregar

        const agrupadas = datos.reduce((acc, item) => {
            if (!acc[item.codigo]) {
                acc[item.codigo] = []
            }
            acc[item.codigo].push(item)
            return acc
        }, {})

        let numero = 0

        cy.wrap(Object.keys(agrupadas)).each((codigo) => {
            cy.log('Procesando Regla con nombre: ' + codigo)

            // 🔎 Buscar Regla
            Generales.BuscarRegistroCodigo(codigo)
            Generales.NavegacionSubMenu('Valores de Característica')

            return cy.wrap(agrupadas[codigo]).each((registro) => {
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

                CamposDeLaTransaccion.ValoresDeCaracteristica(
                    //valor, valorDefecto, descriptor, descriptor2, descriptor3, descriptor4
                    registro.valor, 
                    registro.valorDefecto,  
                    registro.descriptor, 
                    registro.descriptor2, 
                    registro.descriptor3,  
                    registro.descriptor4
                )

                const alias = Generales.interceptar('guardar', numero, 'POST', '**/characteristicSpecValue')

                Generales.BtnAceptarRegistro();

                let nombre = "Valor de Especificación de Característica"

                Generales.procesarRespuestaYReportar(alias, {
                    numero,
                    describe: `014.1 -: ${nombre}`,
                    crud: `${nombre}`,
                    descripcion: `Valor: ${registro.valor} - Descriptor: ${registro.descriptor}`
                })

                cy.get('body').then(($body) => {
                        const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                        if (modalAbierto) {
                            cy.log('Modal sigue abierto cerrando manualmente');
                            Generales.BtnCancelarRegistro();
                            cy.wait(500);
                        }
                });

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


