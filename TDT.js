flag = 0,m = 0,csv_text = '';

function loadTextFile(){
	httpObj = createXMLHttpRequest(displayData);
	if (httpObj){
		httpObj.open("GET","TDT.csv",true);
		httpObj.send(null);
	}
}

//WebKit（KHTML）におけるXMLHttpRequestのresponceText文字化け防止処理
var ajax_filter = function(t){return t};
if(navigator.appVersion.indexOf( "KHTML" ) > -1){
    ajax_filter = function(t){
        var esc = escape(t);
        return(esc.indexOf("%u") < 0 && esc.indexOf("%") > -1) ? decodeURIComponent(esc) : t
    }
}
 
function displayData(){
    if ((httpObj.readyState == 4) && (httpObj.status == 200)){
        csv_text = ajax_filter(httpObj.responseText);
        main(csv_text);
    }
}

function delay(){
	var departure = setup(csv_text);
	disp(departure);
}

function main(csv){
	var arrayed_csv = setup(csv);
		departure = arrayed_csv.split(',');
		for(var i = 0;i < 3;i++){
			departure[i] = Number(departure[i]);
		}
	// setup(csv);
	// disp(departure);
	// setInterval('disp',1000,departure);
	// while(1){
			// setTimeout('disp',1000);
			// disp(departure);
	var repeat = setInterval(function(departure) {
		// var departure = setup(csv_text);
	var arrayed_csv = setup(csv);
		departure = arrayed_csv.split(',');
		for(var i = 0;i < 3;i++){
			departure[i] = Number(departure[i]);
		}
		console.log(departure);
		disp(departure);

	    //終了条件
	  //   if (flag === 1){
	  //   	m++;
			// var departure = setup(csv_text);
	  //   	flag = 0;
	  //   }
	}, 1000,departure);
	// }

}

function setup(csv){//次回の発車時刻を特定しdepartureに代入

		var arrayed_csv = csv.split('\n');

		if(flag === 0){	

			var time = new Date();
			var hour = time.getHours();
			var	minute = time.getMinutes();
			var second = time.getSeconds();

			var l = 0;
			var min_hour,min_minute,min_second;
			min_hour = 23;min_minute = min_second = 59;

			for(var j = 0;j < arrayed_csv.length;j++){
				var dif = Number(arrayed_csv[j].substring(0,2)) - hour;

				if(dif < 0){//発車時刻が過ぎていたら回避
					continue;
				}
				if(min_hour > dif){
					min_hour = dif;
					l = j;
				}
			}
			for(var j = l;j < arrayed_csv.length;j++){
				var minute = time.getMinutes();
				var dif = Number(arrayed_csv[j].substring(3,5)) - minute;

				if((arrayed_csv[l].substring(0,2)) < (arrayed_csv[j].substring(0,2))) break;

				if(dif < 0)//発車時刻が過ぎていたら回避
					continue;
				if(min_minute > dif){
					min_minute = dif;
					m = j;
				}
			}
		}

		return arrayed_csv[m];
		// var departure = arrayed_csv[m].split(',');
		// for(var i = 0;i < 3;i++){
		// 	departure[i] = Number(departure[i]);
		// }
		// console.log(departure[0],departure[1],departure[2]);
		// return departure[0],departure[1],departure[2];
		
}

function disp(departure){
	var time = new Date();
	var hour = time.getHours();
	var minute = time.getMinutes();
	var second = time.getSeconds();
	var hour_dif = Number(departure[0]) - hour,
		minute_dif = Number(departure[1]) - minute - 1,
		second_dif = 60 + (Number(departure[2]) - second);

	var	text = document.getElementById("TDT"),
		time_dif = hour_dif + ":" + minute_dif + ":" + second_dif;
	
		text.innerHTML = time_dif;
		console.log(departure);

	// if((Number(departure[0]) == hour) && (Number(departure[1]) == minute) && (Number(departure[2]) == second))
	if(departure[2] < 59)
		flag = 1;
}