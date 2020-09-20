var foodNames = []; // Food Names
var ings = {}; // Ingredients
var dirs = {}; // Directions
var images = []; // Food Images

$(document).ready(function() {
	loadData()
	getCard(false, "");
	homePage();
});

$(document).scroll(function() {
	// Change the navbar's background color when scrolling
	var $nav = $("#mainNavbar");
	$nav.toggleClass("scrolled", $(this).scrollTop() > $nav.height());
});

$("#homeButton").on("click", homePage);

$("#randomButton").on("click", function() {
	// Display the random page when random button clicked

	// Empty the random page
	if (!$("#randomPage").is(":empty")) {
		$("#randomPage").html("");
	}

	// Get a random card
	getCard(true, "");

	// Animation for the card
	anime({
		targets: "#random",
		translateY: [
		{ value: -25, duration: 100 },
		{ value: 10, duration: 50 },
		{ value: 0, duration: 300 }
		]
	});

	$("#front").hide();
	$("#recipes").hide();
	$("#search").hide();
	$("#random").show();
	$("#calendar").hide();

	click();
});

$("#calendarButton").on("click", function() {
	// Display the calendar page when calendar button clicked

	// Empty the calender page
	if (!$("#calenderPage").is(":empty")) {
		$("#calenderPage").html("");
		$("#monthHeader").html("");
	}

	// Display Calendar
	showCalendar();

	$("#front").hide();
	$("#recipes").hide();
	$("#search").hide();
	$("#random").hide();
	$("#calendar").fadeIn();

	$(".addButton").on("click", function() {
		// Add a button to display the user input when clicked
		var num = this.id.substring(this.id.length - 1);
		parseInt(num);

		var inputID = "input" + num;
		var inputText = document.getElementById(inputID).value;
		document.getElementById(inputID).value = "";

		buttonPressed(num, inputText, false, " ");
	});
});

$("#searchButton").on("click", function() {
	// Display the search page when search button clicked

	// Empty the search page
	if (!$("#searchPage").is(":empty")) {
		$("#searchPage").html("");
	}

	// Get the user input to display corresponding cards
	var t = $("#searchInput").val();
	$("#searchInput").val("");
	getCard(false, t);

	$("#front").hide();
	$("#recipes").hide();
	$("#search").fadeIn();
	$("#random").hide();
	$("#calendar").hide();

	click();
});

function loadData() {
	// Load the data by Papa.parse
	var foodData;
	Papa.parse(recipes, {
		complete: function(results) {
			// Get data from MommyData.js
			foodData = results.data;
		}
	});

	for (var i = 0; i < foodData.length; i++) {
		var fData = Object.values(foodData[i]);
		if (fData.length == 4) {
			// Get name
			foodNames.push(fData[0]);
			// Get ingredients
			ings["ing" + (i + 1)] = processData(fData[1]);
			// Get directions
			dirs["dir" + (i + 1)] = processData(fData[2]);
			// Get images
			images.push(fData[3]);
		}
	}
}

function processData(data) {
	var finalData = [];
	data = data.replace(/\s/g, " ");
	while (data.length > 0) {
		var num = data.indexOf(";"); 	// Each element is separated by a ";"
		finalData.push(data.substring(0, num));
		data = data.substring(num + 1);
	}
	return finalData;
}
function getCard(isRandom, inputText) {
	// Show the card of the food 

	var food = {};				// Store button id for the food as the key and an array of food name and image as value
	var isSearch = false;		// Determine whether or not the page is the Search page 
	
	if (inputText != ""){
		// The page is search page when there is input text
		isSearch = true; 				
	} 

	if (!isRandom && !isSearch) {
		// When the page is not a random page or a search page, display all the food cards
		for (var i = 0; i < foodNames.length; i++) {
			var name = "food" + i;
			food[name] = [foodNames[i], images[i]];
		}
	} else if (isRandom) {
		// When the page is a random page but not a search page, display a random food card
		var rand = Math.floor(Math.random() * foodNames.length);
		var name = "food" + rand;
		food[name] = [foodNames[rand], images[rand]];
	} else if(isSearch){
		// When the page is not a random page but a search page, display all the food cards that matches the input text
		for (var i = 0; i < foodNames.length; i++) {
			if (foodNames[i].toLowerCase().indexOf(inputText.toLowerCase()) != -1) {
				var name = "food" + i;
				food[name] = [foodNames[i], images[i]];
			}
		}
	}

	// Call the showCard function to display the cards
	showCard(food, isRandom, isSearch);
}

