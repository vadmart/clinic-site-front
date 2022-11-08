const patient_doctor = {
    "Мартов Вадим": "Тезер Аліна Олександрівна",
    "Раптовий Лев": "Лозовий Павло Викторович"
}


const name_field = document.getElementById("firstname");
const lastname_field = document.getElementById("lastname");
const family_doctor = document.getElementById("family-doctor");

var name = "";
var lastname = "";


name_field.addEventListener("change", (e) => {
    name = name_field.value;
    changeText();
})

lastname_field.addEventListener("change", (e) => {
    lastname = lastname_field.value;
    changeText();
})

function changeText() {
    if (name.length > 0 && lastname.length > 0 && typeof patient_doctor[lastname + " " + name] === "string") {
        family_doctor.innerText = patient_doctor[lastname + " " + name];
        family_doctor.style.color = "#000";
        family_doctor.style.fontStyle = "inherit";
    }
    else {
        family_doctor.innerText = "не визначено";
        family_doctor.style.color = "";
        family_doctor.style.fontStyle = "";
    }
}
