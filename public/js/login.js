document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const registerBtn2 = document.getElementById('registerAspirante');
    const loginBtn = document.getElementById('login');

    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            container.classList.add("active");
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            container.classList.remove("active");
        });
    }


    if (document.getElementById('registerForm')) {
        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            document.getElementById('step1').style.display = 'none'; 
            document.getElementById('step2').style.display = 'block'; 
            document.getElementById('step1Status').classList.remove('completed');
            document.getElementById('step2Status').classList.add('completed');
        });
    }

  
});
function toggleMenu() {
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.toggle('show');
}