const family_doctors_info = {
  "рибалка 21": {
    "лікар": "Тезер Аліна Олександрівна",
    "вільні-дати-і-часи": [
      "2022-11-15T16:45",
      "2022-11-16T12:10"
    ]
  },
  "Раптовий Лев": "Лозовий Павло Викторович"
};


const address_field = document.getElementById("address");
const family_doctor_label = document.getElementById("family-doctor");
const date_input = document.getElementById("record-date");


address_field.addEventListener("change", function (e) {
    if (family_doctors_info[address_field.value.toLowerCase()]) {
        family_doctor_label.innerText = family_doctors_info[address_field.value.toLowerCase()]["лікар"];
        family_doctor_label.style.fontStyle = "normal";
        family_doctor_label.style.color = "black";
        setDate(family_doctors_info);
    } else {
        family_doctor_label.innerText = "не визначено";
        family_doctor_label.style.fontStyle = "italic";
        family_doctor_label.style.color = "#999";
    }
})

function setDate(obj) {
    var workDatetimes = obj[address_field.value.toLowerCase()]["вільні-дати-і-часи"].sort();
    date_input.value = workDatetimes[0];
}
