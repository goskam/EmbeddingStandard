const baseURL = "https://sup-w-002774.labs.microstrategy.com:8443/MicroStrategyLibraryStd";
const projectID = "B19DEDCC11D4E0EFC000EB9495D0F44F";
const loginMode = 1;


enum_pages = {
	login: 1,
    home : 2,
    subscriptions : 3,
	subscriptionsById: 4,
	projects: 5,
	schedules: 6,
	dossiers: 7,
	users: 8,
    logout: 9
}

enum_data = {
    subscriptions: 1,
    subscriptionsById: 2,
    projects: 3,
    schedules: 4,
    dossiers: 5,
    users: 6
}



//model
model = {
    authenticated: false,
    selectedPage: enum_pages.home,
    renderData: enum_data.users
}

data = {
    subscriptions: null,
};

//view

//------------------------------ RENDER ---------------------------------------//

function render() {
    switch (model.selectedPage) {
        case enum_pages.login:
            processLogin();
            break;
        case enum_pages.subscriptions:
            renderSubscriptionsPage();
            break;
        case enum_pages.subscriptionsById:
            renderSubscriptionsByIdPage();
            break;
        case enum_pages.projects:
            getListOfProjects();
            break;
        case enum_pages.schedules:
            renderSchedulesPage();
            break;
        case enum_pages.dossiers:
            renderDossiersPage();
            break;
        case enum_pages.users:
            renderCreateUsersPage();
            break;
        case enum_pages.logout:
            logout();
            break;
        default:
            renderHomePage();
            break;
    }
}

//------------------------------ ONLOAD ---------------------------------------//

window.onload=function(){
	const element = document.getElementById("login-btn");
	element.addEventListener("click", login);

    // element.addEventListener("keypress", function(event) {
    //     if (event.key === "Enter") {
    //       console.log("enter clicked");
    //     }
    //   });

  }

function activeMenuButtons(){

    const btn = document.querySelectorAll("a");

    btn.forEach(button => {
      button.addEventListener("click",()=> {
          btn.forEach(newbtn=>
              newbtn.classList.remove("active"));
              button.classList.add("active");
      })
    })
    }






//------------------------------ LOGIN FUNCTION ---------------------------------------//


function processLogin() {

	let username = document.getElementById("username").value;
	let password = document.getElementById("password").value;
    window.localStorage.setItem("username", username);


	var options = {
		method: 'post',
		credentials: 'include',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify
		 ({
		 	username: username,
			password: password,
			loginMode: loginMode
		 })
	};

	fetch(baseURL + "/api/auth/login", options)
  		.then(function(response) {
			if(response.ok) {
				const authToken = response.headers.get('x-mstr-authToken');
				window.localStorage.setItem("authToken", authToken);
				window.location.replace("http://localhost:8080/EmbeddingStandard/index.html");

			}
		  }).catch(function(error) { console.log(error) })

}


//------------------------------ UPDATE WHO IS LOGGED IN ---------------------------------------//

function updateUserInfo(){
    const username = window.localStorage.getItem("username");
	document.getElementById('whoIsLoggedIn').innerHTML += username;
}

//------------------------------ SUBSCRIPTIONS ---------------------------------------//

function renderSubscriptionsPage() {

    const token = window.localStorage.getItem("authToken");
    console.log(token);
    const options = {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'content-type': 'application/json',
            "accept": "application/json",
            "X-MSTR-AuthToken": token,
            "X-MSTR-ProjectID": projectID
        }
    }

    fetch(baseURL + "/api/subscriptions", options)
    //.then(response => response.text())
    .then(response => response.json())
    .then(response => {
        console.log(response)

        response = response.subscriptions.map(item => {
            return {
                name: item.name,
                id: item.id
            };
        });

        updateSubscriptionList(response);
        
        })
    .catch(error => console.log('error', error));


}


function updateSubscriptionList(response){
    let list = document.getElementById('firstContainer');
    let ul = document.createElement('ul');
    list.appendChild(ul);

    for (let i = 0; i < response.length; i++)  {
        let li = document.createElement("li");

        ul.appendChild(li);
        li.innerHTML = response[i].name + ": " + response[i].id;
        li.onclick = function() { 
            getSubscriptionById(response[i].id); 
        };

    }
}

