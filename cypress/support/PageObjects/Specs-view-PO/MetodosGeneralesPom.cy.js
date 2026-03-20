import '@4tw/cypress-drag-drop';
class MetodosGeneralesPomCy{

    //Boton para agregar registros
    BtnAgregarRegistro(){
        cy.log('Clic en botón ADD');
        this.esperarOcultarSpinner()
        cy.get('button.mat-fab', { timeout: 15000 })
            .should('exist')
            .then($btn => {
                cy.wrap($btn)
                    //.scrollIntoView()
                    .click({ force: true });
            });
    }
    BtnAgregarRegistros() {
        cy.log('Clic en botón ADD');
        cy.wait(1500);

        // Buscar el botón que contiene el ícono "add"
        cy.get('button.mat-fab[color="warn"]', { timeout: 15000 })
            .should('exist')
            .filter(':has(mat-icon:contains("add"))')  // Filtra los que tienen ícono "add"
            .first()  // Toma el primero (por si acaso)
            .click({ force: true });

        cy.log('✅ Botón ADD clickeado');
    }

    //Metodo para dar click en boton con el label normalizado para iframe y sin iframe
    BtnIframe(textoBoton, opciones = {}, filtroClase = null, porTexto = false) {
    const {
        timeout = 10000,
        force = false,
        scrollBehavior = 'center',
        ensureScrollable = true,
        offsetTop = -100,
        ignorarBackdrop = true,
        skipContext = false,
        spinnerTimeout = 30000,
        esperarAparicionSpinner = false
    } = opciones;

    const ejecutar = () => {
        if (textoBoton == null || (typeof textoBoton === 'string' && textoBoton.trim() === '')) {
            cy.log(`⏭️ Texto de botón vacío o nulo, se omite clic.`);
            return;
        }

        if (porTexto) {
            // Búsqueda por texto visible (para tabs, botones, etc.)
            cy.log(`🔍 Buscando elemento con texto visible: "${textoBoton}"`);
            let selector = filtroClase ? `${filtroClase}:contains("${textoBoton}")` : `:contains("${textoBoton}")`;
            cy.get(selector, { timeout })
                .first()
                .scrollIntoView({
                    duration: 300,
                    easing: 'linear',
                    offset: { top: offsetTop, left: 0 },
                    ensureScrollable: ensureScrollable
                })
                .click({ force })
                .then(() => {
                    cy.log(`✅ Clic en elemento con texto "${textoBoton}"`);
                    if (this.esperarOcultarSpinner) {
                        this.esperarOcultarSpinner({
                            timeout: spinnerTimeout,
                            esperarAparicion: esperarAparicionSpinner,
                            skipContext: skipContext
                        });
                    }
                });
        } else {
            // Lógica actual con XPath para tooltips
            cy.log(`🔍 Buscando elemento con tooltip: "${textoBoton}" usando XPath`);

            const normalizarParaXPath = (texto) => {
                return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            };

            const textoNormalizado = normalizarParaXPath(textoBoton);
            const textoSeguro = textoNormalizado.replace(/'/g, "&apos;");

            let xpath = `//*[@aria-describedby=//div[contains(@class,'cdk-describedby-message-container')]//div[translate(translate(text(), 'ÁÉÍÓÚÜáéíóúü', 'AEIOUuaeiouu'), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') = translate(translate('${textoSeguro}', 'ÁÉÍÓÚÜáéíóúü', 'AEIOUuaeiouu'), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')]/@id]`;

            // Si se proporciona un filtro de clase, lo agregamos
            if (filtroClase) {
                if (typeof filtroClase === 'string') {
                    xpath = xpath.replace('/*', `/*[contains(@class, '${filtroClase}')]`);
                    cy.log(`🔍 Filtrando por clase: ${filtroClase}`);
                }
            }

            cy.log(`XPath final: ${xpath}`);

            cy.xpath(xpath, { timeout })
                .first()
                .scrollIntoView({
                    duration: 300,
                    easing: 'linear',
                    offset: { top: offsetTop, left: 0 },
                    ensureScrollable: ensureScrollable
                })
                .click({ force })
                .then(() => {
                    cy.log(`✅ Clic en elemento con tooltip "${textoBoton}"`);
                    if (this.esperarOcultarSpinner) {
                        this.esperarOcultarSpinner({
                            timeout: spinnerTimeout,
                            esperarAparicion: esperarAparicionSpinner,
                            skipContext: skipContext
                        });
                    }
                });
        }
    };

    if (skipContext) {
        ejecutar();
    } else if (this._ejecutarEnContexto) {
        this._ejecutarEnContexto(ejecutar);
    } else {
        ejecutar();
    }
}

    // BtnAgregarRegistrosIF() {
    //         cy.log('Clic en botón ADD');
    //         this.esperarOcultarSpinner();

    //         // Detectar iframe
    //         cy.get('iframe.frame', { timeout: 5000, failOnStatusCode: false }).then(($iframe) => {
    //             if ($iframe.length > 0) {
    //                 cy.log('✅ Iframe detectado');
    //                 cy.wrap($iframe)
    //                     .should("be.visible")
    //                     .invoke("css", "pointer-events", "auto")
    //                     .its("0.contentDocument.body")
    //                     .should("not.be.empty")
    //                     .then(cy.wrap)
    //                     .within(() => {
    //                         intentarClick();
    //                     });
    //             } else {
    //                 cy.log('⚠️ Sin iframe');
    //                 this.BtnAgregarRegistro();
    //             }
    //         });
    //     }


    getIframeBody() {
     return cy
        .get('iframe.frame', { timeout: 20000 })
        .should('be.visible')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap)
    }

    BtnGuardarRegistroAng() {
        cy.log('Clic en botón GUARDAR');

        this.getIframeBody().within(() => {

            cy.xpath(
            "//button[.//mat-icon[normalize-space()='save']]",
            { timeout: 15000 }
            )
            .should('exist')
            .click({ force: true });

        });
    }

    BtnAceptarRegistroAng() {
        cy.log('Clic en botón ACEPTAR');

      this.getIframeBody().within(() => {
        cy.get('mat-dialog-actions .buttonAdd button', { timeout: 15000 })
        .should('exist')
        .click({ force: true });
        });
    }

    //Boton para agregar registros Angular
//     BtnAgregarAng(){
//      cy.log('Clic en botón ADD');

//     this.getIframeBody().within(() => {
//       cy.xpath("//button[.//mat-icon[normalize-space()='add']]", { timeout: 15000 })
//         .should('be.visible')
//         .click({ force: true });
//     });
// }



    //Boton agregar en subnivel

    BtnAgregarRegistroSubnivel() {
        cy.log("Agregamdp Registro de Subnivel")
        cy.contains('mat-icon', 'add', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });
    }

    // //Boton para Regresar
    // BtnRegresarNivel() {
    //     cy.log('Clic en botón Regresar');

    //     cy.contains('mat-icon', 'arrow_back', { timeout: 15000 })
    //     .parents('button')
    //     .should('be.visible')
    //     .click();
    // }


    //Boton para confirmar el agregar y modificar registros
    BtnAceptarRegistro(){
        cy.log('Clic en botón ACEPTAR');

        cy.contains('button mat-button-wrapper, span.mat-button-wrapper', 'Aceptar', { timeout: 15000 })
            .parents('button')
            .should('exist')
            .click({ force: true });
    }

BtnAceptarRegistroF() {
    cy.log('Clic en botón ACEPTAR');
    this.esperarOcultarSpinner()

    const intentarClick = () => {
        // Selectores CSS para el botón Aceptar (con icono check)
        const selectores = [
            'button.btn-actions',                          // clase personalizada
            'button[mat-fab][color="accent"]',             // por atributos
            'button mat-icon:contains("check")',            // icono check
            'button[mat-fab]',                              // menos específico
            'button[color="accent"]'                         // por color
        ];

        let encontrado = false;

        const intentarSelector = (index) => {
            if (index >= selectores.length) {
                if (!encontrado) {
                    cy.log('❌ No se encontró el botón ACEPTAR con ningún selector');
                    cy.document().then(doc => {
                        cy.log('HTML disponible:', doc.body.innerHTML.substring(0, 500));
                    });
                    throw new Error('No se pudo encontrar el botón ACEPTAR');
                }
                return;
            }

            const selector = selectores[index];
            cy.get(selector, { timeout: 3000, failOnStatusCode: false }).then(($el) => {
                if ($el.length > 0 && !encontrado) {
                    // Si el elemento encontrado no es un botón, buscar el botón más cercano
                    let $button = $el;
                    if (!$el.is('button')) {
                        $button = $el.closest('button');
                        if ($button.length === 0) {
                            // No se encontró un botón padre, pasar al siguiente selector
                            intentarSelector(index + 1);
                            return;
                        }
                    }
                    cy.wrap($button).first().click({ force: true });
                    encontrado = true;
                    cy.log(`✅ Click con selector: ${selector}`);
                } else {
                    intentarSelector(index + 1);
                }
            });
        };

        intentarSelector(0);
    };

    // Detectar iframe
    cy.get('iframe.frame', { timeout: 5000, failOnStatusCode: false }).then(($iframe) => {
        if ($iframe.length > 0) {
            cy.log('✅ Iframe detectado');
            cy.wrap($iframe)
                .should("be.visible")
                .invoke("css", "pointer-events", "auto")
                .its("0.contentDocument.body")
                .should("not.be.empty")
                .then(cy.wrap)
                .within(() => {
                    intentarClick();
                });
        } else {
            cy.log('⚠️ Sin iframe, ejecutando directamente');
            intentarClick();
        }
    });
}

    // Boton para cancelar la insercion del registro.
    BtnCancelarRegistro() {
        cy.log('Clic en botón CANCELAR');

        cy.contains('button', 'Cancelar', { timeout: 15000 })
            .should('exist')
            .click({ force: true });
    }

    BtnCancelarRegistroIF() {
    cy.log('Clic en botón CANCELAR');
    this.esperarOcultarSpinner()

    const intentarClick = () => {
        // Selectores CSS para el botón Cancelar (con icono keyboard_return)
        const selectores = [
            'button[mat-fab][color="warn"]',                  // botón con atributos específicos
            'button mat-icon:contains("keyboard_return")',     // icono dentro del botón
            'button[mat-fab]',                                 // menos específico
            'button[color="warn"]',                            // por color
            'button.mdc-fab.mat-warn'                          // combinación de clases
        ];

        let encontrado = false;

        const intentarSelector = (index) => {
            if (index >= selectores.length) {
                if (!encontrado) {
                    cy.log('❌ No se encontró el botón CANCELAR con ningún selector');
                    cy.document().then(doc => {
                        cy.log('HTML disponible:', doc.body.innerHTML.substring(0, 500));
                    });
                    throw new Error('No se pudo encontrar el botón CANCELAR');
                }
                return;
            }

            const selector = selectores[index];
            cy.get(selector, { timeout: 3000, failOnStatusCode: false }).then(($el) => {
                if ($el.length > 0 && !encontrado) {
                    // Si el elemento encontrado no es un botón (ej: el icono), buscar el botón padre
                    let $button = $el;
                    if (!$el.is('button')) {
                        $button = $el.closest('button');
                        if ($button.length === 0) {
                            // No hay botón asociado, pasar al siguiente selector
                            intentarSelector(index + 1);
                            return;
                        }
                    }
                    cy.wrap($button).first().click({ force: true });
                    encontrado = true;
                    cy.log(`✅ Click con selector: ${selector}`);
                } else {
                    intentarSelector(index + 1);
                }
            });
        };

        intentarSelector(0);
    };

    // Detectar iframe
    cy.get('iframe.frame', { timeout: 5000, failOnStatusCode: false }).then(($iframe) => {
        if ($iframe.length > 0) {
            cy.log('✅ Iframe detectado');
            cy.wrap($iframe)
                .should("be.visible")
                .invoke("css", "pointer-events", "auto")
                .its("0.contentDocument.body")
                .should("not.be.empty")
                .then(cy.wrap)
                .within(() => {
                    intentarClick();
                });
        } else {
            cy.log('⚠️ Sin iframe, ejecutando directamente');
            intentarClick();
        }
    });
    }

    BtnConfirmarSi() {
        cy.log('Clic en botón "Sí" del diálogo de confirmación');

        const intentarClick = () => {
            // 1. Esperar a que el diálogo esté presente en el DOM
            cy.get('[role="dialog"], mat-dialog-container', { timeout: 10000 })
                .should('be.visible');

            // 2. Dentro del diálogo, buscar el botón por sus atributos estables
            //    (mat-mini-fab, color="primary") y hacer clic
            cy.get('[role="dialog"] button[mat-mini-fab][color="primary"], mat-dialog-container button[mat-mini-fab][color="primary"]')
                .should('be.visible')
                .first()
                .click({ force: true });

            cy.log('✅ Click en botón "Sí"');
        };

        // Manejo de iframe (igual)
        cy.get('iframe.frame', { timeout: 5000, failOnStatusCode: false }).then(($iframe) => {
            if ($iframe.length) {
                cy.wrap($iframe)
                    .should('be.visible')
                    .invoke('css', 'pointer-events', 'auto')
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        intentarClick();
                    });
            } else {
                intentarClick();
            }
        });
    }

    BtnVolver() { // También puedes llamarlo BtnCancelarRegistro()
        cy.log('Clic en botón VOLVER (cancelar)');
        cy.wait(500);

        const intentarClick = () => {
            // Normalizar texto (por si se busca por tooltip)
            const normalizar = (txt) => {
                if (!txt) return '';
                return txt.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
            };
            // Posibles textos de tooltip (según la aplicación)
            const posiblesTooltips = ['Volver', 'Cancelar', 'Cerrar'];
            const tooltipsNormalizados = posiblesTooltips.map(normalizar);

            // Función para buscar dentro del body actual usando jQuery
            const buscarEnContexto = (selectorFn) => {
                return cy.root().then($root => {
                    const $result = selectorFn($root);
                    if ($result && $result.length) {
                        return cy.wrap($result);
                    }
                    throw new Error('No encontrado');
                });
            };

            // Estrategias de búsqueda (reciben $root y devuelven elemento jQuery)
            const estrategias = [
                // 1. Icono keyboard_return + color warn dentro de un botón (más fiable)
                ($root) => $root.find('button[mat-fab][color="warn"] mat-icon:contains("keyboard_return")').closest('button'),
                // 2. Botón con atributos mat-fab y color warn (sin depender del icono)
                ($root) => $root.find('button[mat-fab][color="warn"]').first(),
                // 3. Icono keyboard_return dentro de cualquier botón (genérico)
                ($root) => $root.find('button mat-icon:contains("keyboard_return")').closest('button'),
                // 4. Botón con clase que contenga "warn" y fab (fallback)
                ($root) => $root.find('button.mat-warn.mat-mdc-fab').first(),
                // 5. Tooltip exacto (si existe)
                ($root) => {
                    const $els = $root.find('[matTooltip]');
                    return $els.filter((i, el) =>
                        posiblesTooltips.includes(el.getAttribute('matTooltip'))
                    ).first();
                },
                // 6. Tooltip que contenga alguna palabra (insensible a tildes)
                ($root) => {
                    const $els = $root.find('[matTooltip]');
                    return $els.filter((i, el) => {
                        const tooltip = normalizar(el.getAttribute('matTooltip'));
                        return tooltipsNormalizados.some(t => tooltip.includes(t));
                    }).first();
                }
            ];

            const probarEstrategia = (index) => {
                if (index >= estrategias.length) {
                    cy.log('❌ No se encontró el botón VOLVER');
                    // Opcional: imprimir HTML del diálogo si existe
                    cy.root().then($root => {
                        const $dialog = $root.find('[role="dialog"], mat-dialog-container');
                        if ($dialog.length) {
                            cy.log('HTML del diálogo:', $dialog.html()?.substring(0, 1000));
                        }
                    });
                    throw new Error('No se pudo encontrar el botón VOLVER');
                }

                cy.log(`🔍 Probando estrategia ${index + 1}...`);
                return buscarEnContexto(estrategias[index]).then(($el) => {
                    cy.wrap($el).first().click({ force: true });
                    cy.log(`✅ Click con estrategia ${index + 1}`);
                }, (err) => {
                    cy.log(`⚠️ Estrategia ${index + 1} falló: ${err.message}`);
                    return probarEstrategia(index + 1);
                });
            };

            return probarEstrategia(0);
        };

        // Manejo de iframe (igual que los otros métodos)
        cy.get('iframe.frame', { timeout: 5000, failOnStatusCode: false }).then(($iframe) => {
            if ($iframe.length) {
                cy.wrap($iframe)
                    .should('be.visible')
                    .invoke('css', 'pointer-events', 'auto')
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap)
                    .within(() => {
                        intentarClick();
                    });
            } else {
                intentarClick();
            }
        });
    }

    BuscarRegistroCodigo(codigo) {

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Código" del menú
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'Código')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Ingresar código en el input
        cy.get('#code', { timeout: 15000 })
            .should('exist')
            .clear()
            .type(codigo);

        // 4️⃣ Clic en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });
            cy.wait(2000)

        // 5️⃣ Clic en el código encontrado en la tabla
        cy.get('.mat-row .cdk-column-code', { timeout: 15000 })
            .first()
            .should('exist')
            .click({ force: true });

    }

    //Filtro, Buscar por Regla
    /*BuscarRegistroRegla(correlativo, Regla) {

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Regla" del menú
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'Regla')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Ingresar código en el input
        cy.xpath("//button[.//span[normalize-space()='Buscar por']]/following::select[1]", { timeout: 15000 })
            .should('exist')
            .clear()
            .type(Regla);

        // 4️⃣ Clic en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 5️⃣ Clic en el código encontrado en la tabla
        cy.xpath("//table[@role='table']//tr[@role='row'][.//td[count(preceding-sibling::td) =count(//th[contains(translate(normalize-space(),'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ','abcdefghijklmnopqrstuvwxyzáéíóúüñ'),'usuario')]/preceding-sibling::th)and contains(translate(normalize-space(),'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ','abcdefghijklmnopqrstuvwxyzáéíóúüñ'),"+valor.toLowerCase()+")]]", { timeout: 15000 })
            .first()
            .should('exist')
            .click({ force: true });
    }*/

