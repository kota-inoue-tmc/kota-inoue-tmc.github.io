'use strict'
// 1行目に記載している 'use strict' は削除しないでください

// 初期化
let date = new Date() //現在の日付を取得
let year = date.getFullYear(); //現在の年を取得
const weeks = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
let month = date.getMonth() + 1 ;


let startDate = new Date(year, month - 1, 1); // 月の最初の日を取得
let endDate = new Date(year, month,  0); // 月の最後の日を取得
let endDayCount = endDate.getDate(); // 月の末日
let startDay = startDate.getDay(); // 月の最初の日の曜日を取得
let calendarHtml = ''; // HTMLを組み立てる変数
let periodHtml = '';
let periodDateHtml = `借用期間 = ****/**/**  ~  ****/**/**`;
let rentalFirstDay = 0;
let rentalFinalDay = 0;
// main

initcalendar();
showCalendar();
showrentalperiod(periodDateHtml);

function monthYearCalc(prevnext){
    month = month + prevnext;
    if(month < 1){
        year -= 1;
        month = 12;
    }else if(month > 12){
        year += 1;
        month = 1;
    }
    // initcalendar();
    // showCalendar();
}

// カレンダーの初期表示
function initcalendar(){
    calendarHtml = '';
    calendarHtml += '<div><h1>'
    calendarHtml += '<button name ="prevMonth" class = "button" onclick="moveMonth(-1)">Prev</button>' //月前送りボタン
    calendarHtml += "  " + year  + '/' + month + "  " ; // 年月を記載
    calendarHtml += '<button name ="nextMonth" class = "button" onclick="moveMonth(1)">Next</button>' //月前送りボタン
    calendarHtml += '</h1></div>'

    calendarHtml += '<table align = "center" class = "calendar">'; //カレンダー用のテーブルを導入
}

function moveMonth(prevnext){
    // month = month + prevnext;
    monthYearCalc(prevnext);
    initcalendar();
    showCalendar();
    return month;
}


function showCalendar(){
    startDate = new Date(year, month - 1, 1); // 月の最初の日を取得
    // console.log(startDate);
    endDate = new Date(year, month,  0); // 月の最後の日を取得
    endDayCount = endDate.getDate(); // 月の末日
    startDay = startDate.getDay(); // 月の最初の日の曜日を取得
    
    // getDay()は日曜日スタート（0 = 日曜日）なので、月曜日スタートへ
    if (startDay === 0){
        startDay = 6;
    }else{
        startDay -= 1;
    }
    // console.log(startDay);

    let dayCount = 1; // 日にちのカウント
    // 曜日の行を作成
    for (let i = 0; i < weeks.length; i++) {
        calendarHtml += '<th>' + weeks[i] + '</th>';
        // <td>は表データのセル要素。各セルに曜日を記載
    }

    for (let w = 0; w < 6; w++) {
        if( dayCount > endDayCount){
                // dayCountが月末日を超えたら何もしない
        }else{
            calendarHtml += '<tr>';

            for (let d = 0; d < 7; d++) {
                if (w == 0 && d < startDay) {
                    // 1週目で1日の曜日の前
                    calendarHtml += '<td></td>';
                } else if (dayCount > endDayCount) {
                    // 末尾の日数を超えた
                    calendarHtml += '<td></td>';
                } else {
                    calendarHtml += '<td>' + `<button name = "dayButton" class = "dayButton" onclick = chooseDays(${dayCount})>${dayCount}</button>` + '</td>';
                    dayCount++;
                }
            }
            calendarHtml += '</tr>';
        }
    }
    calendarHtml += '</table>';
    calendarHtml += '</div>';

    document.querySelector('#calendar').innerHTML = calendarHtml;

}



function chooseDays(day){

    if (rentalFirstDay === 0 && rentalFinalDay === 0){
        rentalFirstDay = day; //1回目のクリック（＝借用最終日が入力されていない場合）は借用初日とする
    }else if(rentalFirstDay !==0 && rentalFinalDay === 0){
        rentalFinalDay = day;
    }else{
        rentalFirstDay = 0;
        rentalFinalDay = 0;
    }
    renewalRentalPeriod(rentalFirstDay, rentalFinalDay);
}

// 借用期間の決定と表示
function renewalRentalPeriod(FirstDay, FinalDay){
    periodHtml += "<div>" //div追加
    //
    periodDateHtml = `借用期間 = ${year}/${month}/${FirstDay}  ~  ${year}/${month}/${FinalDay}`
    showrentalperiod(periodDateHtml);
}

function showrentalperiod(inputPeriodDateHtml){
    let periodHtml = "";
    periodHtml += "<div>" //div追加
    //
    // 以下、借用期間の表示
    periodHtml += "<h2>"
    periodDateHtml = inputPeriodDateHtml; //引数入力がある時は借用期間を更新する
    periodHtml += periodDateHtml;
    periodHtml += "</h2>"

    periodHtml += "</div>" //div終了
    document.querySelector('#periodForm').innerHTML = periodHtml
}

function showUserInfo(userCode){
    
}
