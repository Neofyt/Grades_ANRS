// ============
// VARIABLES
// ============

var tpl,
	option = "<option value='{0}' {2}>{1}</option>",
	defaut,
	others,
	ranges,
	test,
	value,
	grade;


// ============
// HELPERS
// ============

function first(object) {
    for (var key in object) return key;
};

function last(object) {
	var lastKey = "";
	for(var key in object){
	    if(object.hasOwnProperty(key)){
	        lastKey = key;
	    }
	}
	return lastKey;
};

Number.prototype.between = function(min, max){
	return ((this >= min) && (this < max));
};

String.prototype.format = function(){
	var string = this;
	for (var i = 0, j = arguments.length; i < j; i++) {
		string = string.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
	}
	return string;
};

String.prototype.upperCase = function(){
	return this.charAt(0).toUpperCase() + this.substring(1);
};


// ============
// INTERFACE
// ============

function populateTests(){
	tpl = "";
	for (var propertyName in lab) {
		tpl += option.format(propertyName, propertyName.upperCase(), (getHash()[0] == propertyName) ? "selected" : "");
	}
	labtest.innerHTML = tpl;
};

function populateValue(){
	input.value = getHash()[1] || null;
};

function populateUnits(){

	test = labtest.value,
	defaut = lab[test].units.defaut,
	others = lab[test].units.others || null,
	selected = getHash()[2] || null,
	tpl = "";

	tpl += option.format(defaut, units[defaut], (selected == defaut) ? "selected" : "");

	if(others !== null){
		for (var i = 0, length = others.length; i < length; i++) {
			tpl += option.format(others[i], units[others[i]], (selected == others[i]) ? "selected" : "");
		}
	}

	unit.innerHTML = tpl;
};

function setIndicator(value, max){
	indicator.setAttribute("data-width", (value * 100) / max + "%");
};

function setHash(){
	window.location.hash = "!" + labtest.value + "|" + input.value + "|" + unit.value;
};

function getHash(){
	return window.location.hash.replace("#!","").split("|");
};


// ============
// ENGINE
// ============

function convert(sequence, value){
	return conversions[sequence](value);
};

function check(){

	test = labtest.value;
	value = parseFloat(input.value.replace(",","."));

	setHash();
			
	grade = 0;

	convs.innerHTML = "";

	if(!value){
		result.innerHTML = "Merci de renseigner une valeur pour le calcul.";
		indicator.setAttribute("data-width", "");
	} else {

		if(unit.value != lab[test].units.defaut){
			value = convert(unit.value + "-" + lab[test].units.defaut, value);

			convs.innerHTML = "&#9654; " + input.value + " " + units[unit.value] + " = " + value + " " + units[lab[test].units.defaut];
		}

		for (var i = parseInt(first(lab[test].grades)), j = parseInt(last(lab[test].grades)) + 1; i < j && grade == 0; i++) {

			ranges = lab[test].grades[i].split("-");

			if ((!ranges[0] && value < ranges[1]) || (!ranges[1] && value >= ranges[0]) || (value.between(ranges[0], ranges[1]))){
				grade = i;
			}
		}

		if (grade > 0){
			result.innerHTML = "Grade " + grade + " (" + lab[test].grades[grade] + " " + units[lab[test].units.defaut] + ")";
		} else {
			result.innerHTML = "Pas de grade disponible pour cette valeur."
		}

		setIndicator(grade, parseInt(last(lab[test].grades)));
	}
};


// ===================
// RUN YOU CLEVER BOY
// ===================

populateTests();
populateValue();
populateUnits();
check();