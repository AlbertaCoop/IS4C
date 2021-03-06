// ************************************************************************
// Display: monthview functions
// ************************************************************************

var placeHolder = null;

function try_edit_monthview(idstr,uid){
	if (placeHolder == null)
		edit_monthview(idstr,uid);
}

function save_open_event() {
    $('textarea.openevent').each(function(){
        var elemID = $(this).attr('id');
        var textstr = $(this).val();
        textstr = textstr.replace(/\r/g,"");
        textstr = textstr.replace(/\n/g,"<br>");
        var calID = $('#calendarID').val();

        var temp = elemID.split('_');
        var getArgs = 'action=save_or_add_event&id='+calID;
        if (temp.length == 2) { // existing event
            var eventID = temp[1];
            $('#event_'+eventID).html(textstr);
            getArgs += '&eventID='+eventID;
        } else if (temp.length == 3) { // new event
            var datestr = temp[1];
            var uid = temp[2];
            $('#event_'+datestr+"_"+uid).html(textstr);
            getArgs += '&datestr='+datestr+'&uid='+uid;
        }
        textstr = textstr.replace(/&/g,"%26");
        getArgs += '&text='+textstr;

        $.ajax({
            url: 'CalendarAjax.php',
            type: 'get',
            data: getArgs,
            success: function(){
            }
        });
    });
}

function edit_event(event_id) {
    // this event is already being edited
    if ($('#openevent_'+event_id).length > 0) {
        return;
    }
    
    save_open_event();

	var content = $('#event_'+event_id).html();
	content = content.replace(/<br>/g,"\n");

	var area = "<textarea class=\"openevent\" rows=\"2\" cols=\"17\" ";
	area += "id=\"openevent_"+event_id+"\">";
	area += content;
	area += "</textarea>";
    
    $('#event_'+event_id).html(area);
}

function add_event(datestr, uid) {
    // this event is already being edited
    if ($('#openevent_'+datestr+'_'+uid).length > 0) {
        return;
    }
    
    save_open_event();

	var area = "<textarea class=\"openevent\" rows=\"2\" cols=\"17\" ";
	area += "id=\"openevent_"+datestr+"_"+uid+"\">";
	area += "</textarea>";

    $('#event_'+datestr+'_'+uid).html(area);
}

/**
  @deprecated
  edit_event() and add_event() functions
  added to support proper event IDs
*/
function edit_monthview(idstr,uid) {
	if (idstr+":"+uid == placeHolder) return;

	if (placeHolder != null){
		var datecheck = placeHolder.split(':');
		if (datecheck[0] == idstr) return;
	}

	if (placeHolder != null)
		save_monthview();

	var content = document.getElementById(idstr+uid).innerHTML;
	content = content.replace(/<br>/g,"\n");

	var area = "<textarea rows=\"2\" cols=\"17\" ";
	area += "id=\"TA_"+idstr+uid+"\">";
	area += content;
	area += "</textarea>";

	document.getElementById(idstr+uid).innerHTML = area;
	placeHolder = idstr+":"+uid;
	document.getElementById("TA_"+idstr+uid).focus();
}

/**
  @deprecated
  replaced by save_open_event
*/
function save_monthview(){
	var temp = placeHolder.split(":");
	var datestr = temp[0];
	var uid = temp[1];

	var textstr = document.getElementById("TA_"+datestr+uid).value;
	textstr = textstr.replace(/\r/g,"");
	textstr = textstr.replace(/\n/g,"<br>");
	document.getElementById(datestr+uid).innerHTML = textstr;
	var id = document.getElementById('calendarID').value;

	textstr = textstr.replace(/&/g,"%26");
	phpSend('monthview_save&id='+id+'&text='+textstr+'&date='+datestr+'&uid='+uid);
	placeHolder = null;
}

// Refresh periodically for concurrency, but
// make sure nothing's open for editing
function monthview_refresher(){
	if (placeHolder != null){
		setTimeout('monthview_refresher()',15000);
	}
	else {
		location.reload(true);
	}
}

// ************************************************************************
// Display: index functions
// ************************************************************************

function newCalendar(uid){
	var content = "Name: <input type=text size=10 id=newCalName /> ";
	content += "<input type=submit value=Create onclick=\"makeNewCal(1);return false;\" /> ";
	content += "<input type=submit value=Cancel onclick=\"makeNewCal(0);return false;\" />";
	content += "<input type=hidden id=newCalUID value=\""+uid+"\" />";

	document.getElementById('indexCreateNew').innerHTML=content;
	document.getElementById('newCalName').focus();
}

function makeNewCal(doCreate){
	var uid = document.getElementById('newCalUID').value;
	var name = document.getElementById('newCalName').value;
	if (doCreate == 1 && name != ""){
		phpSend('createCalendar&name='+name+'&uid='+uid);
	}

	var content = "<a href=\"\" onclick=\"newCalendar('"+uid+"');return false;\">";
	content += "Create a new calendar</a>";
	document.getElementById('indexCreateNew').innerHTML=content;
}

// ************************************************************************
// Display: prefs functions
// ************************************************************************

function select_add(src,dest){
	var opts = document.getElementById(src).options;
	var src_element = document.getElementById(dest);
	for(var i=0;i<opts.length;i++){
		if (opts[i].selected){
			var newopt = new Option(opts[i].innerHTML,opts[i].value);
			src_element.add(newopt,null);	
		}
	}
}

function select_remove(src){
	var opts = document.getElementById(src).options;
	var src_element = document.getElementById(src);
	for(var i=opts.length-1;i>=0;i--){
		if (opts[i].selected)
			src_element.remove(i);			
	}
}

function savePrefs(calID){
	var name = document.getElementById('prefName').value;

	var viewers = "";
	var opts = document.getElementById('prefViewers').options;
	for(var i=0;i<opts.length;i++){
		viewers += opts[i].value;
		if (i < opts.length-1) viewers += ",";
	}

	var writers = "";
	var opts = document.getElementById('prefWriters').options;
	for(var i=0;i<opts.length;i++){
		writers += opts[i].value;
		if (i < opts.length-1) writers += ",";
	}

	phpSend('savePrefs&calID='+calID+'&name='+name+'&viewers='+viewers+'&writers='+writers);
}
