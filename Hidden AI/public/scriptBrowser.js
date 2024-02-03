document.addEventListener('DOMContentLoaded', function () {
    const authTokenButton = document.querySelector('.authTokenButton');
    const authServiceButton = document.querySelector('.authServiceButton');
    const authTokenForm = document.getElementById('authTokenForm');
    const authServiceForm = document.getElementById('authServiceForm');
    authTokenForm.addEventListener('submit', function (e) {
         e.preventDefault();
         checkAuth('token');
    });
    authServiceForm.addEventListener('submit', function (e) {
        e.preventDefault();
        checkAuth('service');
    });
    if (authTokenButton && authServiceButton) {
        authTokenButton.addEventListener('click', function () {
            showhide('authTokenDiv', 'authServiceDiv', 'authTokenButton', 'authServiceButton');
        });

        authServiceButton.addEventListener('click', function () {
            showhide('authServiceDiv', 'authTokenDiv', 'authServiceButton', 'authTokenButton');
        });
    }
});

if (localStorage.getItem('userInfo')) {
    window.location.href = 'main.html';  
}

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

function checkAuth(type) {
    if(type === 'token'){
        const authTokenForm = document.getElementById('authTokenForm');
        let projectID = authTokenForm.projectIdToken.value
        let projectRegion = authTokenForm.projectRegionToken.value
        let authToken = authTokenForm.authToken.value
        validateAuth(projectID, projectRegion, authToken);
    } else if (type === 'service'){

    }
    
}

document.getElementById('authTokenForm').addEventListener('input', function(){
    let projectIdTokenValue = document.getElementById('projectIdToken').value
    let projectRegionIDValue = document.getElementById('projectRegionToken').value
    let authTokenValue = document.getElementById('authToken').value
    localStorage.setItem('userInfoValues', JSON.stringify({
        projectIdTokenValue: projectIdTokenValue,
        projectRegionIDValue: projectRegionIDValue,
        authTokenValue: authTokenValue,
    }));
});

document.getElementById('projectIdToken').value = JSON.parse(localStorage.getItem('userInfoValues')).projectIdTokenValue
document.getElementById('projectRegionToken').value = JSON.parse(localStorage.getItem('userInfoValues')).projectRegionIDValue
document.getElementById('authToken').value = JSON.parse(localStorage.getItem('userInfoValues')).authTokenValue

async function validateAuth(projectRegion, projectID, authToken) {
    const apiUrl = `https://${projectRegion}-aiplatform.googleapis.com/v1/projects/${projectID}/locations/${projectRegion}/publishers/google/models/chat-bison:predict`;
    const requestData = {
        instances: [
          {
            messages: [
              {
                author: "user",
                content: "Hello this is a test message"
              },
            ],
          },
        ],
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

        if (!response.ok) {
            console.log('Some information is not correct!');
        }
          
        if(response.status === 200) {
            localStorage.setItem('userInfo', JSON.stringify({
                projectRegion: projectRegion,
                projectID: projectID,
                authToken: authToken
            }));
            window.location.href = 'main.html';
            console.log('Auth token is valid');
        }
    } catch (error) {
        console.error('Some information is not correct!');
    }
}

