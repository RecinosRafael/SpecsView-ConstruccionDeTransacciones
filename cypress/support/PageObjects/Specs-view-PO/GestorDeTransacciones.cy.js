import metodosGeneralesPomCy from "./MetodosGeneralesPom.cy.js";
import '@4tw/cypress-drag-drop';


class GestorPomCy{

    constructor() {
        this.Generales = new metodosGeneralesPomCy();
    }


AsignacionDCaracteristicaAPasoB(paso, caracteristica, tamanioLetra, visualizar, proteger, obligatorio, negrita, verFirmas, expresionCalcularCampo, ReglasCondicionarCampo, operacion, expresionParaValidar, mensajeError, correlativo, productos) {
    
    // Función interna para configurar los campos (asume que el panel de edición está abierto)
    const configurar = () => {
        cy.wait(500);
        this.Generales.seleccionarComboIframe(tamanioLetra, "Tamaño de letra", { timeout: 10000, force: true, skipContext: true });
        this.Generales.slideToggleIframe(visualizar, "Visualizar", { timeout: 10000, skipContext: true, force: true });
        this.Generales.slideToggleIframe(proteger, "Proteger", { timeout: 10000, skipContext: true, force: true });
        this.Generales.slideToggleIframe(obligatorio, "Obligatorio", { timeout: 10000, skipContext: true, force: true });
        this.Generales.slideToggleIframe(negrita, "Negrita", { timeout: 10000, skipContext: true, force: true });
        this.Generales.slideToggleIframe(verFirmas, "Ver firmas", { timeout: 10000, skipContext: true, force: true });
        this.Generales.llenarCampoReadonlySinClick(expresionCalcularCampo, "Expresión para calcular campo", { timeout: 10000, skipContext: true, force: true });
        this.Generales.llenarCampoIframe(ReglasCondicionarCampo, "Reglas para condicionar campo", { timeout: 10000, skipContext: true });
        this.Generales.seleccionarComboIframe(operacion, "Operación", { timeout: 10000, force: true, skipContext: true });
        this.Generales.llenarCampoReadonlySinClick(expresionParaValidar, "Expresión para validar", { timeout: 10000, skipContext: true, force: true });
        this.Generales.llenarCampoIframe(mensajeError, "Mensaje de error", { timeout: 10000, skipContext: true });
        this.Generales.llenarCampoIframe(correlativo, "Correlativo", { timeout: 10000, skipContext: true });
        this.Generales.seleccionarComboIframe(productos, "Productos", { timeout: 10000, force: true, skipContext: true });
    };

    // Intentar abrir el panel de edición si la característica ya está en el paso
    cy.root().then($root => {
        const contextNode = $root.get ? $root.get(0) : $root[0];
        const xpath = `//div[contains(@class, 'field-text') and .//mat-card-title[text()='${caracteristica}']]/ancestor::div[contains(@class, 'field-content')]//button[.//mat-icon[text()='more_horiz']]`;
        const result = document.evaluate(xpath, contextNode, null, 9, null);
        const node = result.singleNodeValue;

        if (node) {
            cy.log(`✅ Botón "edit" encontrado para "${caracteristica}", haciendo clic`);
            cy.wrap(node).click({ force: true });
            configurar();
        } else {
            cy.log(`ℹ️ Botón "edit" no encontrado para "${caracteristica}", se asignará por API`);

            // Obtener el transactionFlowId previamente guardado (debe estar en un alias)
            cy.get('@transactionFlowId').then(flowId => {
                // Obtener el ID de la característica desde el panel izquierdo
                cy.contains('mat-card-title', caracteristica)
                    .parents('.cdk-drag')
                    .find('.chip-id')
                    .invoke('text')
                    .then(idText => {
                        const characteristicId = parseInt(idText, 10);

                        // Extraer el correlativo del paso (ej: "Paso 1" → 1)
                        const correlativeMatch = paso.match(/\d+/);
                        if (!correlativeMatch) {
                            throw new Error(`No se pudo extraer número del paso: ${paso}`);
                        }
                        const correlative = parseInt(correlativeMatch[0], 10);

                        // Realizar la petición POST para asignar la característica al paso
                        cy.request({
                            method: 'POST',
                            url: '/api/transaction-catalog-service/v1/transactionCharactByStep',
                            body: {
                                transactionFlow: { id: flowId },
                                characteristicSpec: { id: characteristicId },
                                correlative: correlative
                            },
                            timeout: 10000
                        }).then(response => {
                            expect(response.status).to.eq(201);
                            cy.log(`✅ Característica "${caracteristica}" asignada por API, relación ID: ${response.body.id}`);

                            // Esperar a que la UI se actualice (la característica aparece en el paso)
                            cy.wait(1000); // Ajustable, podría mejorarse con una espera condicional

                            // Ahora buscar el botón "edit" nuevamente (ya debería existir)
                            cy.root().then($root2 => {
                                const contextNode2 = $root2.get ? $root2.get(0) : $root2[0];
                                const result2 = document.evaluate(xpath, contextNode2, null, 9, null);
                                const node2 = result2.singleNodeValue;
                                if (node2) {
                                    cy.wrap(node2).click({ force: true });
                                    configurar();
                                } else {
                                    throw new Error(`No se encontró el botón edit después de asignar por API para "${caracteristica}"`);
                                }
                            });
                        });
                    });
            });
        }
    });
}

