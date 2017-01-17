/** Prakhar Sahay 08/24/2014

*/

/**
 * Switches schedules based on dropdown value
 */
$("#dropdown").change(function(ev){
	var obj = queryResults[ev.target.value];
	$("#textInput").val(obj.get("schedule"));
	$("title").text("::" + obj.get("name") + "::");
	decrypt();
});

/**
 * TODO: reposition DOM elements instead of page reload
 */
window.onresize=function(){
	location.reload();
};


/**
 * 
 */
function setup(){
	// adjust grey container, 25px padding
	var contain = $("#contain");

	// -50 for space, -16 for body, fixed as multiple of 8	
	var contain_width = Math.floor((window.innerWidth - 66) / 8) * 8;
	// -50 for space, -16 for body, -42 for header (16 times)
	var contain_height = Math.floor((window.innerHeight - 108) / 16) * 16 + 2;
	window.TIME_HEIGHT = (contain_height - 2) / 16 - 2;
	window.DAYS_WIDTH = contain_width / 8 - 20;
	window.DAYS_HEIGHT = 20;

	$("#containDays").width(contain_width);
	contain.width(contain_width);
	contain.height(contain_height);

	$(".days").width(window.DAYS_WIDTH);
	$(".days").height(window.DAYS_HEIGHT);

	// adjust line left and width
	var line = $("<div>", {class: "line", width: 7 / 8 * contain_width});
	line.css("left", contain_width / 8);

	var time = $("<div>", {class: "time"});
	time.height(window.TIME_HEIGHT);
	time.css("line-height", window.TIME_HEIGHT + "px");
	time.width(contain_width / 8);

	// add pairs of lineNode>line and timeNode>time

	var lineNode=$("<div>");
	lineNode.append(line.clone());

	var timeNode=$("<div>");

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
}