function getSubscriptionById(subscriptionId){

    //let subscriptionId = "2C3AA229426C27D213687F959F514784";
    const token = window.localStorage.getItem("authToken");
    console.log(token);
    const options = {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'content-type': 'application/json',
            "accept": "application/json",
            "X-MSTR-AuthToken": token,
            "X-MSTR-ProjectID": projectID,
        }
    }

    fetch(baseURL + "/api/subscriptions/" + subscriptionId, options)
    //then(response => response.text())
    .then(response => response.json())
    .then(response => {
        console.log(response)

        window.sessionStorage.setItem("subDetails", response);

        let element = document.getElementById("secondContainer");

        let textedJson = JSON.stringify(response, undefined, 4);
        element.innerHTML = textedJson;



        //updateColumns(response);
        })
    .catch(error => console.log('error', error));
}



//------------------------------ PROJECTS ---------------------------------------//


function getListOfProjects() {


    const token = window.localStorage.getItem("authToken");
		const options = {
			method: 'GET',
			credentials: 'include',
			mode: 'cors',
			headers: {
				'content-type': 'application/json',
				"accept": "application/json",
				"X-MSTR-AuthToken": token,
			}
		}

		fetch(baseURL + "/api/projects", options)
		.then(response => response.json())
		.then(response => {
			console.log(response)

			response = response.map(item => {
				return {
					name: item.name,
					id: item.id
				};
			});

			updateProjects(response);
			})
		.catch(error => console.log('error', error));


}

function updateProjects(response){
    let list = document.getElementById('projectsContainer');
    let ul = document.createElement('ul');
    list.appendChild(ul);

    for (let i = 0; i < response.length; i++)  {
        let li = document.createElement("li");

        ul.appendChild(li);
        li.innerHTML = "-- " + response[i].name + ": " + response[i].id;
     

    }
}


//------------------------------ DOSSIERS ---------------------------------------//


function renderDossiersPage() {

    const token = window.localStorage.getItem("authToken");
    console.log(token);
    const options = {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'content-type': 'application/json',
            "accept": "application/json",
            "X-MSTR-AuthToken": token,
            "X-MSTR-ProjectID": projectID
        }
    }

    fetch(baseURL + "/api/dossiers", options)
    .then(response => response.json())
    .then(response => {
        console.log(response)

        response = response.result.map(item => {
            return {
                name: item.name,
                id: item.id
            };
        });


        //result.result.filter

        updateEmbeddingList(response);
        })
    .catch(error => console.log('error', error));
}

    function clearDivs() {
        document.getElementById("firstContainer").innerHTML = "";
        document.getElementById("secondContainer").innerHTML = "";

        
 

    }

    function updateEmbeddingList(response){
        clearDivs();


        let list = document.getElementById('firstContainer');
		let ul = document.createElement('ul');
		list.appendChild(ul);


		for (let i = 0; i < response.length; i++)  {
			let li = document.createElement("li");

			ul.appendChild(li);
			li.innerHTML = response[i].name;
            li.onclick = function() { 
                createDossierInstance(response[i].id); 
            };

		}
    }


//------------------------------ DOSSIERS FILTERS ---------------------------------------//

/* 
1. Create dossier instance and showDossier
2. Get definition of instance > what att/met are in filters
3. Get attribute elements of that filter /api/dossiers/{dossierId}/instances/{dossierInstanceId}/elements and create drop down
4. Apply filters on that dossier instance /api/dossiers/{dossierId}/instances/{instanceId}/filters
5. Refresh dossier
*/

// 1. Create dossier instance 

function createDossierInstance(dossierId) {

    console.log("dossierId ---------- " + dossierId);
    const token = window.localStorage.getItem("authToken");

    let options = {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'content-type': 'application/json',
            "accept": "application/json",
            "X-MSTR-AuthToken": token,
            "X-MSTR-ProjectID": projectID
        },
		body: JSON.stringify
		 ({
            persistViewState: true
		 })
    };

    fetch(baseURL + "/api/dossiers/" + dossierId + "/instances", options)
        .then(response => response.json())
        .then(response => {
            console.log(response)
            let dossierInstance = response;
            showDossier(dossierId, dossierInstance);

            let mid = response.mid;

            window.localStorage.setItem("mid", mid);
            window.localStorage.setItem("dossierId", dossierId);
            console.log("mid ------------- " + mid)

            getDossierInstanceDefinition(dossierId, mid);

          }).catch(function(error) { console.log(error) })
    }


    //SHOW DOSSIER INSTANCE

    function showDossier(dossierID, dossierInstance) {

        //var dossierID = document.getElementById("dossierID").value;
        var placeHolderDiv = document.getElementById("secondContainer");
        var dossierUrl = baseURL + '/app/' + projectID + '/' + dossierID;


        microstrategy.dossier.create({
        
          placeholder: placeHolderDiv,
          url: dossierUrl,
          instance: dossierInstance,
          //enableCustomAuthentication: true,
          enableResponsive: true,
          //customAuthenticationType: microstrategy.dossier.CustomAuthenticationType.AUTH_TOKEN,
          //getLoginToken: login,
          containerHeight: '1000px',
          //errorHandler: customErrorHandler
          navigationBar: {
            enabled: true,
            gotoLibrary: true,
            title: false,
            toc: true,
            reset: true,
            reprompt: true,
            share: true,
            comment: true,
            notification: true,
            filter: true,
            options: false,
            bookmark: true,
            edit: false,
          }

        }).then(function(dossier) {
          d = dossier;
          dossier.addCustomErrorHandler(function(error) {
            //Add custom logic here
            window.alert("Error after creating of dossier: " + error.message);
          });
        });
      }


