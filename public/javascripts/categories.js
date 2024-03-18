
async function createCategory() {
    const category = prompt("Enter category name")
    axios.post("/categories", {category}).then( (response) => {
        if ( response.data.data.StatusCode !== 200 ) {
            alert(response.data.data.Results)
        } else {
            window.location.reload();
        }
    })
}

async function updateCategory (id) {
    const updatedCategory = prompt("Enter new category name");
    axios.put("/categories", { id, updatedCategory }).then( (response ) => {
        if ( response.data.data.StatusCode !== 200 ) {
            alert(response.data.data.Results)
        } else {
            window.location.reload();
        }
    })
    
}

async function updatedCategory (id) {
    const updatedCategory = prompt("Enter new category name");
    axios.put("/categories", { id, updatedCategory }).then( (response ) => {
        if ( response.data.data.StatusCode !== 200 ) {
            alert(response.data.data.Results)
        } else {
            window.location.reload();
        }
    })
    
}

function deleteCategory(category) {
    axios.delete("/categories", {
        data: {
            category: category
        }
    }).then( (response) => {
        if ( response.data.data.StatusCode !== 200 ) {
            alert(response.data.data.Results)
        } else {
            window.location.reload();
        }
    })
}