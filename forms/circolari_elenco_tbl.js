/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private 
 *
 * @properties={typeid:24,uuid:"3D03AE90-D9ED-4058-864E-CF15DDED8937"}
 */
function stampaCircolare(event) 
{
	var form = forms.crr_stampa_circolari;
		form.controller.readOnly = false;
		
	globals.ma_utl_showFormInDialog(form.controller.getName(), 'Stampa circolare', foundset);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"26FC3F86-1AC6-4E36-833D-772754B738D9"}
 */
function scaricaCircolare(event) 
{
	globals.scaricaCircolare(foundset.idcircolare);
}