    //Caracteristicas del Resultado gestor de TX`s
    CaracteristicaResultado(caracteristica, caracteristicaOperar, operacioncaracteristicaOperar){

        this.Generales.arrastrarCaracteristica(caracteristica)
        cy.wait(1500)

            //por si acaso el boton de edit aparece de lo contrario no pasa nada
        cy.root().then(($root) => {
            // Obtener el nodo DOM real (si $root es jQuery)
            const contextNode = $root.get ? $root.get(0) : $root[0];
            if (!contextNode) {
            cy.log('No se pudo obtener el nodo raíz');
            return;
            }

            const xpath = '(//button[contains(@class, "mat-mdc-mini-fab") and .//mat-icon[text()="edit"]])[2]';
            // Usar document.evaluate con el tipo numérico 9 (equivalente a XPathResult.FIRST_ORDERED_NODE_TYPE)
            const result = document.evaluate(xpath, contextNode, null, 9, null);
            const node = result.singleNodeValue;

        if (node) {
        cy.log('✅ Botón "edit" encontrado, haciendo clic');
        cy.wrap(node).click({ force: true });
        } else {
        cy.log('ℹ️ Botón "edit" no está presente');
        }
    });

    // Suponiendo que tienes caracteristicaOperar y operacioncaracteristicaOperar
    for (let i = 0; i < caracteristicaOperar.length; i++) {
        const caracteristica = caracteristicaOperar[i];
        const operacion = operacioncaracteristicaOperar[i];
        this.Generales.seleccionarOperacionPorCaracteristica(caracteristica, operacion, {
            timeout: 10000,
            skipContext: true,  // o false si no estás dentro del iframe
            force: true
        });
    }

}
    //Gestor de transacciones
    GestorTransacciones(
        tipo, codigo, codAlternativo, nombre, etiqueta, estado, validoDesde, validoHasta, tipoMovimientoBoveda, descripcion,
        esconderMenu, permiteReversion, modoOffline, requiereSupervisor, requiereValidarAcceso, seEnviaHost, tiempoEspera,
        accionPorDemora, tienePagoServicio, PagoServicio, pasoConfirmacionServicio, permiteReimpresion, diasPermitidoReimpresion,
        presentarResumen, mensajeResumen, tipoMensaje, icono, DepartamentodeAutorizacion, textoAyuda, logo
    ){
            this.Generales.seleccionarComboIframe(tipo, "Tipo", { timeout: 10000, skipContext: true } );
            this.Generales.llenarCampoIframe(codigo, "Código", { timeout: 10000, skipContext: true });
            this.Generales.llenarCampoIframe(codAlternativo, "Código alternativo", { timeout: 10000, skipContext: true });
            this.Generales.llenarCampoIframe(nombre, "Nombre", { timeout: 10000, skipContext: true });
            this.Generales.llenarCampoIframe(etiqueta, "Etiqueta", { timeout: 10000, skipContext: true });
            this.Generales.seleccionarComboIframe(estado, "Estado", { timeout: 10000, skipContext: true });
            this.Generales.seleccionarComboIframe(tipoMovimientoBoveda, "Tipo movimiento en bóveda", { timeout: 10000, skipContext: true, force: true });
            this.Generales.IngresarFechaIframe(validoDesde, "Valido desde", { timeout: 10000, skipContext: true });
            this.Generales.IngresarFechaIframe(validoHasta, "Valido hasta", { timeout: 10000, skipContext: true });
            this.Generales.llenarCampoIframe(descripcion, "Descripción", { timeout: 10000, skipContext: true });
            this.Generales.slideToggleIframe(esconderMenu, "Esconder en menú", { timeout: 10000, skipContext: true });
            this.Generales.slideToggleIframe(permiteReversion, "Permite reversión", { timeout: 10000, skipContext: true });
            this.Generales.slideToggleIframe(modoOffline, "Modo offline", { timeout: 10000, skipContext: true });
            this.Generales.slideToggleIframe(requiereSupervisor, "Requiere supervisor", { timeout: 10000, skipContext: true });
            this.Generales.slideToggleIframe(requiereValidarAcceso, "Se requiere validar acceso", { timeout: 10000, skipContext: true });
            if (seEnviaHost) {
                this.Generales.slideToggleIframe(seEnviaHost, "Se envía al host", { timeout: 10000, skipContext: true });
                this.Generales.llenarCampoIframe(tiempoEspera, "Tiempo de espera", { timeout: 10000, force: true, skipContext: true });
                this.Generales.seleccionarComboIframe(accionPorDemora, "Acción por demora", { timeout: 10000, force: true, skipContext: true });
            }else{
                cy.log("Se envía al host no está activo, no se ingresan los datos relacionados a esta opción", { timeout: 10000, skipContext: true });
            }
            if (tienePagoServicio) {
                this.Generales.slideToggleIframe(tienePagoServicio, "Es pago de servicio", { timeout: 10000, skipContext: true });
                this.Generales.seleccionarComboIframe(PagoServicio, "Pago de servicio", { timeout: 10000, skipContext: true });
                this.Generales.seleccionarComboIframe(pasoConfirmacionServicio, "Incluye paso para confirmar datos", { timeout: 10000, skipContext: true });
            }else{
                cy.log("Es pago de servicio no está activo, no se ingresan los datos relacionados a esta opción");
            }
            if (permiteReimpresion) {
                this.Generales.slideToggleIframe(permiteReimpresion, "Permite reimpresión", { timeout: 10000, skipContext: true });
                this.Generales.llenarCampoIframe(diasPermitidoReimpresion, "Dias permitidos para reimprimir", { timeout: 10000, force: true, skipContext: true });
            }else{
                cy.log("Permite reimpresión no está activo, no se ingresan los datos relacionados a esta opción");
            }
            if (presentarResumen) {
                this.Generales.slideToggleIframe(presentarResumen, "Presentar resumen de transaccion", { timeout: 10000, skipContext: true });
                this.Generales.llenarCampoIframe(mensajeResumen, "Mensaje despues del proceso", { timeout: 10000, force: true, skipContext: true });
                this.Generales.seleccionarComboIframe(tipoMensaje, "Tipo de mensaje", { timeout: 10000, skipContext: true });
            } else {
                cy.log("Presentar resumen no está activo, no se ingresan los datos relacionados a esta opción");
            }
            this.Generales.llenarCampoIframe(icono, "Ícono", { timeout: 10000, skipContext: true });
            this.Generales.seleccionarComboIframe(DepartamentodeAutorizacion, "Departamento de autorización", { timeout: 10000, force: true, skipContext: true });
            this.Generales.llenarCampoIframe(textoAyuda, "Texto de ayuda", { timeout: 10000, skipContext: true });
            this.Generales.cargarImagen(logo, "Logo", { timeout: 10000, skipContext: true, force: true })
        }

