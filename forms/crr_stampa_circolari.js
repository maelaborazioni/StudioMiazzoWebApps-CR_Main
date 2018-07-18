/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"E86DA497-0563-4514-883B-F3DE0F36527F"}
 */
var vContratti = null;

/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"61D4B2AA-96C6-4AED-AA95-8660136FC2CE"}
 */
var vQualifiche = null;

/**
 * @type {Array<Number>}
 * 
 * @properties={typeid:35,uuid:"B6D21CC3-3CDD-4BD0-9E95-6383FD2C8E03",variableType:-4}
 */
var vIDContratti = null;

/**
 * @type {Array<Number>}
 * 
 * @properties={typeid:35,uuid:"0D2CD2F7-F080-4A0C-8704-47DFAA338DF5",variableType:-4}
 */
var vIDQualifiche = null;

/**
 * @type {Array}
 *
 * @properties={typeid:35,uuid:"CB44C12B-25EC-47EB-A670-5FBFAB7DD667",variableType:-4}
 */
var vCompanyIDs = [];

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"953D21FD-DA56-4E99-999C-437E75544149"}
 */
var vOutputMsg = "";

/**
 * @properties={typeid:24,uuid:"D04C20B0-B5E6-4269-8AD7-789718F4D000"}
 * @AllowToRunInFind
 */
function filterDitte(fs)
{
	if(fs)
	{
		// ottenimento dei dati relativi alle ditte alle quali inviare la circolare pubblicandola su MagnaCarta
		var sqlDitteCirc = 'SELECT * FROM F_Ditte_ServizioAl(?,?,?) ORDER BY Codice';
		var arrDitteCirc = [-1,periodoriferimento,2];
		var dsDitteCirc = databaseManager.getDataSetByQuery(globals.Server.MA_ANAGRAFICHE,sqlDitteCirc,arrDitteCirc,-1);
		
		// ottenimento delle ditte avente almeno un lavoratore in forza con i contratti selezionati
		var dsSql = 'SELECT DISTINCT idDitta FROM Lavoratori';
		if(vIDContratti)
			dsSql += ' WHERE CodContratto IN (' + vIDContratti.map(function(cont){ return cont.radicecontratto; }).join(',') +') AND Cessazione IS NULL';
			
		var ds = databaseManager.getDataSetByQuery(globals.Server.MA_ANAGRAFICHE,dsSql,null,-1);
				
		/** @type {JSFoundSet<db:/ma_anagrafiche/ditte>} */
		var ditteFs = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.DITTE);
		if (ditteFs && ditteFs.find())
		{
			ditteFs.idditta                               = ds.getColumnAsArray(1);
			ditteFs.ditte_to_ditte_contratti.codcontratto = vIDContratti  && vIDContratti.map(function(c){ return c.radicecontratto; });
			ditteFs.ditte_to_lavoratori.cessazione        = null;
			ditteFs.ditte_to_lavoratori.codqualifica	  = vIDQualifiche && vIDQualifiche.map(function(q){ return q.radicequalifica; });
			ditteFs.codice                                = dsDitteCirc.getColumnAsArray(1);
			ditteFs.search();
		}
		
		fs.addFoundSetFilterParam('idditta', globals.ComparisonOperator.IN, globals.foundsetToArray(ditteFs, 'idditta'), 'ftr_contratto_qualifica');
	}
	
	return fs;
}

/**
 * @properties={typeid:24,uuid:"703A9795-97BE-488F-A2AC-4732DF6154FE"}
 * @AllowToRunInFind
 */
