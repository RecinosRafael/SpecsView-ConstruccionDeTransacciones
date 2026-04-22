import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import formatosPomCy from "../support/PageObjects/Specs-view-PO/FormatosPom.cy";

const Generales = new metodosGeneralesPomCy()
const DetalleFormatos = new formatosPomCy()


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

        //cy.fixture('detalleDeFormato').as('dataDetalleFromato')

    })

    beforeEach(() => {
        Generales.IrAPantalla('format')
        cy.readFile('./JsonData/detalleDeFormato.json').as('dataDetalleFormato')
    })

    it("Agregar registros a sub nivel", function () {

        const datos = this.dataDetalleFormato.agregar

        const agrupadas = datos.reduce((acc, item) => {
            if (!acc[item.codigoFormato]) {
                acc[item.codigoFormato] = []
            }
            acc[item.codigoFormato].push(item)
            return acc
        }, {})

        let numero = 0

        cy.wrap(Object.keys(agrupadas)).each((codigoFormato) => {
            cy.log('Procesando Regla con nombre: ' + codigoFormato)

            // 🔎 Buscar Formato
            Generales.BuscarRegistroCodigo(codigoFormato)
            Generales.NavegacionSubMenu('Detalle de Formato')

            return cy.wrap(agrupadas[codigoFormato]).each((registro) => {
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
                //cy.log("y el agregar que pedo")
                //  const pais = registro.valorPais || registro.nombre
                DetalleFormatos.DetalleFormato(
                    //
                    registro.correlativo,
                    registro.descripcion,
                    registro.valorTipoDatos,
                    registro.constante,
                    registro.removerCeros,
                    registro.mascaraImpresion,
                    registro.valorEspecificacionCaracteristica1,
                    registro.valorOperador,
                    registro.valorEspecificaciOnCaracteristica2,
                    registro.leerPosInicial,
                    registro.leerTamDatos,
                    registro.imprimirFila,
                    registro.imprimirTamDatos,
                    registro.imprimirPosicionColumna,
                    registro.expresionDatosRecurso,
                    registro.expresion1,
                    registro.valorOperacion,
                    registro.expresion2,
                    registro.valorTipoExpresion
                )

                const alias = Generales.interceptar('guardar', numero, 'POST', '**/formatDetail')

                Generales.BtnAceptarRegistro();

                let nombre = "Detalles de Formato"

                Generales.procesarRespuestaYReportar(alias, {
                    numero,
                    describe: `015.1 -: ${nombre}`,
                    crud: `${nombre}`,
                    descripcion: `Correlativo: ${registro.correlativo} - Descripcion: ${registro.descripcion}`
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