    //Seleccionar tipos de cajero del gestor de TX`s
    TiposCajero(roles) {
        if (!roles || !Array.isArray(roles)) return;
        roles.forEach(rol => {
            this.Generales.checkboxEnTabla(rol.valor, rol.texto);
        });
    }
    
    //Especificación de transacción
    caracteristicasTrx(caracteristicaTrx) {
        cy.get("iframe.frame", {timeout: 10000})
            .should("be.visible")
            .invoke("css", "pointer-events", "auto")
            .its("0.contentDocument.body")
            .should("not.be.empty")
            .then(cy.wrap)
            .within(($body) => {
                cy.log("Entrando a flujo para ingreso de caracteristicas de la trx:");
                cy.get(".mdc-circular-progress", {timeout: 40000}).should(
                    "not.exist"
                );
                cy.xpath("//button[.//mat-icon[normalize-space()='add']]")
                    .filter(":visible:not([disabled])")
                    .first()
                    .scrollIntoView()
                    .should("be.visible")
                    .click({force: true});

                for (let i = 0; i < caracteristicaTrx.length; i++) {
                    cy.xpath(
                        "//mat-form-field[.//mat-label[normalize-space()='Característica']]//mat-select"
                    ).click({force: true});
                    // 1️⃣ Escribir la característica en el buscador
                    cy.xpath("//input[@placeholder='Buscar']")
                        .clear({force: true})
                        .type(caracteristicaTrx[i], {force: true});

                    // 2️⃣ Seleccionar la primera opción válida que aparece
                    cy.get(".mat-mdc-option:not(.mdc-list-item--disabled)", {
                        timeout: 10000,
                    })
                        .should("be.visible")
                        .first()
                        .click({force: true});

                    // 3️⃣ Click en aceptar (check)
                    cy.xpath(
                        "//mat-dialog-actions//button[.//mat-icon[normalize-space()='check']]"
                    )
                        .should("not.be.disabled")
                        .click({force: true});

                    // 4️⃣ Esperar a que termine el loading
                    cy.get(".mdc-circular-progress", {timeout: 40000}).should(
                        "not.exist"
                    );
                }

                // Opción recomendada para hacer clic en la X de cerrar
                cy.xpath("//button[.//mat-icon[text()='close']]")
                    .filter(":visible:not([disabled])")
                    .first()
                    .scrollIntoView()
                    .should("be.visible")
                    .click({force: true});

                cy.xpath(
                    "//mat-expansion-panel-header[.//h2[normalize-space()='Opciones']]"
                ).click({force: true});
            });
    }

