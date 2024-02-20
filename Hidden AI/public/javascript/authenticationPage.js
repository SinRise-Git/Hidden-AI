const authTokenButton = document.querySelector('.authTokenButton');
const authServiceButton = document.querySelector('.authServiceButton');
const authTokenForm = document.getElementById('authTokenForm');
const authServiceForm = document.getElementById('authServiceForm');
let wasClicked = false;
authTokenForm.addEventListener('submit', function(e) {
	e.preventDefault();
	checkAuth('token');
});

//authServiceForm.addEventListener('submit', function(e) {
//	e.preventDefault();
//	checkAuth('service');
//});

if (authTokenButton && authServiceButton) {
	authTokenButton.addEventListener('click', function() {
		showhide('authTokenDiv', 'authServiceDiv', 'authTokenButton', 'authServiceButton');
	});

	authServiceButton.addEventListener('click', function() {
		showhide('authServiceDiv', 'authTokenDiv', 'authServiceButton', 'authTokenButton');
	});
}

chrome.storage.local.get(['hasValidCredentials'], function(result) {
    if (result.hasValidCredentials) {
        window.location.href = 'main.html';
    } else { 
        chrome.storage.local.clear()
    }
});

function showhide(show, hide, auth, service) {
	let divShow = document.getElementById(show);
	let divHide = document.getElementById(hide);
	let buttonShow = document.getElementById(auth);
	let buttonHide = document.getElementById(service);
	if (divShow && divHide) {
		divShow.style.display = "block";
		divHide.style.display = "none";
		buttonShow.style.color = "white";
		buttonHide.style.color = "gray"
	}
}

function checkAuth(authType) {
	if (authType === 'token') {
		const authTokenForm = document.getElementById('authTokenForm');
		let projectIdToken = authTokenForm.projectIdToken.value
		let projectRegionToken = authTokenForm.projectRegionToken.value
		let authToken = authTokenForm.authToken.value
		validateAuth(projectIdToken, projectRegionToken, authToken, authType);
	} //else if (authType === 'service') {
		//const authServiceForm = document.getElementById('authServiceForm');
		//let projectIdService = authServiceForm.projectIdService.value
		//let projectRegionService = authServiceForm.projectRegionService.value
		//let privateKey = authServiceForm.privateKey.value
		//let clientEmail = authServiceForm.clientEmail.value
		//let clientId = authServiceForm.clientId.value
		//genorateAuthToken(projectIdService, projectRegionService, privateKey, clientEmail, clientId);
	//}
};

document.getElementById('authTokenForm').addEventListener('input', function() {
	let projectIdTokenValue = document.getElementById('projectIdToken').value
	let projectRegionIdValue = document.getElementById('projectRegionToken').value
	let authTokenValue = document.getElementById('authToken').value
	localStorage.setItem('tokenCredentialValue', JSON.stringify({
		projectIdToken: projectIdTokenValue,
		projectRegionToken: projectRegionIdValue,
		authToken: authTokenValue,
	}));
});

//document.getElementById('authServiceForm').addEventListener('input', function() {
	//let projectIdSerivceValue = document.getElementById('projectIdService').value
	//let projectRegionSerivceValue = document.getElementById('projectRegionService').value
	//let privateKeyValue = document.getElementById('privateKey').value
	//let clientEmailValue = document.getElementById('clientEmail').value
	//localStorage.setItem('serviceCredentialValue', JSON.stringify({
		//projectIdService: projectIdSerivceValue,
		//projectRegionService: projectRegionSerivceValue,
		//privateKey: privateKeyValue,
		//clientEmail: clientEmailValue,
	//}));
//});

if (localStorage.getItem('tokenCredentialValue')) {
	chrome.storage.local.get(['hasValidCredentials'], function(result) {
		if (result.hasValidCredentials === undefined) {
			let credentialValueToken = JSON.parse(localStorage.getItem('tokenCredentialValue'));
			Object.entries(credentialValueToken).forEach(([key, value]) => {
				document.getElementById(key).value = value
			});
		}
	})
}

//if (localStorage.getItem('serviceCredentialValue')) {
	//chrome.storage.local.get(['hasValidCredentials'], function(result) {
		//if (result.hasValidCredentials === undefined) {
			//let credentialValueService = JSON.parse(localStorage.getItem('serviceCredentialValue'));
			//Object.entries(credentialValueService).forEach(([key, value]) => {
				//document.getElementById(key).value = value
			//})
		//}
	//})
//}

async function validateAuth(projectIdToken, projectRegionToken, authToken, authType) {
	if (wasClicked === false) {
		wasClicked = true;
		dotCount = 0;
		let responseText = document.getElementById("responseText")
		responseText.style.color = "green";
		responseText.textContent = "Validating your credentials";
		let loadingCredentials = setInterval(() => {
			dotCount += 1;
			if (dotCount > 3) {dotCount = 0;}
			let dots = '.'.repeat(dotCount);
			responseText.textContent = "Validating your credentials" + dots;
		}, 250)
		const apiUrl = `https://${projectRegionToken}-aiplatform.googleapis.com/v1/projects/${projectIdToken}/locations/${projectRegionToken}/publishers/google/models/chat-bison:predict`;
		const requestData = {
			instances: [{
				messages: [{
					author: "user",
					content: "Test message to validate credentials!"
				}, ],
			}, ],
			parameters: {
				temperature: 0.3,
				maxOutputTokens: 200,
				topP: 0.8,
				topK: 40,
			},
		};

		const headers = {
			Authorization: `Bearer ${authToken}`,
			'Content-Type': 'application/json',
		};

		try {
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: headers,
				body: JSON.stringify(requestData),
			});

			if (response.status === 200) {
				chrome.storage.local.set({
					hasValidCredentials: 'true',
					credentialsType: authType,
					userCredentials: {
						projectRegionToken: projectRegionToken,
					    projectIdToken: projectIdToken,
					    authToken: authToken
					}
				})
				window.location.href = 'main.html';
			} else {
				clearInterval(loadingCredentials);
				responseText.textContent = "Your credentials are not valid!";
				responseText.style.color = "red";
				wasClicked = false;
			}
		} catch (error) {
			console.error(error);
		}
	};
};

