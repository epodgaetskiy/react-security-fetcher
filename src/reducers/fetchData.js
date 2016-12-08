export default function (state = {}, action) {
    switch (action.type){
        case '@FETCH_DATA/SUCCESS':
            return {...state, [action.payload.key]: action.payload.response}
        case '@FETCH_DATA/ERROR':
            return {...state, [action.payload.key]: action.payload.error}
        default:
            return state
    }
}