// var blox;

function savify() {// 'Save to Cloud'
	var obj = queryResults[parseInt(dropdown.value, 10)];
	obj.set("schedule", textInput.value);
	obj.save();
}

function toggleDisplay(style){
	if (style.display == "block") {
		style.display = "none";
		edit.textContent = "Edit";
		decrypt();
	} else {
		style.display = "block";
		edit.textContent = "Done";
	}
}

/**
 * Convert data to blox (time span blocks) and plot on grid.
 *
 */

function decrypt() {
	// clear current schedule
	$(".block").remove();

	// data -> blox
	var courses = textInput.value.split(",");
	for (var i in courses) {// for each courseData string
		var data = courses[i].split(";");
		var course = new Class(data[0], data[1], data[2], data[3]);

	    // customize newdiv and then plot

	    var div = $("<div>", {class: "block"});
	    // set color
	    div.css("background-color", course.color);
	    if (course.place != "???") {
		    div.attr("title", course.place);
		}
		// set opacity
	    div.css("opacity", course.trans ? 0.5 : 1.0);

	    // for each time span, make block
	    for (var j in course.times) {
	    	plot(div.clone(), course.times[j], course.name);
	    }
	}
}

// given styled div and "1~13~14" produce its block
function plot(div, time_str, name){
	// var div = div_template.clone();
	div.text(name);

	var time_arr = time_str.split("~");// ["1","13","14"]
	var hours = parseFloat(time_arr[2]) - parseFloat(time_arr[1]);// 14-13

	div.width(window.DAYS_WIDTH);
	var height = (hours * (window.TIME_HEIGHT + 2) - 2) + "px";
	div.height(height);
	div.css("line-height", height);

	div.css("top", 2 + (window.TIME_HEIGHT + 2) * (parseFloat(time_arr[1]) - 8));
	div.css("left", (window.DAYS_WIDTH + 20) * (parseInt(time_arr[0], 10) + 1));// + 20 for padding

	$("#contain").append(div);
}

function Class(name, color, time_str, place){// four strings from split(';')
	this.trans = (name[0] == 'z');
	this.name = name.substring(this.trans);// set boolean .trans,set name 
    this.color = color;
    this.place = place;

    // expand times from "134(13~14),5(12.5~14)"
    this.times = [];
    var times = time_str.split('+');// [134(13~14), 5(12.5~14)]

    for (var i = 0; i < times.length; i ++){
    	var index = times[i].indexOf("(");
    	if (index > -1) {// multiday push
    		pushAllDays(this.times, times[i], index);
    	} else {
    		this.times.push(times[i]);// normal push
    	}
    }
}

function pushAllDays(array, multiday_str, index){
    var day_numbers = multiday_str.substring(0, index);// "134"
    var hours = multiday_str.substring(index + 1, multiday_str.length - 1);// "13~14"
    for (var i = 0; i < day_numbers.length; i ++) {
    	array.push(day_numbers[i] + "~" + hours);
    }
}

var schedNames;
function loadOptions(scheds) {
	schedNames = [];
	for (var k = 0; k < scheds.length; k ++){
		var op = document.createElement("option");
		schedNames.push(op.textContent=scheds[k].get("name"));
		op.value = k;
		dropdown.append(op);
	}

	var index;
	if ((index = localStorage.default) && schedNames.indexOf(index) >= 0) {
		index = schedNames.indexOf(index);
	} else {
		index = 0;
	}
	$("#textInput").val(scheds[index].get("schedule"));
	$("#dropdown").children()[index].selected = true;
	$("title").text("::" + scheds[index].get("name") + "::");
	decrypt();
}

function localStore() {// upon 'Make Default'
	var index = parseInt(dropdown.value, 10);
	localStorage.default = schedNames[index];
}

function deleteSchedule() {
	if (confirm("Are you sure?")) {
		var index = parseInt(dropdown.value,10);
		queryResults[index].destroy({
			success: function(obj) {
				location.reload();
			}
		});
	}
}

function cloneSchedule() {
	var bloxSchedule = new BloxSchedule();
	var name = prompt("Enter a name for the new schedule:");
	bloxSchedule.set("name", name);
	bloxSchedule.set("schedule", textInput.value);
	bloxSchedule.save({
		success: function(obj){
			location.reload();
		}
	});
}