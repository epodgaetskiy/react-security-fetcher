export default function (state = {}, action) {
    switch (action.type){
        case '@FETCH_DATA/REQUEST':
            return {...state, [action.payload.key]: {...state[action.payload.key],
                _request: action.payload.data.request,
                isFetching: true,
                isFetched: false,
                error: false
            }}
        case '@FETCH_DATA/SUCCESS':
            return {...state, [action.payload.key]: {...action.payload.data,
                isFetched: true,
                isFetching: false,
                error: false,
                _request: undefined
            }}
        case '@FETCH_DATA/ERROR':
            return {...state, [action.payload.key]: {...state[action.payload.key],
                error: action.payload.error,
                isFetching: false,
                isFetched: false,
            }}
        default:
            return state
    }
}