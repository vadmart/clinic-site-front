const URL = "http://localhost:63342/Regional clinic website/info.json";

Object.compare = function (obj1, obj2) {
    for (var el in obj1) {
        if (obj1.hasOwnProperty(el) !== obj2.hasOwnProperty(el)) return false;
        switch (typeof (obj1[el])) {
            case 'object':
                if (!Object.compare(obj1[el], obj2[el])) return false;
                break;
            case 'function':
                if (typeof (obj2[el]) == 'undefined' || (el != 'compare' && obj1[el].toString() != obj2[el].toString())) return false;
                break;
            default:
                if (obj1[el] != obj2[el]) return false;
        }
    }
    for (var elem in obj2) {
        if (typeof (obj1[elem]) == 'undefined') return false;
    }
    return true;
}

const necessaryFields = {
    firstname: document.getElementById("firstname"),
    lastname: document.getElementById("lastname"),
    patronymic: document.getElementById("patronymic"),
    streetName: document.getElementById("street"),
    houseNumber: document.getElementById("house-number"),
    phoneNumber: document.getElementById("number"),
};

for (var elem in necessaryFields) {
    necessaryFields[elem].addEventListener("change", checkInvalid);
    necessaryFields[elem].addEventListener("change", (e) => makeRequest(e, URL));
}

const familyDoctor = document.getElementById("family-doctor");
const date = document.getElementById("date");
const time = document.getElementById("time");

const clear = document.getElementById("clear");
clear.addEventListener("click", clearForm);

const submitButton = document.getElementById("record");
submitButton.addEventListener("click", submitForm);

const complaint = document.getElementById("complaint");

const plainText = document.createElement("span");

const errSpan = document.createElement("span");
errSpan.className = "err-msg";
errSpan.innerText = "Поле не може бути порожнім";


