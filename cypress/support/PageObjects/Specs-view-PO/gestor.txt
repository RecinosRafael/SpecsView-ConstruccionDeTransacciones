import metodosGeneralesPomCy from "./MetodosGeneralesPom.cy.js";

class GestorPomCy{

    constructor() {
        this.Generales = new metodosGeneralesPomCy();
    }

    //Gestor de transacciones
    
        GestorTransacciones(
        tipo, codigo, codAlternativo, nombre, etiqueta, estado, validoDesde, validoHasta, tipoMovimientoBoveda, descripcion,
        esconderMenu, permiteReversion, modoOffline, requiereSupervisor, requiereValidarAcceso, seEnviaHost, tiempoEspera, 
        accionPorDemora, tienePagoServicio, PagoServicio, pasoConfirmacionServicio, permiteReimpresion, diasPermitidoReimpresion, 
        presentarResumen, mensajeResumen, tipoMensaje, icono, DepartamentodeAutorizacion, textoAyuda, logo
    ){
            this.Generales.seleccionarComboIframe(tipo, "Tipo" );
            this.Generales.llenarCampoIframe(codigo, "Código"); 
            this.Generales.llenarCampoIframe(codAlternativo, "Código alternativo");
            this.Generales.llenarCampoIframe(nombre, "Nombre");
            this.Generales.llenarCampoIframe(etiqueta, "Etiqueta");
            this.Generales.seleccionarComboIframe(estado, "Estado");
            this.Generales.seleccionarComboIframe(tipoMovimientoBoveda, "Tipo movimiento en bóveda");
            this.Generales.IngresarFechaIframe(validoDesde, "Valido desde");
            this.Generales.IngresarFechaIframe(validoHasta, "Valido hasta");
            this.Generales.llenarCampoIframe(descripcion, "Descripción");
            this.Generales.checkboxIframe(esconderMenu, "Esconder en menú");
            this.Generales.checkboxIframe(permiteReversion, "Permite reversión");
            this.Generales.checkboxIframe(modoOffline, "Modo offline");
            this.Generales.checkboxIframe(requiereSupervisor, "Requiere supervisor");
            this.Generales.checkboxIframe(requiereValidarAcceso, "Se requiere validar acceso");
            if (seEnviaHost) {
                this.Generales.checkboxIframe(seEnviaHost, "Se envía al host");
                this.Generales.llenarCampoIframe(tiempoEspera, "Tiempo de espera");
                this.Generales.seleccionarComboIframe(accionPorDemora, "Acción por demora");      
            }else{
                cy.log("Se envía al host no está activo, no se ingresan los datos relacionados a esta opción");
            }
            if (tienePagoServicio) {
                this.Generales.checkboxIframe(tienePagoServicio, "Es pago de servicio");
                this.Generales.seleccionarComboIframe(PagoServicio, "Pago de servicio");
                this.Generales.seleccionarComboIframe(pasoConfirmacionServicio, "Incluye paso para confirmar datos");
            }else{
                cy.log("Es pago de servicio no está activo, no se ingresan los datos relacionados a esta opción");
            }
            if (permiteReimpresion) {
                this.Generales.checkboxIframe(permiteReimpresion, "Permite reimpresión");
                this.Generales.llenarCampoIframe(diasPermitidoReimpresion, "Dias permitidos para reimprimir");
            }else{
                cy.log("Permite reimpresión no está activo, no se ingresan los datos relacionados a esta opción");
            }
            if (presentarResumen) {
                this.Generales.checkboxIframe(presentarResumen, "Presentar resumen de transaccion");
                this.Generales.llenarCampoIframe(mensajeResumen, "Mensaje despues del proceso");
                this.Generales.seleccionarComboIframe(tipoMensaje, "Tipo de mensaje");    
            } else {
                cy.log("Presentar resumen no está activo, no se ingresan los datos relacionados a esta opción");
            }
            this.Generales.llenarCampoIframe(icono, "Ícono");
            this.Generales.seleccionarComboIframe(DepartamentodeAutorizacion, "Departamento de autorización");
            this.Generales.llenarCampoIframe(textoAyuda, "Texto de ayuda");
                // Carga de logo this.Generales.cargarArchivo(logo, "Logo"); pendiente
    }    

    
    GestorTransacciones2(
        codigoTrx,tipoTRX, codigoAlternativo, nombreTrx, etiquetaTrx, estadoTrx, validoDesde, validoHasta, tipoMovimientoBoveda, descripcionTrx,
        esconderMenu, permiteReversion, modoOffline, requiereSupervisor, requiereValidarAcceso, seEnvíaHost, tiempoEsperaSeEnviaHost, 
        accionDemoraHost, tienepagoServicio, typePagoServicio, pasoConfirmacionServicio, permiteReimpresion, diasPermitidoReimpresion, 
        presentarResumentrx, mensajeResumenTrx, tipoMensajeTrx, iconoDatosAdicionales, typeDepartamentodeAutorizacion, textoAyudaDatosAdcionales
    ){
        
        cy.get("iframe.frame", {timeout: 10000})
            .should("be.visible")
            .invoke("css", "pointer-events", "auto")
            .its("0.contentDocument.body")
            .should("not.be.empty")
            .then(cy.wrap)
            .within(($body) => {
                // $body es el body del iframe (objeto jQuery)
                cy.log("Validando código: " + codigoTrx);

                cy.xpath("//span[normalize-space()='Filtros']").click({force: true});
                cy.wait(3000);

                // Filtramos
                cy.xpath(
                    "//div[contains(@class, 'mat-mdc-text-field-wrapper')][.//mat-label[contains(text(), 'Código')]]//input"
                )
                    .clear({force: true})
                    .type(codigoTrx + "{enter}", {force: true});

                cy.wait(2500);

                // --- VALIDACIÓN DEFINITIVA ---
                const xpathCelda = `//td[contains(@class, 'mat-column-codeOfTheTransaction') and normalize-space()='${codigoTrx}']`;

                // Obtenemos el 'ownerDocument' que es el documento real del IFRAME
                const doc = $body[0].ownerDocument;

                // Buscamos el elemento usando el motor nativo de ese documento
                const el = doc.evaluate(
                    xpathCelda,
                    doc,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;

                if (el) {
                    cy.log("El código " + codigoTrx + " Existe en la tabla.");
                } else {
                    cy.log("El código no se encontró, procediendo a crear registro.");
                    cy.xpath(
                        "//mat-icon[contains(@class, 'material-icons') and text()='add']"
                    ).click({force: true});
                    cy.wait(1500);
                    cy.xpath("//mat-label[normalize-space()='Tipo']").click({
                        force: true,
                    });
                    cy.wait(500);
                    cy.xpath(`//input[@placeholder='Buscar']`).type(tipoTRX, {
                        force: true,
                    });
                    cy.get(".mat-mdc-option:not(.mdc-list-item--disabled)")
                        .first()
                        .click({force: true});

                    cy.wait(500);
                    cy.xpath(
                        "//mat-label[normalize-space()='Código']/ancestor::mat-form-field//input"
                    ).type(codigoTrx, {force: true});
                    cy.wait(500);
                    cy.xpath(
                        "//mat-label[normalize-space()='Código alternativo']/ancestor::mat-form-field//input"
                    ).type(codigoAlternativo, {force: true});
                    cy.wait(500);
                    cy.xpath(
                        "//mat-label[normalize-space()='Nombre']/ancestor::mat-form-field//input"
                    ).type(nombreTrx, {force: true});
                    cy.wait(500);
                    cy.xpath(
                        "//mat-label[normalize-space()='Etiqueta']/ancestor::mat-form-field//input"
                    ).type(etiquetaTrx, {force: true});
                    cy.wait(500);
                    cy.xpath("//mat-label[normalize-space()='Estado']").click({
                        force: true,
                    });
                    cy.wait(500);
                    cy.xpath(`//input[@placeholder='Buscar']`).type(
                        estadoTrx,
                        {force: true},
                        {timeout: 1000}
                    );
                    cy.get(".mat-mdc-option:not(.mdc-list-item--disabled)")
                        .first()
                        .click({force: true});

                    cy.wait(500);

                    cy.xpath("(//button[@aria-label='Open calendar'])[1]").click({
                        force: true,
                    });
                    cy.selectMatDate(validoDesde);

                    cy.wait(500);

                    if (validoHasta && validoHasta.trim()) {
                        // 1️⃣ Abrir calendario SOLO si hay fecha
                        cy.xpath("(//button[@aria-label='Open calendar'])[2]").click({
                            force: true,
                        });

                        // 2️⃣ Seleccionar fecha usando el command existente
                        cy.selectMatDate(validoHasta);
                    }

                    cy.xpath(
                        "//mat-label[normalize-space()='Tipo movimiento en bóveda']"
                    ).click({force: true});
                    cy.wait(500);
                    cy.xpath(`//input[@placeholder='Buscar']`).type(
                        tipoMovimientoBoveda,
                        {force: true}
                    );
                    cy.get(".mat-mdc-option:not(.mdc-list-item--disabled)")
                        .first()
                        .click({force: true});

                    cy.xpath(
                        "//mat-label[normalize-space()='Descripción']/ancestor::mat-form-field//textarea"
                    ).type(descripcionTrx, {force: true});
                    // Botones a la par de descripcion
                    // ESCONDER EN MENÚ
                    if (esconderMenu && esconderMenu.toLowerCase() === "si") {
                        cy.contains("label.label", "Esconder en menú")
                            .parents("app-input-switch")
                            .find('button[role="switch"][aria-checked="false"]')
                            .click({force: true});
                    }

                    // PERMITE REVERSIÓN
                    if (permiteReversion && permiteReversion.toLowerCase() === "si") {
                        cy.contains("label.label", "Permite reversión")
                            .parents("app-input-switch")
                            .find('button[role="switch"][aria-checked="false"]')
                            .click({force: true});
                    }

                    // MODO OFFLINE
                    if (modoOffline && modoOffline.toLowerCase() === "si") {
                        cy.contains("label.label", "Modo offline")
                            .parents("app-input-switch")
                            .find('button[role="switch"][aria-checked="false"]')
                            .click({force: true});
                    }

                    // REQUIERE SUPERVISOR
                    if (requiereSupervisor && requiereSupervisor.toLowerCase() === "si") {
                        cy.contains("label.label", "Requiere supervisor")
                            .parents("app-input-switch")
                            .find('button[role="switch"][aria-checked="false"]')
                            .click({force: true});
                    }

                    // REQUIERE VALIDAR ACCESO
                    if (
                        requiereValidarAcceso &&
                        requiereValidarAcceso.toLowerCase() === "si"
                    ) {
                        cy.contains("label.label", "Se requiere validar acceso")
                            .parents("app-input-switch")
                            .find('button[role="switch"][aria-checked="false"]')
                            .click({force: true});
                    }

                    // Checks a la par de datos adicionales
                    // SE ENVÍA AL HOST
                    if (seEnvíaHost && seEnvíaHost.toLowerCase() === "si") {
                        cy.contains("label.label", "Se envía al host")
                            .parents("app-input-switch")
                            .find('button[role="switch"][aria-checked="false"]')
                            .click({force: true});
                        cy.wait(500);
                        cy.log(
                            "***Entrando a especificacion de tiempo de espera de la trx***"
                        );
                        cy.xpath(
                            "//mat-form-field[.//mat-label[normalize-space()='Tiempo de espera']]//input"
                        ).type(tiempoEsperaSeEnviaHost, {force: true});
                        cy.xpath(
                            "//mat-form-field[.//mat-label[normalize-space()='Acción por demora']]//mat-select"
                        ).click({force: true});
                        cy.xpath("//input[@placeholder='Buscar']").type(accionDemoraHost, {
                            force: true,
                        });
                        cy.get(".mat-mdc-option:not(.mdc-list-item--disabled)")
                            .first()
                            .click({force: true});
                    }

                    // ES PAGO DE SERVICIO
                    if (tienepagoServicio && tienepagoServicio.toLowerCase() === "si") {
                        cy.contains("label.label", "Es pago de servicio")
                            .parents("app-input-switch")
                            .find('button[role="switch"][aria-checked="false"]')
                            .click({force: true});
                        cy.get(".loading", {timeout: 60000}).should("not.exist");
                        cy.log("Entrando a especificaciones de pagos de servicios");
                        cy.xpath(
                            "//mat-form-field[.//mat-label[normalize-space()='Pago de servicio']]//mat-select"
                        ).click({force: true});

                        cy.get(".mdc-circular-progress", {timeout: 40000}).should(
                            "not.exist"
                        );
                        cy.xpath("//input[@placeholder='Buscar']").type(
                            typePagoServicio.toUpperCase(),
                            {force: true}
                        );
                        cy.get(".mat-mdc-option:not(.mdc-list-item--disabled)")
                            .first()
                            .click({force: true});
                        cy.xpath(
                            " //mat-form-field[.//mat-label[normalize-space()='Incluye paso para confirmar datos']]//mat-select"
                        ).click({force: true});
                        cy.xpath("//input[@placeholder='Buscar']").type(
                            pasoConfirmacionServicio,
                            {force: true}
                        );
                        cy.get(".mat-mdc-option:not(.mdc-list-item--disabled)")
                            .first()
                            .click({force: true});
                    }

                    // PERMITE REIMPRESIÓN
                    if (permiteReimpresion && permiteReimpresion.toLowerCase() === "si") {
                        cy.contains("label.label", "Permite reimpresión")
                            .parents("app-input-switch")
                            .find('button[role="switch"][aria-checked="false"]')
                            .click({force: true});
                        cy.wait(500);
                        cy.log("***Entrando a permite reimpresion***");
                        cy.xpath(
                            "//mat-form-field[.//mat-label[normalize-space()='Dias permitidos para reimprimir']]//input"
                        ).type(diasPermitidoReimpresion, {force: true});
                    }

                    // PRESENTAR RESUMEN DE TRANSACCIÓN
                    if (
                        presentarResumentrx &&
                        presentarResumentrx.toLowerCase() === "si"
                    ) {
                        cy.contains("label.label", "Presentar resumen de transacción")
                            .parents("app-input-switch")
                            .find('button[role="switch"][aria-checked="false"]')
                            .click({force: true});
                        cy.wait(500);
                        cy.log(
                            "***Entrado a especificaciones de presentar resumen de transaccion***"
                        );
                        cy.xpath(
                            "//mat-label[normalize-space()='Mensaje despues del proceso']/ancestor::mat-form-field //textarea"
                        ).type(mensajeResumenTrx, {force: true});
                        cy.xpath(
                            "//mat-form-field[.//mat-label[normalize-space()='Tipo de mensaje']]//mat-select"
                        ).click({force: true});
                        cy.xpath("//input[@placeholder='Buscar']").type(tipoMensajeTrx, {
                            force: true,
                        });
                        cy.get(".mat-mdc-option:not(.mdc-list-item--disabled)")
                            .first()
                            .click({force: true});
                    }

                    //DATOS ADICIONALES
                    cy.xpath(
                        "//mat-form-field[.//mat-label[normalize-space()='Ícono']]//input"
                    ).type(iconoDatosAdicionales, {force: true});
                    cy.xpath(
                        "//mat-form-field[.//mat-label[normalize-space()='Departamento de autorización']]//mat-select"
                    ).click({force: true});
                    cy.xpath("//input[@placeholder='Buscar']").type(
                        typeDepartamentodeAutorizacion,
                        {force: true}
                    );
                    cy.get(".mat-mdc-option:not(.mdc-list-item--disabled)")
                        .first()
                        .click({force: true});
                    cy.xpath(
                        "//mat-label[normalize-space()='Texto de ayuda']/ancestor::mat-form-field //textarea"
                    ).type(textoAyudaDatosAdcionales, {force: true});
                    cy.xpath(
                        "//mat-dialog-actions//button[.//mat-icon[normalize-space()='check']]"
                    ).click({force: true});
                    cy.get(".mdc-circular-progress", {timeout: 40000}).should(
                        "not.exist"
                    );
                }
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

    definiciondePasos(
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

    //DRAG AND DROP

    // ===========================
    // 1️⃣ Arrastrar una característica
    // ===========================
    arrastrarCaracteristica(nombreCaracteristica) {
        cy.get("div.content-characteristics .cdk-drag", {timeout: 10000})
            .contains(nombreCaracteristica)
            .should("be.visible")
            .realMouseDown({button: "left", position: "center"})
            .realMouseMove(0, 10, {position: "center"})
            .wait(500);

        cy.get("div.cdk-drop-list#step")
            .should("exist")
            .realMouseMove(0, 0, {position: "center"})
            .realMouseUp();

        cy.wait(800);
    }

    // ===========================
    // 2️⃣ Validar que la característica llegó al paso
    // ===========================
    validarCaracteristicaEnPaso(nombreCaracteristica) {
        cy.get("div.cdk-drop-list#characteristics", {timeout: 20000})
            .should("exist")
            .within(() => {
                cy.contains("mat-card-title", nombreCaracteristica, {
                    timeout: 20000,
                }).should("be.visible");
            });
    }

    // ===========================
    // 3️⃣ Arrastrar y configurar todo en un solo método
    // ===========================
    arrastrarYConfigurarCaracteristica(config) {
        const self = this;

        cy.get("iframe.frame", {timeout: 15000})
            .should("be.visible")
            .its("0.contentDocument.body")
            .should("not.be.empty")
            .then(cy.wrap)
            .within(() => {
                self.arrastrarCaracteristica(config.nombre);
                self.validarCaracteristicaEnPaso(config.nombre);
                self.configurarCaracteristica(config);
            });
    }

    // ===========================
    // 4️⃣ Configurar los detalles de la característica
    // ===========================
    marcarSwitchPorTexto(textoLabel, valor) {
        if (valor?.toLowerCase() !== "si") return;

        cy.xpath(
            `
    //app-input-switch
      [.//label[normalize-space()='${textoLabel}']]
      //button[@role='switch' and @aria-checked='false']
  `
        )
            .scrollIntoView()
            .should("be.visible")
            .click({force: true});
    }

    configurarCaracteristica(config) {
        // Ya estamos dentro del iframe desde arrastrarYConfigurarCaracteristica
        // No necesitamos volver a buscarlo
        cy.wrap(null).then(() => {
            // 🔤 Tamaño de letra
            if (config.tamanioLetra) {
                cy.xpath(
                    "//mat-form-field[.//mat-label[normalize-space()='Tamaño de letra']]//mat-select"
                ).click({force: true});

                cy.xpath("//input[@placeholder='Buscar']")
                    .clear()
                    .type(`${config.tamanioLetra}`, {force: true});

                cy.get(".mat-mdc-option:not(.mdc-list-item--disabled)")
                    .first()
                    .click({force: true});
            }

            this.marcarSwitchPorTexto("Proteger", config.proteger);
            this.marcarSwitchPorTexto("Obligatorio", config.obligatorio);
            this.marcarSwitchPorTexto("Negrita", config.negrita);
            this.marcarSwitchPorTexto("Ver firmas", config.verFirmas);

            //  Regla
            if (config.regla) {
                cy.xpath(
                    "//mat-label[normalize-space()='Reglas para condicionar campo']/ancestor::mat-form-field//textarea"
                )
                    .filter(":visible:not([disabled])")
                    .first()
                    .scrollIntoView()
                    .should("be.visible")
                    .type(config.regla, {force: true});
            }
            //mensaje de error
            if (config.mensajeError) {
                cy.xpath(
                    "//mat-label[normalize-space()='Mensaje de error']/ancestor::mat-form-field//textarea"
                )
                    .filter(":visible:not([disabled])")
                    .first()
                    .scrollIntoView()
                    .should("be.visible")
                    .type(config.mensajeError, {force: true});
            }

            if (config.correlativo) {
                cy.xpath(
                    "//mat-form-field[.//mat-label[normalize-space()='Correlativo']]//input"
                )
                    .filter(":visible:not([disabled])")
                    .first()
                    .scrollIntoView()
                    .should("be.visible")
                    .type(config.correlativo, {force: true});
            }

            if (config.tieneProductos.toLowerCase() == "si" && config.productos) {
                cy.xpath(
                    "//mat-form-field[.//mat-label[normalize-space()='Productos']]//mat-select"
                )
                    .filter(":visible:not([disabled])")
                    .first()
                    .scrollIntoView()
                    .should("be.visible")
                    .click({force: true});

                cy.xpath("//input[@placeholder='Buscar']").type(`${config.productos}`, {
                    force: true,
                });
                cy.get(".mat-mdc-option:not(.mdc-list-item--disabled)")
                    .first()
                    .click({force: true});
            }

            //✔ Guardar
            cy.xpath(
                "//button[@mat-mini-fab and @color='primary'][.//mat-icon[text()='check']]"
            )
                .filter(":visible:not([disabled])")
                .first()
                .scrollIntoView()
                .should("be.visible")
                .click({force: true});

            cy.get(".mdc-circular-progress", {timeout: 40000}).should("not.exist");
        });
    }

    //SELECCION TIPOS DE CAJERO
    tiposCajero(config = {}) {
        cy.get("iframe.frame", {timeout: 10000})
            .should("be.visible")
            .invoke("css", "pointer-events", "auto")
            .its("0.contentDocument.body")
            .should("not.be.empty")
            .then(cy.wrap)
            .within(() => {
                // 1️⃣ Click TAB Tipos de Cajero
                cy.xpath(
                    "//div[@role='tab' and .//mat-icon[normalize-space()='how_to_reg']]"
                )
                    .should("be.visible")
                    .click({force: true});

                // Esperar tabla
                cy.xpath("//table[contains(@class,'mat-mdc-table')]").should(
                    "be.visible"
                );

                // 2️⃣ Seleccionar TODOS
                if (config.todosCajero?.toLowerCase() === "si") {
                    cy.xpath("//thead//mat-checkbox//input[@type='checkbox']").check({
                        force: true,
                    });
                }
                // 3️⃣ Selección individual por texto (SIN iterar filas)
                else if (Array.isArray(config.tiposCajero)) {
                    config.tiposCajero.forEach((tipo) => {
                        const texto = tipo.trim();

                        cy.xpath(
                            `
            //tbody//tr[
              td[contains(@class,'mat-column-description')
              and normalize-space(translate(.,
              'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÑ',
              'abcdefghijklmnopqrstuvwxyzáéíóúñ'
              )) =
              '${texto.toLowerCase()}']
            ]//mat-checkbox//input[@type='checkbox']
          `
                        )
                            .scrollIntoView()
                            .should("exist")
                            .check({force: true});
                    });
                }

                // 4️⃣ Guardar
                cy.xpath(
                    "//button[contains(@class,'save-button') and .//mat-icon[normalize-space()='save']]"
                )
                    .scrollIntoView()
                    .should("be.visible")
                    .and("not.be.disabled")
                    .click({force: true});
            });
    }

    //TOTALES A AFECTAR
    totalesAfectar(
        tieneTotalAfectar,
        typeFormaAfectarTotales,
        typeMetodoAsignacionMoneda,
        typeMondeatipoTrx,
        typeCorrelativoMoneda
    ) {
        cy.get("iframe.frame", {timeout: 10000})
            .should("be.visible")
            .invoke("css", "pointer-events", "auto")
            .its("0.contentDocument.body")
            .should("not.be.empty")
            .then(cy.wrap)
            .within(() => {
                if (tieneTotalAfectar.toLowerCase() == "si") {
                    cy.xpath(
                        "//mat-expansion-panel-header[.//mat-panel-title//h2[contains(text(), 'Totales a Afectar')]]"
                    )
                        .filter(":visible:not([disabled])")
                        .first()
                        .scrollIntoView()
                        .should("be.visible")
                        .click({force: true});
                    cy.xpath(
                        "//mat-form-field[.//mat-label[normalize-space()='Forma afectar totales']]//mat-select"
                    ).click({force: true});
                    cy.xpath("//input[@placeholder='Buscar']").type(
                        typeFormaAfectarTotales,
                        {
                            force: true,
                        }
                    );
                    cy.get(".mat-mdc-option:not(.mdc-list-item--disabled)", {
                        timeout: 10000,
                    })
                        .should("be.visible")
                        .first()
                        .click({force: true});
                    cy.xpath(
                        "//mat-form-field[.//mat-label[normalize-space()='Método asignación de moneda']]//mat-select"
                    )

                        .filter(":visible:not([disabled])")
                        .first()
                        .scrollIntoView()
                        .should("be.visible")
                        .click({force: true});
                    cy.xpath("//input[@placeholder='Buscar']").type(
                        typeMetodoAsignacionMoneda,
                        {force: true}
                    );
                    cy.get(".mat-mdc-option:not(.mdc-list-item--disabled)", {
                        timeout: 10000,
                    })
                        .should("be.visible")
                        .first()
                        .click({force: true});

                    if (typeMetodoAsignacionMoneda.toLowerCase == "transacción") {
                        cy.xpath(
                            "//mat-form-field[.//mat-label[normalize-space()='Moneda']]//mat-select"
                        )
                            .filter(":visible:not([disabled])")
                            .first()
                            .scrollIntoView()
                            .should("be.visible")
                            .click({force: true});
                        cy.xpath("//input[@placeholder='Buscar']").type(typeMondeatipoTrx, {
                            force: true,
                        });
                        cy.get(".mat-mdc-option:not(.mdc-list-item--disabled)", {
                            timeout: 10000,
                        })
                            .should("be.visible")
                            .first()
                            .click({force: true});
                    }

                    if (typeMetodoAsignacionMoneda.toLowerCase == "Campo") {
                        cy.xpath(
                            "//mat-form-field[.//mat-label[normalize-space()='Correlativo de moneda']]//mat-select"
                        )
                            .filter(":visible:not([disabled])")
                            .first()
                            .scrollIntoView()
                            .should("be.visible")
                            .click({force: true});
                        cy.xpath("//input[@placeholder='Buscar']").type(
                            typeCorrelativoMoneda,
                            {
                                force: true,
                            }
                        );
                        cy.get(".mat-mdc-option:not(.mdc-list-item--disabled)", {
                            timeout: 10000,
                        })
                            .should("be.visible")
                            .first()
                            .click({force: true});
                    }

                    cy.xpath(
                        "//button[contains(@class, 'mat-mdc-mini-fab') and @color='accent' and .//mat-icon[text()='save']]"
                    )
                        .filter(":visible:not([disabled])")
                        .first()
                        .scrollIntoView()
                        .should("be.visible")
                        .click({force: true});
                } else {
                    cy.log("no tiene totales a afectar");
                }
            });
    }

    //DRAG AND DRIOP PARA TOTALES A AFECTAR
    arrastrarYConfigurarCaracteristicaTCA(config) {
        const self = this;

        cy.get("iframe.frame", {timeout: 15000})
            .should("be.visible")
            .its("0.contentDocument.body")
            .should("not.be.empty")
            .then(cy.wrap)
            .within(() => {
                console.log("=== INICIANDO DRAG AND DROP PARA:", config.nombre);

                // ===========================
                // 1. DEPURAR: VER QUÉ HAY ANTES DE ARRASTRAR
                // ===========================
                console.log("=== DEPURACIÓN PRE-DRAG ===");
                console.log("Buscando característica origen:", config.nombre);

                cy.get("div.content-characteristics .cdk-drag", {
                    timeout: 10000,
                }).then(($caracteristicas) => {
                    console.log(
                        "Total de características encontradas:",
                        $caracteristicas.length
                    );
                    $caracteristicas.each((i, el) => {
                        const $el = Cypress.$(el);
                        const titulo = $el.find("mat-card-title").text().trim();
                        console.log(`Característica ${i + 1}: "${titulo}"`);
                    });
                });

                // ===========================
                // 2. ENCONTRAR LA CARACTERÍSTICA ESPECÍFICA
                // ===========================
                cy.get("div.content-characteristics .cdk-drag")
                    .contains("mat-card-title", config.nombre)
                    .should("be.visible")
                    .then(($titulo) => {
                        console.log("✅ Título encontrado:", $titulo.text());

                        return $titulo.parents(".cdk-drag");
                    })
                    .then(($dragElement) => {
                        console.log("✅ Elemento arrastrable encontrado");
                        console.log("HTML del elemento:", $dragElement[0].outerHTML);

                        // Tomar screenshot del elemento
                        cy.screenshot(
                            `caracteristica-origen-${config.nombre.replace(/\s+/g, "-")}`
                        );

                        // ===========================
                        // 3. REALIZAR EL DRAG AND DROP
                        // ===========================
                        cy.wrap($dragElement)
                            .realMouseDown({button: "left", position: "center"})
                            .then(() => {
                                console.log("✅ Mouse down realizado");
                                return cy.wrap($dragElement);
                            })
                            .realMouseMove(0, 10, {position: "center"})
                            .wait(500);

                        // ===========================
                        // 4. MOVER AL DESTINO Y SOLTAR
                        // ===========================
                        cy.get("div.cdk-drop-list#characteristicsTCA")
                            .should("exist")
                            .then(($dropZone) => {
                                console.log("✅ Zona de destino encontrada");
                                console.log("Clases del drop zone:", $dropZone.attr("class"));
                                console.log(
                                    "Contenido INICIAL del drop zone:",
                                    $dropZone.html()
                                );

                                return cy.wrap($dropZone);
                            })
                            .realMouseMove(0, 0, {position: "center"})
                            .realMouseUp();

                        console.log("✅ Drag and drop completado");
                        cy.wait(2000); // Esperar más tiempo para animaciones

                        // ===========================
                        // 5. AHORA SÍ ABRIR Y CONFIGURAR LA CARACTERÍSTICA
                        // ===========================

                        // Primero, hacer clic en el botón de editar (ícono de lápiz)
                        // Buscar el botón dentro del drop zone

                        cy.wait(1000); // Esperar a que se abra el diálogo/modal

                        // Ahora llamar a configurarCaracteristicaTCA
                        self.configurarCaracteristicaTCA(config);
                    });
            });
    }

    // MANTÉN TU configurarCaracteristicaTCA IGUAL
    configurarCaracteristicaTCA(config) {
        // Ya estamos dentro del iframe

        // 🌳 Árbol raíz
        if (config.arbolRaiz) {
            cy.xpath(
                "//mat-form-field[.//mat-label[normalize-space()='Árbol Raíz']]//mat-select"
            )
                .filter(":visible:not([disabled])")
                .first()
                .scrollIntoView()
                .click({force: true});

            cy.xpath("//input[@placeholder='Buscar']").type(config.arbolRaiz, {
                force: true,
            });

            cy.get(".mat-mdc-option:not(.mdc-list-item--disabled)")
                .first()
                .click({force: true});
        }

        // 💰 Total de cajero
        if (config.totalCajero) {
            cy.xpath(
                "//mat-form-field[.//mat-label[normalize-space()='Total de Cajero']]//mat-select"
            )
                .filter(":visible:not([disabled])")
                .first()
                .scrollIntoView()
                .click({force: true});

            cy.xpath("//input[@placeholder='Buscar']").type(config.totalCajero, {
                force: true,
            });

            cy.get(".mat-mdc-option:not(.mdc-list-item--disabled)")
                .first()
                .click({force: true});
        }

        // ➕➖ Operación
        if (config.operacion) {
            cy.xpath(
                `//mat-radio-group//input[@type='radio' and @value='${config.operacion.trim()}']`
            )
                .should("exist")
                .check({force: true});
        }

        // 💾 Guardar
        cy.xpath("//button[contains(@class, 'add-button') and @color='accent']")
            .filter(":visible:not([disabled])")
            .first()
            .scrollIntoView()
            .should("be.visible")
            .click({force: true});

        // Esperar a que se cierre el diálogo/modal
        cy.wait(3000);
    }

//Fin Gestor de transacciones
}
export default GestorPomCy;