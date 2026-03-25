class TransaccionesCy {

//Inicio Control de requerimiento
    ControlRequerimiento(nombre, valorTipo) {

        cy.get("#entityName").should("be.visible").clear().type(nombre)

        if (valorTipo) {

            cy.get('mat-select', {timeout: 10000})
                .filter(':visible')
                .first()
                .then($select => {

                    const valorActual = $select
                        .find('.mat-select-min-line')
                        .text()
                        .trim();

                    // 🔁 Solo cambiar si es distinto
                    if (valorActual !== valorTipo) {
                        cy.wrap($select).should("not.be.disabled").click({force: true});

                        cy.get(".cdk-overlay-pane", {timeout: 10000})
                            .find(".mat-option-text")
                            .contains(valorTipo)
                            .should("be.visible")
                            .click();
                    }
                });
        }
    }

//Fin Control de requerimiento

    // Inicio Campos de transacción
    CamposTransaccion(
        codigo,
        nombre,
        etiqueta,
        tieneDescripcion,
        descipcionTrx,
        tieneDatosSensibles,
        Tipo,
        typeListaValores,
        typeEstado,
        validoDesde,
        validoHasta
    ) {
        cy.log("Entrando a la creacion de campos de transaccion");
        cy.xpath("//button[.//mat-icon[normalize-space()='add']]", {
            timeout: 12000,
        }).click({force: true});
        cy.get(".mdc-circular-progress", {timeout: 40000}).should("not.exist");
        cy.xpath("//input[@matinput and @data-placeholder='Código']").type(
            codigo,
            {force: true}
        );
        cy.xpath("//input[@matinput and @data-placeholder='Nombre']").type(
            nombre,
            {force: true}
        );
        cy.xpath("//input[@matinput and @data-placeholder='Etiqueta']").type(
            etiqueta,
            {force: true}
        );
        if (tieneDescripcion.toLowerCase() == "si") {
            cy.xpath(
                "//textarea[@matinput and @data-placeholder='Descripción']"
            ).type(descipcionTrx, {force: true});
        }

        if (tieneDatosSensibles.toLowerCase() == "si") {
            cy.xpath(
                "//mat-checkbox//span[contains(@class,'mat-checkbox-label')]   [contains(normalize-space(.),'Datos sensibles')]   /ancestor::mat-checkbox   //input[@type='checkbox']"
            ).check({force: true});
        }
        cy.xpath("//mat-form-field[.//mat-label[normalize-space()='Tipo']]//mat-select").click({forcce: true})
        cy.xpath(
            `//mat-option//span[contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),translate('${Tipo}','ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'))]`
        ).click({force: true});
        //llenar los demas campos que no son obligatorios.

//
        cy.xpath("//mat-form-field[.//mat-label[normalize-space()='Lista de Valores']]//mat-select").click({force: true})
        cy.xpath(
            `//mat-option//span[contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),translate('${typeListaValores}','ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'))]`
        ).click({force: true});

        cy.xpath("//mat-form-field[.//mat-label[normalize-space()='Estado']]//mat-select").click({force: true})
        cy.xpath(
            `//mat-option//span[contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),translate('${typeEstado}','ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'))]`
        ).click({force: true});
        cy.xpath(
            "//mat-form-field   [.//label//span[normalize-space()='Válido Desde']]   //button[@aria-label='Open calendar']"
        ).click({force: true});
        cy.selectMatDate(validoDesde);
        if (validoHasta && validoHasta.trim()) {
            // 1️⃣ Abrir calendario SOLO si hay fecha
            cy.xpath(
                "//mat-form-field   [.//label//span[normalize-space()='Válido Hasta']]   //button[@aria-label='Open calendar']"
            ).click({
                force: true,
            });

            cy.selectMatDate(validoHasta);
        }
        cy.wait(1500);
        cy.xpath("//button[.//span[normalize-space(text())='Aceptar']]").click({
            force: true,
        });

    }

    buscarCamposTransaccion(buscaPor, elementoBuscar) {
        cy.log("Buscar por:")
        cy.xpath("//button[.//span[normalize-space()='Buscar por']]").click({force: true})
        cy.xpath(`//button[@mat-menu-item and   contains(     translate(normalize-space(.),       'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),translate('${buscaPor}','ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz') ) ]`).click({force: true})
        cy.xpath("//input[@type='text' and @id='code']")
            .type(elementoBuscar, {force: true})
            .type('{enter}', {force: true})
        cy.xpath("//tr[@mat-row]")
            .first()
            .click({force: true})
        cy.get(".mdc-circular-progress", {timeout: 40000}).should(
            "not.exist"
        );
    }

    eliminarCamposTransaccion() {

        const menuOpciones = "//ul//li[contains(@class,'mb-2')]";
        const filasTablaCss = "tr[mat-row]";
        const btnMenu = "//button[@mat-mini-fab and .//mat-icon[normalize-space()='menu_open']]";
        const btnDeleteFila = "//button[@mat-mini-fab and .//mat-icon[normalize-space()='delete']]";
        const btnConfirmarEliminar = "//button[@mat-flat-button and .//span[normalize-space()='Eliminar']]";
        const btnBack = "//mat-icon[contains(@class, 'material-icons') and text()='arrow_back']";
        const loader = ".mdc-circular-progress";

        // Abrir menú
        cy.xpath(btnMenu).click({force: true});

        // Entrar a Valores de Característica
        cy.xpath("//li[normalize-space()='Valores de Característica']")
            .click({force: true});

        // 🔥 Obtener cantidad de opciones UNA VEZ
        cy.xpath(menuOpciones).its('length').then(totalOpciones => {

            // 🔁 Iterar por índice
            Cypress._.times(totalOpciones, (index) => {

                // 👉 RE-CONSULTAR EL DOM
                cy.xpath(menuOpciones).eq(index).click({force: true});
                cy.wait(1500);

                // Validar si hay filas
                cy.get('body').then($body => {

                    const filas = $body.find(filasTablaCss);

                    if (filas.length > 0) {

                        cy.log(`Eliminando ${filas.length} registros`);

                        Cypress._.times(filas.length, () => {

                            cy.xpath("(//tr[@mat-row])[1]").click({force: true});
                            cy.xpath(btnDeleteFila).click({force: true});
                            cy.xpath(btnConfirmarEliminar).click({force: true});

                            cy.get(loader, {timeout: 40000})
                                .should("not.exist");
                        });

                    } else {
                        cy.log("No hay registros en esta opción");
                    }
                });

                // Última opción → regresar
                if (index === totalOpciones - 1) {
                    cy.wait(500)
                    cy.xpath(btnBack).click({force: true});
                }

            });
        });

        // 🔥 Eliminación final
        cy.wait(1500)
        cy.xpath(btnDeleteFila).click({force: true});
        cy.wait(500);
        cy.xpath(btnConfirmarEliminar).click({force: true});
        cy.get(loader, {timeout: 40000}).should("not.exist");
    }


    editarCamposTransaccionValoresCaracteristica(
        tieneValorCaracteristica,
        typeValor,
        esValorDefecto,
        typeDescrpitor,
    ) {

        cy.log("Entrando a valores de caracteristica")
        if (tieneValorCaracteristica.toLowerCase() == "si") {
            cy.xpath("//button[@mat-mini-fab and .//mat-icon[normalize-space()='menu_open']]").click({force: true})
            cy.xpath("//li[normalize-space()='Valores de Característica']").click({force: true})
            cy.get(".mdc-circular-progress", {timeout: 40000}).should(
                "not.exist"
            );
            cy.wait(500)
            cy.xpath(
                "//mat-icon[contains(@class, 'material-icons') and text()='add']"
            ).click({force: true});
            cy.xpath("//input[@matinput and @data-placeholder='Valor']").type(typeValor, {foce: true})
            if (esValorDefecto.toLowerCase() == "no") {
                cy.xpath("//mat-checkbox//span[contains(@class,'mat-checkbox-label')]   [contains(normalize-space(.),'Valor Defecto')]   /ancestor::mat-checkbox   //input[@type='checkbox']").check({force: true})
            }
            cy.xpath("//input[@matinput and @data-placeholder='Descriptor']").type(typeDescrpitor, {force: true})
            cy.xpath("//button[@mat-flat-button and .//span[normalize-space()='Aceptar']]").click({force: true})
            cy.get(".mdc-circular-progress", {timeout: 40000}).should(
                "not.exist"
            );
            cy.wait(1500)
            cy.xpath("//mat-icon[contains(@class, 'material-icons') and text()='arrow_back']").click({force: true})
            cy.get(".mdc-circular-progress", {timeout: 12000}).should(
                "not.exist"
            );
        }
    }

    editarMaximoPortipodeTransaccionyNivelDeCajero(
        tieneMaximoPorTipoTrxYNivelCajero,
        typeArbolRaiz,
        typeTipoTrx,
        typeNivelDeCajero,
        typeMontoMaximo,
        typeMontoGlobalValido,
    ) {
        cy.log("Entrando a Maximo por tipo de Transaccion y nivel cajero")
        if (tieneMaximoPorTipoTrxYNivelCajero.toLowerCase() == "si") {
            cy.xpath("//button[@mat-mini-fab and .//mat-icon[normalize-space()='menu_open']]").click({force: true})
            cy.xpath("//li[normalize-space()='Máximo por Tipo de Transacción y Nivel Cajero']").click({force: true})
            cy.get(".mdc-circular-progress", {timeout: 40000}).should(
                "not.exist"
            );
            cy.wait(500)
            cy.xpath(
                "//mat-icon[contains(@class, 'material-icons') and text()='add']"
            ).click({force: true});

            cy.xpath("//mat-form-field[.//mat-label[normalize-space()='Árbol Raíz']]//mat-select").click({force: true})
            cy.xpath(`//mat-option//span[contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),translate('${typeArbolRaiz}','ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'))]`).click({force: true});
            cy.xpath("//mat-form-field[.//mat-label[normalize-space()='Tipo de Transacción']]//mat-select").click({force: true})
            cy.xpath(`//mat-option//span[contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),translate('${typeTipoTrx}','ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'))]`).click({force: true});
            cy.xpath("//mat-form-field[.//mat-label[normalize-space()='Nivel de Cajero']]//mat-select").click({force: true})
            cy.wait(300)
            cy.xpath(`//mat-option//span[contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),translate('${typeNivelDeCajero}','ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'))]`).click({force: true});
            cy.xpath("//input[@matinput and @data-placeholder='Monto máximo']").type(typeMontoMaximo, {force: true})
            cy.xpath("//mat-form-field[.//mat-label[normalize-space()='Monto global Válido']]//mat-select").click({fore: true})
            cy.xpath(`//mat-option//span[contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),translate('${typeMontoGlobalValido}','ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'))]`).click({force: true});


            cy.xpath("//button[@mat-flat-button and .//span[normalize-space()='Aceptar']]").click({force: true})
            cy.get(".mdc-circular-progress", {timeout: 40000}).should(
                "not.exist"
            );
            cy.wait(1500)
            cy.xpath("//mat-icon[contains(@class, 'material-icons') and text()='arrow_back']").click({force: true})
            cy.get(".mdc-circular-progress", {timeout: 12000}).should(
                "not.exist"
            );
        }

    }

    editarMaximoPorTipoDeTransaccionyTipoDeRama(
        tieneMaximoPorTipoTrxYTipoDeRama,
        typeTitpoTrx,
        typeTipoRama,
        typeMontoMaximo,
        typeMontoGlobalValido,
    ) {
        cy.log("Entrando a Maximo por tipo de Transaccion y nivel cajero")
        if (tieneMaximoPorTipoTrxYTipoDeRama.toLowerCase() == "si") {
            cy.xpath("//button[@mat-mini-fab and .//mat-icon[normalize-space()='menu_open']]").click({force: true})
            cy.xpath("//li[normalize-space()='Máximo por Tipo de Transacción y Tipo de Rama']").click({force: true})
            cy.get(".mdc-circular-progress", {timeout: 40000}).should(
                "not.exist"
            );
            cy.wait(500)
            cy.xpath(
                "//mat-icon[contains(@class, 'material-icons') and text()='add']"
            ).click({force: true});

            cy.xpath("//mat-form-field[.//mat-label[normalize-space()='Tipo de Transacción']]//mat-select").click({force: true})
            cy.xpath(`//mat-option//span[contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),translate('${typeTitpoTrx}','ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'))]`).click({force: true});
            cy.xpath("//mat-form-field[.//mat-label[normalize-space()='Tipo de Rama']]//mat-select").click({force: true})
            cy.xpath(`//mat-option//span[contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),translate('${typeTipoRama}','ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'))]`).click({force: true});
            cy.xpath("//input[@matinput and @data-placeholder='Monto Máximo']").type(typeMontoMaximo, {force: true})
            cy.xpath("//mat-form-field[.//mat-label[normalize-space()='Monto Global Válido']]//mat-select").click({fore: true})
            cy.xpath(`//mat-option//span[contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),translate('${typeMontoGlobalValido}','ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'))]`).click({force: true});


            cy.xpath("//button[@mat-flat-button and .//span[normalize-space()='Aceptar']]").click({force: true})
            cy.get(".mdc-circular-progress", {timeout: 40000}).should(
                "not.exist"
            );
            cy.wait(1500)
            cy.xpath("//mat-icon[contains(@class, 'material-icons') and text()='arrow_back']").click({force: true})
            cy.get(".mdc-circular-progress", {timeout: 12000}).should(
                "not.exist"
            );
        }

    }

    editarSubCaracteristica(
        tieneSubCaracteristica,
        correlativo,
        typeSubcaracteristica,
    ) {
        cy.log("Entrando a Subcaracteristica")
        if (tieneSubCaracteristica.toLowerCase() == "si") {
            cy.xpath("//button[@mat-mini-fab and .//mat-icon[normalize-space()='menu_open']]").click({force: true})
            cy.xpath("//li[normalize-space()='Sub Características']").click({force: true})
            cy.get(".mdc-circular-progress", {timeout: 40000}).should(
                "not.exist"
            );
            cy.wait(500)
            cy.xpath(
                "//mat-icon[contains(@class, 'material-icons') and text()='add']"
            ).click({force: true});
            cy.xpath("//input[@matinput and @data-placeholder='Correlativo']").type(correlativo, {force: true})


            cy.xpath("//mat-form-field[.//mat-label[normalize-space()='Sub-característica']]//mat-select").click({force: true})
            cy.xpath(`//mat-option//span[contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),translate('${typeSubcaracteristica}','ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'))]`).click({force: true});


            cy.xpath("//button[@mat-flat-button and .//span[normalize-space()='Aceptar']]").click({force: true})
            cy.get(".mdc-circular-progress", {timeout: 40000}).should(
                "not.exist"
            );
            cy.wait(1500)
            cy.xpath("//mat-icon[contains(@class, 'material-icons') and text()='arrow_back']").click({force: true})
            cy.get(".mdc-circular-progress", {timeout: 12000}).should(
                "not.exist"
            );
        }

    }


    //Fin Campos de transaccion


//Inicio Indicador
    Indicador(codigo, nombre, descripcion) {
        cy.get("#code").should("be.visible").clear().type(codigo);
        cy.get("#name").should("be.visible").clear().type(nombre);
        cy.get("#description").should("be.visible").clear().type(descripcion);
    }

//Fin Indicador

//Inicio Codigo de barras
    CodigoBarras(codigo, nombre, logitud, descripciion) {
        cy.get("#code").should("be.visible").clear().type(codigo);
        cy.get("#name").should("be.visible").clear().type(nombre);
        cy.get("#barcodeLength").should("be.visible").clear().type(logitud);
        cy.get("#description").should("be.visible").clear().type(descripciion);
    }

    //Fin Codigo de barras

    //Inicio subnivel detalle
    SubnivelDetalle(correlativo, posicInicial, longitud, valorTipoDato, descripcion) {
        cy.get("#correlative").should("be.visible").clear().type(correlativo);
        cy.get("#initialPosition").should("be.visible").clear().type(posicInicial);
        cy.get("#length").should("be.visible").clear().type(longitud);

        if (valorTipoDato) {

            cy.get('mat-select', {timeout: 10000})
                .filter(':visible')
                .first()
                .then($select => {

                    const valorActual = $select
                        .find('.mat-select-min-line')
                        .text()
                        .trim();

                    // 🔁 Solo cambiar si es distinto
                    if (valorActual !== valorTipoDato) {

                        cy.wrap($select)
                            .should('not.be.disabled')
                            .click({force: true});

                        cy.get('.cdk-overlay-pane', {timeout: 10000})
                            .find('.mat-option-text')
                            .contains(valorTipoDato)
                            .should('be.visible')
                            .click();
                    }
                });
        }

        cy.get("#description").should("be.visible").clear().type(descripcion)


    }

//Fin subnivel detalle


//Formatos
    Formato(codigo, nombre, nombreAbreviado, descripcion, plantilla, extencion, valorDtosTachados, valorIncluirImagen, posicion, tamanioImagen,
            valaroParaCatalogos, codigoPlantillAlternativa, poscEtiquetaComprobante, poscEtiquetaReimprimi) {

        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#shortName").should("be.visible").clear().type(nombreAbreviado)
        cy.get("#description").should("be.visible").clear().type(descripcion)
        cy.get("#templateId").should("be.visible").clear().type(plantilla)
        cy.get("#extension").should("be.visible").clear().type(extencion)

        this.seleccionarComboF(valorDtosTachados, 0);
        this.seleccionarComboF(valorIncluirImagen, 1);
        this.seleccionarComboF(valaroParaCatalogos, 2);

        cy.get("#position").should("be.visible").clear().type(posicion)
        cy.get("#imageSize").should("be.visible").clear().type(tamanioImagen)

        cy.get("#alternateTemplateCode").should("be.visible").clear().type(codigoPlantillAlternativa)
        cy.get("#labelPosition").should("be.visible").clear().type(poscEtiquetaComprobante)
        cy.get("#labelPositionReprint").should("be.visible").clear().type(poscEtiquetaReimprimi)


    }

    seleccionarComboF(valor, controlName) {

        if (!valor) return;

        cy.get('body').then($body => {

            // 🔍 Validar si el mat-select existe
            if ($body.find(`mat-select[formcontrolname="${controlName}"]`).length === 0) {
                cy.log(`⚠️ Combo no existe: ${controlName}`);
                return;
            }

            cy.get(`mat-select[formcontrolname="${controlName}"]`)
                .then($select => {

                    cy.wrap($select).click({force: true});

                    // 🔍 Validar si la opción existe
                    cy.get('body').then($body2 => {
                        if ($body2.find('.cdk-overlay-pane .mat-option-text')
                            .filter(`:contains("${valor}")`).length === 0) {

                            cy.log(`⚠️ Opción no encontrada: ${valor}`);
                            return;
                        }

                        cy.get('.cdk-overlay-pane')
                            .contains('.mat-option-text', valor)
                            .click();
                    });
                });
        });
    }

    DetalleFormato(correlativo, descripcion, valorTipoDatos, leerPosInicial, leerTamDatos, imprimirFila, imprimirTamDatos) {

        cy.get("#correlative").should("be.visible").clear().type(correlativo)
        cy.get("#description").should("be.visible").clear().type(descripcion)

        if (valorTipoDatos) {

            cy.get('mat-select', {timeout: 10000})
                .filter(':visible')
                .first()
                .then($select => {

                    const valorActual = $select
                        .find('.mat-select-min-line')
                        .text()
                        .trim();

                    // 🔁 Solo cambiar si es distinto
                    if (valorActual !== valorTipoDatos) {

                        cy.wrap($select)
                            .should('not.be.disabled')
                            .click({force: true});

                        cy.get('.cdk-overlay-pane', {timeout: 10000})
                            .find('.mat-option-text')
                            .contains(valorTipoDatos)
                            .should('be.visible')
                            .click();
                    }
                });
        }

        cy.get("#readInitPosition").should("be.visible").clear().type(leerPosInicial)
        cy.get("#readLenData").should("be.visible").clear().type(leerTamDatos)
        cy.get("#printInRow").should("be.visible").clear().type(imprimirFila)
        cy.get("#printLenData").should("be.visible").clear().type(imprimirTamDatos)

    }

//Fin Formato

//Rutinas
    Rutinas(codigo, nombre, nombreRecurso, endpointRutinaRutaComponenteAngular, tipoRutina, capaEjecucion, descripcion, parametros, tipoOperacion, esLogin, formatoEnvio,
        formatoRecibido, expresion1, operacion, expresion2, tipoExpresion, endpointRutinaSecundario, enviarListaRecursos, ofline, online, noGuardarLOG) {

        const campos = [
            {selector: '#code', valor: codigo},
            {selector: '#name', valor: nombre},
            {selector: '#resourceName', valor: nombreRecurso},
            {selector: 'textarea#beanRoutine', valor: endpointRutinaRutaComponenteAngular},
            {selector: 'textarea#description', valor: descripcion},
            {selector: 'textarea#parameters', valor: parametros},
            {selector: '#expression1', valor: expresion1},
            {selector: '#expression2', valor: expresion2},
            {selector: 'textarea#secondaryEndpoint', valor: endpointRutinaSecundario}
        ];

        campos.forEach(({selector, valor}) => {

            if (valor === undefined || valor === null || valor === '') {
                cy.log(`Campo omitido: ${selector}`);
                return;
            }

            cy.get('body').then($body => {

                if ($body.find(selector).length > 0) {

                    cy.get(selector)
                        .scrollIntoView({block: 'center'})
                        .clear({force: true})
                        .type(valor, {force: true});

                } else {
                    cy.log(`Campo no presente aún: ${selector}`);
                }
            });
        });

        this.seleccionarCombo(tipoRutina, "Tipo de rutina");
        this.seleccionarCombo(capaEjecucion, "Capa de Ejecución");
        this.seleccionarCombo(tipoOperacion, "Tipo de operación");
        this.seleccionarCombo(esLogin, "Es Login");
        this.seleccionarCombo(formatoEnvio, "Formato de envío");
        this.seleccionarCombo(formatoRecibido, "Formato de recibido");
        this.seleccionarCombo(operacion, "Operación");
        this.seleccionarCombo(tipoExpresion, "Tipo de Expresión");

        this.checkBoxWOS(enviarListaRecursos, "Enviar lista de recursos");
        this.checkBoxWOS(ofline, "Offline");
        this.checkBoxWOS(online, "Online");
        this.checkBoxWOS(noGuardarLOG, "No guardar LOG");
    }


//Totales de cajero
    TotalesCajero(codigo, arbolRaiz, nombre, nombreCorto, descripcion, validaMontos, minimoRequiereAutorizacion, maximoRequiereAutorizacion, correlativoImpreso, enviarHost,
                  cicloVida, validoDesde, validoHasta, totalMonitoreado, rutinaCalculamontoConciliar, rutinacalculaMontoConciliado, esControlEfectivo){

        const campos = [
            {selector: '#code', valor: codigo},
            {selector: '#name', valor: nombre},
            {selector: '#shortName', valor: nombreCorto},
            {selector: 'textarea#description', valor: descripcion},
            {selector: '#correlativePrint', valor: correlativoImpreso},
        ];

        campos.forEach(({selector, valor}) => {

            // 🔒 Validación PRO (igual que la usas en todo el proyecto)
            if (valor === undefined || valor === null || valor === '') {
                cy.log(`Campo omitido: ${selector}`);
                return;
            }

            cy.get('body').then($body => {

                // 🔎 Verificar existencia en DOM
                if ($body.find(selector).length > 0) {

                    cy.get(selector)
                        .scrollIntoView({block: 'center'})
                        .clear({force: true})
                        .type(valor, {force: true});

                } else {
                    cy.log(`Campo no presente aún: ${selector}`);
                }
            });
        });

        // 🔽 Combos (se mantienen igual)
        this.seleccionarComboTC(arbolRaiz, "Árbol Raíz");
        this.seleccionarComboTC(cicloVida, "Ciclo de vida");
        this.seleccionarComboTC(rutinaCalculamontoConciliar, "Rutina calcula monto por Conciliar");
        this.seleccionarComboTC(rutinacalculaMontoConciliado, "Rutina calcula monto Conciliado");
        this.seleccionarComboTC(esControlEfectivo, "Es control de efectivo");

        this.seleccionarFecha('#validFrom', validoDesde);
        this.seleccionarFecha('#validTo', validoHasta);

        // ☑️ Checkboxes
        this.checkBoxWOS(validaMontos, "Valida Montos");
        this.checkBoxWOS(minimoRequiereAutorizacion, "Mínimo Requiere Autorización");
        this.checkBoxWOS(maximoRequiereAutorizacion, "Máximo Requiere Autorización");
        this.checkBoxWOS(enviarHost, "Enviar Host");
        this.checkBoxWOS(totalMonitoreado, "Total es monitoreado");
    }


    TotalesCuadra(TipoCajero){

        if (TipoCajero) {

            cy.get('mat-select', { timeout: 10000 })
                .filter(':visible')
                .first()
                .then($select => {

                    const valorActual = $select
                        .find('.mat-select-min-line')
                        .text()
                        .trim();

                    // 🔁 Solo cambiar si es distinto
                    if (valorActual !== TipoCajero) {

                        cy.wrap($select)
                            .should('not.be.disabled')
                            .click({ force: true });

                        cy.get('.cdk-overlay-pane', { timeout: 10000 })
                            .find('.mat-option-text')
                            .contains(TipoCajero)
                            .should('be.visible')
                            .click();
                    }
                });
        }

    }

    ValidacionesCierreDia(codigo, nivelCajero, tolerancia, valorQueDeberiaCerrar, valorGlobalConstante, moneda){


        cy.get("#code").should("be.visible").clear().type(codigo)

        // 🔽 Combos (se mantienen igual)
        this.seleccionarComboTC(nivelCajero, "Nivel de cajero");

        cy.get("#tolerance").should("be.visible").clear().type(tolerancia)
        cy.get("#constant").should("be.visible").clear().type(valorQueDeberiaCerrar)

        this.seleccionarCombo(valorGlobalConstante, "Valor Global Constante");
        this.seleccionarCombo(moneda, "Moneda");


    }

    MinimosMaximos(tipoRama, tipoCajero, moneda, minimoCajero, maximoCajero, minimoTipoRama, maximoTipoRama){

        // 🔽 Combos (se mantienen igual)
        this.seleccionarCombo(tipoRama, "Tipo de Rama");
        this.seleccionarCombo(tipoCajero, "Tipo de cajero");
        this.seleccionarCombo(moneda, "Moneda");

        const campos = [
            {selector: '#minPerCashier', valor: minimoCajero},
            {selector: '#maxPerCashier', valor: maximoCajero},
            {selector: '#minPerTypeTreebranch', valor: minimoTipoRama},
            {selector: '#maxPerTypeTreebranch', valor: maximoTipoRama},
        ];

        campos.forEach(({selector, valor}) => {

            // 🔒 Validación PRO (igual que la usas en todo el proyecto)
            if (valor === undefined || valor === null || valor === '') {
                cy.log(`Campo omitido: ${selector}`);
                return;
            }

            cy.get('body').then($body => {

                // 🔎 Verificar existencia en DOM
                if ($body.find(selector).length > 0) {

                    cy.get(selector)
                        .scrollIntoView({block: 'center'})
                        .clear({force: true})
                        .type(valor, {force: true});

                } else {
                    cy.log(`Campo no presente aún: ${selector}`);
                }
            });
        });


    }

//Inicio de tabla
    Tabla(codigo, nombre, valorTipo) {
        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)

        if (valorTipo) {

            cy.get('mat-select', {timeout: 10000})
                .filter(':visible')
                .first()
                .then($select => {

                    const valorActual = $select
                        .find('.mat-select-min-line')
                        .text()
                        .trim();

                    // 🔁 Solo cambiar si es distinto
                    if (valorActual !== valorTipo) {

                        cy.wrap($select)
                            .should('not.be.disabled')
                            .click({force: true});

                        cy.get('.cdk-overlay-pane', {timeout: 10000})
                            .find('.mat-option-text')
                            .contains(valorTipo)
                            .should('be.visible')
                            .click();
                    }
                });
        }


    }

    DetalleTabla(valAlfanumerico, valNumerico) {
        cy.get("#alphanumericValue").should("be.visible").clear().type(valAlfanumerico)
        cy.get("#numericalValue").should("be.visible").clear().type(valNumerico)
    }

