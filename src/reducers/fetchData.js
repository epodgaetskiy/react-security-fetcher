export default function (state = {}, action) {
    switch (action.type){
        case '@FETCH_DATA/REQUEST':
            return {...state, [action.payload.key]: {...action.payload.data,
                isFetching: true,
                isFetched: false,
                error: false
            }}
        case '@FETCH_DATA/SUCCESS':
            return {...state, [action.payload.key]: {...action.payload.data,
                isFetched: true,
                isFetching: false,
                error: false
            }}
        case '@FETCH_DATA/ERROR':
            return {...state, [action.payload.key]: {...action.payload.error,
                error: true,
                isFetching: false,
                isFetched: false
            }}
        default:
            return state
    }
}