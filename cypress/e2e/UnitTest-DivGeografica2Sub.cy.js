import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import DivGeografica from "../support/PageObjects/Specs-view-PO/DivGeografica.cy";

const Generales = new metodosGeneralesPomCy()
const DivGeo = new DivGeografica()


describe("Prueba unitaria del submenu del Crud DivGeografica...", () =>{

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

        cy.readFile('./JsonData/divGeografica2.json').as('divGeografica2')

    })

    beforeEach(() => {
        Generales.IrAPantalla('geographicLevel1')
    })

    /*it("Agregar registros a sub nivel", function () {

        const datos = this.divGeografica2.agregar

        const agrupadas = datos.reduce((acc, item) => {
            if (!acc[item.codigoDiv]) {
                acc[item.codigoDiv] = []
            }
            acc[item.codigoDiv].push(item)
            return acc
        }, {})

        cy.wrap(Object.keys(agrupadas)).each((codigoDiv) => {
            cy.log('Procesando Regla con nombre: ' + codigoDiv)

            // 🔎 Buscar Regla
            Generales.BuscarRegistroCodigo(codigoDiv)
            Generales.NavegacionSubMenu('División geográfica 2')

            return cy.wrap(agrupadas[codigoDiv]).each((item) => {
                Generales.BtnAgregarRegistroSubnivel()
                cy.log("y el agregar que pedo")
              //  const pais = registro.valorPais || registro.nombre
                DivGeo.DivisionGeografica2(
                    //codigo, nombre
                    item.codigo,
                    item.nombre
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
    })*/


    it("Agregar registros a sub nivel", function () {
        const datos = this.divGeografica2.agregar;

        const agrupadas = datos.reduce((acc, item) => {
            if (!acc[item.codigoDiv]) {
                acc[item.codigoDiv] = [];
            }
            acc[item.codigoDiv].push(item);
            return acc;
        }, {});

        cy.wrap(Object.keys(agrupadas)).each((codigoDiv) => {
            cy.log('Procesando Regla con nombre: ' + codigoDiv);

            // 🔎 Buscar Regla
            Generales.BuscarRegistroCodigo(codigoDiv);
            Generales.NavegacionSubMenu('División geográfica 2');

            return cy.wrap(agrupadas[codigoDiv]).each((item, idx) => {
                const numero = idx + 1;

                Generales.BtnAgregarRegistroSubnivel();
                cy.log("Agregando registro");

                // Llenar datos
                DivGeo.DivisionGeografica2(item.codigo, item.nombre);

                // Interceptar (igual que en Tipo de Dato)
                const alias = Generales.interceptar('guardarSubnivel', numero, 'POST', '**/geographicLevel2');

                Generales.BtnAceptarRegistro();

                // Procesar respuesta y reportar (igual que en Tipo de Dato)
                let nombre = "División Geográfica 2";
                Generales.procesarRespuestaYReportar(alias, {
                    numero,
                    describe: `División Geográfica 2 - ${codigoDiv}`,
                    crud: nombre,
                    descripcion: `Código: ${item.codigo} - Nombre: ${item.nombre}`
                });

                // Cerrar modal manualmente si aún está abierto (como en Tipo de Dato)
                cy.get('body').then(($body) => {
                    const modalAbierto = $body.find('h2:contains("Nuevo Registro")').length > 0;
                    if (modalAbierto) {
                        cy.log('Modal sigue abierto → cerrando manualmente');
                        Generales.BtnCancelarRegistro();
                        cy.wait(500);
                    }
                });

                // Esperar a que el modal desaparezca completamente (como en la lógica original)
                cy.get('mat-dialog-container', { timeout: 10000 }).should('not.exist');
            }).then(() => {
                cy.log('🔙 Regresando al nivel principal');

                // Primer regreso - SALIR DEL SUBNIVEL
                cy.wait(3000);
                Generales.Regresar();
                cy.get('mat-dialog-container', { timeout: 5000 }).should('not.exist');

                // Segundo regreso - SALIR DEL DETALLE DE MONEDA
                cy.wait(3000);
                Generales.Regresar();
                cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 }).should('be.visible');
            });
        });
    });


})


