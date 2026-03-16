import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import GestorPomCy from "../support/PageObjects/Specs-view-PO/GestorDeTransacciones.cy";
import 'cypress-xpath';

const Generales = new metodosGeneralesPomCy()
const GestorDeTransacciones = new GestorPomCy()


describe("Prueba unitaria del Crud Gestor de Transacciones ...", () =>{

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

        cy.fixture('creacionDePasosTRX').as('dataCreacionDePasosTRX')
    })



    beforeEach(() => {
        Generales.IrAPantalla('transactionManager')
    })

    /*it("Agregar registros a sub nivel", function () {
        const datos = this.dataCreacionDePasosTRX.agregar;

        // Agrupar manteniendo el orden del JSON original
        const agrupadas = {};
        const ordenCodigos = [];

        datos.forEach(item => {
            if (!agrupadas[item.codigoTRX]) {
                agrupadas[item.codigoTRX] = [];
                ordenCodigos.push(item.codigoTRX);
            }
            agrupadas[item.codigoTRX].push(item);
        });

        cy.get('iframe.frame', { timeout: 10000 })
            .its('0.contentDocument.body')
            .should('not.be.empty')
            .then(cy.wrap)
            .within(() => {

                cy.wrap(ordenCodigos).each((codigoTRX) => {
                    cy.log(`\n🔄 Procesando transacción con código: ${codigoTRX}`);

                    // PASO 1: Filtrar por código
                    Generales.filtrarPorCodigo(codigoTRX);

                    //paso 2 abre las opciones

                    Generales.abrirPanel("Opciones")

                    //paso 3 cliec en boton agregar paso solo si esta cerrado
                    Generales.clickAgregarPaso()

                    //paso 4 llena con el metodo

                    DefinicionDePasos

                    //paso 4 da clic en aceptar y empieza la vuelta de nuevo para seguir el flujo del json
                    Generales.BtnIframe("Aceptar",{ timeout: 10000, force: true, skipContext: true })









                });
            });
    });*/


    it("Agregar registros a sub nivel", function () {
        const datos = this.dataCreacionDePasosTRX.agregar;

        // Agrupar manteniendo el orden del JSON original
        const agrupadas = {};
        const ordenCodigos = [];

        datos.forEach(item => {
            if (!agrupadas[item.codigoTRX]) {
                agrupadas[item.codigoTRX] = [];
                ordenCodigos.push(item.codigoTRX);
            }
            agrupadas[item.codigoTRX].push(item);
        });

        cy.get('iframe.frame', { timeout: 10000 })
            .its('0.contentDocument.body')
            .should('not.be.empty')
            .then(cy.wrap)
            .within(() => {

                cy.wrap(ordenCodigos).each((codigoTRX) => {
                    const pasosTransaccion = agrupadas[codigoTRX];

                    cy.log(`\n🔄 Procesando transacción con código: ${codigoTRX}`);
                    cy.log(`📋 Pasos a crear: ${pasosTransaccion.length}`);

                    // PASO 1: Filtrar por código
                    Generales.filtrarPorCodigo(codigoTRX);
                    cy.wait(3000); // WAIT para que cargue el filtro

                    // PASO 2: Abrir panel Opciones
                    cy.log('📂 Abriendo panel Opciones');
                    Generales.abrirPanel("Opciones");
                    cy.wait(2000); // WAIT para que se expanda

                    // PASO 3: Crear CADA paso del JSON
                    for (let i = 0; i < pasosTransaccion.length; i++) {
                        const paso = pasosTransaccion[i];

                        cy.log(`\n   📝 Creando paso ${i + 1}/${pasosTransaccion.length}: "${paso.nombrePaso}"`);

                        if (paso.nombrePaso) {
                            // Click en botón + (tu método existente)
                            cy.log('      🖱️ Click en botón +');
                            Generales.clickAgregarPaso();

                            // WAIT LARGO para que cargue el modal COMPLETAMENTE
                            cy.wait(8000); // 8 segundos para que cargue todo

                            // Usar TU método original (sin modificar)
                            cy.log('      ✏️ Ejecutando DefinicionDePasos');
                            GestorDeTransacciones.DefinicionDePasos(
                                paso.nombrePaso,
                                paso.tieneReglaCondionanteDePaso === "si", // Convertir a booleano
                                paso.typeReglaParaCondicionarPaso || "",
                                paso.descripcionPasoTrx || ""
                            );

                            cy.wait(2000); // WAIT entre pasos
                        }
                    }

                    // PASO 4: Dar clic en Aceptar
                    cy.log('💾 Guardando todos los pasos');
                    cy.wait(2000);
                    Generales.BtnIframe("Aceptar", { timeout: 10000, force: true, skipContext: true });
                    cy.wait(3000);

                    // PASO 5: Regresar al listado principal
                    cy.log('🔙 Regresando al listado principal');
                    cy.wait(2000);
                    Generales.BtnIframe("Atrás", { timeout: 10000, force: true, skipContext: true });

                    cy.wait(2000);
                    cy.get('body').then($body => {
                        if ($body.find('mat-dialog-container').length > 0) {
                            cy.get('mat-dialog-container')
                                .find('button[mat-mini-fab]')
                                .first()
                                .click({ force: true });
                            cy.wait(2000);
                        }
                    });

                    cy.contains('mat-expansion-panel-header', 'Filtros', { timeout: 15000 })
                        .should('be.visible');

                    cy.wait(2000);
                });

                cy.log('\n🎉 TODOS LOS PASOS CREADOS EXITOSAMENTE');
            });
    });






})