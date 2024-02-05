let loginType = document.getElementById('loginType');
chrome.storage.local.get(['credentialsType'], function(result) {
	if (result.credentialsType === 'token') {
		loginType.textContent = `Access Token`;
	}
});

chrome.storage.local.get(['temperatureValue', 'tokenLimit'], function(result) {
    if (result.temperatureValue) {
        document.getElementById('temperatureValue').textContent = result.temperatureValue;
        document.getElementById('temperatureSlide').value = result.temperatureValue;
    }
    if (result.tokenLimit) {
        document.getElementById('tokenlimitValue').textContent = result.tokenLimit;
        document.getElementById('tokenlimitSlide').value = result.tokenLimit;
    }
});

document.getElementById('temperatureSlide').addEventListener('input', function()	{
	chrome.storage.local.set({temperatureValue: this.value});	
	chrome.storage.local.get(['temperatureValue'], function(result) {
		document.getElementById('temperatureValue').textContent = result.temperatureValue;
		document.getElementById('temperatureSlide').value = result.temperatureValue;
	});

});

document.getElementById('tokenlimitSlide').addEventListener('input', function()	{
    chrome.storage.local.set({tokenLimit: this.value});	
	chrome.storage.local.get(['tokenLimit'], function(result) {
		document.getElementById('tokenlimitValue').textContent = result.tokenLimit;
		document.getElementById('tokenlimitSlide').value = result.tokenLimit;
	});
});

