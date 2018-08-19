<?php

// HW 6, Kim, Young Min

$userKeyword = "null";
$userLocation = null;
$userDistance = null;

if (isset($_POST["user_keyword"])) {
	$GLOBALS["userKeyword"] = $_POST["user_keyword"];
}

if (isset($_POST["user_loc"])) {
	$GLOBALS["userLocation"] = $_POST["user_loc"];
}

if (isset($_POST["user_dis"])) {
	$GLOBALS["userDistance"] = $_POST["user_dis"];
}

# construct url for google api to obtain longitude and latitude of address
function construct_goog_url() {

	$goog_search_path = "http://maps.googleapis.com/maps/api/geocode/json?address=";
	$address = $_POST["user_loc"];
	$goog_token = "&access_token=AIzaSyDTXCLPpbZOK1Afr-HQpp6vYBH7fcKv8MY";

	$goog_api_call = $goog_search_path . $address . $goog_token;
	# echo $goog_api_call;
	return $goog_api_call;
}

# return an array containing longitude and latitude from google api
function get_goog_loc() {
	$search_url = construct_goog_url();

	# return JSON-formatted object
	$json_goog_graph = file_get_contents($search_url);
	# parse contents of JSON-formatted object
	$arr_goog_graph = json_decode($json_goog_graph, true); // true: return assoc array

	$arr_goog_loc = $arr_goog_graph["results"][0]["geometry"]["location"];
	$lat = $arr_goog_loc["lat"];
	$lng = $arr_goog_loc["lng"];

	return $arr_goog_loc;
}

# construct search url for facebook graph api
function construct_fb_url($input_keyword, $input_type) {
	# input parameters
	$keyword = $input_keyword; // user query
	$type = $input_type; // [user, page, event, group, place]

	// echo "user input parameters: " . $input_keyword . " " . $type . "<br>";

	# main facebook graph api url path
	$fb_graph_url = "https://graph.facebook.com/v2.8/search?";

	# search $keyword based on type $type
	$fb_search = "q=" . $keyword . "&" . "type=" . $type; 
	$fb_search_fields = "&fields=id,name,picture.width(700).height(700)";

	if($type == "place" && ($_POST["user_dis"] != "") && ($_POST["user_loc"] != "")) {
		# get lat and long from google api json
		$arr_goog_loc = get_goog_loc();
		$lat = $arr_goog_loc["lat"];
		$lng = $arr_goog_loc["lng"];

		# get distance from POST
		$dis = $_POST["user_dis"];

		$fb_loc = "&". "center=" . $lat . ',' . $lng;
		$fb_dis = '&distance=' . $dis;
		$fb_search_fields = $fb_loc . $fb_dis . $fb_search_fields;
		#echo $fb_search_fields;
	}

	# long lived token 
	# $fb_token = "&access_token=EAAJs7tbNknIBAFH7sE8uQjZBXtoDyZCkRFU1ZAWPZAGEEdAIrgYLF83Pq9wbxAoatfGo3MUZA0j8K4y5zQ2GbqTWJHHBgOkEucAdBCRndiKlYZAcJZAygzgjgeE5OhmfikOsIuOewy61cSSo3fZBYZCddG1LJtRuJaggZD";

	$fb_token = "&access_token=EAAJs7tbNknIBAHtt4JmxWsaGiT7P8okJQHJPBEsM09igXxO9K948jKyYqxvLeNz5zUONYRG7I8TZBMqaRBizMjBL5mmthoFET6rVGL9ZCKerPdi3ZBIfUFGTk69YHc2cAemJZB1yZAd3o68Pd9Bi2JWmTfuxTslEZD";

	# construct full facebook graph api url path
	$search_url = $fb_graph_url . $fb_search . $fb_search_fields . $fb_token;
	#echo $search_url;
	return $search_url;
}


