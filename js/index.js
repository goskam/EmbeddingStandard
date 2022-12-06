const baseURL = "https://sup-w-002774.labs.microstrategy.com:8443/MicroStrategyLibraryStd";
const projectID = "B19DEDCC11D4E0EFC000EB9495D0F44F";
const loginMode = 1;

window.onload=function(){
	const element = document.getElementById("login-btn");
	element.addEventListener("click", login);
  }

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
    //embedowanie dossiera
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
    let list = document.getElementById('container');
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

        let element = document.getElementById("placeholderContent");

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
        document.getElementById("container").innerHTML = "";
        document.getElementById("embeddedContainer").innerHTML = "";

        
 

    }

    function updateEmbeddingList(response){
        let list = document.getElementById('container');
		let ul = document.createElement('ul');
		list.appendChild(ul);

		for (let i = 0; i < response.length; i++)  {
			let li = document.createElement("li");

			ul.appendChild(li);
			li.innerHTML = response[i].name;
            li.onclick = function() { 
                showDossier(response[i].id); 
            };

		}

        
    }

    function showDossier(dossierID) {

        //var dossierID = document.getElementById("dossierID").value;
        var placeHolderDiv = document.getElementById("embeddedContainer");
        var dossierUrl = baseURL + '/app/' + projectID + '/' + dossierID;
        

          //----------------TESTING FILTERS--------------------//

        elem = document.getElementById("att");
        let attributeName = elem.innerHTML;
        console.log(attributeName);

        filter = document.getElementById('categoryDropdown').value
        console.log(filter);

        microstrategy.dossier.create({
          placeholder: placeHolderDiv,
          url: dossierUrl,
          //enableCustomAuthentication: true,
          enableResponsive: true,
          //customAuthenticationType: microstrategy.dossier.CustomAuthenticationType.AUTH_TOKEN,
          //getLoginToken: login,
          containerHeight: '1000px',
          //errorHandler: customErrorHandler


          filters: [
            {
                "name": attributeName, //You can change to the actual attribute name.
                "selections": [
                    {"name":filter} //You can change to the actual attribute element name.
                ]
            }  
        ]

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


		let element = document.getElementById("container");
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

			let element = document.getElementById("embeddedContainer");
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
//window.onload = (evt) => {
//    render();
//}



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
    isActive.dossiers = true;
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



