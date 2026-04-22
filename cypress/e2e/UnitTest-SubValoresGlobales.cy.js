import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import ValoresGlobalesPomCy from "../support/PageObjects/Specs-view-PO/ValorGlobalesPom.cy";

const Generales = new metodosGeneralesPomCy()
const ValorGlobal = new ValoresGlobalesPomCy()

describe("Prueba unitaria del Sub Crud Valores Globales...", () =>{
    
    let contador = 0;

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

        //const folderPath = 'capturas';
        //cy.task('deleteAllFiles', folderPath);

    })

    beforeEach(() => {
        Generales.IrAPantalla('globalValues')
        cy.readFile('./JsonData/subValorGlobal.json').as('data')

    })

    it("Agregar múltiples registros dinámicamente", function () {

        const datos = this.data.agregar

        const agrupadas = datos.reduce((acc, item) => {
            if (!acc[item.codigoValorG]) {
                acc[item.codigoValorG] = []
            }
            acc[item.codigoValorG].push(item)
            return acc
        }, {})

        let numero = 0 // Contador para alias únicos

        cy.wrap(Object.keys(agrupadas)).each((codigoValorG) => {
            cy.log('Procesando Moneda con código: ' + codigoValorG)

        //Buscar Registro
        Generales.BuscarRegistroCodigo(codigoValorG)
        Generales.NavegacionSubMenu('Valores Globales')

        return cy.wrap(agrupadas[codigoValorG]).each((item) => {
            numero++

            // Asegurar estado limpio antes de abrir el modal (por si acaso)
            cy.get('body').then(($body) => {
                if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                    cy.log('Formulario abierto detectado, cerrando...')
                    Generales.BtnCancelarRegistro()
                }
            })

            // Abrir formulario de Denominación
            Generales.BtnAgregarRegistroSubnivel()

            // Validar que el modal realmente abrió
            cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                .should('be.visible')

            // Llenar datos
            ValorGlobal.SubValoresGlobales(item)

            //const alias = `guardar-${numero}`;
            //cy.intercept('POST', '**/globalValuesByOrganizationTree').as(alias);
            const alias = Generales.interceptar('guardar', numero, 'POST', '**/globalValuesByOrganizationTree')

            Generales.BtnAceptarRegistro()

            let nombre = "Valores Globales por Árbol Organizacional"

                
                Generales.procesarRespuestaYReportar(alias, {
                    numero,
                    describe: `000 -: ${nombre}`,
                    crud: `${nombre}`,
                    descripcion: `Árbol raíz: ${item.arbolRaiz} - Valor: ${item.valor}`
                })

                cy.get('body').then(($body) => {
                        const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                        if (modalAbierto) {
                            cy.log('Modal sigue abierto cerrando manualmente');
                            Generales.BtnCancelarRegistro();
                            cy.wait(500);
                        }
                });

                    /*cy.wait(`@${alias}`).then((interception) => {
                        const status = interception.response.statusCode
                        let estado = 'fallida'
                        let mensaje = ''

                        cy.wait(500)
                        cy.get('body').then(($body) => {
                            const $snack = $body.find('span.message-snack')
                            if ($snack.length) mensaje = $snack.text().trim()
                        }).then(() => {
                            if (status === 200 || status === 201) {
                                estado = 'exitosa'
                                cy.log('Denominación insertada correctamente')
                            } else {
                                estado = 'fallida'
                                cy.log(`Error detectado. Status: ${status}`)
                            }
                        }).then(() => {
                            const nombreCaptura = `Captura-${numero}-Sub Valores Globales-${estado}`
                            cy.screenshot(nombreCaptura, { capture: 'viewport' }).then(() => {
                                cy.task('guardarResultado', {
                                    describe: '00x - Sub Valores Globales',
                                    crud: "Sub Valores Globales",
                                    descripcion: `Registro en Codigo: ${codigoValorG} - Arbol: ${item.arbolRaiz} - valor: ${item.valor}`,
                                    estado: estado,
                                    numero: numero,
                                    mensaje: mensaje,
                                    evidencia: `${nombreCaptura}.png`
                                })
                            })
                        }).then(() => {
                            // Cerrar el modal si aún está abierto
                            cy.get('body').then(($body) => {
                                const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0
                                if (modalAbierto) {
                                    cy.log('Modal sigue abierto → cerrando manualmente')
                                    Generales.BtnCancelarRegistro()
                                    cy.wait(2000)
                                    cy.get('body').then(($bodyAfter) => {
                                        if ($bodyAfter.find('h2:contains("Nuevo Registro")').length > 0) {
                                            cy.log('⚠️ El modal no se cerró después de intentarlo, pero continuamos')
                                        } else {
                                            cy.log('Modal cerrado correctamente')
                                        }
                                    })
                                } else {
                                    cy.log('Modal ya cerrado')
                                }
                            })
                        })
                    })*/

                    // Opcional: Verificar que el modal de denominación se cerró completamente
                    cy.get('mat-dialog-container', { timeout: 10000 }).should('not.exist')
                }).then(() => {
                    cy.log('🔙 Regresando al nivel principal después de procesar todas las denominaciones de la moneda')

                    // Primer regreso - SALIR DEL SUBNIVEL (listado de denominaciones)
                    cy.wait(3000)
                    Generales.Regresar()
                    // Verificar que salimos del subnivel (modal cerrado)
                    cy.get('mat-dialog-container', { timeout: 5000 }).should('not.exist')

                    // Segundo regreso - SALIR DEL DETALLE DE MONEDA
                    cy.wait(3000)
                    Generales.Regresar()
                    // Verificar que estamos en el listado principal de monedas
                    cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 }).should('be.visible')
                })
            })
        })
    })

