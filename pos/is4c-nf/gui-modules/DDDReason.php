<?php
/*******************************************************************************

    Copyright 2010 Whole Foods Co-op

    This file is part of IT CORE.

    IT CORE is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    IT CORE is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    in the file license.txt along with IT CORE; if not, write to the Free Software
    Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA

*********************************************************************************/

include_once(dirname(__FILE__).'/../lib/AutoLoader.php');

// based upon RefundComment class
class DDDReason extends NoInputPage {

	function preprocess(){
		global $CORE_LOCAL;
		if (isset($_REQUEST["selectlist"])){
			$input = $_REQUEST["selectlist"];
			if ($input == "CL"){
				$CORE_LOCAL->set("shrinkReason","");
			} else {
				$input = str_replace("'","",$input);
				$CORE_LOCAL->set("shrinkReason",$input);
			}
			$this->change_page($this->page_url."gui-modules/adminlogin.php?class=DDDAdminLogin");
			return False;
		}
		return True;
	}
	
	function head_content(){
		?>
		<script type="text/javascript" >
		var prevKey = -1;
		var prevPrevKey = -1;
		function processkeypress(e) {
			var jsKey;
			if (e.keyCode) // IE
				jsKey = e.keyCode;
			else if(e.which) // Netscape/Firefox/Opera
				jsKey = e.which;
			if (jsKey==13) {
				if ( (prevPrevKey == 99 || prevPrevKey == 67) &&
				(prevKey == 108 || prevKey == 76) ){ //CL<enter>
					$('#selectlist :selected').val('CL');
				}
				$('#selectform').submit();
			}
			prevPrevKey = prevKey;
			prevKey = jsKey;
		}
		</script> 
		<?php
	} // END head() FUNCTION

	function body_content() {
		global $CORE_LOCAL;
		?>
		<div class="baseHeight">
		<div class="centeredDisplay colored">
                <span class="larger">Why are these items being marked as shrink/unsellable?</span>
		<form name="selectform" method="post" 
			id="selectform" action="<?php echo $_SERVER['PHP_SELF']; ?>">
			<select name="selectlist" id="selectlist"
				onblur="$('#selectlist').focus();">
		<?php
		$sconf = $CORE_LOCAL->get('ShrinkCodeMappings');
		if (!is_array($sconf)) $sconf = array('default reason code');
		for ($i=0;$i<count($sconf);$i++) {
			echo '<option value="' . $i . '">' . $sconf[$i] . '</option>' . "\n";
		}
		?>
			</select>
		</form>
		<p>
		<span class="smaller">[clear] to cancel</span>
		</p>
		</div>
		</div>	
		<?php
		$this->add_onload_command("\$('#selectlist').focus();\n");
		$this->add_onload_command("\$('#selectlist').keypress(processkeypress);\n");
	} // END body_content() FUNCTION
}

if (basename(__FILE__) == basename($_SERVER['PHP_SELF']))
	new DDDReason();
?>
