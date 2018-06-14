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
        return /^[1][0-9]{10}$/i.test(value);
    }
}

function trim(str){
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
module.exports = {
    validate: validate
}
