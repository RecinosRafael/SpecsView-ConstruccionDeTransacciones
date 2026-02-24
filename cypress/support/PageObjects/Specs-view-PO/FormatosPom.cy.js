class FormatosPomCy{

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
}
export default FormatosPomCy;
