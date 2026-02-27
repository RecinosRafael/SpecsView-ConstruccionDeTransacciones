class CamposDeLaTransaccionCy{

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


}
export default CamposDeLaTransaccionCy;