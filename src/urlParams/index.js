function getUrlParams(url) {
    if (!url.includes('?')) return {}

    const paramsStr = url.split('?')[1]
    const keyValues = paramsStr.split('&')
    return keyValues.reduce((obj, str) => {
        const kv = str.split('=')
        obj[kv[0]] = kv[1]
        return obj
    }, {})
}

console.log(getUrlParams('https://baijiahao.baidu.com/s?id=1749471766611451198&wfr=spider&for=pc'))