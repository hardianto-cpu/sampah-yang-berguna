import fetch from "node-fetch";
import cheerio from "cheerio";
const komiku = async () => {
    return new Promise(async (resolve, reject) => {
        const html = await (await fetch('https://komiku.id/')).text()
        const result = []
        const $ = cheerio.load(html)
        $('#Terbaru > div > div').each(function (i, elem) {
            const cover = $(elem).find('img').attr('src')
            const name = $(elem).find('h4').find('a').text()
            const time = $(elem).find('span').text()
            const chapter = $(elem).find('a').text()
            const url = 'https://komiku.id' + $(elem).find('a').attr('href')
            result.push({
                url,
                cover,
                name,
                time,
                chapter
            })
        })
        resolve(result)
    })
}
const searchKomiku = async (keyword) => {
    return new Promise(async (resolve, reject) => {
        const html = await (await fetch('https://data.komiku.id/cari/?post_type=manga&s=' + keyword)).text()
        const result = []
        const $ = cheerio.load(html)
        $('body > main > section > div.daftar > div').each(async function (i, elem) {
            const cover = 'h' + $(elem).find('img').attr('src')
            const name = $(elem).find('h3').text().trim()
            const judul = $(elem).find('span').text()
            const sinopsis = $(elem).find('p').text().trim()
            const url = $(elem).find('a').attr('href')
            const chapter = judul.split('Chapter')[1].replace('Terbaru:', '').trim()
            const chapterLts = judul.split('Chapter')[2].trim()
            const lastChapter = chapter + '-' + chapterLts

            result.push({
                url,
                lastChapter,
                cover,
                name,
                sinopsis,
                judul,
            })
        })
        resolve(result)
    })
}
   const scrapeKomiku = async (url) => {
    return new Promise(async (resolve, reject) => {
        const html = await (await fetch(url)).text()
     //   console.log(html)
        const $ = cheerio.load(html)
        const result = []
        const cover = $('#Informasi > div > img').attr('src')
        const name = $('#Informasi > table > tbody > tr:nth-child(1) > td:nth-child(2)').text()
        const type = $('#Informasi > table > tbody > tr:nth-child(2) > td:nth-child(2) > a > b').text()
        const konsep = $('#Informasi > table > tbody > tr:nth-child(3) > td:nth-child(2)').text()
        const author = $('#Informasi > table > tbody > tr:nth-child(4) > td:nth-child(2)').text()
        const status = $('#Informasi > table > tbody > tr:nth-child(5) > td:nth-child(2)').text()
        const minim_reader_age = $('#Informasi > table > tbody > tr:nth-child(6) > td:nth-child(2)').text()
        const reader_count = $('#Informasi > table > tbody > tr:nth-child(7) > td:nth-child(2)').text()
        const genre = []
        const chap = []
        $('#Informasi > ul > li').each(function (i, elem) {
            const gen = $(elem).find('a').text()
            genre.push(gen)
        }
        )
        $('#Daftar_Chapter > tbody > tr').each(function (i, elem) {
            const url = 'https:komiku.id'+$(elem).find('a').attr('href')
            const title = $(elem).find('a').attr('title')
            const chapter = $(elem).find('a > span:nth-child(2)').text()
            chap.push({
                url,
                title,
                chapter
    })
        })
        result.push({
            cover,
            name,
            type,
            konsep,
            author,
            status,
            minim_reader_age,
            reader_count,
            genre,
            chap
        })
        resolve(result)
    })
}
// searchKomiku('soul land').then(async (result) => {
//     console.log(result)
//     const test = await scrapeKomiku(result[0].url)
//     console.log(test)
// }
// )
komiku().then(async (result) => {
    console.log(result)
})
