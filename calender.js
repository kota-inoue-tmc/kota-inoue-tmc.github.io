'use strict'
// 1行目に記載している 'use strict' は削除しないでください

// 初期化
let date = new Date() //現在の日付を取得
let year = date.getFullYear(); //現在の年を取得
const weeks = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
let month = date.getMonth() + 1 ;


let startDate = new Date(year, month - 1, 1).getDate(); // 月の最初の日を取得
let endDate = new Date(year, month,  0).getDate(); // 月の末日
let startDay = new Date(year, month - 1, 1).getDay(); // 月の最初の日の曜日を取得
let calendarHtml = ''; // HTMLを組み立てる変数
let calendarTitle = '';
let rentalInfoHtml = '';
let periodDateHtml = `<td>カレンダーの日付をクリックしてください</td>`;

let rentalFirstYear = "****"
let rentalFinalYear = "****"

let rentalFirstDay = "**";
let rentalFinalDay = "**";
let rentalFirstMonth = "**";
let rentalFinalMonth = "**";
// main
let png;
let name;
// 以下、githubPages用
const carPicture = [
    {png: "Alphard.png",name: "Alphard"},
    {png: "Aqua.png",name: "Aqua"},
    {png: "bZ4X.png",name: "bZ4X"},
    {png: "C-HR.png",name: "C-HR"},
    {png: "Callora_axio.png",name: "CalloraAxio"},
    {png: "Callora_Cross.png",name: "CalloraCross"},
    {png: "Callora_Fielder.png",name: "CalloraFielder"},
    {png: "Callora_sport.png",name: "CalloraSport"},
    {png: "zelda_sord.jpg", name: "Master sord"}
]
// 以下、通常レポジトリ用
// const carPicture = [
//     {png: "./car_picture/Alphard.png",name: "Alphard"},
//     {png: "./car_picture/Aqua.png",name: "Aqua"},
//     {png: "./car_picture/bZ4X.png",name: "bZ4X"},
//     {png: "./car_picture/C-HR.png",name: "C-HR"},
//     {png: "./car_picture/Callora_axio.png",name: "CalloraAxio"},
//     {png: "./car_picture/Callora_Cross.png",name: "CalloraCross"},
//     {png: "./car_picture/Callora_Fielder.png",name: "CalloraFielder"},
//     {png: "./car_picture/Callora_sport.png",name: "CalloraSport"},
//     {png: "./car_picture/zelda_sord.jpg", name: "Master sord"}
// ]

let initRentalCarName = "車両を選択してください";
let rentalCarName = "";
let oldRentalCarName ="";

showCalendarTitle();
showCalendar();
showRentalInfo();
showCarList();
hilightRentalCar(initRentalCarName);

function monthYearCalc(prevnext){
    month = month + prevnext;
    if(month < 1){
        year -= 1;
        month = 12;
    }else if(month > 12){
        year += 1;
        month = 1;
    }
    // hilightRentalPeriod(); //表示月に借用期間がある場合はハイライト
}


function moveMonth(prevnext){
    monthYearCalc(prevnext);
    showCalendarTitle(); //カレンダーのタイトル更新
    showCalendar(); //カレンダー更新
    hilightRentalPeriod(2); //カレンダー更新された場合のハイライト
}

function showCalendarTitle(){
    calendarTitle = "";
    calendarTitle += '<button name ="prevMonth" class = "button" onclick="moveMonth(-1)">Prev</button>    ' //月前送りボタン
    calendarTitle += "      " + year  + '/' + month + "      " ; // 年月を記載
    calendarTitle += '<button name ="nextMonth" class = "button" onclick="moveMonth(1)">Next</button>' //月前送りボタン

    document.querySelector("#calendar-title").innerHTML = calendarTitle;
}

