const $loginBtn = document.getElementById("login-btn");
const $usernameInput = document.getElementById('username-input');
const $passwordInput = document.getElementById('password-input');

$loginBtn.addEventListener("click", login);

function login(e) {
    e.preventDefault();
    if ([$usernameInput.value, $passwordInput.value].includes("")) {
        return showError('Please fill all the fields');
    }

    toggleLoader();
    axios.post('/api/v1/login', {username: $usernameInput.value, password: $passwordInput.value})
        .then(({data}) => {
            window.localStorage.setItem("authData", JSON.stringify({
                token: data.token,
                username: $usernameInput.value
            }));
            window.location.href = '/chat'
        })
        .catch((err) => {
            const {error, message} = err.response.data;
            let _message = 'Something went wrong! Please, try again.';
            if (error === 'Authentication error') {
                _message = message
            }
            showError(_message)
        })
        .finally(function () {
            toggleLoader();
        });
}
