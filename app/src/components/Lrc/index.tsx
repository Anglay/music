import { useMemo } from 'react';
import closeIcon from '@/assets/close.png';
import './index.less';

export default ({ src, lrc, onClose }: any) => {
    const bgStyle = useMemo(() => {
        return {
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        }
    }, [src])

    const lrcData = useMemo(() => {
        const lines = []
        const lrcObj = lrc.split("\r")
        for (let index = 0; index < lrcObj.length; index++) {
            const elem = lrcObj[index];
            const line = elem.replace(/\[.*?\]/g,'')
            if (line) {
                lines.push(line)
            }
        }
        return lines
    }, [lrc])
    
    return <div style={bgStyle} className="music-lrc">
        <span className="music-lrc-close" onClick={onClose}>
            <img src={closeIcon}/>
        </span>
        <ul className="music-lrc-list">
            {lrcData.map((item, index) => <li key={`${item}__${index}`}>{item}</li>)}
        </ul>
    </div>
}