import metodosGeneralesPomCy from "./MetodosGeneralesPom.cy.js";

class GestorPomCy{

    constructor() {
        this.Generales = new metodosGeneralesPomCy();
    }


    //Totales a afectar gestor de TX`s
    AsignarMoneda(caracteristformaAfectarTotalesica, metodoAsignacionMoneda, correlativoMoneda){  

        // this.Generales.BtnIframe('editar', { force: true, skipContext: true }, 'add-button', false);
        this.Generales.seleccionarComboIframe(caracteristformaAfectarTotalesica, "Forma afectar totales", { timeout: 10000, force: true, skipContext: true } )
        this.Generales.seleccionarComboIframe(metodoAsignacionMoneda, "Método asignación de moneda", { timeout: 10000, skipContext: true, force: true } )
        this.Generales.seleccionarComboIframe(correlativoMoneda, "Moneda", { timeout: 10000, skipContext: true, force: true } )
    }



    //Totales a afectar gestor de TX`s
    TotalesAfectar(caracteristica, totalCajero, operacion, exp1, operacion2, exp2){

        // this.Generales.dragCaracteristica(caracteristica,  { timeout: 10000, skipContext: true, force: true });
        this.Generales.arrastrarCaracteristica(caracteristica)

        cy.wait(2500)
      
        this.Generales.seleccionarComboIframe(totalCajero, "Total de Cajero", { timeout: 10000, force: true, skipContext: true } )
        this.Generales.seleccionarRadio(operacion, "Operacion", { timeout: 10000, skipContext: true, force: true } )
        
        

        //##########################  PENDIENTE PASOS PARA VALIDAR COMO SE MANEJARA LAS EXPRESIONES ##########################


        // this.Generales.llenarCampoIframe("C(5)", "Expresion 1", { timeout: 10000, skipContext: true, force: true } )
        // if(exp1){
        //     this.Generales.BtnIframe("Cerrar")
        //     cy.wait(1500)
        // }else{
        //     cy.log("expresion 1 vacia")
        // }
        // this.Generales.seleccionarComboIframe(operacion2, "Operacion", { timeout: 10000, skipContext: true, force: true } )
        // this.Generales.llenarCampoIframe(exp2, "Expresion 2", { timeout: 10000, skipContext: true, force: true } )
        // if(exp2){
        //     this.Generales.BtnIframe("Cerrar")
        //     cy.wait(1500)
        // }else{
        //     cy.log("expresion 1 vacia")
        // }
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
                // Carga de logo this.Generales.cargarArchivo(logo, "Logo"); pendiente
    }

