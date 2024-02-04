navigator.clipboard.readText()
	.then(text => {
		chrome.storage.local.get(['userCredentials'], async function(result) {
			if (result.userCredentials) {
				let userProjectRegion = result.userCredentials.projectRegionToken;
				let userProjectId = result.userCredentials.projectIdToken;
				let userAuthToken = result.userCredentials.authToken;
				const apiUrl = `https://${userProjectRegion}-aiplatform.googleapis.com/v1/projects/${userProjectId}/locations/${userProjectRegion}/publishers/google/models/chat-bison:predict`;
				const requestData = {
					instances: [{
						messages: [{
							author: "user",
							content: text
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
					const data = await response.json();
					if (!response.ok) {
						console.log('Auth token time has run out!');
					}
					if (response.status === 200) {
						navigator.clipboard.writeText(data.predictions[0].candidates[0].content);
					}
				} catch (error) {
					console.error('Some information is not correct!' + error);
				}
			}
		});
	})
	.catch(err => {
		onsole.error('Failed to read clipboard contents: ', err);
	});