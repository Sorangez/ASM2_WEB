const saveButton = document.getElementById('saveButton');
const roleDropdown = document.getElementById('status-dropdown');

    saveButton.addEventListener('click', function () {
    const selectedStatus = roleDropdown.value;
    alert(`Selected status: ${selectedStatus}`);
});