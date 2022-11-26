class UserInfo {
    constructor(firstName, lastName, patronymic, street, houseNumber, phoneNumber) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.patronymic = patronymic;
        this.street = street;
        this.houseNumber = houseNumber;
        this.phoneNumber = phoneNumber
    }
}



// const family_doctors_info = {
//     : {
//         "лікар": "Тезер Аліна Олександрівна",
//         "вільні-дати-і-часи": {
//             "15.11": ["10:25", "12:25", "17:00"],
//             "16.11": ["9:30", "14:45"]
//         }
//     }
// };


const formFields = {
    firstname: document.getElementById("firstname"),
    lastname: document.getElementById("lastname"),
    street: document.getElementById("street"),
    houseNumber: document.getElementById("house-number"),
    familyDoctor: document.getElementById("family-doctor"),
    phoneNumber: document.getElementById("number"),
    date: document.getElementById("date"),
    time: document.getElementById("time")
};


formFields.street.addEventListener("input", showSchedule);
formFields.houseNumber.addEventListener("input", showSchedule);

const clear = document.getElementById("clear");
clear.addEventListener("click", clearForm);

const submit = document.querySelector("input[type=submit]");
submit.addEventListener("click", submitForm);


function showSchedule(e) {
    // if dict returns value after filling both fields
    clearFields(formFields.time, formFields.date, formFields.familyDoctor);
    var address = formFields.street.value + " " + formFields.houseNumber.value;
    var doctorInfo = family_doctors_info[address.toLowerCase()];
    const plainText = document.createElement("span");
    if (doctorInfo) {
        plainText.innerText = doctorInfo["лікар"];
        plainText.className = "doctor-block";
        formFields.familyDoctor.appendChild(plainText);
        showDateTime(family_doctors_info, address);
    } else {
        plainText.innerText = "не визначено";
        plainText.className = "unknown-block";
        formFields.familyDoctor.appendChild(plainText);
        formFields.date.appendChild(plainText.cloneNode(true));
        formFields.time.appendChild(plainText.cloneNode(true));
    }


}

function clearFields(...fields) {
    for (var field of fields) {
        while (field.firstChild) {
            field.removeChild(field.firstChild);
        }
    }
}

function showDateTime(obj, address) {
    const workDatetimeObj = obj[address.toLowerCase()]["вільні-дати-і-часи"];
    for (var date in workDatetimeObj) {
        // для кожної дати з об'єкта створюємо відповідну кнопку та додаємо у блок дат
        const dateBtn = document.createElement("input");
        dateBtn.type = "button";
        dateBtn.value = date;
        dateBtn.innerText = date;
        dateBtn.className = "date-button";
        formFields.date.appendChild(dateBtn);
        dateBtn.addEventListener("click", showTime);
    }

    function showTime(e) {
        clearFields(formFields.time);
        clearIds(document.getElementsByClassName(e.target.className));
        e.target.id = "active-date";
        // створюємо кнопки із часом та додаємо у блок часів
        for (var time of workDatetimeObj[e.target.value]) {
            const timeBtn = document.createElement("input");
            timeBtn.type = "button";
            timeBtn.value = time;
            timeBtn.innerText = time;
            timeBtn.className = "time-button";
            formFields.time.appendChild(timeBtn);
            timeBtn.addEventListener("click", function (e) {
                clearIds(document.getElementsByClassName(e.target.className));
                e.target.id = "active-time";
            });
        }
    }

    function clearIds(elems) {
        for (var elem of elems) {
            elem.id = "";
        }
    }
}

function submitForm(e) {
    e.preventDefault();
    for (var key in formFields) {
        if (formFields[key].innerText == "") {
            formFields[key].style.backgroundColor = "#f28585";
            return;
        }
    }
    // const date = formFields.date.value.split(".").map((elem) => Number(elem));
    // const time = formFields.time.getElementById("active-time").value.split(":").map((elem) => Number(elem));
    // console.log(date, time);
    // e.preventDefault();
    // const obj = JSON.stringify({
    //     firstName: formFields.firstname.value,
    //     lastName: formFields.lastname.value,
    //     street: formFields.street.value,
    //     house: formFields.street.value,
    //     familyDoctor: formFields.familyDoctor.innerText,
    //     phoneNumber: formFields.phoneNumber.value,
    //     dateTime: new Date(2022, date[1] - 1, date[0], time[0], time[1]),
    //     complaint: document.getElementById("complaint").value
    // });
    // console.log(obj);
}

function clearForm(e) {

    // go through all inner-boxes
    e.preventDefault();
    for (var innerBox of document.getElementsByClassName("inner-box")) {
        var lastElem = innerBox.lastElementChild;
        console.log(lastElem);
        if (lastElem.tagName == "INPUT" || lastElem.tagName == "TEXTAREA") {
            lastElem.value = "";
        } else if (lastElem.tagName = "SPAN") {
            lastElem.innerText = "";
        }
    }
    for (var label of unknownBlocks) {
        label.innerText = "не визначено";
        label.style.fontStyle = "italic";
        label.style.color = "#999";
    }
    window.scrollTo(0, 0);
}
