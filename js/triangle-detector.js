var triangleDetector = function () {

	var settings = {
		selectors: {
			form: 'js-ui-form',
			errorDescList: '.ts-errors',
			errorLabel: '.ts-error'
		},
		classNames: {
			errorList: 'ts-errors',
			error: 'ts-error'
		},
		errorMsg: 'Please provide a number for the length of the triangle\'s side'
	};

	function sendForm() {
		var form = document.getElementsByClassName(settings.selectors.form)[0];
		var values = processForm(form);
		var errorMsgs = validateValues(values);
		var fieldsets = form.querySelectorAll('fieldset');
		var errors = form.querySelectorAll(settings.selectors.errorDescList);

		if (errors.length) {
			cleanUpErrors(errors);
		}

		if (errorMsgs.some(isDefined)) {
			for (var i = 0; i < fieldsets.length; i++) {
				var error = errorMsgs[i];
				var fieldset = fieldsets[i];
				if (error) {						
					addErrorToFieldset(fieldset, errorMsgs[i]);
				}
			}
		} else {
			var type = getTriangleType(values, isEqual);
			var dimensions = values.join(', ');

			ts.ui.Notification.info('A triangle with the dimensions '+ dimensions + ' is ' + type + '.', {
				onaccept: function() {
					[].forEach.call(form.querySelectorAll('input'), function removeValue(input) {
						input.value = null;
					});
				}
			});
		}
	}

	function isDefined(item) {
		return item !== null;
	}

	function getTriangleType(values) {
		var sideA = values[0];
		var sideB = values[1];
		var sideC = values[2];
		var type = null;

		if (isEqual(sideA, sideB) && isEqual(sideA, sideC)) {
			type = 'equilateral';
		} else if (isEqual(sideA, sideB) || isEqual(sideA, sideC) || isEqual(sideB, sideC)) {
			type = 'isosceles';
		} else {
			type = 'scalene';
		}

		return type;
	}

	function isEqual(a, b) {
		return (a === b) ? true : false;
	}

	function processForm(form) {
		var values = [];

		for (var i = 0; i < form.elements.length; i++) {
			var el = form.elements[i]; 
			if (el.nodeName === 'INPUT') {
				values.push(el.value);
			}
		}
		return values; 
	}

	function validateValues(values ) {
		return values.map(function(value) {
			var error = null; 
			if (!value.length) {
				error = settings.errorMsg;
			}
			return error;
		})
	}

	function addErrorToFieldset(fieldset, errorMsg) {

		var label = fieldset.querySelector('label');
		label.classList.add(settings.classNames.error);

		var descList = document.createElement('dl');
		var descTerm = document.createElement('dt');
		var term = document.createTextNode(label.textContent);
		var descValue = document.createElement('dd');
		var value = document.createTextNode(errorMsg);

		descTerm.appendChild(term);
		descValue.appendChild(value);
		descList.appendChild(descTerm);
		descList.appendChild(descValue);
		descList.classList.add(settings.classNames.errorList);
		fieldset.appendChild(descList);
	}

	function cleanUpErrors(errors){
		[].forEach.call(errors,function(e){
			var fieldset = e.parentNode;
			fieldset.removeChild(e);
			fieldset.querySelector('label').classList.remove(settings.classNames.error);
		});
	}

	return {
		sendForm: sendForm
	};
}