// En MetodosGeneralesPom.cy.js
BuscarRegistroEnTabla(criterios) {
    // criterios: array de objetos con {columna, valor}
    // Ejemplo: [{columna: 'Regla', valor: 'Afectación efectivo trx pagadas'}, {columna: 'Transacción', valor: ''}]

    cy.log(`🔍 Buscando en tabla con criterios:`, criterios);

    // Función para normalizar texto
    const normalizarTexto = (texto) => {
        if (!texto) return '';
        return texto.toString().trim().replace(/\s+/g, ' ');
    };

    // Variable para controlar si encontramos el registro
    let registroEncontrado = false;

    // Función para obtener el índice de una columna por su nombre
    const obtenerIndiceColumna = (nombreColumna) => {
        return cy.get('table[role="table"] thead tr th').then(($ths) => {
            let indice = -1;
            $ths.each((i, th) => {
                const textoTh = normalizarTexto(Cypress.$(th).text());
                // Limpiar el texto (quitar el ícono de ordenamiento si existe)
                const textoLimpio = textoTh.replace(/⌄|⌃|▲|▼|arrow_drop_down|arrow_drop_up/g, '').trim();

                if (textoLimpio === nombreColumna) {
                    indice = i;
                    return false; // romper el each
                }
            });
            return indice;
        });
    };

    // Función recursiva para paginar
    const buscarEnPaginaActual = (indicesColumnas = null) => {
        return cy.get('table[role="table"] tbody tr', { timeout: 10000 })
            .should('have.length.gt', 0)
            .then(($filas) => {
                // Excluir fila de "No data available"
                const $filasDatos = $filas.filter((index, row) => {
                    return !Cypress.$(row).text().includes('No data available') &&
                           !row.classList.contains('mat-no-data-row');
                });

                cy.log(`📊 Revisando ${$filasDatos.length} filas en página actual`);

                // Si no tenemos los índices, obtenerlos primero
                if (!indicesColumnas) {
                    const promesasIndices = [];
                    const nuevosIndices = {};

                    criterios.forEach(criterio => {
                        promesasIndices.push(
                            obtenerIndiceColumna(criterio.columna).then(indice => {
                                if (indice === -1) {
                                    throw new Error(`❌ Columna "${criterio.columna}" no encontrada en la tabla`);
                                }
                                nuevosIndices[criterio.columna] = indice;
                            })
                        );
                    });

                    return Cypress.Promise.all(promesasIndices).then(() => {
                        // Llamar recursivamente con los índices ya obtenidos
                        return buscarEnPaginaActual(nuevosIndices);
                    });
                }

                // Buscar en cada fila
                return cy.wrap($filasDatos).each(($fila) => {
                    if (registroEncontrado) return; // Salir si ya encontramos el registro

                    const celdas = Cypress.$($fila).find('td');

                    // Mostrar valores de la fila para debug
                    const valoresFila = {};
                    cy.log('   📋 Verificando fila:');

                    // Verificar TODOS los criterios
                    let todosCumplen = true;

                    for (const criterio of criterios) {
                        const { columna, valor } = criterio;
                        const indiceColumna = indicesColumnas[columna];

                        // Verificar que la fila tiene suficientes columnas
                        if (indiceColumna >= celdas.length) {
                            cy.log(`   ⚠️ Fila no tiene columna ${indiceColumna + 1} (solo tiene ${celdas.length})`);
                            todosCumplen = false;
                            break;
                        }

                        const valorCelda = normalizarTexto(celdas.eq(indiceColumna).text());
                        const valorEsperado = normalizarTexto(valor);

                        valoresFila[columna] = valorCelda;

                        // Verificar coincidencia
                        const coincide = valorCelda === valorEsperado;

                        cy.log(`      ${columna}: "${valorCelda}" ${coincide ? '✅' : '❌'} "${valorEsperado}"`);

                        if (!coincide) {
                            todosCumplen = false;
                            break;
                        }
                    }

                    if (todosCumplen) {
                        cy.log(`✅ ¡Registro encontrado!`);
                        registroEncontrado = true;

                        // Mostrar todos los valores para referencia
                        cy.log('   📌 Valores completos:', valoresFila);

                        // Hacer click en la fila encontrada
                        cy.wrap($fila)
                            .should('be.visible')
                            .click({ force: true });

                        return false; // Romper el each
                    }
                }).then(() => {
                    if (!registroEncontrado) {
                        // Verificar si hay siguiente página
                        return cy.get('body').then(($body) => {
                            const nextButton = $body.find('button.mat-paginator-navigation-next:not(.mat-button-disabled)');

                            if (nextButton.length > 0) {
                                cy.log('📄 Siguiente página encontrada, navegando...');
                                cy.wrap(nextButton).click({ force: true });
                                cy.wait(1000); // Esperar a que cargue la siguiente página
                                return buscarEnPaginaActual(indicesColumnas); // Recursión con los mismos índices
                            } else {
                                cy.log(`❌ No se encontró el registro después de revisar todas las páginas`);
                                throw new Error(`No se encontró el registro con criterios: ${JSON.stringify(criterios)}`);
                            }
                        });
                    }
                });
            });
    };

    // Iniciar la búsqueda
    return buscarEnPaginaActual().then(() => {
        cy.log(`✅ Registro seleccionado exitosamente`);
    });
}
    //Filtro, Buscar por Nombre
    BuscarRegistroNombre(nombre) {

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Nombre" del menú
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'Nombre')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Ingresar nombre en el input
        cy.get('#name', { timeout: 15000 })
            .should('exist')
            .clear()
            .type(nombre);

        // 4️⃣ Clic en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });
        cy.wait(2000)

        // 5️⃣ Clic en el registro encontrado en la tabla
        cy.get('.mat-row .cdk-column-name', { timeout: 15000 })
            .first()
            .should('exist')
            .click({ force: true });

    }

    BuscarRegistroNombre2(nombre) {

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Nombre" del menú
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'Nombre')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Ingresar nombre en el input
        cy.get('#entityName', { timeout: 15000 })
            .should('exist')
            .clear()
            .type(nombre);

        // 4️⃣ Clic en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 5️⃣ Clic en el registro encontrado en la tabla
        cy.get('.mat-row .cdk-column-entityName', { timeout: 15000 })
            .first()
            .should('exist')
            .click({ force: true });

    }
    //Fitro, Buscar por valor

    BuscarRegistroValor(valor) {

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Valor" del menú
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'Valor')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Ingresar valor en el input
        cy.get('#value', { timeout: 15000 }) // ⬅️ ajusta si el id es otro
            .should('exist')
            .clear()
            .type(valor);

        // 4️⃣ Clic en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 5️⃣ Clic en el valor encontrado en la tabla
        cy.get('.mat-row .cdk-column-value', { timeout: 15000 }) // ⬅️ ajusta si el nombre difiere
            .first()
            .should('exist')
            .click({ force: true });
    }

    //Filtro, Buscar por Descripcion
    BuscarRegistroDescripcion(descripcion) {

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Descripción" del menú
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'Descripción')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Ingresar descripción en el input
        cy.get('#description', { timeout: 15000 }) // ⬅️ ajusta si el id es otro
            .should('exist')
            .clear()
            .type(descripcion);

        // 4️⃣ Clic en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });
            cy.wait(1000)

        // 5️⃣ Clic en la descripción encontrada en la tabla
        cy.get('.mat-row .cdk-column-description', { timeout: 15000 }) // ⬅️ ajusta si el nombre difiere
            .first()
            .should('exist')
            .click({ force: true });
    }

    //Filtro, Buscar por Valor
    BuscarPorDivisionGeografica(valor) {

        // 1️⃣ Click en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar "División geográfica" del menú
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'División geográfica')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Seleccionar valor en el SELECT real
        cy.get('select#geographicLevel1', { timeout: 15000 })
            .should('exist')
            .select(valor);

        // 4️⃣ Click en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 5️⃣ Click en el registro encontrado (columna correcta)
        cy.get('.mat-row .cdk-column-geographicLevel1-name', { timeout: 15000 })
            .contains(valor)
            .should('be.visible')
            .click({ force: true });
    }

    BuscarRegistroUsuarioAC(buscarPor, valor) {

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Regla" del menú
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', buscarPor)
            .should('exist')
            .click({ force: true });

        // 3️⃣ Ingresar código en el input
        cy.xpath("//label[contains(normalize-space(),'"+buscarPor+"')]/following::select[1]", { timeout: 15000 })
            .should('be.visible')
            .select(valor);

        // 4️⃣ Clic en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 5️⃣ Clic en el código encontrado en la tabla
        cy.xpath("//table[@role='table']//tr[@role='row'][.//td[count(preceding-sibling::td) =count(//th[contains(translate(normalize-space(),'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ','abcdefghijklmnopqrstuvwxyzáéíóúüñ'),'usuario')]/preceding-sibling::th)and contains(translate(normalize-space(),'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ','abcdefghijklmnopqrstuvwxyzáéíóúüñ'),"+valor.toLowerCase()+")]]", { timeout: 15000 })
            .first()
            .should('exist')
            .click({ force: true });
    }


    //Filtro, Buscar por Usuario

    BuscarRegistroUsuario(usuario) {

        // 1️⃣ Click en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('be.visible')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Usuario" (este SÍ es un mat-menu)
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .should('be.visible')
            .contains('button, span', 'Usuario')
            .click({ force: true });

        // 3️⃣ Esperar el SELECT real por su LABEL "Usuario"
        cy.contains('label', 'Usuario', { timeout: 15000 })
            .should('be.visible');

        // 4️⃣ Seleccionar el usuario en el <select> REAL
        cy.get('select#user', { timeout: 15000 })
            .should('be.visible')
            .select(usuario);   // 👈 AQUÍ está la clave

        // 5️⃣ Click en la lupa (buscar)
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .parents('button')
            .should('be.visible')
            .click({ force: true });

        // 6️⃣ Click en el registro de la tabla usando el usuario
        cy.get('table', { timeout: 15000 })
            .contains('td', usuario)
            .should('be.visible')
            .click({ force: true });
    }


    BuscarRegistroNivelCajero(nombreNivelCajero) {

        // 1️⃣ Click en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('be.visible')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar "Nombre del nivel de cajero"
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, span', 'Nombre del nivel de cajero')
            .click({ force: true });

        // 3️⃣ Seleccionar en el <select> REAL (SIN CLICK)
        cy.get('select#cashierLevel', { timeout: 15000 })
            .should('be.visible')
            .select(nombreNivelCajero);   // 👈 AQUÍ ESTÁ LA CLAVE

        // 4️⃣ Click en la lupa
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .parents('button')
            .click({ force: true });

        // 5️⃣ Click en el resultado
        cy.get('table', { timeout: 15000 })
            .contains('td', nombreNivelCajero)
            .should('be.visible')
            .click({ force: true });
    }

    //Filto Buscar por Caracteristica
    BuscarRegistroCaracteristica(caracteristica) {

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Regla" del menú
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'Característica')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Ingresar código en el input
        cy.xpath("//button[.//span[normalize-space()='Buscar por']]/following::select[@id='charspec']", { timeout: 15000 })
            .should('be.visible')
            .select(caracteristica);

        // 4️⃣ Clic en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 5️⃣ Clic en la caracteristica encontrado en la tabla
        cy.xpath("//tr[@role='row'][.//td[contains(@class,'cdk-column-charspec-name')][normalize-space()='" + caracteristica + "']]", { timeout: 15000 })
        .first()
        .should('exist')
        .click({ force: true });

    }

    BuscarRegistroCaracteristicaCombo(caracteristica) {

        if (!caracteristica) return;

        const texto = caracteristica.toLowerCase();

        // 1️⃣ Click en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar "Característica"
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li, span', 'Característica')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Seleccionar la característica (aunque NO esté visible)
        cy.xpath(
            `(//select[@id='characteristicSpec']/option[contains(
            translate(normalize-space(),
            'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ',
            'abcdefghijklmnopqrstuvwxyzáéíóúüñ'),
            '${texto}'
        )])[1]`,
            { timeout: 15000 }
        )
            .should('exist')
            .then($option => {
                cy.get('#characteristicSpec')
                    .should('exist')
                    .select($option.val());
            });

        // 4️⃣ Click en la lupa
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .parents('button')
            .should('exist')
            .click({ force: true });

        // 5️⃣ Click en el registro encontrado en la tabla ✅ CORRECTO
        cy.xpath(
            `//tr[contains(@class,'mat-row')]
         [.//td[contains(@class,'cdk-column-characteristicSpec-name')]
          [contains(
            translate(normalize-space(),
            'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ',
            'abcdefghijklmnopqrstuvwxyzáéíóúüñ'),
            '${texto}'
          )]]`,
            { timeout: 15000 }
        )
            .should('exist')
            .scrollIntoView()
            .click({ force: true });
    }



    //Filto Buscar por Expresión para definir campo
    BuscarRegistroTipoMensaje(valor) {

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Regla" del menú
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'Expresión para definir campo')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Ingresar código en el input
        cy.xpath("//button[.//span[normalize-space()='Buscar por']]/following::select[@id='expressionField']", { timeout: 15000 })
            .should('be.visible')
            .type(valor);

        // 4️⃣ Clic en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 5️⃣ Clic en la caracteristica encontrado en la tabla
        cy.xpath("//tr[@role='row'][.//td[contains(@class,'cdk-column-expressionField')][normalize-space()='" + valor + "']]",{ timeout: 15000 })
            .first()
            .should('exist')
            .click({ force: true });

    }


    BuscarRegistroValorNumerico(valorNumerico) {

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Valor Numérico"
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'Valor Numérico')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Ingresar valor numérico en el input
        cy.get('#numericValue', { timeout: 15000 }) // ⚠️ ajusta el ID si es distinto
            .should('exist')
            .clear()
            .type(valorNumerico.toString());

        // 4️⃣ Clic en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 5️⃣ Clic en el registro encontrado en la tabla
        cy.get('.mat-row .cdk-column-numericValue', { timeout: 15000 }) // ⚠️ ajusta columna
            .first()
            .should('exist')
            .click({ force: true });
    }


    //Filto Buscar por Expresión para definir campo
    BuscarRegistroExpresionCampo(valor) {

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Expresión para definir campo" del menú
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'Expresión para definir campo')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Ingresar código en el input
        cy.get('#expressionField', { timeout: 15000 })   // 👈 cambia el ID si es distinto
            .should('exist')
            .clear()
            .type(valor);

        // 4️⃣ Clic en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 5️⃣ Clic en la caracteristica encontrado en la tabla
        cy.xpath("//tr[@role='row'][.//td[contains(@class,'cdk-column-expressionField')][normalize-space()='" + valor + "']]",{ timeout: 15000 })
            .first()
            .should('exist')
            .click({ force: true });

    }


    //Filto Buscar por Tipo de Mensaje
    BuscarRegistroTipoMensaje(tipoMensaje) {

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Regla" del menú
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'Tipo de mensaje')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Ingresar código en el input
        cy.xpath("//button[.//span[normalize-space()='Buscar por']]/following::select[@id='typeMessage']", { timeout: 15000 })
            .should('be.visible')
            .select(tipoMensaje);

        // 4️⃣ Clic en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 5️⃣ Clic en la caracteristica encontrado en la tabla
        cy.xpath("//tr[@role='row'][.//td[contains(@class,'cdk-column-typeMessage')][normalize-space()='" + tipoMensaje + "']]",{ timeout: 15000 })
            .first()
            .should('exist')
            .click({ force: true });

    }


    //Filtro, Buscar por Correlativo
    BuscarRegistroCorrelativo(correlativo) {

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Correlativo" del menú
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'Correlativo')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Ingresar correlativo en el input
        cy.get('#correlative, #corrCharactRequestAuth', { timeout: 15000 })   // 👈 cambia el ID si es distinto
            .should('exist')
            .clear()
            .type(correlativo);

        // 4️⃣ Clic en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 5️⃣ Clic en el correlativo encontrado en la tabla
        cy.get('.mat-row .cdk-column-correlative, .mat-row .cdk-column-corrCharactRequestAuth', { timeout: 15000 })
            .first()
            .should('exist')
            .click({ force: true });
    }


    //Filtro, Buscar por tipo de cajero
    BuscarRegistroTipoCajero(tipoCajero) {

        if (!tipoCajero || tipoCajero.toString().trim() === '') {
            cy.log('Tipo de Cajero vacío, búsqueda omitida');
            return;
        }

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Tipo Cajero"
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'Tipo de cajero')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Seleccionar tipo de cajero en el combo
        cy.get('#typeCashier', { timeout: 15000 })
            .should('exist')
            .select(tipoCajero);

        // 4️⃣ Clic en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 5️⃣ Clic en el resultado encontrado
        cy.get('.mat-row .cdk-column-typeCashier-description', { timeout: 15000 })
            .first()
            .should('exist')
            .click({ force: true });
    }


    //Filto Buscar por Arbol Raiz
    BuscarRegistroArbolRiaz(){
        cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
        cy.wait(1000)
        cy.get('.mat-menu-content > :nth-child(1)').should("be.visible").click({force:true})
        cy.wait(1000)
        cy.get('#treeRoot').should("be.visible").select("Byte S.A. (Raiz)")
        cy.wait(1000)
        cy.get('[aria-label="Click to search"]').should("be.visible").click({force:true})
        cy.wait(1000)
        cy.get('.mat-row > .cdk-column-treeRoot-name').should("be.visible").click({force:true})
        cy.wait(1000)
    }

    BuscarRegistroPais(pais) {

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "País"
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'País')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Seleccionar país en el combo
        cy.get('select#country', { timeout: 15000 })
            .should('exist')
            .select(pais);

        // 4️⃣ Clic en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 5️⃣ Clic en la fila de la tabla por el texto del país
        cy.get('.mat-row', { timeout: 15000 })
            .contains('td', pais)
            .should('exist')
            .parents('.mat-row')
            .click({ force: true });
    }

    BuscarRegistroTipoRutina(tipoRutina) {

        if (!tipoRutina || tipoRutina.toString().trim() === '') {
            cy.log('Tipo de Rutina vacío, búsqueda omitida');
            return;
        }

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .closest('button')
            .click({ force: true });

        // 2️⃣ Seleccionar "Tipo de rutina"
        cy.contains('button, .mat-menu-item, li', 'Tipo de rutina', { timeout: 15000 })
            .should('exist')
            .click({ force: true });

        // 3️⃣ Select HTML
        cy.get('#typeRoutine', { timeout: 15000 })
            .should('exist')
            .select(tipoRutina);

        // 4️⃣ Buscar
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .closest('button')
            .click({ force: true });

        // 5️⃣ Click en la fila del resultado
        cy.contains('.mat-row td', tipoRutina, { timeout: 15000 })
            .closest('.mat-row')
            .click({ force: true });
    }

    BuscarRegistroTipoFormato(tipoFormato) {

        if (!tipoFormato || tipoFormato.toString().trim() === '') {
            cy.log('Tipo de Formato vacío, búsqueda omitida');
            return;
        }

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Tipo de Formato"
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'Tipo de Formato')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Seleccionar tipo de formato
        cy.get('#formatType', { timeout: 15000 }) // 👈 ESTE ID SÍ EXISTE
            .should('exist')
            .select(tipoFormato);

        // 4️⃣ Click en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 5️⃣ Click en el resultado (columna REAL)
        cy.get('.mat-row .cdk-column-formatType', { timeout: 15000 })
            .first()
            .should('be.visible')
            .click({ force: true });
    }




    //Modificar
    BtnModificarRegistro(){
        cy.log('Clic en botón EDITAR');

        cy.contains('mat-icon', 'edit', { timeout: 15000 })
            .parents('button')
            .should('exist')
            .click({ force: true });
    }

    //Eliminar
    EliminarRegistro(){
        cy.log('Clic en botón ELIMINAR');

        // 1️⃣ Clic en ícono ELIMINAR
        cy.contains('mat-icon', 'delete', { timeout: 15000 })
            .parents('button')
            .should('exist')
            .click({ force: true });

        // 2️⃣ Confirmar eliminación (botón Eliminar)
        cy.contains('span.mat-button-wrapper', 'Eliminar', { timeout: 15000 })
            .parents('button')
            .should('exist')
            .click({ force: true });

        cy.wait(1000)
    }

    //Navegacion a SubMenus

    NavegacionSubMenu(opcion) {

        // 1️⃣ Abrir menú
        cy.contains('mat-icon', 'menu_open', { timeout: 15000 })
            .parents('button')
            .should('exist')
            .click({ force: true });

        // 2️⃣ Clic en opción del submenú (li)
        cy.contains('li', opcion, { timeout: 15000 })
            .should('be.visible')
            .click({ force: true });
    }

    BuscarRegistroProceso(proceso) {

        if (!proceso || proceso.toString().trim() === '') {
            cy.log('Proceso vacío, búsqueda omitida');
            return;
        }

        // 1️⃣ Click en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .closest('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Proceso" del mat-menu
        cy.get('body', { timeout: 15000 }).then($body => {

            if ($body.find('.cdk-overlay-pane').length > 0) {

                cy.get('.cdk-overlay-pane')
                    .last()
                    .within(() => {
                        cy.contains('button, .mat-menu-item', 'Proceso')
                            .should('exist')
                            .click({ force: true });
                    });

            } else {
                throw new Error('No se desplegó el menú "Buscar por"');
            }
        });

        // 3️⃣ Seleccionar Proceso (select HTML nativo)
        cy.get('#process', { timeout: 15000 })
            .should('exist')
            .should('not.be.disabled')
            .select(proceso);

        // 4️⃣ Click en BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .closest('button')
            .should('exist')
            .click({ force: true });

        // 5️⃣ Click en la fila del resultado (columna Proceso)
        cy.contains(
            '.mat-row td, .mat-row .cdk-column-process',
            proceso,
            { timeout: 15000 }
        )
            .should('exist')
            .closest('.mat-row')
            .click({ force: true });
    }



    //Regredar

    Regresar(){
        cy.contains('mat-icon', 'arrow_back', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });
    }

  /*  RegresarN(veces) {

        let chain = cy.wrap(null)

        for (let i = 0; i < veces; i++) {

            chain = chain.then(() => {

                cy.log(`🔙 Regreso ${i + 1}`)

                cy.get('mat-progress-spinner', { timeout: 15000 })
                    .should('not.exist')

                return cy.contains('mat-icon', 'arrow_back', { timeout: 10000 })
                    .should('be.visible')
                    .click({ force: true })
            })
        }

        return chain
    }*/

    //Seleccionar Memu

    SelectMenuOpcion(texto) {
        cy.log(`Clic en menú: ${texto}`);

        cy.contains('.mat-list-item-content', texto, { timeout: 15000 })
            .filter(":visible:not([disabled])")
            .first()
            .scrollIntoView()
            .should("be.visible")
            .click({ force: true });
    }

    IrAPantalla(ruta) {
        cy.log(`Navegando a: #/${ruta}`);
        cy.window().then(win => {
            win.location.hash = `#/${ruta}`;
            cy.wait(2000)
        });
    }


    Login(URL, Usuario, Password) {
        //visitamos la pagina indicada en cypress.config.js
        cy.visit(URL);
        cy.wait(3000) //necesario
        //buesca en el cuerpo de la pagina si aparece el selector
        cy.get('body').then(($body) => {
            if ($body.find('#kc-login').length > 0) {

                cy.log('Se encontró el texto, ejecutando login');
                //validando campo usuario
                cy.get("label").then(($label) => {
                       // if ($label.text().includes("Usuario o email")) {
                        if ($label.text().includes("Usuario")) {
                            cy.get("input").eq(0).should("be.visible").type(Usuario);
                        } else {
                            // Si el label no contiene el texto esperado, muestra un log
                            console.log("El label no tiene el texto esperado.");
                            cy.log("El label no tiene el texto esperado.");
                        }
                    }
                )
                // Validando campo Contraseña
                cy.get("label").then(($label) => {
                        if ($label.text().includes("Contraseña")) {
                            // Si el texto del label es correcto, llena el campo desde el archivo json
                            cy.get("input").eq(1).should("be.visible").type(Password);
                        } else {
                            // Si el label no contiene el texto esperado, muestra un log
                            console.log("El label no tiene el texto esperado.");
                            cy.log("El label no tiene el texto esperado.");
                        }
                    }
                )
                // Hacer clic en el botón de login
                cy.get("#kc-login").should("be.visible").click({ force: true });
                cy.wait(2000);
            } else {
                cy.log('Ya estás logeado.');
            }
        })
        this.esperarOcultarSpinner()
    }


    espera(){
        cy.get('body').then(($body) => {
            if ($body.find('.ng-star-inserted').length > 0) {
                // Solo espera si realmente es visible
                cy.get('.ng-star-inserted', { timeout: 10000 }).should('not.be.visble')
            } else {
                cy.log('✅ El elemento nunca apareció, continuando...')
            }
        })
    }
    _ejecutarEnContexto(callback, skipContext = false) {
        // Si skipContext es true, forzamos la ejecución directa
        if (skipContext) {
            callback();
            return;
        }

        // Detectar si ya estamos dentro de un iframe
        cy.document().then(doc => {
            const isInIframe = doc.defaultView && doc.defaultView.parent !== doc.defaultView;

            if (isInIframe) {
                cy.log('📌 Ya estamos dentro del iframe, ejecutando directamente');
                callback();
            } else {
                // No estamos en iframe, procedemos a buscarlo
                cy.get('iframe.frame', { timeout: 5000, failOnStatusCode: false }).then(($iframe) => {
                    if ($iframe.length > 0) {
                        cy.wrap($iframe)
                            .its('0.contentDocument.body')
                            .should('not.be.empty')
                            .then(cy.wrap)
                            .within(callback);
                    } else {
                        callback();
                    }
                });
            }
        });
    }
    /*
    * Versión de seleccionarCombo que maneja iframe automáticamente
    */
    // seleccionarComboIframe(valor, labelText, opciones = {}) {
    //     // Extraer el valor real si es un objeto (igual que antes)
    //     let valorReal = valor;
    //     if (valor && typeof valor === 'object') {
    //         cy.log(`⚠️ valor es un objeto: ${JSON.stringify(valor)}`);
    //         if (valor.tipoFormato) {
    //             valorReal = valor.tipoFormato;
    //             cy.log(`✅ Usando valor.tipoFormato: "${valorReal}"`);
    //         } else {
    //             const propiedades = Object.values(valor);
    //             const propiedadString = propiedades.find(p => typeof p === 'string');
    //             if (propiedadString) {
    //                 valorReal = propiedadString;
    //                 cy.log(`✅ Usando primera propiedad string: "${valorReal}"`);
    //             } else {
    //                 valorReal = String(valor);
    //                 cy.log(`⚠️ No se pudo extraer string, usando: "${valorReal}"`);
    //             }
    //         }
    //     }

    //     const {
    //         ignorarTildes = true,
    //         ignorarMayusculas = true,
    //         ignorarEspacios = true,
    //         timeout = 10000,
    //         force = false,
    //         skipContext = false,
    //         iframeTimeout = 5000,
    //         usarBusqueda = false  // Nuevo: si es true, usa el campo de búsqueda; si es false, intenta clic directo con force
    //     } = opciones;

    //     // Validación mejorada
    //     if (valorReal == null || (typeof valorReal === 'string' && valorReal.trim() === '')) {
    //         cy.log(`⏭️ Valor vacío o nulo para combo "${Array.isArray(labelText) ? labelText.join('" o "') : labelText}" - se omite`);
    //         return;
    //     }

    //     cy.log(`🔍 Seleccionando "${valorReal}" en combo "${labelText}"`);

    //     const valorString = String(valorReal);
    //     const forceOption = force === true;

    //     const normalizarTexto = (texto) => {
    //         if (!texto) return texto;
    //         let resultado = String(texto);
    //         if (ignorarTildes) {
    //             resultado = resultado.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    //         }
    //         if (ignorarMayusculas) {
    //             resultado = resultado.toLowerCase();
    //         }
    //         if (ignorarEspacios) {
    //             resultado = resultado.trim().replace(/\s+/g, ' ');
    //         }
    //         return resultado;
    //     };

    //     const ejecutarSeleccion = () => {
    //         const labelsArray = Array.isArray(labelText) ? labelText : [labelText];
    //         let labelEncontrado = false;
    //         let intentoActual = 0;

    //         const probarSiguienteLabel = () => {
    //             if (intentoActual >= labelsArray.length) {
    //                 if (!labelEncontrado) {
    //                     throw new Error(`❌ No se encontró ningún label con los textos: ${labelsArray.join(', ')}`);
    //                 }
    //                 return;
    //             }

    //             const labelActual = labelsArray[intentoActual];
    //             cy.log(`🔍 Intentando con label: "${labelActual}"`);

    //             const labelNormalizado = normalizarTexto(labelActual);

    //             cy.get('mat-form-field:has(mat-select)', { timeout }).then($formFields => {
    //                 let $mejorCampo = null;
    //                 let mejorPuntaje = -1;
    //                 let mejorCoincidencia = null;

    //                 $formFields.each((index, field) => {
    //                     const $field = Cypress.$(field);
    //                     const $label = $field.find('mat-label, label, .mat-label, .mat-form-field-label');

    //                     if ($label.length) {
    //                         const textoLabel = $label.first().text().trim();
    //                         const textoLabelNormalizado = normalizarTexto(textoLabel);

    //                         let puntaje = 0;
    //                         if (textoLabelNormalizado === labelNormalizado) {
    //                             puntaje = 100;
    //                         } else if (textoLabelNormalizado.replace(/\s*\*\s*/g, '') === labelNormalizado) {
    //                             puntaje = 90;
    //                         } else if (textoLabelNormalizado.startsWith(labelNormalizado + ' ')) {
    //                             puntaje = 80;
    //                         } else if (textoLabelNormalizado.match(new RegExp(`\\b${labelNormalizado}\\b`))) {
    //                             puntaje = 70;
    //                         } else if (textoLabelNormalizado.includes(labelNormalizado)) {
    //                             puntaje = 50;
    //                         } else if (labelNormalizado.includes(textoLabelNormalizado)) {
    //                             puntaje = 30;
    //                         }

    //                         cy.log(`📝 "${textoLabel}" → puntaje: ${puntaje}`);

    //                         if (puntaje > mejorPuntaje) {
    //                             mejorPuntaje = puntaje;
    //                             $mejorCampo = $field;
    //                             mejorCoincidencia = textoLabel;
    //                         }
    //                     }
    //                 });

    //                 if ($mejorCampo && mejorPuntaje >= 50) {
    //                     labelEncontrado = true;
    //                     cy.log(`✅ Mejor coincidencia: "${mejorCoincidencia}" (puntaje: ${mejorPuntaje})`);

    //                     cy.wrap($mejorCampo).find('mat-select').as('select');

    //                     cy.get('@select').then($select => {
    //                         const valorActual = $select.find('.mat-select-value-text span, .mat-select-min-line').first().text().trim();
    //                         const valorActualNormalizado = normalizarTexto(valorActual);
    //                         const valorNormalizado = normalizarTexto(valorString);

    //                         cy.log(`📌 Valor actual: "${valorActual || 'vacío'}"`);
    //                         cy.log(`🎯 Valor deseado: "${valorString}"`);

    //                         if (valorActualNormalizado === valorNormalizado || valorActualNormalizado.includes(valorNormalizado)) {
    //                             cy.log(`⏭️ Ya tiene el valor correcto, no se requiere cambio.`);
    //                             return;
    //                         }

    //                         cy.get('@select').click({ force: forceOption });

    //                         // Esperar a que el panel aparezca
    //                         cy.get('.cdk-overlay-pane', { timeout }).should('be.visible');

    //                         // Buscar la opción deseada visualmente
    //                         cy.get('.cdk-overlay-pane mat-option').then($options => {
    //                             let $opcion = null;
    //                             $options.each((i, opt) => {
    //                                 const textoOpcion = Cypress.$(opt).text().trim();
    //                                 const textoOpcionNormalizado = normalizarTexto(textoOpcion);
    //                                 if (textoOpcionNormalizado === valorNormalizado || textoOpcionNormalizado.includes(valorNormalizado)) {
    //                                     $opcion = Cypress.$(opt);
    //                                     return false;
    //                                 }
    //                             });

    //                             if ($opcion) {
    //                                 // Intentar hacer clic en la opción (con force si se desea)
    //                                 cy.wrap($opcion).scrollIntoView().then(() => {
    //                                     if (usarBusqueda) {
    //                                         // Si se prefiere usar búsqueda, se podría activar aquí
    //                                         // Pero como no quieres escribir, simplemente hacemos clic con force si es necesario
    //                                         cy.wrap($opcion).click({ force: forceOption });
    //                                     } else {
    //                                         // Intentar clic normal, pero si falla por visibilidad, usar force
    //                                         cy.wrap($opcion).click({ force: forceOption });
    //                                     }
    //                                 });
    //                             } else {
    //                                 // Opción no encontrada visualmente, recurrir al campo de búsqueda si está permitido
    //                                 if (usarBusqueda) {
    //                                     cy.log('⚠️ Opción no encontrada visualmente, usando campo de búsqueda');
    //                                     cy.get('.cdk-overlay-pane input[placeholder="Buscar"]')
    //                                         .should('be.visible')
    //                                         .type(valorString, { force: forceOption, delay: 100 });
    //                                     cy.wait(500);
    //                                     cy.get('.cdk-overlay-pane mat-option').first().should('be.visible').click({ force: forceOption });
    //                                 } else {
    //                                     throw new Error(`❌ No se encontró opción "${valorString}" en el combo y la búsqueda está deshabilitada`);
    //                                 }
    //                             }

    //                             cy.get('.cdk-overlay-backdrop', { timeout: 5000 }).should('not.exist');
    //                             cy.log(`✅ Seleccionado "${valorString}" en combo "${labelText}"`);
    //                         });
    //                     });
    //                 } else if (!labelEncontrado && intentoActual < labelsArray.length - 1) {
    //                     intentoActual++;
    //                     probarSiguienteLabel();
    //                 } else {
    //                     throw new Error(`❌ No se encontró campo con label que coincida con "${labelsArray.join('", "')}"`);
    //                 }
    //             });
    //         };

    //         probarSiguienteLabel();
    //     };

    //     this._ejecutarEnContexto(ejecutarSeleccion, skipContext);
    // }
    seleccionarComboIframe(valor, labelText, opciones = {}) {
        // Extraer el valor real si es un objeto (igual que antes)
        let valorReal = valor;
        if (valor && typeof valor === 'object') {
            cy.log(`⚠️ valor es un objeto: ${JSON.stringify(valor)}`);
            if (valor.tipoFormato) {
                valorReal = valor.tipoFormato;
                cy.log(`✅ Usando valor.tipoFormato: "${valorReal}"`);
            } else {
                const propiedades = Object.values(valor);
                const propiedadString = propiedades.find(p => typeof p === 'string');
                if (propiedadString) {
                    valorReal = propiedadString;
                    cy.log(`✅ Usando primera propiedad string: "${valorReal}"`);
                } else {
                    valorReal = String(valor);
                    cy.log(`⚠️ No se pudo extraer string, usando: "${valorReal}"`);
                }
            }
        }

        const {
            ignorarTildes = true,
            ignorarMayusculas = true,
            ignorarEspacios = true,
            timeout = 10000,
            force = false,
            skipContext = false,
            iframeTimeout = 5000,
            usarBusqueda = false
        } = opciones;

        // Validación mejorada
        if (valorReal == null || (typeof valorReal === 'string' && valorReal.trim() === '')) {
            cy.log(`⏭️ Valor vacío o nulo para combo "${Array.isArray(labelText) ? labelText.join('" o "') : labelText}" - se omite`);
            return;
        }

        cy.log(`🔍 Seleccionando "${valorReal}" en combo "${labelText}"`);

        const valorString = String(valorReal);
        const forceOption = force === true;

        const normalizarTexto = (texto) => {
            if (!texto) return texto;
            let resultado = String(texto);
            if (ignorarTildes) {
                resultado = resultado.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            }
            if (ignorarMayusculas) {
                resultado = resultado.toLowerCase();
            }
            if (ignorarEspacios) {
                resultado = resultado.trim().replace(/\s+/g, ' ');
            }
            return resultado;
        };

        const ejecutarSeleccion = () => {
            const labelsArray = Array.isArray(labelText) ? labelText : [labelText];
            let labelEncontrado = false;
            let intentoActual = 0;

            const probarSiguienteLabel = () => {
                if (intentoActual >= labelsArray.length) {
                    if (!labelEncontrado) {
                        throw new Error(`❌ No se encontró ningún label con los textos: ${labelsArray.join(', ')}`);
                    }
                    return;
                }

                const labelActual = labelsArray[intentoActual];
                cy.log(`🔍 Intentando con label: "${labelActual}"`);

                const labelNormalizado = normalizarTexto(labelActual);

                cy.get('mat-form-field:has(mat-select)', { timeout }).then($formFields => {
                    // 🔥 FILTRO DE VISIBILIDAD: Primero tomamos solo los visibles
                    const $visibleFields = $formFields.filter(':visible');
                    // Si hay visibles, usamos esos; si no, usamos todos (por si acaso)
                    const $camposAEvaluar = $visibleFields.length ? $visibleFields : $formFields;

                    let $mejorCampo = null;
                    let mejorPuntaje = -1;
                    let mejorCoincidencia = null;

                    $camposAEvaluar.each((index, field) => {
                        const $field = Cypress.$(field);
                        const $label = $field.find('mat-label, label, .mat-label, .mat-form-field-label');

                        if ($label.length) {
                            const textoLabel = $label.first().text().trim();
                            const textoLabelNormalizado = normalizarTexto(textoLabel);

                            let puntaje = 0;
                            if (textoLabelNormalizado === labelNormalizado) {
                                puntaje = 100;
                            } else if (textoLabelNormalizado.replace(/\s*\*\s*/g, '') === labelNormalizado) {
                                puntaje = 90;
                            } else if (textoLabelNormalizado.startsWith(labelNormalizado + ' ')) {
                                puntaje = 80;
                            } else if (textoLabelNormalizado.match(new RegExp(`\\b${labelNormalizado}\\b`))) {
                                puntaje = 70;
                            } else if (textoLabelNormalizado.includes(labelNormalizado)) {
                                puntaje = 50;
                            } else if (labelNormalizado.includes(textoLabelNormalizado)) {
                                puntaje = 30;
                            }

                            cy.log(`📝 "${textoLabel}" → puntaje: ${puntaje}`);

                            if (puntaje > mejorPuntaje) {
                                mejorPuntaje = puntaje;
                                $mejorCampo = $field;
                                mejorCoincidencia = textoLabel;
                            }
                        }
                    });

                    if ($mejorCampo && mejorPuntaje >= 50) {
                        labelEncontrado = true;
                        cy.log(`✅ Mejor coincidencia: "${mejorCoincidencia}" (puntaje: ${mejorPuntaje})`);

                        cy.wrap($mejorCampo).find('mat-select').as('select');

                        cy.get('@select').then($select => {
                            const valorActual = $select.find('.mat-select-value-text span, .mat-select-min-line').first().text().trim();
                            const valorActualNormalizado = normalizarTexto(valorActual);
                            const valorNormalizado = normalizarTexto(valorString);

                            cy.log(`📌 Valor actual: "${valorActual || 'vacío'}"`);
                            cy.log(`🎯 Valor deseado: "${valorString}"`);

                            if (valorActualNormalizado === valorNormalizado || valorActualNormalizado.includes(valorNormalizado)) {
                                cy.log(`⏭️ Ya tiene el valor correcto, no se requiere cambio.`);
                                return;
                            }

                            cy.get('@select').click({ force: forceOption });

                            cy.get('.cdk-overlay-pane', { timeout }).should('be.visible');

                            cy.get('.cdk-overlay-pane mat-option').then($options => {
                                let $opcion = null;
                                $options.each((i, opt) => {
                                    const $opt = Cypress.$(opt);
                                    if ($opt.hasClass('mdc-list-item--disabled')) {
                                        cy.log(`⚠️ Ignorando opción deshabilitada: "${$opt.text().trim()}"`);
                                        return;
                                    }
                                    const textoOpcion = $opt.text().trim();
                                    const textoOpcionNormalizado = normalizarTexto(textoOpcion);
                                    if (textoOpcionNormalizado === valorNormalizado || textoOpcionNormalizado.includes(valorNormalizado)) {
                                        $opcion = $opt;
                                        return false;
                                    }
                                });

                                if ($opcion) {
                                    cy.wrap($opcion).scrollIntoView().click({ force: forceOption });
                                } else {
                                    if (usarBusqueda) {
                                        cy.log('⚠️ Opción no encontrada visualmente, usando campo de búsqueda');
                                        cy.get('.cdk-overlay-pane input[placeholder="Buscar"]')
                                            .should('be.visible')
                                            .type(valorString, { force: forceOption, delay: 100 });
                                        cy.wait(500);
                                        cy.get('.cdk-overlay-pane mat-option').first().should('be.visible').click({ force: forceOption });
                                    } else {
                                        throw new Error(`❌ No se encontró opción habilitada "${valorString}" en el combo y la búsqueda está deshabilitada`);
                                    }
                                }

                                cy.get('.cdk-overlay-backdrop', { timeout: 5000 }).should('not.exist');
                                cy.log(`✅ Seleccionado "${valorString}" en combo "${labelText}"`);
                            });
                        });
                    } else if (!labelEncontrado && intentoActual < labelsArray.length - 1) {
                        intentoActual++;
                        probarSiguienteLabel();
                    } else {
                        throw new Error(`❌ No se encontró campo con label que coincida con "${labelsArray.join('", "')}"`);
                    }
                });
            };

            probarSiguienteLabel();
        };

        this._ejecutarEnContexto(ejecutarSeleccion, skipContext);
        this.esperarQueSpinnerDesaparezca({ timeout: 10000 })
    }

    /**
     * Versión de llenarCampo que maneja iframe automáticamente
     */
    llenarCampoIframe(valor, labelText, opciones = {}) {
        const {
            limpiar = true,
            delay = 10,
            timeout = 10000,
            trim = true,
            normalizarTildes = true,
            ignorarTildesEnBusqueda = true,
            escribirConTildes = true,
            ignorarMayusculas = true,
            scrollBehavior = 'center',
            ensureScrollable = true,
            force = false,
            skipContext = false  // ← NUEVA OPCIÓN
        } = opciones;

        const ejecutar = () => {
            // --- Validación de valor vacío ---
            if (valor == null || (typeof valor === 'string' && valor.trim() === '')) {
                const labelParaMostrar = Array.isArray(labelText) ? labelText.join(', ') : labelText;
                cy.log(`⏭️ Valor vacío o nulo para "${labelParaMostrar}", se omite procesamiento.`);
                return;
            }

            // Función para normalizar texto (quitar tildes)
            const normalizarTildesFunc = (texto) => {
                if (!texto) return texto;
                return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            };

            // Función para normalizar COMPLETAMENTE (tildes + minúsculas)
            const normalizarCompleto = (texto) => {
                if (!texto) return texto;
                let resultado = String(texto);

                if (normalizarTildes) {
                    resultado = normalizarTildesFunc(resultado);
                }

                if (ignorarMayusculas) {
                    resultado = resultado.toLowerCase();
                }

                return resultado.trim().replace(/\s+/g, ' ');
            };

            // Procesar el valor a escribir
            let valorAEscribir = String(valor);
            if (trim) valorAEscribir = valorAEscribir.trim();

            const valorOriginal = valorAEscribir;

            if (!escribirConTildes) {
                valorAEscribir = normalizarTildesFunc(valorAEscribir);
            }

            cy.log(`🔍 Original: "${valorOriginal}" | Escribirá: "${valorAEscribir}"`);

            // Convertir labelText a array si es string
            const posiblesLabels = Array.isArray(labelText) ? labelText : [labelText];

            cy.log(`📋 Buscando entre ${posiblesLabels.length} posible(s) label(s):`);
            posiblesLabels.forEach((label, idx) => {
                cy.log(`   Opción ${idx + 1}: "${label}"`);
            });

            // Normalizar todas las opciones de búsqueda
            const opcionesNormalizadas = posiblesLabels.map(label => normalizarCompleto(label));

            // Buscar el label entre todas las opciones
            const buscarLabel = () => {
                return cy.get('label, mat-label, span.label', { timeout })
                    .then($labels => {
                        let $mejorCoincidencia = null;
                        let mejorCoincidenciaTexto = '';
                        let mejorPuntaje = -1;

                        $labels.each((index, el) => {
                            const textEl = Cypress.$(el).text().trim();
                            const textNormalizado = normalizarCompleto(textEl);

                            // Evaluar contra cada opción de búsqueda
                            opcionesNormalizadas.forEach((opcionNormalizada, idx) => {
                                const opcionOriginal = posiblesLabels[idx];
                                let puntaje = 0;

                                // Coincidencia exacta (mejor)
                                if (textNormalizado === opcionNormalizada) {
                                    puntaje = 100;
                                }
                                // Coincidencia exacta ignorando asteriscos
                                else if (textNormalizado.replace(/\s*\*\s*/g, '') === opcionNormalizada) {
                                    puntaje = 90;
                                }
                                // Label comienza con el texto buscado
                                else if (textNormalizado.startsWith(opcionNormalizada + ' ')) {
                                    puntaje = 80;
                                }
                                // Label contiene el texto buscado
                                else if (textNormalizado.includes(opcionNormalizada)) {
                                    puntaje = 70;
                                }
                                // El texto buscado contiene el label (coincidencia parcial)
                                else if (opcionNormalizada.includes(textNormalizado)) {
                                    puntaje = 50;
                                }

                                if (puntaje > mejorPuntaje) {
                                    mejorPuntaje = puntaje;
                                    $mejorCoincidencia = cy.$$(el);
                                    mejorCoincidenciaTexto = textEl;
                                    cy.log(`   Posible match: "${textEl}" con opción "${opcionOriginal}" (puntaje: ${puntaje})`);
                                }
                            });
                        });

                        if ($mejorCoincidencia && mejorPuntaje >= 50) { // Umbral mínimo
                            cy.log(`✅ Mejor coincidencia: "${mejorCoincidenciaTexto}" (puntaje: ${mejorPuntaje})`);
                            return cy.wrap($mejorCoincidencia);
                        }

                        // Si no encuentra, mostrar todos los labels disponibles
                        cy.log(`❌ No se encontró label para ninguna opción`);
                        cy.log('📋 Labels disponibles:');
                        $labels.each((i, el) => {
                            const texto = Cypress.$(el).text().trim();
                            cy.log(`   ${i}: "${texto}" (normalizado: "${normalizarCompleto(texto)}")`);
                        });

                        throw new Error(`No se encontró campo para ninguno de los labels: ${posiblesLabels.join(', ')}`);
                    });
            };

            buscarLabel()
                .should('be.visible')
                .then($label => {
                    const inputId = $label.attr('for');

                    const encontrarInput = () => {
                        if (inputId) {
                            return cy.get(`#${inputId}`);
                        } else {
                            return cy.wrap($label)
                                .parents('.mat-form-field, .form-group')
                                .find('input, textarea, select')
                                .first();
                        }
                    };

                    encontrarInput()
                        .should('be.visible')
                        .then($input => {
                            cy.wrap($input).scrollIntoView({
                                duration: 300,
                                easing: 'linear',
                                offset: { top: -100, left: 0 },
                                ensureScrollable: ensureScrollable
                            });

                            cy.wait(200);

                            // Si force está activado, hacemos clic en el form-field para que el label flote
                            if (force) {
                                cy.wrap($label).parents('mat-form-field').click({ force: true });
                                cy.wait(100);
                            }

                            if (limpiar) {
                                // Usamos force en clear si está habilitado
                                cy.wrap($input).clear({ force });
                                cy.wait(100);
                            }

                            // Usamos force en type si está habilitado
                            cy.wrap($input).type(valorAEscribir, { delay, force });

                            // Mostrar qué label se usó realmente
                            const labelUsado = $label.text().trim();
                            cy.log(`✅ Escrito: "${valorAEscribir}" en campo "${labelUsado}"`);
                        });
                });
        };
        if (skipContext) {
            ejecutar();
        } else if (this._ejecutarEnContexto) {
            this._ejecutarEnContexto(ejecutar);
        } else {
            ejecutar();
        }
    }


    /*llenarCampoIframe(valor, labelText, opciones = {}) {
        const {
            limpiar = true,
            delay = 10,
            timeout = 10000,
            trim = true,
            normalizarTildes = true,
            ignorarTildesEnBusqueda = true,
            escribirConTildes = true,
            ignorarMayusculas = true,
            scrollBehavior = 'center',
            ensureScrollable = true,
            force = false,
            skipContext = false
        } = opciones;

        const ejecutar = () => {
            // --- Validación de valor vacío ---
            if (valor == null || (typeof valor === 'string' && valor.trim() === '')) {
                const labelParaMostrar = Array.isArray(labelText) ? labelText.join(', ') : labelText;
                cy.log(`⏭️ Valor vacío o nulo para "${labelParaMostrar}", se omite procesamiento.`);
                return;
            }

            // Función para normalizar texto
            const normalizarTildesFunc = (texto) => {
                if (!texto) return texto;
                return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            };

            const normalizarCompleto = (texto) => {
                if (!texto) return texto;
                let resultado = String(texto);

                if (normalizarTildes) {
                    resultado = normalizarTildesFunc(resultado);
                }

                if (ignorarMayusculas) {
                    resultado = resultado.toLowerCase();
                }

                return resultado.trim().replace(/\s+/g, ' ');
            };

            // Procesar el valor a escribir
            let valorAEscribir = String(valor);
            if (trim) valorAEscribir = valorAEscribir.trim();

            const valorOriginal = valorAEscribir;

            if (!escribirConTildes) {
                valorAEscribir = normalizarTildesFunc(valorAEscribir);
            }

            cy.log(`🔍 Original: "${valorOriginal}" | Escribirá: "${valorAEscribir}"`);

            const posiblesLabels = Array.isArray(labelText) ? labelText : [labelText];
            const opcionesNormalizadas = posiblesLabels.map(label => normalizarCompleto(label));

            // Buscar el label
            cy.get('label, mat-label, span.label', { timeout })
                .then($labels => {
                    let $mejorCoincidencia = null;
                    let mejorPuntaje = -1;

                    $labels.each((index, el) => {
                        const textEl = Cypress.$(el).text().trim();
                        const textNormalizado = normalizarCompleto(textEl);

                        opcionesNormalizadas.forEach((opcionNormalizada, idx) => {
                            const opcionOriginal = posiblesLabels[idx];
                            let puntaje = 0;

                            if (textNormalizado === opcionNormalizada) {
                                puntaje = 100;
                            }
                            else if (textNormalizado.replace(/\s*\*\s*!/g, '') === opcionNormalizada) {
                                puntaje = 90;
                            }
                            else if (textNormalizado.startsWith(opcionNormalizada + ' ')) {
                                puntaje = 80;
                            }
                            else if (textNormalizado.includes(opcionNormalizada)) {
                                puntaje = 70;
                            }
                            else if (opcionNormalizada.includes(textNormalizado)) {
                                puntaje = 50;
                            }

                            if (puntaje > mejorPuntaje) {
                                mejorPuntaje = puntaje;
                                $mejorCoincidencia = cy.$$(el);
                                cy.log(`   Match: "${textEl}" (${puntaje})`);
                            }
                        });
                    });

                    if (!$mejorCoincidencia) {
                        throw new Error(`No se encontró label: ${posiblesLabels.join(', ')}`);
                    }

                    const $label = $mejorCoincidencia;
                    const inputId = $label.attr('for');

                    // Encontrar el input asociado
                    let $inputPromise;
                    if (inputId) {
                        $inputPromise = cy.get(`#${inputId}`, { timeout });
                    } else {
                        $inputPromise = cy.wrap($label)
                            .parents('.mat-form-field, .form-group')
                            .find('input, textarea, select')
                            .first();
                    }

                    $inputPromise
                        // .should('be.visible')  ← ELIMINADO
                        .then($input => {
                            // Intentar scroll pero sin verificar visibilidad
                            cy.wrap($input).scrollIntoView({
                                duration: 300,
                                easing: 'linear',
                                offset: { top: -100, left: 0 },
                                ensureScrollable: false
                            }).then(() => {
                                // Si falla el scroll, continuamos igual
                                cy.log('   Scroll realizado (puede que no sea visible)');
                            });

                            cy.wait(200);

                            // Click directo con force
                            cy.wrap($input).click({ force: true });
                            cy.wait(100);

                            if (limpiar) {
                                cy.wrap($input).clear({ force: true });
                                cy.wait(100);
                            }

                            cy.wrap($input).type(valorAEscribir, { delay, force: true });

                            cy.log(`✅ Escrito en campo asociado a "${$label.text().trim()}"`);
                        });
                });
        };

        if (skipContext) {
            ejecutar();
        } else if (this._ejecutarEnContexto) {
            this._ejecutarEnContexto(ejecutar);
        } else {
            ejecutar();
        }
    }*/

    /**
     * Versión de checkbox que maneja iframe automáticamente o no con skipcontext
     */
    checkboxIframe(valor, labelText, opciones = {}) {
        const {
            timeout = 10000,
            force = false,
            skipContext = false
        } = opciones;

        // Manejar si valor es objeto (similar a combo)
        let valorReal = valor;
        if (valor && typeof valor === 'object') {
            cy.log(`⚠️ checkbox valor es objeto: ${JSON.stringify(valor)}`);
            if (valor.hasOwnProperty('esMandatorio')) {
                valorReal = valor.esMandatorio;
            } else {
                const props = Object.values(valor);
                const propString = props.find(p => typeof p === 'string' || typeof p === 'boolean');
                if (propString !== undefined) valorReal = propString;
                else valorReal = Boolean(valor);
            }
        }

        if (valorReal == null || (typeof valorReal === 'string' && valorReal.trim() === '')) {
            cy.log(`⏭️ Valor vacío o nulo para checkbox "${labelText}" - se omite`);
            return;
        }

        cy.log(`🔍 Procesando checkbox "${labelText}" con valor: ${valorReal}`);

        const ejecutar = () => {
            const valorBooleano = typeof valorReal === 'string'
                ? ['true', '1', 'sí', 'si', 'yes'].includes(valorReal.toLowerCase().trim())
                : Boolean(valorReal);

            // Buscar el label por texto
            cy.contains('mat-label, label, .mat-label', new RegExp(labelText, 'i'), { timeout })
                .should('be.visible')
                .then($label => {
                    // Estrategias para encontrar el mat-checkbox asociado:
                    let $checkbox = $label.closest('mat-checkbox'); // Caso 1: label dentro de mat-checkbox

                    if ($checkbox.length === 0) {
                        // Caso 2: label con atributo 'for' apuntando al input
                        const forAttr = $label.attr('for');
                        if (forAttr) {
                            $checkbox = Cypress.$(`mat-checkbox#${forAttr}, input#${forAttr}`).closest('mat-checkbox');
                        }
                    }

                    if ($checkbox.length === 0) {
                        // Caso 3: buscar en padres cercanos
                        $checkbox = $label.parents().find('mat-checkbox').first();
                    }

                    expect($checkbox, `No se encontró mat-checkbox para label "${labelText}"`).to.exist;

                    // Verificar estado actual
                    cy.wrap($checkbox).then($cb => {
                        const isChecked = $cb.hasClass('mat-checked') ||
                                        $cb.find('input[type="checkbox"]').is(':checked') ||
                                        $cb.attr('aria-checked') === 'true';

                        cy.log(`📌 Estado actual: ${isChecked ? 'checked' : 'unchecked'}`);

                        if ((valorBooleano && !isChecked) || (!valorBooleano && isChecked)) {
                            cy.wrap($cb).click({ force });
                            cy.log(`✅ Checkbox "${labelText}" cambiado a ${valorBooleano ? 'checked' : 'unchecked'}`);
                        } else {
                            cy.log(`⏭️ Checkbox "${labelText}" ya tiene el estado correcto`);
                        }
                    });
                });
        };

        this._ejecutarEnContexto(ejecutar, skipContext);
    }

    /**
     * Versión de slideToggle que maneja iframe automaticamente o no con skipcontext
     */
    slideToggleIframe(valor, labelText, opciones = {}) {
        const {
            timeout = 10000,
            force = false,
            skipContext = false,
            esperarHabilitado = true
        } = opciones;

        // Extraer valor real si es objeto
        let valorReal = valor;
        if (valor && typeof valor === 'object') {
            cy.log(`⚠️ slideToggle valor es objeto: ${JSON.stringify(valor)}`);
            if (valor.hasOwnProperty('esMandatorio')) {
                valorReal = valor.esMandatorio;
            } else {
                const props = Object.values(valor);
                const propString = props.find(p => typeof p === 'string' || typeof p === 'boolean');
                if (propString !== undefined) valorReal = propString;
                else valorReal = Boolean(valor);
            }
        }

        // Validar valor vacío
        if (valorReal == null || (typeof valorReal === 'string' && valorReal.trim() === '')) {
            cy.log(`⏭️ Valor vacío o nulo para slideToggle "${labelText}" - se omite`);
            return;
        }

        cy.log(`🔍 Procesando slideToggle "${labelText}" con valor: ${valorReal}`);

        const ejecutar = () => {
            const valorBooleano = typeof valorReal === 'string'
                ? ['true', '1', 'sí', 'si', 'yes'].includes(valorReal.toLowerCase().trim())
                : Boolean(valorReal);

            // Usar XPath para encontrar el label que contiene el texto exacto (ignorando mayúsculas/minúsculas)
            // Esto es más flexible y evita problemas de estructura
            const xpathLabel = `//label[contains(
                translate(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜ', 'abcdefghijklmnopqrstuvwxyzáéíóúü'), 'áéíóúüñ', 'aeioun'),
                translate(translate('${labelText}', 'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜ', 'abcdefghijklmnopqrstuvwxyzáéíóúü'), 'áéíóúüñ', 'aeioun')
            )]`;
            cy.xpath(xpathLabel, { timeout }).should('be.visible').then($label => {
                // Una vez encontrado el label, buscar el mat-slide-toggle asociado
                // Puede ser:
                // 1. El label está dentro de un mat-slide-toggle (hacer closest)
                // 2. El label tiene un atributo 'for' que apunta al id del slide-toggle
                // 3. Buscar el slide-toggle en el mismo contenedor (wrapper)

                let $slideToggle = $label.closest('mat-slide-toggle');

                if ($slideToggle.length === 0) {
                    const forAttr = $label.attr('for');
                    if (forAttr) {
                        // Intentar obtener por id exacto o por el contenedor que tenga ese id
                        $slideToggle = Cypress.$(`mat-slide-toggle#${forAttr}, #${forAttr}`).closest('mat-slide-toggle');
                    }
                }

                if ($slideToggle.length === 0) {
                    // Buscar en hermanos o padres
                    $slideToggle = $label.parent().find('mat-slide-toggle');
                    if ($slideToggle.length === 0) {
                        $slideToggle = $label.parents().find('mat-slide-toggle').first();
                    }
                }

                expect($slideToggle, `No se encontró mat-slide-toggle para label "${labelText}"`).to.exist;

                cy.wrap($slideToggle).then($toggle => {
                    // Determinar si está checked
                    // En mat-slide-toggle de Angular Material, la clase 'mat-mdc-slide-toggle-checked' indica checked
                    const isChecked = $toggle.hasClass('mat-mdc-slide-toggle-checked') ||
                                    $toggle.find('input[type="checkbox"]').is(':checked') ||
                                    $toggle.attr('aria-checked') === 'true';

                    cy.log(`📌 Estado actual: ${isChecked ? 'checked' : 'unchecked'}`);

                    // Si ya está en el estado deseado, no hacer nada
                    if ((valorBooleano && isChecked) || (!valorBooleano && !isChecked)) {
                        cy.log(`⏭️ SlideToggle "${labelText}" ya tiene el estado correcto`);
                        return;
                    }

                    // Si se requiere esperar a que no esté deshabilitado
                    if (esperarHabilitado) {
                        cy.wrap($toggle).should('not.have.class', 'mdc-switch--disabled')
                        .find('button[role="switch"]').should('not.be.disabled', { timeout });
                    }

                    // Hacer clic en el botón interno (para evitar clics en el label que pueden no funcionar)
                    const $button = $toggle.find('button[role="switch"]');
                    cy.wrap($button).click({ force });
                    cy.log(`✅ SlideToggle "${labelText}" cambiado a ${valorBooleano ? 'checked' : 'unchecked'}`);
                });
            });
        };

        this._ejecutarEnContexto(ejecutar, skipContext);
    }

    /**
     * Versión de checkbox que maneja checkbox en tabla sin iframe
     */
    checkboxEnTabla(valor, labelText, opciones = {}) {
    const {
        timeout = 10000,
        normalizarTildes = true,
        ignorarMayusculas = true,
        force = false,
        scrollBehavior = 'center',
        ensureScrollable = true,
        offsetTop = -100
    } = opciones;

    cy.log(`🔍 Procesando checkbox en tabla con texto: "${labelText}"`);

    const normalizar = (texto) => {
        if (!texto) return texto;
        let resultado = String(texto).trim();
        if (normalizarTildes) {
            resultado = resultado.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }
        if (ignorarMayusculas) {
            resultado = resultado.toLowerCase();
        }
        return resultado;
    };

    const textoBusqueda = normalizar(labelText);
    const valorEsperado = valor === true || valor === 'true' || valor === 1 || valor === '1';

    // Buscar la fila que contenga el texto en la columna de descripción
    cy.get('mat-row, tr.mat-mdc-row', { timeout })
        .filter((i, row) => {
            const textoFila = Cypress.$(row).find('.mat-column-description, td:eq(1)').text().trim();
            return normalizar(textoFila).includes(textoBusqueda);
        })
        .first()
        .within(() => {
            // Dentro de la fila, encontrar el checkbox
            cy.get('mat-checkbox').then($checkbox => {
                // Scroll al checkbox (o a la fila)
                cy.wrap($checkbox).scrollIntoView({
                    duration: 300,
                    easing: 'linear',
                    offset: { top: offsetTop, left: 0 },
                    ensureScrollable
                });
                cy.wait(200);

                // Detectar estado checked en MDC
                const estaChequeado = $checkbox.hasClass('mat-mdc-checkbox-checked') ||
                                      $checkbox.find('.mdc-checkbox').hasClass('mdc-checkbox--selected');

                if (estaChequeado !== valorEsperado) {
                    // Hacer clic en el área interactiva (mejor en el input nativo)
                    cy.get('input[type="checkbox"]').first().click({ force });
                    cy.log(`✅ Checkbox actualizado a ${valorEsperado ? 'chequeado' : 'no chequeado'}`);
                } else {
                    cy.log(`⏭️ Checkbox ya tiene estado correcto`);
                }
            });
        });
}
    /**
     * Versión de IngresarFecha que maneja iframe automáticamente
     */
    IngresarFechaIframe(fecha, nombreCampo, opciones = {}) {
        const {
            skipContext = false,
            ...restoOpciones
        } = opciones;

        const ejecutar = () => {
            // --- Validación de fecha vacía ---
            if (fecha == null || (typeof fecha === 'string' && fecha.trim() === '')) {
                const campoMostrar = Array.isArray(nombreCampo) ? nombreCampo.join('" o "') : nombreCampo;
                cy.log(`⏭️ Fecha vacía o nula para campo "${campoMostrar}", se omite procesamiento.`);
                return;
            }

            // Llamar al método original que procesa la fecha, pasando las opciones (sin skipContext)
            this.IngresarFecha(fecha, nombreCampo, restoOpciones);
        };

        if (skipContext) {
            ejecutar();
        } else if (this._ejecutarEnContexto) {
            this._ejecutarEnContexto(ejecutar);
        } else {
            ejecutar();
        }
    }

    /**
     * Versión de llenar campo que maneja iframe automáticamente
     */
    llenarCampoEnTablaIframe(valor, nombreColumna, numeroFila = 1, opciones = {}) {
        const {
            limpiar = true,
            delay = 10,
            timeout = 10000,
            force = false,
            skipContext = false,
            ignorarTildes = true,
            ignorarMayusculas = true,
            ignorarEspacios = true
        } = opciones;

        const ejecutar = () => {
            // Validación
            if (valor == null || (typeof valor === 'string' && valor.trim() === '')) {
                cy.log(`⏭️ Valor vacío para columna "${nombreColumna}" fila ${numeroFila}`);
                return;
            }

            cy.log(`🔍 Buscando tabla para escribir "${valor}" en columna "${nombreColumna}" fila ${numeroFila}`);

            // Función de normalización
            const normalizarTexto = (texto) => {
                if (!texto) return '';
                let resultado = String(texto);
                if (ignorarTildes) {
                    resultado = resultado.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                }
                if (ignorarMayusculas) {
                    resultado = resultado.toLowerCase();
                }
                if (ignorarEspacios) {
                    resultado = resultado.trim().replace(/\s+/g, ' ');
                }
                return resultado;
            };

            const columnaNormalizada = normalizarTexto(nombreColumna);

            // Buscar la tabla principal
            cy.get('table', { timeout }).should('be.visible').then($table => {
                // Encontrar el índice de la columna por el texto del encabezado (soporta th.mat-header-cell o th a secas)
                let columnaIndex = -1;

                // Buscar en los encabezados de la tabla (priorizando los que tienen clase mat-header-cell)
                const $encabezados = $table.find('th.mat-header-cell, thead th, .mat-header-cell');

                if ($encabezados.length === 0) {
                    // Si no encuentra con esos selectores, intenta con th genérico
                    $encabezados = $table.find('th');
                }

                $encabezados.each((index, th) => {
                    const textoTh = Cypress.$(th).text().trim();
                    const textoNormalizado = normalizarTexto(textoTh);
                    cy.log(`📌 Encabezado ${index}: "${textoTh}" normalizado: "${textoNormalizado}"`);
                    if (textoNormalizado.includes(columnaNormalizada) || columnaNormalizada.includes(textoNormalizado)) {
                        columnaIndex = index;
                        cy.log(`✅ Columna "${nombreColumna}" encontrada en índice ${columnaIndex} (texto: "${textoTh}")`);
                        return false;
                    }
                });

                if (columnaIndex === -1) {
                    throw new Error(`No se encontró columna "${nombreColumna}" en la tabla. Encabezados encontrados: ${$encabezados.map((i, th) => Cypress.$(th).text().trim()).get().join(' | ')}`);
                }

                // Obtener todas las filas del cuerpo de la tabla
                const $filas = $table.find('tbody tr');

                if (numeroFila > $filas.length) {
                    throw new Error(`La fila ${numeroFila} no existe. Solo hay ${$filas.length} filas`);
                }

                // La fila 1 es la primera fila (índice 0)
                const $fila = $filas.eq(numeroFila - 1);

                // Encontrar la celda en la columna correspondiente
                const $celda = $fila.find('td').eq(columnaIndex);

                // Buscar input dentro de la celda
                const $input = $celda.find('input, textarea, mat-select, .mat-select-trigger');

                if ($input.length === 0) {
                    throw new Error(`No se encontró input en columna "${nombreColumna}" fila ${numeroFila}`);
                }

                // Determinar el tipo de campo
                if ($input.is('mat-select') || $input.hasClass('mat-select-trigger')) {
                    // Si es un select, podemos llamar a seleccionarComboIframe con el contexto adecuado
                    // Pero para simplificar, hacemos clic y luego seleccionamos la opción (asumiendo que es un select simple)
                    cy.wrap($input).click({ force });
                    // Aquí podrías añadir lógica para seleccionar una opción, pero como el valor es texto, tal vez no aplica.
                    // Por ahora, lanzamos error o simplemente click.
                    cy.log('⚠️ Es un mat-select, se necesita lógica adicional');
                } else {
                    // Es un input normal
                    cy.wrap($input)
                        .scrollIntoView()
                        .should('be.visible')
                        .then(() => {
                            if (limpiar) {
                                cy.wrap($input).clear({ force });
                            }
                            cy.wrap($input).type(String(valor), { delay, force });
                            cy.log(`✅ Escrito "${valor}" en columna "${nombreColumna}" fila ${numeroFila}`);
                        });
                }
            });
        };

        if (skipContext) {
            ejecutar();
        } else if (this._ejecutarEnContexto) {
            this._ejecutarEnContexto(ejecutar);
        } else {
            ejecutar();
        }
    }

    /**
     * metodo para seleccionar medio de notificacion
     */
    seleccionarMediosNotificacion(medios, textoFila, opciones = {}) {
        const {
            timeout = 10000,
            force = false,
            skipContext = false,
            esperarHabilitado = true,
            ignorarDeshabilitados = true // true: solo advierte, false: lanza error
        } = opciones;

        // Función para interpretar el string de medios
        const parseMedios = (input) => {
            if (input == null) return { sms: false, email: false };
            if (typeof input === 'boolean') return { sms: input, email: input };
            if (Array.isArray(input)) {
                return {
                    sms: input.some(m => m.toLowerCase().includes('sms')),
                    email: input.some(m => m.toLowerCase().includes('email') || m.toLowerCase().includes('e-mail'))
                };
            }
            if (typeof input === 'string') {
                const m = input.toLowerCase().trim();
                // Eliminar llaves si existen
                const sinLlaves = m.replace(/[{}]/g, '');
                // Separar por comas o espacios
                const partes = sinLlaves.split(/[,\s]+/).filter(p => p.length > 0);
                if (partes.length === 0) return { sms: false, email: false };
                // Si contiene 'ambos' o alguna parte incluye ambos
                if (partes.includes('ambos')) return { sms: true, email: true };
                return {
                    sms: partes.some(p => p.includes('sms')),
                    email: partes.some(p => p.includes('email') || p.includes('e-mail'))
                };
            }
            return { sms: false, email: false };
        };

        const ejecutar = () => {
            // Validar valor vacío (solo si es string vacío o null)
            if (medios == null || (typeof medios === 'string' && medios.trim() === '')) {
                cy.log(`⏭️ Valor vacío para la fila "${textoFila}", se omite.`);
                return;
            }

            // Mostrar todas las etiquetas para depuración
            cy.log('📋 Etiquetas disponibles en la tabla:');
            cy.get('tbody tr td.cdk-column-label', { timeout }).each($el => {
                cy.log('   "' + $el.text().trim() + '"');
            });

            // Interpretar los medios solicitados
            const { sms: activarSMS, email: activarEmail } = parseMedios(medios);
            cy.log(`🔍 Fila "${textoFila}" → SMS: ${activarSMS}, eMail: ${activarEmail}`);

            // Buscar la fila por el texto exacto (ignorando espacios)
            cy.contains('tbody tr td.cdk-column-label', new RegExp(`^\\s*${textoFila}\\s*$`), { timeout })
                .should('be.visible')
                .then(($td) => {
                    const $fila = $td.closest('tr');

                    const procesarCheckbox = (columna, debeEstarMarcado) => {
                        const selector = `td.cdk-column-${columna} mat-checkbox`;
                        cy.wrap($fila).find(selector).should('exist').then($cb => {
                            const isDisabled = $cb.hasClass('mdc-checkbox--disabled') || $cb.find('input').is(':disabled');

                            if (isDisabled) {
                                if (debeEstarMarcado) {
                                    const msg = `⚠️ El checkbox ${columna} en fila "${textoFila}" está deshabilitado pero se solicita marcarlo.`;
                                    if (ignorarDeshabilitados) {
                                        cy.log(msg + ' Se omite (ignorarDeshabilitados=true).');
                                    } else {
                                        throw new Error(msg);
                                    }
                                } else {
                                    cy.log(`⏭️ ${columna} en fila "${textoFila}" está deshabilitado y no necesita cambios.`);
                                }
                                return;
                            }

                            if (esperarHabilitado) {
                                cy.wrap($cb).should('not.have.class', 'mdc-checkbox--disabled');
                            }

                            const isChecked = $cb.hasClass('mat-mdc-checkbox-checked') || $cb.find('input').is(':checked');
                            if (debeEstarMarcado && !isChecked) {
                                cy.wrap($cb).click({ force });
                                cy.log(`✅ Marcado ${columna} en fila "${textoFila}"`);
                            } else if (!debeEstarMarcado && isChecked) {
                                cy.wrap($cb).click({ force });
                                cy.log(`✅ Desmarcado ${columna} en fila "${textoFila}"`);
                            } else {
                                cy.log(`⏭️ ${columna} en fila "${textoFila}" ya en estado deseado`);
                            }
                        });
                    };

                    if (activarSMS !== undefined) procesarCheckbox('SMS', activarSMS);
                    if (activarEmail !== undefined) procesarCheckbox('eMail', activarEmail);
                });
        };

        this._ejecutarEnContexto(ejecutar, skipContext);
    }


    seleccionarCombo(valor, labelText, opciones = {}) {
        const {
            ignorarTildes = true,
            ignorarMayusculas = true,
            ignorarEspacios = true,
            timeout = 10000
        } = opciones;

        if (!valor || valor === "") {
            cy.log(`⏭️ Valor vacío para combo "${labelText}" - se omite la selección`);
            return;
        }

        cy.log(`🔍 Seleccionando "${valor}" en combo "${labelText}"`);

        const normalizarTexto = (texto) => {
            if (!texto) return texto;
            let resultado = String(texto);

            if (ignorarTildes) {
                resultado = resultado.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            }

            if (ignorarMayusculas) {
                resultado = resultado.toLowerCase();
            }

            if (ignorarEspacios) {
                resultado = resultado.trim().replace(/\s+/g, ' ');
            }

            return resultado;
        };

        const labelNormalizado = normalizarTexto(labelText);
        cy.log(`📋 Buscando label normalizado: "${labelNormalizado}"`);

        // Buscar todos los form-field con mat-select
        cy.get('mat-form-field:has(mat-select)', { timeout }).then($formFields => {
            let $mejorCampo = null;
            let mejorPuntaje = -1;
            let mejorCoincidencia = null;

            // Evaluar cada form-field
            $formFields.each((index, field) => {
                const $field = Cypress.$(field);
                const $label = $field.find('mat-label, label, .mat-label, .mat-form-field-label');

                if ($label.length) {
                    const textoLabel = $label.first().text().trim();
                    const textoLabelNormalizado = normalizarTexto(textoLabel);

                    // Calcular puntaje de coincidencia
                    let puntaje = 0;

                    // Coincidencia exacta (mejor)
                    if (textoLabelNormalizado === labelNormalizado) {
                        puntaje = 100;
                    }
                    // Coincidencia exacta ignorando el asterisco
                    else if (textoLabelNormalizado.replace(/\s*\*\s*/g, '') === labelNormalizado) {
                        puntaje = 90;
                    }
                    // Label comienza con el texto buscado
                    else if (textoLabelNormalizado.startsWith(labelNormalizado + ' ')) {
                        puntaje = 80;
                    }
                    // Label contiene el texto buscado como palabra completa
                    else if (textoLabelNormalizado.match(new RegExp(`\\b${labelNormalizado}\\b`))) {
                        puntaje = 70;
                    }
                    // Label contiene el texto buscado
                    else if (textoLabelNormalizado.includes(labelNormalizado)) {
                        puntaje = 50;
                    }
                    // Texto buscado contiene el label (coincidencia parcial baja)
                    else if (labelNormalizado.includes(textoLabelNormalizado)) {
                        puntaje = 30;
                    }

                    cy.log(`📝 "${textoLabel}" → puntaje: ${puntaje}`);

                    // Si este campo tiene mejor puntaje, es el nuevo candidato
                    if (puntaje > mejorPuntaje) {
                        mejorPuntaje = puntaje;
                        $mejorCampo = $field;
                        mejorCoincidencia = textoLabel;
                    }
                }
            });

            // Verificar que encontramos un campo con puntaje mínimo
            expect($mejorCampo, `No se encontró campo para label "${labelText}"`).to.not.be.null;
            cy.log(`✅ Mejor coincidencia: "${mejorCoincidencia}" (puntaje: ${mejorPuntaje})`);

            // Guardar referencia al select antes de cualquier interacción
            cy.wrap($mejorCampo)
                .find('mat-select')
                .should('be.visible')
                .as('targetSelect');

            // Obtener valor actual usando la referencia guardada
            cy.get('@targetSelect').then($select => {
                const valorActual = $select
                    .find('.mat-select-value-text, .mat-select-min-line, .mat-select-placeholder')
                    .first()
                    .text()
                    .trim();

                const valorActualNormalizado = normalizarTexto(valorActual);
                const valorNormalizado = normalizarTexto(valor);

                cy.log(`📌 Valor actual: "${valorActual}" | Normalizado: "${valorActualNormalizado}"`);
                cy.log(`🎯 Valor deseado: "${valor}" | Normalizado: "${valorNormalizado}"`);

                if (valorActualNormalizado !== valorNormalizado &&
                    !valorActualNormalizado.includes(valorNormalizado)) {

                    // Click en el select guardado
                    cy.get('@targetSelect')
                        .should('not.be.disabled')
                        .click({ force: true });

                    // Buscar opción en el panel desplegado
                    cy.get('.cdk-overlay-pane', { timeout })
                        .should('be.visible')
                        .find('mat-option')
                        .filter((i, opt) => {
                            const textoOpcion = Cypress.$(opt).text().trim();
                            const textoOpcionNormalizado = normalizarTexto(textoOpcion);

                            return textoOpcionNormalizado === valorNormalizado ||
                                textoOpcionNormalizado.includes(valorNormalizado) ||
                                valorNormalizado.includes(textoOpcionNormalizado);
                        })
                        .first()
                        .then($option => {
                            // Hacer scroll para que la opción sea visible
                            cy.wrap($option).scrollIntoView({
                                duration: 200,
                                easing: 'linear',
                                ensureScrollable: true
                            });

                            // Ahora hacer click en la opción
                            cy.wrap($option)
                                .should('be.visible')
                                .click({ force: true });
                        });

                    cy.log(`✅ Seleccionado "${valor}" en combo "${labelText}"`);
                } else {
                    cy.log(`⏭️ Ya tiene el valor "${valor}", no se requiere cambio`);
                }
            });
        });
    }

    seleccionarComboEspecial(valor, labelText, opciones = {}) {
        const {
            timeout = 10000
        } = opciones;

        if (!valor || valor === "") {
            cy.log(`⏭️ Valor vacío para combo "${labelText}" - se omite la selección`);
            return;
        }

        cy.log(`🔍 Seleccionando "${valor}" en combo "${labelText}"`);

        // Buscar el campo por el label
        cy.contains('mat-label', labelText, { timeout })
            .parents('mat-form-field')
            .find('mat-select')
            .should('be.visible')
            .should('not.be.disabled')
            .click({ force: true });

        // Pequeña espera para que el panel se abra completamente
        cy.wait(500);

        // Buscar la opción y hacer click directamente
        cy.get('.cdk-overlay-pane mat-option', { timeout })
            .should('be.visible')
            .then($opciones => {
                // Buscar la opción que coincida con el valor
                const $opcionEncontrada = $opciones.filter((i, opt) => {
                    const textoOpcion = Cypress.$(opt).text().trim();
                    return textoOpcion.includes(valor) || valor.includes(textoOpcion);
                }).first();

                if ($opcionEncontrada.length > 0) {
                    cy.wrap($opcionEncontrada).click({ force: true });
                    cy.log(`✅ Seleccionado "${valor}" en combo "${labelText}"`);
                } else {
                    // Si no encuentra por texto, seleccionar la primera opción
                    cy.log(`⚠️ No se encontró "${valor}", seleccionando primera opción`);
                    cy.wrap($opciones.first()).click({ force: true });
                }
            });
    }

    llenarCampo(valor, labelText, opciones = {}) {
        const {
            limpiar = true,
            delay = 10,
            timeout = 10000,
            trim = true,
            normalizarTildes = true,
            ignorarTildesEnBusqueda = true,
            escribirConTildes = true,
            ignorarMayusculas = true,
            scrollBehavior = 'center',
            ensureScrollable = true
        } = opciones;

        // Función para normalizar texto (quitar tildes)
        const normalizarTildesFunc = (texto) => {
            if (!texto) return texto;
            return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        };

        // Función para normalizar COMPLETAMENTE (tildes + minúsculas)
        const normalizarCompleto = (texto) => {
            if (!texto) return texto;
            let resultado = String(texto);

            if (normalizarTildes) {
                resultado = normalizarTildesFunc(resultado);
            }

            if (ignorarMayusculas) {
                resultado = resultado.toLowerCase();
            }

            return resultado.trim().replace(/\s+/g, ' ');
        };

        // Validar valor inválido
        if (valor === null || valor === undefined || (trim && String(valor).trim() === '')) {
            cy.log(`⏭️ Input - valor vacío, omitiendo`);
            return;
        }

        // Procesar el valor a escribir
        let valorAEscribir = String(valor);
        if (trim) valorAEscribir = valorAEscribir.trim();

        const valorOriginal = valorAEscribir;

        if (!escribirConTildes) {
            valorAEscribir = normalizarTildesFunc(valorAEscribir);
        }

        cy.log(`🔍 Original: "${valorOriginal}" | Escribirá: "${valorAEscribir}"`);

        // 👇 NUEVO: Convertir labelText a array si es string, o usar el array directamente
        const posiblesLabels = Array.isArray(labelText) ? labelText : [labelText];

        cy.log(`📋 Buscando entre ${posiblesLabels.length} posible(s) label(s):`);
        posiblesLabels.forEach((label, idx) => {
            cy.log(`   Opción ${idx + 1}: "${label}"`);
        });

        // Normalizar todas las opciones de búsqueda
        const opcionesNormalizadas = posiblesLabels.map(label => normalizarCompleto(label));

        // Buscar el label entre todas las opciones
        const buscarLabel = () => {
            return cy.get('label, mat-label, span.label', { timeout })
                .then($labels => {
                    let $mejorCoincidencia = null;
                    let mejorCoincidenciaTexto = '';
                    let mejorPuntaje = -1;

                    $labels.each((index, el) => {
                        const textEl = Cypress.$(el).text().trim();
                        const textNormalizado = normalizarCompleto(textEl);

                        // Evaluar contra cada opción de búsqueda
                        opcionesNormalizadas.forEach((opcionNormalizada, idx) => {
                            const opcionOriginal = posiblesLabels[idx];
                            let puntaje = 0;

                            // Coincidencia exacta (mejor)
                            if (textNormalizado === opcionNormalizada) {
                                puntaje = 100;
                            }
                            // Coincidencia exacta ignorando asteriscos
                            else if (textNormalizado.replace(/\s*\*\s*/g, '') === opcionNormalizada) {
                                puntaje = 90;
                            }
                            // Label comienza con el texto buscado
                            else if (textNormalizado.startsWith(opcionNormalizada + ' ')) {
                                puntaje = 80;
                            }
                            // Label contiene el texto buscado
                            else if (textNormalizado.includes(opcionNormalizada)) {
                                puntaje = 70;
                            }
                            // El texto buscado contiene el label (coincidencia parcial)
                            else if (opcionNormalizada.includes(textNormalizado)) {
                                puntaje = 50;
                            }

                            if (puntaje > mejorPuntaje) {
                                mejorPuntaje = puntaje;
                                $mejorCoincidencia = cy.$$(el);
                                mejorCoincidenciaTexto = textEl;
                                cy.log(`   Posible match: "${textEl}" con opción "${opcionOriginal}" (puntaje: ${puntaje})`);
                            }
                        });
                    });

                    if ($mejorCoincidencia && mejorPuntaje >= 50) { // Umbral mínimo
                        cy.log(`✅ Mejor coincidencia: "${mejorCoincidenciaTexto}" (puntaje: ${mejorPuntaje})`);
                        return cy.wrap($mejorCoincidencia);
                    }

                    // Si no encuentra, mostrar todos los labels disponibles
                    cy.log(`❌ No se encontró label para ninguna opción`);
                    cy.log('📋 Labels disponibles:');
                    $labels.each((i, el) => {
                        const texto = Cypress.$(el).text().trim();
                        cy.log(`   ${i}: "${texto}" (normalizado: "${normalizarCompleto(texto)}")`);
                    });

                    throw new Error(`No se encontró campo para ninguno de los labels: ${posiblesLabels.join(', ')}`);
                });
        };

        buscarLabel()
            .should('be.visible')
            .then($label => {
                const inputId = $label.attr('for');

                const encontrarInput = () => {
                    if (inputId) {
                        return cy.get(`#${inputId}`);
                    } else {
                        return cy.wrap($label)
                            .parents('.mat-form-field, .form-group')
                            .find('input, textarea, select')
                            .first();
                    }
                };

                encontrarInput()
                    .should('be.visible')
                    .then($input => {
                        cy.wrap($input).scrollIntoView({
                            duration: 300,
                            easing: 'linear',
                            offset: { top: -100, left: 0 },
                            ensureScrollable: ensureScrollable
                        });

                        cy.wait(200);

                        if (limpiar) {
                            cy.wrap($input).clear();
                            cy.wait(100);
                        }

                        cy.wrap($input).type(valorAEscribir, { delay });

                        // Mostrar qué label se usó realmente
                        const labelUsado = $label.text().trim();
                        cy.log(`✅ Escrito: "${valorAEscribir}" en campo "${labelUsado}"`);
                    });
            });
    }

    checkbox(valor, labelText, opciones = {}) {
        const {
            timeout = 10000,
            normalizarTildes = true,
            ignorarMayusculas = true,
            force = false,
            scrollBehavior = 'center',
            ensureScrollable = true,
            offsetTop = -100
        } = opciones;

        cy.log(`🔍 Procesando checkbox "${labelText}" con valor: ${valor}`);

        const normalizar = (texto) => {
            if (!texto) return texto;
            let resultado = String(texto).trim();
            if (normalizarTildes) {
                resultado = resultado.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            }
            if (ignorarMayusculas) {
                resultado = resultado.toLowerCase();
            }
            return resultado;
        };

        const textoBusqueda = normalizar(labelText);

        cy.get('mat-checkbox', { timeout })
            .filter((index, cb) => {
                const texto = Cypress.$(cb).find('.mat-checkbox-label, label, span').text().trim();
                return normalizar(texto).includes(textoBusqueda) || normalizar(texto) === textoBusqueda;
            })
            .first()
            .then($checkbox => {
                // 👇 NUEVO: Hacer scroll al checkbox
                cy.wrap($checkbox).scrollIntoView({
                    duration: 300,
                    easing: 'linear',
                    offset: { top: offsetTop, left: 0 },
                    ensureScrollable: ensureScrollable
                });

                cy.wait(200); // Pequeña pausa después del scroll

                const estaChequeado = $checkbox.hasClass('mat-checkbox-checked');
                const valorEsperado = valor === true || valor === 'true' || valor === 1 || valor === '1';

                if (estaChequeado !== valorEsperado) {
                    cy.wrap($checkbox)
                        .find('.mat-checkbox-layout, .mat-checkbox-inner-container')
                        .first()
                        .click({ force });

                    cy.log(`✅ Checkbox actualizado a ${valorEsperado ? 'chequeado' : 'no chequeado'}`);
                } else {
                    cy.log(`⏭️ Checkbox ya tiene estado correcto`);
                }
            });
    }

    IngresarFecha(fecha, nombreCampo, opciones = {}) {
        const {
            timeout = 10000,
            force = true,
            confirmarConEnter = true,
            scrollBehavior = 'center',
            ensureScrollable = true,
            offsetTop = -100,
            normalizarTildes = true,
            ignorarMayusculas = true,
            ignorarEspacios = true
        } = opciones;

        cy.log(`📅 Ingresando fecha "${fecha}" en campo: "${nombreCampo}"`);

        // Función para normalizar texto (quitar tildes)
        const normalizarTildesFunc = (texto) => {
            if (!texto) return texto;
            return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        };

        // Función para normalizar COMPLETAMENTE (tildes + minúsculas + espacios)
        const normalizarCompleto = (texto) => {
            if (!texto) return texto;
            let resultado = String(texto);

            if (normalizarTildes) {
                resultado = normalizarTildesFunc(resultado);
            }

            if (ignorarMayusculas) {
                resultado = resultado.toLowerCase();
            }

            if (ignorarEspacios) {
                resultado = resultado.trim().replace(/\s+/g, ' ');
            }

            return resultado;
        };

        // Validar fecha inválida
        if (!fecha || fecha === '') {
            cy.log(`⏭️ Fecha vacía para campo "${nombreCampo}" - omitiendo`);
            return;
        }

        // Formatear fecha si es necesario (ej: "15/3/2026" → "15/03/2026")
        const formatearFecha = (fechaStr) => {
            if (!fechaStr) return fechaStr;
            const partes = fechaStr.split('/');
            if (partes.length === 3) {
                const dia = partes[0].padStart(2, '0');
                const mes = partes[1].padStart(2, '0');
                const anio = partes[2];
                return `${dia}/${mes}/${anio}`;
            }
            return fechaStr;
        };

        const fechaFormateada = formatearFecha(fecha);
        cy.log(`📅 Fecha original: "${fecha}" | Formateada: "${fechaFormateada}"`);

        // Función para buscar label normalizado
        const buscarLabel = () => {
            const textoBusqueda = normalizarCompleto(nombreCampo);
            cy.log(`📋 Buscando label normalizado: "${textoBusqueda}" (original: "${nombreCampo}")`);

            return cy.get('label, mat-label, span.label', { timeout })
                .then($labels => {
                    const $encontrados = $labels.filter((index, el) => {
                        const textEl = Cypress.$(el).text().trim();
                        const textNormalizado = normalizarCompleto(textEl);

                        // Coincidencia exacta o includes
                        return textNormalizado === textoBusqueda ||
                            textNormalizado.includes(textoBusqueda);
                    });

                    if ($encontrados.length === 0) {
                        cy.log(`❌ No se encontró label para: "${textoBusqueda}"`);
                        cy.log('📋 Labels disponibles:');
                        $labels.each((i, el) => {
                            const texto = Cypress.$(el).text().trim();
                            cy.log(`   ${i}: "${texto}" (normalizado: "${normalizarCompleto(texto)}")`);
                        });

                        // Intentar búsqueda por placeholder como fallback
                        cy.log('⚠️ Intentando búsqueda por placeholder...');
                        return cy.get(`input[data-placeholder]`, { timeout: 5000 })
                            .filter((i, input) => {
                                const placeholder = Cypress.$(input).attr('data-placeholder');
                                return placeholder && normalizarCompleto(placeholder) === textoBusqueda;
                            })
                            .first()
                            .then($input => {
                                if ($input.length) {
                                    cy.log(`✅ Encontrado por placeholder: "${$input.attr('data-placeholder')}"`);
                                    return cy.wrap($input);
                                }
                                throw new Error(`No se encontró campo para fecha "${nombreCampo}"`);
                            });
                    }

                    cy.log(`✅ Label encontrado: "${Cypress.$($encontrados[0]).text().trim()}"`);
                    return cy.wrap($encontrados.first());
                });
        };

        // Buscar el label normalizado
        buscarLabel()
            .should('be.visible')
            .then($label => {
                // Verificar si es un input directo o necesitamos buscar el input asociado
                if ($label.is('input')) {
                    // Ya es un input, usarlo directamente
                    return cy.wrap($label);
                } else {
                    // Es un label, buscar el input asociado
                    const inputId = $label.attr('for');

                    if (inputId) {
                        return cy.get(`#${inputId}`);
                    } else {
                        // Buscar por placeholder
                        const textoBusqueda = normalizarCompleto(nombreCampo);
                        return cy.get(`input[data-placeholder]`, { timeout })
                            .filter((i, input) => {
                                const placeholder = Cypress.$(input).attr('data-placeholder');
                                return placeholder && normalizarCompleto(placeholder) === textoBusqueda;
                            })
                            .first();
                    }
                }
            })
            .should('be.visible')
            .then($input => {
                // 👇 Hacer scroll al input
                cy.wrap($input).scrollIntoView({
                    duration: 300,
                    easing: 'linear',
                    offset: { top: offsetTop, left: 0 },
                    ensureScrollable: ensureScrollable
                });

                cy.wait(200); // Pausa después del scroll

                // Verificar si el input está habilitado
                cy.wrap($input).then($el => {
                    if ($el.prop('disabled') && !force) {
                        cy.log(`⚠️ Input "${nombreCampo}" está deshabilitado y force=false`);
                        return;
                    }

                    // Limpiar y escribir la fecha
                    cy.wrap($input)
                        .clear({ force })
                        .type(fechaFormateada, { force });

                    cy.log(`✅ Fecha ingresada: ${fechaFormateada} en campo "${nombreCampo}"`);
                });
            });
    }

    esperarOcultarSpinner(opciones = {}) {
        const {
            timeout = 30000,
            esperarAparicion = false,
            skipContext = false
        } = opciones;

        const ejecutar = () => {
            cy.log('⏳ Esperando a que desaparezca el spinner...');
            if (esperarAparicion) {
                cy.get('mat-spinner', { timeout: 5000 }).should('be.visible');
            }
            cy.get('mat-spinner', { timeout }).should('not.exist');
        };

        if (skipContext) {
            ejecutar();
        } else {
            cy.get('body').then($body => {
                const $iframe = $body.find('iframe.frame');
                if ($iframe.length > 0) {
                    cy.wrap($iframe)
                        .its('0.contentDocument.body')
                        .should('not.be.empty')
                        .then(cy.wrap)
                        .within(ejecutar);
                } else {
                    ejecutar();
                }
            });
        }

    }

    /*filtrarPorCodigoIframe(codigo) {
        if (!codigo || codigo === "") {
            cy.log(`⏭️ Código vacío - se omite`);
            return;
        }

        cy.log(`🔍 Buscando y seleccionando registro con código: "${codigo}"`);

        cy.get('iframe.frame, iframe', { timeout: 10000 }).then(($iframe) => {
            if ($iframe.length > 0) {
                const iframeBody = $iframe.contents().find('body');

                // PASO 1: Abrir panel Filtros
                cy.wrap(iframeBody).find('mat-expansion-panel-header').contains('Filtros')
                    .then($header => {
                        if ($header.attr('aria-expanded') !== 'true') {
                            cy.log('📌 Abriendo panel Filtros');
                            cy.wrap($header).click({ force: true });
                            cy.wait(500);
                        }
                    });

                // PASO 2: Buscar el campo Código por su mat-label
                cy.log('📝 Buscando campo Código...');
                cy.wrap(iframeBody).find('mat-label:contains("Código")')
                    .should('be.visible')
                    .then($label => {
                        const $input = $label.closest('mat-form-field').find('input');
                        cy.wrap($input).clear({ force: true }).type(codigo, { force: true, delay: 50 });
                        cy.log('✅ Código ingresado');
                    });

                // PASO 3: Hacer clic en el botón de búsqueda (search)
                cy.log('🔍 Buscando botón de búsqueda...');
                cy.wrap(iframeBody).find('button.mat-mdc-fab.mat-primary mat-icon:contains("search")')
                    .should('be.visible')
                    .click({ force: true });

                cy.log('⏳ Esperando resultados de búsqueda...');
                cy.wait(2000);

                // PASO 4: Buscar y hacer clic en el TEXTO del registro
                cy.log(`📋 Buscando registro con código "${codigo}"...`);

                cy.wrap(iframeBody).within(() => {
                    // Buscar la celda que contiene el código
                    cy.contains('td.mat-column-codeOfTheTransaction', codigo)
                        .should('be.visible')
                        .then($celdaCodigo => {
                            // Hacer clic en la celda del código (texto)
                            cy.log(`✅ Registro encontrado, haciendo clic en el código "${codigo}"`);
                            cy.wrap($celdaCodigo).click({ force: true });

                            // Opcional: También podrías hacer clic en cualquier celda de la fila
                            // const $fila = $celdaCodigo.closest('tr');
                            // cy.wrap($fila.find('td').first()).click({ force: true });
                        });
                });

                cy.log(`🎉 Registro con código "${codigo}" seleccionado exitosamente`);

            } else {
                cy.log('❌ No se encontró iframe');
            }
        });
    }*/

    filtrarPorCodigo(codigo) {
        if (!codigo || codigo === "") {
            cy.log(`⏭️ Código vacío - se omite`);
            return;
        }

        cy.log(`🔍 Buscando y seleccionando registro con código: "${codigo}"`);

        // PASO 1: Abrir panel Filtros
        cy.get('mat-expansion-panel-header').contains('Filtros')
            .then($header => {
                if ($header.attr('aria-expanded') !== 'true') {
                    cy.log('📌 Abriendo panel Filtros');
                    cy.wrap($header).click({ force: true });
                    cy.wait(500);
                }
            });

        // PASO 2: Buscar el campo Código por su mat-label
        cy.log('📝 Buscando campo Código...');
        cy.get('mat-label:contains("Código")')
            .should('be.visible')
            .then($label => {
                const $input = $label.closest('mat-form-field').find('input');
                cy.wrap($input).clear({ force: true }).type(codigo, { force: true, delay: 50 });
                cy.log('✅ Código ingresado');
            });

        // PASO 3: Hacer clic en el botón de búsqueda (search)
        cy.log('🔍 Buscando botón de búsqueda...');
        cy.get('button.mat-mdc-fab.mat-primary mat-icon:contains("search")')
            .should('be.visible')
            .click({ force: true });

        cy.log('⏳ Esperando resultados de búsqueda...');
        cy.wait(2000);

        // PASO 4: Buscar y hacer clic en el TEXTO del registro
        cy.log(`📋 Buscando registro con código "${codigo}"...`);

        cy.contains('td.mat-column-codeOfTheTransaction', codigo)
            .should('be.visible')
            .then($celdaCodigo => {
                // Hacer clic en la celda del código (texto)
                cy.log(`✅ Registro encontrado, haciendo clic en el código "${codigo}"`);
                cy.wrap($celdaCodigo).click({ force: true });
            });

        cy.log(`🎉 Registro con código "${codigo}" seleccionado exitosamente`);
    }

    abrirPanel(nombrePanel, opciones = {}) {
        const {
            timeout = 10000,
            force = false,
            intentos = 3,
            esperaAnimacion = 1000
        } = opciones;

        cy.log(`🔍 Buscando panel: "${nombrePanel}"`);

        // Función recursiva para intentar abrir el panel
        const intentarAbrir = (intento = 1) => {
            cy.contains('mat-expansion-panel-header', nombrePanel, { timeout })
                .should('be.visible')
                .then($header => {
                    const isExpanded = $header.attr('aria-expanded') === 'true';

                    if (!isExpanded) {
                        cy.log(`📌 Intento ${intento}: Panel "${nombrePanel}" colapsado, expandiendo...`);
                        cy.wrap($header).click({ force });

                        // Esperar a que la animación termine
                        cy.wait(esperaAnimacion);

                        // Verificar si el contenido ahora es visible
                        cy.wrap($header)
                            .parents('mat-expansion-panel')
                            .find('.mat-expansion-panel-content')
                            .then($content => {
                                const isContentVisible = $content.css('visibility') === 'visible' ||
                                    $content.css('height') !== '0px';

                                if (!isContentVisible && intento < intentos) {
                                    cy.log(`⚠️ Panel aún no visible, reintentando...`);
                                    intentarAbrir(intento + 1);
                                } else if (!isContentVisible && intento >= intentos) {
                                    cy.log(`⚠️ Panel no se expandió después de ${intentos} intentos`);
                                    // Forzar apertura con JavaScript
                                    cy.wrap($header).then($el => {
                                        const panel = $el.closest('mat-expansion-panel')[0];
                                        if (panel && panel.componentInstance) {
                                            panel.componentInstance.expanded = true;
                                            panel.componentInstance._toggle();
                                        }
                                    });
                                    cy.wait(500);
                                } else {
                                    cy.log(`✅ Panel "${nombrePanel}" expandido correctamente`);
                                }
                            });
                    } else {
                        cy.log(`✅ Panel "${nombrePanel}" ya está expandido`);
                    }
                });
        };

        intentarAbrir();
    }

    clickAddCaracteristica() {
        cy.log('➕ Haciendo clic en botón ADD de Características');

        cy.get('mat-card app-characteristics .buttonAdd button[mat-fab]')
            .should('be.visible')
            .click({ force: true });

        cy.log('✅ Click en ADD de Características exitoso');
    }


    arrastrarCaracteristica(nombre, opciones = {}) {
        const {
            destinoSelector = "#characteristicsTCA, #characteristicsRC, #step",
            timeout = 10000,
        } = opciones;

        // Verificar si la característica ya existe en el destino
        return cy.get(destinoSelector, { timeout }).then($destino => {
            const existeEnDestino = $destino.find(`mat-card-title:contains("${nombre}")`).length > 0;
            if (existeEnDestino) {
                cy.log(`🟡 La característica "${nombre}" ya existe en el destino, se omite arrastre.`);
                return; // Salir sin ejecutar el arrastre
            }

            // Buscar la característica en el origen (solo verifica existencia, no visibilidad)
            cy.contains("mat-card-title", nombre)
                .scrollIntoView()           // Aún así lo traemos a la vista para que sea interactuable
                .should("exist")             // <-- Cambiado de "be.visible" a "exist"
                .parents(".cdk-drag")
                .find(".cdk-drag-handle")
                .then(($handle) => {
                    const rect = $handle[0].getBoundingClientRect();

                    cy.wrap($handle).realMouseDown({ position: "center" });
                    cy.root().realMouseMove(rect.x + 5, rect.y + 5);

                    // Calcular centro del destino (primer elemento del selector múltiple)
                    const $destinoElement = $destino.first();
                    const destRect = $destinoElement[0].getBoundingClientRect();
                    const centroX = destRect.x + destRect.width / 2;
                    const centroY = destRect.y + destRect.height / 2;

                    cy.root().realMouseMove(centroX, centroY);
                    cy.wait(100);
                    cy.root().realMouseUp({ position: "center" });
                    cy.root().realClick();

                    // Esperar a que desaparezca el spinner (si es necesario)
                    this.esperarQueSpinnerDesaparezca({ timeout });

                    // Validar que la característica ahora existe en el destino (no requiere visibilidad)
                    cy.get(destinoSelector, { timeout })
                        .contains('mat-card-title', nombre)
                        .should('exist');     // <-- También usamos "exist" para la validación final
                });
        });
    }



    arrastrarCaracteristicaC(nombre, opciones = {}) {
        const {
            contenedorDestino = '#step',
            timeout = 10000,
        } = opciones;

        // 🔥 CONTENEDOR ACTIVO (Paso 1 o Paso 2)
        const getContenedorActivo = () => {
            return cy.get('mat-expansion-panel.mat-expanded')
                .find(contenedorDestino)
                .should('be.visible');
        };

        cy.contains("mat-card-title", nombre)
            .scrollIntoView()
            .should("exist")
            .parents(".cdk-drag")
            .then($origen => {

                const $handle = $origen.find('.cdk-drag-handle').length > 0
                    ? $origen.find('.cdk-drag-handle')
                    : $origen;

                const rectOrigen = $handle[0].getBoundingClientRect();

                // 🔥 INICIO DRAG
                cy.wrap($handle).realMouseDown({ position: "center" });
                cy.root().realMouseMove(rectOrigen.x + 5, rectOrigen.y + 5).wait(200);

                // 🔥 CONTENEDOR DESTINO REAL (ACTIVO)
                getContenedorActivo().then($container => {

                    const elementosExistentes = $container.find('.cdk-drag');

                    let puntoX, puntoY;

                    // =========================
                    // 🔵 CASO: CONTENEDOR VACÍO
                    // =========================
                    if (elementosExistentes.length === 0) {

                        const rect = $container[0].getBoundingClientRect();

                        puntoX = rect.x + rect.width / 2;
                        puntoY = rect.y + 40; // 🔥 ligeramente arriba del centro

                    } else {

                        // =========================
                        // 🔵 CASO: YA HAY ELEMENTOS
                        // =========================
                        const ultimo = elementosExistentes.last();

                        cy.wrap(ultimo)
                            .scrollIntoView({ block: 'center' })
                            .wait(150);

                        const rectUltimo = ultimo[0].getBoundingClientRect();

                        puntoX = rectUltimo.x + rectUltimo.width / 2;
                        puntoY = rectUltimo.y + rectUltimo.height + 30;
                    }

                    // 🔥 GUARDAR COORDENADAS
                    cy.wrap({ puntoX, puntoY }).as('coords');
                });

                // 🔥 EJECUTAR DRAG
                cy.get('@coords').then(({ puntoX, puntoY }) => {

                    // 🔥 MOVIMIENTO PROGRESIVO (CLAVE ANGULAR CDK)
                    cy.root().realMouseMove(puntoX, puntoY - 80).wait(100);
                    cy.root().realMouseMove(puntoX, puntoY - 40).wait(100);
                    cy.root().realMouseMove(puntoX, puntoY).wait(200);

                    // 🔥 INTENTO DE ACTIVAR DROP ZONE (NO BLOQUEANTE)
                    getContenedorActivo().then($el => {
                        const dragging = $el.hasClass('cdk-drop-list-dragging');
                        const receiving = $el.hasClass('cdk-drop-list-receiving');

                        if (!(dragging || receiving)) {
                            cy.log('⚠️ Angular CDK no detectó drag (continuando igual)');
                        }
                    });

                    // 🔥 AJUSTES FINOS
                    cy.root().realMouseMove(puntoX + 2, puntoY + 2).wait(100);
                    cy.root().realMouseMove(puntoX, puntoY).wait(100);

                    // 🔥 DROP
                    cy.root().realMouseUp();
                    cy.root().realClick();

                    cy.wait(1200);

                    // 🔥 CLICK EN ELEMENTO NUEVO
                    getContenedorActivo()
                        .find('.cdk-drag')
                        .should('have.length.greaterThan', 0)
                        .should('be.visible')
                        .then($list => {

                            // 🔥 esperar que Angular termine de renderizar
                            cy.wrap($list.last())
                                .scrollIntoView({ block: 'center' })
                                .should('exist')
                                .click({ force: true });
                        });

                    cy.wait(500);

                    cy.log(`✅ Arrastre completado: "${nombre}"`);

                    this.esperarQueSpinnerDesaparezca({ timeout });
                });
            });
    }



    seleccionarRadio(valor, opciones = {}) {
        const {
            timeout = 10000,
            force = false,
            skipContext = false
        } = opciones;

        cy.log(`🔍 Seleccionando radio operación: "${valor}"`);

        const ejecutar = () => {
            const xpath = `//mat-radio-button//input[@type='radio' and @value='${valor}']`;

            cy.xpath(xpath, { timeout })
                .should('exist')
                .then($input => {
                    // Verificar si ya está seleccionado
                    if ($input.is(':checked')) {
                        cy.log(`⏭️ Radio "${valor}" ya está seleccionado`);
                        return;
                    }

                    // Seleccionar el radio
                    cy.wrap($input).check({ force });
                    cy.log(`✅ Radio "${valor}" seleccionado`);
                });
        };

        this._ejecutarEnContexto(ejecutar, skipContext);
    }
    // En tu GestorDeTransacciones.cy.js

    /**
     * Hace click en el botón + del tab activo para agregar un paso
     */
    /*clickAgregarPaso() {
        cy.log('🖱️ Haciendo click en botón + para agregar paso');

        cy.get('div[role="tab"][aria-selected="true"]')
            .find('button.add-button mat-icon')
            .contains('add')
            .click({ force: true });

        cy.wait(1000);
    }*/

    /**
     * Hace click en el botón + para agregar paso, verificando que no esté ya desplegado
     */
    clickAgregarPaso() {
        cy.log('🖱️ Verificando botón + para agregar paso');

        // Primero verificar si ya hay un formulario abierto
        cy.get('body').then($body => {
            const formularioAbierto = $body.find('h2:contains("Nueva definición de paso")').length > 0;

            if (formularioAbierto) {
                cy.log('✅ Formulario de paso ya está abierto, no es necesario hacer click');
                return;
            }

            // Si no está abierto, hacer click en el botón +
            cy.log('🖱️ Haciendo click en botón + para abrir formulario');
            cy.get('div[role="tab"][aria-selected="true"]')
                .find('button.add-button mat-icon')
                .contains('add')
                .click({ force: true });

            // Esperar a que el formulario se abra
            cy.wait(2000);

            // Verificar que se abrió correctamente
            cy.contains('h2', 'Nueva definición de paso', { timeout: 10000 })
                .should('be.visible')
                .then(() => {
                    cy.log('✅ Formulario de paso abierto correctamente');
                });
        });
    }




    llenarCampoIframe2(valor, labelText, opciones = {}) {
        const {
            timeout = 10000,
            skipContext = false,
            force = true
        } = opciones;

        if (!valor || valor === "") {
            cy.log(`⏭️ Campo "${labelText}" omitido (valor vacío)`);
            return;
        }

        cy.log(`✏️ Llenando campo "${labelText}" con valor "${valor}"`);

        const escribir = () => {
            // Buscar el mat-label por su texto (SIN VERIFICAR VISIBILIDAD)
            cy.contains('mat-label', labelText, { timeout })
                .should('exist') // 👈 CAMBIO CLAVE: exist en lugar de be.visible
                .then($label => {
                    // Encontrar el input/textarea dentro del mat-form-field
                    const $campo = $label.closest('mat-form-field').find('input, textarea').first();

                    cy.wrap($campo)
                        .should('exist')
                        .click({ force: true })
                        .clear({ force: true })
                        .type(valor, { force: true, delay: 50 });

                    cy.log(`      ✅ Campo "${labelText}" = "${valor}"`);
                });
        };

        if (skipContext) {
            escribir();
        } else {
            cy.get('iframe.frame', { timeout })
                .its('0.contentDocument.body')
                .should('not.be.empty')
                .then(cy.wrap)
                .within(() => {
                    escribir();
                });
        }
    }

    // Espera a que desaparezca el spinner, buscando dentro y fuera del iframe
    esperarQueSpinnerDesaparezca(opciones = {}) {
        const { timeout = 10000, intervalo = 200 } = opciones;
        cy.log(`⏳ Esperando a que desaparezca el spinner...`);

        const verificar = () => {
            // Buscar en el contexto actual (iframe si estamos dentro)
            cy.root().then($root => {
                const existeEnIframe = $root.find('mat-spinner').length > 0;
                // Buscar en el contexto principal (fuera del iframe)
                const existeEnPrincipal = Cypress.$('mat-spinner').length > 0;
                const existe = existeEnIframe || existeEnPrincipal;

                if (existe) {
                    cy.log(`⏳ Spinner presente, esperando ${intervalo}ms...`);
                    cy.wait(intervalo);
                    verificar(); // seguir verificando recursivamente
                } else {
                    cy.log('✅ Spinner desaparecido o nunca apareció');
                }
            });
        };

        // Ejecutar la verificación con control de timeout
        cy.then(() => {
            let tiempoRestante = timeout;
            const verificarConTimeout = () => {
                cy.root().then($root => {
                    const existeEnIframe = $root.find('mat-spinner').length > 0;
                    const existeEnPrincipal = Cypress.$('mat-spinner').length > 0;
                    const existe = existeEnIframe || existeEnPrincipal;

                    if (existe) {
                        if (tiempoRestante > 0) {
                            cy.wait(intervalo);
                            tiempoRestante -= intervalo;
                            verificarConTimeout();
                        } else {
                            throw new Error(`⏰ Timeout: el spinner no desapareció después de ${timeout}ms`);
                        }
                    } else {
                        cy.log('✅ Spinner desaparecido o nunca apareció');
                    }
                });
            };
            verificarConTimeout();
        });
    }

    //llena campos readonly que abren otra ventana se uso en expresiones de afectacion de totales
    llenarCampoReadonlySinClick(valor, labelText, opciones = {}) {
        const {
            timeout = 10000,
            skipContext = false,
            triggerEvents = true,
            force = true, // aunque no se usa, lo dejamos por compatibilidad
            trim = true,
            normalizarTildes = true,
            ignorarMayusculas = true
        } = opciones;

        const ejecutar = () => {
            if (valor == null || (typeof valor === 'string' && valor.trim() === '')) {
                cy.log(`⏭️ Valor vacío o nulo para "${labelText}", se omite.`);
                return;
            }

            const normalizarTildesFunc = (texto) => {
                if (!texto) return texto;
                return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            };

            const normalizarCompleto = (texto) => {
                if (!texto) return texto;
                let resultado = String(texto);
                if (normalizarTildes) {
                    resultado = normalizarTildesFunc(resultado);
                }
                if (ignorarMayusculas) {
                    resultado = resultado.toLowerCase();
                }
                return resultado.trim().replace(/\s+/g, ' ');
            };

            let valorAEscribir = String(valor);
            if (trim) valorAEscribir = valorAEscribir.trim();
            cy.log(`🔍 Valor a establecer: "${valorAEscribir}"`);

            const posiblesLabels = Array.isArray(labelText) ? labelText : [labelText];
            const opcionesNormalizadas = posiblesLabels.map(l => normalizarCompleto(l));

            let mejorCoincidenciaTexto = ''; // Variable para guardar el texto del label encontrado

            const buscarLabel = () => {
                return cy.get('label, mat-label, span.label', { timeout })
                    .then($labels => {
                        let $mejorCoincidencia = null;
                        let mejorPuntaje = -1;

                        $labels.each((index, el) => {
                            const textEl = Cypress.$(el).text().trim();
                            const textNormalizado = normalizarCompleto(textEl);
                            opcionesNormalizadas.forEach((opcionNorm, idx) => {
                                const opcionOrig = posiblesLabels[idx];
                                let puntaje = 0;
                                if (textNormalizado === opcionNorm) puntaje = 100;
                                else if (textNormalizado.replace(/\s*\*\s*/g, '') === opcionNorm) puntaje = 90;
                                else if (textNormalizado.startsWith(opcionNorm + ' ')) puntaje = 80;
                                else if (textNormalizado.includes(opcionNorm)) puntaje = 70;
                                else if (opcionNorm.includes(textNormalizado)) puntaje = 50;

                                if (puntaje > mejorPuntaje) {
                                    mejorPuntaje = puntaje;
                                    $mejorCoincidencia = cy.$$(el);
                                    mejorCoincidenciaTexto = textEl; // Asignamos aquí
                                }
                            });
                        });

                        if ($mejorCoincidencia && mejorPuntaje >= 50) {
                            cy.log(`✅ Mejor coincidencia: "${mejorCoincidenciaTexto}" (puntaje: ${mejorPuntaje})`);
                            return cy.wrap($mejorCoincidencia);
                        }

                        cy.log('❌ No se encontró label');
                        throw new Error(`No se encontró campo para label: ${posiblesLabels.join(', ')}`);
                    });
            };

            buscarLabel()
                .should('be.visible')
                .then($label => {
                    const inputId = $label.attr('for');
                    const encontrarInput = () => {
                        if (inputId) {
                            return cy.get(`#${inputId}`);
                        } else {
                            return cy.wrap($label)
                                .parents('.mat-form-field, .form-group')
                                .find('input, textarea, select')
                                .first();
                        }
                    };
                    encontrarInput()
                        .should('exist')
                        .then($input => {
                            cy.wrap($input).scrollIntoView({ duration: 300, offset: { top: -100 } });
                            cy.wait(200);
                            cy.wrap($input).invoke('val', valorAEscribir);
                            if (triggerEvents) {
                                cy.wrap($input).trigger('input', { force: true }).trigger('change', { force: true });
                            }
                            // Ahora mejorCoincidenciaTexto está definida porque se asignó en el paso anterior
                            cy.log(`✅ Valor "${valorAEscribir}" establecido en campo "${mejorCoincidenciaTexto}"`);
                        });
                });
        };

        if (skipContext) {
            ejecutar();
        } else if (this._ejecutarEnContexto) {
            this._ejecutarEnContexto(ejecutar);
        } else {
            ejecutar();
        }
    }

    agregarRutinaTRX(tipo) {
        cy.log(`🔄 Agregando rutina ${tipo}`);

        // Validar que el tipo sea válido
        const tipoValido = tipo.toUpperCase();
        if (tipoValido !== 'PRE' && tipoValido !== 'POS') {
            cy.log(`❌ Tipo de rutina no válido: ${tipo}. Debe ser PRE o POS`);
            return;
        }

        // XPath dinámico según el tipo
        cy.xpath(
            `//mat-panel-title[contains(., 'Rutinas ${tipoValido}')]//button[contains(@class, 'btn-add-mini')]`
        )
            .should('be.visible')
            .click({ force: true });

        cy.wait(500);
        cy.log(`✅ Clic en botón agregar rutina ${tipoValido} realizado`);
    }



    /*llenarTexAreaIframe(valor, opciones = {}) {
        const { timeout = 10000, force = true, skipContext = true } = opciones;

        cy.log(`🔍 Llenando campo Descripción con: "${valor}"`);

        if (!valor || valor.trim() === '') {
            cy.log('⏭️ Descripción vacía, se omite');
            return;
        }

        // Buscar por el texto del label y luego el textarea asociado
        cy.xpath("//mat-label[text()='Descripción']/ancestor::mat-form-field//textarea", { timeout })
            .first()
            .scrollIntoView({ duration: 300, offset: { top: -50 }, ensureScrollable: false })
            .click({ force: true })
            .clear({ force: true })
            .type(valor, { delay: 10, force: true })
            .then($textarea => {
                cy.log(`✅ Descripción escrita: "${$textarea.val()}"`);
                // Verificar que se escribió correctamente
                expect($textarea.val()).to.equal(valor);
            });
    }*/




    llenarDescripcionIframe(valor, opciones = {}) {
        const { timeout = 10000, force = true, skipContext = true } = opciones;

        cy.log(`🔍 Llenando descripción con: "${valor}"`);

        if (!valor || valor.trim() === '') {
            cy.log('⏭️ Descripción vacía, se omite');
            return;
        }

        // BUSCAR POR LA ESTRUCTURA COMPLETA Y FILTRAR POR VISIBLE
        cy.xpath("//mat-label[text()='Descripción']/ancestor::mat-form-field//textarea", { timeout })
            .filter(':visible')
            .first()
            .scrollIntoView({ duration: 300, offset: { top: -50 }, ensureScrollable: false })
            .click({ force: true })
            .clear({ force: true })
            .type(valor, { delay: 10, force: true })
            .then($textarea => {
                cy.log(`✅ Descripción escrita en textarea visible: ${$textarea.attr('id')}`);
                cy.log(`   Valor: "${$textarea.val()}"`);
            });
    }


    seleccionarPaso(nombrePaso, opciones = {}) {
        const { timeout = 10000, force = true, skipContext = true } = opciones;

        cy.log(`🔍 Seleccionando paso: "${nombrePaso}"`);

        if (!nombrePaso || nombrePaso.trim() === '') {
            cy.log('⏭️ Nombre de paso vacío, se omite');
            return;
        }

        // Normalizar el texto del paso (quitar tildes, minúsculas)
        const normalizarTexto = (texto) => {
            if (!texto) return texto;
            return texto.normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .trim();
        };

        const pasoNormalizado = normalizarTexto(nombrePaso);

        cy.log(`📋 Paso normalizado: "${pasoNormalizado}"`);

        // XPath con normalización para buscar el paso
        const xpath = `(//span[@class='cursor' and translate(translate(normalize-space(), 'ÁÉÍÓÚÜáéíóúü', 'AEIOUuaeiouu'), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') = '${pasoNormalizado}'])[1]`;

        cy.xpath(xpath, { timeout })
            .scrollIntoView({ duration: 300, offset: { top: -50 }, ensureScrollable: false })
            .click({ force: true })
            .then($element => {
                cy.log(`✅ Clic realizado en paso: "${$element.text().trim()}"`);
            });
    }

    seleccionarOperacionPorCaracteristica(caracteristica, operacion, opciones = {}) {
        const {
            timeout = 10000,
            skipContext = false,
            ignorarTildes = true,
            ignorarMayusculas = true,
            ignorarEspacios = true,
            force = true
        } = opciones;

        const ejecutar = () => {
            cy.log(`🔍 Buscando fila con característica "${caracteristica}" para seleccionar operación "${operacion}"`);

            const normalizarTexto = (texto) => {
                if (!texto) return '';
                let resultado = String(texto);
                if (ignorarTildes) {
                    resultado = resultado.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                }
                if (ignorarMayusculas) {
                    resultado = resultado.toLowerCase();
                }
                if (ignorarEspacios) {
                    resultado = resultado.trim().replace(/\s+/g, ' ');
                }
                return resultado;
            };

            const caracteristicaNorm = normalizarTexto(caracteristica);

            // Usar XPath para obtener todas las filas que tengan la celda de característica
            cy.xpath('//mat-row[.//mat-cell[contains(@class, "mat-column-charOperated")]]', { timeout }).then($rows => {
                cy.log(`Filas encontradas: ${$rows.length}`);

                let $filaEncontrada = null;
                let textoEncontrado = '';

                $rows.each((i, fila) => {
                    const $celdaChar = Cypress.$(fila).find('mat-cell.mat-column-charOperated').first();
                    const textoCelda = $celdaChar.text().trim();
                    const textoCeldaNorm = normalizarTexto(textoCelda);
                    cy.log(`Fila ${i+1}: "${textoCelda}" (norm: "${textoCeldaNorm}")`);
                    if (textoCeldaNorm === caracteristicaNorm || textoCeldaNorm.includes(caracteristicaNorm)) {
                        $filaEncontrada = Cypress.$(fila);
                        textoEncontrado = textoCelda;
                        return false;
                    }
                });

                if (!$filaEncontrada) {
                    throw new Error(`No se encontró fila con característica "${caracteristica}"`);
                }

                cy.log(`✅ Fila encontrada: "${textoEncontrado}"`);

                // Dentro de la fila, buscar el select en la celda de operación
                const $select = $filaEncontrada.find('mat-cell.mat-column-operation mat-select');
                if ($select.length === 0) {
                    throw new Error('No se encontró mat-select en la celda de operación');
                }

                cy.wrap($select).click({ force });
                cy.get('.cdk-overlay-pane', { timeout }).should('be.visible');
                cy.get('.cdk-overlay-pane mat-option').then($options => {
                    let $opcion = null;
                    $options.each((i, opt) => {
                        const textoOpcion = Cypress.$(opt).text().trim();
                        const textoOpcionNorm = normalizarTexto(textoOpcion);
                        if (textoOpcionNorm === normalizarTexto(operacion) || textoOpcionNorm.includes(normalizarTexto(operacion))) {
                            $opcion = Cypress.$(opt);
                            return false;
                        }
                    });

                    if ($opcion) {
                        cy.wrap($opcion).scrollIntoView().click({ force });
                        cy.log(`✅ Operación "${operacion}" seleccionada para característica "${caracteristica}"`);
                    } else {
                        throw new Error(`No se encontró la opción "${operacion}" en el combo`);
                    }
                    cy.get('.cdk-overlay-backdrop', { timeout: 5000 }).should('not.exist');
                });
            });
        };

        if (skipContext) {
            ejecutar();
        } else if (this._ejecutarEnContexto) {
            this._ejecutarEnContexto(ejecutar);
        } else {
            ejecutar();
        }
    }
}

export default MetodosGeneralesPomCy;