function showCalendar(){
    startDate = new Date(year, month - 1, 1).getDate(); // 月の最初の日を取得
    endDate = new Date(year, month,  0).getDate(); // 月の末日
    startDay = new Date(year, month - 1, 1).getDay(); // 月の最初の日の曜日を取得

    calendarHtml = '';
    calendarHtml += '<table>'; //カレンダー用のテーブルを導入

    // getDay()は日曜日スタート（0 = 日曜日）なので、月曜日スタートへ
    if (startDay === 0){
        startDay = 6;
    }else{
        startDay -= 1;
    }

    let dayCount = 1; // 日にちのカウント
    // 曜日の行を作成
    for (let i = 0; i < weeks.length; i++) {
        calendarHtml += '<th>' + weeks[i] + '</th>';
        // <td>は表データのセル要素。各セルに曜日を記載
    }

    for (let w = 0; w < 6; w++) {
        if( dayCount > endDate){
                // dayCountが月末日を超えたら何もしない
        }else{
            calendarHtml += '<tr>';
            for (let d = 0; d < 7; d++) {
                if (w == 0 && d < startDay) {
                    calendarHtml += '<td></td>'; // 1週目で1日の曜日の前
                } else if (dayCount > endDate) {
                    calendarHtml += '<td></td>'; // 末尾の日数を超えた
                } else {
                    calendarHtml += '<td>' + `<button name = "dayButton${dayCount}" class = "dayButton" onclick = chooseDays(${dayCount})>${dayCount}</button>` + '</td>';
                    dayCount++;
                }
            }
            calendarHtml += '</tr>';
        }
    }
    calendarHtml += '</table>';
    document.querySelector('#calendar').innerHTML = calendarHtml;
}

//カレンダーの日付をクリックされたら、借用日から返却日までをハイライトして、借用情報を更新する。
// 初回はクリック当日〜クリック当日を表示
//カレンダークリック一回目は
function chooseDays(day){
    if (rentalFirstDay === 0 && rentalFinalDay === 0){
        rentalFirstYear = year;
        rentalFirstMonth = month;
        rentalFirstDay = day; //1回目のクリック（＝借用最終日が入力されていない場合）は借用初日とする
        hilightRentalPeriod(1);
    }else if(rentalFirstDay !==0 
            && (rentalFinalDay === 0 ||rentalFinalDay === "**") 
            && (month > rentalFirstMonth 
            || (month === rentalFirstMonth && day >= rentalFirstDay))){ //2回目のクリック
        rentalFinalYear = year;
        rentalFinalMonth = month; //返却希望月を記録
        rentalFinalDay = day; //返却希望日を記録
        hilightRentalPeriod(2);
    }else{ //3回目のクリック　1回目のクリックと同様に借用日を設定、返却日はリセット
        rentalFirstYear = year;
        rentalFirstMonth = month;
        rentalFirstDay = day;
        rentalFinalYear = "****"
        rentalFinalMonth ="**";
        rentalFinalDay = "**";
        hilightRentalPeriod(1);
    }
    renewalRentalPeriod(rentalFirstYear, rentalFirstMonth, rentalFirstDay, rentalFinalYear, rentalFinalMonth, rentalFinalDay);
}

function hilightRentalPeriod(callNum){
    // input：hilightがコールされた要因：1；1回目の日付クリック,2：2回目の日付クリック,3：借用月変更
    //表示月の借用期間をハイライトする
    //コールされるタイミング：借用期間が明確になった場合、借用期間が不明確になった場合、表示月が変更された場合
    if(callNum === 1){ //借用開始日決定時はハイライトをリセットして、借用開始日のみハイライト
        ///ハイライト初期化
        for (let tempDay = startDate; tempDay <= endDate; tempDay++){
            document.getElementsByName(`dayButton${tempDay}`)[0].style.backgroundColor = ``;                        
        }
        document.getElementsByName(`dayButton${rentalFirstDay}`)[0].style.backgroundColor = `#03c3ee`; //getElementsByNameで取得できるのはNodeList. NodeList配列の0番目にpropertyが保存されている。
    }else if(callNum ===2){
        if(rentalFinalMonth > rentalFirstMonth){//返却月が借用月より大きい
            if(month === rentalFirstMonth){ //表示月が借用月
                for (let tempDay = rentalFirstDay; tempDay <= endDate; tempDay++){ //借用月は借用初日から月末日までハイライト
                    document.getElementsByName(`dayButton${tempDay}`)[0].style.backgroundColor = `#03c3ee`;
                }                    
            }else{
                if(month === rentalFinalMonth){  //表示月が返却月
                    for (let tempDay = startDate; tempDay <= rentalFinalDay; tempDay++){
                        document.getElementsByName(`dayButton${tempDay}`)[0].style.backgroundColor = `#03c3ee`;                        
                    }
                }else if(month > rentalFirstMonth && month < rentalFinalMonth){ //表示月が借用月と返却月の間
                    for (let tempDay = startDate; tempDay <= endDate; tempDay++){
                        document.getElementsByName(`dayButton${tempDay}`)[0].style.backgroundColor = `#03c3ee`;                        
                    }
                }

            }
        }else if(rentalFinalMonth === rentalFirstMonth){
            if(month === rentalFirstMonth){
                for (let tempDay = rentalFirstDay; tempDay <= rentalFinalDay; tempDay++){ //借用月は借用初日から月末日までハイライト
                    document.getElementsByName(`dayButton${tempDay}`)[0].style.backgroundColor = `#03c3ee`;
                }        
            }
        }
    }
}

