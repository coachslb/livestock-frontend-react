const OK = 200;

//TODO
/* const NOT_FOUND = 404;
const NOT_AUTHENTICATED = 403;
const SERVER_ERROR = 500;
const FIELD_ERROR = 401; */

export const handleResponse = (res) => {
    const code = res.data.code;

    if(code >= OK && code <=300) 
        return res.data
    else
        return Promise.reject(res);
}

export const handleResponseExcel = (res) => {
    const code = res.status;

    if(code >= OK && code <=300) 
        return res.data
    else
        return Promise.reject(res);
}

export const handleResponseError = (error) => {
    return Promise.reject(error.response.data)
}