    //Comprobante de impresion
    ComprobantesImpresion( tipoFormato, comprobante, esMandatorio, verComprobante, notificaComprobante,
                           impAntesConsultarFirmas, copiasImprimir, ...etiquetas)
    {
        this.Generales.seleccionarComboIframe(tipoFormato, "Tipo de Formato", { timeout: 10000,  skipContext: true, force: true })
        this.Generales.seleccionarComboIframe(comprobante, "Comprobante", { timeout: 10000, skipContext: true, force: true })
        this.Generales.slideToggleIframe(esMandatorio, "Es mandatorio", { timeout: 10000, skipContext: true, force: true });
        this.Generales.slideToggleIframe(verComprobante, "Ver comprobante", { timeout: 10000, skipContext: true, force: true })
        this.Generales.slideToggleIframe(notificaComprobante, "Se notifica comprobante al menos por un medio", { timeout: 10000, skipContext: true, force: true })
        this.Generales.slideToggleIframe(impAntesConsultarFirmas, "Imprimir antes de consultar Firmas", { timeout: 10000, skipContext: true, force: true })
        this.Generales.llenarCampoIframe(copiasImprimir, "Copias a imprimir", { timeout: 10000, skipContext: true, force: true })
        //llenar etiquetas con N cantidad de copias a imprimir
        const numEtiquetas = parseInt(copiasImprimir, 10) || 0;
        for (let i = 0; i < numEtiquetas; i++) {
        const valorEtiqueta = i < etiquetas.length ? etiquetas[i] : '';
        this.Generales.llenarCampoEnTablaIframe(valorEtiqueta, "Etiqueta", i + 1, { timeout: 10000, skipContext: true, force: true });
        }
    }

    //Comprobante notificacion electronica
    ComprobantesNotElectronica(tipoFormato, comprobante, verComprobante, seNotificaMedio, esMandatorio, notificaComprobante){
        this.Generales.seleccionarComboIframe(tipoFormato, "Tipo de Formato", { timeout: 10000,  skipContext: true, force: true })
        this.Generales.seleccionarComboIframe(comprobante, "Comprobante", { timeout: 10000,  skipContext: true, force: true })
        this.Generales.slideToggleIframe(verComprobante, "Ver comprobante", { timeout: 10000, skipContext: true, force: true })
        this.Generales.slideToggleIframe(seNotificaMedio, "Se notifica comprobante al menos por un medio", { timeout: 10000, skipContext: true, force: true })
        this.Generales.seleccionarMediosNotificacion(seNotificaMedio, "Se notifica por medio", {
            timeout: 10000,
            skipContext: true,
            ignorarDeshabilitados: true
        });
        cy.wait(1000);
        this.Generales.seleccionarMediosNotificacion(esMandatorio, "Es mandatorio", {
            timeout: 10000,
            skipContext: true,
            ignorarDeshabilitados: true
        });


    }

