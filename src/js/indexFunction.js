// CHECK IF LOGGED IN, IF NOT THEN DIRECT TO LOGIN PAGE
if (localStorage.getItem('isAuthorized') !== 'true') {
    localStorage.removeItem('theme');
    window.location.href = './login.html';
}

// Inactivity timeout duration (e.g., 15 minutes)
const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds
let inactivityTimer;

// Function to reset the inactivity timer
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(logout, INACTIVITY_TIMEOUT);
}

// Function to log the user out
function logout() {
    localStorage.removeItem('isAuthorized');
    localStorage.removeItem('theme');
    window.location.href = './login.html';
}

// Set up event listeners to reset the inactivity timer on user activity
window.onload = resetInactivityTimer;
document.onmousemove = resetInactivityTimer;
document.onscroll = resetInactivityTimer;
document.onclick = resetInactivityTimer;

// This loads the data in DataTable when Page Loads
$(document).ready(function() {
    loadData();
});

$('#orderTable').DataTable();

const BASE_URL = 'http://172.26.220.202:8080';
// Load all data into DataTable
function loadData() {
    $.ajax({
        url: `${BASE_URL}/api/orders`,
        method: "GET",
        success: function(data) {
            let table = $('#orderTable').DataTable();
            table.clear();
            data.forEach(order => {
                let deleteButton = `<button class="btn btn-danger btn-sm" onclick="deleteOrder(${order.id})"><i class="fa-solid fa-trash"></i></button>`; 
                let editButton = `<button class="btn btn-primary btn-sm" onclick="editOrder(${order.id})"><i class="fa-solid fa-pen-to-square"></i></button>`;
                table.row.add([
                    order.Title,
                    order.Quantity,
                    order.Message,
                    order.City,
                    editButton + " " + deleteButton
                ]).draw();
            });
        }
    });
}

//delete user based on id 
function deleteOrder(id) {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this data!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
        if (willDelete) {
            $.ajax({
                url: `${BASE_URL}/api/orderDelete/${id}`,
                type: "DELETE",
                success: function(response) {
                    console.log(response.message);
                    loadData();
                },
                error: function(xhr) {
                    console.error(xhr.responseJSON.message);
                }
            });
                swal("Poof! Your data has been deleted!", {
                icon: "success",
            });
        } 
    });
}

//update order details
function editOrder(id) {
    $.ajax({
        url: `${BASE_URL}/api/orders/${id}`,
        type: "GET",
        success: function(data) {
            console.log('Response data:', data); 
            
                console.log(data);
                document.getElementById('editOrderId').value = data.id;
                document.getElementById('editOrderTitle').value = data.Title;
                document.getElementById('editOrderQty').value = data.Quantity;
                document.getElementById('editOrderMessage').value = data.Message;
                document.getElementById('editOrderCity').value = data.City;
          
        },
        error: function(xhr) {
            console.error(xhr.responseJSON.message);
        }
    });

    $('#editModal').modal('show');
}

function saveOrderEdit(){
    const data = {
        id: parseInt(document.getElementById('editOrderId').value, 10),
        Title: document.getElementById('editOrderTitle').value,
        Quantity: parseInt(document.getElementById('editOrderQty').value, 10),
        Message: document.getElementById('editOrderMessage').value,
        City: document.getElementById('editOrderCity').value,
        Name: localStorage.getItem('fullName')
    };
    console.log('Data to be sent:', data);

    swal({
        title: "Are you sure?",
        text: "Proceed in editing order details?",
        icon: "info",
        buttons: true,
    })
    .then((willProceed) => {
        if (willProceed) {
            if(data.Title === '' || data.Quantity === '' || data.Message === '' || data.City === ''){
                swal("Error!", "Please fill-up all necessary fields!", "error");
            }
            else if (!/^\d+$/.test(data.Quantity.toString())){
                swal("Error!", "Please provide a valid Quantity!", "error");
            }
            else{
                $.ajax({
                    url: `${BASE_URL}/api/orderEdit`,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: function(response) {
                        console.log(response.message);
                        loadData();
                        swal("Success!", "Order detail was updated!", "success");
                        $('#editModal').modal('hide');
                        document.getElementById('formEdit').reset();
                    },
                    error: function(xhr) {
                        console.error(xhr.responseJSON.message);
                        swal("Error!", "Failed to update!", "error");
                    }
                });
            }
        }
    });
}


//add new order to the database
function addOrder() {
    const order = {
        Title: document.getElementById('orderTitle').value,
        Quantity: parseInt(document.getElementById('orderQty').value, 10),
        Message: document.getElementById('orderMessage').value,
        City: document.getElementById('orderCity').value
    };

    swal({
        title: "Are you sure?",
        text: "Do you want to add this order?",
        icon: "info",
        buttons: true,
        dangerMode: true,
    })
    .then((willAdd) => {
        if (willAdd) {
            $.ajax({
                url: `${BASE_URL}/api/orders`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(order),
                success: function(response) {
                    console.log(response.message);
                    loadData(); 
                    swal("Success!", "New order has been added!", "success");
                    document.getElementById('formAdd').reset();
                    document.getElementById('formAdd').classList.remove('was-validated');
                },
                error: function(xhr) {
                    console.error(xhr.responseJSON.message);
                    swal("Error!", "Failed to add new order!", "error");
                }
            });
        }
    });
}

// Form Validation Integer Input Only
document.getElementById('orderQty').addEventListener('input', function() {
    var orderQty = document.getElementById('orderQty');
    if (!/^\d+$/.test(orderQty.value)) {
        orderQty.setCustomValidity('Please provide a valid Quantity.');
    } else {
        orderQty.setCustomValidity('');
    }
});

// Form Validation
(function() {
    'use strict';
    window.addEventListener('load', function() {
        var form = document.getElementById('formAdd');
        form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                event.preventDefault();
                addOrder();
            }
            form.classList.add('was-validated');
        }, false);

    }, false);
})();

// TOAST
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('isToastDisplayed') === 'true') {
        const fullName = localStorage.getItem('fullName').toString();
        document.getElementById('userNameToast').innerText = fullName;
        const toast = new bootstrap.Toast(document.getElementById('loginToast'));
        toast.show();
        setTimeout(() => {
            toast.hide();
            localStorage.removeItem('isToastDisplayed');
        }, 3000);
    }
});

// Dark Mode Toggle
document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    const body = document.body;
    const formControls = document.querySelectorAll('.form-control');
    const table = document.querySelector('.table');
    const dataTable = document.querySelector('.dataTable');

    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
            formControls.forEach(input => {
                input.classList.add('dark-mode');
                input.classList.remove('light-mode');
            });
            table.classList.add('table-dark');
            table.classList.remove('table-light');
            dataTable.classList.add('table-dark');
            dataTable.classList.remove('table-light');
        } else {
            body.classList.add('light-mode');
            body.classList.remove('dark-mode');
            formControls.forEach(input => {
                input.classList.add('light-mode');
                input.classList.remove('dark-mode');
            });
            table.classList.add('table-light');
            table.classList.remove('table-dark');
            dataTable.classList.add('table-light');
            dataTable.classList.remove('table-dark');
        }
    }

    applyTheme(currentTheme);

    themeToggle.addEventListener('change', function () {
        const theme = themeToggle.checked ? 'dark' : 'light';
        applyTheme(theme);
        localStorage.setItem('theme', theme);
    });
});


