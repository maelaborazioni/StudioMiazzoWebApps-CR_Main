/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"4F3DD289-C0D6-452A-98DA-057001005A4E"}
 */
var PATH_CIRCOLARI = 'MagnaCartaSync/MagnacartaPdfDecoder/CIRCOLARI NOMINATIVE'; //'circolari'

/**
 * @AllowToRunInFind
 * 
 * Scarica la circolare 
 *
 * @param {Number} idCircolare
 *
 * @properties={typeid:24,uuid:"A380A7AA-EA06-4128-A9B9-E6E15BFFB701"}
 */
function scaricaCircolare(idCircolare)
{
	/** @type {JSFoundset<db:/ma_comunicazioni/circolari>}*/
	var fs = databaseManager.getFoundSet(globals.Server.MA_COMUNICAZIONI,'circolari');
	if(fs.find())
	{
		fs.idcircolare = idCircolare;
		fs.search();
	}
	if(!fs.template)
	{
		globals.ma_utl_showInfoDialog('Nessun file associato alla circolare è stato caricato in precedenza');
		return;
	}
	
	var periodo = globals.toDate(fs.periodoriferimento);
	var annoPeriodo = periodo.getFullYear();
	var mesePeriodo = globals.convertMese(periodo.getMonth() + 1);
	
	var nomeCircolare =  ['PUBLIC.Circolare ' + fs.numero, mesePeriodo, annoPeriodo].join('.');
	plugins.file.writeFile(nomeCircolare + globals.FileExtension.PDF, fs.template);
}