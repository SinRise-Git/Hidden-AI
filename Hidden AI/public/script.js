document.addEventListener('DOMContentLoaded', function () {
    let authTokenButton = document.querySelector('.authTokenButton');
    let authServiceButton = document.querySelector('.authServiceButton');
    let submitButtonToken = document.querySelector('.authTokenButtonConfirm');
    let submitButtonService = document.querySelector('.authTokenButtonConfirm');

    submitButtonToken.addEventListener('click', function () {
        checkAuth("token")
    })
    submitButtonService.addEventListener('click', function () {
        checkAuth("service")
    })

    if (authTokenButton && authServiceButton) {
        authTokenButton.addEventListener('click', function () {
            showhide('authToken', 'authService', 'authTokenButton', 'authServiceButton');
        });

        authServiceButton.addEventListener('click', function () {
            showhide('authService', 'authToken', 'authServiceButton', 'authTokenButton');
        });
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


function checkAuth(type) {
    
}