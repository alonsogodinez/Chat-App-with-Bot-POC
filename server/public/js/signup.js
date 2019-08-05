
const $signupBtn = document.getElementById("signup-btn");

$signupBtn.addEventListener("click", signup);

function signup(e) {
    e.preventDefault()
    axios.get('/').then(resp => {
        debugger
        console.log(resp.data);
    }).catch(err => {
        debugger
        console.log(err)
    });
}
