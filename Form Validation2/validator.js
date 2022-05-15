function Validator (formSelector, options) {
    if (!options) { options = {}; }

    function getParent(element, selector){

        while(element.parentElement){
            if (element.parentElement.matches(selector)){
                return element.parentElement
            }
            element = element.parentElement
        }
    }

    var formRules = {}
// Quy uoc tao rule
/* 
Neu co loi thi return error message
Neu khong co loi thi return undefined
*/
    var validatorRules = {
        required: function(value){
            return value ? undefined : 'Vui long nhap truong nay'
        },
        email: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : `Vui long nhap email`
        },
        min: function(min){
            return function(value){
                return value.length >= min ? undefined : `Vui long nhap it nhat ${min} ki tu`
            }
        }
    }

    var ruleName = 'required'
    //console.log(validatorRules[ruleName]) --> OK


    // Lay ra form Element trong dom theo `formSelector`
    var formElement = document.querySelector(formSelector);

    // Chi xu ly khi co element trong dom
    if (formElement) { 
        
        var inputs = formElement.querySelectorAll('[name][rules]')
        // console.log(inputs) --> OK
        for (var input of inputs) {

            var rules = input.getAttribute('rules').split('|')
            for (var rule of rules) {

                var ruleInfo
                var isRuleHasValue = rule.includes(':')

                if (isRuleHasValue){
                    ruleInfo = rule.split(':')
                    rule = ruleInfo[0]
                }

                var ruleFunc = validatorRules[rule]

                if (isRuleHasValue){
                    ruleFunc = ruleFunc(ruleInfo[1])
                }

                if (Array.isArray(formRules[input.name])){
                    formRules[input.name].push(ruleFunc)
                } else {
                    formRules[input.name] = [ruleFunc]
                }
            }
            //console.log(formRules) --> OK
            // Lang nghe su kien de validate (blur, change, ...)

            input.onblur = handleValidate;
            input.oninput = handleClearErrors;

        }
        // Ham thuc hien validate
        function handleValidate(event) {
            var rules = formRules[event.target.name];
            var errorMessage;

            for (var rule in rules) {
                errorMessage = rule(event.target.value)
                if (errorMessage) break;
            }
            
            // Neu co loi thi hien thi message loi ra UI
            if (errorMessage) {
                var formGroup = getParent(event.target, '.form-group')
                if (formGroup) {
                    formGroup.classList.add('invalid')
                    var formMessage = formGroup.querySelector('.form-message')
                    
                    if (formMessage) {
                        formMessage.innerText = errorMessage
                    }
                }
            }
            return !errorMessage
        }
        // Ham clear message loi
        function handleClearErrors(event){
            var formGroup = getParent(event.target, '.form-group')
            if (formGroup.classList.contains('invalid')) {
                formGroup.classList.remove('invalid')

                var formMessage = formGroup.querySelector('.form-message')
                    
                    if (formMessage) {
                        formMessage.innerText = ''
                    }

            }
        }
    }

    // Xu ly hanh vi submit formMessage
    formElement.onsubmit = function(event){
        event.preventDefault()

        var inputs = formElement.querySelectorAll('[name][rules]')
        var isValid = true
        for (var input of inputs){
            if (!handleValidate({target: input})) {
                isValid = false
            }
        }

        if (isValid) {
            if (typeof options.onSubmit === 'function') {

                var enabledInput = formElement.querySelectorAll('[name]:not([disabled])')
                var formValues = Array.from(enabledInput).reduce(function(values, input){
                    (values[input.name] = input.value)
                    return values;
                }, {})

                // Goi lai ham onSubmit va tra ve kem gia tri cua form
                options.onSubmit(formValues)
            }
            else {
                formElement.submit()
            }
        }
    }
}
