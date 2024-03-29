import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;
// Below function is for bot thinking ....
function loader(element){
    element.textContent = '';

    loadInterval = setInterval(() => {
        element.textContent += '.';

        if (element.textContent === '....'){
            element.textContent = '';
        }
    }, 300)
}
// below function is for present word by word output
function typeText(element, text){
    let index = 0;

    let interval =  setInterval(() => {
        if (index < text.length){
            element.innerHTML += text.charAt(index);
            index++;

            element.parentElement.parentElement.parentElement.scrollTop = element.parentElement.parentElement.parentElement.scrollHeight;
        }
        else{
            clearInterval(interval);
        }
    },50)
}
// Generating Unique id for every message
function generateUniqueId(){
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}
//function for load image either ai or human
function chatStripe (isAi, value, uniqueId){
    return (
        `
        <div class = "wrapper ${isAi && 'ai'}">
            <div class ="chat">
                <div class = "profile">
                <img
                    src="${isAi ? bot : user}"
                    alt= "${isAi?'bot' : 'user'}"
                />
                </div>
                <div class="message" id = ${uniqueId}>${value}</div>
            </div>
        </div>
        `
    )
}

const handleSubmit = async(e) => {
    e.preventDefault();

    const data = new FormData (form);
    // Users Chatstripe
    chatContainer.innerHTML += chatStripe (false, data.get('prompt'));
    // console.log(chatContainer);
    form.reset();

    //bot chatstripe
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe (true, " ", uniqueId);

    chatContainer.scrollTop = chatContainer.scrollHeight;

    const messageDiv = document.getElementById(uniqueId);

    loader(messageDiv);

    //Fetch data from server -> bot's response

    const response = await fetch('https://chatbotai-pj0m.onrender.com/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    clearInterval(loadInterval);
    messageDiv.innerHTML = '';

    if(response.ok){
        const data = await response.json();
        const parsedData = data.bot.trim();

        typeText(messageDiv, parsedData);
        
    }else{
        const err = await response.text();

        messageDiv.innerHTML = "Someting went wrong";

        alert(err);
    }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
    if (e.keyCode ===13){
        handleSubmit(e);
    }
})

