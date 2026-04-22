import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import MonedasPomCy from "../support/PageObjects/Specs-view-PO/MonedasPom.cy";

const Generales = new metodosGeneralesPomCy()
const Denominaciones = new MonedasPomCy()


describe("Prueba unitaria del submenu del Crud Denominaciones...", () =>{

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
        Generales.IrAPantalla('money')
        cy.readFile('./JsonData/denominaciones.json').as('dataDenominaciones')
    })

    it("Agregar registros a sub nivel", function () {

        const datos = this.dataDenominaciones.agregar

        const agrupadas = datos.reduce((acc, item) => {
            if (!acc[item.codigoMoneda]) {
                acc[item.codigoMoneda] = []
            }
            acc[item.codigoMoneda].push(item)
            return acc
        }, {})

        let numero = 0

        cy.wrap(Object.keys(agrupadas)).each((codigoMoneda) => {
            cy.log('Procesando Regla con nombre: ' + codigoMoneda)

            // 🔎 Buscar Regla
            Generales.BuscarRegistroCodigo(codigoMoneda)
            Generales.NavegacionSubMenu('Denominación de Moneda')

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

                //  const pais = registro.valorPais || registro.nombre
                Denominaciones.DenominacionMoneda(
                    //nombre, etiqueta, valorTipo, monto
                    item.nombre,
                    item.etiqueta,
                    item.valorTipo,
                    item.monto
                )

                const alias = Generales.interceptar('guardar', numero, 'POST', '**/denominationSpec')

                Generales.BtnAceptarRegistro();

                let nombre = "Denominaciones"

                Generales.procesarRespuestaYReportar(alias, {
                    numero,
                    describe: `004.1 -: ${nombre}`,
                    crud: `${nombre}`,
                    descripcion: `Codigo Moneda: ${item.codigoMoneda} - Nombre: ${item.nombre}`
                })

                cy.get('body').then(($body) => {
                        const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                        if (modalAbierto) {
                            cy.log('Modal sigue abierto cerrando manualmente');
                            Generales.BtnCancelarRegistro();
                            cy.wait(500);
                        }
                });
                
                /*cy.wait(2000)
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
                });*/


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


