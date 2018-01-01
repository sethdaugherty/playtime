function millisToHoursMinutesAndSeconds(millis) {
	  var hours = Math.floor(millis / 3600000);
	  var minutes = Math.floor(millis / 60000);
	  var seconds = ((millis % 60000) / 1000).toFixed(0);
	  
	  if (seconds >= 60) {
		  minutes++;
		  seconds = 0;
	  }
	  if (minutes >= 60) {
		  hours++;
		  minutes = 0;
	  }
	  return  hours + ":" + (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function updateTimer(timestampAtLoad, millisAlreadySpentToday) {
	var nowTimestamp = Date.now();
	var elapsedMillis = nowTimestamp - timestampAtLoad;
	
	var totalMillis = elapsedMillis + millisAlreadySpentToday;
	
	var formattedTime = millisToHoursMinutesAndSeconds(totalMillis);
	$("#playTimer").text(formattedTime);
}

/*
 * Get current day in format YYYYMMDD.
 */
function getTodayString() {
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth() + 1;
	var year = date.getFullYear();
	return year + (month < 10 ? '0' : '') + month  + (day < 10 ? '0' : '') + day;
}

/**
 * Query the api to determine how many milliseconds we've already spent today 
 */
function getMillisAlreadySpentToday(callback) {	
	var today = getTodayString();
	console.log("today is", today);
	
	$.get( "https://sethdaugherty.io:9001/playtime/"+today, function( data ) {
	  console.log("got data!", data);
	  if (data.millisSpent) {
		  callback(data.millisSpent);
	  }
	  else {
		  callback(0);
	  }
	});
	
}

$(document).ready(function() {
	$("body").append("<div id=\"playTimer\"><span>Timer</span></div>");
	console.log("appended timer!");
	
	var timestampAtLoad = Date.now();
	getMillisAlreadySpentToday(function(millisAlreadySpentToday) {
		console.log("already spent", millisAlreadySpentToday);
		
		updateTimer(timestampAtLoad, millisAlreadySpentToday);
		var timeinterval = setInterval(function() {updateTimer(timestampAtLoad, millisAlreadySpentToday);},1000);
	});
	

});