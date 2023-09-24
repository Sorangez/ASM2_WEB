
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
