//GAS: https://script.google.com/home/projects/1FpqqjMCtU8xqs2lS7G-7mPZk61pcJKb2bWyHBsWZMBIYci0fdv0V4dND/edit

const endpoint = "https://script.google.com/macros/s/AKfycbxnrhl2fZn4Udk9Xqg8rHOFZrrAuHGaqRbzL8vPjzHe8PUpRRZq2bjyXXmcmYiRuoHxaQ/exec"
const output = document.querySelector('.output');
const btn_holder = document.querySelector('.drug-button-holder');
// const c_result = document.querySelector('.calculation-result');
const input = document.querySelector('.weight');
// const adjust_field = document.querySelector('.adjust-dosage');
const drug_list = ['Ketamine>20', 'Alphaxalone<20', 'Propofol>20', 'Alphaxalone>20', 'Ketamine<20', 'Propofol<20', 'Butorphanol<20', 'Butorphanol>20', 'Fentanyl>20', 'Fentanyl<20', 'Hydromorphone>20', 'Hydromorphone<20', 'Methadone>20', 'Methadone<20', 'Midazolam', 'Dexmedetomidine>20', 'Dexmedetomidine<20', 'Acepromazine>20', 'Acepromazine<20'];
const caards_holder = document.querySelector('.cards-holder');
//run getMedList() in console to update

//add lb <---> kg
//add body surface area after UI is okay
//add 常用組合（ex for 胰臟炎）
//add pull down to reload
//bugged when press one drug 2 times

// BUTTON >> 
//     ADD NEW CARD
//         CALCULATE DETAIL
//         ADJUST FIELD
//     WEIGHT FIELD WILL UPDATE ALL CARD

printButtons();

function createNewCard(data){
    var card_list = data;
    console.log(`This card is: ${card_list.medicine_name}`)

    printCard(card_list)

    addDosageAdjustField(card_list);
    calculateDosage(card_list);
    // input.addEventListener("input",function(){calculateDosage(card_list)})
    // wrapper.appendChild(card_html);
}

function updateAllDrugs(){
    
    input.value

}

function calculateDosage(card_list){
    card_list.weight = input.value;
    //if input =/ null, set prefer dosage to input
    console.log(`Dosage of ${card_list.medicine_name}:${dosage},WEIGHT: ${card_list.weight} * prefer_dosage:${card_list.prefer_dosage} / Density:${card_list.density}`)
    var dosage = card_list.weight*parseFloat(card_list.prefer_dosage)/parseFloat(card_list.density);

    console.log(card_list);
    var c_result = document.getElementById(`card-${card_list.medicine_name}`).getElementsByClassName("calculate-result")[0]
    c_result.innerHTML = `<div class="calculate_result text-white">dosage:${dosage.toFixed(2)} ml</div>`
}

function printCard(card_list){
    var card_content = `
    <h2 class="mb-2 text-xl font-bold underline">${card_list.medicine_name}</h2>
    <ul class="list-disc pl-5 mb-3">
        <li class="dosage">Dosage: ${card_list.dosage}</li>
        <li class="prefer-dosage">Prefer Dosage: ${card_list.prefer_dosage}</li>
        <li class="injection-way">Injection way: ${card_list.injection_way}</li>
        <li class="density">Density: ${card_list.density}</li>
    </ul>
    <div class="calculate-result"></div>
    <div class="adjust-field"></div>
    `
    var card_holder= document.createElement('div');
    card_holder.setAttribute("class", "card-holder mb-5 p-8 rounded-xl text-slate-50 bg-slate-500 flex flex-col justify-center relative");
    card_holder.setAttribute("id", `card-${card_list.medicine_name}`);
    card_holder.innerHTML= card_content;
    console.log(card_holder);
    caards_holder.appendChild(card_holder);
}

function addDosageAdjustField(data){
    var newDosageInput = document.createElement('input');
    newDosageInput.setAttribute("type", 'number');
    newDosageInput.setAttribute("placeholder", 'Type new dosage here');
    // newDosageInput.setAttribute("value", data.prefer_dosage);
    newDosageInput.setAttribute("class", "adjust-field mt-4 sm:flex items-center w-72 text-left space-x-3 px-4 h-12 ring-1 ring-slate-900/10 rounded-lg text-slate-400");
    newDosageInput.value = data.prefer_dosage;

    var adjust_field = document.getElementById(`card-${data.medicine_name}`).getElementsByClassName("adjust-field")[0]
    adjust_field.replaceWith(newDosageInput);

    newDosageInput.addEventListener("input",function(){
        data.weight = input.value;
        data.prefer_dosage = this.value;
        calculateDosage(data);
    });

    input.addEventListener("input",function(){
        data.weight = input.value;
        calculateDosage(data);
    });
}

function updateDosage(){
    
}

function printButtons(){
    drug_list.forEach(drug => addDrugButton(drug));
    const btns = document.querySelectorAll('button');
    // btn.addEventListener('click',function(){fetchEndpointData()})
    console.log(btns);
    btns.forEach(btn => btn.addEventListener('click',function(){
        postDataToEndpoint(btn.id);
    }));   
}

function postDataToEndpoint(drug_name){
    // showLoading();
    const myobj = {name:drug_name};
    fetch(endpoint, {
        method: 'POST',
        body: myobj.name
    })
        .then(res => res.json())
        .then (data => {
            data.weight = input.value;
            console.log(data);
            createNewCard(data);
        })
    
    }   

function addDrugButton(drug){
    var btn = document.createElement('button');
    const newContent = document.createTextNode(drug);
    btn.setAttribute("class", 'bg-slate-400 text-sm text-black  font-semibold h-6 px-4 m-1 rounded-lg items-center sm:w-auto ring-1 ring-gray-500')
    btn.setAttribute("id", drug);
    btn.appendChild(newContent);
    btn_holder.appendChild(btn);

}

function showLoading(){
    output.innerHTML = `<div>Loading....</div>`
}

function showDrugData(data){
    output.innerHTML = `<div class="items-center mb-2"><a class="mb-2 text-xl font-bold underline">${data.medicine_name}</a></div><div class="place-content-center"><ul class="list-disc"><li>Dosage: ${data.dosage}</li><li>Prefer Dosage: ${data.prefer_dosage}</li><li>Injection way: ${data.injection_way}</li><li>Density: ${data.density}</li></ul></div>`;
}

function getMedList(){
    fetch(endpoint)
        .then(res => res.json())
        .then (data => {
            console.log(data.med_list);
        })
}   