function construct_fb_user_url($fb_id) {

	// echo "user id parameter: " . $fb_id . "<br>";

	$fb_graph_url = "https://graph.facebook.com/v2.8/" . $fb_id;
	# search for post and albums
	$fb_search_fields = "?fields=id,name,picture.width(700).height(700),albums.limit(5){name,photos.limit(2){name,%20picture}},posts.limit(5)";
	# long lived token
	# $fb_token = "&access_token=EAAJs7tbNknIBAFH7sE8uQjZBXtoDyZCkRFU1ZAWPZAGEEdAIrgYLF83Pq9wbxAoatfGo3MUZA0j8K4y5zQ2GbqTWJHHBgOkEucAdBCRndiKlYZAcJZAygzgjgeE5OhmfikOsIuOewy61cSSo3fZBYZCddG1LJtRuJaggZD";

	$fb_token = "&access_token=EAAJs7tbNknIBAHtt4JmxWsaGiT7P8okJQHJPBEsM09igXxO9K948jKyYqxvLeNz5zUONYRG7I8TZBMqaRBizMjBL5mmthoFET6rVGL9ZCKerPdi3ZBIfUFGTk69YHc2cAemJZB1yZAd3o68Pd9Bi2JWmTfuxTslEZD";

	# construct full facebook graph api url path
	$search_url = $fb_graph_url . $fb_search_fields . $fb_token;
	return $search_url;
}

function construct_fb_pic_url_res($fb_pic_id) {
	$fb_graph_url = "https://graph.facebook.com/" . $fb_pic_id;
	$fb_search_fields = "/picture?&redirect=false";
	# $fb_token = "?access_token=EAAJs7tbNknIBAFH7sE8uQjZBXtoDyZCkRFU1ZAWPZAGEEdAIrgYLF83Pq9wbxAoatfGo3MUZA0j8K4y5zQ2GbqTWJHHBgOkEucAdBCRndiKlYZAcJZAygzgjgeE5OhmfikOsIuOewy61cSSo3fZBYZCddG1LJtRuJaggZD";

	$fb_token = "&access_token=EAAJs7tbNknIBAHtt4JmxWsaGiT7P8okJQHJPBEsM09igXxO9K948jKyYqxvLeNz5zUONYRG7I8TZBMqaRBizMjBL5mmthoFET6rVGL9ZCKerPdi3ZBIfUFGTk69YHc2cAemJZB1yZAd3o68Pd9Bi2JWmTfuxTslEZD";

	$search_url = $fb_graph_url . $fb_search_fields;
	//echo "high res pic url: " . $search_url . "<br>";

	# return JSON-formatted object
	$json_fb_graph = file_get_contents($search_url);
	# parse contents of JSON-formatted object
	$arr_fb_graph = json_decode($json_fb_graph, true); // true: return assoc array

	$pic_url = $arr_fb_graph["data"]["url"];
	// echo "high res pic url: ". $pic_url;
	return $pic_url;

}

function get_img_tag($img_url, $w, $h) {
	if($w != NULL && $h != NULL) { 
		$img_html = "<img src=\"$img_url\" style=\"width:$w;height:$h;\">";
	} else {
		$img_html = "<img src=\"$img_url\">";
	}
	return $img_html;
}

# construct html anchor, img tag for facebook profile image in table
# call javascript function "linkToImage()" for anchor href
function construct_pic_anchor($fb_pic) {
	$img_fb_pic = get_img_tag($fb_pic, 30, 40); // "<img src=\"$fb_pic\" style=\"width:30;height:40;\">";
	$anchor_fb_pic = "<a href=\"#\" onclick=\"linkToImage('{$fb_pic}');\">" . $img_fb_pic . "</a>";

	return $anchor_fb_pic; // html anchor enclosed with img
}

function construct_id_anchor($fb_id) {
	$keyword = urlencode($GLOBALS["userKeyword"]);
	$type = $_POST["user_type"];

	$anchor_fb_id = "<a href=\"?callback=$keyword&type=$type&id=$fb_id\"> Details </a>";



	if($type == "place") {
		$loc = urlencode($GLOBALS["userLocation"]);
		$dis = urlencode($GLOBALS["userDistance"]);
		$anchor_fb_id = "<a href=\"?callback=$keyword&type=$type&loc=$loc&dis=$dis&id=$fb_id\"> Details </a>";
	}


	return $anchor_fb_id;
}

