<?php

# return FB API URL for type user,page,event,group
function get_fb_search($get_key, $get_type) {
    $keyword = $get_key;
    $type = $get_type;

    $fb_graph_url = "https://graph.facebook.com/v2.8/search?";
    $fb_search = "q=" . $keyword . "&" . "type=" . $type; 
    $fb_search_fields = "&fields=id,name,picture.width(700).height(700)";

    $fb_token = "&access_token=EAAJs7tbNknIBAHtt4JmxWsaGiT7P8okJQHJPBEsM09igXxO9K948jKyYqxvLeNz5zUONYRG7I8TZBMqaRBizMjBL5mmthoFET6rVGL9ZCKerPdi3ZBIfUFGTk69YHc2cAemJZB1yZAd3o68Pd9Bi2JWmTfuxTslEZD";

    $search_url = $fb_graph_url . $fb_search . $fb_search_fields . $fb_token;
    return $search_url;
}

# return FB API URL for type place only
function get_fb_place_search($get_key, $get_lat, $get_lng) {
    $keyword = $get_key;
    $type = 'place';
    
    $lat = $get_lat;
    $lng = $get_lng;

    $fb_graph_url = "https://graph.facebook.com/v2.8/search?";
    $fb_search = "q=" . $keyword . "&" . "type=" . $type; 
    $fb_search_fields = "&fields=id,name,picture.width(700).height(700)";
    $fb_loc = "&center=" . $lat . "," . $lng;
    
    $fb_token = "&access_token=EAAJs7tbNknIBAHtt4JmxWsaGiT7P8okJQHJPBEsM09igXxO9K948jKyYqxvLeNz5zUONYRG7I8TZBMqaRBizMjBL5mmthoFET6rVGL9ZCKerPdi3ZBIfUFGTk69YHc2cAemJZB1yZAd3o68Pd9Bi2JWmTfuxTslEZD";

    $search_url = $fb_graph_url . $fb_search . $fb_search_fields . $fb_loc . $fb_token;
    return $search_url;
}

# return FB API URL for albums and posts for fb_id
function get_fb_details($get_id) {
    $fb_id = $get_id;
    // $fb_id = '353851465130';
    
    $fb_graph_url = "https://graph.facebook.com/v2.8/" . $fb_id;
    # search for post and albums
	$fb_search_fields = "?fields=albums.limit(5){name,photos.limit(2){name,%20picture}},posts.limit(5)";
    # construct full facebook graph api url path
	$fb_token = "&access_token=EAAJs7tbNknIBAHtt4JmxWsaGiT7P8okJQHJPBEsM09igXxO9K948jKyYqxvLeNz5zUONYRG7I8TZBMqaRBizMjBL5mmthoFET6rVGL9ZCKerPdi3ZBIfUFGTk69YHc2cAemJZB1yZAd3o68Pd9Bi2JWmTfuxTslEZD";

	$search_url = $fb_graph_url . $fb_search_fields . $fb_token;
	return $search_url;
}

function construct_fb_pic_url_res($fb_pic_id) {
	$fb_graph_url = "https://graph.facebook.com/" . $fb_pic_id;
	$fb_search_fields = "/picture?&redirect=false";
	$fb_token = "&access_token=EAAJs7tbNknIBAHtt4JmxWsaGiT7P8okJQHJPBEsM09igXxO9K948jKyYqxvLeNz5zUONYRG7I8TZBMqaRBizMjBL5mmthoFET6rVGL9ZCKerPdi3ZBIfUFGTk69YHc2cAemJZB1yZAd3o68Pd9Bi2JWmTfuxTslEZD";

	$search_url = $fb_graph_url . $fb_search_fields;


	$json_fb_graph = file_get_contents($search_url);
	$arr_fb_graph = json_decode($json_fb_graph, true); // true: return assoc array

	$pic_url = $arr_fb_graph["data"]["url"];
	return $pic_url;
}

