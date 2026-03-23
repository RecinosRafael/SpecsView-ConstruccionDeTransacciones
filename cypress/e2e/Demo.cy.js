// ============================================
// IMPORTS DE TODOS LOS PAGE OBJECTS
// ============================================

import MetodosGeneralesPom from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy"
import AccionesCondicionadasPom from "../support/PageObjects/Specs-view-PO/AccionesCondicionadasPom.cy"
import CamposDeLaTransaccion from "../support/PageObjects/Specs-view-PO/CamposDeLaTransaccion.cy"
import EnvioDeTransacciones from "../support/PageObjects/Specs-view-PO/EnvioDeTransacciones.cy"
import EquivalenciasPom from "../support/PageObjects/Specs-view-PO/EquivalenciasPom.cy"
import FormatosPom from "../support/PageObjects/Specs-view-PO/FormatosPom.cy"
import GestorDeTransacciones from "../support/PageObjects/Specs-view-PO/GestorDeTransacciones.cy"
import MensajesDeErrorPom from "../support/PageObjects/Specs-view-PO/MensajesDeErrorPom.cy"
import MonedasPom from "../support/PageObjects/Specs-view-PO/MonedasPom.cy"
import NivelesDeCajeroPom from "../support/PageObjects/Specs-view-PO/NivelesDeCajeroPom.cy"
import PaisesPom from "../support/PageObjects/Specs-view-PO/PaisesPom.cy"
import PlantillaDeComprobantePom from "../support/PageObjects/Specs-view-PO/PlantillaDeComprobantePom.cy"
import ProductosPom from "../support/PageObjects/Specs-view-PO/ProductosPom.cy"
import RazonDeReversoPom from "../support/PageObjects/Specs-view-PO/RazonDeReversoPom.cy"
import RazonesDeBloqueoPom from "../support/PageObjects/Specs-view-PO/RazonesDeBloqueoPom.cy"
import RegionesPom from "../support/PageObjects/Specs-view-PO/RegionesPom.cy"
import ReglasPom from "../support/PageObjects/Specs-view-PO/ReglasPom.cy"
import RutinasPom from "../support/PageObjects/Specs-view-PO/RutinasPom.cy"
import TipoCajeroPom from "../support/PageObjects/Specs-view-PO/TipoCajeroPom.cy"
import TipoDeDatoPom from "../support/PageObjects/Specs-view-PO/TipoDeDatoPom.cy"
import TotalDeCajeroPom from "../support/PageObjects/Specs-view-PO/TotalDeCajeroPom.cy"
import UsuarioPom from "../support/PageObjects/Specs-view-PO/UsuarioPom.cy"
import MonedasPomCy from "../support/PageObjects/Specs-view-PO/MonedasPom.cy";
import 'cypress-xpath';
import "cypress-real-events/support";


// ============================================
// INSTANCIAS DE TODOS LOS PAGE OBJECTS
// ============================================

const Generales = new MetodosGeneralesPom()
const AccionCondicionada = new AccionesCondicionadasPom()
const CamposDeTransaccion = new CamposDeLaTransaccion()
const EnvioTransaccion = new EnvioDeTransacciones()
const Equivalencias = new EquivalenciasPom()
const Formatos = new FormatosPom()
const DetalleFormatos = new FormatosPom()
const GestorDeTransaccion = new GestorDeTransacciones()
const MensajeDeError = new MensajesDeErrorPom()
const Monedas = new MonedasPom()
const Denominaciones = new MonedasPomCy()
const PaisesQueLoUsan = new MonedasPomCy()
const NivelCajero = new NivelesDeCajeroPom()
const Paises = new PaisesPom()
const PlantillaComprobante = new PlantillaDeComprobantePom()
const Productos = new ProductosPom()
const RazonesReversa = new RazonDeReversoPom()
const RazonesBloqueo = new RazonesDeBloqueoPom()
const Regiones = new RegionesPom()
const Reglas = new ReglasPom()
const Rutinas = new RutinasPom()
const TipoCajero = new TipoCajeroPom()
const TipoDato = new TipoDeDatoPom()
const TotalesCajero = new TotalDeCajeroPom()
const TotalesACuadrar = new TotalDeCajeroPom()
const MinimosMaximos = new TotalDeCajeroPom()
const Usuarios = new UsuarioPom()


