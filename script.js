const controls = document.querySelector('.controls');
const historyElement = document.querySelector('.history');
const historyContainer = document.querySelector('.history__container');
const countries = {
    "en": '🇬🇧',
    "es": '🇪🇸',
    "fr": '🇫🇷',
    "pt": '🇧🇷',
}

let i = 0;

 function createButtons() {
    for (country in countries) {
        let emoji = countries[country];
        controls.innerHTML += `<button class="lang-button" data-lang="${country}">${emoji}</button>`
    }
    controls.innerHTML += '<button class="random-button">❓</button>'
    controls.innerHTML += '<button class="reset-button">❌</button>'
}

createButtons();

const langButtons = document.querySelectorAll('.lang-button');
const textInput = document.querySelector('.text-input');
const translationText = document.querySelector('.translation-text');
const translationFlag = document.querySelector('.translation-flag');
const resetButton = document.querySelector('.reset-button');
const randomButton = document.querySelector('.random-button');

let translationHistory = [];
const storedTranslations = localStorage.getItem('translationHistory');
if (storedTranslations) {
    translationHistory = JSON.parse(storedTranslations);
  }


async function translate(text, lang, flag) {

    const url = `https://api.mymemory.translated.net/get?q=${text}&langpair=it|${lang}`;
    const response = await fetch(url);
    const jsonData = await response.json();
    const result = jsonData.responseData.translatedText;
    console.log(result, flag);
    translationText.innerText = result;
    translationFlag.innerText = flag; 
    
    const historyEntry = {
        input: text,
        output: result,
        paese: lang,  
    };
    translationHistory.push(historyEntry);
    localStorage.setItem('translationHistory', JSON.stringify(translationHistory));
    createHistory();
}

langButtons.forEach(function(langButton){ 
    langButton.addEventListener('click', function() {
        const text = textInput.value.trim();
        const lang = langButton.dataset.lang;
        const flag = langButton.innerText;
        if (text == '' || text == ' ' || text == null) {
            return;
        } else {
        translate(text, lang, flag);
        document.body.style.backgroundImage = `url('./images/${lang}.svg')`;
        }
    });
});

async function randomCountry() {
    const url = 'https://random-word-api.herokuapp.com/all';
    const response = await fetch(url);
    const jsonData = await response.json();
    const list = jsonData;
    console.log(list);
    text = list[(Math.floor(Math.random() * list.length))];
    console.log(text);
    return text;
}

function reset() {
    textInput.value = '';
    translationText.innerText = 'Traduzione';
    translationFlag.innerText = '';
    document.body.style.backgroundImage = '';
}

resetButton.addEventListener('click', reset);
randomButton.addEventListener('click', random);

async function random() {
    let text = await randomCountry();
    const randomLangFlag = getRandomLangFlag();
    lang = randomLangFlag.lang;
    flag = randomLangFlag.flag;
    textInput.value = `${text}`;
    translate(text, lang, flag);
    document.body.style.backgroundImage = `url('./images/${lang}.svg')`;
}

function getRandomLangFlag() {
    const languages = Object.keys(countries);
    const randomIndex = Math.floor(Math.random() * languages.length);
    const randomLang = languages[randomIndex];
    const randomFlag = countries[randomLang];
    return { lang: randomLang, flag: randomFlag };
  }

function createHistory() {
    if (translationHistory.length > 0) {
        historyContainer.style.display = 'block';
        historyElement.innerHTML = '';
        for(i = 0; i < translationHistory.length; i++) {
            original = translationHistory[i].input;
            traduzido = translationHistory[i].output;
            tradLang = translationHistory[i].paese;
            tradFlag = countries[tradLang];
            console.log(original, traduzido)
            historyElement.innerHTML += `<dt>${i+1} - ${original}</dt> <dd> ${tradFlag} - ${traduzido}</dd><br>`
            }             
        } else {
            historyContainer.style.display = 'none';
        }
    }

    createHistory();

    function clearHistory() {
        translationHistory = [];
        localStorage.clear();
        historyElement.innerHTML = '';
        historyContainer.style.display = 'none';
    }