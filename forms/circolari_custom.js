/**
 * @type {Date}
 * @properties={typeid:35,uuid:"1C634FD8-5C73-4159-8480-57ECFF30D649",variableType:93}
 */
var vPeriodo = null;

/**
 * @properties={typeid:24,uuid:"1113CEE6-A54E-45F9-A90E-8E56A085A92E"}
 */
function stampaCircolare(event) 
{
	var form = forms.crr_stampa_circolari;
		form.controller.readOnly = false;
		
	globals.ma_utl_showFormInDialog(form.controller.getName(), 'Stampa circolare', foundset);
}

/**
 * @properties={typeid:24,uuid:"B9A24A1D-C9A0-44AC-81EE-9B5DED1EF609"}
 */
function onRecordSelection(event,form)
{
	_super.onRecordSelection(event,form);
	vPeriodo = periodoriferimento && globals.toDate(periodoriferimento);
}

/**
 * @properties={typeid:24,uuid:"A0A25910-8D79-460A-B1E9-10563D96DA94"}
 */
function setDefaults(fs)
{
	fs.anno = globals.TODAY.getFullYear();
	
	var sql = 'SELECT MAX(numero) FROM Circolari WHERE Anno = ?';
	var ds  = databaseManager.getDataSetByQuery(globals.Server.MA_COMUNICAZIONI, sql, [anno], -1);
	
	if(ds && ds.getValue(1, 1))
		fs.numero = ds.getValue(1, 1) + 1;
	
	fs.codice = 'STD';
	vPeriodo = globals.TODAY;
	fs.periodoriferimento = fs.anno * 100 + vPeriodo.getMonth() + 1;
	fs.studio = 1;
}

/**
 * @properties={typeid:24,uuid:"E622DF97-3F97-4426-9887-0B6FE8766510"}
 */
function dc_new_post(fs)
{
	setDefaults(fs);
	return _super.dc_new_post(fs);
}

/**
 * Mostra la dialog per la selezione del file da importare
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"7B636B00-C6BC-4EEB-8DC1-65BC2D334472"}
 */
function caricaFile(event) 
{
	plugins.file.showFileOpenDialog(null, null, false, null,salvaFile, 'Seleziona file da importare');
}

/**
 * @param {Array<plugins.file.JSFile>} files
 *
 * @properties={typeid:24,uuid:"6DB36B33-6D10-4F99-83F8-5BD851DC0C2E"}
 */
function salvaFile(files)
{
	if(files && files[0])
	{
		var file = plugins.file.createTempFile('circolare_temp_' + application.getUUID(), globals.FileExtension.PDF);
			file.setBytes(files[0].getBytes(), true);
		
		var content = plugins.file.readFile(file);
		if (content)
		{
			template = content;
			setStatusSuccess('File caricato correttamente');
		}
		else
			setStatusError('Errore durante il caricamento del file. Contattare lo studio');
	    
	}
}

/**
*
* @properties={typeid:24,uuid:"4447B55D-7B2B-4F9E-8068-3875B4D83956"}
*/
function dc_save_validate(fs,program,multiple,validator)
{
	if(oggetto == null || oggetto == '')
	{
		setStatusError('Inserire una descrizione per l\'oggetto della circolare');
	    return -1;
	}
	
	var success = _super.dc_save_validate(fs,program,multiple,validator) !== -1;
	success = success && template;
	if (!success)
		setStatusError('Il file da caricare è obbligatorio!');
	
	return success ? 0 : -1;	
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"B8DD565E-8DFD-4AD7-BB80-0FC651E816DD"}
 */
function scaricaFile(event)
{
	globals.scaricaCircolare(foundset.idcircolare);
}
