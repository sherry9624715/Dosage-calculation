//GAS: https://script.google.com/home/projects/1FpqqjMCtU8xqs2lS7G-7mPZk61pcJKb2bWyHBsWZMBIYci0fdv0V4dND/edit
//Github Live: https://sherry9624715.github.io/Dosage-calculation/

const endpoint = "https://script.google.com/macros/s/AKfycbxkte5n1Q8X3bYrqxYEXGFw33FcF0k4pZ3tOipt7hoRU1g698Y8pGniEJvbkIpTwLb50g/exec"

const output = document.querySelector('.output');
const btn_holder = document.querySelector('.drug-button-holder');
const weight_input = document.querySelector('.weight');
const cards_holder = document.querySelector('.cards-holder');
const species_toggle = document.querySelector('input[type=checkbox]')

const drug_list = {"med_list":[{"name":"Propofol_cat","species":["cat"]},{"name":"Dexmedetomidine_cat","species":["cat"]},{"name":"Acepromazine_cat","species":["cat"]},{"name":"Ketamine>20","species":["dog"]},{"name":"Alphaxalone<20","species":["dog","cat"]},{"name":"Propofol>20","species":["dog"]},{"name":"Alphaxalone>20","species":["dog"]},{"name":"Ketamine<20","species":["dog","cat"]},{"name":"Propofol<20","species":["dog"]},{"name":"Butorphanol<20","species":["dog","cat"]},{"name":"Butorphanol>20","species":["dog"]},{"name":"Fentanyl>20","species":["dog"]},{"name":"Fentanyl<20","species":["dog","cat"]},{"name":"Hydromorphone>20","species":["dog"]},{"name":"Hydromorphone<20","species":["dog","cat"]},{"name":"Methadone>20","species":["dog"]},{"name":"Methadone<20","species":["dog","cat"]},{"name":"Midazolam","species":["dog"]},{"name":"Dexmedetomidine>20","species":["dog"]},{"name":"Dexmedetomidine<20","species":["dog"]},{"name":"Acepromazine>20","species":["dog"]},{"name":"Acepromazine<20","species":["dog"]}]};
//run getMedList() in console to update drug list

//TODO list:
//add lb <---> kg
//add button toggle

//PO xxkg~xxkg Ns 
//PO xxkg 0.25 0.5 reset

//add auto filter <20, >20 (show button after weight entered)
//bugged when press one drug 2 times
//add body surface area
//add 常用組合（ex for 胰臟炎）
//add pull down to reload
//icon for homepage
var species = "dog"


species_toggle.addEventListener("input",()=>{
    if(species_toggle.checked){
        species = "cat";
    }else{
        species = "dog";
    }
    btn_holder.innerHTML = "";
    cards_holder.innerHTML = "";
    printButtons(species);
    console.log(species_toggle.checked)
})


printButtons(species);

function printButtons(species){
    drug_list.med_list.forEach(drug => {
        if(drug.species.includes(species)){
            // drug.species.indexOf(species)
            // console.log(`index of ${drug.name} is ${drug.species.indexOf(species)}`)
            addDrugButton(drug.name)
        }else{
            console.log(`${drug.name} cannot applied to ${species}`)
        }
    });
    const btns = document.querySelectorAll('button');
    btns.forEach(btn => btn.addEventListener('click',() => postDataToEndpoint(btn.id)));
}

function addDrugButton(drug_name){
    var btn = document.createElement('button');

    var name = document.createTextNode(drug_name);
    btn.appendChild(name);

    btn.setAttribute("class", 'drug-button bg-slate-400 text-sm text-black font-semibold h-6 px-4 m-1 rounded-lg items-center sm:w-auto ring-1 ring-gray-500')
    btn.setAttribute("id", drug_name);
    btn_holder.appendChild(btn);
}

function postDataToEndpoint(drug_name){
    const search_index = {name: drug_name};
    fetch(endpoint, {
        method: 'POST',
        body: search_index.name
    })
        .then(res => res.json())
        .then (data => {
            data.weight = weight_input.value;
            console.log(data);
            createNewCard(data);
        })
}   

function createNewCard(data){
    console.log(`Creating card: ${data.medicine_name}`);
    printCard(data);
    addDosageAdjustField(data);
    calculateDosage(data);
}

function printCard(data){
    var card_content = `
    <h2 class="mb-2 text-xl font-bold">${data.medicine_name}</h2>
    <div class="calculate-result"></div>
    <div class="adjust-field"></div>
    <ul class="list-disc pl-5 mb-3">
        <li class="dosage">Dosage: ${data.dosage} mg/kg</li>
        <li class="prefer-dosage">Prefer Dosage: ${data.prefer_dosage} mg/kg</li>
        <li class="injection-way">Injection way: ${data.injection_way}</li>
        <li class="density">Density: ${data.density} mg/ml</li>
    </ul>
    `
    var card_holder= document.createElement('div');
    card_holder.setAttribute("class", "card-holder mb-5 p-8 rounded-xl text-slate-50 bg-slate-500 flex flex-col justify-center relative");
    card_holder.setAttribute("id", `card-${data.medicine_name}`);
    card_holder.innerHTML= card_content;
    console.log(card_holder);
    cards_holder.appendChild(card_holder);
}

function addDosageAdjustField(data){
    var newDosageInput = document.createElement('input');
    newDosageInput.setAttribute("type", 'number');
    newDosageInput.setAttribute("placeholder", 'Update dosage');
    // newDosageInput.setAttribute("value", data.prefer_dosage);
    newDosageInput.setAttribute("class", "adjust-field bg-transparent border-transparent border-b-slate-600 border-4 items-center mr-8 mb-4 text-left space-x-3 h-8 text-slate-100");
    newDosageInput.value = data.prefer_dosage;

    var adjust_field = document.getElementById(`card-${data.medicine_name}`).getElementsByClassName("adjust-field")[0]
    adjust_field.replaceWith(newDosageInput);

    newDosageInput.addEventListener("input",function(){
        data.weight = weight_input.value;
        data.prefer_dosage = this.value;
        calculateDosage(data);
    });

    weight_input.addEventListener("input",function(){
        data.weight = weight_input.value;
        calculateDosage(data);
    });
}

function calculateDosage(data){
    data.weight = weight_input.value;
    console.log(`Dosage of ${data.medicine_name}:${dosage},WEIGHT: ${data.weight} * prefer_dosage:${data.prefer_dosage} / Density:${data.density}`)
    var dosage = data.weight*parseFloat(data.prefer_dosage)/parseFloat(data.density);

    console.log(data);
    var c_result = document.getElementById(`card-${data.medicine_name}`).getElementsByClassName("calculate-result")[0]
    c_result.innerHTML = `<div class="calculate_result mb-2 text-xl font-bold">${dosage.toFixed(2)} ml</div>`
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
