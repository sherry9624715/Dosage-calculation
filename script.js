//GAS: https://script.google.com/home/projects/1FpqqjMCtU8xqs2lS7G-7mPZk61pcJKb2bWyHBsWZMBIYci0fdv0V4dND/edit

const endpoint = "https://script.google.com/macros/s/AKfycbyCE8THCb3af17Q0qLOeayKFSlxVQg2yQNZ6sd1jjy51N8I98cdaKr0FXySNt92qfQG/exec"
const post_endpoint = "https://script.google.com/macros/s/AKfycbxuzR3Ctz4_FMg2mFVApyttIWzpjXp1uHcpzwLVjjbhz7VoBl3qJuf5wRuplfVzBj7Phg/exec"
const output = document.querySelector('.output');
const btn = document.querySelector('button');
console.log(btn);

// btn.addEventListener('click',function(){fetchEndpointData()})
btn.addEventListener('click',function(){postDataToEndpoint()})

function postDataToEndpoint(){
    const myobj = "Midazolam";
    fetch(post_endpoint, {
        method: 'POST',
        body: JSON.stringify(myobj)
    })
        .then(res => res.json())
        .then (data => {
        console.log(JSON.stringify(data));
        })
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

