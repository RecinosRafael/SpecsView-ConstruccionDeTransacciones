import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import GestorPomCy from "../support/PageObjects/Specs-view-PO/GestorDeTransacciones.cy";
import 'cypress-xpath';

const Generales = new metodosGeneralesPomCy();
const GestorDeTransacciones = new GestorPomCy();

describe("Prueba unitaria del Crud Gestor de Transacciones ...", function() {
    Cypress.on('uncaught:exception', (err, Runnable) => {
        return false;
    });

    before(function() {
        Generales.Login(
            Cypress.env('BASE_URL'),
            Cypress.env('USER'),
            Cypress.env('PASS')
        );
    });

    beforeEach(function() {
        Generales.IrAPantalla('transactionManager');
        //cy.fixture('creacionDePasosTRX').as('data')
        //cy.fixture('asignacionDeCaracteristicas').as('dataAsignar');
        cy.readFile('./JsonData/creacionDePasosTRX.json').as('data')
    });


    //este funciona
    it("Agregar múltiples registros dinámicamente", function() {
        cy.log('Datos cargados:', JSON.stringify(this.data));

        // Agrupar los items por código de transacción
        const transacciones = this.data.agregar.reduce((acc, item) => {
            if (!acc[item.codigoTRX]) {
                acc[item.codigoTRX] = [];
            }
            acc[item.codigoTRX].push(item);
            return acc;
        }, {});

        let numero = 0

        // Procesar cada transacción y TODOS sus pasos
        Object.entries(transacciones).forEach(([codigoTRX, pasos]) => {
            cy.then(() => {
                // Limpiar logs de Cypress (opcional)
                const doc = window.top.document;
                const logContainer = doc.querySelector('.reporter .commands') ||
                    doc.querySelector('.command-list') ||
                    doc.querySelector('.runnable-commands-region');
                if (logContainer) {
                    logContainer.innerHTML = '';
                }
            });

            cy.log(`🔄 Procesando transacción: ${codigoTRX} (${pasos.length} pasos)`);

            // Entrar al iframe para procesar TODOS los pasos de esta transacción
            cy.get('iframe.frame', { timeout: 10000 })
                .its('0.contentDocument.body')
                .should('not.be.empty')
                .then(cy.wrap)
                .within(() => {
                    cy.wait(1500);

                    // Filtrar por el código de transacción actual
                    Generales.filtrarPorCodigo(codigoTRX);
                    Generales.abrirPanel("Opciones");

                    /*cy.xpath(
                        "//div[@role='tab' and @aria-selected='true']//button[contains(@class,'add-button')]"
                    ).click({force: true});
                    cy.wait(1500);*/

                    // Procesar TODOS los pasos de esta transacción SIN SALIR
                    pasos.forEach((paso, index) => {
                        cy.log(`📝 Paso ${index + 1}/${pasos.length}: ${paso.nombrePaso}`);

                        numero++
                        const alias = Generales.interceptar('guardar', numero, 'POST', '**/transactionFlow')

                        GestorDeTransacciones.definirPaso(
                            paso.nombrePaso,
                            paso.tieneReglaCondionanteDePaso,
                            paso.typeReglaParaCondicionarPaso,
                            paso.descripcionPasoTrx
                        );

                        let nombre = "Pasos de la Transacción"

                        Generales.procesarRespuestaYReportarConFrame(alias, {
                            numero,
                            describe: `019.2 -: ${nombre}`,
                            crud: `${nombre}`,
                            descripcion: `Transacción: ${codigoTRX} - Paso: ${paso.nombrePaso}`
                        })

                        //Generales.BtnIframe(paso.nombrePaso, { timeout: 10000, force: true, skipContext: true });
                        cy.wait(2000)

                    });

                    /*cy.get('iframe.frame', { timeout: 10000 })
                        .its('0.contentDocument.body')
                        .should('not.be.empty')
                        .then(cy.wrap)
                        .within(() => {


                    GestorDeTransacciones.AsignacionDCaracteristicaAPaso(
                            paso.caracteristica,
                            paso.tamanioLetra,
                            paso.visualizar,
                            paso.proteger,
                            paso.negrita,
                            paso.verFirmas,
                            paso.expresionCalcularCampo,
                            paso.ReglasCondicionarCampo,
                            paso.operacion,
                            paso.expresionParaValidar,
                            paso.mensajeError,
                            paso.correlativo,
                            paso.productos
                        );

                        // Pequeña pausa entre pasos si es necesario
                        cy.wait(1500);
                        cy.wait(1500);
                    });*/

                    cy.log(`✅ Todos los ${pasos.length} pasos de ${codigoTRX} han sido creados`);
                }); // Salimos del iframe SOLO después de crear TODOS los pasos

            // Esperamos un tiempo para que la operación se complete
            cy.wait(2000);

            // Volvemos a entrar al iframe para hacer clic en "Atrás"
            cy.get('iframe.frame', { timeout: 10000 })
                .its('0.contentDocument.body')
                .should('not.be.empty')
                .then(cy.wrap)
                .within(() => {


                    Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true });



                });

            // Espera a que el posible diálogo aparezca
            cy.wait(2000);


            // Verificar si aparece el diálogo de confirmación DENTRO del iframe
            cy.get('iframe.frame', { timeout: 10000 })
                .its('0.contentDocument.body')
                .should('not.be.empty')
                .then(($body) => {
                    // Buscar el diálogo por su TÍTULO "Confirmar"
                    const $dialog = Cypress.$('mat-dialog-container:contains("Confirmar")', $body);

                    if ($dialog.length > 0) {
                        cy.log('✅ Diálogo Confirmar detectado');

                        // DENTRO del diálogo, buscar el botón que tiene mat-icon con texto "check"
                        const $btnSi = Cypress.$('button mat-icon:contains("check")', $dialog).parents('button');

                        if ($btnSi.length > 0) {
                            cy.log('✅ Botón Sí encontrado dentro del diálogo, haciendo clic');
                            $btnSi.first().click();
                            cy.wait(1000);
                            cy.log('✅ Clic en Sí realizado');
                        } else {
                            cy.log('⚠️ No se encontró botón con icono check dentro del diálogo');
                        }
                    } else {
                        cy.log('ℹ️ No apareció diálogo de confirmación - continuando flujo normal');
                    }
                });


        });
    });





});