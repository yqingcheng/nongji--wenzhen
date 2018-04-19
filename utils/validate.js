var validate = {
    isEmpty: function (str){
        return !trim(str);
    },
    isNumber: function (str){
        return !isNaN(str);
    },
    isPassword: function(value){
        return  /(?!^\d+$)(?!^[a-zA-Z]+$)^[0-9a-zA-Z]{6,20}$/i.test(value);
    },
    isPhoneNum:function(value){
        return  /^(13[0-9]|15[012356789]|17[1678]|18[0-9]|14[57])[0-9]{8}$/i.test(value);
    }
}

function trim(str){
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
module.exports = {
    validate: validate
}
