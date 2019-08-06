const $signupBtn = document.getElementById('signup-btn');
const $usernameInput = document.getElementById('username-input');
const $passwordInput = document.getElementById('password-input');
const $passwordConfirmationInput = document.getElementById('password2-input');

$signupBtn.addEventListener('click', signup);

function signup(e) {
    e.preventDefault();
    if ([$usernameInput.value, $passwordInput.value, $passwordConfirmationInput.value].includes("")) {
        return showError('Please fill all the fields');
    }

    if ($passwordInput.value !== $passwordConfirmationInput.value) {
        return showError('Passwords should match');
    }
    toggleLoader();
    axios.post('/api/v1/signup', {username: $usernameInput.value, password: $passwordInput.value})
        .then(() => window.location.href = '/login')
        .catch((err) => {
            const {error, message} = err.response.data;
            let _message = 'Something went wrong! Please, try again.';
            if (error === 'Duplication error') {
                _message = message
            }
            showError(_message)
        })
        .finally(function () {
            toggleLoader();
        });
}


