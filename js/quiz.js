const formTitle = window["form__title"];
const formVariants = window["form__variants"];
const questions = [["Чи слід залишатися вдома під час посилення пандемії COVID-19?", ["radio", "Так", "Ні", "Не можу відповісти"]],
    ["Мінімальна відстань, яку необхідно отримати у відношенні до інших людей", ["radio", "3м - 5м", "0.5м - 1м", "5м - 10м"]]];
const nextButton = document.querySelector(".form__button");
const variantsBlock = document.getElementById("form__variants");
var ind = 1;
getQuestion(questions[0][0], questions[0][1]);


nextButton.addEventListener("click", (e) => {
    getQuestion(questions[ind][0], questions[ind][1]);
    if (ind <= questions.length - 1) {
        e.preventDefault();
        if (ind == questions.length - 1) {
            nextButton.innerText = "Показати результати";
        }
    }
    ind++;
});

function getQuestion(question, variants) {
    clearVariants();
    formTitle.innerText = question;
    for (var i = 1; i < variants.length; i++) {
        const btn = document.createElement("input");
        btn.type = variants[0];
        btn.name = "variant";
        btn.value = variants[i];
        btn.id = `var${i}`;
        const label = document.createElement("label");
        label.innerText = variants[i];
        label.htmlFor = btn.id;
        variantsBlock.appendChild(btn);
        variantsBlock.appendChild(label);
    }
}

function clearVariants() {
    while (formVariants.lastChild) {
        formVariants.removeChild(formVariants.lastChild);
    }
}