function construct_fb_event_url($input_keyword) {
	# main facebook graph api url path
	$fb_graph_url = "https://graph.facebook.com/v2.8/search?";

	# search $keyword based on type $type
	$fb_search = "q=" . $input_keyword . "&" . "type=event"; 
	$fb_search_fields = "&fields=id,name,picture.width(700).height(700),place";

	$fb_token = "&access_token=EAAJs7tbNknIBAHtt4JmxWsaGiT7P8okJQHJPBEsM09igXxO9K948jKyYqxvLeNz5zUONYRG7I8TZBMqaRBizMjBL5mmthoFET6rVGL9ZCKerPdi3ZBIfUFGTk69YHc2cAemJZB1yZAd3o68Pd9Bi2JWmTfuxTslEZD";


	$search_url = $fb_graph_url . $fb_search . $fb_search_fields . $fb_token;

	return $search_url;
}


function construct_search_table() {
	# user input parameters
	$input_keyword = urlencode(trim($_POST["user_keyword"]));
	$input_type = $_POST["user_type"];
	#echo $input_type;

	# construct full facebook graph api url path
	$search_url = construct_fb_url($input_keyword, $input_type);

	if ($input_type == "event") {
		$search_url = construct_fb_event_url($input_keyword);
	}

	//echo $search_url; # remove later!

	# return JSON-formatted object
	$json_fb_graph = file_get_contents($search_url);
	# parse contents of JSON-formatted object
	$arr_fb_graph = json_decode($json_fb_graph, true); // true: return assoc array

	# construct html table and column headers
	$table_html = "<table>";
	if ($input_type != "event") {
		$table_html .= "<tr> <th> Profile Photo </th> <th> Name </th> <th> Details </th> </tr>";
	} else {
		$table_html .= "<tr> <th> Profile Photo </th> <th> Name </th> <th> Place </th> </tr>";
	}


	# construct html table data

	for($i = 0; $i < count($arr_fb_graph['data']); $i++) {
		$fb_name = $arr_fb_graph['data'][$i]['name'];
		$fb_id = $arr_fb_graph['data'][$i]['id'];
		$fb_pic = $arr_fb_graph['data'][$i]['picture']['data']['url'];


		$fb_pic_link = construct_pic_anchor($fb_pic);

		if ($input_type == "event") {
			$fb_detail = $arr_fb_graph['data'][$i]['place']['name'];
			$table_html .= "<tr> <td> $fb_pic_link </td> <td> $fb_name </td> <td> $fb_detail </td> </tr>";
		} else {
			$fb_id_link = construct_id_anchor($fb_id);
			$table_html .= "<tr> <td> $fb_pic_link </td> <td> $fb_name </td> <td> $fb_id_link  </td> </tr>";
		}

		# echo "onclick=\"linkToImage(\"helloworld\");\"" . "<br>";

		// echo $i . " " . $arr_fb_graph['data'][$i]['name'] . " " . $arr_fb_graph['data'][$i]['id'] . "<br>";
		// echo $arr_fb_graph['data'][$i]['picture']['data']['url'] . "<br>";
	}

	$table_html .= "</table>";

	if(count($arr_fb_graph['data']) > 0) {
		echo $table_html;
	} else {
		echo '<table> <tr> <td style="text-align:center"> No Records has been found </td> </tr> </table>';
	}
	return $table_html;
}


function construct_post_table($arr_user_graph) {

	# construct html table and column headers
	$table_html = "<table id=\"message_tb\">";
	$table_html .= "<tr> <th style=\"font-weight: bold; text-align: left;\"> Message </th> </tr>";

	$arr_user_posts = $arr_user_graph['posts']['data'];
	
	# restrict to display at most 5 posts
	$posts_size = count($arr_user_posts);
	if($posts_size <=5) {
		$num_posts = $posts_size;
	} else {
		$num_posts = 5;
	}

	# construct html table data
	for ($i = 0; $i < $num_posts; $i++) {

		if(!isset($arr_user_posts[$i]['message'])) {
			$user_post = $arr_user_posts[$i]['story'];
		} else {
			$user_post = $arr_user_posts[$i]['message'];
		}
		
		// echo "post $i: " . $user_post . "<br>";

		$table_html .= "<tr> <td> $user_post </td> <tr>";
	}
	$table_html .= "</table>";

	#echo $table_html;
	return $table_html;
}


