import {GetToken} from "../components/utils/LittleComponents";

const baseUrl = 'http://localhost:8000/gessaiapi/v1'


/***
 * Obtener todos los Hosts
 * @returns {Promise<Hosts>}
 */
async function getHosts() {
    var endpoint = `${baseUrl}/hosts/`;
    const headers = {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),}
    const response = await fetch(endpoint, {headers})
    const responseJson = await response.json()

    return responseJson
    //.then(response => response.json())
    //.then(virtualmachines => this.setState({vms: virtualmachines.results, isFetch: false}))
}


/***
 * Obtener el Host por Id
 * @param idHost
 * @returns {Promise<Host>}
 */
async function getHost(idHost) {
    var endpoint = `${baseUrl}/hosts/${idHost}`;
    const headers = {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),}
    //const headers = {'Content-Type': 'application/json', 'Authorization': 'Basic ' + btoa('alejojr:d1n4m1kjr'),}
    const response = await fetch(endpoint, {headers})
    const responseJson = await response.json()

    return responseJson
}

/***
 * Eliminar el Host por Id
 * @param idHost
 * @returns {Promise<Host>}
 */
async function deleteHost(idHost) {
    var endpoint = `${baseUrl}/hosts/${idHost}`;
    const headers = {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),}
    const response = await fetch(endpoint, {method: 'delete', headers})
    const responseJson = await response.json()
    return responseJson
}

/***
 * Actualizar el Host por Id
 * @param host
 * @returns {Promise<Host>}
 */
async function updateHost(host) {
    var endpoint = `${baseUrl}/hosts/${host.id}/`;
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),},
        body: JSON.stringify(host)
    };

    const responseJson = fetch(endpoint, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.status);
            }
        })
        .catch(error => console.log('Error actualizando el Host -> ', error));


    return responseJson
}

/***
 * Crear un nuevo Host
 * @param host
 * @returns {Promise<Host>}
 */
async function createHost(host) {
    var endpoint = `${baseUrl}/hosts/`;

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),},
        body: JSON.stringify(host)
    };

    const responseJson = fetch(endpoint, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.status);
            }
        })
        .catch(error => console.log('Error creando el Host -> ', error));


    return responseJson
}

/***
 * Obtener el Host por nombre (Nombre de máquina DNS)
 * @returns {Promise<Hosts>}
 */
async function existHostByName(nameMachine) {
    var endpoint = `${baseUrl}/host/exists-machine/`;

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),},
        body: JSON.stringify({'name': nameMachine})
    };

    const responseJson = fetch(endpoint, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.status);
            }
        })
        .catch(error => console.log('Error obteniendo el Host por nombre -> ', error));

    return responseJson
}

/***
 * Obtener los Hosts de un grupo
 * @returns {Promise<Hosts>}
 */
async function hostsByGroup(idGroup) {
    var endpoint = `${baseUrl}/group/hosts/`;

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),},
        body: JSON.stringify({'idGroup': idGroup})
    };

    const responseJson = fetch(endpoint, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.status);
            }
        })
        .catch(error => console.log('Error obteniendo los hosts del grupo por id -> ', error));

    return responseJson
}

/***
 * Obtener el Hosts Master por Id de usuario
 * @param idUser
 * @returns {Promise<HostsMaster>}
 */
async function getHostsMaster(idUser) {
    var endpoint = `${baseUrl}/hosts-master/`;

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),},
        body: JSON.stringify({'idUser': idUser})
    };

    const responseJson = fetch(endpoint, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.status);
            }
        })
        .catch(error => console.log('Error obteniendo los Hosts Master asociados al usuario -> ', error));

    return responseJson
}

export {getHosts, createHost, getHost, updateHost, deleteHost, existHostByName, hostsByGroup, getHostsMaster}