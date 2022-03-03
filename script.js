const endpoint = "https://script.googleusercontent.com/macros/echo?user_content_key=pPE-mribkVd6h-aAff49Ox3AL4iLtykzeDE7gHn8aIc23rLh0yTGOH_BvKna3W9FAoFF1QEmvR2LdqH6AWkQP3EPfNK4AOrIm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnI1YuMnJASWge9fMETO9NUOAGJBRRI1bRajmL4hlTdkR7fhkl9grxXV7PlHBbeW7vOJrFkQWlLvh2ZlyfCl_y-aZYIgnXMHJFdz9Jw9Md8uu&lib=MrkjvEoks_SWqD99E0xcSU7MqtozM3Ode"
const output = document.querySelector('.output');
const btn = document.querySelector('button');
console.log(btn);

btn.addEventListener('click',(e) =>{
    console.log("clicked!!")
    fetch(endpoint)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            var recommand_dosage = response.results[0].properties.dosage-mgkg.rich_text[0].plain_text;
            var 

        })
})