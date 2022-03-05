//GAS: https://script.google.com/home/projects/1FpqqjMCtU8xqs2lS7G-7mPZk61pcJKb2bWyHBsWZMBIYci0fdv0V4dND/edit

const endpoint = "https://script.google.com/macros/s/AKfycbxnrhl2fZn4Udk9Xqg8rHOFZrrAuHGaqRbzL8vPjzHe8PUpRRZq2bjyXXmcmYiRuoHxaQ/exec"
const output = document.querySelector('.output');
const btn_holder = document.querySelector('.drug-button-holder');
const c_result = document.querySelector('.calculation-result');
const input = document.querySelector('.weight');
const adjust_field = document.querySelector('.adjust-dosage');
const drug_list = ['Ketamine > 20 kg', 'Alphaxalone < 20 kg', 'Propofol > 20 kg', 'Alphaxalone > 20 kg', 'Ketamine < 20 kg', 'Propofol < 20 kg', 'Butorphanol < 20 kg', 'Butorphanol >20kg', 'Fentanyl > 20 kg', 'Fentanyl < 20 kg', 'Hydromorphone > 20 kg', 'Hydromorphone < 20 kg', 'Methadone > 20 kg', 'Methadone < 20 kg', 'Midazolam', 'Dexmedetomidine > 20', 'Dexmedetomidine < 20', 'Acepromazine  > 20 kg', 'Acepromazine  < 20 kg'];
//run getMedList() in console to update

//add body surface area after UI is okay
//add 常用組合（ex for 胰臟炎）

printButtons();

function printButtons(){
    drug_list.forEach(drug => addDrugButton(drug));
    const btns = document.querySelectorAll('button');
    // btn.addEventListener('click',function(){fetchEndpointData()})
    console.log(btns);
    btns.forEach(btn => btn.addEventListener('click',function(){
        postDataToEndpoint(btn.id);
    }));   
}


function getMedList(){
    fetch(endpoint)
        .then(res => res.json())
        .then (data => {
            console.log(data.med_list);
        })
}   


function postDataToEndpoint(drug_name){
    showLoading();
    const myobj = {name:drug_name};
    fetch(endpoint, {
        method: 'POST',
        body: myobj.name
    })
        .then(res => res.json())
        .then (data => {
            data.weight = input.value;
            console.log(data);
            console.log(JSON.stringify(data));
            //add null error
            try{
                var adjust = document.querySelector(".adjust-field");
                adjust.value = "";
                adjust.placeholder = data.prefer_dosage;
            }
            finally{
                showDrugData(data);
                calculateDosage(data, data.prefer_dosage);
                addDosageAdjustField(data);
                input.addEventListener("input",function(){calculateDosage(data)})
            }
        })
    }   

function addDosageAdjustField(data){
    var newDosageInput = document.createElement('input');
    newDosageInput.setAttribute("type", 'number');
    newDosageInput.setAttribute("placeholder", 'Type new dosage here');
    // newDosageInput.setAttribute("value", data.prefer_dosage);
    newDosageInput.setAttribute("class", "adjust-field mt-8 sm:flex items-center w-72 text-left space-x-3 px-4 h-12 ring-1 ring-slate-900/10 rounded-lg text-slate-400");

    adjust_field.replaceWith(newDosageInput);
    
    newDosageInput.addEventListener("input",function(){
        data.weight = input.value;
        data.prefer_dosage = newDosageInput.value;
        calculateDosage(data);
    });
}

function addDrugButton(drug){
    var btn = document.createElement('button');
    const newContent = document.createTextNode(drug);
    btn.setAttribute("class", 'text-sm text-black  font-semibold h-6 px-4 m-1 rounded-lg items-center sm:w-auto ring-1 ring-gray-500	 ')
    btn.setAttribute("id", drug);
    btn.appendChild(newContent);
    btn_holder.appendChild(btn);

}

function calculateDosage(data){
    data.weight = input.value;
    var dosage = data.weight*parseFloat(data.prefer_dosage)/parseFloat(data.density);
    c_result.innerHTML = `<div class="calculate_result">dosage:${dosage.toFixed(2)} ml</div>`
    console.log(`Dosage:${dosage},WEIGHT: ${data.weight} * prefer_dosage:${data.prefer_dosage} / Density:${data.density}`)
}

function showLoading(){
    output.innerHTML = `<div>Loading....</div>`
}

function showDrugData(data){
    //TODO: 把資料在ＧＡＳ先處理好
    output.innerHTML = `<a class="mb-2 text-xl font-bold underline">${data.medicine_name}</a><ul class="list-disc"><li>Dosage: ${data.dosage}</li><li>Prefer Dosage: ${data.prefer_dosage}</li><li>Injection way: ${data.injection_way}</li><li>Density: ${data.density}</li></ul>`;

}

function fetchEndpointData(){
    console.log("clicked!!")
    fetch(endpoint)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            printNeededData(data);
        })
}