    //Seleccionar tipos de cajero del gestor de TX`s
    TiposCajero(administrador,supervisor, jefeAgencia, subJefeAgencia, cajero) {
        this.Generales.checkboxEnTabla(administrador, "Administrador")
        this.Generales.checkboxEnTabla(cajero, "Cajero")
        this.Generales.checkboxEnTabla(jefeAgencia, "Jefe de agencia")
        this.Generales.checkboxEnTabla(subJefeAgencia, "Sub jefe de agencia")
        this.Generales.checkboxEnTabla(supervisor, "Supervisor")
    };

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
                           impAntesConsultarFirmas, copiasImprimir, etiqueta, etiqueta2)
    {
        this.Generales.seleccionarComboIframe(tipoFormato, "Tipo de Formato", { timeout: 10000,  skipContext: true, force: true })
        this.Generales.seleccionarComboIframe(comprobante, "Comprobante", { timeout: 10000, skipContext: true, force: true })
        this.Generales.slideToggleIframe(esMandatorio, "Es mandatorio", { timeout: 10000, skipContext: true, force: true });
        this.Generales.slideToggleIframe(verComprobante, "Ver comprobante", { timeout: 10000, skipContext: true, force: true })
        this.Generales.slideToggleIframe(notificaComprobante, "Se notifica comprobante al menos por un medio", { timeout: 10000, skipContext: true, force: true })
        this.Generales.slideToggleIframe(impAntesConsultarFirmas, "Imprimir antes de consultar Firmas", { timeout: 10000, skipContext: true, force: true })
        this.Generales.llenarCampoIframe(copiasImprimir, "Copias a imprimir", { timeout: 10000, skipContext: true, force: true })
        this.Generales.llenarCampoEnTablaIframe(etiqueta, "Etiqueta", 1, { timeout: 10000, skipContext: true, force: true });
        this.Generales.llenarCampoEnTablaIframe(etiqueta2, "Etiqueta", 2, { timeout: 10000, skipContext: true, force: true });
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
// MÉTODOS PARA ARRASTRAR CARACTERÍSTICAS (SIN IFRAME)
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

    /**
     * Arrastra una característica al área de características
     * @param {string} nombreCaracteristica - Nombre de la característica a arrastrar
     */
    arrastrarCaracteristicaAPaso(nombreCaracteristica) {
        cy.log(`🖱️ Arrastrando característica: "${nombreCaracteristica}"`);

        // PASO 1: Asegurar que el panel de características está abierto
        this.abrirPanelCaracteristicas();

        // PASO 2: Normalizar nombre
        const nombreNormalizado = nombreCaracteristica.toLowerCase().trim();

        // PASO 3: Obtener la característica origen
        cy.get('div.content-characteristics', { timeout: 15000 })
            .first()
            .should('be.visible')
            .within(() => {
                cy.get('.cdk-drag')
                    .filter((i, el) => {
                        const texto = Cypress.$(el).text().trim().toLowerCase();
                        return texto.includes(nombreNormalizado);
                    })
                    .first()
                    .as('caracteristicaOrigen');
            });

        // PASO 4: IDENTIFICAR EL ÁREA DE DESTINO CORRECTA
        // Basado en tu captura, el área tiene el texto "Puedes arrastrar una característica aquí"
        cy.contains('div', 'Puedes arrastrar una característica aquí', { timeout: 10000 })
            .should('be.visible')
            .parents('[class*="drop-list"], [class*="cdk-drop"]')
            .first()
            .as('destinoCaracteristicas');

        // PASO 5: Realizar drag & drop con coordenadas reales
        cy.then(() => {
            cy.get('@caracteristicaOrigen').then($origen => {
                cy.get('@destinoCaracteristicas').then($destino => {
                    // Obtener coordenadas
                    const origenRect = $origen[0].getBoundingClientRect();
                    const destinoRect = $destino[0].getBoundingClientRect();

                    // Calcular puntos centrales
                    const origenX = origenRect.left + origenRect.width / 2;
                    const origenY = origenRect.top + origenRect.height / 2;
                    const destinoX = destinoRect.left + destinoRect.width / 2;
                    const destinoY = destinoRect.top + destinoRect.height / 2;

                    cy.log(`📍 Origen: (${origenX}, ${origenY})`);
                    cy.log(`📍 Destino: (${destinoX}, ${destinoY})`);
                    cy.log(`📏 Diferencia: X: ${destinoX - origenX}, Y: ${destinoY - origenY}`);

                    // Realizar drag con eventos nativos
                    cy.get('@caracteristicaOrigen')
                        .trigger('mousedown', {
                            button: 0,
                            clientX: origenX,
                            clientY: origenY,
                            force: true
                        })
                        .wait(500)
                        .trigger('mousemove', {
                            clientX: destinoX,
                            clientY: destinoY,
                            force: true
                        })
                        .wait(500)
                        .trigger('mouseup', {
                            force: true
                        });
                });
            });
        });

        cy.wait(2000);
        cy.log(`✅ Intento de arrastre para "${nombreCaracteristica}" completado`);
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


    /*DefinicionDePasos(nombrePaso, tieneReglaCondionanteDePaso, typeReglaParaCondicionarPaso, descripcionPasoTrx){

        this.Generales.llenarCampoIframe(nombrePaso, "Nombre");
        if (tieneReglaCondionanteDePaso){
            this.Generales.seleccionarComboIframe(typeReglaParaCondicionarPaso, "Regla para condicionar paso" );
        }else{
            console.log("No tiene regla para condicionar pasos...");
        }

        this.Generales.llenarCampoIframe(descripcionPasoTrx, "Descripción");
    }*/






    definiciondePasos2(
        nombrePaso,
        tieneReglaCondionanteDePaso,
        typeReglaParaCondicionarPaso,
        descripcionPasoTrx
    ) {
        cy.get("iframe.frame", {timeout: 10000})
            .should("be.visible")
            .invoke("css", "pointer-events", "auto")
            .its("0.contentDocument.body")
            .should("not.be.empty")
            .then(cy.wrap)
            .within(($body) => {
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
            });
    }

    _definirPaso(
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
        cy.xpath(
            "//mat-label[normalize-space()='Descripción']/ancestor::mat-form-field//textarea"
        )
            .filter(":visible:not([disabled])")
            .first()
            .scrollIntoView()
            .should("be.visible")
            .type(descripcionPasoTrx, {force: true});
        cy.xpath("//button[.//mat-icon[text()='check']]")
            .filter(":visible:not([disabled])")
            .first()
            .scrollIntoView()
            .should("be.visible")
            .click({force: true});
    }

    definiciondePasos(pasos) {
        cy.get("iframe.frame", {timeout: 10000})
            .should("be.visible")
            .invoke("css", "pointer-events", "auto")
            .its("0.contentDocument.body")
            .should("not.be.empty")
            .then(cy.wrap)
            .within(() => {
                pasos.forEach((paso) => {
                    this._definirPaso(
                        paso.nombrePaso,
                        paso.tieneRegla,
                        paso.tipoRegla,
                        paso.descripcion
                    );
                });
            });
    }

    rutinasPre(
        tieneRutinaPre,
        typeRutinaPre,
        typeEstado,
        correlativoPre,
        requiereLoginPre,
        typeRutinaLoginPre,
        descripcionRutinaPre,
        fechaInicioPre,
        fechaFinPre,
        parametrosRutinaPre
    ) {
        cy.get("iframe.frame", {timeout: 10000})
            .should("be.visible")
            .invoke("css", "pointer-events", "auto")
            .its("0.contentDocument.body")
            .should("not.be.empty")
            .then(cy.wrap)
            .within(() => {
                cy.xpath(
                    "//div[@role='tab'][.//span[normalize-space()='Paso 1']]"
                ).click({force: true});
                if (tieneRutinaPre.toLowerCase() == "si") {
                    cy.xpath(
                        "//mat-panel-title[contains(., 'Rutinas PRE')]//button[contains(@class, 'btn-add-mini')]"
                    ).click({force: true});
                    cy.xpath(
                        "//mat-form-field[.//mat-label[normalize-space()='Rutina']]//mat-select"
                    ).click({force: true});
                    cy.xpath("//input[@placeholder='Buscar']").type(typeRutinaPre, {
                        force: true,
                    });
                    cy.get(".mat-mdc-option:not(.mdc-list-item--disabled)")
                        .first()
                        .click({force: true});
                    cy.xpath(
                        "//mat-form-field[.//mat-label[normalize-space()='Estado']]//mat-select"
                    )
                        .filter(":visible:not([disabled])")
                        .first()
                        .scrollIntoView()
                        .should("be.visible")
                        .click({force: true});

                    cy.xpath("//input[@placeholder='Buscar']").type(typeEstado, {
                        force: true,
                    });
                    cy.get(".mat-mdc-option:not(.mdc-list-item--disabled)")
                        .first()
                        .click({force: true});

                    cy.xpath(
                        "//mat-form-field[.//mat-label[normalize-space()='Correlativo']]//input"
                    ).type(correlativoPre, {force: true});
                    if (requiereLoginPre.toLowerCase == "si") {
                        cy.xpath(
                            "//div[contains(@class,'switch-wrapper')][.//label[normalize-space()='Requiere Login']]//button[@role='switch']"
                        ).click({force: true});
                        cy.xpath(
                            "//mat-form-field[.//mat-label[normalize-space()='Rutina Login']]//mat-select"
                        ).click({force: true});
                        cy.xpath("//input[@placeholder='Buscar']").type(
                            typeRutinaLoginPre,
                            {force: true}
                        );
                        cy.get(".mat-mdc-option:not(.mdc-list-item--disabled)")
                            .first()
                            .click({force: true});
                    }
                    cy.xpath(
                        "//mat-label[normalize-space()='Descripción']/ancestor::mat-form-field //textarea"
                    )
                        .filter(":visible:not([disabled])")
                        .first()
                        .scrollIntoView()
                        .should("be.visible")
                        .type(descripcionRutinaPre, {force: true});
                    cy.xpath(
                        "//mat-form-field   [.//mat-label[normalize-space()='Fecha de Inicio']]   //button[@aria-label='Open calendar']"
                    ).click({force: true});
                    cy.selectMatDate(fechaInicioPre);
                    if (fechaFinPre && fechaFinPre.trim()) {
                        // 1️⃣ Abrir calendario SOLO si hay fecha
                        cy.xpath(
                            "//mat-form-field   [.//mat-label[normalize-space()='Fecha de Fin']]   //button[@aria-label='Open calendar']"
                        ).click({
                            force: true,
                        });

                        cy.selectMatDate(fechaFinPre);
                    }
                    cy.xpath(
                        "//mat-label[normalize-space()='Parámetros']/ancestor::mat-form-field //textarea"
                    ).type(parametrosRutinaPre, {force: true});
                    cy.xpath(
                        "//button[@mat-mini-fab and @color='primary'][.//mat-icon[text()='check']]"
                    ).click({force: true});
                } else {
                    cy.log("No entra a flujo ya que no tiene rutina PRE");
                }
            });
    }

    rutinasPos(
        tieneRutinaPos,
        typeRutinaPos,
        typeEstado,
        correlativoPos,
        requiereLoginPos,
        typeRutinaLoginPos,
        descripcionRutinaPos,
        fechaInicioPos,
        fechaFinPos,
        parametrosRutinaPos
    ) {
        cy.get("iframe.frame", {timeout: 10000})
            .should("be.visible")
            .invoke("css", "pointer-events", "auto")
            .its("0.contentDocument.body")
            .should("not.be.empty")
            .then(cy.wrap)
            .within(() => {
                cy.xpath(
                    "//div[@role='tab'][.//span[normalize-space()='Paso 1']]"
                ).click({force: true});
                if (tieneRutinaPos.toLowerCase() == "si") {
                    cy.xpath(
                        "//mat-panel-title[contains(., 'Rutinas POS')]//button[contains(@class, 'btn-add-mini')]"
                    ).click({force: true});
                    cy.xpath(
                        "//mat-form-field[.//mat-label[normalize-space()='Rutina']]//mat-select"
                    )
                        .filter(":visible:not([disabled])")
                        .first()
                        .scrollIntoView()
                        .should("be.visible")
                        .click({force: true});
                    cy.xpath("//input[@placeholder='Buscar']").type(typeRutinaPos, {
                        force: true,
                    });
                    cy.get(".mat-mdc-option:not(.mdc-list-item--disabled)")
                        .first()
                        .click({force: true});
                    cy.xpath(
                        "//mat-form-field[.//mat-label[normalize-space()='Estado']]//mat-select"
                    )
                        .filter(":visible:not([disabled])")
                        .first()
                        .scrollIntoView()
                        .should("be.visible")
                        .click({force: true});

                    cy.xpath("//input[@placeholder='Buscar']").type(typeEstado, {
                        force: true,
                    });
                    cy.get(".mat-mdc-option:not(.mdc-list-item--disabled)")
                        .first()
                        .click({force: true});

                    cy.xpath(
                        "//mat-form-field[.//mat-label[normalize-space()='Correlativo']]//input"
                    ).type(correlativoPos, {force: true});
                    if (requiereLoginPos.toLowerCase == "si") {
                        cy.xpath(
                            "//div[contains(@class,'switch-wrapper')][.//label[normalize-space()='Requiere Login']]//button[@role='switch']"
                        ).click({force: true});
                        cy.xpath(
                            "//mat-form-field[.//mat-label[normalize-space()='Rutina Login']]//mat-select"
                        ).click({force: true});
                        cy.xpath("//input[@placeholder='Buscar']").type(
                            typeRutinaLoginPos,
                            {force: true}
                        );
                        cy.get(".mat-mdc-option:not(.mdc-list-item--disabled)")
                            .first()
                            .click({force: true});
                    }
                    cy.xpath(
                        "//mat-label[normalize-space()='Descripción']/ancestor::mat-form-field //textarea"
                    )
                        .filter(":visible:not([disabled])")
                        .first()
                        .scrollIntoView()
                        .should("be.visible")
                        .type(descripcionRutinaPos, {force: true});
                    cy.xpath(
                        "//mat-form-field   [.//mat-label[normalize-space()='Fecha de Inicio']]   //button[@aria-label='Open calendar']"
                    ).click({force: true});
                    cy.selectMatDate(fechaInicioPos);
                    if (fechaFinPos && fechaFinPos.trim()) {
                        // 1️⃣ Abrir calendario SOLO si hay fecha
                        cy.xpath(
                            "//mat-form-field   [.//mat-label[normalize-space()='Fecha de Fin']]   //button[@aria-label='Open calendar']"
                        ).click({
                            force: true,
                        });

                        cy.selectMatDate(fechaFinPos);
                    }
                    cy.xpath(
                        "//mat-label[normalize-space()='Parámetros']/ancestor::mat-form-field //textarea"
                    ).type(parametrosRutinaPos, {force: true});
                    cy.xpath(
                        "//button[@mat-mini-fab and @color='primary'][.//mat-icon[text()='check']]"
                    ).click({force: true});
                } else {
                    cy.log("No entra a flujo ya que no tiene rutina POS");
                }
            });
    }


//Fin Gestor de transacciones
}
export default GestorPomCy;