function construct_album_table($arr_user_graph) {
	# construct html table and column headers
	$table_html = "<table id=\"albums_tb\">";

	$arr_user_albums = $arr_user_graph['albums']['data'];

	# restrict to display at most 5 albums
	$albums_size = count($arr_user_albums);
	if ($albums_size <=5 ) {
		$num_albums = $albums_size;
	} else {
	$num_albums = 5;
	}

	for ($i = 0; $i < $albums_size; $i++) {
		$user_album = $arr_user_albums[$i];
		$user_album_name = $user_album['name'];
		$tr_id = "tr_" . $i;

		# echo "album name: " . $user_album_name . "<br>";
		$album_html = "<a href = \"#$tr_id\" onclick=\"expandAll('{$tr_id}')\"> $user_album_name </a>";
		$table_html .= "<tr> <td> $album_html </td> <tr>";

		$table_html .= "<tr id = \"$tr_id\" style=\"display: none\"><td>";
		$arr_pic = $user_album['photos']['data'];
		for ($j = 0; $j < 2; $j++) {
			$pic_url = $arr_pic[$j]['picture'];
			$pic_id = $arr_pic[$j]['id'];
			$pic_high_res_url = construct_fb_pic_url_res($pic_id);


			$pic_html = get_img_tag($pic_url, 80, 80);
			$pic_anchor_html = "<a href=\"#\" onclick=\"linkToImage('{$pic_high_res_url}');\">" . $pic_html . "</a>";

			# echo "=== pic url: " . $pic_url . "<br>";
			$table_html .= "$pic_anchor_html ";
		}
		$table_html .= "</td></tr>";
	}
	$table_html .= "</table>";

	#echo $table_html;
	return $table_html;
}

function constructDetails() {

	if(!(isset($_POST["clear"]))) {

		$search_id = $_GET["id"];
		$search_user_url = construct_fb_user_url($search_id);
		$json_user_graph = file_get_contents($search_user_url);
		$arr_user_graph = json_decode($json_user_graph, true);

		if (!isset($arr_user_graph['albums']['data'])) {
			$albums_header_html = '<div id="albums_header"> No Albums has been found </div>';
			$album_result_html = '<div id="album_result" style="display: none"> </div>';
		} else {
			$albums_header_html = '<div id="albums_header" style="background: LightGrey"> <a href="#albums" onclick="expandAlbums()"> Albums </a> </div>';
			$album_table = construct_album_table($arr_user_graph);
			$album_result_html = '<div id="album_result" style="display: none">' . $album_table . '</div>';
		}

		if (!isset($arr_user_graph['posts']['data'])) {
			$posts_header_html = '<div id="posts_header"> No Posts has been found </div>';
			$message_result_html = '<div id="message_result" style="display: none"> </div>';
		} else {
			$posts_header_html = '<div id="posts_header" style="background: LightGrey"> <a href="#posts" onclick="expandPosts()"> Posts </a>  </div>';
			$post_table = construct_post_table($arr_user_graph);
			$message_result_html = '<div id="message_result" style="display: none">' . $post_table . '</div>';
		}

		$details_html = $albums_header_html . $album_result_html . $posts_header_html . $message_result_html;
		echo $details_html;
		return $details_html;
	}
}

function keep_select_state($selectValue) {

	if (isset($_POST['search']) && !(isset($_GET["type"]))) {
		if (isset($_POST['user_type']) && ($_POST['user_type'] == $selectValue)) {
			if(!(isset($_POST["clear"]))) {
				echo "selected";
			}
		}
	} elseif (!(isset($_POST['search'])) && isset($_GET["type"])) {
		if(($_GET["type"] == $selectValue)) {
			echo "selected";
		}
	} elseif (isset($_POST['search']) && isset($_GET["type"])) {
		if (isset($_POST['user_type']) && ($_POST['user_type'] == $selectValue)) {
			if(!(isset($_POST["clear"]))) {
				echo "selected";
			}
		}
	}

}

function keep_input_state() {
	# if (isset($_POST['user_keyword']) && !(isset($_POST["clear"]))) {
	if (isset($_POST['search']) && isset($_POST['user_keyword'])) {
		if(!(isset($_POST["clear"]))) {
			echo 'value="'.$_POST['user_keyword'].'"';
		}
	}
	if(isset($_GET["callback"])) {
		$val = $_GET["callback"];
		echo 'value="'.$val.'"';
	}
}

