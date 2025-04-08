const BASE_URL = 'http://172.26.220.202:8080';

//Register New Account in DB
function registerNewAccount() {
    const user = {
        Name: document.getElementById('sign-up-name').value,
        Username: document.getElementById('sign-up-username').value,
        Password: document.getElementById('sign-up-password').value,
    };

    swal({
        title: "Are you sure?",
        text: "Do you want to register new account?",
        icon: "info",
        buttons: true,
    })
    .then((willRegister) => {
        if (willRegister) {
            $.ajax({
                url: `${BASE_URL}/api/registration`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(user),
                success: function(response) {
                    console.log(response.message);
                    swal("Success!", "New user has been added!", "success");
                    document.getElementById('formSignUp').reset();
                },
                error: function(xhr) {
                    console.error(xhr.responseJSON.message);
                    swal("Error!", "Failed to register!", "error");
                }
            });
        }
    });
}

//Login to the system
document.getElementById('formSignIn').addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('sign-in-username').value;
    const password = document.getElementById('sign-in-password').value;

    $.ajax({
        url: `${BASE_URL}/api/login`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ username: username, password: password }),
        success: function(response) {
            console.log(response.message);
            swal({
                title: "Authorized!",
                text: "Do you want to proceed?",
                icon: "success",
                buttons: true,
            })
            .then(async (willProceed) => {
                if (willProceed) {

                    localStorage.setItem('isAuthorized', 'true');

                    // Fetch user details to get the full name
                    const userDetails = await getUserDetails(username, password);
                    localStorage.setItem('fullName', userDetails.Name);

                    // Set the toast to be displayed
                    localStorage.setItem('isToastDisplayed', 'true');

                    window.location.href = './index.html';
                    document.getElementById('formSignIn').reset();

                } else {
                    document.getElementById('formSignIn').reset();
                }
            });
        },
        error: function(xhr) {
            if (xhr.status === 500) {
                swal("Network Error", "Please, Check Your Network Connection.", "error");
            }
            else {
                swal("INVALID CREDENTIAL!", "Failed to login, Contact your admin to register!", "warning");
            }
            console.error(xhr.responseJSON.message);
            document.getElementById('formSignIn').reset();
        }
    });
});


// Function to get user details
async function getUserDetails(username, password) {
    try {
        const response = await $.ajax({
            url: `${BASE_URL}/api/userDetails`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username: username, password: password })
        });
        return response;
    } catch (error) {
        console.error('Error fetching user details:', error);
    }
}