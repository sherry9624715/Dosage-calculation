//GAS: https://script.google.com/home/projects/1FpqqjMCtU8xqs2lS7G-7mPZk61pcJKb2bWyHBsWZMBIYci0fdv0V4dND/edit

const endpoint = "https://script.google.com/macros/s/AKfycbyCE8THCb3af17Q0qLOeayKFSlxVQg2yQNZ6sd1jjy51N8I98cdaKr0FXySNt92qfQG/exec"
const post_endpoint = "https://script.google.com/macros/s/AKfycbwca8wUcnMhksKgfx3hw6b-tLnfdRqrAJ5hsnn2xX6x6-9uBD1hXCx6tLb_d7-aOuG7tg/exec"
const drug_list = ["drug","Midazolam","yao"];
const output = document.querySelector('.output');
const btn_holder = document.querySelector('.drug-button-holder');
const c_result = document.querySelector('.calculation-result');
const input = document.querySelector('.weight');


drug_list.forEach(drug => {
    var btn = document.createElement('button');
    const newContent = document.createTextNode(drug);
    btn.setAttribute("id", drug);
    btn.appendChild(newContent);
    btn_holder.appendChild(btn);
});

const btns = document.querySelectorAll('button');
// btn.addEventListener('click',function(){fetchEndpointData()})
console.log(btns);
btns.forEach(btn => btn.addEventListener('click',function(){postDataToEndpoint(btn.id)}));

function calculateDosage(data){
    var dosage = data.results[0].properties.dosage_mgkg.rich_text[0].plain_text;
    var prefer_dosage = data.results[0].properties.prefer_dosage.rich_text[0].plain_text;
    var density = data.results[0].properties.density_mgml.number;
    var weight = input.value;
    var dosage = weight*parseFloat(prefer_dosage)/parseFloat(density);
    c_result.innerHTML = `<div>weight:${dosage} ml</div>`
}

function postDataToEndpoint(drug_name){
    showLoading();
    const myobj = {name:drug_name};
    fetch(post_endpoint, {
        method: 'POST',
        body: myobj.name
    })
        .then(res => res.json())
        .then (data => {
        console.log(data);
        console.log(JSON.stringify(data));
        printNeededData(data);
        showDrugData(data);
        calculateDosage(data);
        })
        
}
function showLoading(){
    output.innerHTML = `<div>Loading....</div>`
}

function showDrugData(data){
    var dosage = data.results[0].properties.dosage_mgkg.rich_text[0].plain_text;
    var prefer_dosage = data.results[0].properties.prefer_dosage.rich_text[0].plain_text;
    var injection_way = [];
    var injection_way_raw_array = data.results[0].properties.injection_way.multi_select;
    injection_way_raw_array.forEach(element => injection_way.push(element.name));
    var medicine_name = data.results[0].properties.medicine_name.title[0].plain_text;
    var density = data.results[0].properties.density_mgml.number;

    output.innerHTML = `<ul><li>Dosage:${dosage}</li><li>Prefer Dosage:${prefer_dosage}</li><li>Injection way:${injection_way}</li><li>Medicine Name:${medicine_name}</li><li>Density:${density}</li></ul>`;
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

function printNeededData(data){
    var dosage = data.results[0].properties.dosage_mgkg.rich_text[0].plain_text;
    console.log(`dosage:${dosage}`);
    
    var prefer_dosage = data.results[0].properties.prefer_dosage.rich_text[0].plain_text;
    console.log(`prefer dosage:${prefer_dosage}`);
    
    var injection_way = [];
    var injection_way_raw_array = data.results[0].properties.injection_way.multi_select;
    injection_way_raw_array.forEach(element => injection_way.push(element.name));
    console.log(injection_way);
    
    var medicine_name = data.results[0].properties.medicine_name.title[0].plain_text;
    console.log(`medicine name:${medicine_name}`);
    
    var density = data.results[0].properties.density_mgml.number;
    console.log(`density:${density}`);
    //TODO: need solution for null value
}
