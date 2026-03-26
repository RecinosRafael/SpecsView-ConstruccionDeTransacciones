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

    AsignarTransacciones(data){

        if(data.asignarTodas){
            //asignamos todas


        }else{
            //leeemos los que manda y asignamos las indicadas con algun arreglo

        }

    }

    //Gestor de transacciones
    GestorTransacciones(
        tipo, codigo, codAlternativo, nombre, etiqueta, estado, validoDesde, validoHasta, tipoMovimientoBoveda, descripcion,
        esconderMenu, permiteReversion, modoOffline, requiereSupervisor, requiereValidarAcceso, seEnviaHost, tiempoEspera,
        accionPorDemora, tienePagoServicio, PagoServicio, pasoConfirmacionServicio, permiteReimpresion, diasPermitidoReimpresion,
        presentarResumen, mensajeResumen, tipoMensaje, icono, DepartamentodeAutorizacion, textoAyuda, logo
    ){
            this.Generales.seleccionarComboIframe(tipo, "Tipo", { timeout: 10000, skipContext: true } );
            this.Generales.llenarCampoIframe(codigo, "Código", { timeout: 10000, skipContext: true });
            this.Generales.llenarCampoIframe(codAlternativo, "Código alternativo", { timeout: 10000, skipContext: true });
            this.Generales.llenarCampoIframe(nombre, "Nombre", { timeout: 10000, skipContext: true });
            this.Generales.llenarCampoIframe(etiqueta, "Etiqueta", { timeout: 10000, skipContext: true });
            this.Generales.seleccionarComboIframe(estado, "Estado", { timeout: 10000, skipContext: true });
            this.Generales.seleccionarComboIframe(tipoMovimientoBoveda, "Tipo movimiento en bóveda", { timeout: 10000, skipContext: true, force: true });
            this.Generales.IngresarFechaIframe(validoDesde, "Valido desde", { timeout: 10000, skipContext: true });
            this.Generales.IngresarFechaIframe(validoHasta, "Valido hasta", { timeout: 10000, skipContext: true });
            this.Generales.llenarCampoIframe(descripcion, "Descripción", { timeout: 10000, skipContext: true });
            this.Generales.slideToggleIframe(esconderMenu, "Esconder en menú", { timeout: 10000, skipContext: true });
            this.Generales.slideToggleIframe(permiteReversion, "Permite reversión", { timeout: 10000, skipContext: true });
            this.Generales.slideToggleIframe(modoOffline, "Modo offline", { timeout: 10000, skipContext: true });
            this.Generales.slideToggleIframe(requiereSupervisor, "Requiere supervisor", { timeout: 10000, skipContext: true });
            this.Generales.slideToggleIframe(requiereValidarAcceso, "Se requiere validar acceso", { timeout: 10000, skipContext: true });
            if (seEnviaHost) {
                this.Generales.slideToggleIframe(seEnviaHost, "Se envía al host", { timeout: 10000, skipContext: true });
                this.Generales.llenarCampoIframe(tiempoEspera, "Tiempo de espera", { timeout: 10000, force: true, skipContext: true });
                this.Generales.seleccionarComboIframe(accionPorDemora, "Acción por demora", { timeout: 10000, force: true, skipContext: true });
            }else{
                cy.log("Se envía al host no está activo, no se ingresan los datos relacionados a esta opción", { timeout: 10000, skipContext: true });
            }
            if (tienePagoServicio) {
                this.Generales.slideToggleIframe(tienePagoServicio, "Es pago de servicio", { timeout: 10000, skipContext: true });
                this.Generales.seleccionarComboIframe(PagoServicio, "Pago de servicio", { timeout: 10000, skipContext: true });
                this.Generales.seleccionarComboIframe(pasoConfirmacionServicio, "Incluye paso para confirmar datos", { timeout: 10000, skipContext: true });
            }else{
                cy.log("Es pago de servicio no está activo, no se ingresan los datos relacionados a esta opción");
            }
            if (permiteReimpresion) {
                this.Generales.slideToggleIframe(permiteReimpresion, "Permite reimpresión", { timeout: 10000, skipContext: true });
                this.Generales.llenarCampoIframe(diasPermitidoReimpresion, "Dias permitidos para reimprimir", { timeout: 10000, force: true, skipContext: true });
            }else{
                cy.log("Permite reimpresión no está activo, no se ingresan los datos relacionados a esta opción");
            }
            if (presentarResumen) {
                this.Generales.slideToggleIframe(presentarResumen, "Presentar resumen de transaccion", { timeout: 10000, skipContext: true });
                this.Generales.llenarCampoIframe(mensajeResumen, "Mensaje despues del proceso", { timeout: 10000, force: true, skipContext: true });
                this.Generales.seleccionarComboIframe(tipoMensaje, "Tipo de mensaje", { timeout: 10000, skipContext: true });
            } else {
                cy.log("Presentar resumen no está activo, no se ingresan los datos relacionados a esta opción");
            }
            this.Generales.llenarCampoIframe(icono, "Ícono", { timeout: 10000, skipContext: true });
            this.Generales.seleccionarComboIframe(DepartamentodeAutorizacion, "Departamento de autorización", { timeout: 10000, force: true, skipContext: true });
            this.Generales.llenarCampoIframe(textoAyuda, "Texto de ayuda", { timeout: 10000, skipContext: true });
                // Carga de logo this.Generales.cargarArchivo(logo, "Logo"); pendiente
    }




}
export default ArbolOrganizacionalPom;