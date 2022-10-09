import { useEffect } from 'react';
import { history, useDispatch, useSelector } from 'umi';
import shallowequal from 'shallowequal';
import logoUrl from '@/assets/logo.png';
import backUrl from '@/assets/back.png';
import './index.less';
import Player from '@/components/Player';

export default ({ children }: any) => {
    const dispatch = useDispatch();
    const {
        pageType = [],
        selectedSong,
    } = useSelector(({ global }: any) => ({
        pageType: global.pageType,
        selectedSong: global.selectedSong
    }), shallowequal);

    const onLinkBack = () => {
        history.goBack()
    }

    useEffect(() => {
        dispatch({
            type: 'global/initApp',
        });
    }, []);

    return <div className="music-app">
        <div className="music-header">
            {pageType === 'songs' && <img onClick={onLinkBack} className="music-back" src={backUrl} alt="返回" />}
            <img className="music-logo" src={logoUrl} alt="Umi Music" />
            <span className="music-title">Music App</span>
        </div>
        <div className="music-content">
            {children}
        </div>
        {selectedSong && <Player />}
    </div>
}