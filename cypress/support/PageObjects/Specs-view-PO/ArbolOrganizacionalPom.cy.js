import metodosGeneralesPomCy from "./MetodosGeneralesPom.cy.js";
import 'cypress-xpath';
class ArbolOrganizacionalPom{

    constructor() {
        this.Generales = new metodosGeneralesPomCy();
    }

    ArbolOrganizacional(data){
        this.Generales.llenarCampoIframe(data.codigo, "Código", { timeout: 10000, skipContext: true })
        this.Generales.llenarCampoIframe(data.nombre, "Nombre", { timeout: 10000, skipContext: true })
        this.Generales.llenarCampoIframe(data.descripcion, "Descripción", { timeout: 10000, skipContext: true })
        this.Generales.llenarCampoIframe(data.responsable, "Responsable", { timeout: 10000, skipContext: true })
        this.Generales.seleccionarComboIframe(data.cicloVida, "Ciclo de vida", { timeout: 10000, force: true, skipContext: true })
        this.Generales.seleccionarComboIframe(data.canal, "Canal", { timeout: 10000, skipContext: true })
        this.Generales.IngresarFechaIframe(data.validoDesde, "Válido Desde", { timeout: 10000, skipContext: true })
        this.Generales.IngresarFechaIframe(data.validoHasta, "Válido Hasta", { timeout: 10000, skipContext: true })
        this.Generales.slideToggleIframe(data.tieneUsuariosFinales, "Tiene usuarios finales", { timeout: 10000, skipContext: true })
        if(data.esRaiz){
        this.Generales.slideToggleIframe(data.esRaiz, "Es Raíz", { timeout: 10000, skipContext: true })
        this.Generales.llenarCampoIframe(data.tiempoLimite, "Tiempo Límite", { timeout: 10000, skipContext: true, force: true })
        this.Generales.seleccionarComboIframe(data.tipoRama, "Tipo de Rama", { timeout: 10000, skipContext: true, force: true })
        this.Generales.llenarCampoIframe(data.Puesto, "Puesto", { timeout: 10000, skipContext: true })
        this.Generales.llenarCampoIframe(data.codigoEquivalente, "Código Equivalente", { timeout: 10000, skipContext: true, force: true})
        this.Generales.llenarCampoIframe(data.nivelEnArbol, "Nivel en árbol [0,1,2,..]", { timeout: 10000, force: true, skipContext: true })//validar si jala con ese texto
        this.Generales.llenarCampoIframe(data.nombreUsuario, "Nombre de usuario", { timeout: 10000, skipContext: true, force: true })
        this.Generales.llenarCampoIframe(data.complementoDireccion, "Complemento de Dirección", { timeout: 10000, skipContext: true })
        this.Generales.seleccionarComboIframe(data.nivelGeografico1, "Nivel Geográfico 1", { timeout: 10000, skipContext: true, force: true })
        this.Generales.seleccionarComboIframe(data.nivelGeografico2, "Nivel Geográfico 2", { timeout: 10000, skipContext: true, force: true })
        this.Generales.seleccionarComboIframe(data.nivelGeografico3, "Nivel Geográfico 3", { timeout: 10000, skipContext: true, force: true })
        this.Generales.seleccionarComboIframe(data.region, "Región", { timeout: 10000, skipContext: true })
        this.Generales.llenarCampoIframe(data.latitud, "Latitud", { timeout: 10000, skipContext: true })
        this.Generales.llenarCampoIframe(data.longitud, "Longitud", { timeout: 10000, skipContext: true })
        this.Generales.cargarImagen(data.logo, "Logo", { timeout: 10000, skipContext: true, force: true }) //metodo para subir logo pendiente aqui y en gestor
        cy.wait(500)
        }else{
        cy.log("No es raiz")
        this.Generales.seleccionarComboIframe(data.padre, "Padre", { timeout: 10000, skipContext: true, force: true })
        this.Generales.seleccionarComboIframe(data.tipoRama, "Tipo de Rama", { timeout: 10000, skipContext: true, force: true })
        this.Generales.llenarCampoIframe(data.Puesto, "Puesto", { timeout: 10000, skipContext: true })
        this.Generales.llenarCampoIframe(data.codigoEquivalente, "Código Equivalente", { timeout: 10000, skipContext: true, force: true})
        this.Generales.llenarCampoIframe(data.nivelEnArbol, "Nivel en árbol [0,1,2,..]", { timeout: 10000, force: true, skipContext: true })//validar si jala con ese texto
        this.Generales.llenarCampoIframe(data.nombreUsuario, "Nombre de usuario", { timeout: 10000, skipContext: true, force: true })
        this.Generales.llenarCampoIframe(data.complementoDireccion, "Complemento de Dirección", { timeout: 10000, skipContext: true })
        this.Generales.llenarCampoIframe(data.tiempoLimite, "Tiempo Límite", { timeout: 10000, skipContext: true, force: true })
        this.Generales.seleccionarComboIframe(data.nivelGeografico1, "Nivel Geográfico 1", { timeout: 10000, skipContext: true, force: true })
        this.Generales.seleccionarComboIframe(data.nivelGeografico2, "Nivel Geográfico 2", { timeout: 10000, skipContext: true, force: true })
        this.Generales.seleccionarComboIframe(data.nivelGeografico3, "Nivel Geográfico 3", { timeout: 10000, skipContext: true, force: true })
        this.Generales.seleccionarComboIframe(data.region, "Región", { timeout: 10000, skipContext: true })
        this.Generales.llenarCampoIframe(data.latitud, "Latitud", { timeout: 10000, skipContext: true })
        this.Generales.llenarCampoIframe(data.longitud, "Longitud", { timeout: 10000, skipContext: true })

    }
    }


