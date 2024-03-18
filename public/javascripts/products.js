
async function selectBrand(brandId, brandName){
    $("#selectedBrand").val(brandId); // Storing the value of the dropdown item when creating new product
    $("#brandDropdown").html(brandName)
}

async function selectCategories(categoryId, categoryName) {
    $("#selectedCategory").val(categoryId); // Storing the value of the dropdown item when creating new product
    $("#categoryDropdown").html(categoryName)
}


async function createProduct() {
    let Name = $("#Name").val();
    let Description = $("#Description").val();
    let UnitPrice = $("#Price").val();
    let imgurl = $("#Imgurl").val();
    let Quantity = $("#Quantity").val();
    let BrandId = $("#selectedBrand").val();
    let CategoryId = $("#selectedCategory").val();
    
    axios.post("/products", {
        Name: Name,
        Description: Description,
        UnitPrice: UnitPrice,
        imgurl: imgurl,
        Quantity: Quantity,
        BrandId: BrandId,
        CategoryId: CategoryId
    }).then( (res) => {
        if ( res.data.data.StatusCode !== 200) {
            alert(res.data.data.Results)
        } else {
            window.location.reload();
        }
    })
}


async function updateProduct(jsonProduct, key) {
    const updatedField = prompt("Enter new data: ")
    let product = JSON.parse(jsonProduct)
    product[key] = updatedField;

    axios.put("/products", product).then( (res) => {
        if ( res.data.data.StatusCode !== 200) {
            alert(res.data.data.Results)
        } else {
            window.location.reload();
        }
    })
}

async function updateBrandOrCategory(id, jsonProduct, key){
    const product = JSON.parse(jsonProduct)
    product[key] = id;

    axios.put("/products", product).then( (res) => {
        if ( res.data.data.StatusCode !== 200) {
            alert(res.data.data.Results)
        } else {
            window.location.reload();
        }
    }) 
}


async function deleteProduct(jsonProduct) {
    const product = JSON.parse(jsonProduct);

    axios.delete("/products", {data: { id: product.id}}).then( (res) => {
        if ( res.data.data.StatusCode !== 200) {
            alert(res.data.data.Results)
        } else {
            window.location.reload();
        }
    })
}

async function searchFunction() { // Trying to add search functions to my product page
    let userSearch = $("#search").val();

    
    window.location.href = `/admin/products/${userSearch}`
}