    //Asignar moneda en totales a afectar gestor de TX`s
    AsignarMoneda(formaAfectarTotales, metodoAsignacionMoneda, correlativoMoneda) {
    //por si acaso el boton de edit aparece de lo contrario no pasa nada
        cy.root().then(($root) => {
            // Obtener el nodo DOM real (si $root es jQuery)
            const contextNode = $root.get ? $root.get(0) : $root[0];
            if (!contextNode) {
            cy.log('No se pudo obtener el nodo raíz');
            return;
            }

            const xpath = './/button[contains(@class, "add-button") and .//mat-icon[text()="edit"]]';
            // Usar document.evaluate con el tipo numérico 9 (equivalente a XPathResult.FIRST_ORDERED_NODE_TYPE)
            const result = document.evaluate(xpath, contextNode, null, 9, null);
            const node = result.singleNodeValue;

            if (node) {
            cy.log('✅ Botón "edit" encontrado, haciendo clic');
            cy.wrap(node).click({ force: true });
            } else {
            cy.log('ℹ️ Botón "edit" no está presente');
            }
        });

        this.Generales.seleccionarComboIframe(formaAfectarTotales, "Forma afectar totales", { timeout: 10000, force: true, skipContext: true });
        this.Generales.seleccionarComboIframe(metodoAsignacionMoneda, "Método asignación de moneda", { timeout: 10000, skipContext: true, force: true });
        cy.wait(1000)
        this.Generales.seleccionarComboIframe(correlativoMoneda, ["Correlativo de moneda", "Correlativo de", "Moneda"],{ timeout: 10000, skipContext: true, force: true, usarBusqueda: true }
    );
    }

    //Totales a afectar gestor de TX`s
    TotalesAfectar(caracteristica, arbolRaiz, totalCajero, operacion, exp1, operacion2, exp2){

        this.Generales.arrastrarCaracteristica(caracteristica)
        cy.wait(500)
        this.Generales.seleccionarComboIframe(arbolRaiz, "Árbol Raíz", { timeout: 10000, force: true, skipContext: true } )
        this.Generales.seleccionarComboIframe(totalCajero, "Total de Cajero", { timeout: 10000, force: true, skipContext: true } )
        this.Generales.seleccionarRadio(operacion, "Operacion", { timeout: 10000, skipContext: true, force: true } )
        this.Generales.llenarCampoReadonlySinClick(exp1, "Expresion 1", { timeout: 10000, skipContext: true, force: true } )        // if(exp1){
        this.Generales.seleccionarComboIframe(operacion2, "Operacion", { timeout: 10000, skipContext: true, force: true } )
        this.Generales.llenarCampoReadonlySinClick(exp2, "Expresion 2", { timeout: 10000, skipContext: true, force: true } )

        /*
        C = Correlativo
        CS = Id caracteristica
        VG = Valor global
        R = Recurso
        CT = Constante - - - - - - - - - - - - - - - - - - - - - - - - - - - - - permite escribir
        TO = Total
        STEP = Correlativo de paso - - - - - - - - - - - - - - - - - - - - - - - permite escribir
        MONE = ID de la moneda
        tcode = Comapra codigo de transaccion
        VTL = Campos tipo tabla  - - - - - - - - - - - - - - - - - - - - - - - - permite escribir
        tt_fa = Tipo de accion financiera
        RID = ID de rutina
        JID = ID de journal
        USRN = Username
        TRXCODE = Retorna codigo de transaccion
        */
    }

    configurarEfectivos(config) {
        cy.get("iframe.frame", {timeout: 10000})
            .should("be.visible")
            .invoke("css", "pointer-events", "auto")
            .its("0.contentDocument.body")
            .should("not.be.empty")
            .then(cy.wrap)
            .within(($body) => {
                const normalizar = (txt) => txt.toLowerCase().trim();

                Object.keys(config).forEach((nombre) => {
                    const nombreNormalizado = normalizar(nombre);

                    if (
                        !["efectivo fisico", "efectivo electrónico", "total"].includes(
                            nombreNormalizado
                        )
                    ) {
                        return;
                    }

                    // 🔎 Buscar tarjeta (case-insensitive)
                    cy.xpath(
                        `
      //mat-card-title[
        translate(
          normalize-space(.),
          'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ',
          'abcdefghijklmnopqrstuvwxyzáéíóúüñ'
        )='${nombreNormalizado}'
      ]
    `
                    )
                        .should("exist")
                        .parents("mat-card")
                        .first() // 👈🔥 CLAVE
                        .within(() => {
                            // ✏️ Click editar
                            cy.xpath(".//button[.//mat-icon[normalize-space()='edit']]")
                                .should("be.visible")
                                .click({force: true});
                        });

                    // 💰 Monto máximo
                    if (config[nombre].montoMaximo) {
                        cy.xpath(
                            "//mat-label[normalize-space()='Monto Máximo']/ancestor::mat-form-field//input"
                        )
                            .filter(":visible:not([disabled])")
                            .first()
                            .scrollIntoView()
                            .should("be.visible")
                            .clear({force: true})
                            .type(config[nombre].montoMaximo, {force: true});
                    }

                    // 🔽 Tipo de movimiento
                    if (config[nombre].tipoMovimiento) {
                        cy.xpath(
                            "//mat-label[contains(normalize-space(),'Tipo de movimiento')]"
                        )
                            .parents("mat-form-field")
                            .find("mat-select")
                            .click({force: true});

                        cy.xpath("//input[@placeholder='Buscar']")
                            .clear({force: true})
                            .type(config[nombre].tipoMovimiento, {force: true});

                        cy.get(".mat-mdc-option:not(.mdc-list-item--disabled)")
                            .first()
                            .click({force: true});
                    }

                    // ✔ Guardar
                    cy.xpath(
                        "//mat-dialog-actions//button[.//mat-icon[normalize-space()='check']]"
                    ).click({force: true});

                    cy.get(".mdc-circular-progress", {timeout: 40000}).should(
                        "not.exist"
                    );
                });
            });
    }

