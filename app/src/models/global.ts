import request from 'umi-request'

const services = {
    getSingers(){
        return request(`./jsons/singer.json`)
    },
    getSongs(payload: any){
        return request(`./jsons/${payload.pid}/data.json`)
    },
    getLrc(payload: any){
        return request(`${payload.lrcUrl}`)
    }
}

const namespace = 'global';
const initState = {
    pageType:'singer',
    singerList: [],
    musicList: [],
    selectedSinger: null,
    selectedSong: null,
    lrc: null,
};

export default {
    namespace,
    state: initState,
    subscriptions: {
        setup({ dispatch, history }:any) {
            history.listen((location: { pathname: string | string[]; }) => {
                let pageType = '';
                if (location.pathname.includes('/songs')) {
                    pageType =  "songs";
                } else {
                    pageType =  "singer";
                }
                dispatch({
                    type: 'updateState',
                    payload: {
                        pageType
                    }
                });
            })
        }
    },
    effects: {
        * initApp(_: any, { put }:any) {
            yield put({
                type: 'getSingers',
            });
        },
        * getSingers(_: any, { call, put }:any) {
            const res:any = yield call(services.getSingers);
            yield put({
                type: 'updateState',
                payload: {
                    singerList: res
                }
            });
        },
        * getSongs({ payload }: any, { call, put }:any) {
            const res:any = yield call(services.getSongs, payload);
            yield put({
                type: 'updateState',
                payload: {
                    musicList: res
                }
            });
        },
        * getLrc({ payload }: any, { call, put }:any) {
            const res:any = yield call(services.getLrc, payload);
            yield put({
                type: 'updateState',
                payload: {
                    lrc: res.lrc
                }
            });
        },
    },
    reducers: {
        updateState(state: any, action: { payload: any; }) {
            return {
                ...state,
                ...action.payload
            };
        }
    }
};
