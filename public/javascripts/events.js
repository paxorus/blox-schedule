/**
 * Prakhar Sahay 01/30/2017
 *
 * 
 */

// Make Default
$("#make-default").click(function () {
	localStorage.defaultSchedule = localStorage.currentSchedule;
});

// Save
$("#save").click(function () {
	$.ajax({
		url: "/schedule",
		method: "PUT",
		success: function(data, status) {
			console.log(data);
		},
		data: {
			name: localStorage.currentSchedule,
			schedule: $("#text-input").val(),
			username: localStorage.username,
			password: localStorage.password
		}
	});
});

// Edit
$("#edit").click(function () {
	if ($("#text-input").css("display") == "block") {
		$("#text-input").css("display", "none");
		$(this).text("Edit");
		decrypt();
	} else {
		$("#text-input").css("display", "block");
		$(this).text("Done");
	}
});

// Delete
$("#delete").click(function () {
	if (!confirm("Are you sure?")) {
		return;
	}

	$.ajax({
		url: "/schedule",
		method: "DELETE",
		success: function(data, status) {
			console.log(data);
			// location.reload();
		},
		data: {
			name: localStorage.currentSchedule,
			username: localStorage.username,
			password: localStorage.password
		}
	});
});

// Clone
$("#clone").click(function () {
	var name = prompt("Enter a name for the new schedule:");

	while (window.scheduleNames.indexOf(name) >= 0) {
		name = prompt("Name is taken. Please enter another name:");
	}

	$.ajax({
		url: "/schedule",
		method: "POST",
		success: function(data, status) {
			$("title").text("::" + name + "::");
			localStorage.currentSchedule = name;
			window.scheduleNames.push(name);
			// add option to dropdown
		},
		data: {
			name: name,
			schedule: $("#text-input").val(),
			username: localStorage.username,
			password: localStorage.password
		}
	});
});

/**
 * Switches schedules based on dropdown value
 */
$("#dropdown").change(function() {
	ScheduleView.load(event.target.value);
});

/**
 * TODO: reposition DOM elements instead of page reload
 */
$(window).resize(function () {
	ScheduleView.setup();
	ScheduleView.load(localStorage.currentSchedule);
});