function updateDitte(ditte)
{
	if(ditte)
	{
		var fs = forms[elements.ditta_tabless.getTabFormNameAt(1)].foundset;
		if (fs && fs.find())
		{
			fs['idditta'] = ditte;
			fs.search();
		}
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"A44BB19C-E9DF-46F1-91E7-2BB6620DA572"}
 */
function selectAllCompanies(event) 
{
	/** @type {JSFoundset} */
	var fs = forms[elements.ditta_tabless.getTabFormNameAt(1)].foundset;
		fs.removeFoundSetFilterParam('ftr_contratto_qualifica');
		
		fs = filterDitte(fs);
		
	fs.loadAllRecords();
	
	// Imposta le ditte come selezionate
	vCompanyIDs = globals.foundsetToArray(fs, 'idditta');
}

/**
 * @properties={typeid:24,uuid:"654FF668-ADF6-4723-8B2D-6C4FCACA3CDC"}
 */
function filterContratti(fs)
{
//	if(fs)
//		fs.addFoundSetFilterParam('radicecontratto', globals.ComparisonOperator.NE, '63');
	
	return fs;
}

/**
 * @properties={typeid:24,uuid:"C58DC4BA-5525-4ADE-8D26-2374A5ADBEDB"}
 */
function updateContratti(contratti)
{
	if(contratti)
		vContratti = contratti.map(function(c){ return c.radicecontratto + ' - ' + c.descrizione}).join('\n');
	
	deselectAllCompanies(null);
}

/**
 * @properties={typeid:24,uuid:"AA77C468-E2A0-4C54-A733-F83B86E84AAD"}
 */
function updateQualifiche(qualifiche)
{
	if(qualifiche)
		vQualifiche = qualifiche.map(function(q){ return q.radicequalifica + ' - ' + q.descrizione}).join('\n');
	
	deselectAllCompanies(null);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"840CD40A-7337-4ED1-82DB-C6576D0F617A"}
 */
function deselectAllCompanies(event)
{
	/** @type {JSFoundset} */
	var fs = forms[elements.ditta_tabless.getTabFormNameAt(1)].foundset;
	fs.clear();
	
	// Deseleziona eventuali ditte precedentemente selezionate
	vCompanyIDs = null;
}

/**
 * @properties={typeid:24,uuid:"08257038-1FFE-42DD-9686-CD5DFDFE1EC7"}
 */
function deselectContratti(event)
{
	vIDContratti = null;
	vContratti   = null;
	vCompanyIDs  = null;
	
	deselectAllCompanies(event);
}


/**
 * @properties={typeid:24,uuid:"65FC4562-9696-4D59-B94F-E27A6CFE2783"}
 */
function deselectQualifiche(event)
{
	/** @type {JSFoundset} */
	vQualifiche   = null;
	vCompanyIDs   = null;
	vIDQualifiche = null;
	
	deselectAllCompanies(event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"9A26FE37-AF40-4657-AAF7-E9F735DB7AD3"}
 */
function stampaCircolare(event) 
{
	var params = {
        processFunction: process_stampa_circolare,
        message: '', 
        opacity: 0.5,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : '',
        fontType: 'Arial,4,25',
        processArgs: [event]
    };
	plugins.busy.block(params);
}

/**
 * @properties={typeid:24,uuid:"A7505BCA-A1BB-4410-A886-719D20E73156"}
 */
function process_stampa_circolare()
{
	vOutputMsg = '';
	
	try
	{
		if(!checkParams())
		{
			globals.ma_utl_showWarningDialog('Per favore controllare che tutti i parametri siano impostati');
			return false;
		}
		
		var uri = globals.URI_FTP_MAGNACARTA;
		var dir = globals.PATH_CIRCOLARI;
		var success = true;
		
		var ftp = plugins.it2be_ftp.createJFTPclient(uri, globals.Security.FTP_MAGNACARTA.user, globals.Security.FTP_MAGNACARTA.password);
		if(!ftp || !ftp.connect())
			throw new Error('Impossibile connettersi al server ftp ' + uri);
		
		if(!ftp.cd(dir))
			throw new Error('Impossibile recuperare la directory ' + dir);
			
		// Crea una copia per ogni ditta selezionata
		/** @type {JSFoundSet<db:/ma_anagrafiche/ditte>} */
		var fs = forms[elements.ditta_tabless.getTabFormNameAt(1)].foundset;
		for(var d = 1; success && d <= fs.getSize(); d++)
		{
			var ditta = fs.getRecord(d);
			var params =
			{
				pidcircolare	:	idcircolare,
				pidditta		:	ditta.idditta
			};
			
			var periodo     = globals.toDate(periodoriferimento);
			var annoPeriodo = periodo.getFullYear();
			var mesePeriodo = globals.convertMese(periodo.getMonth() + 1);
			
			vOutputMsg += 'Preparazione del file in corso...\n';
			
			// Definiamo il nome del file in modo che sia leggibile da Magnacarta
			var fileName = [ditta.codice, 'Circolare ' + numero + ' - ' + forms.circolari_custom.oggetto, mesePeriodo, annoPeriodo].join('.');

			vOutputMsg += 'Nome del file ' + fileName + '\n';
			
//			var bytes_intestazione = plugins.jasperPluginRMI.runReport(globals.Server.MA_COMUNICAZIONI, 'CircolareNominativaCustomIntestazione.jasper', null, OUTPUT_FORMAT.PDF, params, null);
// 			var bytes = plugins.pdf_output.combinePDFDocuments([bytes_intestazione,template]);
			// Aggiungiamo dei metadata per modificare il checksum che va a verificare Magnacarta
			var metadata = {ID : params.pidditta.toString()}
			var bytes = plugins.pdf_output.addMetaData(template,metadata);
			// Creiamo il file .pdf 
			var file = plugins.file.createTempFile(fileName, globals.FileExtension.PDF);
			
			vOutputMsg += 'File creato correttamente \n';
			
			// Assegniamo i bytes al file 
			success = success && file && file.setBytes(bytes, true);
			// Upload nella repository ftp da cui pesca Magnacarta
			if(success)
			   ftp.put(file.getAbsolutePath(), fileName + globals.FileExtension.PDF);
			else
			{
			   if(file)
				   file.deleteFile();
			   throw new Error('Errore durante la creazione del file.\n');
			}	
			
			if(file)
				file.deleteFile();
			
			vOutputMsg += '-----------------------------------------------------------------';
		}
		
		if(success)
		{
			plugins.busy.unblock();
			vOutputMsg += 'Termine del processo di creazione';
			globals.ma_utl_showInfoDialog('File creati correttamente in ' + uri);
		}
	}
	catch(ex)
	{
		application.output(ex.message, LOGGINGLEVEL.ERROR);
		vOutputMsg += 'Errore durante l\'esecuzione del processo : ' + ex.message + '\n';
		globals.ma_utl_showErrorDialog('Errore durante l\'upload del file.\nContattare il settore informatico.');
		
		return false;
	}
	finally
	{
		if(ftp)
			ftp.disconnect();
		
		plugins.busy.unblock();
		
		return success;
	}
}

/**
 * @properties={typeid:24,uuid:"A3AC57A7-CB00-4B59-905A-30BA373D5D28"}
 */
function checkParams()
{
	return forms[elements.ditta_tabless.getTabFormNameAt(1)].foundset && forms[elements.ditta_tabless.getTabFormNameAt(1)].foundset.getSize() > 0;
}

/**
 * @properties={typeid:24,uuid:"FF6CF812-BD88-43F2-A6BC-0C1A9850C79B"}
 */
function init(firstShow)
{
	_super.init(firstShow);
	reset();
}

/**
 * @properties={typeid:24,uuid:"9017C373-D427-433A-9F3C-E1B2EF7FAAD8"}
 */
function reset()
{
	deselectAllCompanies(null);
	deselectContratti(null);
	deselectQualifiche(null);
}

/**
 * @properties={typeid:24,uuid:"0BF2AA6F-400B-4AD0-BBFB-1685A67A8F56"}
 */
function lookupDitta(event)
{
	globals.ma_utl_showLkpWindow
	(
		{
			  event										: event
			, lookup									: 'AG_Lkp_Ditta'
			, methodToAddFoundsetFilter					: 'filterDitte'
			, methodToExecuteAfterMultipleSelection		: 'updateDitte'
			, returnField								: 'vCompanyIDs'
			, allowInBrowse								: true
			, multiSelect								: true
			, selectedElements							: vCompanyIDs
		}
	);
}