function restore_place_loc() {
	return $_POST["user_loc"];
}

function restore_place_dis() {
	return $_POST["user_dis"];
}
?>


<html> 

<style>


	#main_container {
		margin: auto;
		width: 60%;
		border: 2px solid LightGrey;
		background: #ECEBEC;
	}

	#title {
		margin: auto;
		width: 95%;
		text-align: center;
		font-style: italic;
		font-size: 130%;
		padding-bottom: 1%;
		border-bottom-style: solid;
		border-color: DarkGrey;
		border-width: 1px;
	}

	#form_input_container {
		margin: auto;
		padding-left: 1%;
		padding-top: 1%;
	}

	#search_result {
		margin: auto;
		margin-top: 5%;
		width: 70%;
		border: 1px solid LightGrey;
	}

	#search_result table, td, th {
		border: 1px solid LightGrey;
		background-color: #F3F3F3;
	}
	#search_result table {
		border-collapse: collapse;
		width: 100%;
		background-color: #F3F3F3;
	}

	#albums_header, #posts_header {
		margin: auto;
		margin-top: 2%;
		width: 70%;
		border: 2px solid LightGrey;
		text-align: center;
		background-color: #F3F3F3;
	}

	#album_result, #message_result {
		margin: auto;
		width: 70%;
	}


	#message_result table, td, th {
		border: 2px solid LightGrey;
		background-color: #F3F3F3;
	}
	#message_result table {
		border-collapse: collapse;
		margin-top: 2%;
		width: 100%;
	}

	#album_result table, td, th {
		border: 2px solid LightGrey;
		background-color: #F3F3F3;
	}
	#album_result table {
		border-collapse: collapse;
		margin-top: 2%;
		width: 100%;
	}


</style>

<script type="text/javascript">
var userKeyword;

// onChange addPlace for select tag
function addPlace() {
	var mySelectELEM = document.getElementById("mySelect");
	var myPlaceELEM = document.getElementById("addPlace");
	var myHoldELEM = document.getElementById("placeholder");

	if (mySelectELEM.value == "place") {
		myPlaceELEM.style.display = "block";
		myHoldELEM.style.display = "none";
	} else {
		myPlaceELEM.style.display = "none";
		myHoldELEM.style.display = "block";
	}
}

function savePlace() {
	var myPlaceELEM = document.getElementById("addPlace");
	var mySelectELEM = document.getElementById("mySelect");
	var myHoldELEM = document.getElementById("placeholder");

	if (mySelectELEM.value == "place") {
		myPlaceELEM.style.display = "block";
		myHoldELEM.style.display = "none";
	} else {
		myPlaceELEM.style.display = "none";
		myHoldELEM.style.display = "block";
	}
}

function clearForm() {
	console.log("clicked clear!!");
	document.getElementById("form_search").reset();
	var myurl = window.location;
	var newurl = myurl.href.split("?");
	
	if(myurl.href.indexOf("?") < 0) {
		newurl = myurl.href.split("#");
	}
	window.location = (newurl[0]);

}

function clearURL() {
	var myurl = window.location;
	var newurl = myurl.href.split("?");
	console.log(newurl[0]);
}

function cleanURL() {
	var myurl = window.location;
	var newurl = myurl.href.split("?");
	if(myurl.href.indexOf("?") < 0) {
		newurl = myurl.href.split("#");
	}
	window.history.pushState('', document.title, (newurl[0]));
	console.log(myurl);
}

function linkToImage(img_url) {
	var imgWindow = window.open("");

	var html_img = "<img src=" + img_url + ">";
	var html_txt = "<!DOCTYPE html> <html> <head></head> <body> <div>" + html_img + " </div> </body> </html> "

	imgWindow.document.write(html_txt);
}

function expandPosts() {
	var div_posts = document.getElementById("message_result");
	var div_albums = document.getElementById("album_result");

	if (div_posts.style.display == "none") {
		div_posts.style.display = "block";
		console.log("yes expand post!!!");
		if (div_albums.style.display != "none") {
			div_albums.style.display = "none";
		}
	} else {
		div_posts.style.display = "none";
	}
}

