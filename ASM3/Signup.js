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

const roleDropdown = document.getElementById('role-dropdown');
const customerSection = document.getElementById('customer');
const vendorSection = document.getElementById('vendor');
const shipperSection = document.getElementById('shipper');

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