// 2. Get definition of instance > what att/met are in filters
// get source.id (example Category id)


function getDossierInstanceDefinition(dossierId, mid) {

    const token = window.localStorage.getItem("authToken");
    console.log(token);
    const options = {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'content-type': 'application/json',
            "accept": "application/json",
            "X-MSTR-AuthToken": token,
            "X-MSTR-ProjectID": projectID
        }
    }

    fetch(baseURL + "/api/v2/dossiers/" + dossierId + "/instances/" + mid + "/definition", options)
    .then(response => response.json())
    .then(response => {
        console.log("getDossierInstanceDefinition response:" + response)
        console.log("filter attirbute id: " + response.chapters[0].filters[0].source.id)

        //DEMO 1 START - USE TO PRESENT WORKFLOW FOR SINGLE ATTRIBUTE ONLY - WORKING FINE ____________________________________________________________________________________

        let attributeKey = response.chapters[0].filters[0].key;
        let attributeName = response.chapters[0].filters[0].name;
        let attributeId = response.chapters[0].filters[0].source.id;
        getTargetElements(dossierId, mid, attributeId, attributeName);

        window.localStorage.setItem("attributeKey", attributeKey);

        //DEMO 1 END - USE TO PRESENT WORKFLOW FOR SINGLE ATTRIBUTE ONLY - WORKING FINE ____________________________________________________________________________________

        // var select = document.getElementById("filterBox");
        // var el = document.createElement("select"); not necessary?
        // el.textContent = attributeName;
        // el.value = attributeKey;
        // select.appendChild(el);

        //DEMO 2 START - USE TO PRESENT WORKFLOW FOR MULTIPLE ATTRIBUTE FILTERS - TESTING ____________________________________________________________________________________

        // let myDiv = document.getElementById("filterTesting");
        // myDiv.innerHTML = "";

        // for (i=0; i < response.chapters[0].filters.length; i++) {
        //     let attributeKey = response.chapters[0].filters[i].key;
        //     let attributeName = response.chapters[0].filters[i].name;
        //     let attributeId = response.chapters[0].filters[i].source.id;
        //     getTargetElements(dossierId, mid, attributeId, attributeName);

        // }

        //DEMO 2 END - USE TO PRESENT WORKFLOW FOR MULTIPLE ATTRIBUTE FILTERS - TESTING ____________________________________________________________________________________


        })
    .catch(error => console.log('error', error));
}

// 3. Get attribute elements of that filter /api/dossiers/{dossierId}/instances/{dossierInstanceId}/elements



function getTargetElements(dossierId, mid, targetObjectId, attributeName) {

    const token = window.localStorage.getItem("authToken");
    const options = {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'content-type': 'application/json',
            "accept": "application/json",
            "X-MSTR-AuthToken": token,
            "X-MSTR-ProjectID": projectID
        }
    }

    fetch(baseURL + "/api/dossiers/" + dossierId + "/instances/" + mid + "/elements?targetObjectId=" + targetObjectId + "&targetObjectType=attribute", options)
    .then(response => response.json())
    .then(response => {

        //DEMO 1 START - USE TO PRESENT WORKFLOW FOR SINGLE ATTRIBUTE ONLY - WORKING FINE ____________________________________________________________________________________

        //update name of the filter
        document.getElementById('filterName').innerHTML = attributeName;


        let select = document.getElementById('dropdown1');
        //make sure that content of drop down is cleared
        select.innerHTML = "";

        //add elements to drop down
        for (i=0; i< response.length; i++){
            let elementName = response[i].name;
            let elementId = response[i].id;

            //document.getElementById('dropdown1').getElementsByTagName('option')[i].innerHTML = elementName;

            //create elements in the drop down on the fly depending how many attribute elements attribute has
            let el = document.createElement("option");
            el.textContent = elementName;
            el.value = elementId;
            select.appendChild(el);
        }

        //DEMO 1 END - USE TO PRESENT WORKFLOW FOR SINGLE ATTRIBUTE ONLY - WORKING FINE ____________________________________________________________________________________

       // for (i = 0; i < filters.length; i++){

        // let selectorId = document.querySelectorAll('select')[i].id;
        // let elem = document.getElementById(selectorId);
        // elem.innerHTML = "";


        // }

        //DEMO 2 START - USE TO PRESENT WORKFLOW FOR MULTIPLE ATTRIBUTE FILTERS - TESTING ____________________________________________________________________________________
 
        // //create drop downs for each attribute filter
        // let myDiv = document.getElementById("filterTesting");
        // let dropD = document.createElement("select");
        // dropD.textContent = attributeName;
        // myDiv.appendChild(dropD);

        // //append elements to drop down
        // //dropD is currentdropdown

        //  for (i=0; i< response.length; i++){
        //     let elementName = response[i].name;
        //     let elementId = response[i].id;

        //     //create elements in the drop down on the fly depending how many attribute elements attribute has
        //     let el = document.createElement("option");
        //     el.textContent = elementName;
        //     el.value = elementId;
        //     dropD.appendChild(el);
        // }

        //DEMO 2 END - USE TO PRESENT WORKFLOW FOR MULTIPLE ATTRIBUTE FILTERS - TESTING ____________________________________________________________________________________


        })
    .catch(error => console.log('error', error));
}


