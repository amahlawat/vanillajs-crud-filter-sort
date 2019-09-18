var completedData = [];
var filteredData = [];
var dataName = 'completedData';

/* Arrow up is ascending and arrow down is descending */
window.onload = loadData;

function loadData(){
	fetch('https://fakerestapi.azurewebsites.net/api/Books')
	  .then(response => response.json())
	  .then(json => {
		  completedData = json;
		  filteredData = json;
		  addDataToDiv(completedData);
	  })
	  
	bindData(userData);
	dragAndDrop("draggable1");
	dragAndDrop("draggable2");
	dragAndDrop("draggable3");
	dragAndDrop("draggable4");
}

function addDataToDiv(data){
	let allTitles = '';
	for(let datum of data)
		allTitles += `<li>${datum.Title}</li>`;		
	
	document.getElementById('allTitles').innerHTML = allTitles;
}

function handleFilterClick(event){
	let value = event.target.value;
	value = value.trim();
	if(event.key === "Enter" && value !== ""){
		let id = event.target.id;
		id = id.trim();
//		console.log(value+' '+id)
		
		filteredData = completedData.filter(_ => { 
			if(id === "Title")	return _.Title === value
		});
//		console.log(filteredData)
		if(filteredData.length > 0){
			addDataToDiv(filteredData);
			dataName = 'filteredData';
		}
	}else{
		dataName = 'completedData';
		addDataToDiv(completedData);
	}
}

// sort function
function handleSort(event){
	let id = event.target.id+"Icon";
	let className = document.getElementById(id).className;	
//	console.log(className);
	if(className === "down"){
		document.getElementById(id).classList.remove("down"); 
		document.getElementById(id).classList.add("up"); 		
		// console.log('Decending Order:- '+dataName);
		let sortedData = dataName === 'filteredData' ? sort(filteredData, 'Title', 1): sort(completedData, 'Title', 1); 
		addDataToDiv(sortedData);
	}else{
		document.getElementById(id).classList.remove("up"); 
		document.getElementById(id).classList.add("down"); 			
		// console.log('Ascending Order:- ');
		let sortedData = dataName === 'filteredData' ? sort(filteredData, 'Title', 0): sort(completedData, 'Title', 0); 
		addDataToDiv(sortedData);
	}
}

function sort(items, property, direction) {

	function compare(a, b) {
	  if(!a[property] && !b[property]) {
		return 0;
	  } else if(a[property] && !b[property]) {
		return -1;
	  } else if(!a[property] && b[property]) {
		return 1;
	  } else {
		const value1 = a[property].toString().toUpperCase(); // ignore upper and lowercase
		const value2 = b[property].toString().toUpperCase(); // ignore upper and lowercase
		if (value1 < value2) {
		  return direction === 0 ? -1 : 1;
		} else if (value1 > value2) {
		  return direction === 0 ? 1 : -1;
		} else {
		  return 0;
		}
		
	  }
	}

	return items.sort(compare);
} 

/* CRUD Vanilla js*/
function userDataClickHandler(event){
	if(event.key === "Enter" && event.target.value !== ""){
		userData.push(event.target.value);	
		bindData(userData);
		document.getElementById('userInput').value = "";
	}
}
let userData = ["temp", "temp2"];
/* create data */
function bindData(data){
		let html = "";
		data.forEach((datum, index) => {
			let id = "list-data-"+index;
			html += `<li class="user-data-list" id=${id}>${datum}
						<button class="btn" onclick="removeData('${id}')"><i class="fa fa-trash"></i></button>
						<button class="btn" onclick="editData('${id}')"><i class="fa fa-edit"></i></button>
					</li>`;			
		})
		document.getElementById('userData').innerHTML = html;
}
/* delete data */
function removeData(id){
	let index = parseInt(id.replace('list-data-', ''));
	userData.splice(index, 1);
	bindData(userData);
}
/* edit particular row data */
function editData(id){
	let index = parseInt(id.replace('list-data-', ''));
	document.getElementById(id).innerHTML = `<input type="text" id=${id} onkeypress={updateData(event)} value=${userData[index]} />`
}
/* update particular row data */
function updateData(event){
	if(event.key === "Enter" && event.target.value !== ""){
		let index = parseInt(event.target.id.replace('list-data-', ''));
		userData[index] = event.target.value;
		bindData(userData);
	}
}
/* drag and drop*/
function dragAndDrop(id){
// GET ALL THE PLAYERS - DRAGGABLE AND DROP ZONES
  var draggable = document.getElementById(id),
      dropzones = document.getElementsByClassName("dropzone");

  // DRAG START - HIGHLIGHT DROP ZONES WITH CSS CLASS
  draggable.addEventListener("dragstart", function () {
    for (let i = 0; i < dropzones.length; i++) {
      dropzones[i].classList.add("active");
    }
  });

  // DRAG END - REMOVE ALL ADDED ACTIVE & OVER CSS CLASS
  draggable.addEventListener("dragend", function () {
    for (let i = 0; i < dropzones.length; i++) {
      dropzones[i].classList.remove("active");
      dropzones[i].classList.remove("over");
    }
  });

  // DRAG - AS YOU ARE DRAGGING
  draggable.addEventListener("drag", function () {
    // DO SOMETHING... IF YOU WANT
  });

  for (let i = 0; i < dropzones.length; i++) {
    // DRAG ENTER - HIGHLIGHT THIS ZONE
    dropzones[i].addEventListener("dragenter", function () {
      dropzones[i].classList.add("over");
    });

    // DRAG LEAVE - REMOVE HIGHLIGHT ON THIS ZONE
    dropzones[i].addEventListener("dragleave", function () {
      dropzones[i].classList.remove("over");
    });

    // DRAG OVER - PREVENT THE DEFAULT "DROP", SO WE CAN DO OUR OWN
    dropzones[i].addEventListener("dragover", function (evt) {
      evt.preventDefault();
    });

    // ON DROP - MOVE THE DRAGGABLE ELEMENT
    dropzones[i].addEventListener("drop", function (evt) {
      evt.preventDefault();
      // Will move the draggable element only if dropped into a different box
      if (evt.target != draggable.parentNode && evt.target != draggable) {
        draggable.parentNode.removeChild(draggable);
        evt.target.appendChild(draggable);
      }
    });
  }
}