describe("Demo de Construccion de transacciones iniciales...", () => {

    Cypress.on('uncaught:exception',(err,Runnable) =>{
        return false
    })

    before(() => {
        Generales.Login(
            Cypress.env('BASE_URL'),
            Cypress.env('USER'),
            Cypress.env('PASS')
        )
    })


    describe("014 -  Campos de la transacción ...", () =>{

        beforeEach(() => {
            Generales.IrAPantalla('characteristicSpec')
        })

        it("Agregar múltiples registros en el crud Campos de la transacción", () => {
            cy.fixture('camposTransaccionD').then((data) => {
                cy.wrap(data.agregar).each((item) => {
                    cy.log(`Insertando código: ${item.codigo}`)

                    //Asegurar estado limpio antes de comenzar
                    cy.get('body').then(($body) => {
                        if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                            cy.log('Formulario abierto detectado, cerrando...')
                            Generales.BtnCancelarRegistro()
                        }
                    })

                    //Abrir formulario
                    Generales.BtnAgregarRegistros()

                    //Validar que el modal realmente abrió
                    cy.contains('h2', 'Nuevo Registro', { timeout: 10000 })
                        .should('be.visible')

                    // Llenar datos
                    CamposDeTransaccion.CamposTransaccion(

                        item.codigo, item.nombre, item.etiqueta, item.descripcion, item.tieneDatosSensibles, item.Tipo, item.longitudMin, item.longitudMax, item.longitudEnvio,
                        item.digitoVerificador, item.mascara, item.listaValores, item.rangoValores, item.limiteInferior, item.limiteSuperior, item.llenadoAutomatico, item.etiquetaJson,
                        item.valorDefecto, item.ayuda, item.moneda, item.rutina, item.implListaVista, item.implServicio, item.endpointAyuda, item.estado, item.validoDesde, item.validoHasta, item.usaSumadora,
                        item.idCampoEscuchar, item.requiereDetalleEfectivo, item.archivoYML, item.datosTachados, item.caracterVisualizar, item.esControlEfectivo
                    )

                    //Intercept backend
                    cy.intercept('POST', '**/characteristicSpec').as('guardar')

                    Generales.BtnAceptarRegistro()


                    cy.wait('@guardar').then((interception) => {
                        const status = interception.response.statusCode
                        if (status === 200 || status === 201) {
                            cy.log('Registro insertado correctamente')
                            // Esperar que el modal desaparezca
                            cy.contains('h2', 'Nuevo Registro').should('not.exist')
                        } else {
                            cy.log(`Error detectado. Status: ${status}`)
                            Generales.BtnCancelarRegistro()
                            cy.contains('h2', 'Nuevo Registro').should('not.exist')
                        }
                    })
                })
            })
        })

    })

    describe.skip("019 -  Gestor de Transacciones ...", () =>{

        beforeEach(() => {
            Generales.IrAPantalla('transactionManager')
        })

        it("Agregar múltiples registros en crud Gestor de transacciones", () => {


            cy.fixture('gestorTransaccionD').then((data) => {
                cy.wrap(data.agregar).each((item) => {
                    cy.then(() => {
                        const doc = window.top.document;
                        // Intentamos con varios selectores que usa Cypress para su log
                        const logContainer = doc.querySelector('.reporter .commands') ||
                            doc.querySelector('.command-list') ||
                            doc.querySelector('.runnable-commands-region');

                        if (logContainer) {
                            logContainer.innerHTML = '';
                        }
                    });
                    cy.log(`Insertando código: ${item.codigo}`)


                    cy.get('iframe.frame', { timeout: 10000 })
                        .its('0.contentDocument.body')
                        .should('not.be.empty')
                        .then(cy.wrap)
                        .within(() => {

                            //Abrir formulario
                            Generales.BtnIframe('Agregar', { timeout: 10000, force: true, skipContext: true });
                            // //Validar que el modal realmente abrió
                            // cy.contains('h2', 'Nuevo Registro', { timeout: 10000, force: true})
                            //     .should('be.visible')

                            // Llenar datos
                            GestorDeTransaccion.GestorTransacciones(

                                item.tipo, item.codigo, item.codAlternativo, item.nombre, item.etiqueta, item.estado, item.validoDesde, item.validoHasta, item.tipoMovimientoBoveda,
                                item.descripcion, item.esconderMenu, item.permiteReversion, item.modoOffline, item.requiereSupervisor, item.requiereValidarAcceso, item.seEnviaHost,
                                item.tiempoEspera, item.accionPorDemora, item.tienePagoServicio, item.PagoServicio, item.pasoConfirmacionServicio, item.permiteReimpresion,
                                item.diasPermitidoReimpresion, item.presentarResumen, item.mensajeResumen, item.tipoMensaje, item.icono, item.DepartamentodeAutorizacion, item.textoAyuda, item.logo

                            )
                            // Normalizar el tipo para comparación (opcional)
                            const tipoNormalizado = item.tipo?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

                            //Intercept backend
                            cy.intercept('POST', '**/transactionSpec').as('guardar')
                            Generales.BtnIframe('Aceptar', { timeout: 10000, force: true, skipContext: true });

                            cy.wait('@guardar').then((interception) => {
                                const status = interception.response.statusCode
                                if (status === 200 || status === 201) {
                                    cy.log('Registro insertado correctamente')
                                    // Esperar que el modal desaparezca
                                    Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true })
                                    cy.wait(2000)
                                    if (tipoNormalizado === "administrativas") {
                                        cy.log('✅ Es tipo ADMINISTRATIVAS, ejecutando acción especial');
                                        Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true })
                                    } else {
                                        cy.log('➡️ No es ADMINISTRATIVAS, continuando con flujo normal');
                                        Generales.BtnIframe('Sí', { timeout: 10000, force: true, skipContext: true });
                                        Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true })
                                    }
                                } else {
                                    cy.log(`Error detectado. Status: ${status}`)
                                    Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true })
                                    cy.contains('h2', 'Nuevo Registro').should('not.exist')
                                }
                            })



                        })

                })
            })
        })

    })

    describe.skip("019.1 -  Gestor de Transacciones > Caracteristicas de la transaccione ...", () =>{

        before(() => {
            cy.fixture('caracteristicasTrxD').as('dataCaracteristicasTrx')
        })

        beforeEach(() => {
            Generales.IrAPantalla('transactionManager')
        })

        it("Agregar multiples registros a sub nivel Transacciones > Caracteristicas de la transaccione", function () {
            const datos = this.dataCaracteristicasTrx.agregar;

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

                        // PASO 2: Verificar que se encontró el registro
                        cy.contains('td.mat-column-codeOfTheTransaction', codigoTRX, { timeout: 10000 })
                            .should('be.visible')
                            .then(() => {
                                cy.log(`✅ Registro ${codigoTRX} encontrado y seleccionado`);
                            });

                        // PASO 3: Abrir panel Opciones
                        cy.xpath("//mat-expansion-panel-header[.//h2[normalize-space()='Opciones']]")
                            .then($header => {
                                if ($header.attr('aria-expanded') !== 'true') {
                                    cy.wrap($header).click({ force: true });
                                    cy.wait(500);
                                }
                            });

                        // PASO 4: Procesar características
                        return cy.wrap(agrupadas[codigoTRX]).each((registro, index) => {
                            cy.log(`\n📌 Procesando lote de características ${index + 1}/${agrupadas[codigoTRX].length}`);
                            GestorDeTransaccion.CaracteristicasTrx(registro.caracteristicasTrx);
                            cy.log(`✅ Lote ${index + 1} completado`);
                        }).then(() => {
                            cy.log(`\n🔙 Regresando al nivel principal para código ${codigoTRX}`);

                            // ✅ PRIMER ATRÁS - Salir del detalle de características
                            cy.wait(2000);
                            Generales.BtnIframe("Atrás", { timeout: 10000, force: true, skipContext: true });

                            // ✅ VERIFICAR DIÁLOGO DE CONFIRMACIÓN
                            cy.wait(1000);
                            cy.get('mat-dialog-container', { timeout: 5000 }).then($dialog => {
                                if ($dialog.length > 0) {
                                    cy.log('⚠️ Diálogo de confirmación detectado');
                                    cy.xpath("//mat-dialog-actions//button[.//mat-icon[text()='check']]")
                                        .click({ force: true });
                                    cy.wait(1000);
                                }
                            });

                            // 🔹 VERIFICACIÓN MEJORADA - SIN ERRORES
                            cy.log('🔍 Verificando que estamos en el listado principal...');

                            // Verificación 1: Panel Filtros (siempre visible en listado principal)
                            cy.get('mat-expansion-panel-header').contains('Filtros', { timeout: 15000 })
                                .should('be.visible');

                            // Verificación 2: Tabla (siempre visible en listado principal)
                            cy.get('table', { timeout: 10000 }).should('be.visible');

                            // Verificación 3: "Buscar por" (opcional, no obligatorio)
                            cy.document().then($document => {
                                const $body = Cypress.$($document).find('body');
                                const $span = $body.find('span.mat-button-wrapper:contains("Buscar por")');

                                if ($span.length > 0) {
                                    cy.log('✅ Elemento "Buscar por" encontrado');
                                } else {
                                    cy.log('⚠️ Elemento "Buscar por" no encontrado (no es obligatorio)');
                                }
                            });

                            cy.log(`✅ Transacción ${codigoTRX} completada - listo para siguiente código`);
                        });
                    });
                });
        });


        /* it("Agregar registros a sub nivel", function () {
             const datos = this.dataCaracteristicasTrx.agregar;

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

                         // PASO 2: Verificar que se encontró el registro
                         cy.contains('td.mat-column-codeOfTheTransaction', codigoTRX, { timeout: 10000 })
                             .should('be.visible')
                             .then(() => {
                                 cy.log(`✅ Registro ${codigoTRX} encontrado y seleccionado`);
                             });

                         // PASO 3: Abrir panel Opciones
                         cy.xpath("//mat-expansion-panel-header[.//h2[normalize-space()='Opciones']]")
                             .then($header => {
                                 if ($header.attr('aria-expanded') !== 'true') {
                                     cy.wrap($header).click({ force: true });
                                     cy.wait(500);
                                 }
                             });

                         // PASO 4: Procesar características (CADA REGISTRO DEL JSON)
                         return cy.wrap(agrupadas[codigoTRX]).each((registro, index) => {
                             cy.log(`\n📌 Procesando lote de características ${index + 1}/${agrupadas[codigoTRX].length}`);

                             // LLAMAR AL MÉTODO QUE AGREGA TODAS LAS CARACTERÍSTICAS DE UNA VEZ
                             GestorDeTransacciones.CaracteristicasTrx(registro.caracteristicasTrx);

                             cy.log(`✅ Lote ${index + 1} completado`);

                         }).then(() => {
                             cy.log(`\n🔙 Regresando al nivel principal para código ${codigoTRX}`);

                             // ✅ PRIMER ATRÁS - Intenta salir del detalle de características
                             cy.wait(2000);
                             Generales.BtnIframe("Atrás", { timeout: 10000, force: true, skipContext: true });

                             // ✅ VERIFICAR DIÁLOGO DE CONFIRMACIÓN Y HACER CLIC EN CHECK (✓)
                             cy.wait(1000);
                             cy.get('mat-dialog-container', { timeout: 5000 }).then($dialog => {
                                 if ($dialog.length > 0) {
                                     cy.log('⚠️ Diálogo de confirmación detectado');

                                     // Hacer clic en el botón con icono "check" (confirmar)
                                     cy.xpath("//mat-dialog-actions//button[.//mat-icon[text()='check']]")
                                         .should('be.visible')
                                         .click({ force: true });

                                     cy.log('✅ Confirmación con check realizada');
                                     cy.wait(1000);
                                 }
                             });
                             // Verificar que estamos en el listado principal
                             cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 }).should('be.visible');

                             cy.log(`✅ Transacción ${codigoTRX} completada`);
                         });
                     });
                 });
         });*/


    })

    describe.skip("019.2 -  Gestor de Transacciones > Pasos de la transaccion ...", function() {

        beforeEach(function() {
            Generales.IrAPantalla('transactionManager');
            cy.fixture('creacionDePasosTRXD').as('data')
            cy.wait(5000)
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

                        // Procesar TODOS los pasos de esta transacción SIN SALIR
                        pasos.forEach((paso, index) => {
                            cy.log(`📝 Paso ${index + 1}/${pasos.length}: ${paso.nombrePaso}`);

                            GestorDeTransaccion.definirPaso(
                                paso.nombrePaso,
                                paso.tieneReglaCondionanteDePaso,
                                paso.typeReglaParaCondicionarPaso,
                                paso.descripcionPasoTrx
                            );

                            // Pequeña pausa entre pasos si es necesario
                            cy.wait(500);
                        });

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

        /*it("Agregar múltiples registros dinámicamente", function() {
            cy.log('Datos cargados:', JSON.stringify(this.data));

            // Agrupar manteniendo el orden del JSON original
            const agrupadas = {};
            const ordenCodigos = [];

            this.data.agregar.forEach(item => {
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
                        const pasos = agrupadas[codigoTRX];

                        cy.log(`\n🔄 Procesando transacción: ${codigoTRX} (${pasos.length} pasos)`);

                        // PASO 1: Filtrar por código
                        Generales.filtrarPorCodigo(codigoTRX);

                        // PASO 2: Verificar que se encontró el registro y hacer clic para entrar al detalle
                        cy.contains('td.mat-column-codeOfTheTransaction', codigoTRX, { timeout: 10000 })
                            .should('be.visible')
                            .click({ force: true })
                            .then(() => {
                                cy.log(`✅ Registro ${codigoTRX} encontrado y seleccionado`);
                            });

                        // PASO 3: Esperar a que cargue el detalle
                        cy.wait(2000);

                        // PASO 4: Abrir panel Opciones
                        cy.xpath("//mat-expansion-panel-header[.//h2[normalize-space()='Opciones']]")
                            .then($header => {
                                if ($header.attr('aria-expanded') !== 'true') {
                                    cy.wrap($header).click({ force: true });
                                    cy.wait(500);
                                }
                            });

                        // PASO 5: Procesar TODOS los pasos de esta transacción SIN SALIR
                        cy.wrap(pasos).each((paso, index) => {
                            cy.log(`📝 Paso ${index + 1}/${pasos.length}: ${paso.nombrePaso}`);

                            GestorDeTransacciones.definirPaso(
                                paso.nombrePaso,
                                paso.tieneReglaCondionanteDePaso,
                                paso.typeReglaParaCondicionarPaso,
                                paso.descripcionPasoTrx
                            );

                            cy.wait(500);
                        }).then(() => {
                            cy.log(`✅ Todos los ${pasos.length} pasos de ${codigoTRX} creados`);

                            // PASO 6: ATRÁS - Salir de la transacción
                            cy.wait(2000);
                            Generales.BtnIframe("Atrás", { timeout: 10000, force: true, skipContext: true });

                            // PASO 7: VERIFICAR DIÁLOGO DE CONFIRMACIÓN
                            cy.wait(1000);

                            cy.document().then(doc => {
                                const $dialog = Cypress.$('mat-dialog-container', doc);
                                if ($dialog.length > 0) {
                                    cy.log('⚠️ Diálogo de confirmación detectado');

                                    // CORRECCIÓN: Buscar el botón que contiene texto "Sí"
                                    cy.xpath("//mat-dialog-actions//button[contains(text(), 'Sí')]")
                                        .should('be.visible')

                                    Generales.BtnIframe("Si", { timeout: 10000, force: true, skipContext: true });


                                    cy.wait(3000);
                                    cy.log('✅ Clic en Sí realizado');
                                } else {
                                    cy.log('ℹ️ No apareció diálogo de confirmación');
                                }
                            });

                            // PASO 8: ESPERAR A QUE LA UI SE ESTABILICE
                            cy.wait(2000);

                            // PASO 9: VERIFICAR QUE ESTAMOS EN EL LISTADO PRINCIPAL
                            cy.log('🔍 Verificando retorno al listado principal...');

                            // Verificar que estamos de vuelta en el listado
                            cy.get('mat-expansion-panel-header').contains('Filtros', { timeout: 15000 })
                                .should('be.visible');
                            cy.get('table', { timeout: 10000 }).should('be.visible');

                            cy.log(`✅ Transacción ${codigoTRX} completada - listo para siguiente`);
                        });
                    });
                });
        });*/

        /*it("Agregar múltiples registros dinámicamente", function() {
            cy.log('Datos cargados:', JSON.stringify(this.data));

            // Agrupar manteniendo el orden del JSON original
            const agrupadas = {};
            const ordenCodigos = [];

            this.data.agregar.forEach(item => {
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
                        const pasos = agrupadas[codigoTRX];

                        cy.log(`\n🔄 Procesando transacción: ${codigoTRX} (${pasos.length} pasos)`);

                        // PASO 1: Filtrar por código
                        Generales.filtrarPorCodigo(codigoTRX);

                        // PASO 2: Verificar que se encontró el registro y hacer clic para entrar al detalle
                        cy.contains('td.mat-column-codeOfTheTransaction', codigoTRX, { timeout: 10000 })
                            .should('be.visible')
                            .click({ force: true })
                            .then(() => {
                                cy.log(`✅ Registro ${codigoTRX} encontrado y seleccionado`);
                            });

                        // PASO 3: Esperar a que cargue el detalle
                        cy.wait(2000);

                        // PASO 4: Abrir panel Opciones
                        cy.xpath("//mat-expansion-panel-header[.//h2[normalize-space()='Opciones']]")
                            .then($header => {
                                if ($header.attr('aria-expanded') !== 'true') {
                                    cy.wrap($header).click({ force: true });
                                    cy.wait(500);
                                }
                            });

                        // PASO 5: Procesar TODOS los pasos de esta transacción SIN SALIR
                        cy.wrap(pasos).each((paso, index) => {
                            cy.log(`📝 Paso ${index + 1}/${pasos.length}: ${paso.nombrePaso}`);

                            GestorDeTransacciones.definirPaso(
                                paso.nombrePaso,
                                paso.tieneReglaCondionanteDePaso,
                                paso.typeReglaParaCondicionarPaso,
                                paso.descripcionPasoTrx
                            );

                            cy.wait(500);
                        }).then(() => {
                            cy.log(`✅ Todos los ${pasos.length} pasos de ${codigoTRX} creados`);

                            // PASO 6: ATRÁS - Salir de la transacción
                            cy.wait(2000);
                            Generales.BtnIframe("Atrás", { timeout: 10000, force: true, skipContext: true });

                            // PASO 7: VERIFICAR DIÁLOGO DE CONFIRMACIÓN (CORREGIDO)
                            cy.wait(1000);

                            cy.get('iframe.frame', { timeout: 10000 })
                                .its('0.contentDocument.body')
                                .should('not.be.empty')
                                .then(($body) => {
                                    // Buscar el diálogo de confirmación de forma síncrona
                                    const $dialog = Cypress.$('mat-dialog-container', $body);
                                    if ($dialog.length > 0) {
                                        cy.log('✅ Diálogo de confirmación detectado');
                                        // Hacer clic en el botón primario dentro del diálogo
                                        cy.wrap($dialog).find('button[color="primary"]').click();
                                        // Esperar a que el diálogo desaparezca
                                        cy.get('mat-dialog-container', { timeout: 5000 }).should('not.exist');
                                        cy.log('✅ Diálogo cerrado correctamente');
                                    } else {
                                        cy.log('ℹ️ No apareció diálogo de confirmación');
                                    }
                                });

                            // PASO 8: ESPERAR A QUE LA UI SE ESTABILICE
                            cy.wait(2000);

                            // PASO 9: VERIFICAR QUE ESTAMOS EN EL LISTADO PRINCIPAL
                            cy.log('🔍 Verificando retorno al listado principal...');

                            // Verificar que estamos de vuelta en el listado
                            cy.get('mat-expansion-panel-header').contains('Filtros', { timeout: 15000 })
                                .should('be.visible');
                            cy.get('table', { timeout: 10000 }).should('be.visible');

                            cy.log(`✅ Transacción ${codigoTRX} completada - listo para siguiente`);
                        });
                    });
                });
        });*/


        /*it("Agregar múltiples registros dinámicamente", function() {
            cy.log('Datos cargados:', JSON.stringify(this.data));

            // Agrupar los items por código de transacción
            const transacciones = this.data.agregar.reduce((acc, item) => {
                if (!acc[item.codigoTRX]) {
                    acc[item.codigoTRX] = [];
                }
                acc[item.codigoTRX].push(item);
                return acc;
            }, {});

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

                        // Procesar TODOS los pasos de esta transacción SIN SALIR
                        pasos.forEach((paso, index) => {
                            cy.log(`📝 Paso ${index + 1}/${pasos.length}: ${paso.nombrePaso}`);

                            GestorDeTransacciones.definirPaso(
                                paso.nombrePaso,
                                paso.tieneReglaCondionanteDePaso,
                                paso.typeReglaParaCondicionarPaso,
                                paso.descripcionPasoTrx
                            );

                            // Pequeña pausa entre pasos si es necesario
                            cy.wait(500);
                        });

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

                // CORRECCIÓN: Verificar diálogo SIN USAR BtnIframe
                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        // Buscar el botón con color primary (el de confirmar)
                        cy.get('button[color="primary"]').then($btn => {
                            if ($btn.length > 0) {
                                cy.log('✅ Diálogo detectado, haciendo clic en Confirmar');
                                // ✅ CLICK DIRECTO - NO USA BtnIframe
                                $btn.first().click({ force: true });
                                cy.wait(1000);
                            } else {
                                cy.log('ℹ️ No apareció diálogo de confirmación - continuando flujo normal');
                            }
                        });
                    });
            });
        });*/





    });

    describe.skip("019.3 -  Gestor de Transacciones > Asignar Caracteristicas de la transaccione a pasos ...", function() {

        beforeEach(function() {
            Generales.IrAPantalla('transactionManager');
            cy.fixture('asignacionDeCaracteristicasD').as('data');

        });

        it("Agregar múltiples registros dinámicamente", function() {
            const datos = this.data.agregar;

            const agrupadas = datos.reduce((acc, item) => {
                if (!acc[item.codigoTX]) {
                    acc[item.codigoTX] = [];
                }
                acc[item.codigoTX].push(item);
                return acc;
            }, {});

            cy.wrap(Object.keys(agrupadas)).each((codigoTX) => {
                cy.log('Procesando Tx: ' + codigoTX);

                // Opcional: limpiar logs de Cypress
                cy.then(() => {
                    const doc = window.top.document;
                    const logContainer = doc.querySelector('.reporter .commands') ||
                        doc.querySelector('.command-list') ||
                        doc.querySelector('.runnable-commands-region');
                    if (logContainer) {
                        logContainer.innerHTML = '';
                    }
                });

                // Entrar al iframe y realizar acciones
                cy.get('iframe.frame', { timeout: 10000 })
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        // Dentro del iframe: acciones de edición
                        Generales.filtrarPorCodigo(codigoTX);

                        // Variable para recordar el paso actualmente seleccionado
                        let pasoActual = null;

                        return cy.wrap(agrupadas[codigoTX]).each((item) => {
                            Generales.abrirPanel("Opciones", { timeout: 20000, force: true });
                            cy.wait(500);

                            // Verificar si necesitamos cambiar de paso
                            const pasoRequerido = item.paso ? item.paso.toString().trim() : null;
                            if (pasoRequerido && pasoRequerido !== pasoActual) {
                                cy.log(`Cambiando de paso "${pasoActual}" a "${pasoRequerido}"`);
                                Generales.seleccionarPaso(item.paso, { timeout: 10000, skipContext: true, force: true });
                                pasoActual = pasoRequerido;
                            } else if (!pasoRequerido) {
                                // Fallback si no hay paso
                                Generales.BtnIframe("Cuenta", { timeout: 10000, force: true, skipContext: true });
                                cy.wait(1500)
                            } else {
                                cy.log(`Paso "${pasoRequerido}" ya está seleccionado, se omite clic.`);
                            }


                            cy.wait(2500)
                            GestorDeTransaccion.AsignacionDCaracteristicaAPaso(
                                item.caracteristica,
                                item.tamanioLetra,
                                item.visualizar,
                                item.proteger,
                                item.obligatorio,
                                item.negrita,
                                item.verFirmas,
                                item.expresionCalcularCampo,
                                item.ReglasCondicionarCampo,
                                item.operacion,
                                item.expresionParaValidar,
                                item.mensajeError,
                                item.correlativo,
                                item.productos
                            );

                            // Hacemos clic en Guardar sin interceptar
                            Generales.BtnIframe('Aceptar', { timeout: 10000, force: true, skipContext: true });
                        });
                    }).then(() => {
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

                    cy.wait(2000);

                    // Verificar si aparece el diálogo de confirmación DENTRO del iframe
                    cy.get('iframe.frame', { timeout: 10000 })
                        .its('0.contentDocument.body')
                        .should('not.be.empty')
                        .then(($body) => {
                            const $dialog = Cypress.$('mat-dialog-container:contains("Confirmar")', $body);
                            if ($dialog.length > 0) {
                                cy.log('✅ Diálogo Confirmar detectado');
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
    });



})