// 4. /api/dossiers/{dossierId}/instances/{instanceId}/filters

function applyFilters(attributeElement) {


    console.log("Attribute element value " + attributeElement.value);
    let attributeKey = window.localStorage.getItem("attributeKey");
    console.log("attribute key: " + attributeKey);

    const token = window.localStorage.getItem("authToken");
    let mid = window.localStorage.getItem("mid");
    let dossierId = window.localStorage.getItem("dossierId");


    let options = {
        method: 'PUT',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'content-type': 'application/json',
            "accept": "application/json",
            "X-MSTR-AuthToken": token,
            "X-MSTR-ProjectID": projectID
        },
        body: JSON.stringify //to be updated
        (
            [
                {
                  "key": attributeKey, //id of attribute, example "W5003B79F82574133819D5515216C0AA0"
                  "selections": [
                    {
                      "id": attributeElement.value //id of attribute element, example: h35;8D679D4F11D3E4981000E787EC6DE8A4
                    }
                  ]
                }
              ]
        )
    };

    fetch(baseURL + "/api/dossiers/" + dossierId + "/instances/" + mid + "/filters", options)
    .then(function(response) {
        if(response.ok) {
            console.log('filters applied ***');
            //refresh the dossier
            //showDossier(dossierId, dossierInstance); ?

            refreshDossier(dossierId);
        }
      }).catch(function(error) { console.log(error) })


    }


// 5. Refresh the dossier just with dossierID


      function refreshDossier(dossierId) {

        var placeHolderDiv = document.getElementById("secondContainer");
        var dossierUrl = baseURL + '/app/' + projectID + '/' + dossierId;


        microstrategy.dossier.create({
          placeholder: placeHolderDiv,
          url: dossierUrl,
          //enableCustomAuthentication: true,
          enableResponsive: true,
          //customAuthenticationType: microstrategy.dossier.CustomAuthenticationType.AUTH_TOKEN,
          //getLoginToken: login,
          containerHeight: '1000px',
          //errorHandler: customErrorHandler
          navigationBar: {
            enabled: true,
            gotoLibrary: true,
            title: false,
            toc: true,
            reset: true,
            reprompt: true,
            share: true,
            comment: true,
            notification: true,
            filter: true,
            options: false,
            bookmark: true,
            edit: false,
          }
        }).then(function(dossier) {
          d = dossier;
          dossier.addCustomErrorHandler(function(error) {
            //Add custom logic here
            window.alert("Error after creating of dossier: " + error.message);
          });
        });
      }



