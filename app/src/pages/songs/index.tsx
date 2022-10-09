import { useEffect } from "react";
import { useDispatch, useLocation, useSelector } from "umi";
import shallowequal from 'shallowequal';
import './index.less';

export default () => {
    const dispatch = useDispatch();
    const location: any = useLocation()

    const {
        musicList = [],
        selectedSong,
    } = useSelector(({ global }: any) => ({
        musicList: global.musicList,
        selectedSong: global.selectedSong
    }), shallowequal);

    const onSelectedSong = (song: any) => {
        dispatch({
            type: 'global/updateState',
            payload: {
                selectedSong: song
            }
        });
    }

    useEffect(() => {
        if (location.query.pid) {
            dispatch({
                type: 'global/getSongs',
                payload: {
                    pid: location.query.pid
                }
            });
        }
    }, [location.query.pid]);

    return <div className="music-songs">
        {
            musicList.map((item: { mid: string; name: string; }, index: number) => {
                return <div
                    key={item.mid}
                    className={`music-songs__item ${selectedSong?.mid === item.mid ? 'music-playing' : ''}`} 
                    onClick={() => onSelectedSong(item)}>
                    <span className="music-index">{index + 1}</span>
                    {item.name}
                </div>
            })
        }
    </div>
}