function parse_fb_albums($arr_user_albums) {
    $myArray = [];
    $albums_size = count($arr_user_albums);
    
    for ($i = 0; $i < $albums_size; $i++) {
        $user_album = $arr_user_albums[$i];
		$user_album_name = $user_album['name']; // name of album
        
        $myArray[$i] = [];
        $myArray[$i]['name'] = $user_album_name;
        
        
        $arr_pic = $user_album['photos']['data']; // pics in album
        
        $pic_id_1 = $arr_pic[0]['id'];
        $pic_high_res_url_1 = construct_fb_pic_url_res($pic_id_1); // 1st high res pic url
        
        $pic_id_2 = $arr_pic[1]['id'];
        $pic_high_res_url_2 = construct_fb_pic_url_res($pic_id_2); // 2nd high res pic url
        
        $myArray[$i]['url_1'] = $pic_high_res_url_1;
        $myArray[$i]['url_2'] = $pic_high_res_url_2;
        
        
    }
    
    return $myArray;    
}

function parse_fb_posts($arr_user_posts) {
    $myArray = [];
    $num_posts = count($arr_user_posts);
    
	for ($i = 0; $i < $num_posts; $i++) {

		if(!isset($arr_user_posts[$i]['message'])) {
			$user_post = $arr_user_posts[$i]['story'];
		} else {
			$user_post = $arr_user_posts[$i]['message'];
		}
		
        $myArray[$i]['msg'] = $user_post;
        
        $str = $arr_user_posts[$i]['created_time'];
        $datetime_arr = explode("T", $str);
        $date = $datetime_arr[0];
        $time_str = $datetime_arr[1];
        $time_arr = explode("+", $time_str);
        $time = $time_arr[0];
        $ret_datetime = $date . ' ' . $time;
        $myArray[$i]['time'] = $ret_datetime;
	}
    
    return $myArray;
}

function parse_fb_details($user_id) {
    $search_url = get_fb_details($user_id);
    $json_fb_graph = file_get_contents($search_url);
    $arr_user_graph = json_decode($json_fb_graph, true);
    
    $myArray = [];
    
    $len_album = 0;
    $len_post = 0;
    if(array_key_exists('albums', $arr_user_graph)) {
        // echo "albums exists! <br>";
        if(array_key_exists('data', $arr_user_graph['albums'])) {
            $len_album = count($arr_user_graph['albums']['data']);
        }
    }
    if(array_key_exists('posts', $arr_user_graph)) {
        // echo "posts exists! <br>";
        if(array_key_exists('data', $arr_user_graph['posts'])) {
            $len_post = count($arr_user_graph['posts']['data']);
        }
    }
    
    if($len_album > 0) {
        $arr_user_albums = $arr_user_graph['albums']['data'];
        $myArray['albums'] = parse_fb_albums($arr_user_albums);
    }
    if($len_post > 0) {
        $arr_user_posts = $arr_user_graph['posts']['data'];
        $myArray['posts'] = parse_fb_posts($arr_user_posts);
    }

    return $myArray;
}



# echo json object
if(isset($_GET['callback'])) {
    
    
    # fb query search for user, page, event, place, group
    if(isset($_GET['key']) && isset($_GET['type'])) {
        if($_GET['type'] != 'place') {
            $search_url = get_fb_search($_GET['key'], $_GET['type']);
        } else {
            $search_url = get_fb_place_search($_GET['key'], $_GET['lat'], $_GET['lng']);    
        }
        
        $json_fb_graph = file_get_contents($search_url);
        $arr_user_graph = json_decode($json_fb_graph, true);

        echo $_GET['callback'] . '(' . $json_fb_graph . ')';
        
    }
    
    # fb detail search for albums/posts
    if(isset($_GET['details'])) {
        $detailsArray = parse_fb_details($_GET['details']); // fb_id number
        
        $albumArray = $detailsArray['albums'];
        $postArray = $detailsArray['posts'];
        
        $jArray = json_encode($detailsArray, JSON_UNESCAPED_SLASHES);
        
        echo $_GET['callback'] . '(' . $jArray . ')';
    }
    
}

?>



