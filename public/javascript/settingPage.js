let loginType = document.getElementById('loginType')
chrome.storage.local.get(['credentialsType'], function(result) {
	if (result.credentialsType === 'token') {
		loginType.textContent = `Access Token`
	} else if (result.credentialsType === 'service') {
		loginType.textContent = `Service Account`
	}
})

chrome.storage.local.get(['temperatureValue', 'tokenLimit', 'context'], function(result) {
    if (result.temperatureValue === undefined || result.tokenLimit === undefined || result.context === undefined) {
        chrome.storage.local.set({temperatureValue: 0.9, tokenLimit: 1024, context: ""});
    }
});	

chrome.storage.local.get(['temperatureValue', 'tokenLimit', 'context'], function(result) {
    if (result.temperatureValue) {
        document.getElementById('temperatureValue').textContent = result.temperatureValue
        document.getElementById('temperatureSlide').value = result.temperatureValue
    }
    if (result.tokenLimit) {
        document.getElementById('tokenlimitValue').textContent = result.tokenLimit
        document.getElementById('tokenlimitSlide').value = result.tokenLimit
    }
	if (result.context) {
		document.getElementById('contextText').value = result.context
	}
})

document.getElementById('temperatureSlide').addEventListener('input', function()	{
	chrome.storage.local.set({temperatureValue: Number(this.value)})	
	chrome.storage.local.get(['temperatureValue'], function(result) {
		document.getElementById('temperatureValue').textContent = result.temperatureValue
		document.getElementById('temperatureSlide').value = result.temperatureValue
	})
})

document.getElementById('tokenlimitSlide').addEventListener('input', function()	{
    chrome.storage.local.set({tokenLimit: Number(this.value)})	
	chrome.storage.local.get(['tokenLimit'], function(result) {
		document.getElementById('tokenlimitValue').textContent = result.tokenLimit
		document.getElementById('tokenlimitSlide').value = result.tokenLimit
	})
})

document.getElementById('resetButton').addEventListener('click', function() {
	chrome.storage.local.set({temperatureValue: 0.9, tokenLimit: 1024, context: ""})
	document.getElementById('tokenlimitValue').textContent = "1024"
	document.getElementById('tokenlimitSlide').value = 1024
	document.getElementById('temperatureValue').textContent = "0.9"
	document.getElementById('temperatureSlide').value = 0.9
	document.getElementById('contextText').value = ""
})

document.getElementById('contextText').addEventListener('input', function() {
	chrome.storage.local.set({context: this.value})
})

document.getElementById('logoutButton').addEventListener('click', function() {
    chrome.storage.local.clear()
	window.location.href = 'index.html'
})

async function checkCredential() {
    chrome.storage.local.get(['userCredentials'], async function(result) {
		    console.log(result.userCredentials.projectRegionToken,  result.userCredentials.projectIdToken, result.userCredentials.authToken)
            let userProjectRegion = result.userCredentials.projectRegionToken;
            let userProjectId = result.userCredentials.projectIdToken;
            let userAuthToken = result.userCredentials.authToken;
            const apiUrl = `https://${userProjectRegion}-aiplatform.googleapis.com/v1/projects/${userProjectId}/locations/${userProjectRegion}/publishers/google/models/chat-bison:predict`;
            const requestData = {
                instances: [{
                    messages: [{
                        author: "user",
                        content: "Hello this is a test message"
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
                Authorization: `Bearer ${userAuthToken}`,
                'Content-Type': 'application/json',
            };

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(requestData),
                });

                if (response.status !== 200) {
					chrome.storage.local.clear()
					window.location.href = "index.html"
                }
            } catch (error) {
                console.error(error);
				chrome.storage.local.clear()
				window.location.href = "index.html"
            }
        }

    )
}
checkCredential()