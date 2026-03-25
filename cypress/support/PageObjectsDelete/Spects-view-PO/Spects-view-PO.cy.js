
require("cypress-xpath");

class VisitaSpectsView{

    
    VisitaSpectsView(){
        before(() => {
            //con sertificado server 108
            //cy.visit("https://keycloak.bytesw.cloud:30001/specs-view/#/");

            
            //con sertificado server 14.30
            cy.visit("http://172.16.14.30:30010/specs-view");
            //Sin sertificado
            //cy.visit("http://172.16.10.109:30001/specs-view")
    
            cy.title().should('eq', 'Inicia sesión en jteller');
            cy.wait(1500);
        })
    }


    //Inicio de Metodos Generales 

        //Boton para agregar registros 
        BtnAgregarRegistro(){
            cy.xpath("//mat-icon[contains(text(),'add')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }

        //Boton para confirmar el agregar y modificar registros
        BtnAceptarRegistro(){
            cy.xpath("//span[contains(text(),'Aceptar')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }   

        //Filtro, Buscar por codigo 
        BuscarRegistroCodigo(codigo){
            cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-menu-content > :nth-child(1)').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('#code').should("be.visible").type(codigo)
            cy.wait(1000)
            cy.get('[aria-label="Click to search"]').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-row > .cdk-column-code').should("be.visible").click({force:true})
            cy.wait(1000)
         }

         //Filtro, Buscar por Nombre 
         BuscarRegristroNombre(nombre){
            cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
            cy.wait(2000)
            cy.get('.mat-menu-content > :nth-child(2)').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('#name').should("be.visible").type(nombre)
            cy.wait(1000)
            cy.xpath("//mat-icon[contains(text(),'search')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('tbody > :nth-child(1) > .cdk-column-name').should("be.visible").click({force:true})
            cy.wait(1000)
        }

        //Filtro, Buscar por Descripcion  
        BuscarRegristroDescripcion(descripcion){
            cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-menu-content > :nth-child(2)').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('#description').should("be.visible").type(descripcion)
            cy.wait(1000)
            cy.xpath("//mat-icon[contains(text(),'search')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('tbody > :nth-child(1) > .cdk-column-description').should("be.visible").click({force:true})
            cy.wait(1000)
        }

         //Filtro, Buscar por tipo de cajero  
         BuscarRegristroTipoCajero(){
            cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-menu-content > :nth-child(1)').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.is-empty > #typeCashier').should("be.visible").select('Cajero Byte SA')
            cy.wait(1000)
            cy.xpath("//mat-icon[contains(text(),'search')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-row > .cdk-column-typeCashier-description').should("be.visible").click({force:true})
            cy.wait(1000)
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


         //Modificar 
         BtnModificarRegistro(){
            cy.xpath("//mat-icon[contains(text(),'edit')]").should("be.visible").click({force:true})
            cy.wait(1000)
         }

        //Eliminar
        EliminarRegistro(){
            cy.xpath("//mat-icon[contains(text(),'delete')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Eliminar')]").should("be.visible").click({force:true})
            cy.wait(3000)
         }

        //Regredar 

        Regresar(){
            cy.get('.back').should("be.visible").click({force:true})
            cy.wait(1000)
        }

    //Final de Metodos Generales 


    Login(username, password){
        cy.get("#username").should("be.visible").type(username);
            cy.get("#password").should("be.visible").type(password);
            cy.get("#kc-login").should("be.visible").click({ force: true });
            cy.wait(5000);

    }

    SelectMenu(){
        cy.xpath("//mat-nav-list[@id='businessEntity']//a[@class='mat-list-item mat-focus-indicator']").click({ force: true });
        cy.wait(5000);
    }


    //Inicio Pais 
    SelectOpcPais(){
        cy.xpath("//a[@id='country']").should("be.visible").click({force:true})
        cy.wait(3000)
    }

    AgregarPais(nombre, iso2Code, iso3Code){
        cy.xpath("//mat-icon[contains(text(),'add')]").should("be.visible").click({force:true})
        cy.get("#name").should("be.visible").type(nombre)
        cy.get("#iso2Code").should("be.visible").type(iso2Code)
        cy.get("#iso3Code").should("be.visible").type(iso3Code)
        cy.get('.mat-select-placeholder').should("be.visible").click({force:true});
        cy.get('#mat-option-3 > .mat-option-text').click({force:true});
        cy.get('.mat-primary > .mat-button-wrapper').click({force:true});
        cy.wait(1000)
    }

    BusquedaRegristroPais(){
        cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
        cy.get('.mat-menu-content > :nth-child(1)').should("be.visible").click({force:true})
        cy.get("#name").should("be.visible").type("Argentina")
        cy.xpath("//mat-icon[contains(text(),'search')]").should("be.visible").click({force:true})
        cy.wait(1000)
        cy.get('.mat-row > .cdk-column-name').should("be.visible").click({force:true})
        cy.wait(1000)
    }

    ModificarPais(nombre, iso2Code, iso3Code){
        cy.get('span.ng-star-inserted > .mat-focus-indicator > .mat-button-wrapper > .mat-icon').should("be.visible").click({ force: true });
        cy.wait(1000)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#iso2Code").should("be.visible").clear().type(iso2Code)
        cy.get("#iso3Code").should("be.visible").clear().type(iso3Code)        
        //cy.get('#mat-select-value-3').click();
        //cy.get('#mat-option-3 > .mat-option-text').click();
        //cy.get('.mat-primary > .mat-button-wrapper').click();
        cy.get('.mat-primary > .mat-button-wrapper').click({force:true})
        cy.wait(1000)

    }

    Regresar(){
        cy.get('.back').should("be.visible").click({force:true})
        cy.wait(1000)
    }

    EliminarPais(){
        cy.xpath("//mat-icon[contains(text(),'delete')]").should("be.visible").click({force:true})
        cy.wait(1000)
        cy.xpath("//span[contains(text(),'Eliminar')]").should("be.visible").click({force:true})
        cy.wait(3000)
    }

    //Fin Pais

    //Inicio Nivel Geografico 

    SelectOpcNivelGeograficoUno(){
        cy.xpath("//a[@id='geographicLevel1']").should("be.visible").click({ force: true });
        cy.wait(3000)
    }

    AgregarNG(codigo, nombre){
        cy.xpath("//mat-icon[contains(text(),'add')]").should("be.visible").click({ force: true });
        cy.get("#code").should("be.visible").type(codigo);
        cy.get("#name").should("be.visible").type(nombre);
        cy.get(".text-end > .mat-primary").should("be.visible").click({ force: true });
        cy.wait(1000)
    }

    BusquedaRegristroNG(codigo){
        cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({ force: true });
        cy.wait(1000);
        cy.get(".mat-menu-content > :nth-child(1)").should("be.visible").click({ force: true });
        cy.wait(1000);
        cy.get("#code").should("be.visible").type(codigo);
        cy.wait(1000);
        cy.xpath("//mat-icon[contains(text(),'search')]").should("be.visible").click({ force: true });
        cy.wait(1000);
        cy.get(".mat-row > .cdk-column-name").should("be.visible").click({ force: true });
        cy.wait(1000);
    }

    ModificarNG(codigo, nombre){
        cy.get("span.ng-star-inserted > .mat-focus-indicator > .mat-button-wrapper > .mat-icon").should("be.visible").click({ force: true });
        cy.get("#code").should("be.visible").clear().type(codigo);
        cy.get("#name").should("be.visible").clear().type(nombre);
        cy.get(".text-end > .mat-primary").should("be.visible").click({ force: true });
        cy.wait(2000);
    }

    EliminarNG(){
        cy.xpath("//mat-icon[contains(text(),'delete')]").should("be.visible").click({ force: true });
        cy.wait(1000);
        cy.get(".mat-primary > .mat-button-wrapper").should("be.visible").click({ force: true });
        cy.wait(1000);
    }

    NavegarNG2(){
        cy.xpath("//mat-icon[contains(text(),'menu_open')]").should("be.visible").click({force: true})
        cy.wait(1000)
        cy.xpath("//li[contains(text(),'Nivel Geográfico 2')]").should("be.visible").click({force:true})
        cy.wait(1000)

    }

    NavegarNG3(){
        cy.xpath("//mat-icon[contains(text(),'menu_open')]").should("be.visible").click({force:true})
        cy.wait(500)
        cy.xpath("//li[contains(text(),'Nivel Geográfico 3')]").should("be.visible").click({force:true})
    }

    RegresarNG(){
        cy.get('.back').should("be.visible").click({force:true})
        cy.wait(500)
    }
        //Fin Nivel Geografico 

        //Inicio Monedas
        
        SelectOpcMoneda(){
            cy.get('#money').should("be.visible").click({force:true})
            cy.wait(3000)
        }

        Monedas(codigo, codigoIso, nombre, codigoNumerico, decimales, puntoFlotante){
 
            cy.get('#code').clear().should("be.visible").type(codigo)
            cy.get('#iso3Code').clear().should("be.visible").type(codigoIso)
            cy.get('#name').clear().should("be.visible").type(nombre)
            cy.get('#numberCode').clear().should("be.visible").type(codigoNumerico)
            cy.get('#decimals').clear().should("be.visible").type(decimales)
            cy.get('#floatingPoint').clear().should("be.visible").type(puntoFlotante)
        }

        ModificarMoneda(codigo,codigoIso, nombre, codigoNumerico, decimales, puntoFlotante){
            cy.xpath("//mat-icon[contains(text(),'edit')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('#code').should("be.visible").clear().type(codigo)
            cy.get('#iso3Code').should("be.visible").clear().type(codigoIso)
            cy.get('#name').should("be.visible").clear().type(nombre)
            cy.get('#numberCode').should("be.visible").clear().type(codigoNumerico)
            cy.get('#decimals').should("be.visible").clear().type(decimales)
            cy.get('#floatingPoint').should("be.visible").clear().type(puntoFlotante)
            cy.get('.mat-primary > .mat-button-wrapper').should("be.visible").click({force:true})
            cy.wait(1000)
        }

        ElimiarMoneda(){
            cy.xpath("//mat-icon[contains(text(),'delete')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Eliminar')]").should("be.visible").click({force:true})
        }

        NavergarDenominacionMoneda(){
            cy.xpath("//mat-icon[contains(text(),'menu_open')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//li[contains(text(),'Denominación de Moneda')]").should("be.visible").click({force:true})
        }

        AgregarDenominacionMoneda(nombre, etiqueta, monto){
            cy.xpath("//mat-icon[contains(text(),'add')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('#name').should("be.visible").type(nombre)
            cy.get('#label').should("be.visible").type(etiqueta)
            cy.get('.mat-select-placeholder').should("be.visible").click({force:true})
            cy.xpath("//body/div[3]/div[2]/div[1]/div[1]/div[1]/mat-option[1]/span[1]").should("be.visible").click({force:true})
            cy.get('#amount').should("be.visible").type(monto)
            cy.get('.mat-primary > .mat-button-wrapper').should("be.visible").click({force:true})
            cy.wait(1000)
        }

        BuscarRegistroDenominacionMoneda(nombre){
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-menu-content > :nth-child(1)').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('#name').should("be.visible").type(nombre)
            cy.wait(1000)
            cy.get('[aria-label="Click to search"] > .mat-button-wrapper > .mat-icon').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('tbody > :nth-child(1) > .cdk-column-name').should("be.visible").click({force:true})
        }

        ModificarDenominacionMoneda(nombre, etiqueta, monto){
            cy.xpath("//mat-icon[contains(text(),'edit')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('#name').should("be.visible").clear().type(nombre)
            cy.get('#label').should("be.visible").clear().type(etiqueta)
            // cy.get('.mat-select-placeholder').click()
            // cy.get('#mat-option-6 > .mat-option-text').click()
            cy.get('#amount').should("be.visible").clear().type(monto)
            cy.xpath("//span[contains(text(),'Aceptar')]").click({force:true})
            cy.wait(1000)
        }

        EliminarDenominacionMoneda(){
            cy.xpath("//mat-icon[contains(text(),'delete')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Eliminar')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }

        NavegarPaisesQueUsan(){
            cy.xpath("//li[contains(text(),'Paises que la usan')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }

        AgregarPaisesQueUsan(){
            cy.xpath("//mat-icon[contains(text(),'add')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-select-placeholder').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Guatemala')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Aceptar')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }

        BuscarRegistroPaisesQueUsan(){
            cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-menu-content > .mat-focus-indicator').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.is-empty > #country').select('1');    
            cy.wait(1000)
            cy.xpath("//mat-icon[contains(text(),'search')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-row > .cdk-column-country-name').should("be.visible").click({force:true})
            cy.wait(1000)
        }

        ModifcarPaisQuaUsa(){
            cy.xpath("//mat-icon[contains(text(),'edit')]").should("be.visible").click({force:true});
            cy.wait(1000)
            cy.get('.mat-select-arrow-wrapper').should("be.visible").click({force:true});
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'JAPON')]").should("be.visible").click({force:true});
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Aceptar')]").should("be.visible").click({force:true})
            cy.wait(1000)

        }

        EliminarPaisQueUsa(){
            cy.xpath("//mat-icon[contains(text(),'delete')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Eliminar')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }

        //Fin Monedas

         //Inicio Canal

         SelectOPcCanal(){
            cy.xpath("//a[@id='channel']").should("be.visible").click({force:true})
            cy.wait(3000)
         }

         Canal(codigo, nombre, descripcion,){
            cy.get("#code").clear().should("be.visible").type(codigo)
            cy.get("#name").clear().should("be.visible").type(nombre)
            cy.get("#description").clear().should("be.visible").type(descripcion)
         }
         

         //Fin Canal

         //Inicio Region

         SelectOpcRegion(){
            cy.xpath("//a[@id='region']").should("be.visible").click({force:true})
            cy.wait(3000)
         }

         Region(codigo, nombre, descipcion){
            cy.get("#code").clear().should("be.visible").type(codigo)
            cy.get("#name").clear().should("be.visible").type(nombre)
            cy.get('#description').clear().should("be.visible").type(descipcion)
         }
         //Fin Region 

         //Inicio Rornada Laboral

         SelectOpcJornadaLaboral(){
            cy.xpath("//a[@id='workday']").should("be.visible").click({force:true})
            cy.wait(3000)
         }

         AgregarJornadaLaboral(codigo, nombre){
            cy.xpath("//mat-icon[contains(text(),'add')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('#code').should("be.visible").type(codigo)
            cy.get('#name').should("be.visible").type(nombre)

            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-workday[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[3]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Otra Jornada')]").should("be.visible").click({force:true})
            cy.wait(3000)
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-workday[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[4]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Jornada de Día')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Aceptar')]").should("be.visible").click({force:true})
            cy.wait(1000)
         }

         BuscarRegistroJornadaLaboral(codigo){
            cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-menu-content > :nth-child(1)').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get("#code").should("be.visible").type(codigo)
            cy.wait(1000)
            cy.get('[aria-label="Click to search"]').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('tbody > :nth-child(1) > .cdk-column-name').should("be.visible").click({force:true})
            cy.wait(1000)
         }

         ModificarJOrnadaLaboral(codigo, nombre){
            cy.xpath("//mat-icon[contains(text(),'edit')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('#code').should("be.visible").clear().type(codigo)
            cy.get('#name').should("be.visible").clear().type(nombre);
            cy.get('#mat-select-value-9').should("be.visible").click({force:true});
            cy.wait(1000)
            cy.get('#mat-option-12 > .mat-option-text').should("be.visible").click({force:true});
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Aceptar')]").should("be.visible").click({force:true})

         }

         EliminarJornadaLaboral(){
            cy.xpath("//mat-icon[contains(text(),'delete')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Eliminar')]").should("be.visible").click({force:true})
            cy.wait(3000)
         }
         //Fin Rornada Laboral 

         //Inicio Tipo de Rama 

         SelectOpcTipoRama(){
            cy.xpath("//a[@id='typeTreebranch']").should("be.visible").click({force:true})
            cy.wait(3000)
         }

         TipoRama(codigo, nombre, descripcion,accion){
            
            cy.get('#code').should("be.visible").clear().type(codigo)
            cy.get('#name').should("be.visible").clear().type(nombre)
            cy.get('#description').should("be.visible").clear().type(descripcion)

            if(accion == 'i'){
                cy.get('.mat-select-placeholder').should("be.visible").click({force:true})
                cy.wait(1000)
                cy.get('.mat-option-text').should("be.visible").click({force:true})
                cy.wait(1000)
            }else {
                // cy.get('#mat-select-value-17').should("be.visible").click({force:true})
                // cy.wait(1000)
                // cy.get('.mat-option-text').should("be.visible").click({force:true})
                // cy.wait(1000)
            }
            
         }        
         //Fin Tipo de Rama

         //Inicio Etiquetas de arbol
         
         SelectOpcEtiquetaArbol(){
            cy.xpath("//a[@id='treeLabels']").should("be.visible").click({force:true})
            cy.wait(3000)
         }

         EtiquetasArbol(nivelArgbol, nombre, arbolRaiz){

            if(arbolRaiz == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-tree-labels[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[1]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Byte S.A. (Raiz)')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{

            }

            cy.get("#treeLevel").clear().should("be.visible").type(nivelArgbol)
            cy.wait(1000)
            cy.get("#name").clear().should("be.visible").type(nombre)
            cy.wait(1000)
         }

         //Fin Etiquetas de arbol 

         
         //Inicio Arbol Organizacional

         SelectOpcArbolOrganizacional(){
            cy.xpath("//a[@id='organizationTree']").should("be.visible").click({force:true})
            cy.wait(1000)
         }

         ArbolOrganizacional(codigo, nombre, descripcion, responsable, padre, validoDesde, canal, nivelArbol){

            cy.get("#code").should("be.visible").clear().type(codigo)
            cy.get("#name").should("be.visible").clear().type(nombre)
            cy.get("#description").should("be.visible").clear().type(descripcion)
            cy.get("#responsible").should("be.visible").clear().type(responsable)

            if(padre == 'i'){
                cy.xpath("//mat-tab-body/div[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[7]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Agencia CONR')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{

            }

            if(validoDesde == 'i'){
                cy.xpath("//mat-tab-body/div[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[10]/mat-form-field[1]/div[1]/div[1]/div[2]/mat-datepicker-toggle[1]/button[1]/span[1]/*[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//tbody/tr[2]/td[5]/div[1]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{

            }

            cy.get("#equInHost").scrollIntoView()

            if(canal == 'i'){
                cy.xpath("//mat-tab-body/div[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[12]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Cajeros')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{

            }

            cy.get("#treeLevel").should("be.visible").clear().type(nivelArbol)

         }

         SelectVistaTabla(){
            cy.xpath("//div[contains(text(),'Vista de Tabla')]").should("be.visible").click({force:true})
            cy.wait(1000)
         }

         //Inicio subnivel Transacciones

         NavervarTransacciones(){
            cy.xpath("//mat-icon[contains(text(),'menu_open')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//li[contains(text(),'Transacciones')]").should("be.visible").click({force:true})
            cy.wait(1000)
         }

         Transacciones(transaccion, validoHasta){

            if(transaccion == 'i'){
                cy.xpath("//mat-tab-body/div[1]/div[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[1]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'ASIGNAR TOTALES DELEGACION TEMPORAL')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{
                cy.get('.mat-select-arrow-wrapper').should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'CIERRE DE JORNADA')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }
            
        

         if(validoHasta == 'i'){
            cy.xpath("//mat-tab-body/div[1]/div[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[2]/mat-form-field[1]/div[1]/div[1]/div[2]/mat-datepicker-toggle[1]/button[1]/span[1]/*[1]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//tbody/tr[2]/td[5]/div[1]").should("be.visible").click({force:true})
            cy.wait(1000)
        }else{
                // cy.xpath("").should("be.visible").click({force:true})
                // cy.wait(1000)
                // cy.xpath("").should("be.visible").click({force:true})
                // cy.wait(1000)
        }
      
     }

     BuscarTransaccion(){
        cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
        cy.wait(1000)
        cy.get('.mat-menu-content > .mat-focus-indicator').should("be.visible").click({force:true})
        cy.wait(1000)
        cy.get('#transaction').should("be.visible").select('ASIGNAR TOTALES DELEGACION TEMPORAL')
        cy.wait(1000)
        cy.xpath("//mat-icon[contains(text(),'search')]").should("be.visible").click({force:true})
        cy.wait(1000)
        cy.get('.mat-row > .cdk-column-transaction-name').should("be.visible").click({force:true})
        cy.wait(1000)
    }

         //Fin subnivel Transacciones

         //Inicio Agragar campos adicionales 

         NavergarSubnivelAgregarCamposAdidcionales(){
            cy.xpath("//li[contains(text(),'Agregar Campos Adicionales')]").should("be.visible").click({force:true})
            cy.wait(1000)
         }

         AgregarCamposAdicionales(camposHabilitadosEntidad, datoDelCampo){

            if(camposHabilitadosEntidad == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-register-entity-fields[1]/div[1]/div[1]/app-entity-fields-form[1]/div[2]/form[1]/div[1]/div[1]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Cheques del exterior')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{

            }

            cy.get('#mat-input-32').should("be.visible").clear().type(datoDelCampo)
         }

         BuscaAgregarCamposAdicionales(){
            // cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
            // cy.wait(1000)
            // cy.get('.mat-menu-content > .mat-focus-indicator').should("be.visible").click({force:true})
            // cy.wait(1000)
            // cy.get('#transaction').should("be.visible").select('ASIGNAR TOTALES DELEGACION TEMPORAL')
            // cy.wait(1000)
            // cy.xpath("//mat-icon[contains(text(),'search')]").should("be.visible").click({force:true})
            // cy.wait(1000)
            cy.get('.mat-row > .cdk-column-fieldData').should("be.visible").click({force:true})
            cy.wait(1000)
        }
         
         //Fin Agragar campos adicionales 



         //Fin Arbol Organizacional 


         //Inicio Nivel de Autorizacion 

         SelectOpcNivelAutorizacion(){
            cy.xpath("//a[@id='authLevel']").should("be.visible").click({force:true})
            cy.wait(3000)
         }

         NivelAutorizacion(arbolRaiz, nivel, nombre, desdcripcion){
            
            if(arbolRaiz == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-auth-level[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[1]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)    
                cy.xpath("//span[contains(text(),'Byte S.A. (Raiz)')]").should("be.visible").click({force:true})
            }else{

            }

            cy.get("#level_").clear().should("be.visible").type(nivel)
            cy.get("#name").clear().should("be.visible").type(nombre)
            cy.get("#description").clear().should("be.visible").type(desdcripcion)

         }


         BuscarRegristroNivelAutorizacion(nombre){
            cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-menu-content > :nth-child(3)').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('#name').should("be.visible").type(nombre)
            cy.wait(1000)
            cy.xpath("//mat-icon[contains(text(),'search')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('tbody > :nth-child(1) > .cdk-column-name').should("be.visible").click({force:true})
            cy.wait(1000)
         }
         //Fin Nivel de Autorizacion 

         //Inicio Nivel de Cajero

         SelectOpcNivelCajero(){
            cy.get('#authLevel > .mat-list-item-content').scrollIntoView()
            cy.wait(1000)
            cy.xpath("//a[@id='cashierLevel']").should("be.visible").click({force:true})
            cy.wait(3000)
         }

         NivelCajero(codigo, arbolRaiz, nombre, descripcion, nivelAutorizacion, diasCambPassword, rolKeycloak){
           
            cy.get("#code").should("be.visible").clear().type(codigo)

            if(arbolRaiz == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-cashier-level[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[2]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Byte S.A. (Raiz)')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{

            }

            cy.get("#name").should("be.visible").clear().type(nombre)
            cy.get("#description").should("be.visible").clear().type(descripcion)

            if(nivelAutorizacion == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-cashier-level[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[5]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Agencia Byte SA')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{

            }

            cy.get("#daysPasswChange").clear().should("be.visible").type(diasCambPassword)
            cy.get("#roleKeycloak").clear().should("be.visible").type(rolKeycloak)

         }

         //Fin Nivel de Cajero 

         //Inicio Tipo de Cajero 

         SelectOpcTipoCajero(){
            cy.get('#authLevel > .mat-list-item-content').scrollIntoView()
            cy.wait(1000)
            cy.xpath("//a[@id='typeCashier']").should("be.visible").click({force:true})
            cy.wait(3000)
         }

         TipoCajero(codigo, descripcion, verTotales){
            cy.get("#code").should("be.visible").clear().type(codigo)
            cy.get("#description").should("be.visible").clear().type(descripcion)

            if(verTotales == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-type-cashier[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[6]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'No aplica')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{

            }


         }

         
         //Fin Tipo de Cajero 

         //Inicio Departamento 

         SelectOpcDepartamento(){
            cy.get('#authLevel > .mat-list-item-content').scrollIntoView()
            cy.wait(1000)
            cy.xpath("//a[@id='departament']").should("be.visible").click({force:true})
            cy.wait(3000)
         }

         Departamento(codigo, nombre){
            cy.get("#code").should("be.visible").clear().type(codigo)
            cy.get("#name").should("be.visible").clear().type(nombre)
         }
         

         //Fin Departamento

         //Inicio Usuario 

         SelectOpcUsuario(){
            cy.get('#authLevel > .mat-list-item-content').scrollIntoView()
            cy.wait(1000)
            cy.xpath("//a[@id='user']").should("be.visible").click({force:true})
            cy.wait(1000)
         }

         BuscarPersonaUsuario(){

         }

         Usuario(numIdenti, usuario, pNombre, sNombre, pApellido, sApellido, pais, correo, telTrabajo,codigoEmpleado, arbolRaiz, ramaArbol, departamento, tipoCajero, jornadaLaboral, nivelCajero, puertoImpre){

            cy.xpath("//body/div[3]/div[2]/div[1]/mat-dialog-container[1]/app-person-dialog[1]/form[1]/div[1]/div[1]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Documento Personal de Identificación')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get("#idnumber").should("be.visible").clear().type(numIdenti)
            cy.xpath("//button[contains(text(),'Buscar')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('#mat-input-3').should("be.visible").clear().type(usuario)
            cy.get('#mat-input-4').should("be.visible").clear().type(pNombre)
            cy.get('#mat-input-6').should("be.visible").clear().type(sNombre)
            cy.get('#mat-input-7').should("be.visible").clear().type(pApellido)
            cy.get('#mat-input-8').should("be.visible").clear().type(sApellido)

            if(pais == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-user[1]/div[1]/app-user-form[1]/div[2]/mat-drawer-container[1]/mat-drawer-content[1]/form[1]/div[1]/div[10]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Guatemala')]").should("be.visible").click({force:true})
                cy.wait(1000)

            }else{

            }

            cy.get('#mat-input-9').should("be.visible").clear().type(correo)
            cy.get('#mat-input-10').should("be.visible").clear().type(telTrabajo)
            cy.get('#mat-input-11').should("be.visible").clear().type(codigoEmpleado)

            if(arbolRaiz == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-user[1]/div[1]/app-user-form[1]/div[2]/mat-drawer-container[1]/mat-drawer-content[1]/form[1]/div[1]/div[17]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Byte S.A. (Raiz)')]").should("be.visible").click({force:true})
                cy.wait(2000)

            }else{

            }

            if(ramaArbol == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-user[1]/div[1]/app-user-form[1]/div[2]/mat-drawer-container[1]/mat-drawer-content[1]/form[1]/div[1]/div[18]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Agencia rural')]").should("be.visible").click({force:true})
                cy.wait(2000)

            }else{

            }
            
            if(departamento == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-user[1]/div[1]/app-user-form[1]/div[2]/mat-drawer-container[1]/mat-drawer-content[1]/form[1]/div[1]/div[19]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Servicio al Cliente')]").should("be.visible").click({force:true})
                cy.wait(2000)

            }else{

            }

            if(tipoCajero == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-user[1]/div[1]/app-user-form[1]/div[2]/mat-drawer-container[1]/mat-drawer-content[1]/form[1]/div[1]/div[20]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Cajero Byte SA')]").click({force:true})
                cy.wait(2000)
            }else{

            }

            if(jornadaLaboral == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-user[1]/div[1]/app-user-form[1]/div[2]/mat-drawer-container[1]/mat-drawer-content[1]/form[1]/div[1]/div[21]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Jornada de Día')]").should("be.visible").click({force:true})
                cy.wait(2000)
            }else{

            }

            if(nivelCajero == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-user[1]/div[1]/app-user-form[1]/div[2]/mat-drawer-container[1]/mat-drawer-content[1]/form[1]/div[1]/div[22]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Jefe Agencia Byte SA')]").should("be.visible").click({force:true})
                cy.wait(2000)
            }else{

            }

            cy.get('#mat-input-13').should("be.visible").scrollIntoView()

            cy.get('#mat-input-13').should("be.visible").type(puertoImpre)
            

         }


         BuscarUsuario(nombre){
            cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
            cy.wait(2000)
            cy.get('.mat-menu-content > :nth-child(2)').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('#fullName').should("be.visible").type(nombre)
            cy.wait(1000)
            cy.xpath("//mat-icon[contains(text(),'search')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-row > .cdk-column-fullName').should("be.visible").click({force:true})
            cy.wait(1000)
        }

         //Fin Usuario 

         //Inicio Asociar un usuario a Varias ramas

         SelectOpcAsociarUsuarioVariasRamas(){
            cy.get('#authLevel > .mat-list-item-content').scrollIntoView()
            cy.wait(1000)
            cy.xpath("//a[@id='userBranches']").should("be.visible").click({force:true})
            cy.wait(1000)
         }

         AsociarUsuarioVariasAgencias(usuario, rama){

        
            if(usuario == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-user-branches[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[1]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'rrecinos')]").scrollIntoView().should("be.visible").click({force:true})
                cy.wait(3000)
            }else{
                

            }

            if(rama == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-user-branches[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[2]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Agencia central')]").scrollIntoView().should("be.visible").click({force:true})
            }
            
         }


         BuscarRegristroAsociarUsuarioARamas(){
            cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-menu-content > :nth-child(1)').click({force:true})
            cy.wait(1000)
            cy.get('.is-empty > #user').select('rrecinos')
            cy.wait(1000)
            cy.xpath("//mat-icon[contains(text(),'search')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-row > .cdk-column-user-username').should("be.visible").click({force:true})
            cy.wait(1000)
        }


         //Fin Asociar un usuario a Varias ramas

         //Inicio Productos
         SelectOpcProductos(){
            cy.get('#authLevel > .mat-list-item-content').scrollIntoView()
            cy.wait(1000)
            cy.xpath("//a[@id='products']").should("be.visible").click({force:true})
            cy.wait(1000)
         }

         Productos(codigo, nombre, descripcion, moneda, digitoVetificador, longCuenta, mascaraCuenta){

            cy.get("#code").should("be.visible").clear().type(codigo)
            cy.get("#name").should("be.visible").clear().type(nombre)
            cy.get("#description").should("be.visible").clear().type(descripcion)

            if(moneda == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-products[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[4]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Quetzal')]").should("be.visible").click({force:true})
                cy.wait(2000)

            }else{

            }

            if(digitoVetificador == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-products[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[5]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Digito verificador de NIT chan')]").should("be.visible").click({force:true})
                cy.wait(2000)
            }else{
                
            }

            cy.get("#accountLength").should("be.visible").clear().type(longCuenta)
            cy.get("#acountMask").should("be.visible").clear().type(mascaraCuenta)


         }


         BuscarRegistroProducto(codigo){
            cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-menu-content > :nth-child(3)').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('#code').should("be.visible").type(codigo)
            cy.wait(1000)
            cy.get('[aria-label="Click to search"]').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-row > .cdk-column-code').should("be.visible").click({force:true})
            cy.wait(1000)
         }


         //Fin Productos

         //Inicio Codigo de barras

         SelectOpcCodigoBarras(){
            cy.get('#authLevel > .mat-list-item-content').scrollIntoView()
            cy.wait(1000)
            cy.xpath("//a[@id='barcode']").should("be.visible").click({force:true})
            cy.wait(1000)
         }

         CodigoBarras(codigo, nombre, logitud, descripciion){
            cy.get("#code").should("be.visible").clear().type(codigo)
            cy.get("#name").should("be.visible").clear().type(nombre)
            cy.get("#barcodeLength").should("be.visible").clear().type(logitud)
            cy.get("#description").should("be.visible").clear().type(descripciion)
         }

            //Inicio subnivel detalle

            NavegarDetalle(){
                cy.xpath("//mat-icon[contains(text(),'menu_open')]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//li[contains(text(),'Detalle')]").should("be.visible").click({force:true})
                cy.wait(1000)

            }

            Detalle(correlativo, posicInicial, longitud, tipoDato, descripcion){

                cy.get("#correlative").should("be.visible").clear().type(correlativo)
                cy.get("#initialPosition").should("be.visible").clear().type(posicInicial)
                cy.get("#length").should("be.visible").clear().type(longitud)

                if(tipoDato == 'i'){

                    cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-barcode[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[4]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                    cy.wait(1000)
                    cy.xpath("//span[contains(text(),'Cuenta')]").should("be.visible").click({force:true})
                    cy.wait(1000)
                
                }else{

                }

                cy.get("#description").should("be.visible").clear().type(descripcion)


            }

            BuscarSubDetalle(correlativo){
                cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.get('.mat-menu-content > .mat-focus-indicator').should("be.visible").click({force:true})
                cy.wait(1000)
                cy.get('#correlative').should("be.visible").type(correlativo)
                cy.wait(1000)
                cy.get('[aria-label="Click to search"]').should("be.visible").click({force:true})
                cy.wait(1000)
                cy.get('.mat-row > .cdk-column-correlative').should("be.visible").click({force:true})
                cy.wait(1000)
             }
            
            //Fin subnivel detalle
         

         //Fin Codigo de barras

         //Inico Dias no habiles

         SelectOPcDiasNoHabiles(){
            cy.get('#authLevel > .mat-list-item-content').scrollIntoView()
            cy.wait(1000)
            cy.xpath("//a[@id='nonWorkingDays']").should("be.visible").click({force:true})
            cy.wait(1000)
         }

         DiasNoHabiles(nivelGeografico1, nivelGeografico2, nivelGeografico3, fechaInicio, descripcion){

            if(nivelGeografico1 == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-non-working-days[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[1]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(2000)
                cy.xpath("//span[contains(text(),'Guatemala')]").should("be.visible").click({force:true})
                cy.wait(2000)
            }else{

            }

            if(nivelGeografico2 == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-non-working-days[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[2]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(2000)
                cy.xpath("//body/div[3]/div[2]/div[1]/div[1]/div[1]/mat-option[3]/span[1]").should("be.visible").click({force:true})
                cy.wait(2000)
            }else{
                
            }

            if(nivelGeografico3 == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-non-working-days[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[3]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(2000)
                cy.xpath("//body/div[3]/div[2]/div[1]/div[1]/div[1]/mat-option[2]/span[1]").should("be.visible").click({force:true})
                cy.wait(2000)
            }else{
                
            }

            if(fechaInicio == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-non-working-days[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[4]/mat-form-field[1]/div[1]/div[1]/div[2]/mat-datepicker-toggle[1]/button[1]/span[1]/*[1]").should("be.visible").click({force:true})
                cy.wait(2000)
                cy.xpath("//div[contains(text(),'15')]").should("be.visible").click({force:true})
                cy.wait(2000)
            }else{
                
            }

            cy.get("#description").should("be.visible").clear().type(descripcion)

         }

         BuscarRegristroDiasNoHablies(){
            cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-menu-content > .mat-focus-indicator').click({force:true})
            cy.wait(1000)
            cy.get('.is-empty > #geographicLevel1').select('Guatemala')
            cy.wait(1000)
            cy.xpath("//mat-icon[contains(text(),'search')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-row > .cdk-column-geographicLevel1-name').should("be.visible").click({force:true})
            cy.wait(1000)
        }
         //Fin Dias no habiles

         //Inicio Banco

         SelectOpcBanco(){
            cy.get('#authLevel > .mat-list-item-content').scrollIntoView()
            cy.wait(1000)
            cy.xpath("//a[@id='bank']").should("be.visible").click({force:true})
            cy.wait(1000)
         }

         Banco(codigo, nombre){

            cy.get("#code").should("be.visible").clear().type(codigo)
            cy.get("#name").should("be.visible").clear().type(nombre)

         }


         //Fin Banco

         //Inicio de Bovedas

         SelectOpcBoveda(){
            cy.get('#authLevel > .mat-list-item-content').scrollIntoView()
            cy.wait(1000)
            cy.xpath("//a[@id='vaultSpec']").should("be.visible").click({force:true})
            cy.wait(1000)
         }

         Boveda(nombre, descripcion, arbolRaiz, ramaArbol, jornada, usuario){
            cy.get("#name").should("be.visible").clear().type(nombre)
            cy.get("#description").should("be.visible").clear().type(descripcion)

            if(arbolRaiz == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-vaultspec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[3]/mat-form-field[1]/div[1]/div[1]/div[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Byte S.A. (Raiz)')]").should("be.visible").click({force:true})
                cy.wait(1500)
            }else{

            }

            if(ramaArbol == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-vaultspec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[4]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Agencia rural')]").should("be.visible").click({force:true})
                cy.wait(1500)
            }else{
                
            }

            if(jornada == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-vaultspec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[6]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Jornada Única')]").should("be.visible").click({force:true})
                cy.wait(1500)
            }else{
                
            }

            if(usuario == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-vaultspec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[7]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'avelasquez')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{
                
            }

         }

         //Fin de Bovedas

        //Inicio de tabla 
        SelectOpcTabla(){
            cy.get('#authLevel > .mat-list-item-content').scrollIntoView()
            cy.wait(1000)
            cy.xpath("//a[@id='table']").should("be.visible").click({force:true})
            cy.wait(1000)
         }

         Tabla(codigo, nombre, tipo){
            cy.get("#code").should("be.visible").clear().type(codigo)
            cy.get("#name").should("be.visible").clear().type(nombre)

            if(tipo == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-table[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[3]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Numérico')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{

            }

         }

         //Inicio Detalle 

         NavegarDetalleSubTabla(){
            cy.xpath("//mat-icon[contains(text(),'menu_open')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//li[contains(text(),'Detalle')]").should("be.visible").click({force:true})
         }

         DetallTabla(valAlfanumerico, valNumerico){
            cy.get("#alphanumericValue").should("be.visible").clear().type(valAlfanumerico)
            cy.get("#numericalValue").should("be.visible").clear().type(valNumerico)
         }

         BuscarRegristroDetalle(){
            cy.get('.mat-row > .cdk-column-table-name').should("be.visible").click({force:true})
            cy.wait(1000)
        }

         //Fin Detalle 
        
        //Fin de tabla 

        //Inicio Tipo de Cliente 


        SelectOpcTipoCliente(){
            cy.get('#table > .mat-list-item-content').scrollIntoView()
            cy.wait(1000)
            cy.xpath("//a[@id='customerType']").should("be.visible").click({force:true})
            cy.wait(1000)
         }

         TipoCliente(codigo, nombre, descripcion){
            cy.get("#code").should("be.visible").clear().type(codigo)
            cy.get("#name").should("be.visible").clear().type(nombre)
            cy.get("#description").should("be.visible").clear().type(descripcion)
         }

        //Fin Tipo de Cliente

        //Inicio Campos de transaccion
        
        SelectOpcCamposTransaccion(){
            cy.get('#table > .mat-list-item-content').scrollIntoView()
            cy.wait(1000)
            cy.xpath("//a[@id='characteristicSpec']").should("be.visible").click({force:true})
            cy.wait(1000)
         }

        //  CamposTransaccion(codigo, nombre, etiqueta, descripcion, tipo, longMinima, longMaxima, longEnvio, digitoVetificador, mascara, rangoValores, limiteInferior, limiteSuperior, llenadoAutomatico, etiquetaJson, valorDefecto, rutina, impleListaVista){

        //     cy.get("#code").should("be.visible").clear().type(codigo)
        //     cy.get("#name").should("be.visible").clear().type(nombre)
        //     cy.get("#label").should("be.visible").clear().type(etiqueta)
        //     cy.get("#description").should("be.visible").clear().type(descripcion)

        //     if(tipo == 'i'){
        //         cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-characteristicspec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[6]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
        //         cy.wait(1000)
        //         cy.xpath("//span[contains(text(),'Alfanumérico')]").should("be.visible").click({force:true})

        //     }else{

        //     }

        //     cy.get("#minLength").should("be.visible").clear().type(longMinima)
        //     cy.get("#maxLength").should("be.visible").clear().type(longMaxima)
        //     cy.get("#lengthSend").should("be.visible").clear().type(longEnvio)

        //     if(digitoVetificador == 'i'){
        //         cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-characteristicspec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[10]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
        //         cy.wait(1000)
        //         cy.xpath("//span[contains(text(),'Digito verificador de NIT chan')]").should("be.visible").click({force:true})
        //     }else{

        //     }

        //     cy.get("#regularExpression").should("be.visible").clear().type(mascara)

        //     if(rangoValores == 'i'){
        //         cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-characteristicspec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[15]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
        //         cy.wait(1000)
        //         cy.xpath("//span[contains(text(),'Sí')]").should("be.visible").click({force:true})

        //     }else{

        //     }

        //     cy.get("#minRange").should("be.visible").clear().type(limiteInferior)
        //     cy.get("#maxRange").should("be.visible").clear().type(limiteSuperior)

        //     if(llenadoAutomatico == 'i'){
        //         cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-characteristicspec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[18]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
        //         cy.wait(1000)
        //         cy.xpath("//body/div[3]/div[2]/div[1]/div[1]/div[1]/mat-option[1]/span[1]").should("be.visible").click({force:true})

        //     }else{

        //     }

        //     cy.get("#separatorChar").should("be.visible").clear().type(etiquetaJson)
        //     cy.get("#defaultValueChar").should("be.visible").clear().type(valorDefecto)

        //     if(rutina == 'i'){
        //         cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-characteristicspec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[24]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
        //         cy.wait(1000)
        //         cy.xpath("//span[contains(text(),'Cambiar Responsable de Boveda')]").should("be.visible").click({force:true})

        //     }else{

        //     }

        //     cy.get("#beanListview").should("be.visible").clear().type(impleListaVista)



        //  }

        CamposTransaccion(codigo, nombre, etiqueta, descripcion, tipo, longMaxima,validoDesde ){

            cy.get("#code").should("be.visible").clear().type(codigo)
            cy.get("#name").should("be.visible").clear().type(nombre)
            cy.get("#label").should("be.visible").clear().type(etiqueta)
            cy.get("#description").should("be.visible").clear().type(descripcion)

            if(tipo == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-characteristicspec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[6]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Alfanumérico')]").should("be.visible").click({force:true})

            }else{

            }

            cy.get("#maxLength").should("be.visible").clear().type(longMaxima)
            cy.get("#maxRange").should("be.visible").scrollIntoView()

            if(validoDesde == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-characteristicspec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[29]/mat-form-field[1]/div[1]/div[1]/div[2]/mat-datepicker-toggle[1]/button[1]/span[1]/*[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//tbody/tr[2]/td[5]/div[1]").should("be.visible").click({force:true})

            }else{

            }

           

        }
        
        //Fin Campos de transaccion

        //Inicico Valores de caracateristicas
        
        NavegarValoresCaracteristicas(){
            cy.xpath("//mat-icon[contains(text(),'menu_open')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//li[contains(text(),'Valores de Característica')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }

        ValoresCaracteristicas(valor, descriptor, descriptor2, descriptor3, descriptor4){
            cy.get("#value").should("be.visible").clear().type(valor)
            cy.get("#descriptor").should("be.visible").clear().type(descriptor)
            cy.get("#descriptor2").should("be.visible").clear().type(descriptor2)
            cy.get("#descriptor3").should("be.visible").clear().type(descriptor2)
            cy.get("#descriptor4").should("be.visible").clear().type(descriptor4)
        }

        BuscarValorCaracteristica(valor){
            cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-menu-content > :nth-child(1)').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('#value').should("be.visible").type(valor)
            cy.wait(1000)
            cy.get('[aria-label="Click to search"]').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-row > .cdk-column-value').should("be.visible").click({force:true})
            cy.wait(1000)
         }

        //Fin Valores de caracateristicas


        // Inicio Máximo por Tipo de Transacción y Nivel Cajero

        NavegarMaximoTipoTransacNivelCajero(){
            cy.xpath("//li[contains(text(),'Máximo por Tipo de Transacción y Nivel Cajero')]").should("be.visible").click({force:true})
        }

        MaximoTipoTransaccionNivelCajero(arbolRaiz, tipoTransaccion, nivelCajero, montoMaximo, montoGloval){

            if(arbolRaiz == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-characteristicspec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[1]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Byte S.A. (Raiz)')]").should("be.visible").click({force:true})
                cy.wait(1500)
            }else{

            }

            if(tipoTransaccion == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-characteristicspec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[2]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'RECIBIDO')]").should("be.visible").click({force:true})
                cy.wait(1500)
            }else{
                
            }

            if(nivelCajero == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-characteristicspec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[3]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Sub Jefe agencia Byte SA')]").should("be.visible").click({force:true})
                cy.wait(1500)
            }else{
                
            }

            cy.get("#amountMax").should("be.visible").clear().type(montoMaximo)

            if(montoGloval == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-characteristicspec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[5]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'No')]").should("be.visible").click({force:true})
                cy.wait(1500)
            }else{
                
            }

        }

        BuscarMaximoTipoTransaccionNivelCajero(arbolRaiz){
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

        

        //Fin Máximo por Tipo de Transacción y Nivel Cajero

        //Incio Subnivel Máximo por Tipo de Transacción y Tipo de Rama 

        NavegarMaximoipoTransacciónTipoRama(){
            cy.xpath("//li[contains(text(),'Máximo por Tipo de Transacción y Tipo de Rama')]").should("be.visible").click({force:true})
            cy.wait(1000)
        } 

        MaximoipoTransacciónTipoRama(tipoTransaccion, tipoRama, montoMaximo, montoGloval){

            if(tipoTransaccion == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-characteristicspec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[1]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'PAGADO')]").should("be.visible").click({force:true})
                cy.wait(1500)
            }else{

            }


            if(tipoRama == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-characteristicspec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[2]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Agencia')]").should("be.visible").click({force:true})
                cy.wait(1500)
            }else{
                
            }

            cy.get("#amountMax").should("be.visible").clear().type(montoMaximo)


            if(montoGloval == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-characteristicspec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[4]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'No')]").should("be.visible").click({force:true})
                cy.wait(1500)
            }else{
                
            }
            
        }

        BuscarMaximoTipoTransacciónTipoRama(){
            cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-menu-content > :nth-child(1)').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('#typeTransaction').should("be.visible").select("PAGADO")
            cy.wait(1000)
            cy.get('[aria-label="Click to search"]').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-row > .cdk-column-typeTransaction-name').should("be.visible").click({force:true})
            cy.wait(1000)
         }

        //Fin  Subnivel Máximo por Tipo de Transacción y Tipo de Rama 

        //Inicio Sub Características

        NavegarSubCaracteristicas(){
            cy.xpath("//li[contains(text(),'Sub Características')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }

        SubCaracteristicas(correlativo, SubCaracteristica){

            cy.get("#correSubcharspec").should("be.visible").clear().type(correlativo)

            if(SubCaracteristica == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-characteristicspec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[2]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Referencia No')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{



            }
            
        }

        BuscarSubCaracteristicas(correlativo){
            cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-menu-content > :nth-child(1)').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('#correSubcharspec').should("be.visible").type(correlativo)
            cy.wait(1000)
            cy.get('[aria-label="Click to search"]').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-row > .cdk-column-correSubcharspec').should("be.visible").click({force:true})
            cy.wait(1000)
         }
        

        //Fin Sub Características
        

        //Inicio Total de cajero 

        SelectOpcionTotalCajero(){
            cy.get('#table > .mat-list-item-content').scrollIntoView()
            cy.wait(1000)
            cy.xpath("//a[@id='totalCashier']").should("be.visible").click({force:true})
            cy.wait(1000)
        }

        TotalCajero(codigo, arbolRaiz, nombre, nombreCorto, correlativoImpreso, validoDesde){
            cy.get("#code").should("be.visible").clear().type(codigo)

            if(arbolRaiz == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-total-cashier[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[2]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Byte S.A. (Raiz)')]").should("be.visible").click({force:true})
            }else{

            }

            cy.get("#name").should("be.visible").clear().type(nombre)
            cy.get("#shortName").should("be.visible").clear().type(nombreCorto)
            cy.get("#correlativePrint").should("be.visible").clear().type(correlativoImpreso)

            if(validoDesde == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-total-cashier[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[15]/mat-form-field[1]/div[1]/div[1]/div[2]/mat-datepicker-toggle[1]/button[1]/span[1]/*[1]").should("be.visible").click({force:true}) 
                cy.wait(1000)
                cy.xpath("//tbody/tr[2]/td[2]/div[1]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{

            }
            
        }
        //Fin Total de cajero 

        //Inicio totales a cuadrar

        navegarSubTotalesCuadrar(){
            cy.xpath("//mat-icon[contains(text(),'menu_open')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//li[contains(text(),'Totales a Cuadrar')]").should("be.visible").click({force:true})
        }

        TotalesCuadrar(tipoCajero){

            if(tipoCajero == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-total-cashier[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[1]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Cajero Byte SA')]").should("be.visible").click({force:true})

            }else{
                cy.get('.mat-select-arrow-wrapper').should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Jefe de Agencia Byte SA')]").should("be.visible").click({force:true})

            }

        }

        //Inicio totales a cuadrar

        //Inicio de Validaciones al Cierre del Día

        NavegarValidacionCierreDia(){
            cy.xpath("//li[contains(text(),'Validaciones al Cierre del Día')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }

        ValidacionesCierreDelDía(codigo, nivelCajero, tolerancia, valorCerrar, valorConstante, moneda){

            cy.get("#code").should("be.visible").clear().type(codigo)

            if(nivelCajero == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-total-cashier[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[2]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Cajero Byte SA')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{
                cy.get('#cashierLevel > .mat-select-trigger > .mat-select-arrow-wrapper').should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Administrador Byte S.A')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }

            cy.get("#tolerance").should("be.visible").clear().type(tolerancia)
            cy.get("#constant").should("be.visible").clear().type(valorCerrar)

            if(valorConstante == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-total-cashier[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[5]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'7000')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{
                cy.get('#globalValuesConst > .mat-select-trigger > .mat-select-arrow-wrapper').should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'7001')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }

            if(moneda == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-total-cashier[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[6]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Quetzal')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{
                cy.get('#money > .mat-select-trigger > .mat-select-arrow-wrapper').should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Dólares')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }

        }
        
        //Fin de Validaciones al Cierre del Día

        //Inicio Total por Formula

        NavegarSubTotalFormula(){
            cy.xpath("//mat-icon[contains(text(),'menu_open')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//li[contains(text(),'Total por Formula')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }

        TotalFormula(operacionTotal, operador){

            if(operacionTotal == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-total-cashier[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[1]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Efectivo Acumulado del Dia')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{
                cy.get('#totalOperate > .mat-select-trigger > .mat-select-arrow-wrapper').should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Total demo interno 3')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }

            if(operador == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-total-cashier[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[2]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'+')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{
                cy.get('#operator > .mat-select-trigger > .mat-select-arrow-wrapper').should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'-')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }


        }

        BuscarTotalFormula(){
            cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-menu-content > .mat-focus-indicator').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('#operator').should("be.visible").select('+')
            cy.wait(1000)
            cy.xpath("//mat-icon[contains(text(),'search')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-row > .cdk-column-operator').should("be.visible").click({force:true})
            cy.wait(1000)
        }
        //Fin Total por Formula

        //Inicio Minimo Maximo

        NavegarSubnivelMinimoMaximo(){
            cy.xpath("//mat-icon[contains(text(),'menu_open')]").should("be.visible").click()
            cy.wait(1000)
            cy.xpath("//li[contains(text(),'Mínimos y Máximos')]").should("be.visible").click({force:true})
        }

        MinimosMaximos(tipoRama, tipoCajero, moneda, minimoCajero, maximoCajero, minimoTipoRama, maximoTipoRama){
            
            if(tipoRama == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-total-cashier[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[1]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Agencia')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{
                cy.get('#typeTreebranch > .mat-select-trigger > .mat-select-arrow-wrapper').should("be.visible").click({force:true})
                cy.wait(1000)
                cy.get('.mat-option-text').should("be.visible").click({force:true})
                cy.wait(1000)
            }

            if(tipoCajero == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-total-cashier[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[2]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Cajero Byte SA')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{
                cy.get('#typeCashier > .mat-select-trigger > .mat-select-arrow-wrapper').should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Jefe de Agencia Byte SA')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }

            if(moneda == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-total-cashier[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[3]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Quetzal')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{
                cy.get('#money > .mat-select-trigger > .mat-select-arrow-wrapper').should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Dólares')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }

            cy.get("#minPerCashier").should("be.visible").clear().type(minimoCajero)
            cy.get("#maxPerCashier").should("be.visible").clear().type(maximoCajero)
            cy.get("#minPerTypeTreebranch").should("be.visible").clear().type(minimoTipoRama)
            cy.get("#maxPerTypeTreebranch").should("be.visible").clear().type(maximoTipoRama)

        }


        BuscarRegristroMinimoMaximo(){
            cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-menu-content > :nth-child(3)').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.is-empty > #typeCashier').should("be.visible").select('Cajero Byte SA')
            cy.wait(1000)
            cy.xpath("//mat-icon[contains(text(),'search')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-row > .cdk-column-typeCashier-description').should("be.visible").click({force:true})
            cy.wait(1000)
        }
        
        //Fin Minimo Maximo

        //Inicio Categoria de servivio

        
        SelectOpcionCategoriaServicio(){
            cy.get('#table > .mat-list-item-content').scrollIntoView()
            cy.wait(1000)
            cy.xpath("//a[@id='groupService']").should("be.visible").click({force:true})
            cy.wait(1000)
        }

        CategoriaServicio(codigo, nombre, descripcion, secuencia){
            cy.get("#code").should("be.visible").clear().type(codigo)
            cy.get("#name").should("be.visible").clear().type(nombre)
            cy.get("#description").should("be.visible").clear().type(descripcion)
            cy.get("#sequence").should("be.visible").clear().type(secuencia)
        }
        //Fin Categoria de servivio


        //Inicio subnivel Colectores

        NavegarColectores(){
            cy.xpath("//mat-icon[contains(text(),'menu_open')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//li[contains(text(),'Colectores')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }

        Colectores(codigo, nombre, descripcion, secuencia){
            cy.get("#code").should("be.visible").clear().type(codigo)
            cy.get("#name").should("be.visible").clear().type(nombre)
            cy.get("#description").should("be.visible").clear().type(descripcion)
            cy.get("#sequence").should("be.visible").clear().type(secuencia)

        }
        
        //Final subnivel Colectores
        
        //Inicio Categoria de servicios

        SelectOpcPagoServicios(){
            cy.get('#table > .mat-list-item-content').scrollIntoView()
            cy.wait(1000)
            cy.xpath("//a[@id='servicePay']").should("be.visible").click({force:true})
            cy.wait(3000)
        }

        PagoServicios(codigo, nombre, descripcion, cateServicio, moneda, colectorServio, tipoFlujo, secuencia, codgioAlterno){

            cy.get("#code").should("be.visible").clear().type(codigo)
            cy.get("#name").should("be.visible").clear().type(nombre)
            cy.get("#description").should("be.visible").clear().type(descripcion)

            if(cateServicio == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-service-pay[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[4]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'ENERGIA ELECTRICA')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{
                // cy.xpath("").should("be.visible").click({force:true})
                // cy.wait(1000)
                // cy.xpath("").should("be.visible").click({force:true})
                // cy.wait(1000)
            }

            if(moneda == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-service-pay[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[5]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Quetzal')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{
                // cy.xpath("").should("be.visible").click({force:true})
                // cy.wait(1000)
                // cy.xpath("").should("be.visible").click({force:true})
                // cy.wait(1000)
            }

            if(colectorServio == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-service-pay[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[6]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1] ").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'EEGSA')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{
                // cy.xpath("").should("be.visible").click({force:true})
                // cy.wait(1000)
                // cy.xpath("").should("be.visible").click({force:true})
                // cy.wait(1000)
            }

            if(tipoFlujo == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-service-pay[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[7]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Con Consulta')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{
                //cy.xpath("").should("be.visible").click({force:true})
                // cy.wait(1000)
                // cy.xpath("").should("be.visible").click({force:true})
                // cy.wait(1000)
            }

            cy.get("#sequence").should("be.visible").clear().type(secuencia)
            cy.get("#codeAlternate").should("be.visible").clear().type(codgioAlterno)

        }

        BuscarRegristroPagoServicio(nombre){
            cy.wait(5000)
            cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-menu-content > :nth-child(1)').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('#name').should("be.visible").type(nombre)
            cy.wait(1000)
            cy.xpath("//mat-icon[contains(text(),'search')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('tbody > :nth-child(1) > .cdk-column-name').should("be.visible").click({force:true})
            cy.wait(1000)
        }
        //Inicio Categoria de servicios

        //Inicio subnivel atributos 

        NavegarAtributos(){
            cy.xpath("//mat-icon[contains(text(),'menu_open')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//li[contains(text(),'Atributos')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }

        Atributos(codigo, nombre, etiqueta, tipo, tamanioMinimo, tamanioMaximo, tamanioEnvio, secuencia, mascara, ejemplo, moneda){
            
            cy.get("#code").should("be.visible").clear().type(codigo)
            cy.get("#name").should("be.visible").clear().type(nombre)
            cy.get("#label").should("be.visible").clear().type(etiqueta)

            if(tipo == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-service-pay[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[4]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Alfanumérico')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{
                
            }

            cy.get("#minLength").should("be.visible").clear().type(tamanioMinimo)
            cy.get("#maxLength").should("be.visible").clear().type(tamanioMaximo)
            cy.get("#lengthSend").should("be.visible").clear().type(tamanioEnvio)
            cy.get("#sequence").should("be.visible").clear().type(secuencia)
            cy.get("#mask").should("be.visible").clear().type(mascara)
            cy.get("#example").should("be.visible").clear().type(ejemplo)

            if(moneda == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-service-pay[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[18]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Quetzal')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{
                
            }

        }

        //Fin subnivel atributos 

        //Inicio Espesificacion de transaccion

        SelectOpcEspesificacionTransaccion(){
            cy.get('#table > .mat-list-item-content').scrollIntoView()
            cy.wait(1000)
            cy.xpath("//a[@id='transactionSpec']").should("be.visible").click({force:true})
            cy.wait(3000)
        }

        EspesificacionTransaccion(tipo, codigo, nombre, descripcion, etiqueta, validoDesde,  metodoAsigMoneda,  formaAfectaTotales, tipoMoviBoveda){

            if(tipo == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-transaction-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[1]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'PAGADO')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{

            } 

            cy.get("#codeOfTheTransaction").should("be.visible").clear().type(codigo)
            cy.get("#name").should("be.visible").clear().type(nombre)
            cy.get("#label").should("be.visible").clear().type(etiqueta)
            cy.get("#description").should("be.visible").clear().type(descripcion).scrollIntoView()

            // if(codigoBarra == 'i'){
            //     cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-transaction-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[7]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            //     cy.wait(1000)
            //     cy.xpath("//span[contains(text(),'Cuenta Monetaria')]").should("be.visible").click({force:true})
            //     cy.wait(1000)
            // }else{

            // }
            

            if(validoDesde == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-transaction-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[15]/mat-form-field[1]/div[1]/div[1]/div[2]/mat-datepicker-toggle[1]/button[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//tbody/tr[3]/td[2]/div[1]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{

            }

            cy.get('#trxHelp').should("be.visible").clear().type(descripcion).scrollIntoView()

            if(metodoAsigMoneda == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-transaction-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[19]/mat-form-field[1]/div[1]/div[1]/div[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'No Aplica')]").should("be.visible").click({multiple:true})
                cy.wait(1000)
            }else{

            }

            if(formaAfectaTotales == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-transaction-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[22]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Moneda de Transacción')]").should("be.visible").click({multiple:true})
                cy.wait(1000)
            }else{

            }
            
            if(tipoMoviBoveda == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-transaction-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[23]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Traslado de saldo')]").should("be.visible").click({multiple:true})
                cy.wait(1000)
            }else{

            }        


        }

        //Fin Espesificacion de transaccion


        //Inicio subnivel caracteristica

        NavergarSubnivelCaracteristicas(){

            cy.xpath("//mat-icon[contains(text(),'menu_open')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-transaction-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[2]/mat-drawer-container[1]/mat-drawer[1]/div[1]/div[1]/div[1]/ul[1]/li[1]").should("be.visible").click({force:true})
            cy.wait(1000)

        }

        Caracteristicas(caracteristicas, montoMaximo, tipoMovInventarioEfectivo, validoDesde){

            if(caracteristicas == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-transaction-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[1]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Año de Nacimiento')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{

            }

            cy.get("#maxAmount").should("be.visible").clear().type(montoMaximo)


            if(tipoMovInventarioEfectivo == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-transaction-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[4]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'No Aplica')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{
                
            }

            if(validoDesde == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-transaction-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[6]/mat-form-field[1]/div[1]/div[1]/div[2]/mat-datepicker-toggle[1]/button[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//tbody/tr[3]/td[2]/div[1]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{
                
            }

        }

        BuscarRegristroCaracteristica(){
            cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-menu-content > :nth-child(1)').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.is-empty > #characteristicSpec').should("be.visible").select('Año de Nacimiento')
            cy.wait(1000)
            cy.xpath("//mat-icon[contains(text(),'search')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-row > .cdk-column-characteristicSpec-name').should("be.visible").click({force:true})
            cy.wait(1000)
        }

        //Fin subnivel caracteristica

        //Inicio Subnivel Totales a Afectar


        NavergarSubnivelTotalesAfectar(){
            cy.xpath("//mat-icon[contains(text(),'menu_open')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//li[contains(text(),'Totales a afectar')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }

        TotalesAfectar(arbolRaiz, afectar, operacion){

            if(arbolRaiz == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-transaction-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[1]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Byte S.A. (Raiz)')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{

            }

            if(afectar == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-transaction-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[2]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Pago de Servicio')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{

            }

            if(operacion == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-transaction-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[4]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'+')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{

            }

        }

        
        
        //Fin Subnivel Totales a Afectar

        //Inicio subnivel Característica del resultado

        NavergarSubnivelCatacteristicasResultado(){
            cy.xpath("//mat-icon[contains(text(),'menu_open')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//li[contains(text(),'Característica de resultado')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }

        //Fin subnivel Característica del resultado


        //Inicio Razones de bloqueo de usuarios

        SelectOpcRazonesBloqueoUsuarios(){
            cy.get('#table > .mat-list-item-content').scrollIntoView()
            cy.wait(1000)
            cy.xpath("//a[@id='reasonsUserBlock']").should("be.visible").click({force:true})
            cy.wait(3000)
        }

        RazonesBloqueoUsuarios(codigo, razon, mensaje){

            cy.get("#code").should("be.visible").clear().type(codigo)
            cy.get("#reason").should("be.visible").clear().type(razon)
            cy.get("#message").should("be.visible").clear().type(mensaje)

        }
        
        //Fin Razones de bloqueo de usuarios

        //Inicio de permisos

        SelectOpcPermisos(){
            cy.get('#table > .mat-list-item-content').scrollIntoView()
            cy.wait(1000)
            cy.xpath("//a[@id='permits']").should("be.visible").click({force:true})
            cy.wait(3000)
        }

        Permisos(codigo, nombre, descripcion){
            cy.get("#code").should("be.visible").clear().type(codigo)
            cy.get("#name").should("be.visible").clear().type(nombre)
            cy.get("#description").should("be.visible").clear().type(descripcion)
        }

        //Fin de permisos

        //Inicio permisos de autorizacion

        NavergarPermisosAutorizacion(){
            cy.xpath("//mat-icon[contains(text(),'menu_open')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//li[contains(text(),'Permisos de Autorización')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }

        PermisosAutorizacion(arbolRaiz, nivelAutorizacion){

            if(arbolRaiz == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-permits[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[1]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Byte S.A. (Raiz)')]").should("be.visible").click({force:true})
                cy.wait(2000)
            }else{
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-permits[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[2]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[1]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[2]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'BANCATLAN')]").should("be.visible").click({force:true})
            }

            if(nivelAutorizacion == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-permits[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[2]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Agencia Byte SA')]").should("be.visible").click({force:true})
            }else{
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-permits[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[2]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Cajero Bancatlan')]").should("be.visible").click({force:true})
            }
        }

        BuscarPermisosAutorizacion(){
            cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-menu-content > :nth-child(1)').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.is-empty > #authLevel').should("be.visible").select('Agencia Byte SA')
            cy.wait(1000)
            cy.xpath("//mat-icon[contains(text(),'search')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-row > .cdk-column-authLevel-name').should("be.visible").click({force:true})
            cy.wait(1000)
        }

        //Fin permisos de automatizacion

        

        //Inicio Razon de reverso 

        SelectOpcRazonReversion(){
            cy.get('#table > .mat-list-item-content').scrollIntoView()
            cy.wait(1000)
            cy.xpath("//a[@id='reasonsReverse']").should("be.visible").click({force:true})
            cy.wait(3000)
        }

        RazonReversion(codigo, nombre, descripcion){

            cy.get("#code").should("be.visible").clear().type(codigo)
            cy.get("#name").should("be.visible").clear().type(nombre)
            cy.get("#description").should("be.visible").clear().type(descripcion)

        }

        //Fin Razon de reverso 

        //Inicio Control de requerimiento

        SelectOpcControlRequerimiento(){
            cy.get('#characteristicSpec > .mat-list-item-content').should("be.visible").scrollIntoView()
            cy.wait(1000)
            cy.xpath("//a[@id='controlRequirement']").should("be.visible").click({force:true})
            cy.wait(3000)
        }

        ControlRequerimiento(nombre, tipo){

            cy.get("#entityName").should("be.visible").clear().type(nombre)

            if(tipo == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-control-requirement[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[2]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Excluir')]").should("be.visible").click({force:true})
            }

        }

        BuscarControlRequerimiento(nombre){
            cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-menu-content > :nth-child(1)').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('#entityName').should("be.visible").type(nombre)
            cy.wait(1000)
            cy.xpath("//mat-icon[contains(text(),'search')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('tbody > :nth-child(1) > .cdk-column-entityName').should("be.visible").click({force:true})
            cy.wait(1000)
        }

        //Fin Control de requerimiento

        
        //Inico Seleccionar menú Entidades de tecnología

        SelectOpcControlRequerimiento(){
            cy.xpath("//a[@id='controlRequirement']").scrollIntoView()
            cy.wait(1000)
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav[1]/div[1]/div[1]/span[2]/mat-nav-list[1]/a[1]").should("be.visible").click({force:true})
            cy.wait(3000)
        }

        //Fin Seleccionar menú Entidades de tecnología




}

export default VisitaSpectsView;