    CaracteristicasTrx(caracteristicas) {
        cy.log(`📋 Procesando ${caracteristicas.length} características en este lote`);

        const normalizar = (texto) => {
            return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        };

        // Si no hay características, salir
        if (!caracteristicas || caracteristicas.length === 0) {
            cy.log('⚠️ No hay características para procesar');
            return;
        }

        // Abrir modal de características (solo UNA VEZ por lote)
        cy.xpath("//button[.//mat-icon[normalize-space()='add']]")
            .filter(":visible:not([disabled])")
            .first()
            .scrollIntoView()
            .should("be.visible")
            .click({ force: true });

        cy.get(".mdc-circular-progress", { timeout: 40000 }).should("not.exist");
        cy.log('✅ Modal de características abierto');

        // Procesar cada característica del lote
        for (let i = 0; i < caracteristicas.length; i++) {
            const caracteristica = caracteristicas[i];
            cy.log(`\n📌 Agregando característica ${i + 1}/${caracteristicas.length}: "${caracteristica}"`);

            // Abrir select
            cy.xpath("//mat-form-field[.//mat-label[normalize-space()='Característica']]//mat-select")
                .click({ force: true });

            // Buscar
            cy.xpath("//input[@placeholder='Buscar']")
                .clear({ force: true })
                .type(caracteristica, { force: true, delay: 100 });

            cy.wait(1500);

            // Seleccionar opción (ignorando tildes)
            cy.get(".mat-mdc-option:not(.mdc-list-item--disabled)", { timeout: 10000 })
                .then($opciones => {
                    const buscaNorm = normalizar(caracteristica);

                    // Buscar coincidencia normalizada
                    let opcionSeleccionada = null;
                    for (let j = 0; j < $opciones.length; j++) {
                        const $opt = Cypress.$($opciones[j]);
                        const textoOpcion = $opt.text().trim();
                        if (normalizar(textoOpcion).includes(buscaNorm)) {
                            opcionSeleccionada = $opt;
                            cy.log(`✅ Opción encontrada: "${textoOpcion}"`);
                            break;
                        }
                    }

                    // Fallback a primera opción
                    if (!opcionSeleccionada) {
                        opcionSeleccionada = $opciones[0];
                        cy.log(`⚠️ Usando primera opción: "${Cypress.$(opcionSeleccionada).text().trim()}"`);
                    }

                    cy.wrap(opcionSeleccionada).click({ force: true });
                });

            // Confirmar con botón CHECK
            cy.xpath("//mat-dialog-actions//button[.//mat-icon[normalize-space()='check']]")
                .should("be.visible")
                .click({ force: true });

            cy.get(".mdc-circular-progress", { timeout: 40000 }).should("not.exist");
            cy.log(`✅ Característica "${caracteristica}" agregada`);
        }

        // Cerrar modal de características (solo UNA VEZ al final)
        cy.log('🔍 Cerrando modal de características...');
        cy.xpath("//button[.//mat-icon[text()='close']]")
            .filter(":visible:not([disabled])")
            .first()
            .scrollIntoView()
            .should("be.visible")
            .click({ force: true });

        cy.log('✅ Modal de características cerrado');
    }


// ===========================
// MÉTODOS PA RA ARRASTRAR CARACTERÍSTICAS (SIN IFRAME)
// ===========================

    /**
     * Abre el panel de características si no está abierto
     */
    /**
     * Abre el panel de características si no está abierto
     */
    abrirPanelCaracteristicas() {
        cy.log('📂 Abriendo panel de Características');

        // Buscar el panel por su encabezado
        cy.contains('mat-expansion-panel-header', 'Características', { timeout: 15000 })
            .scrollIntoView()
            .should('be.visible')
            .then($header => {
                // Verificar si el panel está expandido
                const $panel = $header.closest('mat-expansion-panel');

                if (!$panel.hasClass('mat-expanded')) {
                    cy.wrap($header).click({ force: true });
                    cy.wait(1500); // Esperar a que se expanda

                    // Verificar que el área de destino ahora está visible
                    cy.get('div.cdk-drop-list#characteristics', { timeout: 10000 })
                        .should('be.visible');

                    cy.log('✅ Panel de Características abierto');
                } else {
                    cy.log('✅ Panel de Características ya estaba abierto');
                }
            });
    }

