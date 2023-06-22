import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://grabngo-339fa-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

let itemsArr = []
const app = initializeApp(appSettings)
const database = getDatabase(app)
const itemsListInDB = ref(database, "itemsList")

const inputBtn = document.getElementById("input-btn")
const quantBtn = document.getElementById("quantity-btn")
const addBtn = document.getElementById("add-btn")
const ulEl = document.getElementById("items-list")

onValue(itemsListInDB, function(snapshot){
    if(snapshot.exists()){
        let listOfItems = Object.entries(snapshot.val())
        ulEl.innerHTML = ""
        render(listOfItems)
    }else {
        ulEl.innerHTML = `<li>No items here... yet</li>`
    }
})

function render(items){
     for (let i = 0; i < items.length; i++){
        let currentItem = items[i]
        let currentItemID = currentItem[0]
        let currentItemVal = currentItem[1]
        appendItem(currentItem)
    }
}

addBtn.addEventListener("click", function(){
    let inputValue = [inputBtn.value, quantBtn.value]
    push(itemsListInDB, inputValue)
    inputBtn.value = ""
    quantBtn.value = ""
})

function appendItem(item) {
    let itemID = item[0]
    let itemVal = item[1]

    let newEl = document.createElement("li")
    newEl.textContent = `${itemVal[0]} - Quantity: ${itemVal[1]}`

    newEl.addEventListener("dblclick", function(){
        let exactLocationInDb = ref(database, `itemsList/${itemID}`)
        remove(exactLocationInDb)
    })

    ulEl.append(newEl)
}
