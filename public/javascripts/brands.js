
async function createBrand() {
    const brand = prompt("Enter name of brand");
    axios.post("/brands", { brand }).then( (response) => {
        if ( response.data.data.StatusCode !== 200 ){
            alert(response.data.data.Results)
        } else {
            window.location.reload();
        }
    })
}

function updatedBrand(id) {
    console.log("wefwef")
    const updatedBrand = prompt("Enter brand name");
    axios.put("/brands", {id, updatedBrand}).then( (response) => {
        if (response.data.data.StatusCode !== 200 ) {
            alert( response.data.data.Results)
        } else {
            window.location.reload();
        }
    })
}

async function deleteBrand(brand) {
    console.log(brand)
    axios.delete("/brands", {
        data: {
            brand: brand
        }
    }).then( (response) => {
        if ( response.data.data.StatusCode !== 200 ) {
            alert(response.data.data.Results)
        } else {
            window.location.reload();
        }
    })
}