    AsignacionDCaracteristicaAPaso(caracteristica, tamanioLetra, visualizar, proteger, obligatorio, negrita, verFirmas, expresionCalcularCampo,
                                       ReglasCondicionarCampo, operacion, expresionParaValidar, mensajeError, correlativo, productos) {


        // Llamar a arrastrarCaracteristicaC con las opciones de destino
        this.Generales.arrastrarCaracteristicaC(caracteristica, {
            destinoSelector: '#step .drop-placeholder',
            contenedorDestino: '#step',
            timeout: 10000
        });

        cy.wait(500)
        this.Generales.seleccionarComboIframe(tamanioLetra, "Tamaño de letra", { timeout: 10000, force: true, skipContext: true } )
        this.Generales.slideToggleIframe(visualizar, "Visualizar", { timeout: 10000, skipContext: true, force: true });
        this.Generales.slideToggleIframe(proteger, "Proteger", { timeout: 10000, skipContext: true, force: true });
        this.Generales.slideToggleIframe(obligatorio, "Obligatorio", { timeout: 10000, skipContext: true, force: true });
        this.Generales.slideToggleIframe(negrita, "Negrita", { timeout: 10000, skipContext: true, force: true });
        this.Generales.slideToggleIframe(verFirmas, "Ver firmas", { timeout: 10000, skipContext: true, force: true });
        this.Generales.llenarCampoReadonlySinClick(expresionCalcularCampo, "Expresión para calcular campo", { timeout: 10000, skipContext: true, force: true } );
        this.Generales.llenarCampoIframe(ReglasCondicionarCampo, "Reglas para condicionar campo", { timeout: 10000, skipContext: true });
        this.Generales.seleccionarComboIframe(operacion, "Operación", { timeout: 10000, force: true, skipContext: true } )
        this.Generales.llenarCampoReadonlySinClick(expresionParaValidar, "Expresión para validar", { timeout: 10000, skipContext: true, force: true } );
        this.Generales.llenarCampoIframe(mensajeError, "Mensaje de error", { timeout: 10000, skipContext: true, force: true  });
        this.Generales.llenarCampoIframe(correlativo, "Correlativo", { timeout: 10000, skipContext: true });
        this.Generales.seleccionarComboIframe(productos, "Productos", { timeout: 10000, force: true, skipContext: true } )
    }

    /**
     * Valida que la característica apareció en el área de destino
     * @param {string} nombreCaracteristica - Nombre de la característica a validar
     */
    validarCaracteristicaEnDestino(nombreCaracteristica) {
        cy.log(`🔍 Validando característica "${nombreCaracteristica}" en destino`);

        const nombreNormalizado = nombreCaracteristica.toLowerCase().trim();

        cy.get("div.cdk-drop-list#characteristics", { timeout: 20000 })
            .first()
            .should("be.visible")
            .within(() => {
                // Buscar por texto, no por visibilidad
                cy.get('mat-card-title')
                    .filter((i, el) => {
                        const texto = Cypress.$(el).text().trim().toLowerCase();
                        return texto.includes(nombreNormalizado);
                    })
                    .should('have.length.greaterThan', 0);

                cy.log(`✅ Encontrado "${nombreCaracteristica}" en destino`);
            });
    }

    /**
     * Verifica que el panel izquierdo de características está visible
     */

    /**
     * Espera a que las características se carguen en el panel izquierdo
     */
    esperarCargaCaracteristicas() {
        cy.log('⏳ Esperando carga de características...');

        cy.get('div.content-characteristics', { timeout: 30000 })
            .first()
            .should('be.visible')
            .within(() => {
                cy.get('.cdk-drag', { timeout: 30000 })
                    .should('have.length.greaterThan', 0);
            });

        cy.log('✅ Características cargadas');
    }


    DefinicionDePasos(nombrePaso, tieneReglaCondionanteDePaso, typeReglaParaCondicionarPaso, descripcionPasoTrx){

        this.Generales.llenarCampoIframe2(nombrePaso, "Nombre", { timeout: 10000, skipContext: true});
        if (tieneReglaCondionanteDePaso){
            this.Generales.seleccionarComboIframe(typeReglaParaCondicionarPaso, "Regla para condicionar paso", { timeout: 10000, skipContext: true, force: true } );
        }else{
            console.log("No tiene regla para condicionar pasos...");
        }

        this.Generales.llenarCampoIframe2(descripcionPasoTrx, "Descripción", { timeout: 10000, skipContext: true});
    }

