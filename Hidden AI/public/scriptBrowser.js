document.addEventListener('DOMContentLoaded', function () {
    const authTokenButton = document.querySelector('.authTokenButton');
    const authServiceButton = document.querySelector('.authServiceButton');
    const submitButtonToken = document.querySelector('.authTokenButtonConfirm');
    const submitButtonService = document.querySelector('.authTokenButtonConfirm');
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