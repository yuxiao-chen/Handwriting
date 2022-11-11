/**
 * 去除字符串中出现次数最少的字符，不改变原字符串的顺序
 * "ababac" ——> "ababa"
 * "aaabbbcceeff" ——> "aaabbb"
 */
function removeLeastCharacter(str) {
    const charMapping = new Map()
    const leastChar = {
        char: '',
        num: 2,
    }
    str.split('').forEach(char => {
        if (!charMapping.get(char)) {
            charMapping.set(char, 0)
        }
        const num = charMapping.get(char) + 1
        charMapping.set(char, num)
        if (leastChar.char === char) leastChar.num = num
        if (num < leastChar.num) {
            leastChar.char = char
            leastChar.num = num
        }
    });
    console.log(leastChar)

    return str.replace(new RegExp(leastChar.char, 'g'), '')
}

const str = 'abbabacc'
console.log(`${str} => ${removeLeastCharacter(str)}`)