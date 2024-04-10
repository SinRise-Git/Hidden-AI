let loginType = document.getElementById('loginType')
chrome.storage.local.get(['credentialsType'], function(result) {
	if (result.credentialsType === 'token') {
		loginType.textContent = `Access Token`
	} else if (result.credentialsType === 'service') {
		loginType.textContent = `Service Account`
	}
})

chrome.runtime.onMessage.addListener(function(message) {
    if (message.authTokenExpired) {
		chrome.storage.local.clear()
        window.location.href = 'index.html'
    }
});

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