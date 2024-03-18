

async function updateUserOrderStatus( newStatusId, orderNumber ) {
    axios.put("/orders", {orderNumber, newStatusId}).then( (response) => {
        if ( response.data.data.StatusCode !== 200 ) {
            alert(response.data.data.Results);
        } else {
            window.location.reload();
        }
    })

}