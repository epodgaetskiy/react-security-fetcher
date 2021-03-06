import cookie from 'react-cookie'
import {onEnter} from 'react-isomorphic-render/redux'

let tokenName = 'token'
let refreshTokenName = 'refreshToken'
let tokenPrefix = 'Bearer '

let expiresRefreshToken = new Date()
expiresRefreshToken.setMonth(expiresRefreshToken.getMonth() + 2)
let expiresToken = new Date()
expiresToken.setMonth(expiresToken.getMonth() + 1)

export const Auth = {
    setToken(token){
        cookie.save(tokenName, token, {expires: expiresToken})
    },
    setRefreshToken(refreshToken){
        cookie.save(refreshTokenName, refreshToken, {expires: expiresRefreshToken})
    },
    getToken(){
        return cookie.load(tokenName)
    },
    getRefreshToken(){
        return cookie.load(refreshTokenName) || false
    },
    isAuthenticated(){
        return this.getToken() ? true: false
    },
    logout(){
        cookie.remove(tokenName)
        cookie.remove(refreshTokenName)
    }
}


export const Check = ({roles = [], denyRoles = [], cb, anon = false}) => (Component) =>{
    return onEnter(async ({ getState }, redirect) => {
        const {authentication: {user}} = getState()
        if(Auth.isAuthenticated() && user){
            let hasRole = false
            for(let i in user.roles){
                let role = user.roles[i]
                for(let i in denyRoles){
                    if(denyRoles.hasOwnProperty(i) && role==denyRoles[i]){
                        cb ? await cb({getState, redirect}): redirect('/')
                        return
                    }
                }
                for(let i in roles){
                    if(roles.hasOwnProperty(i) && role == roles[i]){
                        hasRole = true
                    }
                }
            }
            if(!hasRole){
                cb ? await cb({getState, redirect}): redirect('/')
            }
        }else if(!anon){
            cb ? await cb({getState, redirect}): redirect('/')
        }
    })(Component)
}

export const setTokenName = (name) => {
    tokenName = name
}
export const setRefreshTokenName = (name) => {
    refreshTokenName = name
}
export const setTokenPrefix = (prefix) => {
    tokenPrefix = prefix
}
export const getTokenPrefix = () => {
    return tokenPrefix
}