function expandAlbums() {
	var div_albums = document.getElementById("album_result");
	var div_posts = document.getElementById("message_result");

	if (div_albums.style.display == "none") {
		div_albums.style.display = "block";
		console.log("yes expand albums!!!");
		if (div_posts.style.display != "none") {
			div_posts.style.display = "none";
		}
	} else {
		div_albums.style.display = "none";
	}
}

function expandAll(expandID) {
	console.log(expandID);
	var div_albums = document.getElementById(expandID);
	if (div_albums.style.display === "none") {
		div_albums.style.display = "table-row";
	} else {
		div_albums.style.display = "none";
	}
}
</script>




<body>

		<div id="main_container"> 
		<div id="title"> Facebook Search </div>
		<div id="form_input_container"> 
			<form id="form_search" method="POST" action="">
			<div style="display: inline-block; width: 60px; max-width: 60px;"> Keyword </div>
			<input id="form_input" type="text" name="user_keyword" required <?php keep_input_state()?>><br>

			<div style="display: inline-block; width: 60px; max-width: 60px;"> Type </div>
			<select id="mySelect" name="user_type" size=1 onchange="addPlace()">
				<option value="user" <?php keep_select_state('user') ?>> Users </option>
				<option value="page" <?php keep_select_state('page') ?>> Pages </option>
				<option value="event" <?php keep_select_state('event') ?>> Events </option>
				<option value="place" <?php keep_select_state('place') ?>> Places </option>
				<option value="group" <?php keep_select_state('group') ?>> Groups </option>
				
			</select> <br>

			<div id="placeholder"> <br> </div>

			<div id="addPlace" style="display:none;">

				Location <input id="uloc" type="text" name="user_loc">
				Distance(meters) <input id="udis" type="text" name="user_dis"> <br>

				<div> </div>

				<script> savePlace() </script>

				<div id="saveLoc" style="display: none;">
					<?php if((isset($_GET["callback"]))): ?>
						<?php if(isset($_GET["loc"])) { echo $_GET["loc"]; } ?>
					<?php endif; ?>
					<?php if((isset($_POST["search"]))): ?>

						<script>
							var ulocELEM = document.getElementById("uloc");
							ulocELEM.value = document.getElementById("saveLoc").innerHTML = "";
						</script>

						<?php echo restore_place_loc() ?>
					<?php endif; ?>
				</div>
				<div id="saveDis" style="display: none;">
					<?php if((isset($_GET["callback"]))): ?>
						<?php if(isset($_GET["dis"])) { echo $_GET["dis"];} ?>
					<?php endif; ?>
					<?php if((isset($_POST["search"]))): ?>

						<script>
							var ulocELEM = document.getElementById("udis");
							ulocELEM.value = document.getElementById("saveDis").innerHTML = "";
						</script>
						
						<?php echo restore_place_dis() ?>
					<?php endif; ?>
				</div>

				<script>
					var ulocELEM = document.getElementById("uloc");
					var udisELEM = document.getElementById("udis");

					<?php if((isset($_GET["callback"]))): ?>
					ulocELEM.value = document.getElementById("saveLoc").innerHTML.trim();
					udisELEM.value = document.getElementById("saveDis").innerHTML.trim();
					<?php endif; ?>

					<?php if((isset($_POST["user_loc"]) && isset($_POST["user_dis"]))): ?>
					ulocELEM.value = document.getElementById("saveLoc").innerHTML.trim();
					udisELEM.value = document.getElementById("saveDis").innerHTML.trim();
					<?php endif; ?>
				</script>

			</div>

			<input type="submit" name= "search" value="Search">
			<input type="button" name= "clear" value="Clear" onclick="clearForm()">

			</form>
			
		</div>
		</div>


	<?php if(!(isset($_POST["search"]))): ?>
		
	<?php else: ?>	
		<div id="search_result">
		<?php if(!(isset($_POST["clear"]))) {

			if(isset($_GET["callback"])) {
				echo '<script> cleanURL() </script>';
			}

			construct_search_table(); 
		}
		?>


		</div>
	<?php endif; ?>



	<?php if((isset($_GET["callback"])) && (isset($_GET["id"]))): ?>
		<div id="detail_results"> 
			<?php if(!(isset($_POST["search"])) && !(isset($_POST["clear"]))) { 
				constructDetails(); 
			}
			?>
		</div>
	<?php endif; ?>




	<div id=log> </div>

</body> </html>



