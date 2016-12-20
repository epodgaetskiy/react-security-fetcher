import cookie from 'react-cookie'
import {onEnter} from 'react-isomorphic-render/redux'

let tokenName = 'token'
let refreshTokenName = 'refreshToken'
let tokenPrefix = 'Bearer '

export const Auth = {
    setToken(token){
        cookie.save(tokenName, token)
    },
    setRefreshToken(refreshToken){
        cookie.save(refreshTokenName, refreshToken)
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


export const Check = ({roles, denyRoles, cb}) => (Component) =>{
    return onEnter(async ({ getState }, redirect) => {
        if(Auth.isAuthenticated()){
            const {user} = getState().authentication
            let hasRole = false
            for(let i in user.roles){
                let role = user.roles[i]
                for(let i in denyRoles){
                    if(denyRoles.hasOwnProperty(i) && role==denyRoles[i]){
                        (typeof (cb) == 'function' && cb(getState, redirect))||redirect('/')
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
                (typeof (cb) == 'function' && cb(getState, redirect))||redirect('/')
            }
        }else{
            (typeof (cb) == 'function' && cb(getState, redirect))||redirect('/')
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
