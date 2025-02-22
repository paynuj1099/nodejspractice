$(document).ready(function() {
    loadData();
});

$('#orderTable').DataTable();

// Load all data into DataTable
function loadData() {
    $.ajax({
        url: "http://localhost:8080/api/orders",
        method: "GET",
        success: function(data) {
            let table = $('#orderTable').DataTable();
            table.clear();
            data.forEach(order => {
                let deleteButton = `<button class="btn btn-danger btn-sm" onclick="deleteOrder(${order.id})"><i class="fa-solid fa-trash"></i></button>`; 
                let editbutton = `<button class="btn btn-primary btn-sm" onclick=""><i class="fa-solid fa-pen-to-square"></i></button>`;
                table.row.add([
                    order.Title,
                    order.Quantity,
                    order.Message,
                    order.City,
                    deleteButton,
                    editbutton
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
                url: `http://localhost:8080/api/orders/${id}`,
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

//add new order to the database
function addOrder() {
    const order = {
        Title: document.getElementById('orderTitle').value,
        Quantity: document.getElementById('orderQty').value,
        Message: document.getElementById('orderMessage').value,
        City: document.getElementById('orderCity').value
    };

    swal({
        title: "Are you sure?",
        text: "Do you want to add this order?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then((willAdd) => {
        if (willAdd) {
            $.ajax({
                url: 'http://localhost:8080/api/orders',
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

(function() {
    'use strict';
    window.addEventListener('load', function() {
        var form = document.getElementById('formAdd');
        form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                event.preventDefault(); // Prevent default form submission
                addOrder(); // Call function to add new order
            }
            form.classList.add('was-validated');
        }, false);

    }, false);
})();