function showRecipe(num) {
	food = foodNames[num],
	ing = Object.values(ings)[num],
	dir = Object.values(dirs)[num];
	
	// Add header to indicate food
	var foodHeader = document.createElement("div");
	foodHeader.classList.add("d-flex");
	foodHeader.innerHTML = '<h1 class="">' + food + "</h1>";
	document.getElementById("recipesHeader").appendChild(foodHeader);

	// Add all the ingredients to a Bootstrap table
	for (var i = 0; i < ing.length; i++) {
		var a = ing[i];

		var tr = document.createElement("tr");

		var td = document.createElement("td");
		td.textContent = a;

		tr.appendChild(td);
		document.getElementById("ingredients").appendChild(tr);
	}

	// Add all the directions to a Bootstrap table
	for (var i = 0; i < dir.length; i++) {
		var d = dir[i];

		var tr = document.createElement("tr");

		var th = document.createElement("th");
		th.textContent = i + 1;

		var td = document.createElement("td");
		td.textContent = d;

		tr.appendChild(th);
		tr.appendChild(td);
		document.getElementById("directions").appendChild(tr);
	}
}

function showCard(food, isRandom, isSearch) {
	// Display specified cards
	for (var i = 0; i < Object.keys(food).length; i++) {
		var foodName = Object.values(food)[i][0];
		var imgName = Object.values(food)[i][1];

		var contain = document.createElement("div");
		contain.classList.add(
			"col-sm",
			"col-xl-4",
			"my-3",
			"d-flex",
			"justify-content-center"
		);

		var card = document.createElement("div");
		card.classList.add("card");

		var image = document.createElement("img");
		image.classList.add("card-img-top");
		image.src = imgName;

		var body = document.createElement("div");
		body.classList.add("card-body");
		body.innerHTML = '<h5 class="card-title">' + foodName + "</h5>";

		var button = document.createElement("a");
		button.classList.add("btn", "btn-primary", "info");
		button.id = Object.keys(food)[i];
		button.href = "#";
		button.textContent = "Recipe";

		contain.appendChild(card);
		card.appendChild(image);
		card.appendChild(body);
		body.appendChild(button);

		// Append the card to corresponding pages
		if (isSearch) {
			document.getElementById("searchPage").appendChild(contain);
		} else if (!isRandom) {
			document.getElementById("frontPage").appendChild(contain);
		} else {
			document.getElementById("randomPage").appendChild(contain);
		}
	}
}

