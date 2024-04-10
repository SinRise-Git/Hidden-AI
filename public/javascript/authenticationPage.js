chrome.storage.local.get(['hasValidCredentials'], function(result) {
    if (result.hasValidCredentials) {
        window.location.href = 'main.html';
    } else { 
        chrome.storage.local.clear()
    }
});


if(!localStorage.getItem("selectedOption")) {
	localStorage.setItem("selectedOption", "authTokenDiv");
	document.getElementById("authTokenDiv").style.display = "block";
} else {
	selectedOption = localStorage.getItem("selectedOption")
	document.getElementById("selectAuthOption").value = selectedOption;
	document.getElementById(selectedOption).style.display = "block";
}

document.getElementById("selectAuthOption").addEventListener("change", function(e) {
	selectedOption = localStorage.getItem("selectedOption")
	document.getElementById(selectedOption).style.display = "none";
    localStorage.setItem("selectedOption", e.target.value)
	document.getElementById(e.target.value).style.display = "block";
})

if(!localStorage.getItem("credentialsValues")) {
	localStorage.setItem("credentialsValues" , JSON.stringify({
		authTokenForm:{}, authServiceForm: {}, authGeminiForm: {}
	}))
}

let credentialsValues = JSON.parse(localStorage.getItem("credentialsValues"))
Object.entries(credentialsValues).forEach(([key, value]) => {
	Object.entries(value).forEach(([key, value]) => {
		document.getElementById(key).value = value
	})
})

document.addEventListener('input', function(e) {
	if(e.target.form){
		let storageValues = JSON.parse(localStorage.getItem('credentialsValues'));
		storageValues[e.target.form.id][e.target.id] = e.target.value
		localStorage.setItem('credentialsValues', JSON.stringify(storageValues));
	}
})

document.addEventListener("submit", async function(e) {
	e.preventDefault();
	const currentForm = document.getElementById(e.target.id)
	let checkType = "";
	let requestBody = {
		requestVersion: "checkCredentials"
	};
	if(e.target.id === "authTokenForm") {
		checkType = "authToken";
		requestBody.projectId = currentForm.projectIdToken.value;
		requestBody.projectRegion = currentForm.projectRegionToken.value;
		requestBody.authToken = currentForm.authToken.value;
	} else if(e.target.id === "authServiceForm") {
		checkType = "authService";
		requestBody.projectId = currentForm.projectIdToken.value;
		requestBody.projectRegion = currentForm.projectRegionToken.value;
		requestBody.clientEmail = currentForm.clientEmail.value;
		requestBody.privateKey = currentForm.privateKey.value;
	} else if(e.target.id === "authGeminiForm") {
		checkType = "authGemini";
		requestBody.projectId = currentForm.projectIdToken.value;
		requestBody.projectRegion = currentForm.projectRegionToken.value;
		requestBody.studioKey = currentForm.studioKey.value;
	}
	const requestOption = {
		method : "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify(requestBody),
	}
	console.log(requestBody)
	console.log(checkType);
	const response = await fetch(`http://localhost:3000/checkCredentials${checkType}`, requestOption)
	const data = await response.json()
})
	


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