//Fin tabla

//Inicio Plantilla de Flujo
    PlantillaFlujo(nombre, descripcion, valorEstado) {
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)

        if (valorEstado) {

            cy.get('mat-select', {timeout: 10000})
                .filter(':visible')
                .first()
                .then($select => {

                    const valorActual = $select
                        .find('.mat-select-min-line')
                        .text()
                        .trim();

                    // 🔁 Solo cambiar si es distinto
                    if (valorActual !== valorEstado) {

                        cy.wrap($select)
                            .should('not.be.disabled')
                            .click({force: true});

                        cy.get('.cdk-overlay-pane', {timeout: 10000})
                            .find('.mat-option-text')
                            .contains(valorEstado)
                            .should('be.visible')
                            .click();
                    }
                });
        }

    }

    DetallePlantillaFlujo(correlativo, codigo, nombre, descripcion) {
        cy.get("#correlative").should("be.visible").clear().type(correlativo)
        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)
    }

//Fin Plantilla Flujo


    //Gestor de transacciones
    GestorTransacciones(
        codigoTrx,
        tipoTRX,
        codigoAlternativo,
        nombreTrx,
        etiquetaTrx,
        estadoTrx,
        validoDesde,
        validoHasta,
        tipoMovimientoBoveda,
        descripcionTrx,
        esconderMenu,
        permiteReversion,
        modoOffline,
        requiereSupervisor,
        requiereValidarAcceso,
        seEnvíaHost,
        tiempoEsperaSeEnviaHost,
        accionDemoraHost,
        tienepagoServicio,
        typePagoServicio,
        pasoConfirmacionServicio,
        permiteReimpresion,
        diasPermitidoReimpresion,
        presentarResumentrx,
        mensajeResumenTrx,
        tipoMensajeTrx,
        iconoDatosAdicionales,
        typeDepartamentodeAutorizacion,
        textoAyudaDatosAdcionales
    ) {
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

// Inicio Especificación de transacción

    EspecificacionTransaccion(
        tipoTrx,
        codigoTrx,
        tieneCodigoAlternativo,
        codigoAlternativoTrx,
        nombreTrx,
        etiqueaTrx,
        tieneDescripcion,
        descipcionTrx,
        tieneCodigoBarra,
        typeCodigoBarra,
        tieneModoOnline,
        seEnviaAlHost,
        requiereSupervisor,
        tieneDepartamentoDeAutorizacion,
        typeDepartamentodeAutorizacion,
        tieneTextoAyuda,
        typeTextoAyuda,
        typeEstado,
        validoDesde,
        validoHasta,
        esPagoDeServicio,
        metodoAsignacionMoneda,
        tieneCorrelativoMoneda,
        typeCorrelativoMoneda,
        typeFormaAfectarTotales,
        typeTipoMovimientoEnBoveda,
        tieneTiempoDeEspera,
        typeTiempoDeEspera,
        tieneIcono,
        typeIcono,
        permiteReimpresion,
        presentarResumentrx,
        tieneDiasPermitidosParaReimprimir,
        typeDiasPermitidosParaReimprimir,
        permiteReversion,
        tieneMensajeDespuesdelProceso,
        typeMensajeDespuesDelProceso,
        tieneTipodeMensaje,
        typeDeMensaje,
        tieneAccionPorDemora,
        typeAccionPorDemora,
        SeRequiereChequearAcceso,
        esconderElMenu
    ) {
        cy.log("Entrando a la creacion de una especificacion de una transaccion");
        cy.xpath("//button[.//mat-icon[normalize-space()='add']]", {
            timeout: 12000,
        }).click({force: true});
        cy.get(".mdc-circular-progress", {timeout: 40000}).should("not.exist");
        cy.xpath(
            "//mat-form-field[.//mat-label[normalize-space()='Tipo']]//mat-select"
        ).click({force: true});
        cy.xpath(
            `//mat-option//span[contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),translate('${tipoTrx}','ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'))]`
        ).click({force: true});
        cy.xpath("//input[@matinput and @data-placeholder='Código']").type(
            codigoTrx,
            {force: true}
        );

        if (tieneCodigoAlternativo.toLowerCase() == "si") {
            cy.xpath(
                "//input[@matinput and @data-placeholder='Código Alternativo']"
            ).type(codigoAlternativoTrx, {force: true});
        }
        cy.xpath("//input[@matinput and @data-placeholder='Nombre']").type(
            nombreTrx,
            {force: true}
        );
        cy.xpath("//input[@matinput and @data-placeholder='Etiqueta']").type(
            etiqueaTrx,
            {force: true}
        );

        if (tieneDescripcion.toLowerCase() == "si") {
            cy.xpath(
                "//textarea[@matinput and @data-placeholder='Descripción']"
            ).type(descipcionTrx, {force: true});
        }
        if (tieneCodigoBarra.toLowerCase() == "si") {
            cy.xpath(
                "//mat-form-field[.//mat-label[normalize-space()='Código de barra']]//mat-select"
            ).click({force: true});
            cy.wait(300);
            cy.xpath(
                `//mat-option//span[contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),translate('${typeCodigoBarra}','ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'))]`
            ).click({force: true});
        }
        if (tieneModoOnline.toLowerCase() == "si") {
            cy.xpath(
                "//mat-checkbox//span[contains(@class,'mat-checkbox-label')]   [contains(normalize-space(.),'Modo offline')]   /ancestor::mat-checkbox   //input[@type='checkbox']"
            ).check({force: true});
        }

        if (seEnviaAlHost.toLowerCase() == "si") {
            cy.xpath(
                "//mat-checkbox//span[contains(@class,'mat-checkbox-label')]   [contains(normalize-space(.),'Se envía al host')]   /ancestor::mat-checkbox   //input[@type='checkbox']"
            ).check({force: true});
        }
        if (requiereSupervisor.toLowerCase() == "si") {
            cy.xpath(
                "//mat-checkbox//span[contains(@class,'mat-checkbox-label')]   [contains(normalize-space(.),'Requiere Supervisor')]   /ancestor::mat-checkbox   //input[@type='checkbox']"
            ).check({force: true});
        }

        if (tieneDepartamentoDeAutorizacion.toLowerCase() == "si") {
            cy.xpath(
                "//mat-form-field[.//mat-label[normalize-space()='Departamento de Autorización']]//mat-select"
            ).click({force: true});
            cy.xpath(
                `//mat-option//span[contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),translate('${typeDepartamentodeAutorizacion}','ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'))]`
            ).click({force: true});
        }
        if (tieneTextoAyuda.toLowerCase() == "si") {
            cy.xpath(
                "//textarea[@matinput and @data-placeholder='Texto de ayuda']"
            ).type(typeTextoAyuda, {force: true});
        }

        cy.xpath(
            "//mat-form-field[.//mat-label[normalize-space()='Estado']]//mat-select"
        ).click({force: true});
        cy.xpath(
            `//mat-option//span[contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),translate('${typeEstado}','ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'))]`
        ).click({force: true});

        cy.xpath(
            "//mat-form-field   [.//label//span[normalize-space()='Válido Desde']]   //button[@aria-label='Open calendar']"
        ).click({force: true});
        cy.selectMatDate(validoDesde);

        if (validoHasta && validoHasta.trim()) {
            // 1️⃣ Abrir calendario SOLO si hay fecha
            cy.xpath(
                "//mat-form-field   [.//label//span[normalize-space()='Válido Hasta']]   //button[@aria-label='Open calendar']"
            ).click({
                force: true,
            });

            cy.selectMatDate(validoHasta);
        }

        if (esPagoDeServicio.toLowerCase() == "si") {
            cy.xpath(
                "//mat-checkbox//span[contains(@class,'mat-checkbox-label')]   [contains(normalize-space(.),' Es pago de Servicio')]   /ancestor::mat-checkbox   //input[@type='checkbox']"
            ).check({force: true});
        }

        cy.xpath(
            "//mat-form-field[.//mat-label[normalize-space()='Método Asignacion de Moneda']]//mat-select"
        ).click({force: true});
        cy.wait(300);
        cy.xpath(
            `//mat-option//span[contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),translate('${metodoAsignacionMoneda}','ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'))]`
        ).click({force: true});

        if (tieneCorrelativoMoneda.toLowerCase() == "si") {
            cy.xpath(
                "//input[@matinput and @data-placeholder='Correlativo de Moneda']"
            ).type(typeCorrelativoMoneda, {force: true});
        }

        cy.xpath(
            "//mat-form-field[.//mat-label[normalize-space()='Forma Afectar Totales']]//mat-select"
        ).click({force: true});
        cy.xpath(
            `//mat-option//span[contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),translate('${typeFormaAfectarTotales}','ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'))]`
        ).click({force: true});

        cy.xpath(
            "//mat-form-field[.//mat-label[normalize-space()='Tipo movimiento en bóveda']]//mat-select"
        ).click({force: true});
        cy.xpath(
            `//mat-option//span[contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),translate('${typeTipoMovimientoEnBoveda}','ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'))]`
        ).click({force: true});

        if (tieneTiempoDeEspera.toLowerCase() == "si") {
            cy.xpath(
                "//input[@matinput and @data-placeholder='Tiempo de Espera']"
            ).type(typeTiempoDeEspera, {force: true});
        }
        if (tieneIcono.toLowerCase() == "si") {
            cy.xpath("//input[@matinput and @data-placeholder='Ícono']").type(
                typeIcono,
                {force: true}
            );
        }

        if (permiteReimpresion.toLowerCase() == "si") {
            cy.xpath(
                "//mat-checkbox//span[contains(@class,'mat-checkbox-label')]   [contains(normalize-space(.),'Permite reimpresión')]   /ancestor::mat-checkbox   //input[@type='checkbox']"
            ).check({force: true});
        }
        if (presentarResumentrx.toLowerCase() == "si") {
            cy.xpath(
                "//mat-form-field[.//mat-label[normalize-space()='Presentar resumen de transacción']]//mat-select"
            ).click({force: true});
            cy.xpath(
                `//mat-option//span[contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),translate('sí','ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'))]`
            ).click({force: true});
        } else {
            cy.xpath(
                "//mat-form-field[.//mat-label[normalize-space()='Presentar resumen de transacción']]//mat-select"
            ).click({force: true});
            cy.xpath(
                `//mat-option//span[contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),translate('no','ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'))]`
            ).click({force: true});
        }

        if (tieneDiasPermitidosParaReimprimir.toLowerCase() == "si") {
            cy.xpath(
                "//input[@matinput and @data-placeholder='Dias permitidos para reimprimir']"
            ).type(typeDiasPermitidosParaReimprimir, {force: true});
        }

        if (permiteReversion.toLowerCase() == "si") {
            cy.xpath(
                "//mat-checkbox//span[contains(@class,'mat-checkbox-label')]   [contains(normalize-space(.),' Permite reversion')]   /ancestor::mat-checkbox   //input[@type='checkbox']"
            ).check({force: true});
        }

        if (tieneMensajeDespuesdelProceso.toLowerCase() == "si") {
            cy.xpath(
                "//textarea[@matinput and @data-placeholder='Mensaje despues del proceso']"
            ).type(typeMensajeDespuesDelProceso, {force: true});
        }

        if (tieneTipodeMensaje.toLowerCase() == "si") {
            cy.xpath(
                "//mat-form-field[.//mat-label[normalize-space()='Tipo de mensaje']]//mat-select"
            ).click({force: true});
            cy.xpath(
                `//mat-option//span[contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),translate('${typeDeMensaje}','ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'))]`
            ).click({force: true});
        }
        if (tieneAccionPorDemora.toLowerCase() == "si") {
            cy.xpath(
                "//mat-form-field[.//mat-label[normalize-space()='Acción por demora']]//mat-select"
            ).click({force: true});
            cy.xpath(
                `//mat-option//span[contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),translate('${typeAccionPorDemora}','ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'))]`
            ).click({force: true});
        }

        if (SeRequiereChequearAcceso.toLowerCase() == "si") {
            cy.xpath(
                "//mat-checkbox//span[contains(@class,'mat-checkbox-label')]   [contains(normalize-space(.),' Se requiere chequear acceso')]   /ancestor::mat-checkbox   //input[@type='checkbox']"
            ).check({force: true});
        }
        if (esconderElMenu.toLowerCase() == "si") {
            cy.xpath(
                "//mat-checkbox//span[contains(@class,'mat-checkbox-label')]   [contains(normalize-space(.),' Esconder en Menú')]   /ancestor::mat-checkbox   //input[@type='checkbox']"
            ).check({force: true});
        }

        cy.wait(1500);
        cy.xpath("//button[.//span[normalize-space(text())='Aceptar']]").click({
            force: true,
        });
    }

    Carateristicas(caracteristica, campoResultado, montoMaximo, valorTipoMovimientoInventarioEfectivo) {

        this.seleccionarCombo(caracteristica, "Característica");

        this.checkBoxWOS(campoResultado, "Campo de Resultado");

        const campos = [
            {selector: '#maxAmount', valor: montoMaximo},
        ];

        campos.forEach(({selector, valor}) => {
            if (valor !== undefined && valor !== null && valor !== '') {
                cy.get(selector)
                    .should('be.visible')
                    .clear()
                    .type(valor);
            }
        });

        this.seleccionarCombo(valorTipoMovimientoInventarioEfectivo, "Tipo de movimiento en inventario de efectivo");

    }

    TotalesAfectar(valorArbolRaiz, valorAfectar, valorOperacion, expresion1, valorOperacionExpresion, expresion2, valorTipoExpresion) {
        this.seleccionarCombo(valorArbolRaiz, "Árbol Raíz");
        this.seleccionarCombo(valorAfectar, "Afectar");
        this.seleccionarCombo(valorOperacion, "Operación");

        const campos = [
            {selector: '#expression1', valor: expresion1},
            {selector: '#expression2', valor: expresion2}
        ];


        this.seleccionarCombo(valorOperacionExpresion, "Característica");

        campos.forEach(({selector, valor}) => {
            if (valor !== undefined && valor !== null && valor !== '') {

                cy.get('body').then($body => {
                    // Si el campo existe en el DOM
                    if ($body.find(selector).length > 0) {
                        cy.get(selector)
                            .scrollIntoView({block: 'center'})
                            .should('be.visible')
                            .clear()
                            .type(valor);
                    } else {
                        cy.log(`Campo no presente aún: ${selector}`);
                    }
                });

            }
        });

        this.seleccionarCombo(valorTipoExpresion, "Tipo de Expresión");

    }

    CaracteristicasResultado(correlativo, valorCaracteristicaOperar, valorOperacion) {

        const campos = [
            {selector: '#correlative', valor: correlativo},
        ];

        campos.forEach(({selector, valor}) => {
            if (valor !== undefined && valor !== null && valor !== '') {
                cy.get(selector)
                    .should('be.visible')
                    .clear()
                    .type(valor);
            }
        });

        this.seleccionarCombo(valorCaracteristicaOperar, "Característica a operar");
        this.seleccionarCombo(valorOperacion, "Operación");

    }

    FlujoTransaccion(correlativo, codigo, nombre, descripcion, calculaCampos, valorReglaCondicionarPaso) {


        const campos = [
            {selector: '#correlative', valor: correlativo},
            {selector: '#code', valor: codigo},
            {selector: '#name', valor: nombre},
            {selector: '#description', valor: descripcion}
        ];


        this.checkBoxWOS(calculaCampos, "Calcula campos");

        campos.forEach(({selector, valor}) => {
            if (valor !== undefined && valor !== null && valor !== '') {

                cy.get('body').then($body => {
                    // Si el campo existe en el DOM
                    if ($body.find(selector).length > 0) {
                        cy.get(selector)
                            .scrollIntoView({block: 'center'})
                            .should('be.visible')
                            .clear()
                            .type(valor);
                    } else {
                        cy.log(`Campo no presente aún: ${selector}`);
                    }
                });

            }
        });

        this.seleccionarCombo(valorReglaCondicionarPaso, "Regla para condicionar paso");

    }

    RutinasFlujoTransaccion(tipoEjecucion, correlativo, requiereLogueo, rutinaLogueo, rutina, descripcion, cicloVida, fechaInicio, fechaFin, parametros) {

        this.seleccionarComboAC(tipoEjecucion, "Tipo de Ejecución");

        cy.get("#correlative").should("be.visible").clear().type(correlativo)

        this.seleccionarComboAC(requiereLogueo, "Requiere Logueo");
        this.seleccionarComboAC(rutinaLogueo, "Rutina de Logueo");
        this.seleccionarComboAC(rutina, "Rutina");

        cy.get("#description").should("be.visible").clear().type(descripcion)

        this.seleccionarComboAC(cicloVida, "Ciclo de vida");

        this.seleccionarFecha('#validFrom', fechaInicio);
        this.seleccionarFecha('#validTo', fechaFin);

        if (parametros && parametros.toString().trim() !== '') {
            cy.get('#parameters', {timeout: 15000})
                .should('exist')
                .then($ta => {
                    cy.wrap($ta)
                        .clear({force: true})
                        .type(parametros, {force: true})
                        .trigger('input')
                        .trigger('change')
                        .blur();
                });
        }


        /*this.seleccionarComboAC(tipoEjecucion, "Tipo de Ejecución");

        const campos = [
            { selector: '#correlative', valor: correlativo },
            { selector: '#description',   valor: descripcion },
            { selector: '#parameters',   valor: parametros }
        ];


        this.seleccionarComboAC(requiereLogueo, "Requiere Logueo");
        this.seleccionarComboAC(rutinaLogueo, "Rutina de Logueo");
        this.seleccionarComboAC(rutina, "Rutina");

        campos.forEach(({ selector, valor }) => {
            if (valor !== undefined && valor !== null && valor !== '') {

                cy.get('body').then($body => {
                    // Si el campo existe en el DOM
                    if ($body.find(selector).length > 0) {
                        cy.get(selector)
                            .scrollIntoView({ block: 'center' })
                            .should('be.visible')
                            .clear()
                            .type(valor);
                    } else {
                        cy.log(`Campo no presente aún: ${selector}`);
                    }
                });

            }
        });

        this.seleccionarComboAC(cicloVida, "Ciclo de vida");

        this.seleccionarFecha('#validFrom', fechaInicio);
        this.seleccionarFecha('#validTo', fechaFin);*/


    }

    CaracteristicaTransaccionPaso(correlativo, caracteristicaTrans, proteger, obligatorio, negrita, tamanioLetra, RGB) {

        cy.get("#correlative").should("be.visible").clear().type(correlativo)

        this.checkBox(proteger, "Proteger");
        this.checkBox(obligatorio, "Obligatorio");
        this.checkBox(negrita, "Negrita");

        this.seleccionarComboAC(tamanioLetra, "Tamaño de letra");

        cy.get('#color').should('be.visible').invoke('val', RGB).trigger('input').trigger('change');

    }


    AccesosTiposCajero(tipoCajero) {

        if (tipoCajero) {

            cy.get('mat-select', {timeout: 15000})
                .filter(':visible')
                .first()
                .then($select => {

                    const valorActual = $select
                        .find('.mat-select-min-line')
                        .text()
                        .trim();

                    // 🔁 Solo cambiar si es distinto
                    if (valorActual !== tipoCajero) {

                        // 1️⃣ Abrir mat-select
                        cy.wrap($select)
                            .should('not.be.disabled')
                            .click({force: true});

                        // 2️⃣ Seleccionar opción aunque NO esté visible
                        cy.get('.cdk-overlay-pane', {timeout: 15000})
                            .should('exist')
                            .find('.mat-option-text')
                            .contains(tipoCajero)
                            .should('exist')                 // ✅ existe en DOM
                            .scrollIntoView({block: 'center'})
                            .click({force: true});          // ✅ click forzado
                    }
                });
        }
    }


    CaracteristicasCodigoBarra(valorCodigoBarra, valorCorrelativo, valorCaracteristica, valorCaracteristicas2) {

        this.seleccionarCombo(valorCodigoBarra, "Código de barra");
        this.seleccionarCombo(valorCorrelativo, "Correlativo");
        this.seleccionarCombo(valorCaracteristica, "Característica");
        this.seleccionarCombo(valorCaracteristicas2, "Característica");

    }

    TransaccionInicioDia(valorCaracteristicaTransaccion, valorArbolRaiz, valorTotalCajero) {

        this.seleccionarCombo(valorCaracteristicaTransaccion, "Característica de Transacción");
        this.seleccionarCombo(valorArbolRaiz, "Árbol Raíz");
        this.seleccionarCombo(valorTotalCajero, "Total de Cajero");

    }

    ProcesosImplementacion(proceso) {
        if (proceso) {

            cy.get('mat-select', {timeout: 15000})
                .filter(':visible')
                .first()
                .then($select => {

                    const valorActual = $select
                        .find('.mat-select-min-line')
                        .text()
                        .trim();

                    // 🔁 Solo cambiar si es distinto
                    if (valorActual !== proceso) {

                        // 1️⃣ Abrir mat-select
                        cy.wrap($select)
                            .should('not.be.disabled')
                            .click({force: true});

                        // 2️⃣ Seleccionar opción aunque NO esté visible
                        cy.get('.cdk-overlay-pane', {timeout: 15000})
                            .should('exist')
                            .find('.mat-option-text')
                            .contains(proceso)
                            .should('exist')                 // ✅ existe en DOM
                            .scrollIntoView({block: 'center'})
                            .click({force: true});          // ✅ click forzado
                    }
                });
        }
    }

    RutinaEjecucion(correlativo, tipoRutina, rutina) {

        cy.get("#correlative").should("be.visible").clear().type(correlativo)

        this.seleccionarCombo(tipoRutina, "Tipo de rutina");
        this.seleccionarCombo(rutina, "Rutina");

    }

    RelacionCaracteristicaTransaccion(correlativo, descripcion, tipoCaracteristica) {
        const campos = [
            {selector: '#correlative', valor: correlativo},
            {selector: '#description', valor: descripcion},
        ];

        campos.forEach(({selector, valor}) => {
            if (valor !== undefined && valor !== null && valor !== '') {

                cy.get('body').then($body => {
                    // Si el campo existe en el DOM
                    if ($body.find(selector).length > 0) {
                        cy.get(selector)
                            .scrollIntoView({block: 'center'})
                            .should('be.visible')
                            .clear()
                            .type(valor);
                    } else {
                        cy.log(`Campo no presente aún: ${selector}`);
                    }
                });

            }
        });

        this.seleccionarCombo(tipoCaracteristica, "Tipo de Característica");

    }

    FormatosParaImpresionTransaccion(tipoFormato, formato, medioNotificacion, esMandatario, verFormato, seNotificaFormato) {
        this.seleccionarComboAC(tipoFormato, "Tipo de Formato");
        this.seleccionarComboAC(formato, "Formato");
        this.seleccionarComboAC(medioNotificacion, "Medios de notificación");
        this.seleccionarComboAC(esMandatario, "Es mandatorio");
        this.seleccionarComboAC(verFormato, "Ver formato");
        this.seleccionarComboAC(seNotificaFormato, "Se notifica formato al menos por un medio");

    }


//Inicio Plantillas de Comprobantes
    PlantillasComprobantes(key, nombre, descripcion, archivo) {

        cy.get('input[name="key"]').should("be.visible").clear().type(key);
        cy.get('input[name="name"]').should("be.visible").clear().type(nombre);
        cy.get('textarea[name="description"]').should("be.visible").clear().type(descripcion);


        // 🔹 Subir archivo (opcional)
        if (archivo) {
            cy.get('input[type="file"]', {timeout: 10000})
                .should('exist')
                .attachFile(archivo);
        }

    }

//Fin Plantillas de Comprobantes

//Inicio Envio de transacciones
    EnvioTransacciones(correlativo, descripcion, valorRequiereLogin, valorTipoDatoEnvio, valorEndpointEnvio, valorTipoDatoRecibido, valorAnalizarRespuesta) {
        cy.get("#correlative").should("be.visible").clear().type(correlativo);
        cy.get("#description").should("be.visible").clear().type(descripcion);
        this.seleccionarComboET(valorRequiereLogin, 0);
        this.seleccionarComboET(valorTipoDatoEnvio, 1);
        this.seleccionarComboET(valorEndpointEnvio, 2);
        this.seleccionarComboET(valorTipoDatoRecibido, 3);
        this.seleccionarComboET(valorAnalizarRespuesta, 4);
    }

    seleccionarComboET(valor, index) {
        if (!valor) return;

        cy.get("mat-select", {timeout: 10000})
            .filter(":visible")
            .eq(index)
            .should("not.be.disabled")
            .then(($select) => {
                const valorActual = $select.find(".mat-select-min-line").text().trim();

                if (valorActual !== valor) {
                    cy.wrap($select).click();

                    // 👇 Espera real a que Angular cree el overlay
                    cy.get("body")
                        .find(".cdk-overlay-pane", {timeout: 15000})
                        .should("exist")
                        .within(() => {
                            cy.contains(".mat-option-text", valor)
                                .should("be.visible")
                                .click();
                        });
                }
            });
    }

//Fin Envio de transacciones

//Inicio Reportess de totales
    ReporteTotales(codigo, nombre, titulo1, titulo2, valorArbolRaiz, valorNivelCajero, numeroColumnas) {

        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#title1").should("be.visible").clear().type(titulo1)
        cy.get("#title2").should("be.visible").clear().type(titulo2)

        this.seleccionarComboRT(valorArbolRaiz, 0);
        this.seleccionarComboRT(valorNivelCajero, 1);

        cy.get("#numColumns").should("be.visible").clear().type(numeroColumnas)
    }

    seleccionarComboRT(valor, index) {
        if (!valor) return;

        cy.get('mat-select', {timeout: 10000})
            .filter(':visible')
            .eq(index)
            .should('not.be.disabled')
            .then($select => {

                const valorActual = $select
                    .find('.mat-select-min-line')
                    .text()
                    .trim();

                if (valorActual !== valor) {

                    cy.wrap($select).click();

                    // 👇 Espera real a que Angular cree el overlay
                    cy.get('body')
                        .find('.cdk-overlay-pane', {timeout: 15000})
                        .should('exist')
                        .within(() => {
                            cy.contains('.mat-option-text', valor)
                                .should('be.visible')
                                .click();
                        });
                }
            });
    }

    ColumnarReporte(codigo, numeroColumna, tituloColumna, ultimaColumna, logitudColumna) {
        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#columnNum").should("be.visible").clear().type(numeroColumna)
        cy.get("#columnTitle").should("be.visible").clear().type(tituloColumna)
        cy.get("#lastColumn").should("be.visible").clear().type(ultimaColumna)
        cy.get("#columnLength").should("be.visible").clear().type(logitudColumna)
    }

    DetalleReporte(codigo, linea, columna, valorTipoDatos) {

        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#line").should("be.visible").clear().type(linea)
        cy.get("#column").should("be.visible").clear().type(columna)

        if (valorTipoDatos) {

            cy.get('mat-select', {timeout: 10000})
                .filter(':visible')
                .first()
                .then($select => {

                    const valorActual = $select
                        .find('.mat-select-min-line')
                        .text()
                        .trim();

                    // 🔁 Solo cambiar si es distinto
                    if (valorActual !== valorTipoDatos) {

                        cy.wrap($select)
                            .should('not.be.disabled')
                            .click({force: true});

                        cy.get('.cdk-overlay-pane', {timeout: 10000})
                            .find('.mat-option-text')
                            .contains(valorTipoDatos)
                            .should('be.visible')
                            .click();
                    }
                });
        }

    }

//Fin Reportess de totales

//Inicio Estructura de Datos

    EstructuraDatos(codigo, nombre, descripcion) {
        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)


    }

    Detalle(coorrelativo, descripcion, valorTipoDato, posicionInicial, longitud, valorEspecicaCaracteristica) {

        cy.get("#correlative").should("be.visible").clear().type(coorrelativo)
        cy.get("#description").should("be.visible").clear().type(descripcion)

        this.seleccionarComboD(valorTipoDato, 0);
        this.seleccionarComboD(valorEspecicaCaracteristica, 1);

        cy.get("#initialPosition").should("be.visible").clear().type(posicionInicial)
        cy.get("#length").should("be.visible").clear().type(longitud)

    }

    seleccionarComboD(valor, index) {

        if (!valor) return;

        cy.get("mat-select", {timeout: 10000})
            .filter(":visible")
            .eq(index)
            .then(($select) => {
                const valorActual = $select.find(".mat-select-min-line").text().trim();

                // 🔁 Cambia solo si es diferente
                if (valorActual !== valor) {
                    cy.wrap($select).should("not.be.disabled").click({force: true});

                    cy.wrap($select)
                        .should('not.be.disabled')
                        .click({force: true});

                    cy.get('.cdk-overlay-pane', {timeout: 10000})
                        .find('.mat-option-text')
                        .contains(valor)
                        .should('be.visible')
                        .click();
                }
            });
    }

