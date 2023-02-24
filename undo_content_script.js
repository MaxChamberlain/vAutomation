if(document.querySelectorAll('#new-borderEl-select-framework') && document.querySelectorAll('#new-borderEl-select-framework').length > 0){
    document.querySelectorAll('#new-borderEl-select-framework').forEach((element) => {
        element.remove();
    });
}
if(document.querySelectorAll('#new-borderEl-select-framework-title') && document.querySelectorAll('#new-borderEl-select-framework-title').length > 0){
    document.querySelectorAll('#new-borderEl-select-framework-title').forEach((element) => {
        element.innerText = 'Max Autolytics : Got Vehicle Data. You can now put in Max Autolytics'
        element.style.backgroundColor = 'hsla(103, 100%, 56%, 1)'
        element.style.color = 'black'
        setTimeout(() => element.remove(), 8000)
    });
}