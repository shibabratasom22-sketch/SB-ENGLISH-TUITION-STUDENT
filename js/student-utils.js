// ============================================
// SB ENGLISH TUITION
// student-utils.js
// Version : 1.0
// Part : 1
// ============================================


// ============================================
// Show Message
// ============================================

function showMessage(element,text,color){

    if(!element){

        return;

    }

    element.textContent = text;

    element.style.color = color;

}


// ============================================
// Clear Message
// ============================================

function clearMessage(element){

    if(!element){

        return;

    }

    element.textContent = "";

}


// ============================================
// Disable Button
// ============================================

function disableButton(button,text){

    if(!button){

        return;

    }

    button.disabled = true;

    button.textContent = text;

}


// ============================================
// Enable Button
// ============================================

function enableButton(button,text){

    if(!button){

        return;

    }

    button.disabled = false;

    button.textContent = text;

}


// ============================================
// Version
// ============================================

console.log(
"student-utils.js v1.0 Loaded"
);
