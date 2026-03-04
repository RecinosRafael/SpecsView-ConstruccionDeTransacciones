class FormatosPomCy{

    /*Formato(codigo, nombre, nombreAbreviado, descripcion, plantilla, extencion, valorDtosTachados, valorIncluirImagen, posicion, tamanioImagen,
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


    }*/


    Formato(codigo, nombre, nombreAbreviado, descripcion, plantilla, extencion,
            valorDatosTachados, valorIncluirImagen, posicion, tamanioImagen,
            valorParaCatalogos, codigoPlantillaAlternativa, poscEtiquetaComprobante, poscEtiquetaReimprimir) {

        // Mapeo directo selector → valor para campos de texto
        const campos = {
            '#code': { valor: codigo, nombre: 'Código', req: true },
            '#name': { valor: nombre, nombre: 'Nombre', req: true },
            '#shortName': { valor: nombreAbreviado, nombre: 'Nombre Abreviado', req: true },
            '#description': { valor: descripcion, nombre: 'Descripción', req: false },
            '#templateId': { valor: plantilla, nombre: 'Plantilla', req: false },
            '#extension': { valor: extencion, nombre: 'Extensión', req: false },
            '#position': { valor: posicion, nombre: 'Posición', req: false },
            '#imageSize': { valor: tamanioImagen, nombre: 'Tamaño Imagen', req: false },
            '#alternateTemplateCode': { valor: codigoPlantillaAlternativa, nombre: 'Plantilla Alternativa', req: false },
            '#labelPosition': { valor: poscEtiquetaComprobante, nombre: 'Posición Etiqueta', req: false },
            '#labelPositionReprint': { valor: poscEtiquetaReimprimir, nombre: 'Posición Reimpresión', req: false }
        };

        // Array para combos (NO van en el objeto campos porque no tienen selector real)
        const combos = [
            { valor: valorDatosTachados, nombre: 'Datos Tachados', index: 0, req: false },
            { valor: valorIncluirImagen, nombre: 'Incluir Imagen', index: 1, req: false },
            { valor: valorParaCatalogos, nombre: 'Para Catálogos', index: 2, req: false }
        ];

        // Validar requeridos en campos de texto
        const reqFaltantes = Object.values(campos)
            .filter(c => c.req && (c.valor === undefined || c.valor === null || c.valor === ''))
            .map(c => c.nombre);

        if (reqFaltantes.length) {
            throw new Error(`Requeridos: ${reqFaltantes.join(', ')}`);
        }

        // Ejecutar campos de texto con valor
        Object.entries(campos)
            .filter(([_, { valor }]) => valor !== undefined && valor !== null && valor !== '')
            .forEach(([selector, { nombre, valor }]) => {
                cy.log(`${nombre}: "${valor}"`);
                cy.get(selector).clear().should('be.visible').type(String(valor));
            });

        // Ejecutar combos con valor
        combos
            .filter(c => c.valor !== undefined && c.valor !== null && c.valor !== '')
            .forEach(({ nombre, valor, index }) => {
                cy.log(`${nombre}: "${valor}" (índice ${index})`);
                this.seleccionarComboF(valor, index);
            });
    }

    seleccionarComboF(valor, index) {
        if (!valor || valor === '') {
            cy.log(`ℹ️ Combo índice ${index} omitido (valor vacío)`);
            return;
        }

        cy.log(`🔍 Buscando combo índice ${index} para valor: "${valor}"`);

        // Intentar diferentes selectores para encontrar el combo
        const selectores = [
            'mat-select',
            'select',
            '[role="listbox"]',
            '.mat-select-trigger',
            'button[aria-haspopup="listbox"]'
        ];

        let encontrado = false;

        cy.get('body').then($body => {
            // Probar cada selector hasta encontrar algo
            for (const selector of selectores) {
                const $elementos = $body.find(selector).filter(':visible');
                cy.log(`   Selector "${selector}" encontró ${$elementos.length} elementos visibles`);

                if ($elementos.length > index) {
                    cy.log(`   ✅ Usando selector "${selector}" para índice ${index}`);

                    const $combo = $elementos.eq(index);
                    const textoActual = $combo.find('.mat-select-min-line, .mat-select-value-text, option:selected').first().text().trim();

                    if (textoActual !== valor) {
                        cy.wrap($combo).click();

                        // Esperar que aparezca el dropdown
                        cy.get('.cdk-overlay-pane, .mat-select-panel, select option', { timeout: 5000 })
                            .should('be.visible')
                            .find('.mat-option-text, option')
                            .contains(valor)
                            .should('be.visible')
                            .click();

                        cy.log(`✅ Seleccionado: "${valor}"`);
                    } else {
                        cy.log(`ℹ️ Combo ya tiene valor "${valor}"`);
                    }

                    encontrado = true;
                    break;
                }
            }

            if (!encontrado) {
                cy.log(`⚠️ Combo no existe en índice ${index} con ninguno de los selectores probados`);
                // Mostrar qué elementos hay disponibles para debug
                cy.log('📋 Elementos disponibles:');
                selectores.forEach(selector => {
                    const count = $body.find(selector).filter(':visible').length;
                    cy.log(`   ${selector}: ${count} elementos`);
                });
            }
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
