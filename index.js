let cardName; 
let searchButton = document.getElementById("search-button")
var numRows= 0; 
var p1Rows= 0;
var p2Rows= 0; 
var p1ITEMs= [];
var p2ITEMs= [];

// When Search is clicked 
searchButton.onclick = function() {
    document.getElementById("search-results").innerHTML= "";
    cardName= document.getElementById("cname").value;
    lookUp(cardName);
    document.getElementById("cname").value= "";
};


document.getElementById("p1-reset").onclick = function() {
    let length= p1ITEMs.length;
    for (let i= 0; i < length; i++) {
        (document.getElementById(p1ITEMs[0])).selectedIndex= document.getElementById(p1ITEMs[0]).selectedIndex - 1;
        // cell, created, selectId, person, price)
        change(document.getElementById(p1ITEMs[0]).parentNode, true, p1ITEMs[0], "PERSON 1", String(p1ITEMs[0]).substring(p1ITEMs[0].indexOf(":") + 1)); 
    }
};


document.getElementById("p2-reset").onclick = function() {
    let length= p2ITEMs.length;
    for (let i= 0; i < length; i++) {
        (document.getElementById(p2ITEMs[0])).selectedIndex= document.getElementById(p2ITEMs[0]).selectedIndex - 1;
        // cell, created, selectId, person, price)
        change(document.getElementById(p2ITEMs[0]).parentNode, true, p2ITEMs[0], "PERSON 2", String(p2ITEMs[0]).substring(p2ITEMs[0].indexOf(":") + 1)); 
    }
};
// Enter Button --> click search button 
document.addEventListener("keypress", function(event) {
    if (event.key === "Enter" && document.getElementById("cname").value !== "") {
        event.preventDefault();
        searchButton.click();
    }
});

function lookUp (cName) {

    // get the sets of the card 
    fetch("https://api.scryfall.com/cards/search?q="+ cName + "&unique=prints")
    .then(response => {
        if (!response.ok) {
            window.alert("No Card Found");
            throw new Error("work Error");
        }
        return response.json();
    })
    .then(json => {
        // for each set insert an image onto the webpage 
        let index= 0; 
        try {
            json.data.forEach(element => {
                document.getElementById("search-results").innerHTML +=
                "<figure id= \"image"+ index +"\" class= \"IMGfigs\" name=\"" + element.name + ";" + element.set + "\">" + 
                "<img style=\"transform: translateX(6px)\" src=\"" + element.image_uris.small+ "\">" + 
                "<table align= \"center\" style=\"border:solid 1px; background-color: black;\">" +
                "<tr align= \"center\"> <th bgcolor=\"gray\" width=\"70px\"> SET </th> <td bgcolor=\"lightgray\" width=\"70px\">" + element.set + "</td></tr>" + 
                "<tr align= \"center\"> <th bgcolor=\"gray\" width=\"70px\"> NORMAL </th> <td bgcolor=\"lightgray\" width=\"70px\">" + element.prices.usd + "</td></tr>" + 
                "<tr align= \"center\"> <th bgcolor=\"gray\" width=\"70px\"> FOIL </th> <td bgcolor=\"lightgray\" width=\"70px\">" + element.prices.usd_foil + "</td></tr>" + 
                "<tr align= \"center\"> <th bgcolor=\"gray\" width=\"70px\"> ETCHED</th> <td bgcolor=\"lightgray\" width=\"70px\">" + element.prices.usd_etched + "</td></tr>" + 
                "</table>"+
                "<select id= \"selectS\">" + options(element.prices.usd, element.prices.usd_foil, element.usd_etched) +"</select>" +
                "<select id= \"selectP\"> <option>PERSON 1</option> <option> PERSON 2 </option></select>" +
                "<button class=\"addButton\" data-id= \""+ index++ +"\">ADD</button>"
                "</figure>";
            });
        } catch(error) {};

        let buttons= document.getElementsByClassName("addButton");

        for (let i= 0; i < index; i++) {
            buttons[i].addEventListener("click", function(event) {
                let dataID= event.target.getAttribute("data-id");
                let name= document.getElementById("image" + dataID);
                if (String(name.getElementsByTagName("select")[0].value) == "Choose") {
                    window.alert("Please Choose a Card Type.");
                } else {
                    let price; 
                    let status= name.getElementsByTagName("select")[0].value;
                    if (status == "NORMAL") {
                        price= name.getElementsByTagName("td")[1].innerHTML;
                    } else if (status == "FOIL") {
                        price= name.getElementsByTagName("td")[2].innerHTML;
                    } else if (status == "ETCHED") {
                        price= name.getElementsByTagName("td")[3].innerHTML;
                    }
                    addToList(name.getAttribute("name"), status, name.getElementsByTagName("select")[1].value, price, i);
                }
            });
        } 
    });
}

