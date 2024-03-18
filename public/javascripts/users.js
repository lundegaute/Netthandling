

async function updateUserRole(id, role) {
    console.log(id)
    console.log(role)
    let newRole;
    if ( role === "Admin" ) {
        newRole = 2;
    } else {
        newRole = 1;
    }
    axios.put("/auth", {id, newRole}).then( (response) => {
        if ( response.data.data.StatusCode !== 200 ) {
            alert(response.data.data.Results)
        } else {
            window.location.reload();
        }
    })
}