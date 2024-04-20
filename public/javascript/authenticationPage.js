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

let hasSubmitted = false;
let authType = null;
document.addEventListener("submit", async function(e) {
	e.preventDefault();
	const selectedForm = e.target.id;
	if(!hasSubmitted){
		hasSubmitted = true;
		authType = e.target.id;
		const currentForm = document.getElementById(authType)
		let requestBody = {};
		if(authType === "authTokenForm") {
			requestBody.credentialsType = "authToken";
			requestBody.projectId = currentForm.projectIdToken.value;
			requestBody.projectRegion = currentForm.projectRegionToken.value;
			requestBody.authToken = currentForm.authToken.value;
		} else if(authType === "authServiceForm") {
			requestBody.credentialsType = "authService";
			requestBody.projectId = currentForm.projectIdService.value;
			requestBody.projectRegion = currentForm.projectRegionService.value;
			requestBody.clientEmail = currentForm.clientEmail.value;
			requestBody.privateKey = currentForm.privateKey.value;
		} else if(authType === "authGeminiForm") {
			requestBody.credentialsType = "authGemini";
			requestBody.projectId = currentForm.projectIdGemini.value;
			requestBody.projectRegion = currentForm.projectRegionGemini.value;
			requestBody.studioKey = currentForm.studioKey.value;
		}
	
		const requestOption = {
			method : "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(requestBody),
		}
	
		let dotCount = 0;
		const responseText = document.getElementById(`${authType}Response`)
		responseText.textContent = "";
		responseText.style.color = "green";
		let loadingCredentials = setInterval(() => {
			dotCount = (dotCount + 1) % 4;
			let dots = '.'.repeat(dotCount);
			responseText.textContent = "Validating your credentials" + dots;
		}, 250)
	
		const response = await fetch(`http://localhost:3000/checkCredentials`, requestOption)
		const data = await response.json()
		if(data.status === "valid credentials") {
			window.location.href = "main.html";
			chrome.storage.local.set({
				hasValidCredentials: 'true',
				userCredentials: requestBody
			})
			hasSubmitted = false;
		} else {
			clearInterval(loadingCredentials);
			responseText.style.color = "greee"
			responseText.textContent = `Invalid credentials (${data.error})`;
			hasSubmitted = false;
		} 
	} else if(selectedForm !== authType) {
		let responseText = document.getElementById(`${selectedForm}Response`)
		responseText.style.color = "red";
		responseText.textContent = "Wait, already validating credentials!";
	}
})