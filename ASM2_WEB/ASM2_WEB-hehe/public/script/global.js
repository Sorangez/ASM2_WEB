// Shipper Page Button
const openButtons = document.querySelectorAll('.custom-open-button');
const closeButtons = document.querySelectorAll('.custom-close-button');

openButtons.forEach((button) => {
    button.addEventListener('click', function () {
        const modal = document.getElementById('customModal');
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignContent = 'center';
    });
});

closeButtons.forEach((button) => {
    button.addEventListener('click', function () {
        const modal = button.closest('.custom-modal');
        modal.style.display = 'none';
    });
});

// Shipper Save Button

// const saveButton = document.getElementById('saveButton');
// const roleDropDown = document.getElementById('status-dropdown');

// saveButton.addEventListener('click', function(event) {
//     const selectedStatus = roleDropDown.value;
//     alert(`Selected status: ${selectedStatus}`);
// });



// // Cart Sum Price

const productPrices = document.querySelectorAll('.products-price');

// Initialize a variable to store the sum
let sum = 0;

// Iterate through the product prices and sum them
productPrices.forEach(productPrice => {
    const price = parseFloat(productPrice.textContent); // Parse as a floating-point number
    if (!isNaN(price)) {
        sum += price;
    }
});

// Display the sum in the "Total Sum" element
const sumElement = document.getElementById('sum');
sumElement.textContent = sum.toFixed(2); 

document.getElementById('order-btn').addEventListener('click', function(){
    window.location.href="/cart"
});

// Price Range

const rangeInput = document.querySelectorAll(".range-input input"),
priceInput = document.querySelectorAll(".price-input input"),
progress = document.querySelector(".slider .progress");

let priceGap = 10;

priceInput.forEach(input => {
input.addEventListener("input", e => {
    let minVal = parseInt(priceInput[0].value),
        maxVal = parseInt(priceInput[1].value);

    if ((maxVal - minVal >= priceGap) && maxVal <= 200) {
        if (e.target.className === "range-min") {
            rangeInput[0].value = minVal;
            progress.style.left = (minVal / rangeInput[0].max) * 100 + "%";
        } else {
            rangeInput[1].value = maxVal;
            progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
        }
    }
});
});

rangeInput.forEach(input => {
input.addEventListener("input", e => {
    let minVal = parseInt(rangeInput[0].value),
        maxVal = parseInt(rangeInput[1].value);

    if (maxVal - minVal < priceGap) {
        if (e.target.className === "range-min") {
            rangeInput[0].value = maxVal - priceGap;
        } else {
            rangeInput[1].value = minVal + priceGap;
        }
    } else {
        priceInput[0].value = minVal;
        priceInput[1].value = maxVal;
        progress.style.left = (minVal / rangeInput[0].max) * 100 + "%";
        progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
    }

})
})

// Season Button

const seasonButton = document.querySelectorAll('.season-button');

seasonButton.forEach(seasonButton => {
seasonButton.addEventListener('click', function () {
    if (seasonButton.classList.contains('clicked')) {
        seasonButton.classList.remove('clicked');
    } else {
        seasonButton.classList.add('clicked');
    }
});
});

//   Sticky Nav

// const sectionHeroEl = document.querySelector(".navigation")


// const obs = new IntersectionObserver(
// function (entries) {
//     const ent = entries[0]
//     console.log(ent);

//     if (ent.isIntersecting === false) {
//         document.body.classList.add("sticky");
//     }

//     if (ent.isIntersecting === true) {
//         document.body.classList.remove("sticky");
//     }
// },
// {
//     root: null,
//     threshold: 0,
//     rootMargin: "-140px"
// }
// );
// obs.observe(sectionHeroEl)

// Sign up

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