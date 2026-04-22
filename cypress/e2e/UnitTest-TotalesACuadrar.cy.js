import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import totalDeCajeroPomCy from "../support/PageObjects/Specs-view-PO/TotalDeCajeroPom.cy";

const Generales = new metodosGeneralesPomCy()
const TotalesACuadrar = new totalDeCajeroPomCy()


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

        //cy.fixture('totalesACuadrar').as('dataTotalesACuadrar')

    })

    beforeEach(() => {
        Generales.IrAPantalla('totalCashier')
        cy.readFile('./JsonData/totalesACuadrar.json').as('dataTotalesACuadrar')
    })

    it("Agregar registros a sub nivel Totales A cuadrar", function () {

        const datos = this.dataTotalesACuadrar.agregar

        const agrupadas = datos.reduce((acc, item) => {
            if (!acc[item.codigoTotCaj]) {
                acc[item.codigoTotCaj] = []
            }
            acc[item.codigoTotCaj].push(item)
            return acc
        }, {})

        let numero = 0

        cy.wrap(Object.keys(agrupadas)).each((codigoTotCaj) => {
            cy.log('Procesando Regla con nombre: ' + codigoTotCaj)

            // 🔎 Buscar Formato
            Generales.BuscarRegistroCodigo(codigoTotCaj)
            Generales.NavegacionSubMenu('Totales a Cuadrar')

            return cy.wrap(agrupadas[codigoTotCaj]).each((registro) => {
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
                TotalesACuadrar.TotalesCuadra(
                    registro.tipoCajero,
                    registro.cuadraEfectivo
                )

                const alias = Generales.interceptar('guardar', numero, 'POST', '**/totalsToSquare')

                Generales.BtnAceptarRegistro();

                let nombre = "Totales a Cuadrar"

                Generales.procesarRespuestaYReportar(alias, {
                    numero,
                    describe: `017.1 -: ${nombre}`,
                    crud: `${nombre}`,
                    descripcion: `Tipo de Cajero: ${registro.tipoCajero}`
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


