import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "umi";
import shallowequal from 'shallowequal';
import lrcImg from '@/assets/lrc.png';
import './index.less';
import Lrc from "../Lrc";

export default () => {
    const dispatch = useDispatch();
    const {
        selectedSong,
        selectedSinger,
        lrc,
        singerList,
        musicList,
    } = useSelector(({ global }: any) => ({
        selectedSong: global.selectedSong,
        selectedSinger: global.selectedSinger,
        lrc: global.lrc,
        singerList: global.singerList,
        musicList: global.musicList,
    }), shallowequal);

    const [visible, setVisible] = useState(false);
    const [photoStyle, setPhotoStyle] = useState({});

    const playRef = useRef<HTMLAudioElement>(null);

    const onLoad = (e: any) => {
        if (e.target.width > e.target.height) {
            setPhotoStyle({maxHeight: '100%'})
        } else {
            setPhotoStyle({maxWidth: '100%'})
        }
    }

    const playing = useMemo(() => {
        if(selectedSong.pid !== selectedSinger?.pid) {
            const singer  = singerList.find((item: { pid: any; }) => item.pid === selectedSong.pid)
            return {...selectedSong, ...singer, songName: selectedSong.name}
        } else {
            return {...selectedSong, ...selectedSinger, songName: selectedSong.name }
        }
    }, [selectedSong, selectedSinger])

    const mp3Url = useMemo(() => {
        return `./jsons/${playing.pid}/musics/${playing.mid}/${playing.mid}.mp3`;
    }, [playing])

    const lrcUrl = useMemo(() => {
        return `./jsons/${playing.pid}/musics/${playing.mid}/${playing.mid}.json`;
    }, [playing])


    const onPlayNext = (index: number) => {
        const song = musicList.find((_: any, i: any) => index === i)
        dispatch({
            type: 'global/updateState',
            payload: {
                selectedSong: song
            }
        });
    }

    useEffect(() => {
        if (playRef.current) {
            playRef.current.play()
        }
    }, [mp3Url]);

    useEffect(() => {
        dispatch({
            type: 'global/getLrc',
            payload: {
                lrcUrl
            }
        });
    }, [lrcUrl]);

    useEffect(() => {
        if (playRef.current) {
            playRef.current.onended = () => {
                let index = 0;
                let len = musicList.length
                musicList.forEach((item: { mid: any; }, i: any) => {
                    if (item.mid === playing.mid) {
                        index = i
                    }
                })
                if (index + 1 === len) {
                    onPlayNext(0)
                } else {
                    if (selectedSong.pid === selectedSinger?.pid) {
                        onPlayNext(index + 1)
                    } else {
                        onPlayNext(0)
                    }
                }
            }
        }
    }, [playRef, musicList, playing])

    return <div className="music-footer">
        <div className="music-player">
            <div className="music-player-photo">
                <img key={selectedSong.mid} src={playing.photo} style={photoStyle} alt={playing.name} onLoad={onLoad}/>
            </div>
            <div className="music-player-audio">
                <span className="music-player-song-name">
                    <span>【{playing.name}】{playing.songName}</span>
                    <img src={lrcImg} onClick={() => setVisible(true)}/>
                </span>
                <audio ref={playRef} controls src={mp3Url}></audio>
            </div>
        </div>
        {visible && <Lrc src={playing.photo} lrc={lrc} onClose={() => setVisible(false)}/>}
    </div>
}