const $loader = document.getElementsByClassName('preloader-wrapper')[0];
const $loaderBg = document.getElementsByClassName('preloader-background')[0];

function showError (msg) {
    if (Swal) {
        Swal.fire({
            type: 'error',
            title: msg,
            showConfirmButton: false,
        })
    }

}

function toggleLoader() {
    $loader.classList.toggle('active');
    $loaderBg.classList.toggle('active');
}



