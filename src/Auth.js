import cookie from 'react-cookie'
import {onEnter} from 'react-isomorphic-render/redux'

const tokenName = 'token'
const refreshTokenName = 'refreshToken'

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


export const Check = ({roles}) => (Component) =>{
    return onEnter(async ({ getState }, redirect) => {
        if(Auth.isAuthenticated()){
            const {user} = getState().authentication
            let hasRole = false
            for(let i in user.roles){
                let role = user.roles[i]
                for(let i in roles){
                    if(roles.hasOwnProperty(i) && role == roles[i]){
                        hasRole = true
                    }
                }
            }
            if(!hasRole){
                redirect('/')
            }
        }else{
            redirect('/')
        }
    })(Component)
}