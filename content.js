navigator.clipboard.readText()
	.then(text => {
		chrome.storage.local.get(['userCredentials', 'temperatureValue', 'tokenLimit', 'context', 'cooldown' ], async function(result) {
			if (result.userCredentials && result.cooldown === 'false') {3
				navigator.clipboard.writeText("");
				chrome.storage.local.set({cooldown: 'true'})
				let userProjectRegion = result.userCredentials.projectRegionToken;
				let userProjectId = result.userCredentials.projectIdToken;
				let userAuthToken = result.userCredentials.authToken;
				let usertemperatureValue = result.temperatureValue;
				let userTokenLimit = result.tokenLimit;
				let userContext = result.context;
				const apiUrl = `https://${userProjectRegion}-aiplatform.googleapis.com/v1/projects/${userProjectId}/locations/${userProjectRegion}/publishers/google/models/chat-bison:predict`;
				const requestData = {
					instances: [{
						context: userContext,
						messages: [{
							author: "user",
							content: text
						}, ],
					}, ],
					parameters: {
						temperature: usertemperatureValue,
						maxOutputTokens: userTokenLimit,
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
					const data = await response.json();
					if (response.status === 200) {
						navigator.clipboard.writeText(data.predictions[0].candidates[0].content);
						chrome.storage.local.set({cooldown: 'false'})
					}
				} catch (error) {
					console.error('Some information is not correct!' + error);
					chrome.storage.local.set({cooldown: 'false'})
				}
			}
		});
	})
.catch(err => {
	console.error('Failed to read clipboard contents: ', err);
});