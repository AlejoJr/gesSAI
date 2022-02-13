const baseUrl = 'http://localhost:8000/gessaiapi/v1'

/***
 * Login de un usuario en la aplicacion
 * @param username
 * @param password
 * @returns {Promise<Token>}
 */
async function LoginUser(username, password) {
    var endpoint = `${baseUrl}/login`;

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username,password})
    };

    const response = await fetch(endpoint, requestOptions)
    const responseJson = await response.json()

    return responseJson
}

export {LoginUser}