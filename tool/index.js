const axios = require('axios')
const path = require('path')
const fs=require('fs')

function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
          if (mkdirsSync(path.dirname(dirname))) {
              fs.mkdirSync(dirname);
              return true;
          }
    }
}

async function getAllMusic(auther) {
    await axios.get(`https://service-l39ky64n-1255944436.bj.apigw.tencentcs.com/release/music/?mid=${auther.key}&type=p`).then(function (res) {
        const musicList = res.data;
        mkdirsSync(`./${auther.key}`);
        fs.promises.writeFile(`./${auther.key}/data.json`, JSON.stringify(musicList), 'utf8');
        loopFetch(musicList, auther)
    })
}

function loopFetch(list, auther) {
    if (list && list.length > 0) {
        const [first, ...rest] = list;
        fetchURL(first, auther, () => {
            loopFetch(rest, auther)
        })
    }
}

async function fetchURL(item, auther, callback) {
    const { mid } = item
    await axios.get(`https://service-l39ky64n-1255944436.bj.apigw.tencentcs.com/release/music/?mid=${mid}&type=music`).then(function (res) {
        const data = res.data
        downLoad(data.src, data.img, mid, auther, callback)
    })
}

//写入mp3地址
async function downLoad(url, imgurl, mid, auther, callback) {
    const dir = `./${auther.key}/musics/${mid}`;
    mkdirsSync(dir);
    try {
        await axios.get(url, { responseType: 'stream' }).then(function (res) {
            const mp3=fs.createWriteStream(`${dir}/${mid}.mp3`);
            res.data.pipe(mp3)
            res.data.on('close', async function (err) {
                console.log(mid + ' --> success')
                let { data } = await axios({
                    url: imgurl,
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                    responseType: 'arraybuffer',
                })
                await fs.promises.writeFile(`${dir}/${mid}.jpg`, data, 'binary');
                callback && callback()
            })
        })
    } catch (error) {
        
    }
}

const authers =[
   {
        name:'伍佰',
        key: 'Bav93047719'
   }
]
// authers.forEach(item => {
//     getAllMusic(item)
// })
const list = [
{
    "type": "music",
    "name": "23 年后重听伍佰，他一开口，就安慰了整个 90 后——伍佰现场超清合集（持续更新）-MV-爱你伍佰年-心爱的再会啦",
    "mid": "Bav93047719_54",
    "album": {
        "name": ""
    },
    "artist": [
        "派森君"
    ]
},
{
    "type": "music",
    "name": "23 年后重听伍佰，他一开口，就安慰了整个 90 后——伍佰现场超清合集（持续更新）-MV-爱你伍佰年-一生最爱的人",
    "mid": "Bav93047719_55",
    "album": {
        "name": ""
    },
    "artist": [
        "派森君"
    ]
},
{
    "type": "music",
    "name": "23 年后重听伍佰，他一开口，就安慰了整个 90 后——伍佰现场超清合集（持续更新）-MV-爱你伍佰年-爱上别人是快乐的事",
    "mid": "Bav93047719_56",
    "album": {
        "name": ""
    },
    "artist": [
        "派森君"
    ]
}]
loopFetch(list,{
    name:'伍佰',
    key: 'Bav93047719'
})
