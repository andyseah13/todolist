var categoryTabs;
var categoryContent;

window.onload = function () {
	// categoryTabs = document.getElementById("sidebar").getElementsByTagName("li");
	categoryTabs = document.getElementsByClassName("side"); // categoryTabs has one more element than categoryContent
	categoryContent = document.getElementById("categoryContent").getElementsByTagName("div");
}

function openCategory(category) {
	// console.log(category)
	// console.log(categoryTabs.length)
	if (category === "All") { 
		categoryTabs[0].classList.add("active");
	} else {
		categoryTabs[0].classList.remove("active");
	}
	for (var i = 0; i < categoryContent.length; i++ ) {
		if (category === "All") {
			categoryTabs[i+1].classList.remove("active");
			categoryContent[i].style.display = "block";
		} else if (categoryTabs[i+1].id === 'tab'.concat(category)) {
			categoryTabs[i+1].classList.add("active");
			categoryContent[i].style.display = "block";
			console.log("matched: " + category);
		} else {
			categoryTabs[i+1].classList.remove("active");
			categoryContent[i].style.display = "none";
			console.log("not matched: " + category);
		}
	}
}

function addCategory() {
	var popup = document.getElementById("newCategory");
	popup.style.display = "block";
}

function showCategories() {
	var dropDown = document.getElementById("categoryDropDown");
	var dropDownBox = document.getElementById("newDropDownBox");

	if (dropDownBox.style.display === "block") {
		dropDownBox.style.display = "none";
		dropDown.style.border = "none";
	} else {
		dropDownBox.style.display = "block";
		dropDown.style.border = "1px solid rgba(50, 152, 207, 0.4)";
	}
}

function selectCategory(category) {
	var selected = document.getElementById("selectedCategory");
	selected.innerHTML = category;
	var dropDown = document.getElementById("categoryDropDown");
	var dropDownBox = document.getElementById("newDropDownBox");
	dropDownBox.style.display = "none";
	dropDown.style.border = "none";
	$('#taskCategory').val(category);
}

// window.onclick = function(event) {
	// probably use class 
// }

// $(function() {
$('form#newTask').on('submit', function(e) {
	// console.log("Hello")
	var formInput = $("#newTask").serializeArray();
	console.log(formInput);
	var postData = {};
	for (var i = 0; i < formInput.length; i++) {
		postData[formInput[i].name] = formInput[i].value;
	}
	postData['csrfmiddlewaretoken'] = ctoken;
	console.log(postData);
    $.ajax({
      method: "POST",
      url: taskPath,
      data: postData,
      success: function(data) {
      	// reload task lists
      	// $('#listNames').load("/tasklist");
        var newTask = document.createElement("li");
        var name = data.category + data['title'];
        newTask.innerHTML =  '<input type="checkbox" id="' + name + '" name="'+ name + '"><label for="' + name + '"></label> ';
        newTask.innerHTML += data['title'];
        newTask.className += "task";
        var divId = "category" + data.category
        var parentDiv =  document.getElementById(divId);
        var index = parentDiv.children.length-1;
        parentDiv.insertBefore(newTask, parentDiv.children[index])

        // clear form input after submitting
        var form = document.getElementById("newTask");
        form.reset();
        var selected = document.getElementById("selectedCategory");
		selected.innerHTML = "List&nbsp;&nbsp;";
      }, 
      error: function(request) {
      	console.log(request.responseText)
      }
    })
    e.preventDefault();
});


$('form#newList').on('submit', function(e) {
	// console.log("Hello")
	var formInput = $("#newList").serializeArray()[0];
	console.log(formInput);
	var postData = {};
	// postData[formInput[]]
	postData[formInput.name] = formInput.value
	postData['csrfmiddlewaretoken'] = ctoken;
    $.ajax({
      method: "POST",
      url: listPath,
      data: postData,
      success: function(data) {
      	// close popup window
      	var popup = document.getElementById("newCategory");
		popup.style.display = "none";

		// add new list on sidebar
		var newCategory = document.createElement("li");
		newCategory.setAttribute("class", "side");
		var newId = "tab" + data['name'];
		newCategory.setAttribute("id", newId);
		newCategory.innerHTML = "<a onclick=\"openCategory(" + data['name'] + ")\">" + data['name'] + "</a>";
		var parentDiv =  document.getElementById("listTabs");
        var index = parentDiv.children.length-1;
        parentDiv.insertBefore(newCategory, parentDiv.children[index])

        //add list content
        // var divId = "category" + data.category
        var newList = document.createElement("div");
        newList.setAttribute("id", "category" + data['name']);
        newList.innerHTML =  "<h1>" + data['name'] + "</h1><br>";
        var parentDiv =  document.getElementById("listNames");
        parentDiv.appendChild(newList);

        openCategory(data['name']);

      }, 
      error: function(request) {
      	console.log(request.responseText);
      }
    });
    e.preventDefault();
});

$('.close').on('click',function(e) {
	var popup = document.getElementById("newCategory");
	popup.style.display = "none";
});

$('.ellipsis').on('click', function(e) {
	console.log("here")
	var dropDown = document.getElementById('dd'+e.target.id);
	if (dropDown.style.display === "block") {
		dropDown.style.display = "none";
		e.target.classList.remove("active");
	} else {
		dropDown.style.display = "block";
		e.target.classList.add("active");
	}
});

$(".dropDownItem").on("click", function(e) {
	var deleteId = e.target.parentElement.parentElement.parentElement.id.substring(6);
	// deleteData['csrfmiddlewaretoken'] = ctoken;
	$.ajax({
		method: "DELETE",
		url: "delete_task/" + deleteId,
		// data: deleteData,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("X-CSRFToken", ctoken);
		},
		success: function(data) {
			console.log(data["deleted"]);
			var elem = document.getElementById("taskDiv" + deleteId);
			elem.parentNode.removeChild(elem);
			// $('#listNames').load("/tasklist");
		},
		error: function(request) {
			console.log(request.responseText);
		},
	});
	e.preventDefault();
});

// #('.drop')





// });

// function submitTask() {
// 	var newTask = $("#newTask").serialize();
// 	console.log(newTask)
// 	var elem = document.createElement("P")
// 	elem.innerHTML = "adsfa";
// 	document.getElementById("categoryContent").appendChild(elem);




// }