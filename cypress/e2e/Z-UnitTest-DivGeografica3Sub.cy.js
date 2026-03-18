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
        
        cy.fixture('divGeografica3').as('divGeografica3')

    })

    beforeEach(() => {
        Generales.IrAPantalla('geographicLevel1')
    })

    it("Agregar registros a sub nivel", function () {

        const datos = this.divGeografica3.agregar

        // const agrupadas = datos.reduce((acc, item) => {
        //     if (!acc[item.codigoDiv]) {
        //         acc[item.codigoDiv] = []
        //     }
        //     acc[item.codigoDiv].push(item)
        //     return acc
        // }, {})


const agrupadas = datos.reduce((acc, item) => {
    const { codigoDiv, codigoDiv2 } = item;
    if (!acc[codigoDiv]) acc[codigoDiv] = {};
    if (!acc[codigoDiv][codigoDiv2]) acc[codigoDiv][codigoDiv2] = [];
    acc[codigoDiv][codigoDiv2].push(item);
    return acc;
}, {});

// Iterar sobre cada código de división principal
cy.wrap(Object.keys(agrupadas)).each((codigoDiv) => {
    cy.log('Procesando División principal: ' + codigoDiv);

    // Buscar el registro por el código de división principal
    Generales.BuscarRegistroCodigo(codigoDiv);
    Generales.NavegacionSubMenu('División geográfica 2');

    // Dentro de esta división principal, obtener los subgrupos por codigoDiv2
    const subgrupos = agrupadas[codigoDiv]; // objeto con claves = codigoDiv2

    // Iterar sobre cada código de división secundaria
    cy.wrap(Object.keys(subgrupos)).each((codigoDiv2) => {
        cy.log('  Procesando División secundaria: ' + codigoDiv2);

        // Buscar el registro por el código de división secundaria
        Generales.BuscarRegistroCodigo(codigoDiv2);
        Generales.NavegacionSubMenu('División geográfica 3');

        // Ahora, para cada item dentro de este subgrupo (puede haber varios con mismo codigoDiv2)
        cy.wrap(subgrupos[codigoDiv2]).each((item) => {
            cy.log('    Agregando item: ' + item.nombre);
            Generales.BtnAgregarRegistroSubnivel();
            DivGeo.DivicionGeografica3(
                item.codigo,
                item.nombre
            );
            Generales.BtnAceptarRegistro();
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

                Generales.IrAPantalla('country')

                Generales.IrAPantalla('geographicLevel1')

                // // Primer regreso - SALIR DEL SUBNIVEL
                // return cy.then(() => {
                //     cy.wait(3000)
                //     Generales.Regresar()
                //     // Verificar que salimos del subnivel (modal cerrado)
                //     return cy.get('mat-dialog-container', { timeout: 5000 })
                //         .should('not.exist')
                // }).then(() => {
                //     // Segundo regreso - SALIR DEL DETALLE DE MONEDA
                //     cy.wait(3000)
                //     Generales.Regresar()
                //     // Verificar que estamos en el listado principal
                //     return cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
                //         .should('be.visible')
                // }) 


                /*
                
                
                pendiete la logica para regresar solo un subnivel 
                pero ya no doy jefe ando cansado
                                
                
                */


            })
        })
    })

})


