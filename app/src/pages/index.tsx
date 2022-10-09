import { history, useDispatch, useSelector } from 'umi';
import shallowequal from 'shallowequal';
import './index.less';

export default () => {
  const dispatch = useDispatch();

  const {
    singerList = [],
  } = useSelector(({ global }: any) => ({
    singerList: global.singerList,
  }), shallowequal);

  const onLinkTo = (singer: any) => {
    dispatch({
      type: 'global/updateState',
      payload: {
        selectedSinger: singer
      }
    });
    history.push({
      pathname: '/songs',
      query: {
        pid: singer.pid
      },
    });
  }

  return <div className="music-singer">
    {singerList.map((item: { pid: string; photo: string; name: string; }) => {
      return <div className="music-singer__item" key={item.pid} onClick={() => onLinkTo(item)}>
        <span className="singer-photo">
          <img src={item.photo} alt={item.name} />
        </span>
        <span className="singer-name">{item.name}</span>
      </div>
    })}
  </div>;
}
