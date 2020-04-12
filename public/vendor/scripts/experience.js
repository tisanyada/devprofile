const currentID = document.getElementById('current');

const changeCurrent = currentID.addEventListener('click', ()=>{
    const newId = true;
    currentID.innerHTML = newId;
});


changeCurrent();