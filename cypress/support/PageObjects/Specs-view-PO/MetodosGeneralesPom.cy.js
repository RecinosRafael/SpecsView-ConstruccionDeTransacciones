class MetodosGeneralesPomCy{

    //Boton para agregar registros
    BtnAgregarRegistro(){
        cy.log('Clic en botón ADD');
        cy.wait(1500)
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
    BtnAgregarAng(){
     cy.log('Clic en botón ADD');

    this.getIframeBody().within(() => {
      cy.xpath("//button[.//mat-icon[normalize-space()='add']]", { timeout: 15000 })
        .should('be.visible')
        .click({ force: true });
    });
}



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

    //Boton para cancelar la insercion del registro.
    BtnCancelarRegistro() {
        cy.log('Clic en botón CANCELAR');

        cy.contains('button', 'Cancelar', { timeout: 15000 })
            .should('exist')
            .click({ force: true });
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
        cy.wait(4500)
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
        cy.wait(1500)
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


}

export default MetodosGeneralesPomCy;