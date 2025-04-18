function changePropertyImgSrc(imgNumber, newUrl) {
    document.getElementById("p_img_" + imgNumber).src = newUrl;

}

function changePropertyTitle(itemNumber, newName) {
    document.getElementById("p_title_" + itemNumber).textContent = newName;
}

function changePropertyDescription(descriptionNumber, newDescription) {
    document.getElementById("desc_" + descriptionNumber).textContent = newDescription;
}

function changePropertyCity(cityNumber, newCity) {
    document.getElementById("p_city_" + cityNumber).textContent = newCity + ',';
}

function changePropertyState(stateNumber, newState) {
    document.getElementById("p_state_" + stateNumber).textContent = newState;
}

function changePropertyPrice(priceNumber, newPrice) {
    document.getElementById("p_price_" + priceNumber).textContent = formatPrice(newPrice);
}

function changePropertyYear(yearNumber, newYear) {
    document.getElementById("p_year_" + yearNumber).textContent = newYear;
}

function changePropertyButton(buttonNumber, newId) {
    // Add ID and OnClick()
    let button = document.getElementById("btn_" + buttonNumber);

    button.href = `item.html?id=${newId}`;
}

// Item's page

function loadPropertyInfo(propertyObject) {
    document.getElementById('item-thumbnail').src = propertyObject.thumbnail;
    document.getElementById('item-title').textContent = propertyObject.title;
    document.getElementById('item-price').textContent = formatPrice(propertyObject.price);
    document.getElementById('item-city').textContent = propertyObject.city + ',';
    document.getElementById('item-state').textContent = propertyObject.state;
    document.getElementById('item-year').textContent = propertyObject.year;
    document.getElementById('item-description').textContent = propertyObject.description;
    
}

function loadPropertySeller(sellerName) {
    document.getElementById('item-seller').textContent = sellerName;
}


// Formatting
function formatPrice(price) {
    price_string = price.toString();
    let number = '$';
    if (price < 1000) {
        number += price_string;
    } else if (price < 10000) {
        number += price_string[0] + ',' + price_string.slice(1, 4)
    } else if (price < 100000) {
        number += price_string.slice(0, 2) + ',' + price_string.slice(3, 5)
    } else if (price < 1000000) {
        number += price_string.slice(0, 3) + ',' + price_string.slice(3, 6)
    } else if (price < 10000000) {
        number += price_string[0] + ',' + price_string.slice(1, 4) + ',' + price_string.slice(4, 7)
    } else if (price < 100000000) {
        number += price_string.slice(0, 2) + ',' + price_string.slice(2, 5) + ',' + price_string.slice(5, 8)
    } else {
        number += price_string.slice(0, 3) + ',' + price_string.slice(3, 6) + ',' + price_string.slice(6, 9)
    }

    return number;
}

// Insert the DB information

async function getClickedProperty(id) {
    const url = `http://127.0.0.1:8080/properties/${id}`;
    let response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    else {
        let property = await response.json();

        console.log('Property: ')
        console.log(property)

        return property;
    }
}


async function loadFeaturedProperties() {
    const url = 'http://127.0.0.1:8080/featured-properties';
    let response = await fetch(url);
    

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    else {
        let featured_houses = await response.json();

        for (let i = 0; i < 4; i++) {
            changePropertyImgSrc(i+1, featured_houses[i].thumbnail);
            changePropertyTitle(i+1, featured_houses[i].title);
            changePropertyButton(i+1, featured_houses[i].id)
            changePropertyCity(i+1, featured_houses[i].city);
            changePropertyState(i+1, featured_houses[i].state);
            changePropertyPrice(i+1, featured_houses[i].price);
            changePropertyYear(i+1, featured_houses[i].year);
        }
    }
}

async function loadProperty() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    console.log(id);

    // Paste all the data on the DOM
    let response_p = await fetch(`http://127.0.0.1:8080/properties/${id}`);
    if(!response_p.ok) {
        console.log("There was a problem loading the property object.");
    }
    else {
        let [propertyObject] = await response_p.json();

        loadPropertyInfo(propertyObject);
    }

    // Get and paste the Seller's name
    let response_f_n = await fetch(`http://127.0.0.1:8080/firm-name/${id}`);

    if(!response_f_n.ok) {
        console.log("There was a problem loading the firm name object.");
    }
    else {
        let firmNameObject = await response_f_n.json();

        console.log(firmNameObject)
        loadPropertySeller(firmNameObject[0].name);
    }
}

//// CHECK WINDOW AND CALL FUNCTION

if(window.location.href.includes('index')) {
    loadFeaturedProperties();
}

if(window.location.href.includes('item')) {
    window.addEventListener("DOMContentLoaded", () => {
        loadProperty();
    });
}
