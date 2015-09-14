'use strict';

$(document).on('click',function(){
    $('.collapse').collapse('hide');
})


function addChar(input, character) {
    input.value += character;
    $('#latex-display').focus();
}

function fromresults(result) {
    var latex_display = document.getElementById('latex-display');
    latex_display.value += result;

}


function cos(form) {
    form.latex.value += 'cos(';
    $('#latex-display').focus();
}

function sin(form) {
    form.latex.value += 'sin(';
    $('#latex-display').focus();
}

function tan(form) {
    form.latex.value += 'tan(';
    $('#latex-display').focus();
}

function sqrt(form) {
    form.latex.value += 'sqrt(';
    $('#latex-display').focus();
}

function cube(form) {
    form.latex.value += '^3';
    $('#latex-display').focus();
}

function left_bracket(form) {
    form.latex.value += '(';
    $('#latex-display').focus();
}


function right_bracket(form) {
    form.latex.value += ')';
    $('#latex-display').focus();
}

function divide(form) {
    form.latex.value += '/';
    $('#latex-display').focus();
}


function deleteChar(input) {
    input.value = input.value.substring(0, input.value.length - 1);
    $('#latex-display').focus();
}

function changeSign(input) {
    if(input.value.substring(0, 1) == '-')
        input.value = input.value.substring(1, input.value.length);
    else
        input.value = '-' + input.value;
}



function compute(form) {

    var math_result = math.eval(form.latex.value);

    // math_result = numeral(math_result).format('0.[000000000');
    // form.latex.value = form.latex.value.replace(/[\/]/g, '\\over');
    form.latex.value = form.latex.value.replace(/[(]/g, '{(');
    form.latex.value = form.latex.value.replace(/[)]/g, ')}');

    $('.calc-entries tbody').append('<tr><td>' + '\\(' + form.latex.value + '\\)' + '</td><td class="calc-result" onclick="fromresults($(this).text());">' + math_result + '</td><td class="delete-row" onclick="$(this).parent().remove()"><i class="fa fa-trash-o"></i></td></tr>');
    form.latex.value = math_result;
    MathJax.Hub.Queue(['Typeset',MathJax.Hub]);

    $('#latex-display').focus();
}


function checkNum(str) {
    for (var i = 0; i < str.length; i++) {
        var ch = str.substring(i, i+1);
        if ((ch < '0' || ch > '9') && (ch < 'a' || ch > 'z')) {
            if (ch != ' ' && ch != '/' && ch != '*' && ch != '+' && ch != '-' && ch != '.' && ch != '^' && ch != '(' && ch!= ')' && ch != '{' && ch!= '}') {
                alert('invalid entry!');
                return false;
                }
            }
        }
        return true;
}

function clearHistory() {
    $('.calc-entries tbody tr').remove();
}



