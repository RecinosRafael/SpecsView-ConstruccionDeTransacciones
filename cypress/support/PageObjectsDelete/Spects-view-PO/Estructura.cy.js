
class EstructuraCy{

    //Canales

    //Inicio Canal


    Canal(codigo, nombre, descripcion,){
        cy.get("#code").clear().should("be.visible").type(codigo)
        cy.get("#name").clear().should("be.visible").type(nombre)
        cy.get("#description").clear().should("be.visible").type(descripcion)
    }


    //Fin Canal

//Inicio Departamento


    Departamento(codigo, nombre){
        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
    }


    //Fin Departamento


//Inicio Jornadas

    JornadaLaboral(codigo, nombre, valorTransfiereSaldos) {
        cy.get('#code').should("be.visible").clear().type(codigo)
        cy.get('#name').should("be.visible").clear().type(nombre)

        if (!valorTransfiereSaldos) return;

        cy.get('mat-select', { timeout: 10000 })
            .filter(':visible')
            .first() // ajusta si no es el primero
            .then($select => {

                const valorActual = $select
                    .find('.mat-select-min-line')
                    .text()
                    .trim();

                // Solo cambia si es distinto
                if (valorActual !== valorTransfiereSaldos) {

                    cy.wrap($select)
                        .should('not.be.disabled')
                        .click({ force: true });

                    cy.get('.cdk-overlay-pane', { timeout: 15000 })
                        .find('mat-option')
                        .contains(valorTransfiereSaldos)
                        .scrollIntoView()
                        .click({ force: true });
                }
            });

    }

//Fin Jornadas


    //Inicio Region


    Region(codigo, nombre, descipcion){
        cy.get("#code").clear().should("be.visible").type(codigo)
        cy.get("#name").clear().should("be.visible").type(nombre)
        cy.get('#description').clear().should("be.visible").type(descipcion)
    }
    //Fin Region


    //Inicio Tipo de Rama

    SelectOpcTipoRama(){
        cy.xpath("//a[@id='typeTreebranch']").should("be.visible").click({force:true})
        cy.wait(3000)
    }

