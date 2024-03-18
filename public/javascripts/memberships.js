
async function createMembership() {
    let status = prompt("Enter new membership name: ")
    let discount = prompt("Enter discount amount in percentage ('30' for 30%): ")

    axios.post("/memberships", {status, discount}).then( (response) => {
        if ( response.data.data.StatusCode !== 200) {
            alert(response.data.data.Results)
        } else {
            window.location.reload();
        }
    })

}

async function updateMembership(id) {
    let newStatus = prompt("Enter new membership name: ")
    let newDiscount = prompt("Enter discount amount in percentage ('30' for 30%): ")


    axios.put("/memberships", {id, newStatus, newDiscount}).then( (response) => {
        if ( response.data.data.StatusCode !== 200) {
            alert(response.data.data.Results)
        } else {
            window.location.reload();
        }
    })
}

async function deleteMembership(id) {
    axios.delete("/memberships", {
        data: {
            id: id
        }
    }).then( (response) => {
        if ( response.data.data.StatusCode !== 200) {
            alert(response.data.data.Results)
        } else {
            window.location.reload();
        }
    })
}