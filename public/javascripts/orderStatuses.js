

async function updateStatusName(id) {
    const newStatusName = prompt("Enter new status name: ")

    axios.put("/orderStatuses", {id, newStatusName}).then( (response) => {
        if ( response.data.data.StatusCode !== 200 ){
            alert(response.data.data.Results)
        } else {
            window.location.reload();
        }
    })

}

