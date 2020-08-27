// Hide ticket result
document.getElementById("form-results").style.display = "none";

// Add JS functions to button click
var ticket_submit = document.getElementById("ticketSubmit");
var ticket_again = document.getElementById("ticketAgain");
var ticket_download = document.getElementById("ticketDownload");
var map_download = document.getElementById("mapButton");


ticket_submit.addEventListener("click",
	function() {
		var isValid = validateForm();
		if (isValid) {
			formProcess();
		};
});

ticket_again.addEventListener("click",
	function() {
		resetForm();
});

ticket_download.addEventListener("click",
	function() {
		downloadImage();
});

map_download.addEventListener("click",
	function() {
		downloadFile("pics/map.png", "map.png");
});


function validateForm() {

	// Check text & date
	var myInput = document.getElementById("order-information");
	for (var i = 0; i < myInput.elements.length; i++) {
		if(myInput.elements[i].value === "") {
			alert("Error: Please fill in all the fields.");
			return false;
		}
	}

	// Check radio buttons
	var radio_button = document.getElementsByName("type");
	for (var i = 0; i < radio_button.length; i++) {
		if (radio_button[i].checked) {
			return true;
		}
	}

	alert("Error: Please select a ticket type");
	return false;
}

// Accepts a Javascript Date object and returns date in MM/DD/YY
function changeDateFormat(date_item) {
	var mm = date_item.getMonth() + 1;
	var dd = date_item.getDate() + 1;
	if (mm < 10) {
		mm = "0" + mm;
	}
	if (dd < 10) {
		dd = "0" + dd;
	}
	var yy = (date_item.getFullYear()).toString();
	yy = yy.slice(2,4);
	var new_date = mm + "/" + dd + "/" + yy;
	return new_date;
}

// Determines type of ticket entered
function getTicketType() {

	var entered_ticket;

	if (document.getElementById("childTicket").checked) {
		entered_ticket = "Child";
	}
	else if (document.getElementById("adultTicket").checked) {
		entered_ticket = "Adult";
	}
	else {
		entered_ticket = "Senior";
	}

	return entered_ticket;
};

// Displays ticket
function displayTicket(ticket_url) {
	document.getElementById("form-results").style.display = "";
	ticket_submit.style.display = "none";
	document.getElementById("image-result").src = ticket_url;
};

// Hides Ticket
function resetForm() {
	document.getElementById("form-results").style.display = "none";
	ticket_submit.style.display = "";
	document.getElementById("order-information").reset(); 
};

// Download Ticket
function downloadImage() {
	var link_url = document.getElementById("image-result").src;
	downloadFile(link_url, "ticket.jpg");
}

function downloadFile(file_url, file_name) {
	var xhr2 = new XMLHttpRequest();

	xhr2.open("GET", file_url, true);
	xhr2.responseType = "blob";
	xhr2.onload = function (event) {
		var blob = xhr2.response;
		var file_link = document.createElement("a");
		file_link.href=window.URL.createObjectURL(blob);
		file_link.download = file_name;
		file_link.click();
	}

	xhr2.send();
}

// Ticket POST request
function formProcess() {
	
	// Retrieve form data
	var first_name = document.getElementById("firstName").value;
	var last_name = document.getElementById("lastName").value;
	var full_name = first_name + " " + last_name;
	var ticket_type = getTicketType();

	// Format date to American format mm/dd/yy
	var visit_date_form = new Date(document.getElementById("visitDate").value);
	var visit_date = changeDateFormat(visit_date_form);

	/* Test print purposes */
	//console.log("Full Name: ", full_name);
	//console.log("Visit Date: ", visit_date);
	//console.log("Ticket Type: ", ticket_type);

	// Create Form Data
	var data = new FormData();

	data.append("template_id", "257198655");
	data.append("username", USER_NAME);
	data.append("password", PASS_WORD);

	// Text box 1: MARIONBERRY ZOO
	data.append("boxes[0][type]", "text");
	data.append("boxes[0][text]", "MARIONBERRY ZOO");
	data.append("boxes[0][x]", "10");
	data.append("boxes[0][y]", "27");
	data.append("boxes[0][width]", "1000");
	data.append("boxes[0][height]", "200");

	// Text box 2: Ticket Type
	data.append("boxes[1][type]", "text");
	data.append("boxes[1][text]", ticket_type);
	data.append("boxes[1][x]", "90");
	data.append("boxes[1][y]", "300");
	data.append("boxes[1][width]", "300");
	data.append("boxes[1][height]", "100");

	// Text box 3: "ADMIT ONE"
	data.append("boxes[2][type]", "text");
	data.append("boxes[2][text]", "ADMIT ONE");
	data.append("boxes[2][x]", "27");
	data.append("boxes[2][y]", "300");
	data.append("boxes[2][width]", "700");
	data.append("boxes[2][height]", "400");

	// Text box 4: Name
	data.append("boxes[3][type]", "text");
	data.append("boxes[3][text]", full_name);
	data.append("boxes[3][x]", "70");
	data.append("boxes[3][y]", "800");
	data.append("boxes[3][width]", "1500");
	data.append("boxes[3][height]", "200");

	// Text box 5: Date
	data.append("boxes[4][type]", "text");
	data.append("boxes[4][text]", visit_date);
	data.append("boxes[4][x]", "1500");
	data.append("boxes[4][y]", "27");
	data.append("boxes[4][width]", "300");
	data.append("boxes[4][height]", "70");

	// Test display results

	// Send data
	var xhr = new XMLHttpRequest();
	xhr.withCredentials = false;
	xhr.onreadystatechange = function() { 
			if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
		        var formResult = JSON.parse(this.responseText);
		        var result_url = formResult["data"]["url"];
		        displayTicket(result_url);
		    } 
	};
	xhr.open("POST", "https://api.imgflip.com/caption_image", true);
	xhr.send(data);

};

