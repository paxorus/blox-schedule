/**
 * Controllers for admin actions: Make Default, Save, Edit, Delete, Clone, switch schedules.
 *
 * @author Prakhar Sahay 01/30/2017
 */

// Make Default
$("#make-default").click(function () {
	localStorage.defaultSchedule = localStorage.currentSchedule;
});

// Save
$("#save").click(function () {
	$.ajax({
		url: "/admin/schedule",
		method: "PUT",
		success: Notifier.success,
		error: Notifier.error,
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
		ScheduleView.display($("#text-input").val());
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
		url: "/admin/schedule",
		method: "DELETE",
		success: Notifier.success,
		error: Notifier.error,
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

	if (name === "") {// user hit 'Cancel'
		return;
	}

	$.ajax({
		url: "/admin/schedule",
		method: "POST",
		success: function(data) {
			$("title").text("::" + name + "::");
			localStorage.currentSchedule = name;
			window.scheduleNames.push(name);
			// add option to dropdown
			Notifier.success(data);
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