function makeRequest(event, url) {
    var httpRequest = false;
    if (window.XMLHttpRequest) {
        httpRequest = new XMLHttpRequest();
        if (httpRequest.overrideMimeType) {
            httpRequest.overrideMimeType("text/xml");
        }
    } else if (window.ActiveXObject) {
        httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (!httpRequest) {
        alert("Невозможно создать экземпляр класса XMLHTTP");
        return false;
    }
    httpRequest.onreadystatechange = function () {
        getInfo(event, httpRequest);
    };
    httpRequest.open("POST", url);
    httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    httpRequest.send(null);
}

function getInfo(event, httpRequest) {
    try {
        if (httpRequest.readyState == 4) {
            if (httpRequest.status == 200) {
                showDoctor(event, JSON.parse(httpRequest.responseText));
            } else {
                alert("Із запитом виникла проблема");
            }
        }
    } catch
        (e) {
        alert("Произошло исключение " + e.description);
    }
}

function showDoctor(e, doctorData) {
    clearFields(time, date, familyDoctor);
    const patient = {
        "lastName": necessaryFields.lastname.value,
        "firstName": necessaryFields.firstname.value,
        "patronymic": necessaryFields.patronymic.value,
        "streetName": necessaryFields.streetName.value,
        "houseNumber": necessaryFields.houseNumber.value,
        "phoneNumber": necessaryFields.phoneNumber.value
    };
    const doctor = findDoctor(patient, doctorData);
    if (doctor) {
        plainText.innerText = doctor;
        plainText.className = "doctor-block";
        familyDoctor.appendChild(plainText);
        showDateTime(doctorData[doctor]);
    } else {
        plainText.innerText = "не визначено";
        plainText.className = "unknown-block";
        familyDoctor.appendChild(plainText);
        date.appendChild(plainText.cloneNode(true));
        time.appendChild(plainText.cloneNode(true));
    }
}

function findDoctor(patient, doctorData) {
    for (var doctor in doctorData) {
        for (var pat of doctorData[doctor]["patients"]) {
            if (Object.compare(pat, patient)) {
                return doctor;
            }
        }
    }
    return null;
}

function checkInvalid(event) {
    if (!event.target.checkValidity() && !document.querySelector(`#${event.target.parentNode.id} .err-msg`)) {
        event.target.parentNode.append(errSpan.cloneNode(true));
        return false;
    } else if (event.target.checkValidity() && document.querySelector(`#${event.target.parentNode.id} .err-msg`)) {
        event.target.parentNode.removeChild(document.querySelector(`#${event.target.parentNode.id} .err-msg`));
    }
    return true;
}

function clearFields(...fields) {
    for (var field of fields) {
        while (field.firstChild) {
            field.removeChild(field.firstChild);
        }
    }
}

function showDateTime(doctorInfo) {
    const workDatetimeObj = doctorInfo["workSchedule"];
    for (var dt in workDatetimeObj) {
        // для кожної дати з об'єкта створюємо відповідну кнопку та додаємо у блок дат
        const dateBtn = document.createElement("input");
        dateBtn.type = "button";
        dateBtn.value = dt;
        dateBtn.innerText = dt;
        dateBtn.className = "date-button";
        date.appendChild(dateBtn);
        dateBtn.addEventListener("click", showTime);
    }

    function showTime(e = null) {
        clearFields(time);
        clearIds(document.getElementsByClassName(e.target.className));
        e.target.id = "active-date";
        // створюємо кнопки із часом та додаємо у блок часів
        for (var tm of workDatetimeObj[e.target.value]) {
            const timeBtn = document.createElement("input");
            timeBtn.type = "button";
            timeBtn.value = tm;
            timeBtn.innerText = tm;
            timeBtn.className = "time-button";
            time.appendChild(timeBtn);
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
    const form = document.querySelector(".form-container form");
    const dateElem = document.querySelector(`#date #active-date`);
    const timeElem = document.querySelector(`#time #active-time`);
    if (form.checkValidity() && dateElem != null && timeElem != null) {
        showModal();
    } else {
        showModal(false);
        return
    }
    const dt = dateElem.value.split(".").map((elem) => Number(elem));
    const tm = timeElem.value.split(":").map((elem) => Number(elem));
    const obj = JSON.stringify({
        firstName: necessaryFields.firstname.value,
        lastName: necessaryFields.lastname.value,
        patronymic: necessaryFields.patronymic.value,
        streetName: necessaryFields.streetName.value,
        houseNumber: necessaryFields.houseNumber.value,
        phoneNumber: necessaryFields.phoneNumber.value,
        familyDoctor: familyDoctor.innerText,
        dateTime: new Date(2022, dt[1] - 1, dt[0], tm[0] + 2, tm[1]),
        complaint: complaint.value
    });

    function showModal(isValid = true) {
        const popUp = document.getElementById("popup");
        const popupTitle = document.querySelector(".popup__title");
        const popupText = document.querySelector(".popup__text");
        const modalCloseButton = document.querySelector(".popup__close");
        if (!isValid) {
            popupTitle.innerText = "Помилка";
            popupTitle.style.color = "rgb(217, 36, 36)";
            popupText.innerText = "Дані на сервер НЕ відправлені. Перевірте, будь-ласка, правильність введених полів та спробуйте ще";
        } else {
            popupTitle.innerText = "Успіх!";
            popupTitle.style.color = "rgb(36, 217, 36)";
            popupText.innerText = "Запис на прийом вже передано. Скорішого Вам одужання:)";
        }
        popUp.classList.add("open");
        modalCloseButton.addEventListener("click", closeModal)

        function closeModal(e) {
            e.preventDefault();
            popUp.classList.remove("open");
        }
    }
    console.log(obj);
}

function clearForm() {
    clearFields(time, date, familyDoctor, complaint);
    plainText.innerText = "не визначено";
    plainText.className = "unknown-block";
    familyDoctor.appendChild(plainText);
    date.appendChild(plainText.cloneNode(true));
    time.appendChild(plainText.cloneNode(true));
    window.scrollTo(0, 0);
}