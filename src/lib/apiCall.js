import {Auth} from './Auth'
import 'isomorphic-fetch'
import 'es6-promise'
import {getTokenPrefix} from './Auth'

let BASE_URL

const Fetcher = async (url, method = 'GET', {params, type = null, base_url = BASE_URL} = {}) => {
    let headers_data = {}
    let body = {}

    if(method == 'GET'||method == 'DELETE'){
        let i = 0
        let query = ''
        for(let name in params){
            if(params.hasOwnProperty(name)){
                if(!params[name]){
                    continue;
                }
                query += `${i>0?'&':'?'}${name}=${params[name]}`
                i++
            }
        }
        url += query
        params = undefined
    }

    switch (type){
        case 'form-data':
            body = params
            break
        default:
            headers_data = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
            body = JSON.stringify(params)
    }

    const headers = new Headers(headers_data)

    if(Auth.isAuthenticated()){
        headers.append('Authorization', `${getTokenPrefix()}${Auth.getToken()}`)
    }

    try {
        const data = await fetch(`${base_url}${url}`, {method: method, headers: headers, body: body, mode: 'cors'})
        if(data.status >= 400){
            const error = await data.json()
            if(data.status == 401 && Auth.isAuthenticated()){
                const refreshToken = Auth.getRefreshToken()
                if(refreshToken){
                    const refresh = await fetch(`${base_url}/token/refresh`, {method: 'POST', body: JSON.stringify({refreshToken: refreshToken})})
                    const response = await refresh.json()
                    const {token, refreshToken} = response
                    if(refresh.status == 401){
                        Auth.logout()
                        headers.delete('Authorization')
                        const data = await fetch(`${base_url}${url}`, {method: method, headers: headers, body: body, mode: 'cors'})
                        const response = await data.json()
                        if(data.status == 401){
                            throw response
                        }
                        return response
                    }else{
                        Auth.setToken(token)
                        Auth.setRefreshToken(refreshToken)
                        headers.set('Authorization', `Bearer ${Auth.getToken()}`)
                        const data = await fetch(`${base_url}${url}`, {method: method, headers: headers, body: body, mode: 'cors'})
                        return await data.json()
                    }
                }
                else {
                    Auth.logout()
                    headers.delete('Authorization')
                    const data = await fetch(`${base_url}${url}`, {method: method, headers: headers, body: body, mode: 'cors'})
                    const response = await data.json()
                    if(data.status == 401){
                        throw response
                    }
                    return response
                }
            }
            throw error
        }
        return await data.json()
    }
    catch (e){
        console.warn(`apiCall [error] - ${method} ${base_url}${url} -`, e ,`- params ${params}`)
        throw e
    }
}

export const redux = (url, key, method = 'GET', params = {}) => async (dispatch) => {
    try {
        dispatch({
            type: '@FETCH_DATA/REQUEST',
            payload: {
                key: key,
                data: {
                    response: null,
                    request: {
                        url,
                        method,
                        options: params
                    }
                }
            }
        })
        const response = await Fetcher(url, method, params)
        dispatch({
            type: '@FETCH_DATA/SUCCESS',
            payload: {
                key: key,
                data: {
                    response,
                    request:{
                        url,
                        method,
                        options: params
                    }
                }
            }
        })
        return response
    }
    catch (e){
        dispatch({
            type: '@FETCH_DATA/ERROR',
            payload:{
                key: key,
                error: e
            }
        })
        throw e
    }
}

export const fetchData = Fetcher
export const setBaseUrl = (url) => {
    BASE_URL = url
}