// 借用期間の決定と表示
function renewalRentalPeriod(firstYear, firstMonth, firstDate, finalYear, finalMonth, finalDate){
    //借用期間入力
    periodDateHtml = `<td>${firstYear}/${firstMonth}/${firstDate}  ~  ${finalYear}/${finalMonth}/${finalDate}</td>`
    showRentalInfo();
}

//借用可能な車両リストを表示する
function showCarList(){
    let carListHtml = "";
    let i = 0;
    carListHtml += "<table>"
    for(const obj of carPicture){
        if(i === 0){ //表の始まり
            carListHtml += `<tr><td><button name = "carButton${obj.name}" class = "carButton" onclick = hilightRentalCar("${obj.name}")><img src=${obj.png} class = "carimg" id =${obj.name} /></button></td>`;
        }else if ((i + 1) % 3 === 0){ //次の行へ
            carListHtml += `<td><button name = "carButton${obj.name}" class = "carButton" onclick = hilightRentalCar("${obj.name}")><img src=${obj.png} class = "carimg" id =${obj.name} /></button></td></tr><tr>`;
        }else if((i + 1) === carPicture.length){ //最終行
            carListHtml += `<td><button name = "carButton${obj.name}" class = "carButton" onclick = hilightRentalCar("${obj.name}")><img src=${obj.png} class = "carimg" id =${obj.name} /></button></td></tr>`;
        }else{        
            carListHtml += `<td><button name = "carButton${obj.name}" class = "carButton" onclick = hilightRentalCar("${obj.name}")><img src=${obj.png} class = "carimg" id =${obj.name} /></button></td>`;
        }
        i++;
    }
    carListHtml += "</table>"
    document.querySelector("#carForm").innerHTML = carListHtml;
}
console.log(carPicture)

//引数＝クリックされた車両画像に設定された車両名

function hilightRentalCar(inputRentalCarName){
 
    if(inputRentalCarName === "車両を選択してください"){
        rentalCarName = inputRentalCarName;
        oldRentalCarName = rentalCarName;
    }else{
        //選択ハイライト初期化
        if(oldRentalCarName === "車両を選択してください"){

        }else {
            //ハイライト初期化
            document.getElementsByName(`carButton${oldRentalCarName}`)[0].style.backgroundColor = ``; 
        }
        //対象車両の名前を取得し、ハイライト化する
        rentalCarName = inputRentalCarName;
        document.getElementsByName(`carButton${rentalCarName}`)[0].style.backgroundColor = `#03c3ee`; 
        oldRentalCarName = rentalCarName;
    }
    //クリック → ハイライト　→ 情報更新
    showRentalInfo();
}


// Initialize and add the map
let map;

async function initMap() {
  // The location of Uluru
  const position = { lat: -25.344, lng: 131.031 };
  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerView } = await google.maps.importLibrary("marker");

  // The map, centered at Uluru
  map = new Map(document.getElementById("map"), {
    zoom: 4,
    center: position,
    // mapId: "DEMO_MAP_ID",
  });

  // The marker, positioned at Uluru
//   const marker = new AdvancedMarkerView({
//     map: map,
//     position: position,
//     title: "Uluru",
//   });
}

initMap();

function showRentalInfo(){
    //初期化
    let rentalInfoHtml = "";

    // 以下借用期間
    rentalInfoHtml += "<table><tr>"
    rentalInfoHtml += "<td>借用期間</td>"; 
    rentalInfoHtml += periodDateHtml + "</tr>";
    //以下借用車両
    rentalInfoHtml += "<tr>";
    rentalInfoHtml += "<td>レンタル車両</td>"; 
    rentalInfoHtml += "<td>" + rentalCarName + "</td>"; //引数入力がある時は借用期間を更新する
    rentalInfoHtml +="</tr>";
    rentalInfoHtml += "</table>";
    document.querySelector('#rentalInfo').innerHTML = rentalInfoHtml

}