    definiciondePasos(
        nombrePaso,
        tieneReglaCondionanteDePaso,
        typeReglaParaCondicionarPaso,
        descripcionPasoTrx
    ) {
        cy.log("definicion de pasos de una trx");
        cy.xpath(
            "//div[@role='tab' and @aria-selected='true']//button[contains(@class,'add-button')]"
        ).click({force: true});
        cy.xpath(
            "//mat-form-field[.//mat-label[normalize-space()='Nombre']]//input"
        ).type(nombrePaso, {force: true});
        cy.xpath(
            "//mat-form-field[.//mat-label[normalize-space()='Regla para condicionar paso']]//mat-select"
        ).click({force: true});
        if (tieneReglaCondionanteDePaso.toLowerCase() == "si") {
            cy.xpath("//input[@placeholder='Buscar']").type(
                typeReglaParaCondicionarPaso,
                {force: true}
            );
            cy.get(".mat-mdc-option:not(.mdc-list-item--disabled)")
                .first()
                .click({force: true});
            cy.xpath(
                "//mat-label[normalize-space()='Descripción']/ancestor::mat-form-field //textarea"
            ).type(descripcionPasoTrx, {force: true});
        }
    }

    definirPaso(
        nombrePaso,
        tieneReglaCondionanteDePaso,
        typeReglaParaCondicionarPaso,
        descripcionPasoTrx
    ) {
        cy.log("Definición de un paso de la trx");

        cy.xpath(
            "//div[@role='tab' and @aria-selected='true']//button[contains(@class,'add-button')]"
        ).click({force: true});
        cy.wait(1500);

        cy.xpath(
            "//mat-form-field[.//mat-label[normalize-space()='Nombre']]//input"
        )
            .filter(":visible:not([disabled])")
            .first()
            .scrollIntoView()
            .should("be.visible")
            .type(nombrePaso, {force: true});

        if (tieneReglaCondionanteDePaso?.toLowerCase() === "si") {
            cy.xpath(
                "//mat-form-field[.//mat-label[normalize-space()='Regla para condicionar paso']]//mat-select"
            ).click({force: true});

            cy.xpath("//input[@placeholder='Buscar']").type(
                typeReglaParaCondicionarPaso,
                {force: true}
            );

            cy.get(".mat-mdc-option:not(.mdc-list-item--disabled)")
                .first()
                .click({force: true});
        }

        // VALIDACIÓN: Solo hacer type si descripcionPasoTrx no está vacío
        if (descripcionPasoTrx && descripcionPasoTrx.trim() !== '') {
            cy.xpath(
                "//mat-label[normalize-space()='Descripción']/ancestor::mat-form-field//textarea"
            )
                .filter(":visible:not([disabled])")
                .first()
                .scrollIntoView()
                .should("be.visible")
                .type(descripcionPasoTrx, {force: true});
        } else {
            cy.log('ℹ️ Descripción vacía, se omite el type');
        }

        cy.xpath("//button[.//mat-icon[text()='check']]")
            .filter(":visible:not([disabled])")
            .first()
            .scrollIntoView()
            .should("be.visible")
            .click({force: true});
    }




    RutinasTRX(rutina, estado, correlativo, requiereLogin, descripcion, fechaInicio, fechaFin, paremetros){
        this.Generales.seleccionarComboIframe(rutina, "Rutina", { timeout: 10000,  skipContext: true, force: true })
        this.Generales.seleccionarComboIframe(estado, "Estado", { timeout: 10000, skipContext: true, force: true })
        this.Generales.llenarCampoIframe(correlativo, "Correlativo", { timeout: 10000, skipContext: true, force: true })
        this.Generales.slideToggleIframe(requiereLogin, "Requiere Login", { timeout: 10000, skipContext: true, force: true });
        this.Generales.llenarDescripcionIframe(descripcion, "Descripción", { timeout: 10000, skipContext: true, force: true });
        this.Generales.IngresarFechaIframe(fechaInicio, "Fecha de Inicio", { timeout: 10000, skipContext: true });
        this.Generales.IngresarFechaIframe(fechaFin, "Fecha de Fin", { timeout: 10000, skipContext: true });
        this.Generales.llenarCampoIframe(paremetros, "Parámetros", { timeout: 10000, skipContext: true, force: true });
    }


}
export default GestorPomCy;