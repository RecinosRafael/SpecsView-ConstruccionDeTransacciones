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

//     AsignarTransacciones(data){
//         //ingresamos al arbol que deseamos agregar las TX
//         this.Generales.IngresarArbol(data.codigosArbol)
//         cy.wait(500)
//         this.Generales.esperarQueSpinnerDesaparezca()
//         cy.wait(500)
//         if(data.asignaTodas){
//             cy.log("Asignando todas las transacciones")
//             this.Generales.BtnIframe('Asignar todos', { timeout: 10000, force: true, skipContext: true });
//             this.Generales.IngresarFechaIframe(data.validoDesde, "Valido Desde", { timeout: 10000, skipContext: true, force: true });
//             this.Generales.IngresarFechaIframe(data.validoHasta, "Valido Hasta", { timeout: 10000, skipContext: true,  force: true});
//             this.Generales.BtnIframe('Aceptar', { timeout: 10000, force: true, skipContext: true });

//         }else{
//             cy.log("Asignando las transacciones", data.transaccionesAsignar)
//             this.Generales.AsignarTransacciones(data.transaccionesAsignar)
//             this.Generales.BtnIframe('Guardar', { timeout: 10000, force: true, skipContext: true });

//             //esperamos 1.5 segundo para que aparezca el dialogo
//             cy.wait(5000)

//             // cy.document().then((doc) => {
//             // const hayDialogo = doc.body.innerText.includes('Definición de Fechas');
//             // if (hayDialogo) {
//             //acciones   aveces funciona aveces no 
//             // }else{
//             // cy.log("no aparecio") }

//         cy.get('body').then($body => {
//             if ($body.text().includes('Definición de Fechas')) {
//             cy.log('Diálogo detectado. Ingresando fechas...');
//             this.Generales.IngresarFechaIframe(data.validoDesde, "Valido Desde", { timeout: 10000, skipContext: true,  force: true });
//             this.Generales.IngresarFechaIframe(data.validoHasta, "Valido Hasta", { timeout: 10000, skipContext: true,  force: true });          
//             this.Generales.BtnIframe('Aceptar', { timeout: 10000, force: true, skipContext: true });
//             } else {

//                 cy.log('No apareció diálogo, transacciones ya asignadas.');
//             }
        

//     })
// }}

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
    // AgregarCamposAdicionales(data){
    //     //ingresamos al arbol que deseamos agregar las TX
    //     this.Generales.IngresarArbol(data.codigosArbol)
    //     cy.wait(500)
    //     this.Generales.esperarQueSpinnerDesaparezca()
    //     cy.wait(500)


    //     //desasignar especificas o desasignar todas  /* validar si se puede ver tema del body en el inicio del grame y mandar el body como parametro y ver si permite consultas  */

    //     if(data.asignaTodas){
    //         cy.log("Asignando todas las transacciones")
    //         this.Generales.BtnIframe('Asignar todos', { timeout: 10000, force: true, skipContext: true });
    //         this.Generales.IngresarFechaIframe(data.validoDesde, "Valido Desde", { timeout: 10000, skipContext: true, force: true });
    //         this.Generales.IngresarFechaIframe(data.validoHasta, "Valido Hasta", { timeout: 10000, skipContext: true,  force: true});
    //         this.Generales.BtnIframe('Aceptar', { timeout: 10000, force: true, skipContext: true });

    //     }else{
    //         cy.log("Asignando las transacciones", data.transaccionesAsignar)
    //         this.Generales.AsignarTransacciones(data.transaccionesAsignar)
    //         this.Generales.BtnIframe('Guardar', { timeout: 10000, force: true, skipContext: true });

    //         this.Generales.IngresarFechaIframe(data.validoDesde, "Valido Desde", { timeout: 10000, skipContext: true,  force: true });
    //         this.Generales.IngresarFechaIframe(data.validoHasta, "Valido Hasta", { timeout: 10000, skipContext: true,  force: true });
    //         this.Generales.BtnIframe('Aceptar', { timeout: 10000, force: true, skipContext: true });

    //     }

    // }
    
    
    CamposHabilitados(data) {
        if (!data.camposHabilitados|| !Array.isArray(data.camposHabilitados)) return;
        data.camposHabilitados.forEach(dato => {
            this.Generales.seleccionarComboIframe(dato.campo, "Campos habilitados a Entidad", { timeout: 10000, force: true, skipContext: true })
            this.Generales.seleccionarComboIframe(dato.datoCampo, "Dato del campo", { timeout: 10000, force: true, skipContext: true })               
            this.Generales.BtnIframe('Guardar', { timeout: 10000, force: true, skipContext: true })

            /**
             * 
             * datos para llenar el metodo de captura 
             * descripcion
             * nombre crud
             * 
             */


            //metodo intercepcion rafa 

            //aqui ira el metodo reporte rafa alias y parametros para el metodo

        });

    }
}
export default ArbolOrganizacionalPom;