    TipoRama(codigo, nombre, descripcion, valorCanal){

        cy.get('#code').should("be.visible").clear().type(codigo)
        cy.get('#name').should("be.visible").clear().type(nombre)
        cy.get('#description').should("be.visible").clear().type(descripcion)

        if (valorCanal) {

            cy.get('mat-select', { timeout: 10000 })
                .filter(':visible')
                .first()
                .then($select => {

                    const valorActual = $select
                        .find('.mat-select-min-line')
                        .text()
                        .trim();

                    // 🔁 Solo cambiar si es distinto
                    if (valorActual !== valorCanal) {

                        cy.wrap($select)
                            .should('not.be.disabled')
                            .click({ force: true });

                        cy.get('.cdk-overlay-pane', { timeout: 10000 })
                            .find('.mat-option-text')
                            .contains(valorCanal)
                            .should('be.visible')
                            .click();
                    }
                });
        }

    }
    //Fin Tipo de Rama


//Inicio Árbol Organizacional (agencias)
    getIframeBody() {
     return cy
        .get('iframe.frame', { timeout: 20000 })
        .should('be.visible')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap)
    }

    arbolOrganizacional(codigo, nombre, descipcion, responsable, CicloVida, canal, 
        validoDesde, validoHasta, tieneUsuariosFinales, esRaiz, padre, tipoRama, puesto, 
        codigoEquivalente, nivelEnArbol, nombreUsuario, complementoDireccion, tiempoLimite,
        nivelGeografico1, nivelGeografico2, nivelGeografico3, region, latitud, longitud, logo){



        //si es raiz cambia el flujo

        if(esRaiz){
            //quita padre y agrega logo
        this.getIframeBody().within(() => {this.ingresarInput("Código", codigo)});
        this.getIframeBody().within(() => {this.ingresarInput("Nombre", nombre)});
        this.getIframeBody().within(() => {this.ingresaTextArea("Descripción", descipcion)});
        this.getIframeBody().within(() => {this.ingresarInput("Responsable", responsable)});
        this.getIframeBody().within(() => {this.seleccionarComboAO(CicloVida, "Ciclo de vida")});
        this.getIframeBody().within(() => {this.seleccionarComboAO(canal, "Canal")});
        this.getIframeBody().within(() => {this.seleccionarFecha("Válido Desde", validoDesde)});
        this.getIframeBody().within(() => {this.seleccionarFecha("Válido Hasta", validoHasta)});
        this.getIframeBody().within(() => {this.switchWOS(tieneUsuariosFinales, "Tiene usuarios finales")});
        this.getIframeBody().within(() => {this.switchWOS(esRaiz, "Es Raíz")});
        this.getIframeBody().within(() => {this.ingresarInput("Tiempo límite", tiempoLimite)});
        this.getIframeBody().within(() => {this.seleccionarComboAO(tipoRama, "Tipo de rama")}); 
        this.getIframeBody().within(() => {this.ingresarInput("Puesto", puesto)});
        this.getIframeBody().within(() => {this.ingresarInput("Código equivalente", codigoEquivalente)});
        this.getIframeBody().within(() => {this.ingresarInput("Nivel en árbol [0,1,2,..]", nivelEnArbol)});   
        this.getIframeBody().within(() => {this.ingresarInput("Nombre de usuario", nombreUsuario)});
        this.getIframeBody().within(() => {this.ingresaTextArea("Complemento de dirección", complementoDireccion)});
        this.getIframeBody().within(() => {this.seleccionarComboAO(nivelGeografico1, "Nivel geográfico 1")});
        this.getIframeBody().within(() => {this.seleccionarComboAO(nivelGeografico2, "Nivel geográfico 2")});
        this.getIframeBody().within(() => {this.seleccionarComboAO(nivelGeografico3, "Nivel geográfico 3")});
        this.getIframeBody().within(() => {this.seleccionarComboAO(region, "Región")});
        this.getIframeBody().within(() => {this.ingresarInput("Latitud", latitud)});
        this.getIframeBody().within(() => {this.ingresarInput("Longitud", longitud)});
        this.getIframeBody().within(() => {this.subirArchivoPorLabel("Logo", logo)});
        
        }else{
            //lleva padre y sin logo
        this.getIframeBody().within(() => {this.ingresarInput("Código", codigo)})
        this.getIframeBody().within(() => {this.ingresarInput("Nombre", nombre)})
        this.getIframeBody().within(() => {this.ingresaTextArea("Descripción", descipcion)})
        this.getIframeBody().within(() => {this.ingresarInput("Responsable", responsable)})
        this.getIframeBody().within(() => {this.seleccionarComboAO(CicloVida, "Ciclo de vida")})
        this.getIframeBody().within(() => {this.seleccionarComboAO(canal, "Canal")})
        this.getIframeBody().within(() => {this.seleccionarFecha("Válido Desde", validoDesde)})
        this.getIframeBody().within(() => {this.seleccionarFecha("Válido Hasta", validoHasta)})
        this.getIframeBody().within(() => {this.switchWOS(tieneUsuariosFinales, "Tiene usuarios finales")})
        this.getIframeBody().within(() => {this.switchWOS(esRaiz, "Es Raíz")})
        this.getIframeBody().within(() => {this.ingresarInput("Tiempo límite", tiempoLimite)})
        this.getIframeBody().within(() => {this.seleccionarComboAO(padre, "Padre")})
        this.getIframeBody().within(() => {this.seleccionarComboAO(tipoRama, "Tipo de rama") })
        this.getIframeBody().within(() => {this.ingresarInput("Puesto", puesto)})
        this.getIframeBody().within(() => {this.ingresarInput("Código equivalente", codigoEquivalente)})
        this.getIframeBody().within(() => {this.ingresarInput("Nivel en árbol [0,1,2,..]", nivelEnArbol)   })
        this.getIframeBody().within(() => {this.ingresarInput("Nombre de usuario", nombreUsuario)})
        this.getIframeBody().within(() => {this.ingresaTextArea("Complemento de dirección", complementoDireccion)})
        this.getIframeBody().within(() => {this.seleccionarComboAO(nivelGeografico1, "Nivel geográfico 1")})
        this.getIframeBody().within(() => {this.seleccionarComboAO(nivelGeografico2, "Nivel geográfico 2")})
        this.getIframeBody().within(() => {this.seleccionarComboAO(nivelGeografico3, "Nivel geográfico 3")})
        this.getIframeBody().within(() => {this.seleccionarComboAO(region, "Región")})
        this.getIframeBody().within(() => {this.ingresarInput("Latitud", latitud)})
        this.getIframeBody().within(() => {this.ingresarInput("Longitud", longitud)})

        }
    }
    


