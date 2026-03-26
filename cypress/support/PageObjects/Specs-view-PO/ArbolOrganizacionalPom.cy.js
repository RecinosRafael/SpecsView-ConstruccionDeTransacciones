import metodosGeneralesPomCy  from "./MetodosGeneralesPom.cy";

class ArbolOrganizacional{
    constructor(){
        this.Generales = new metodosGeneralesPomCy();
    }

    ArbolOrganizacional(codigo, nombre, descripcion, responsable, cicloDeVida, canal, validoDesde, validoHasta, tieneUsuariosFinales, esRaiz, padre, tipoRama, puesto, codigoEquivalente, 
                        nivelArbol, nombreUsuario, complementoDireccion, tiempoLimite, nivelGeografico1, nivelGeografico2, nivelGeografico3, region, latitud, longitud){
        this.Generales.llenarCampoIframe(codigo, "Código")   
        this.Generales.llenarCampoIframe(nombre,"Nombre")
        this.Generales.llenarDescripcionIframe(descripcion, "Descripción")
        this.Generales.llenarCampoIframe(responsable, "Responsable")
        this.Generales.checkboxIframe(cicloDeVida, "Ciclo de vida")                    
        this.Generales.checkboxIframe(canal, "Canal")
        this.Generales.IngresarFechaIframe(validoDesde, "Válido Desde")
        this.Generales.IngresarFechaIframe(validoHasta, "Válido Hasta")
        this.Generales.slideToggleIframe(tieneUsuariosFinales, "Tiene usuarios finales")
        this.Generales.slideToggleIframe(esRaiz, "Es Raíz")
        this.Generales.checkboxIframe(padre, "Padre")
        this.Generales.checkboxIframe(tipoRama, "Tipo de Rama")
        this.Generales.llenarCampoIframe(puesto, "Puesto")
        this.Generales.llenarCampoIframe(codigoEquivalente, "Código Equivalente")
        this.Generales.llenarCampoIframe(nivelArbol, "Nivel en árbol")
        this.Generales.llenarCampoIframe(nombreUsuario, "Nombre de usuario")
        this.Generales.llenarDescripcionIframe(complementoDireccion, "Complemento de Dirección")
        this.Generales.llenarCampoIframe(tiempoLimite, "Tiempo Límite")
        this.Generales.checkboxIframe(nivelGeografico1, "Nivel Geográfico 1")
        this.Generales.checkboxIframe(nivelGeografico2, "Nivel Geográfico 2")
        this.Generales.checkboxIframe(nivelGeografico3, "Nivel Geográfico 3")
        this.Generales.checkboxIframe(region, "Región")
        this.Generales.llenarCampoIframe(latitud, "Latitud")
        this.Generales.llenarCampoIframe(longitu, "Longuitud")
    }
}

export default ArbolOrganizacional;