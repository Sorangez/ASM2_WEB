const forms = document.querySelector(".forms"),
    pwShowHide = document.querySelectorAll(".hide-icon"),
    links = document.querySelectorAll(".link");

pwShowHide.forEach(hideIcon => {
    hideIcon.addEventListener("click", ()=> {
        let pwFields = hideIcon.parentElement.parentElement.querySelectorAll(".password");
        
        pwFields.forEach(password => {
            if(password.type === "password"){
                password.type = "text"
                hideIcon.classList.replace("bx-hide", "bx-show");
                return;
            }
            password.type = "password"
            hideIcon.classList.replace("bx-show", "bx-hide");
        })
    })
})

const usernameField = document.getElementById('username');
const passwordField = document.getElementById('password');
const roleDropdown = document.getElementById('role-dropdown');
const customerSection = document.getElementById('customer');
const vendorSection = document.getElementById('vendor');
const shipperSection = document.getElementById('shipper');

usernameField.addEventListener('input', () => {
    const usernameValue = usernameField.value;
    if (regex.test(usernameValue)) {
      // Valid username
      usernameField.classList.remove('invalid');
      usernameField.classList.add('valid');
    } else {
      // Invalid username
      usernameField.classList.remove('valid');
      usernameField.classList.add('invalid');
    }
  });

roleDropdown.addEventListener('change', function() {
    // Hide all sections
    customerSection.style.display = 'none';
    vendorSection.style.display = 'none';
    shipperSection.style.display = 'none';

    // Show the selected section based on the dropdown value
    if (roleDropdown.value === 'customer') {
        customerSection.style.display = 'block';
    } else if (roleDropdown.value === 'vendor') {
        vendorSection.style.display = 'block';
    } else if (roleDropdown.value === 'shipper') {
        shipperSection.style.display = 'block';
    }
});

  // Get a reference to the button element by its ID
  const signupButton = document.getElementById('signup_button');

  // Add a click event listener to the button
  signupButton.addEventListener('click', function() {
    alert('Your account has been created!'); // Show an alert when the button is clicked
  });


window.onload = function () {
  // Your code to run after the window has loaded goes here
  usernameField.setAttribute('pattern', '^[a-zA-Z0-9]{8,15}$');
  // passwordField.setAttribute('pattern', '^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$');
  // You can place any code or functions you want to execute here.
};