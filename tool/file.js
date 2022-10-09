//文件操作
var fs = require('fs');

/**
 * 验证文件是否存在
 * @param {*} path 
 */
function isFileExist(path) {
    try{
        fs.accessSync(path,fs.F_OK);
    }catch(e){
        return false;
    }
    return true;
}

const authers = ['Bav35754538','Bav35761086','Bav93047719','Bav206719735']

function getList(list) {
    let data = []
    list.forEach(elem => {
        const _data = require(`./${elem}/data.json`)
        data = [...data, ..._data]
    });
    loopFileExist(data)
}

function loopFileExist(list) {
    if (list && list.length > 0) {
        const [first, ...rest] = list;
        const filePath = `${first.pid}/musics/${first.mid}/${first.mid}.json`;
        if (isFileExist(filePath)) {
            loopFileExist(rest)
        } else {
            writeFile(filePath, () => {
                loopFileExist(rest)
            })
        }
    }
}

//获取所有音频
function writeFile(url, callback) {
    fs.promises.writeFile(url, JSON.stringify({'lrc':"[99:00.00]暂未歌词 \r"}), 'utf8');
    callback && callback()
}

getList(authers)