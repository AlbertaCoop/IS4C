<?php
/*******************************************************************************

    Copyright 2013 Whole Foods Co-op

    This file is part of Fannie.

    Fannie is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    Fannie is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    in the file license.txt along with IT CORE; if not, write to the Free Software
    Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA

*********************************************************************************/

include('../config.php');
include_once($FANNIE_ROOT.'classlib2.0/FannieAPI.php');

class PurchasingIndexPage extends FannieRESTfulPage {
	
	protected $header = 'Purchase Orders';
	protected $title = 'Purchase Orders';

	protected $must_authenticate = True;

	function get_view(){

		return '<ul>
			<li><a href="ViewPurchaseOrders.php">View Orders</a>
			</li>
			<li>Create Order
				<ul>
				<li><a href="EditOnePurchaseOrder.php">By Vendor</a></li>
				<li><a href="EditManyPurchaseOrders.php">By Item</a></li>
				</ul>
			</li>
			</ul>';
		
	}
}

FannieDispatch::conditionalExec();

?>