    AsignarTransacciones(data) {
        // 1. Acceder al documento del iframe
        return cy.get('iframe.frame', { timeout: 10000 })
            .its('0.contentDocument')
            .should('exist')
            .then(doc => {
                // 2. Navegación por el árbol y asignación de transacciones
                return cy.wrap(doc.body).within(() => {
                    this.Generales.IngresarArbol(data.codigosArbol);
                    cy.wait(500);
                    this.Generales.esperarQueSpinnerDesaparezca({ skipContext: true });
                    cy.wait(500);

                    if (data.asignaTodas) {
                        cy.log("Asignando todas las transacciones");
                        this.Generales.BtnIframe('Asignar todos', { force: true, skipContext: true });
                        this.Generales.IngresarFechaIframe(data.validoDesde, "Valido Desde", { force: true, skipContext: true });
                        this.Generales.IngresarFechaIframe(data.validoHasta, "Valido Hasta", { force: true, skipContext: true });
                        cy.wait(1500)
                        this.Generales.BtnIframe('Aceptar', { force: true, skipContext: true });
                        cy.wait(1500)

                        return true;
                    } else {
                        cy.log("Asignando transacciones específicas", data.transaccionesAsignar);
                        this.Generales.AsignarTransacciones(data.transaccionesAsignar);
                        this.Generales.BtnIframe('Guardar', { force: true, skipContext: true });
                        // Esperar a que el diálogo pueda aparecer
                        cy.wait(2000);
                        // Salir del within (se retorna el resultado más abajo)
                        return null; // marcador para continuar fuera del within
                    }
                }).then(result => {
                    // 3. Si la asignación no requirió el diálogo (asignaTodas), ya retornamos true
                    if (result === true) return true;

                    // 4. Verificar si el diálogo apareció usando el documento original (doc)
                    if (doc.body.textContent.includes('Definición de Fechas')) {
                        cy.log('Diálogo detectado. Ingresando fechas...');
                        // 5. Volver a entrar al iframe para llenar fechas y aceptar
                        return cy.wrap(doc.body).within(() => {
                            this.Generales.IngresarFechaIframe(data.validoDesde, "Valido Desde", { force: true, skipContext: true });
                            this.Generales.IngresarFechaIframe(data.validoHasta, "Valido Hasta", { force: true, skipContext: true });
                            this.Generales.BtnIframe('Aceptar', { force: true, skipContext: true });
                            return true;
                        });
                    } else {
                        cy.log('No apareció diálogo, transacciones ya asignadas.');
                        return false;
                    }

            });
            

        });
        
    }


    DesasignarTransacciones(data) {
        // 1. Acceder al documento del iframe
        return cy.get('iframe.frame', { timeout: 10000 })
            .its('0.contentDocument')
            .should('exist')
            .then(doc => {
                // 2. Navegación por el árbol y Desasignación de transacciones
                return cy.wrap(doc.body).within(() => {
                    this.Generales.IngresarArbol(data.codigosArbol);
                    cy.wait(500);
                    this.Generales.esperarQueSpinnerDesaparezca({ skipContext: true });
                    cy.wait(500);

                    if (data.desasignaTodas) {
                        cy.log("Desasignar todas las transacciones");
                        this.Generales.BtnIframe('Desasignar todos', { force: true, skipContext: true });
                        cy.wait(1500)
                        this.Generales.BtnIframe('Sí', { force: true, skipContext: true });
                        cy.wait(1500)

                        return true;
                    } else {
                        cy.log("Desasignando transacciones específicas", data.transaccionesADesasignar);
                        this.Generales.DesasignarTransacciones(data.transaccionesADesasignar);
                        this.Generales.BtnIframe('Guardar', { force: true, skipContext: true });
                        // Esperar a que el diálogo pueda aparecer
                        cy.wait(2000);
                        // Salir del within (se retorna el resultado más abajo)
                        return null; // marcador para continuar fuera del within
                    }
                }).then(result => {
                    // 3. Si la asignación no requirió el diálogo (asignaTodas), ya retornamos true
                    if (result === true) return true;

                    // 4. Verificar si el diálogo apareció usando el documento original (doc)
                    if (doc.body.textContent.includes('Confirmar')) {
                        cy.log('Diálogo detectado. Confirmar...');
                        // 5. Volver a entrar al iframe para llenar fechas y aceptar
                        return cy.wrap(doc.body).within(() => {
                            this.Generales.BtnIframe('Sí', { force: true, skipContext: true });
                            return true;
                        });
                    } else {
                        cy.log('No apareció diálogo, transacciones ya desasignadas.');
                        return false;
                    }

            });
            

        });
        
    }

    CamposHabilitados(data) {
        if (!data.camposHabilitados|| !Array.isArray(data.camposHabilitados)) return;
        data.camposHabilitados.forEach(dato => {
            this.Generales.seleccionarComboIframe(dato.campo, "Campos habilitados a Entidad", { timeout: 10000, force: true, skipContext: true })
            this.Generales.seleccionarComboIframe(dato.datoCampo, "Dato del campo", { timeout: 10000, force: true, skipContext: true })               
            this.Generales.BtnIframe('Guardar', { timeout: 10000, force: true, skipContext: true })
        });

    }


}
export default ArbolOrganizacionalPom;

