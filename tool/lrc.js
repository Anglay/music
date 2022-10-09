const axios = require('axios')
const path = require('path')
const fs=require('fs')
const cheerio = require('cheerio')

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

function trim(url) {
    url = url.replace(/\:/g,'');
    url = url.replace(/\//g,'');
    url = url.replace(/\./g,'');
    return url
}

// async function getAllMusic(auther) {
//     await axios.get(auther.url).then(function (res) {
//         const $ = cheerio.load(res.data)
//         let musicList =[];
//         $('.rec').find('a').each((i, elem) => {
//             const reqnum = $(elem).attr('href').replace(/lrc/ig, "lrcdown");
//             const name = $(elem).text()
//             musicList.push({
//                 url: 'https://www.lrcgeci.com' + reqnum,
//                 name: trim(name)
//             })
//         })
//         fs.promises.writeFile(`./lrcs/${auther.key}.json`, JSON.stringify(musicList), 'utf8');
//         loopFetch(musicList, auther)
//     })
// }

// function loopFetch(list, auther) {
//     if (list && list.length > 0) {
//         const [first, ...rest] = list;
//         fetchURL(first, auther, () => {
//             loopFetch(rest, auther)
//         })
//     }
// }

// //获取所有音频
// async function fetchURL(item, auther, callback) {
//     await axios.get(item.url).then(function (res) {
//         fs.promises.writeFile(`./lrcs/${auther.key}/${item.name}.json`, JSON.stringify({'lrc':res.data}), 'utf8');
//         callback && callback()
//     })
// }

// const lrcs = [{
//     url:'https://www.lrcgeci.com/geshou/1168.html',
//     key: 'Bav93047719',
// }]

// mkdirsSync(`./lrcs`);

// lrcs.forEach(elem => {
//     mkdirsSync(`./lrcs/${elem.key}`);
//     getAllMusic(elem)
// });

const authers = ['Bav93047719']

function getList(list) {
    
    let data = []
    let lrcs = []
    list.forEach(elem => {
        const _data = require(`./${elem}/data.json`)
        const _lrcs = require(`./lrcs/${elem}.json`)
        data = [...data, ..._data]
        lrcs = [...lrcs, ..._lrcs]
    });
    data.forEach(elem => {
        elem.lrcFileUrl = []
        lrcs.forEach(item => {
            if(item.name.indexOf(elem.name)>=0) {
                elem.lrcFileUrl.push(item.url)
            }
        })
    })
    loopCopyLrc(data)
}
function loopCopyLrc(list){
    if (list && list.length > 0) {
        const [first, ...rest] = list;
        if (first.lrcFileUrl.length > 0) {
            fetchURL(first.lrcFileUrl[0], first, () => {
                loopCopyLrc(rest)
            })
        } else {
            loopCopyLrc(rest)
        }
    }
}

//获取所有音频
async function fetchURL(url, item, callback) {
    await axios.get(url).then(function (res) {
        // console.log(`./${item.pid}/musics/${item.mid}/${item.mid}.json`)
        fs.promises.writeFile(`./${item.pid}/musics/${item.mid}/${item.mid}.json`, JSON.stringify({'lrc':res.data}), 'utf8');
        callback && callback()
    })
}

getList(authers)