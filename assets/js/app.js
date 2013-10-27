// ============
// VARIABLES
// ============

var tpl,
	option = "<option value='{0}'>{1}</option>",
	tr = "<tr><td>{0}<span>{1}</span></td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td></tr>",
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
}

function last(object) {
	var lastKey = "";
	for(var key in object){
	    if(object.hasOwnProperty(key)){
	        lastKey = key;
	    }
	}
	return lastKey;
}

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

String.prototype.truncate = function (length, substitute) {
	return this.length > (length || 30) ? this.substr(0, (length || 30)).replace(/\s$/, '') + (substitute || '…') : this.toString();
}



// ============
// INTERFACE
// ============

function populateTests(){
	tpl = "";
	for (var propertyName in lab) {
		tpl += option.format(propertyName, propertyName.upperCase());
	}
	labtest.innerHTML = tpl;
}

function populateUnits(){

	test = labtest.value,
	defaut = lab[test].units.defaut,
	others = lab[test].units.others || null,
	tpl = "";

	tpl += option.format(defaut, units[defaut]);

	if(others !== null){
		othersUnits = others.match(/\d+/g); 

		for (var i = 0, length = othersUnits.length; i < length; i++) {
			tpl += option.format(othersUnits[i], units[othersUnits[i]]);
		}
	}

	unit.innerHTML = tpl;
}

function populateTable(){
	tpl = "";
	for (var prop in lab) {
		el = lab[prop];
		tpl += tr.format(prop.upperCase().truncate(15), " (" + units[el.units.defaut] + ")", el.grades[1] || "-", el.grades[2] || "-", el.grades[3] || "-", el.grades[4] || "-");
	}
	tbody.innerHTML = tpl;
}

function setIndicator(value, max){
	indicator.setAttribute("data-width", (value * 100) / max + "%");
}



// ============
// ENGINE
// ============

function convert(sequence, value){
	return conversions[sequence](value);
}

function check() {

	test = labtest.value;
	value = parseFloat(input.value);
			
	grade = 0;

	if(!value){
		result.innerHTML = "Merci de renseigner une valeur pour le calcul.";
		convs.innerHTML = "";
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
}


// ===================
// RUN YOU CLEVER BOY
// ===================

populateTests();
populateUnits();
populateTable();
check();