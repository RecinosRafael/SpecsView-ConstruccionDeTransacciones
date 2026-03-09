class FormatosPomCy{



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

    DetalleFormato(correlativo, descripcion, valorTipoDatos, constante,removerCeros, mascaraImpresion, valorEspecificacionCaracteristica1, valorOperador,
                   valorEspecificaciOnCaracteristica2, leerPosInicial, leerTamDatos, imprimirFila, imprimirTamDatos, imprimirPosicionColumna,expresionDatosRecurso, expresion1,
                   valorOperacion, expresion2, valorTipoExpresion ) {


        // Mapeo directo selector → valor para campos de texto
        const campos = {
            '#correlative': { valor: correlativo, nombre: 'Correlativo', req: true },
            '#description': { valor: descripcion, nombre: 'Descripción', req: true },
            '#constant': { valor: constante, nombre: 'Constante', req: true },
            '#maskPrint': { valor: mascaraImpresion, nombre: 'Máscara de impresión', req: false },
            '#readInitPosition': { valor: leerPosInicial, nombre: 'Leer posición Inicial', req: false },
            '#readLenData': { valor: leerTamDatos, nombre: 'Leer Tamaño Datos', req: false },
            '#printInRow': { valor: imprimirFila, nombre: 'Imprimir en Fila', req: false },

            '#printLenData': { valor: imprimirTamDatos, nombre: 'Imprimir Tamaño Datos', req: false },
            '#printInitColumn': { valor: imprimirPosicionColumna, nombre: 'Imprimir Posición Columna', req: false },
            '#allocate': { valor: expresionDatosRecurso, nombre: 'Expresión para datos del recurso', req: false },
            '#expression1': { valor: expresion1, nombre: 'Expresion 1', req: false },
            '#expression2': { valor: expresion2, nombre: 'Expresion 2', req: false },
        };

        // Array para combos (NO van en el objeto campos porque no tienen selector real)
        const combos = [
            { valor: valorTipoDatos, nombre: 'Tipo de Datos', index: 0, req: false },
            { valor: valorEspecificacionCaracteristica1, nombre: 'Incluir Imagen', index: 1, req: false },
            { valor: valorOperador, nombre: 'Operación', index: 2, req: false },
            { valor: valorEspecificaciOnCaracteristica2, nombre: 'Especificación de Característica 2', index: 3, req: false },
            { valor: valorOperacion, nombre: 'Operación', index: 4, req: false },
            { valor: valorTipoExpresion, nombre: 'Tipo de Expresion', index: 5, req: false }
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
                this.seleccionarComboDF(valor, index);
            });
    }

    seleccionarComboDF(valor, index) {
        if (!valor || valor === '') {
            cy.log(`ℹ️ Combo índice ${index} omitido (valor vacío)`);
            return;
        }

        cy.log(`🔍 Buscando combo índice ${index} para valor: "${valor}"`);

        const selectores = [
            'mat-select',
            'select',
            '[role="listbox"]',
            '.mat-select-trigger',
            'button[aria-haspopup="listbox"]'
        ];

        let encontrado = false;

        cy.get('body').then($body => {

            for (const selector of selectores) {

                const $elementos = $body.find(selector);
                cy.log(`   Selector "${selector}" encontró ${$elementos.length} elementos`);

                if ($elementos.length > index) {

                    cy.log(`   ✅ Usando selector "${selector}" para índice ${index}`);

                    const $combo = $elementos.eq(index);

                    const textoActual = $combo
                        .find('.mat-select-min-line, .mat-select-value-text, option:selected')
                        .first()
                        .text()
                        .trim();

                    if (textoActual !== valor) {

                        cy.wrap($combo)
                            .scrollIntoView()
                            .click({ force: true });

                        cy.get('.cdk-overlay-pane, .mat-select-panel, select', { timeout: 8000 })
                            .should('exist');

                        cy.get('.mat-option-text, option')
                            .contains(valor)
                            .scrollIntoView()
                            .click({ force: true });

                        cy.log(`✅ Seleccionado: "${valor}"`);

                    } else {
                        cy.log(`ℹ️ Combo ya tiene valor "${valor}"`);
                    }

                    encontrado = true;
                    break;
                }
            }

            if (!encontrado) {
                cy.log(`⚠️ Combo no existe en índice ${index} con ninguno de los selectores`);

                cy.log('📋 Elementos disponibles:');
                selectores.forEach(selector => {
                    const count = $body.find(selector).length;
                    cy.log(`   ${selector}: ${count} elementos`);
                });
            }
        });
    }



}
export default FormatosPomCy;
