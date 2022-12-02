class UserInfo {
    constructor(lastName = "", firstName = "", patronymic = "", streetName = "", houseNumber = "", phoneNumber = "") {
        this.lastName = lastName;
        this.firstName = firstName;
        this.patronymic = patronymic;
        this.streetName = streetName;
        this.houseNumber = houseNumber;
        this.phoneNumber = phoneNumber
    }

    equal(obj) {
        return this.lastName == obj.lastName && this.firstName == obj.firstName && this.patronymic == obj.patronymic && this.streetName == obj.streetName && this.houseNumber == obj.houseNumber && this.phoneNumber == obj.phoneNumber;
    }
}

const familyDoctorsInfo = {
    "Тезер Аліна Іванівна": {
        patients: [new UserInfo("Кефіров", "Олег", "Андрійович", "Чудова", "16Б", "+380661587452")],
        workSchedule: {
            "30.11": ["10:10", "12:30", "15:45", "17:00"],
            "01.12": ["9:30", "14:30"]
        }
    }
}

const form = document.querySelector(".form-container form");

const formFields = {
    firstname: document.getElementById("firstname"),
    lastname: document.getElementById("lastname"),
    patronymic: document.getElementById("patronymic"),
    streetName: document.getElementById("street"),
    houseNumber: document.getElementById("house-number"),
    familyDoctor: document.getElementById("family-doctor"),
    phoneNumber: document.getElementById("number"),
    date: document.getElementById("date"),
    time: document.getElementById("time"),
    complaint: document.getElementById("complaint")
};

// for (var field in formFields) {
//     field.checkValidity();
// }

formFields.firstname.addEventListener("change", showDoctor);
formFields.lastname.addEventListener("change", showDoctor);
formFields.patronymic.addEventListener("change", showDoctor);
formFields.streetName.addEventListener("change", showDoctor);
formFields.houseNumber.addEventListener("change", showDoctor);
formFields.phoneNumber.addEventListener("change", showDoctor);
formFields.complaint.addEventListener("change", checkInvalid);

const clear = document.getElementById("clear");
clear.addEventListener("click", clearForm);

const submitButton = document.getElementById("record");
submitButton.addEventListener("click", submitForm);

function findDoctor(patient) {
    for (let doctor in familyDoctorsInfo) {
        for (let pat of familyDoctorsInfo[doctor].patients) {
            if (pat.equal(patient)) {
                return doctor;
            }
        }
    }
    return null;
}

const errSpan = document.createElement("span");
errSpan.className = "err-msg";
errSpan.innerText = "Поле не може бути порожнім";

function showDoctor(e) {
    console.log(e.target.parentNode);
    checkInvalid(e);
    clearFields(formFields.time, formFields.date, formFields.familyDoctor);
    const patient = new UserInfo(formFields.lastname.value,
        formFields.firstname.value,
        formFields.patronymic.value,
        formFields.streetName.value,
        formFields.houseNumber.value,
        formFields.phoneNumber.value);
    const doctor = findDoctor(patient);
    const plainText = document.createElement("span");
    if (doctor) {
        plainText.innerText = doctor;
        plainText.className = "doctor-block";
        formFields.familyDoctor.appendChild(plainText);
        showDateTime(doctor);
    } else {
        plainText.innerText = "не визначено";
        plainText.className = "unknown-block";
        formFields.familyDoctor.appendChild(plainText);
        formFields.date.appendChild(plainText.cloneNode(true));
        formFields.time.appendChild(plainText.cloneNode(true));
    }

}

function checkInvalid(event) {
    if (!event.target.checkValidity() && !document.querySelector(`#${event.target.parentNode.id} .err-msg`)) {
        event.target.parentNode.append(errSpan.cloneNode(true));
    } else if (event.target.checkValidity() && document.querySelector(`#${event.target.parentNode.id} .err-msg`)) {
        event.target.parentNode.removeChild(document.querySelector(`#${event.target.parentNode.id} .err-msg`));
    }
}

function clearFields(...fields) {
    for (var field of fields) {
        while (field.firstChild) {
            field.removeChild(field.firstChild);
        }
    }
}

function showDateTime(doctor) {
    const workDatetimeObj = familyDoctorsInfo[doctor].workSchedule;
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

    function showTime(e = null) {
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
    showModal();
    const date = document.querySelector(`#date #active-date`).value.split(".").map((elem) => Number(elem));
    const time = document.querySelector(`#time #active-time`).value.split(":").map((elem) => Number(elem));
    console.log(date, time);
    const obj = JSON.stringify({
        firstName: formFields.firstname.value,
        lastName: formFields.lastname.value,
        patronymic: formFields.patronymic.value,
        streetName: formFields.streetName.value,
        houseNumber: formFields.houseNumber.value,
        familyDoctor: formFields.familyDoctor.innerText,
        phoneNumber: formFields.phoneNumber.value,
        dateTime: new Date(2022, date[1] - 1, date[0], time[0] + 2, time[1]),
        complaint: document.getElementById("complaint").value
    });

    function showModal() {
        const modal = document.getElementById("modal-wrapper");
        const closeBtn = document.getElementById("close-button");
        const currPos = window.scrollY;
        modal.style.display = "flex";
        modal.style.top = `calc(${currPos}px + 40vh)`;
        window.addEventListener("scroll", disableScroll);
        closeBtn.addEventListener("click", closeModal);

        function closeModal() {
            window.removeEventListener("scroll", disableScroll);
            modal.style.display = "none";
        }

        function disableScroll() {
            document.body.style.overflow = "hidden";
        }
    }

    console.log(obj);
}

function clearForm(e) {
    // go through all inner-boxes
    e.preventDefault();
    for (var innerBox of document.getElementsByClassName("inner-box")) {
        var lastElem = innerBox.lastElementChild;
        console.log(lastElem);
        if (lastElem.tagName == "INPUT" || lastElem.tagName == "TEXTAREA") {
            lastElem.value = "";
        }
        showDoctor();
    }
    for (var label of unknownBlocks) {
        label.innerText = "не визначено";
        label.style.fontStyle = "italic";
        label.style.color = "#999";
    }
    window.scrollTo(0, 0);
}