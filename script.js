// Disclaimer: the toHtmlNumericInput isn't my code, it's something I copied from stackoverflow

    // call this function with the id of the input textbox you want to be html-numeric-input
    // by default, decimal separator is '.', you can force to use comma with the second parameter = true
    function toHtmlNumericInput(inputElementId, useCommaAsDecimalSeparator) {
        var textbox = document.getElementById(inputElementId);

        // called when key is pressed
        // in keydown, we get the keyCode
        // in keyup, we get the input.value (including the charactor we've just typed
        textbox.addEventListener("keydown", function _OnNumericInputKeyDown(e) {
            var key = e.which || e.keyCode; // http://keycode.info/

        
            if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
                // alphabet
                key >= 65 && key <= 90 ||
                // spacebar
                key == 32) {
                    e.preventDefault();
                return false;
            }
            
            if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
                // numbers
                key >= 48 && key <= 57 ||
                // Numeric keypad
                key >= 96 && key <= 105 ||

                // allow: Ctrl+A
                (e.keyCode == 65 && e.ctrlKey === true) ||
                // allow: Ctrl+C
                (key == 67 && e.ctrlKey === true) ||
                // Allow: Ctrl+X
                (key == 88 && e.ctrlKey === true) ||
                
                // allow: home, end, left, right
                (key >= 35 && key <= 39) ||
                // Backspace and Tab and Enter
                key == 8 || key == 9 || key == 13 ||
                // Del and Ins
                key == 46 || key == 45) {
                    return true;
            }
            
            
            var v = this.value; // v can be null, in case textbox is number and does not valid
            // if minus, dash 
            if (key == 109 || key == 189) {
                // if already has -, ignore the new one
                if (v[0] === '-') {
                    // console.log('return, already has - in the beginning');
                return false;
            }
            }
            
            if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
                // comma, period and numpad.dot
                key == 190 || key == 188 || key == 110) {
                // console.log('already having comma, period, dot', key);
                if (/[\.,]/.test(v)) {
                    // console.log('return, already has , . somewhere');
                    return false;
                }
            }
            
            if (key == 53 && e.shiftKey === true) {
                return false
            }
        });
            
        textbox.addEventListener("keyup", function _OnNumericInputKeyUp(e) {
            var v = this.value;

            if(false) {
                // if (+v) { 
            // this condition check if convert to number success, let it be
            // put this condition will have better performance
            // but I haven't test it with cultureInfo = comma decimal separator, so, to support both . and , as decimalSeparator, I remove this condition
            //                      "1000"  "10.9"  "1,000.9"   "011"   "10c"   "$10"
            //+str, str*1, str-0    1000    10.9    NaN         11      NaN     NaN
        } else if (v) {
            // refine the value
                        
            // this replace also remove the -, we add it again if needed
                v = (v[0] === '-' ? '-' : '') + 
                (useCommaAsDecimalSeparator ? 
                    v.replace(/[^0-9\,]/g, '') : 
                    v.replace(/[^0-9\.]/g, ''));
                                
                // remove all decimalSeparator that have other decimalSeparator following. After this processing, only the last decimalSeparator is kept.
                if(useCommaAsDecimalSeparator){
                    v = v.replace(/,(?=(.*),)+/g, '');
                } else {
                    v = v.replace(/\.(?=(.*)\.)+/g, '');
                }

                //console.log(this.value, v);
                this.value = v; // update value only if we changed it
            }
        });
    }



const customButton = document.getElementById('custom')
const customInput = document.getElementById('custom-input')
const bill = document.getElementById('bill-amount')
const people = document.getElementById('people-amount')
const buttons = document.querySelectorAll('.buttons')
const tipOptions = document.querySelectorAll('.options')

const tipPerPerson = document.getElementById('tip-amount')
const totalTip = document.getElementById('total-tip')
const resetButton = document.querySelector('.result button')

let totalAmount


// Give selected different color
tipOptions.forEach((tipOption)=> {
    tipOption.setAttribute('onclick', 'activeGiver()')
})

activeGiver = () => {
    tipOptions.forEach((tipOption) => {
        tipOption.classList.remove('active')
        tipOption.addEventListener('click', function(){
            tipOption.classList.add('active')
        })
    })
}


// change from button to input and applies numeric input function
customButton.addEventListener('click', function() {
    customButton.setAttribute('style', 'display: none')
    customInput.setAttribute('style', 'display: inline')
    toHtmlNumericInput('custom-input')
})

// apply numeric input
bill.addEventListener('click', function() {
    toHtmlNumericInput('bill-amount')
})
people.addEventListener('click', function(){
    toHtmlNumericInput('people-amount')
})


// Calculate total tip amount
calculateTip = (tipAmount) => {
    totalAmount = bill.value/100*tipAmount
    console.log(totalAmount)
    totalTip.textContent = `$${totalAmount}`

    perPerson()
    inputCheck()
}

// Calculate per person
perPerson = () => {
    amount = totalAmount/people.value
    tipPerPerson.textContent = `$${amount}`
}


// Add function to buttons so the percentage option can be made
buttons.forEach((button) => {
    button.addEventListener('click', function(){
        calculateTip(button.value)
    })
})

// Same but input
customInput.addEventListener('focusout', function(){
    calculateTip(customInput.value)
})


// Calls perPerson() after amount of people is set
people.addEventListener('focusout', function() {
    perPerson()
})


// Resets values
reset = () => {
    bill.value = '0'
    people.value = '1'
    customInput.value = '0'
    totalTip.textContent = '$0.00'
    tipPerPerson.textContent = '$0.00'
}


// Checker to give reset button class and it's functions
inputCheck = () => {
    if (totalTip.textContent !== '$0.00' && totalTip.textContent !== '$0') {
        resetButton.classList.add('resetActive')
        resetButton.addEventListener('click', function(){
            reset()
            inputCheck()     
        })
    } else {
        resetButton.removeEventListener('click')
    }
}


reset()
inputCheck()