//------------------------------ CREATE USER ---------------------------------------//


      function renderCreateUsersPage() {

        let inputBox1 = document.createElement("input");
		inputBox1.setAttribute('placeholder', 'username');
		inputBox1.setAttribute('id', 'newUsername');
        inputBox1.style.border = "thin dotted red";


		let inputBox2 = document.createElement("input");
		inputBox2.setAttribute('placeholder', 'password');
		inputBox2.setAttribute('id', 'newPassword');
        inputBox2.style.border = "thin dotted red";


		let inputBox3 = document.createElement("input");
		inputBox3.setAttribute('placeholder', 'full name');
		inputBox3.setAttribute('id', 'newFullName');
        inputBox3.style.border = "thin dotted red";



		let submitButton = document.createElement("button");
		let text = document.createTextNode("Create user");
		submitButton.appendChild(text);
        submitButton.style.border = "thin dotted red";


		let element = document.getElementById("firstContainer");
		element.appendChild(inputBox1);
		element.appendChild(inputBox2);	
		element.appendChild(inputBox3);	
		element.appendChild(submitButton);	

        



		submitButton.addEventListener("click", function() {


			let newUsername = document.getElementById("newUsername").value;
			let newPassword = document.getElementById("newPassword").value;
			let newFullName = document.getElementById("newFullName").value;

			console.log(newUsername);
			console.log(newPassword);
			console.log(newFullName);



			let raw = JSON.stringify({
				"username": newUsername,
				"password": newPassword,
				"fullName": newFullName,
				"memberships": ["5F3FAFE111D2D8CC6000CC8E67019608"]

		  });

			createUser(raw);
			
			});
    
    }

	function createUser(raw){

		const token = window.localStorage.getItem("authToken");
		const options = {
			method: 'POST',
			credentials: 'include',
			mode: 'cors',
			body: raw,
			headers: {
				'content-type': 'application/json',
				"accept": "application/json",
				"X-MSTR-AuthToken": token,

			}
		}

		fetch(baseURL + "/api/users", options)
		//.then(response => response.text())
		.then(response => response.json())
		.then(response => {
			console.log(response)

			let element = document.getElementById("secondContainer");
			element.innerHTML = "User " + response.name + " with id: " + response.id + " was created successfully.";

			})
		.catch(error => console.log('error', error));
	}

//------------------------------ LOGOUT ---------------------------------------//

	function logout() {

		const token = window.localStorage.getItem("authToken");

		let options = {
			method: 'POST',
			credentials: 'include',
			mode: 'cors',
			headers: {
				'content-type': 'application/json',
				"accept": "application/json",
				"X-MSTR-AuthToken": token,

			}
		};
	
		fetch(baseURL + "/api/auth/logout", options)
			  .then(function(response) {
				if(response.ok) {
					window.location.replace("http://localhost:8080/EmbeddingStandard/login.html");
					sessionStorage.clear();
					localStorage.clear();

				}
			  }).catch(function(error) { console.log(error) })
	
		}



//controller

function login() {
    model.selectedPage = enum_pages.login;
    render();	
}


function getSubscriptions() {
    clearDivs();
    model.selectedPage = enum_pages.subscriptions;
    render();
}



function loadProjects() {
    clearDivs();
    model.selectedPage = enum_pages.projects;
    render();
}

function getListOfSchedules() {
    clearDivs();
    model.selectedPage = enum_pages.schedules;
    render();
}

function getListOfDossiers() {
    clearDivs();
    model.selectedPage = enum_pages.dossiers;
    render();
}

function createUserSubPage() {
    clearDivs();
    model.selectedPage = enum_pages.users;
    render();
}

function logoutUser() {
    model.selectedPage = enum_pages.logout;
    render();
}
//prompty w embedowanym dossierze, drop down z filtrami/promptami
//dossier z filtrem
//przekaz funkcje jako parametr
//funkcja map, filter, reduce - higher order functions
//github
//flex


// drop down menu
// var select = document.getElementById("selectNumber");
  
// for(var i = 0; i < response.length; i++) {
//     var opt = response[i].name;
//     var el = document.createElement("option");
//     el.textContent = opt;
//     el.value = opt;
//     select.appendChild(el);
//     el.onclick = function() { 
//         showDossier(response[i].id); 
//     };
// }

//James Q Quick array map





// async-await method



// async function getTargetElementsAwait(dossierId, mid, targetObjectId) {

//     const token = window.localStorage.getItem("authToken");
//     console.log(token);
//     const options = {
//         method: 'GET',
//         credentials: 'include',
//         mode: 'cors',
//         headers: {
//             'content-type': 'application/json',
//             "accept": "application/json",
//             "X-MSTR-AuthToken": token,
//             "X-MSTR-ProjectID": projectID
//         }
//     }

//     const response = await fetch(baseURL + "/api/dossiers/" + dossierId + "/instances/" + mid + "/elements?targetObjectId=" + targetObjectId + "&targetObjectType=attribute", options);
//     const elements = await response.json();
//     console.log(elements);
//     //how to catch with async-await


//     // .then(response => response.json())
//     // .then(response => {
//     //     //console.log("getTargetElements response: " + response)
//     //     //response[i].name & response[i].id

//     //     for (i=0; i< response.length; i++){
//     //         console.log("attribute element name: " + response[i].name + ", id: " + response[i].id);

//     //     }


//     //     })
//     // .catch(error => console.log('error', error));
// }