const percentages = document.getElementsByClassName("percentage");
const scales = document.getElementsByClassName("scale");

for (var i = 0; i < percentages.length; i++) {
    scales[i].style.width = percentages[i].innerText;
    scales[i].style.backgroundColor = getColor();
}

function getColor() {
    return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
}