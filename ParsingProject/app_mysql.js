let puppeteer = require('puppeteer')
const express = require('express');  
const ejs = require('ejs');
const app = express();  



app.use(express.static('public'))
app.use('/static', express.static('public'))

/* 환경설정 */
//뷰엔진 설정
app.set('view engine', 'ejs')
app.use(express.json()) 
app.use(express.urlencoded({extended: true})); 

app.use(express.json({
    limit: '50mb'
}))


app.listen(3000, () => {
    console.log("Server Started port 3000...")
});

app.get('/', async(req, res) =>{

    let obj = new Array();

    let obj_lithium = new Array();
    let obj_nickel = new Array();
    let obj_cobalt = new Array();
    let obj_manganese = new Array();
    let obj_heoto = new Array();
    let obj_aluminium  = new Array();
    let obj_magnesium  = new Array();
    let obj_news_bat = new Array();
    let obj_news_mot = new Array();
    let obj_news_sas = new Array();

    let eh;
    let day;
    let price;
    let updown_price;   // 등락가
    let updown_rate;    // 등락율
    let updown_price_pm;
    let updown_rate_pm;
    let browser =  await puppeteer.launch({haedless:false});
    let page = await browser.newPage();
    let cnt_bat = 0, cnt_mot = 0, cnt_sas = 0


    // 배터리 뉴스
    await page.goto('https://search.naver.com/search.naver?where=news&ie=utf8&sm=nws_hty&query=%EC%9E%90%EB%8F%99%EC%B0%A8+%EB%B0%B0%ED%84%B0%EB%A6%AC')
    
    var ehlist = await page.$$('div.news_wrap.api_ani_send > div'); // 복수
    for(let eh of ehlist){
        let name = await eh.$eval('a.news_tit',function(el) {
            return el.innerText
        })
        let contents = await eh.$eval('a.api_txt_lines.dsc_txt_wrap',function(el) {
            return el.innerText
        })
        let day = await eh.$eval('a.info',function(el) {
            return el.innerText
        })
        let src = await eh.$eval('a.news_tit',function(el) {
            return el.href
        })
        
        obj_news_bat[cnt_bat]={
            name:name,
            contents:contents,
            day:day,
            src:src
        }
        cnt_bat++
    }

    // 모터 뉴스
    await page.goto('https://search.naver.com/search.naver?sm=tab_hty.top&where=news&query=%EC%9E%90%EB%8F%99%EC%B0%A8+%EB%AA%A8%ED%84%B0&oquery=%EC%9E%90%EB%8F%99%EC%B0%A8+%EB%AA%A8%ED%84%B0&tqi=hy1lFsprvTVssfbS5wNssssss%2Bl-004477')
    
    ehlist = await page.$$('div.news_wrap.api_ani_send > div'); // 복수
    for(let eh of ehlist){
        let name = await eh.$eval('a.news_tit',function(el) {
            return el.innerText
        })
        let contents = await eh.$eval('a.api_txt_lines.dsc_txt_wrap',function(el) {
            return el.innerText
        })
        let day = await eh.$eval('a.info',function(el) {
            return el.innerText
        })
        let src = await eh.$eval('a.news_tit',function(el) {
            return el.href
        })
        
        obj_news_mot[cnt_mot]={
            name:name,
            contents:contents,
            day:day,
            src:src
        }
        cnt_mot++
    }


    // 사시 뉴스
    await page.goto('https://search.naver.com/search.naver?sm=tab_hty.top&where=news&query=%EC%9E%90%EB%8F%99%EC%B0%A8+%ED%94%84%EB%A0%88%EC%9E%84&oquery=%EC%9E%90%EB%8F%99%EC%B0%A8+%ED%94%84%EB%A0%88%EC%9E%84&tqi=hy1lqwprvOsssQssWG4ssssstxZ-066289')
    
    ehlist = await page.$$('div.news_wrap.api_ani_send > div'); // 복수
    for(let eh of ehlist){
        let name = await eh.$eval('a.news_tit',function(el) {
            return el.innerText
        })
        let contents = await eh.$eval('a.api_txt_lines.dsc_txt_wrap',function(el) {
            return el.innerText
        })
        let day = await eh.$eval('a.info',function(el) {
            return el.innerText
        })
        let src = await eh.$eval('a.news_tit',function(el) {
            return el.href
        })
        
        obj_news_sas[cnt_sas]={
            name:name,
            contents:contents,
            day:day,
            src:src
        }
        cnt_sas++
    }



    //희토류
    await page.goto('https://www.kores.net/komis/price/mineralprice/minormetals/pricetrend/minorMetals.do?mnrl_pc_mc_seq=533')
    
    for(let i=0; i<12;i++){
       eh = await page.$('table.tbls03 tbody  tr:nth-child('+(15+i)+')');
       // 데이 
       day = await eh.$eval('td.fst', function(el){
            return el.innerText
        })
        // 가격
        price = await eh.$eval('td:nth-child(2)', function(el){
            return el.innerText
        })
        // 등락가
        updown_price = await eh.$eval('td:nth-child(3) span', function(el){
            return el.innerText
        })
        // 등락율
        updown_rate = await eh.$eval('td:nth-child(4) span', function(el){
            return el.innerText
        })
        // 등락가 PM
        updown_price_pm = await eh.$eval('td:nth-child(3) span', function(el){
            return el.className
        })
        // 등락율 PM
        updown_rate_pm = await eh.$eval('td:nth-child(4) span', function(el){
            return el.className
        })
        var price_replace = price.replace(",", "")
        var updown_price_pm_replace = updown_price_pm.replace("up_down ", "")
        var updown_rate_pm_replace = updown_rate_pm.replace("up_down ", "")

        // 등락가 +,- 표시
        if (updown_price_pm_replace == "up"){
            updown_price_pm_replace = "+"
        }
        else {
            updown_price_pm_replace ="-"
        }

        // 등락율 +,- 표시
        if (updown_rate_pm_replace == "up"){
            updown_rate_pm_replace = "+"
        }
        else {
            updown_rate_pm_replace ="-"
        }

        

        obj_heoto[i]={
            day:day,
            price:price_replace,
            updown_price:updown_price,
            updown_rate:updown_rate,
            updown_price_pm : updown_price_pm_replace,
            updown_rate_pm:updown_rate_pm_replace
        }
        
    }
    //코발트
    await page.goto('https://www.kores.net/komis/price/mineralprice/minormetals/pricetrend/minorMetals.do?mnrl_pc_mc_seq=543')
    
    for(let i=0; i<12;i++){
       eh = await page.$('table.tbls03 tbody  tr:nth-child('+(15+i)+')');
       // 데이 
       day = await eh.$eval('td.fst', function(el){
            return el.innerText
        })
        // 가격
        price = await eh.$eval('td:nth-child(2)', function(el){
            return el.innerText
        })
        // 등락가
        updown_price = await eh.$eval('td:nth-child(3) span', function(el){
            return el.innerText
        })
        // 등락율
        updown_rate = await eh.$eval('td:nth-child(4) span', function(el){
            return el.innerText
        })
        // 등락가 PM
        updown_price_pm = await eh.$eval('td:nth-child(3) span', function(el){
            return el.className
        })
        // 등락율 PM
        updown_rate_pm = await eh.$eval('td:nth-child(4) span', function(el){
            return el.className
        })
        var price_replace = price.replace(",", "")
        var updown_price_pm_replace = updown_price_pm.replace("up_down ", "")
        var updown_rate_pm_replace = updown_rate_pm.replace("up_down ", "")

        // 등락가 +,- 표시
        if (updown_price_pm_replace == "up"){
            updown_price_pm_replace = "+"
        }
        else {
            updown_price_pm_replace ="-"
        }

        // 등락율 +,- 표시
        if (updown_rate_pm_replace == "up"){
            updown_rate_pm_replace = "+"
        }
        else {
            updown_rate_pm_replace ="-"
        }

        

        obj_cobalt[i]={
            day:day,
            price:price_replace,
            updown_price:updown_price,
            updown_rate:updown_rate,
            updown_price_pm : updown_price_pm_replace,
            updown_rate_pm:updown_rate_pm_replace
        }
        
    }
    //마그네슘
    await page.goto('https://www.kores.net/komis/price/mineralprice/minormetals/pricetrend/minorMetals.do?mnrl_pc_mc_seq=536')
    
    for(let i=0; i<12;i++){
       eh = await page.$('table.tbls03 tbody  tr:nth-child('+(15+i)+')');
       // 데이 
       day = await eh.$eval('td.fst', function(el){
            return el.innerText
        })
        // 가격
        price = await eh.$eval('td:nth-child(2)', function(el){
            return el.innerText
        })
        // 등락가
        updown_price = await eh.$eval('td:nth-child(3) span', function(el){
            return el.innerText
        })
        // 등락율
        updown_rate = await eh.$eval('td:nth-child(4) span', function(el){
            return el.innerText
        })
        // 등락가 PM
        updown_price_pm = await eh.$eval('td:nth-child(3) span', function(el){
            return el.className
        })
        // 등락율 PM
        updown_rate_pm = await eh.$eval('td:nth-child(4) span', function(el){
            return el.className
        })
        var price_replace = price.replace(",", "")
        var updown_price_pm_replace = updown_price_pm.replace("up_down ", "")
        var updown_rate_pm_replace = updown_rate_pm.replace("up_down ", "")

        // 등락가 +,- 표시
        if (updown_price_pm_replace == "up"){
            updown_price_pm_replace = "+"
        }
        else {
            updown_price_pm_replace ="-"
        }

        // 등락율 +,- 표시
        if (updown_rate_pm_replace == "up"){
            updown_rate_pm_replace = "+"
        }
        else {
            updown_rate_pm_replace ="-"
        }

        

        obj_magnesium[i]={
            day:day,
            price:price_replace,
            updown_price:updown_price,
            updown_rate:updown_rate,
            updown_price_pm : updown_price_pm_replace,
            updown_rate_pm:updown_rate_pm_replace
        }
        
    }
    //알루미늄
    await page.goto('https://www.kores.net/komis/price/mineralprice/minormetals/pricetrend/minorMetals.do?mnrl_pc_mc_seq=496')
    
    for(let i=0; i<12;i++){
       eh = await page.$('table.tbls03 tbody  tr:nth-child('+(54+i)+')');
       // 데이 
       day = await eh.$eval('td.fst', function(el){
            return el.innerText
        })
        // 가격
        price = await eh.$eval('td:nth-child(2)', function(el){
            return el.innerText
        })
        // 등락가
        updown_price = await eh.$eval('td:nth-child(3) span', function(el){
            return el.innerText
        })
        // 등락율
        updown_rate = await eh.$eval('td:nth-child(4) span', function(el){
            return el.innerText
        })
        // 등락가 PM
        updown_price_pm = await eh.$eval('td:nth-child(3) span', function(el){
            return el.className
        })
        // 등락율 PM
        updown_rate_pm = await eh.$eval('td:nth-child(4) span', function(el){
            return el.className
        })
        var price_replace = price.replace(",", "")
        var updown_price_pm_replace = updown_price_pm.replace("up_down ", "")
        var updown_rate_pm_replace = updown_rate_pm.replace("up_down ", "")

        // 등락가 +,- 표시
        if (updown_price_pm_replace == "up"){
            updown_price_pm_replace = "+"
        }
        else {
            updown_price_pm_replace ="-"
        }

        // 등락율 +,- 표시
        if (updown_rate_pm_replace == "up"){
            updown_rate_pm_replace = "+"
        }
        else {
            updown_rate_pm_replace ="-"
        }

        

        obj_aluminium[i]={
            day:day,
            price:price_replace,
            updown_price:updown_price,
            updown_rate:updown_rate,
            updown_price_pm : updown_price_pm_replace,
            updown_rate_pm:updown_rate_pm_replace
        }
        
    }

    //리튬
    await page.goto('https://www.kores.net/komis/price/mineralprice/minormetals/pricetrend/minorMetals.do?mnrl_pc_mc_seq=516')
    for(var i=0; i<12;i++){
       eh = await page.$('table.tbls03 tbody tr:nth-child('+(i+53)+')');
        // 데이 
        day = await eh.$eval('td.fst', function(el){
        return el.innerText
        })
        // 가격
        price = await eh.$eval('td:nth-child(2)', function(el){
            return el.innerText
        })
        // 등락가
        updown_price = await eh.$eval('td:nth-child(3) span', function(el){
            return el.innerText
        })
        // 등락율
        updown_rate = await eh.$eval('td:nth-child(4) span', function(el){
            return el.innerText
        })
        // 등락가 PM
        updown_price_pm = await eh.$eval('td:nth-child(3) span', function(el){
            return el.className
        })
        // 등락율 PM
        updown_rate_pm = await eh.$eval('td:nth-child(4) span', function(el){
            return el.className
        })
        var price_replace = price.replace(",", "")
        var updown_price_pm_replace = updown_price_pm.replace("up_down ", "")
        var updown_rate_pm_replace = updown_rate_pm.replace("up_down ", "")

        if (updown_price_pm_replace == "up"){
            updown_price_pm_replace = "+"
        }
        else {
            updown_price_pm_replace ="-"
        }

        // 등락율 +,- 표시
        if (updown_rate_pm_replace == "up"){
            updown_rate_pm_replace = "+"
        }
        else {
            updown_rate_pm_replace ="-"
        }


        var price_replace=price.replace(",", "")
        obj_lithium[i]={
            day:day,
            price:price_replace,
            updown_price:updown_price,
            updown_rate:updown_rate,
            updown_price_pm : updown_price_pm_replace,
            updown_rate_pm:updown_rate_pm_replace
        }
    }
    
    //망간
    await page.goto('https://www.kores.net/komis/price/mineralprice/minormetals/pricetrend/minorMetals.do?mnrl_pc_mc_seq=534')
    for(var i=0; i<12;i++){
       eh = await page.$('table.tbls03 tbody tr:nth-child('+(i+15)+')');
        // 데이 
        day = await eh.$eval('td.fst', function(el){
            return el.innerText
            })
            // 가격
        price = await eh.$eval('td:nth-child(2)', function(el){
            return el.innerText
        })
        // 등락가
        updown_price = await eh.$eval('td:nth-child(3) span', function(el){
            return el.innerText
        })
        // 등락율
        updown_rate = await eh.$eval('td:nth-child(4) span', function(el){
            return el.innerText
        })
        // 등락가 PM
        updown_price_pm = await eh.$eval('td:nth-child(3) span', function(el){
            return el.className
        })
        // 등락율 PM
        updown_rate_pm = await eh.$eval('td:nth-child(4) span', function(el){
            return el.className
        })
        var price_replace = price.replace(",", "")
        var updown_price_pm_replace = updown_price_pm.replace("up_down ", "")
        var updown_rate_pm_replace = updown_rate_pm.replace("up_down ", "")

        if (updown_price_pm_replace == "up"){
            updown_price_pm_replace = "+"
        }
        else {
            updown_price_pm_replace ="-"
        }

        // 등락율 +,- 표시
        if (updown_rate_pm_replace == "up"){
            updown_rate_pm_replace = "+"
        }
        else {
            updown_rate_pm_replace ="-"
        }


        var price_replace=price.replace(",", "")
        obj_manganese[i]={
            day:day,
            price:price_replace,
            updown_price:updown_price,
            updown_rate:updown_rate,
            updown_price_pm : updown_price_pm_replace,
            updown_rate_pm:updown_rate_pm_replace
        }
    }

    //니켈
    await page.goto('https://www.kores.net/komis/price/mineralprice/the4thIndustry/pricetrend/coreMetals.do')
    for(var i=0; i<12;i++){
       eh = await page.$('table.tbls03 tbody tr:nth-child('+(i+54)+')');
        // 데이 
        day = await eh.$eval('td.fst', function(el){
            return el.innerText
            })
        // 가격
        price = await eh.$eval('td:nth-child(2)', function(el){
            return el.innerText
        })
        // 등락가
        updown_price = await eh.$eval('td:nth-child(3) span', function(el){
            return el.innerText
        })
        // 등락율
        updown_rate = await eh.$eval('td:nth-child(4) span', function(el){
            return el.innerText
        })
        // 등락가 PM
        updown_price_pm = await eh.$eval('td:nth-child(3) span', function(el){
            return el.className
        })
        // 등락율 PM
        updown_rate_pm = await eh.$eval('td:nth-child(4) span', function(el){
            return el.className
        })
        var price_replace = price.replace(",", "")
        var updown_price_pm_replace = updown_price_pm.replace("up_down ", "")
        var updown_rate_pm_replace = updown_rate_pm.replace("up_down ", "")

        if (updown_price_pm_replace == "up"){
            updown_price_pm_replace = "+"
        }
        else {
            updown_price_pm_replace ="-"
        }

        // 등락율 +,- 표시
        if (updown_rate_pm_replace == "up"){
            updown_rate_pm_replace = "+"
        }
        else {
            updown_rate_pm_replace ="-"
        }


        var price_replace=price.replace(",", "")
        obj_nickel[i]={
            day:day,
            price:price_replace,
            updown_price:updown_price,
            updown_rate:updown_rate,
            updown_price_pm : updown_price_pm_replace,
            updown_rate_pm:updown_rate_pm_replace
        }
    }

    obj={
        lithium:obj_lithium,
        nickel:obj_nickel,  //니켈
        cobalt:obj_cobalt,  //코발트
        manganese:obj_manganese,  //망간
        heoto:obj_heoto,  //희토류
        aluminium:obj_aluminium, //알루미늄
        magnesium:obj_magnesium,  //마그네슘
        news_bat:obj_news_bat, //배터리 뉴스
        news_mot:obj_news_mot, //모터 뉴스
        news_sas:obj_news_sas // 사시 뉴스
    }

    console.log(obj);
    res.render('main',{data:obj});

});
