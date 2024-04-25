const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');

const pic_path = ""
// const tuchuang_path = "https://cdn.staticaly.com/gh/Azumic/blog_pic@main/"
const tuchuang_path = "https://jsd.cdn.zzko.cn/gh/Azumic/blog_pic@main/"
const detail_file_ori = "data/comic_detail_ori.json"
const detail_file = "data/comic_detail.json"
const pattern = /.+\/(comic\/imglist)\/.*/; // 匹配规则

var data;
fs.readFile(detail_file_ori, 'utf8', (err, data1) => {
    if (err) {
        console.error('读取文件失败：', err);
        return;
    }
    data = data1;
    readImgSize(data);
});

async function readImgSize(data) {
    var oldData = JSON.parse(data);
    var newData = oldData
    Object.entries(oldData).forEach(async ([key, value]) => {

        var imgwidth = []
        var imgInfo = {}

        let i=0;
        value.imglist.forEach((url, index) => {
            const matchResult = url.match(pattern);
            if (matchResult) {
                const matchedPart = matchResult[1]; // 匹配到的部分
                const lastIndex = url.indexOf(matchedPart); // 获取匹配部分在 URL 中的位置
                const extractedPart = url.substring(0, lastIndex); // 提取匹配部分前面的部分
                
                var img_path = url.replace(extractedPart, pic_path)
                var info = getImgSize(img_path)
                imgInfo[index] = info
                imgwidth.push(info.width)
    
                const newUrl = url.replace(extractedPart, tuchuang_path)
                newData[key]["imglist"][i++] = newUrl
            }
        });

        oldData[key].imgwidth = imgwidth
        oldData[key].imgInfo = imgInfo

        newData[key].imgwidth = imgwidth
        newData[key].imgInfo = imgInfo

        console.log(newData[key]);

    });

    fs.writeFile(detail_file, JSON.stringify(newData), (err) => {
        if (err) {
            console.error('写入文件失败：', err);
            return;
        }
        console.log('JSON 文件已成功生成！');
        console.log(newData)
        console.log("------------------------------------------")
    });
}

function getImgSize(path1) {
    if (!path1) return ""

    const absolutePath = path.resolve(path1);
    const dimensions = sizeOf(absolutePath);
    return dimensions
}

function getImageSizeFromFile(filePath) {
    try {
        const absolutePath = path.resolve(filePath);
        const dimensions = sizeOf(absolutePath);
        console.log('图片宽度：', dimensions.width);
        console.log('图片高度：', dimensions.height);
        console.log('图片高度：', dimensions);
    } catch (error) {
        console.error('获取图片尺寸失败：', error);
    }
}

async function getImageSizeFromUrl(url) {
    try {
        const { default: fetch } = await import('node-fetch');
        const response = await fetch(url);
        const buffer = await response.buffer();
        const dimensions = sizeOf(buffer);
        console.log('图片宽度：', dimensions.width);
        console.log('图片高度：', dimensions.height);
    } catch (error) {
        console.error('获取图片尺寸失败：', error);
    }
}