//Fin Estructuras de datos


    seleccionarCombo(valor, xpath) {

        // 🔒 Normalización PRO
        if (
            valor === undefined ||
            valor === null ||
            valor === '' ||
            valor.toString().trim().toLowerCase() === 'lleno'
        ) {
            cy.log(`Combo omitido: ${xpath}`);
            return;
        }

        const textoValor = valor.toString().trim().toLowerCase();

        // 1️⃣ Abrir el mat-select por su label
        cy.xpath(
            `//label[.//*[contains(normalize-space(),'${xpath}')]]/ancestor::mat-form-field//mat-select`,
            {timeout: 15000}
        )
            .should('be.visible')
            .click({force: true});

        // 2️⃣ Esperar overlay
        cy.get('.cdk-overlay-pane', {timeout: 15000})
            .should('exist')
            .within(() => {

                // 3️⃣ Seleccionar opción (insensible a mayúsculas / acentos)
                cy.xpath(
                    `(//mat-option//span[contains(
          translate(
            normalize-space(),
            'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ',
            'abcdefghijklmnopqrstuvwxyzáéíóúüñ'
          ),
          '${textoValor}'
        )])[1]`
                )
                    .scrollIntoView({block: 'center'})
                    .filter(':visible')   // 🔥 elimina duplicados
                    .first()
                    .should('exist')

                    .click({force: true});
            });
    }

    seleccionarComboAC(valor, labelTexto) {

        // 🔒 Omitir si no aplica
        if (
            valor === undefined ||
            valor === null ||
            valor === '' ||
            valor.toString().trim().toLowerCase() === 'lleno'
        ) {
            cy.log(`Combo omitido: ${labelTexto}`);
            return;
        }

        const textoValor = valor.toString().trim().toLowerCase();

        // 1️⃣ Abrir el SIGUIENTE mat-select VACÍO por XPath
        cy.xpath(
            `//label[contains(normalize-space(),'${labelTexto}')]/ancestor::mat-form-field
         //mat-select[contains(@class,'mat-select-empty')]`,
            {timeout: 15000}
        )
            .first()                         // 🔥 secuencial automático
            .should('be.visible')
            .click({force: true});

        // 2️⃣ Tomar el overlay MÁS RECIENTE
        cy.get('.cdk-overlay-pane', {timeout: 15000})
            .last()
            .should('exist')
            .within(() => {

                // 3️⃣ Seleccionar opción (case + acentos safe)
                cy.xpath(
                    `.//mat-option//span[contains(
                    translate(
                        normalize-space(),
                        'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ',
                        'abcdefghijklmnopqrstuvwxyzáéíóúüñ'
                    ),
                    '${textoValor}'
                )]`
                )
                    .should('exist')
                    .scrollIntoView({block: 'center'})
                    .click({force: true});
            });
    }


    checkBoxWOS(valor, textoLabel) {

        // 🔹 No tocar si no viene el parámetro
        if (valor === undefined || valor === null) {
            cy.log(`Checkbox omitido: ${textoLabel}`);
            return;
        }

        cy.xpath(
            "//mat-checkbox[.//span[contains(normalize-space(),'" + textoLabel + "')]]",
            {timeout: 20000}
        )
            .should('exist')
            .then($checkbox => {

                const $input = $checkbox.find('input[type="checkbox"]');
                const marcado = $input.prop('checked');

                cy.log(`${textoLabel} | actual: ${marcado} | esperado: ${valor}`);

                // 🔒 Si no necesita cambio → salir
                if (marcado === valor) {
                    cy.log(`Checkbox ya en estado correcto: ${textoLabel}`);
                    return;
                }

                // ✅ CLICK REAL (Angular escucha esto)
                cy.wrap($checkbox)
                    .find('.mat-checkbox-layout')   // 🔥 ESTE ES EL CLAVE
                    .click({force: true});

                // 🔁 Validar que sí cambió
                cy.wrap($checkbox)
                    .find('input[type="checkbox"]')
                    .should(valor ? 'be.checked' : 'not.be.checked');
            });
    }


    /*    checkBoxWOS(valor, xpath) {

            // 👉 No tocar si no viene el parámetro
            if (valor === undefined || valor === null) {
                cy.log(`Checkbox omitido: ${xpath}`);
                return;
            }

            cy.xpath(
                "//mat-checkbox[.//span[contains(normalize-space(),'" + xpath + "')]]",
                { timeout: 15000 }
            )
                .should('exist')
                .then($checkbox => {

                    const estaMarcado = $checkbox
                        .find('input[type="checkbox"]')
                        .prop('checked');

                    // ✅ Si debe estar marcado y no lo está → click
                    if (valor === true && !estaMarcado) {
                        cy.wrap($checkbox).click({ force: true });
                    }

                    // ❌ Si debe estar desmarcado y está marcado → click
                    if (valor === false && estaMarcado) {
                        cy.wrap($checkbox).click({ force: true });
                    }
                });
        }*/


    checkBox(valor, xpath) {

        if (valor) {
            cy.xpath("//mat-checkbox[.//span[contains(normalize-space(),'" + xpath + "')]]").click();
        }

    }


    seleccionarFecha(selector, fecha, obligatoria = false) {

        // =====================================================
        // 🔹 1️⃣ Validación inicial
        // =====================================================
        if (!fecha || fecha.toString().trim() === '') {

            if (obligatoria) {
                throw new Error(`La fecha es obligatoria y no fue enviada (${selector})`);
            }

            cy.log(`🟡 Fecha omitida (opcional): ${selector}`);
            return;
        }

        // =====================================================
        // 🔹 2️⃣ Parsear fecha D/M/YYYY o DD/MM/YYYY
        // =====================================================
        const partes = fecha.toString().trim().split('/');

        if (partes.length !== 3) {
            throw new Error(`Formato de fecha inválido: ${fecha}`);
        }

        let [day, month, year] = partes.map(p => parseInt(p, 10));

        if (
            isNaN(day) ||
            isNaN(month) ||
            isNaN(year) ||
            year < 1900
        ) {
            throw new Error(`Fecha inválida: ${fecha}`);
        }

        // =====================================================
        // 🔹 3️⃣ Crear Date REAL (CLAVE)
        // =====================================================
        const dateObj = new Date(year, month - 1, day);

        // =====================================================
        // 🔹 4️⃣ Setear fecha correctamente en Angular
        // =====================================================
        cy.get(selector, {timeout: 20000})
            .should('exist')
            .then($input => {

                // 🔓 Habilitar input
                $input.prop('disabled', false);

                cy.wrap($input)
                    .closest('mat-form-field')
                    .invoke('removeClass', 'mat-form-field-disabled');

                // 🧠 SETEO REAL (NO TYPE)
                cy.wrap($input)
                    .invoke('val', dateObj)
                    .trigger('input')
                    .trigger('change')
                    .trigger('blur');
            });
    }

    seleccionarComboACA(valor, xpath) {

        const textoValor = valor.toLowerCase();

        cy.xpath(
            "//mat-label[contains(normalize-space(),'" + xpath + "')]/ancestor::mat-form-field//mat-select",
            {timeout: 15000}
        )
            .should('be.visible')
            .click();

        cy.xpath(
            `(//mat-option//span[contains(translate(normalize-space(),'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ',
        'abcdefghijklmnopqrstuvwxyzáéíóúüñ'),'${textoValor}')])[1]`,
            {timeout: 15000}
        )
            .should('be.visible')
            .click();
    }

    //Metodo combo totales cajero
    seleccionarComboTC(valor, xpath) {

        // 🔒 Validación PRO (igual que la tuya)
        if (
            valor === undefined ||
            valor === null ||
            valor === '' ||
            valor.toString().trim().toLowerCase() === 'lleno'
        ) {
            cy.log(`Combo omitido: ${xpath}`);
            return;
        }

        const textoValor = valor.toString().trim().toLowerCase();

        // 1️⃣ Abrir el mat-select por label
        cy.xpath(
            `//label[.//*[contains(normalize-space(),'${xpath}')]]
         /ancestor::mat-form-field//mat-select`,
            { timeout: 15000 }
        )
            .should('exist')
            .click({ force: true });

        // 2️⃣ Esperar overlay
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .should('exist')
            .within(() => {

                // 3️⃣ Seleccionar por mat-option (NO span)
                cy.xpath(
                    `//mat-option[
                    contains(
                        translate(
                            normalize-space(.),
                            'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ',
                            'abcdefghijklmnopqrstuvwxyzáéíóúüñ'
                        ),
                        '${textoValor}'
                    )
                ]`,
                    { timeout: 15000 }
                )
                    .first()                // 🔑 uno solo
                    .should('exist')
                    .click({ force: true }); // 🔥 aunque no sea visible
            });
    }



}

export default TransaccionesCy;
