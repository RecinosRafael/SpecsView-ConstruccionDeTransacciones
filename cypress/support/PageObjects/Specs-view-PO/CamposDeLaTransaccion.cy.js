import metodosGeneralesPomCy from "./MetodosGeneralesPom.cy.js";
    
class CamposDeLaTransaccionCy{

    constructor() {
        this.Generales = new metodosGeneralesPomCy();
    }
    
    CamposTransaccion(codigo, nombre, etiqueta, descripcion,  tieneDatosSensibles, Tipo, longitudMin, longitudMax, longitudEnvio, 
        digitoVerificador, mascara, listaValores, rangoValores, limiteInferior, limiteSuperior, llenadoAutomatico, etiquetaJson, 
        valorDefecto, ayuda, moneda, rutina, implListaVista, implServicio, endpointAyuda, estado, validoDesde, validoHasta, usaSumadora, 
        idCampoEscuchar, requiereDetalleEfectivo, archivoYML, datosTachados, caracterVisualizar, esControlEfectivo ) {

        cy.log("Entrando a la creacion de campos de transaccion");
        this.Generales.llenarCampo(codigo, "Código")
        this.Generales.llenarCampo(nombre, "Nombre")
        this.Generales.llenarCampo(etiqueta, "Etiqueta")
        this.Generales.llenarCampo(descripcion, "Descripción")
        this.Generales.checkbox(tieneDatosSensibles, "Datos sensibles")
        this.Generales.seleccionarCombo(Tipo, "Tipo")
        this.Generales.llenarCampo(longitudMin, "Longitud Mínima")
        this.Generales.llenarCampo(longitudMax, "Longitud máxima")
        this.Generales.llenarCampo(longitudEnvio, "Longitud envío")
        this.Generales.seleccionarCombo(digitoVerificador, "Dígito verificador")
        this.Generales.llenarCampo(mascara, "Máscara")
        this.Generales.seleccionarCombo(listaValores, "Lista de valores")
        this.Generales.seleccionarCombo(rangoValores, "Rango de valores")
        this.Generales.llenarCampo(limiteInferior, "Límite inferior")
        this.Generales.llenarCampo(limiteSuperior, "Límite superior")
        this.Generales.seleccionarCombo(llenadoAutomatico, "Llenado automático")
        this.Generales.llenarCampo(etiquetaJson, "Etiqueta en JSON")
        this.Generales.llenarCampo(valorDefecto, ["Valor Numérico Defecto", "valor defecto"])
//      this.Generales.llenarCampo(ayuda, "Ayuda")
        this.Generales.seleccionarCombo(moneda, "Moneda")    
        this.Generales.seleccionarCombo(rutina, "Rutina")
        this.Generales.llenarCampo(implListaVista, "Implementación de Lista en Vista")
        this.Generales.llenarCampo(implServicio, "Implementación de servicio")
        this.Generales.llenarCampo(endpointAyuda, "Endpoint de ayuda")
        this.Generales.seleccionarCombo(estado, "Estado")
        this.Generales.IngresarFecha(validoDesde, "Válido desde")
        this.Generales.IngresarFecha(validoHasta, "Válido hasta")
        this.Generales.checkbox(usaSumadora, "Usa sumadora") 
        this.Generales.llenarCampo(idCampoEscuchar, "IDs de Campos a Escuchar")
        this.Generales.checkbox(requiereDetalleEfectivo, "Requiere detalle de efectivo")
        this.Generales.llenarCampo(archivoYML, "Archivo YML define Campo Tabla")
        this.Generales.checkbox(datosTachados, "Datos tachados")
        this.Generales.llenarCampo(caracterVisualizar, "Caracteres a visualizar")
        this.Generales.seleccionarCombo(esControlEfectivo, "Es control de efectivo")

    }

    ValoresDeCaracteristica(valor, valorDefecto, descriptor, descriptor2, descriptor3, descriptor4){

        this.Generales.llenarCampo(valor, "Valor")
        this.Generales.checkbox(valorDefecto, "Valor Defecto")
        this.Generales.llenarCampo(descriptor, "Descriptor")
        this.Generales.llenarCampo(descriptor2,  "Descriptor 2")
        this.Generales.llenarCampo(descriptor3, "Descriptor 3")
        this.Generales.llenarCampo(descriptor4, "Descriptor 4")

    }

    SubCaracteristicas(correlativo, subCaracteristica, campoTotalizable, TipoOperacion, campoMandatorio, campoVisualizable, campoProtegido){

        this.Generales.llenarCampo(correlativo, "Correlativo")
        this.Generales.seleccionarCombo(subCaracteristica, "Sub-característica")
        this.Generales.seleccionarCombo(campoTotalizable, "Campo totalizable")
        this.Generales.seleccionarCombo(TipoOperacion, "Tipo de operación")
        this.Generales.seleccionarCombo(campoMandatorio, "Campo madatorio") 
        this.Generales.seleccionarCombo(campoVisualizable, "Campo visualizable")
        this.Generales.seleccionarCombo(campoProtegido, "Campo protegido")


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