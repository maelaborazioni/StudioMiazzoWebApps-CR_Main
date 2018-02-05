/**
 * @properties={type:4,typeid:36,uuid:"7A2B7DA0-3D96-482D-934E-EF116443358B"}
 */
function file_loaded()
{
	if(template) return 1;
	return 0;
}

/**
 * @properties={type:12,typeid:36,uuid:"ABCAAEF6-8968-4608-870A-2373B6F454AE"}
 */
function template_name()
{
	var periodo = globals.toDate(periodoriferimento);
	var annoPeriodo = periodo.getFullYear();
	var mesePeriodo = globals.convertMese(periodo.getMonth() + 1);
	
	return ['PUBLIC.Circolare ' + numero, mesePeriodo, annoPeriodo].join('.');
}