function addToList(name, status, person, price, index) {
    let selectId= "select-" + name + person + index + status + ":" + price;
    selectId= selectId.replaceAll(" ", "-");

    if (p1ITEMs.indexOf(selectId) != -1 || p2ITEMs.indexOf(selectId) != -1) {
        let select= document.getElementById(selectId);
        let index= select.selectedIndex;
        let next= index + 1;

        if (next < select.options.length) {
            select.selectedIndex= next;
            if (person == "PERSON 1" && p1ITEMs.indexOf(selectId) != -1) {
                change(select.parentNode, true, selectId, person, price);
            } else if (person == "PERSON 2" && p2ITEMs.indexOf(selectId) != -1) {
                change(select.parentNode, true, selectId, person, price);
            }
        } else {
            window.alert("MAX QUANTITY SELECTED");
        }
    } else if ((person == "PERSON 1" && p1Rows == numRows) || (person == "PERSON 2" && p2Rows == numRows)) {
        let tableBody= document.getElementById("table-body");

        let newRow= document.createElement("tr");

        let cell1= document.createElement("td");
        let cell2= document.createElement("td");
        let cell3= document.createElement("td");
        let cell4= document.createElement("td");
        let cell5= document.createElement("td");
        let cell6= document.createElement("td");

        if (p1Rows == numRows && person == "PERSON 1") {
            cell1.textContent = String(name) + ";" + String(status);
            cell2.textContent = price;
            change(cell3, false, selectId, person, price);
            p1ITEMs.push(selectId);
            p1Rows++;
            updatePrice(person, price);
        } else if (p2Rows == numRows && person == "PERSON 2"){
            cell4.textContent = String(name) + ";" + String(status);
            cell5.textContent = price;
            change(cell6, false, selectId, person, price);
            p2ITEMs.push(selectId);
            p2Rows++;
            updatePrice(person, price);
        }

        newRow.appendChild(cell1);
        newRow.appendChild(cell2);
        newRow.appendChild(cell3);
        newRow.appendChild(cell4);
        newRow.appendChild(cell5);
        newRow.appendChild(cell6);
        newRow.setAttribute("bgcolor", "gray");
        tableBody.appendChild(newRow);

        numRows++;
    } else {
        if (p1Rows < numRows && person == "PERSON 1") {
            let table= document.getElementById("table-body");
            let rows= table.getElementsByTagName("tr");
            let targetRow; 
            for (let i= 0; i < rows.length; i++) {
                let targetCell= (rows[i].getElementsByTagName("td"))[0];
                if (targetCell.innerHTML == "") {
                    targetRow= rows[i];
                    break;
                }
            }
            
            cells= targetRow.getElementsByTagName("td");
            cells[0].textContent= String(name) + ";" + String(status);
            cells[1].textContent= price;
            change(cells[2], false, selectId, person, price);
            p1ITEMs.push(selectId);
            
            p1Rows++;
            updatePrice(person, price);
        } else if (p2Rows < numRows && person == "PERSON 2"){
            // find empty space 
            let table= document.getElementById("table-body");
            let rows= table.getElementsByTagName("tr");
            let targetRow; 
            for (let i= 0; i < rows.length; i++) {
                let targetCell= (rows[i].getElementsByTagName("td"))[3];
                if (targetCell.innerHTML == "") {
                    targetRow= rows[i];
                    break;
                }
            }
            
            cells= targetRow.getElementsByTagName("td");
            cells[3].textContent= String(name) + ";" + String(status);
            cells[4].textContent= price;
            change(cells[5], false, selectId, person, price);
            p2ITEMs.push(selectId);
            p2Rows++;
            updatePrice(person, price);
        }
    }
    
}

