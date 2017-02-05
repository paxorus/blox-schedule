/**
 * Holds the implementations of ScheduleView and Course, the app models.
 *
 * @author Prakhar Sahay 08/24/2014
 */

var ScheduleView = {

	/**
	 * GET a specific schedule by name from the cloud
	 */
	load: function (name) {
		$.ajax({
			url: "/schedule/" + name,
			method: "GET",
			success: function(data, status) {
				$("#text-input").val(data.schedule);
				$("title").text("::" + name + "::");
				localStorage.currentSchedule = name;
				ScheduleView.display(data.schedule);
			},
			error: Notifier.error
		});
	},

	/**
	 * Sets up content container with lines and times.
	 */
	setup: function () {
		$("#contain").html("");

		// adjust grey container, 25px padding

		// -50 for space, -16 for body, fixed as multiple of 8	
		var containWidth = Math.floor((window.innerWidth - 66) / 8) * 8;
		// -50 for space, -16 for body, -42 for header (16 times)
		var containHeight = Math.floor((window.innerHeight - 108) / 16) * 16 + 2;
		window.TIME_HEIGHT = (containHeight - 2) / 16 - 2;
		window.DAYS_WIDTH = containWidth / 8 - 20;
		window.DAYS_HEIGHT = 20;

		var contain = $("#contain");
		$("#containDays").width(containWidth);
		contain.width(containWidth);
		contain.height(containHeight);

		$(".days").width(window.DAYS_WIDTH);
		$(".days").height(window.DAYS_HEIGHT);

		// adjust line left and width
		var line = $("<div>", {class: "line", width: 7 / 8 * containWidth});
		line.css("left", containWidth / 8);

		var time = $("<div>", {class: "time"});
		time.height(window.TIME_HEIGHT);
		time.css("line-height", window.TIME_HEIGHT + "px");
		time.width(containWidth / 8);

		// add pairs of lineNode>line and timeNode>time

		var lineNode = $("<div>");
		lineNode.append(line.clone());

		var timeNode = $("<div>");

		for (var j = 0; j < 16; j ++) {
			var hourRange = (j + 8) % 12 + "-" + (j + 9) % 12;// "5-6"
			var newTime = time.clone();
			newTime.text(hourRange);
			var newTimeNode = timeNode.clone();
			newTimeNode.append(newTime);

			contain.append(lineNode.clone());
			contain.append(newTimeNode);
		}
		contain.append(lineNode.clone());
	},


	/**
	 * Convert provided data to blox (time span blocks) and plot on grid.
	 */
	display: function (scheduleData) {
		this.clear();

		// data -> blox
		var courses = scheduleData.split(",");

		courses.forEach(function (course) {// for each courseData string
			var data = course.split(";");
			var course = new Course(data[0], data[1], data[2], data[3]);

		    // customize newdiv with background-color, title, and opacity
		    var div = $("<div>", {class: "block"});
		    div.css("background-color", course.color);
		    if (course.place != "") {
			    div.attr("title", course.place);
			}
		    div.css("opacity", course.trans ? 0.5 : 1.0);

		    // for each time span, make block
		    course.times.forEach(function (timeSpan) {
		    	ScheduleView.plotDiv(div.clone(), timeSpan, course.name);
		    });
		});
	},

	// given styled div and "1~13~14" produce its block
	plotDiv: function (div, time, name) {
		div.text(name);

		var timeArr = time.split("~");// ["1","13","14"]
		var hours = parseFloat(timeArr[2]) - parseFloat(timeArr[1]);// 14-13

		div.width(window.DAYS_WIDTH);
		var height = (hours * (window.TIME_HEIGHT + 2) - 2) + "px";
		div.height(height);
		div.css("line-height", height);

		div.css("top", 2 + (window.TIME_HEIGHT + 2) * (parseFloat(timeArr[1]) - 8));
		div.css("left", (window.DAYS_WIDTH + 20) * (parseInt(timeArr[0], 10) + 1));// + 20 for padding

		$("#contain").append(div);
	},

	// clear current schedule
	clear: function () {
		$(".block").remove();
	}
}



function Course(name, color, timeString, place) {// four strings from split(';')
	this.trans = (name[0] == 'z');
	this.name = name.substring(this.trans);// set boolean .trans,set name 
    this.color = color;
    this.place = place;

    // expand times from "134(13~14),5(12.5~14)"
    var times = [];
    var timeStrings = timeString.split('+');// [134(13~14), 5(12.5~14)]

    timeStrings.forEach(function (time) {
    	var index = time.indexOf("(");
    	if (index >= 0) {// "134(13~14)"
		    var days = time.substring(0, index).split("");// "134"
		    var hours = time.substring(index + 1, time.length - 1);// "13~14"
		    days.forEach(function (day) {
				times.push(day + "~" + hours);
		    });
    	} else {// "1~3~4"
    		times.push(time);// single day
    	}
    });
    this.times = times;
}


/**
 * GET all schedule names from the cloud
 */
function loadOptions(data) {

	var names = data.map(function (obj) {
		return obj.name;
	});

	names.forEach(function (name) {
		var op = document.createElement("option");
		op.textContent = name;
		op.value = name;
		dropdown.append(op);
	});

	// TODO: remove this
	window.scheduleNames = names;

    // set default schedule if none
    var index = names.indexOf(localStorage.defaultSchedule);
    if (index >= 0) {
	    $("#dropdown").children()[index].selected = true;
    } else {
    	localStorage.defaultSchedule = names[0];
    }

    ScheduleView.load(localStorage.defaultSchedule);
}


var Notifier = {
	success: function (data) {
		Notifier.getNotification(data.message, "notification")
	},
	error: function (error) {
		var data = JSON.parse(error.responseText);
		Notifier.getNotification(data.message, "notification error");
	},
	getNotification: function (message, classNames) {
		var notification = $("<div>", {class: classNames})
		notification.text(message);
		$("body").append(notification);
		notification.css("margin-left", -notification.innerWidth() / 2);
		notification.fadeOut(5000);		
	}
};