seleccionarTransacciones(transacciones) {

  const encontradas = new Set();

  this.getIframeBody().within(() => {

    const buscarEnPagina = () => {
      cy.get('tbody tr').each(($row) => {
        cy.wrap($row)
          .find('td.mat-column-transactionName')
          .invoke('text')
          .then(texto => {
            const nombre = texto.trim();

            if (transacciones.includes(nombre) && !encontradas.has(nombre)) {
              cy.wrap($row)
                .find('mat-checkbox input[type="checkbox"]')
                .then($checkbox => {
                  if (!$checkbox.prop('checked')) {
                    cy.wrap($checkbox).click({ force: true });
                  }
                  encontradas.add(nombre);
                });
            }
          });
      });
    };

    const irSiguientePaginaSiExiste = () => {
      cy.get('button.mat-mdc-paginator-navigation-next')
        .then($btn => {
          if (!$btn.prop('disabled')) {
            cy.wrap($btn).click({ force: true });
            cy.wait(500);
            buscarYAvanzar();
          }
        });
    };

    const buscarYAvanzar = () => {
      buscarEnPagina();

      cy.then(() => {
        if (encontradas.size < transacciones.length) {
          irSiguientePaginaSiExiste();
        }
      });
    };

    buscarYAvanzar();
  });

  // 🔹 Evaluación final (fuera del iframe)
  cy.then(() => {
    const noEncontradas = transacciones.filter(t => !encontradas.has(t));

    if (noEncontradas.length > 0) {
      cy.log(`❌ Transacciones no encontradas: ${noEncontradas.join(', ')}`);
    } else {
      cy.log('✅ Todas las transacciones fueron seleccionadas');
    }
  });
}

















//Fin Árbol Organizacional (agencias)


        //Inicio Bóvedas

    Boveda(nombre, descripcion, valorArbolRaiz, valorRamaArbol, valorJornada, valorUsuario){
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)


        this.seleccionarComboBD(valorArbolRaiz, 0);
        this.seleccionarComboBD(valorRamaArbol, 1);
        this.seleccionarComboBD(valorJornada, 2);
        this.seleccionarComboBD(valorUsuario, 3);

    }

    seleccionarComboBD(valor, index) {

        // 🔴 CLAVE: si viene vacío → NO HACE NADA (MODIFICAR)
        if (
            valor === undefined ||
            valor === null ||
            valor.toString().trim() === ''
        ) {
            return;
        }

        cy.get('mat-select', { timeout: 10000 })
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
                        .find('.cdk-overlay-pane', { timeout: 15000 })
                        .should('exist')
                        .within(() => {
                            cy.contains('.mat-option-text', valor)
                                .should('be.visible')
                                .click();
                        });
                }
            });
    }







    //Fin de Bovedas