function showCalendar() {
	// Display the calender page for the week
	var today = new Date(); // Get today's date
	var month = today.getMonth() + 1;
	var day = today.getDay();
	var date = today.getDate();
	var year = today.getFullYear();

	var monthDates = checkMonth(month, year);

	// Add header to display the month
	var months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
	];
	var monthTitle = document.createElement("div");
	monthTitle.classList.add("d-flex");
	monthTitle.innerHTML = '<h1 class="">' + months[month - 1] + "</h1>";
	document.getElementById("monthHeader").appendChild(monthTitle);

	var days = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
	];

	// Display all the days in cards
	for (i = 0; i < days.length; i++) {
		var cardDate = date + i - day;

		var contain = document.createElement("div");
		contain.classList.add(
			"col-sm",
			"col-xl-3",
			"my-3",
			"d-flex",
			"justify-content-center"
		);

		var card = document.createElement("div");
		card.classList.add("card");

		var header = document.createElement("div");
		header.classList.add("card-header");
		if (i == day) {
			// Indicate the current date
			header.style.backgroundColor = "#bf6560";
			header.style.color = "white";
		}
		header.innerHTML = '<h5 class="card-title pt-3">' + days[i] + "</h5>";

		var body = document.createElement("div");
		body.classList.add("card-body");
		body.id = "cal" + i;

		// Determine dates
		if (cardDate <= 0) {
			month -= 1;
			monthDates = checkMonth(month, year);
			date = monthDates + cardDate - i + day;
			cardDate = date + i - day;
		}

		if (cardDate > monthDates) {
			month += 1;
			var m = monthDates - date;
			date = 0;
			cardDate = date + i - day - m;
		}
		var title = document.createElement("card-title");
		title.textContent = month + "/" + cardDate;

		var plusButton = document.createElement("span");
		plusButton.classList.add("fas", "fa-plus", "float-right");
		plusButton.setAttribute("data-toggle", "collapse");
		plusButton.setAttribute("data-target", ".plus" + i);

		var plus = document.createElement("div");
		plus.classList.add("input-group", "mb-3", "collapse", "plus" + i);

		var inputText = document.createElement("input");
		inputText.classList.add("form-control");
		inputText.id = "input" + i;
		inputText.setAttribute("placeholder", "");

		var inputAppend = document.createElement("input-group-append");

		var inputButton = document.createElement("button");
		inputButton.classList.add("btn", "addButton");
		inputButton.id = "addButton" + i;
		inputButton.textContent = "add";

		contain.appendChild(card);
		card.appendChild(header);
		card.appendChild(body);
		body.appendChild(title);
		title.appendChild(plusButton);
		body.appendChild(plus);
		plus.appendChild(inputText);
		plus.appendChild(inputAppend);
		inputAppend.appendChild(inputButton);

		document.getElementById("calenderPage").appendChild(contain);
	}
}

function buttonPressed(num, val, isLoading, refId) {
	// Add the user's input as a button
	var button = document.createElement("button");
	button.classList.add("btn", "btn-block", "item");
	button.textContent = val;

	var deleteButton = document.createElement("span");
	deleteButton.classList.add("fas", "fa-minus", "float-right");
	deleteButton.id = refId;

	button.appendChild(deleteButton);
	document.getElementById("cal" + num).appendChild(button);

	$(".fa-minus").on("click", function() {
		$(this).parent().remove();
		event.stopPropagation();
	});

	$(".item").on("click", function() {
		// Go to search page when clicked

		// Empty the search page
		if (!$("#searchPage").is(":empty")) {
			$("#searchPage").html("");
		}

		// Get the button's text to display corresponding cards
		var t = $(this).text();
		getCard(false, t);

		$("#front").hide();
		$("#recipes").hide();
		$("#search").fadeIn();
		$("#random").hide();
		$("#calendar").hide();

		click();
	});
}

function checkMonth(mon, year) {
	if (mon <= 7) {
		if (mon % 2 == 0) {
			if (mon == 2) {
				if (year % 4 == 0) {
					return 29;
				} else {
					return 28;
				}
			}
			return 30;
		} else {
			return 31;
		}
	} else {
		if (mon % 2 == 0) {
			return 31;
		} else {
			return 30;
		}
	}
}

function homePage() {
	// Display the front page when home button clicked
	$("#front").show();
	$("#recipes").hide();
	$("#search").hide();
	$("#random").hide();
	$("#calendar").hide();

	click();

	// Reveal the front page's cards while scrolling
	ScrollReveal().reveal("#front .card", { delay: 200 });
}

function click() {
	// Display the corresponding recipe based on the button clicked
	$(".info").on("click", function() {
		if (!$("#ingredients").is(":empty")) {
			$("#ingredients").html("");
			$("#directions").html("");
			$("#recipesHeader").html("");
		}

		var num = this.id.substring(this.id.indexOf("food") + 4);
		parseInt(num);
		showRecipe(num);

		$("#front").hide();
		$("#recipes").slideDown();
		$("#search").hide();
		$("#random").hide();
		$("#calendar").hide();
	});
}
