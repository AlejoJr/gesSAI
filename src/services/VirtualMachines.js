import {GetToken} from "../components/utils/LittleComponents";

const baseUrl = 'http://localhost:8000/gessaiapi/v1'

export async function getVirtualMachines(idPool) {

    var endpoint = `${baseUrl}/pool/${idPool}/virtualmachines/`;
    const headers = {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),}
    const response = await fetch(endpoint, {headers})
    const responseJson = await response.json()

    return responseJson
    //.then(response => response.json())
    //.then(virtualmachines => this.setState({vms: virtualmachines.results, isFetch: false}))
}

export default getVirtualMachines