//Campos adicionales por entidad

    //Inicio Habilitar Campos adicionales a Entidad


    ConfifurarCamposAdicionalesEntidad(valorEntidad, valorCaracteristica, valorTipo, campoReferencia, descripcion){

        this.seleccionarComboCAE(valorEntidad, 0);
        this.seleccionarComboCAE(valorCaracteristica, 1);
        this.seleccionarComboCAE(valorTipo, 2);


        cy.get('[formcontrolname="refField"]').should("be.visible").clear().type(campoReferencia)
        cy.get('[formcontrolname="description"]').should("be.visible").clear().type(descripcion)


    }

    seleccionarComboCAE(valor, index) {
        if (!valor) return;

        cy.get('mat-select', { timeout: 10000 })
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
                        .find('.cdk-overlay-pane', { timeout: 15000 })
                        .should('exist')
                        .within(() => {
                            cy.contains('.mat-option-text', valor)
                                .should('be.visible')
                                .click();
                        });
                }
            });
    }

    EntrarConfifurarCamposAdicionalesEntidad(caracteristica) {
        cy.contains(
            'td.mat-column-characteristicSpec',
            caracteristica,
            { timeout: 15000 }
        )
            .should('exist')
            .scrollIntoView({ block: 'center' })
            .parents('tr.mat-row')
            .click({ force: true });
    }



    seleccionarComboAO(valor, xpath) {

        const textoValor = valor.toLowerCase();

        // 1️⃣ Abrir el mat-select por label
        cy.xpath(
            `//mat-form-field[
            .//mat-label[
                translate(
                    normalize-space(),
                    'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ',
                    'abcdefghijklmnopqrstuvwxyzáéíóúüñ'
                ) = '${xpath.toLowerCase()}'
            ]
        ]//mat-select`,
            { timeout: 15000 }
        )
            .should('exist')
            .click({ force: true });

        // 2️⃣ Seleccionar opción del overlay (aunque NO esté visible)
        cy.xpath(
            `//div[contains(@class,'cdk-overlay-pane')]
         //mat-option//span[
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
            .should('exist')
            .first()                 // 🔑 fuerza UN SOLO elemento
            .click({ force: true }); // 🔥 clic aunque no esté visible
    }


    checkBoxWOS(valor, xpath) {

        if(!valor){
            cy.xpath("//mat-checkbox[.//span[contains(normalize-space(),'"+xpath+"')]]").click();
            }
        
        }

    checkBox(valor, xpath) {

        if(valor){
            cy.xpath("//mat-checkbox[.//span[contains(normalize-space(),'"+xpath+"')]]").click();
            }
        
        }

    switchWOS(valor, textoLabel) {

        const labelLower = textoLabel.toLowerCase();

        cy.xpath(
        `//app-input-switch[
            .//label[
                translate(normalize-space(),
                'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ',
                'abcdefghijklmnopqrstuvwxyzáéíóúüñ'
                )='${labelLower}'
            ]
        ]//button[@role='switch']`
        )
        .should('exist')
        .then($btn => {
            const isChecked = $btn.attr('aria-checked') === 'true';

            if (valor && !isChecked) {
                cy.wrap($btn).click();
            }

            if (!valor && isChecked) {
                cy.wrap($btn).click();
            }
        });
    }

    seleccionarFecha(selector, fecha) {

        if (!fecha) return;

        // fecha viene como "DD/MM/YYYY"
        const [day, month, year] = fecha.split('/');
        const formattedDate = `${day}/${month}/${year}`;

        cy.xpath(`//mat-form-field[.//mat-label[normalize-space()='${selector}']]//input`, { timeout: 10000 })
            .should('exist')
            .should('be.visible')
            .invoke('removeAttr', 'readonly')
            .then($input => {
                const nativeInput = $input[0];

                nativeInput.value = formattedDate;
                nativeInput.dispatchEvent(new Event('input', { bubbles: true }));
                nativeInput.dispatchEvent(new Event('change', { bubbles: true }));
                nativeInput.dispatchEvent(new Event('blur', { bubbles: true }));
            });
    }

    ingresarInput(label, valor) {

        // const labelLower = label.toLowerCase();

        cy.xpath(
        `(//mat-form-field[
            .//mat-label[
                translate(
                normalize-space(),
                'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ',
                'abcdefghijklmnopqrstuvwxyzáéíóúüñ'
                )='${label.toLowerCase()}'
            ]
        ]//input)[1]`
        )
        .should('be.visible')
        .click({force: true}).clear()
        .type(valor, {force: true});
    }

    // ingresarInputWC(label, valor) {

    //     const labelLower = label.toLowerCase();

    //     cy.xpath(
    //     `(//mat-form-field[
    //         .//mat-label[
    //             translate(
    //             normalize-space(),
    //             'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ',
    //             'abcdefghijklmnopqrstuvwxyzáéíóúüñ'
    //             )='${labelLower}'
    //         ]
    //     ]//input)[1]`
    //     )
    //     .should('be.visible')
    //     .type(valor, { force: true });
    // }

    ingresaTextArea(label, valor) {

        const labelLower = label.toLowerCase();

        cy.xpath(
        `//mat-form-field[
            .//mat-label[
                translate(
                normalize-space(),
                'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ',
                'abcdefghijklmnopqrstuvwxyzáéíóúüñ'
                )='${labelLower}'
            ]
        ]//textarea`
        )
        .should('be.visible')
        .clear()
        .type(valor);
    }

    

    subirArchivoPorLabel(label, archivo) {

        const labelLower = label.toLowerCase();

        cy.xpath(
        `//app-input-file[
            .//label[
                translate(
                normalize-space(),
                'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ',
                'abcdefghijklmnopqrstuvwxyzáéíóúüñ'
                )='${labelLower}'
            ]
        ]//input[@type='file']`
        )
        .should('exist')
        .selectFile(`cypress/fixtures/images/${archivo}`, { force: true });
    }


    //Fin Habilitar Campos adicionales a Entidad

}

export default EstructuraCy;