function change(cell, created, selectId, person, price) {
    if (!created) {
        let options= document.createElement("select");
        options.setAttribute("id", selectId);
        options.setAttribute("data-prev", 1);
        
        for (let i= 0; i <= 5; i++) {
            let element= document.createElement("option");
            element.textContent= i; 
            

            if (i == 1) {
                element.setAttribute("selected", true);
            }

            options.appendChild(element);
        } 

        

        options.addEventListener("change", function() {
            change(cell, true, selectId, person, price);
        });

        cell.appendChild(options);
        
    }
    
    let prev= cell.getElementsByTagName("select")[0].getAttribute("data-prev");
    let value= cell.getElementsByTagName("select")[0].value;
    cell.getElementsByTagName("select")[0].setAttribute("data-prev", value);
    let diff = Number(value) - Number(prev);
    if (diff < 0) {
        diff= -1 * diff;
        for (let i= 0; i < diff; i++) {
            updatePrice(person, -1 * price);
        }
        
        if (Number(value) == 0) {
            let tableBody= document.getElementById("table-body");
            let currentRow= cell.parentNode;
            let rows= tableBody.getElementsByTagName("tr");
            let cells= currentRow.getElementsByTagName("td");
            let found= false; 

            for (let i= 0; i < rows.length; i++) {
                if (rows[i] == currentRow) {
                    found= true;
                }
                if (found && i != rows.length-1) {
                    if (person == "PERSON 1") {
                        let nextCells= rows[i + 1].getElementsByTagName("td");
                        if (nextCells[0].innerHTML != "") {
                            cells[0].innerHTML= nextCells[0].innerHTML;
                            cells[1].innerHTML= nextCells[1].innerHTML;
                            let value= nextCells[2].getElementsByTagName("select")[0].value;
                            let id= nextCells[2].getElementsByTagName("select")[0].getAttribute("id");
                            cells[2].innerHTML= nextCells[2].innerHTML;
                            cells[2].getElementsByTagName("select")[0].selectedIndex= value;
                            cells[2].addEventListener("change", function() {
                                change(cell, true, id, person, cells[1].innerHTML);
                            });
                        }
                    } else if (person == "PERSON 2") {
                        let nextCells= rows[i + 1].getElementsByTagName("td");
                        if (nextCells[3].innerHTML != "") {
                            cells[3].innerHTML= nextCells[3].innerHTML;
                            cells[4].innerHTML= nextCells[4].innerHTML;
                            let value= nextCells[5].getElementsByTagName("select")[0].value;
                            let id= nextCells[5].getElementsByTagName("select")[0].getAttribute("id");
                            cells[5].innerHTML= nextCells[5].innerHTML;
                            cells[5].getElementsByTagName("select")[0].selectedIndex= value;
                            cells[5].addEventListener("change", function() {
                                change(cell, true, id, person, cells[4].innerHTML);
                            });
                        }
                    }
                }
                if (found && (i == rows.length-1 || ((rows[i + 1].getElementsByTagName("td"))[0].innerHTML == "" && person == "PERSON 1") || ((rows[i + 1].getElementsByTagName("td"))[3].innerHTML == "" && person == "PERSON 2"))) {
                    let last= rows[i].getElementsByTagName("td");
                    if (person == "PERSON 1") {
                        last[0].innerHTML= "";
                        last[1].innerHTML= "";
                        last[2].innerHTML= "";
                    } else if (person == "PERSON 2") {
                        last[3].innerHTML= "";
                        last[4].innerHTML= "";
                        last[5].innerHTML= "";
                    }
                    
                }          
            }
            if (person == "PERSON 1") {
                p1ITEMs.splice(p1ITEMs.indexOf(selectId),  1);
                p1Rows--;
            } else if (person == "PERSON 2") {
                p2ITEMs.splice(p2ITEMs.indexOf(selectId),  1);
                p2Rows--;
            }
            if ((numRows > p1Rows) && (numRows > p2Rows)) {
                tableBody.removeChild(tableBody.lastChild);
                numRows--;
            }
        } else {
            if (person == "PERSON 1") {
                p1ITEMs.splice(p1ITEMs.indexOf(selectId),  1);
            } else if (person == "PERSON 2") {
                p2ITEMs.splice(p2ITEMs.indexOf(selectId),  1);
            }
        }
    } else if (diff > 0) {
        for (let i= 0; i < diff; i++) {
            if (person == "PERSON 1") {
                p1ITEMs.push(selectId);
            } else if (person == "PERSON 2") {
                p2ITEMs.push(selectId);
            }
            
            updatePrice(person, price);
        }
    }
}

function updatePrice(person, price) {

    let total;
    
    if (person == "PERSON 1") {
        total= document.getElementById("P1-total").innerHTML;
        total= Number(total) + Number(price);
        document.getElementById("P1-total").innerHTML= total.toFixed(2);
    } else if (person == "PERSON 2") {
        total= document.getElementById("P2-total").innerHTML;
        total= Number(total) + Number(price);
        document.getElementById("P2-total").innerHTML= total.toFixed(2);
    }
}

function options(p1, p2, p3) {
    var string= "<option>Choose</option>";
    if (p1 != null) {
        string += "<option>NORMAL</option>"
    }
    if (p2 != null) {
        string += "<option>FOIL</option>"
    }
    if (p3 != null) {
        string += "<option>ETCHED</option>"
    }
    return string;
}