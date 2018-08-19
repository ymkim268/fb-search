// Kim, Young Min CS 571 HW8
// call ajax to obtain json object with type = {user, page, event, group}
var app = angular.module('myApp', ["ngAnimate"]);
var myLoc = []
var readyGeo = false;

if(typeof(Storage) !== "undefined") {
    console.log("i have local storage ready!")
    localStorage.clear();
} else {
    console.log("browser does not support local storage!");
    alert("does not support local storage!");
}

function clickOnFacebook(myUrl, name) {
    
    var theURL = myUrl;
    var theName = name;
FB.init({
    appId      : '682723015234162',
    status     : true,
    xfbml      : true,
    version    : 'v2.8' // or v2.6, v2.5, v2.4, v2.3
});
    
FB.ui({
    appId: '682723015234162',
    method: 'feed',
    link: window.location.href,
    picture: theURL,
    name: theName,
    caption: "FB SEARCH FROM USC CSCI571",
    display: 'popup',
  }, function(response){
      if(response && !response.error_message) {
          // success
          alert("Posted Successfully");
      } else {
          alert("Not Posted");
      }
  });

}


function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPosition);
    } else {
        console.log("does not support geolocation!");
    }
}

function getPosition(myPosition) {
    myLoc['lat'] = myPosition.coords.latitude;
    myLoc['lng'] = myPosition.coords.longitude;
    readyGeo = true;
    return readyGeo;
}

//getLocation();

function call_ajax(qType, qKey) {
    var fb_obj;
    
    $.ajax({
            url : 'http://localhost:8080',
            data : {
                key : qKey,
                type: qType
            },
            method : 'GET',
            dataType: 'jsonp',
            
            beforeSend : function(xhr, settings) {
                var url = settings.url;
                console.log(url);
            },
            success : function(response, status, xhr) {
                // parse here
                // log_info(response, status, xhr);
                fb_obj = parse_fb_obj(response);
                
            },
            error : function(xhr, status, error) {
                // parse error here
                console.log("error");
            }
            
        });
    
    console.log(fb_obj);
    return fb_obj;
}

// call ajax to obtain json object with type = place
function call_ajax_place(qKey, qLat, qLng) {
    $.ajax({
            url : 'http://localhost:8080',
            data : {
                key : qKey,
                type: 'place',
                lat: qLat,
                lng: qLng
            },
            method : 'GET',
            dataType: 'jsonp',
        
            success : function(response, status, xhr) {
                // parse here
                log_info(response, status, xhr);
                myarr = parse_fb_obj(response);
            },
            error : function(xhr, status, error) {
                // parse error here
                console.log("error");
            }
            
        });
}


function call_ajax_details(fb_id) {
    console.log("inside call ajax details");
    console.log(fb_id);
    
        $.ajax({
            url : 'http://localhost:8080',
            data : {
                details : fb_id
            },
            method : 'GET',
            dataType: 'jsonp',
            
            beforeSend : function(xhr, settings) {
                var url = settings.url;
                console.log(url);
            },
            success : function(response, status, xhr) {
                // parse here
                console.log("get details for fb id")
                console.log(fb_id);
                console.log(response);
                console.log(response.albums);
                console.log(response.posts);
            },
            error : function(xhr, status, error) {
                // parse error here
                console.log("error");
                console.log(status);
                console.log(error);
            }
            
        });
}


function log_info(response, status, xhr) {
    console.log("success");
    console.log(status);
    console.log(xhr);
    console.log(response);
    console.log(response.data);
                
    var obj = response.data; // parsed json object
    console.log(obj[0]);
    console.log(obj[0].picture.data.url);
}

function parse_fb_obj(response) {
    var fb_arr = response.data;
    // console.log("size of fbArr: " + fb_arr.length);
    
    var id_arr = [];
    var name_arr = [];
    var pic_url_arr = [];
    var return_arr = [];
    
    for (i=0; i < fb_arr.length; i++) {
        id_arr[i] = fb_arr[i].id;
        name_arr[i] = fb_arr[i].name;
        pic_url_arr[i] = fb_arr[i].picture.data.url;
    }
    
    return_arr[0] = id_arr;
    return_arr[1] = name_arr;
    return_arr[2] = pic_url_arr;
    
    
    id_list = id_arr;
    name_list = name_arr;
    pic_list = pic_url_arr;
    
    // console.log(return_arr);
    return return_arr;
}


// --- angular js functions ---
app.controller('clickCtrl', function($scope, $http) {
    var myFavArray = [];
    getLocation();
    $scope.name = "hello!";
    $scope.appState = "showNone";
    $scope.showPic = false;
    $scope.showPrev = false;
    $scope.showPostData = false;
    $scope.showAlbumData = false;
    $scope.showLoadingAlbum = false; // for details only
    $scope.showLoadingPost = false; // for details only
    $scope.isDone = 0;
    $scope.showFavTable = false;
    
    $scope.showNoPostData = false;
    $scope.showNoAlbumData = false;
    
    $scope.showUserSearch = false;
    $scope.showPageSearch = false;
    $scope.showEventSearch = false;
    $scope.showPlaceSearch = false;
    $scope.showGroupSearch = false;
    
    $scope.showUserDetail = false;
    $scope.showPageDetail = false;
    $scope.showEventDetail = false;
    $scope.showPlaceDetail = false;
    $scope.showGroupDetail = false;
    
    $scope.checkIndex = function(index, state) {
        // console.log("checkIndex!!");
        // console.log(index);
        if(index == 0) {
            return !(state);
        } else {
            return state;
        }
    }
    
    $scope.favID = [];
    
    $scope.fbClick = function(imgURL, objName) {
        
        console.log("inside fb click!");
        console.log(imgURL);
        console.log(objName);
        
        
        clickOnFacebook(imgURL, objName);
        
    }
    
    $scope.clickHandler = function() {
        console.log("angular js: clickHandler search button");
        
        /*
        if(document.getElementById("keyword").validity.valueMissing == true) {
            console.log("print out custom validation message!");
            document.getElementById("keyword").setCustomValidity("");
            document.getElementById("keyword").setCustomValidity('Please type a keyword');
        } else {
            console.log("not getting hit");
            document.getElementById("keyword").setCustomValidity("");
        }
        */
        
        
        // onsubmit - find user keyword
        var user_key = $("#keyword").val();
        // onsubmit - find user type
        var user_type = $("#sel_type li.active").attr("id");
        var user_key_len = user_key.length;
        console.log(user_key_len);
        console.log("before getting the length");
        
        
        if(user_key_len > 0) {
            $("#keyword").tooltip('hide');
        $scope.showUserSearch = false;
        $scope.showPageSearch = false;
        $scope.showEventSearch = false;
        $scope.showPlaceSearch = false;
        $scope.showGroupSearch = false;
        $scope.showUserDetail = false;
        $scope.showPageDetail = false;
        $scope.showEventDetail = false;
        $scope.showPlaceDetail = false;
        $scope.showGroupDetail = false;
            
            
            $scope.appState = "showLoading";
        
        console.log("entered the following:");
        console.log(user_key);
        console.log(user_type);
        
        
        // GET USER FB DATA
        var user_url = "https://helloworld-162211.appspot.com?callback=JSON_CALLBACK&key=" + user_key + "&type=" + 'user' + "&_=1490911938879";
        // var user_url = "http://localhost:8080?callback=JSON_CALLBACK&key=" + user_key + "&type=" + 'user' + "&_=1490911938879";
        
        // write out json data to bootstrap table
        $http.jsonp(user_url, {jsonpCallbackParam: 'callback'})
            .success(function(response){
            console.log("---json obj pass to jsquery for user data---");
            $scope.user_data = response.data;
            console.log($scope.user_data);
            console.log(response);
            // console.log(response.paging);
            // console.log(response.paging.next);
            if(response.paging != undefined) {
                console.log("response.paging is defined");
                $scope.fb_user_next = response.paging.next;
            } else {
                console.log("response.paging not defined");
            }
            
            
            $scope.isDone = $scope.isDone + 1;
            if($scope.isDone == 5) { 
                $scope.showUserSearch = true;
                $scope.showPageSearch = true; 
                $scope.showEventSearch = true;
                $scope.showGroupSearch = true;
                $scope.showPlaceSearch = true;
                $scope.appState = "showNone"; 
                $scope.isDone = 0;
            }
            console.log($scope.isDone);
            console.log("---end json obj pass to jsquery---");
        });
        
        // GET PAGE FB DATA
        var page_url = "https://helloworld-162211.appspot.com?callback=JSON_CALLBACK&key=" + user_key + "&type=" + 'page' + "&_=1490911938879";
        //var page_url = "http://localhost:8080?callback=JSON_CALLBACK&key=" + user_key + "&type=" + 'page' + "&_=1490911938879";
        
        // write out json data to bootstrap table
        $http.jsonp(page_url, {jsonpCallbackParam: 'callback'})
            .success(function(response){
            console.log("---json obj pass to jsquery for page data---");
            $scope.page_data = response.data;
            console.log($scope.page_data);
            if(response.paging != undefined) {
                console.log("response.paging is defined");
                $scope.fb_page_next = response.paging.next;
            } else {
                console.log("response.paging not defined");
            }
            
            $scope.isDone = $scope.isDone + 1;
            if($scope.isDone == 5) { 
                $scope.showUserSearch = true;
                $scope.showPageSearch = true; 
                $scope.showEventSearch = true;
                $scope.showGroupSearch = true;
                $scope.showPlaceSearch = true;
                $scope.appState = "showNone"; 
                $scope.isDone = 0;
            }
            console.log($scope.isDone);
            console.log("---end json obj pass to jsquery---");
        });
        
        // GET EVENT FB DATA
        var event_url = "https://helloworld-162211.appspot.com?callback=JSON_CALLBACK&key=" + user_key + "&type=" + 'event' + "&_=1490911938879";
        // var event_url = "http://localhost:8080?callback=JSON_CALLBACK&key=" + user_key + "&type=" + 'event' + "&_=1490911938879";
        
        // write out json data to bootstrap table
        $http.jsonp(event_url, {jsonpCallbackParam: 'callback'})
            .success(function(response){
            console.log("---json obj pass to jsquery for event data---");
            $scope.event_data = response.data;
            console.log($scope.event_data);
            if(response.paging != undefined) {
                console.log("response.paging is defined");
                $scope.fb_event_next = response.paging.next;
            } else {
                console.log("response.paging not defined");
            }
            
            $scope.isDone = $scope.isDone + 1;
            if($scope.isDone == 5) { 
                $scope.showUserSearch = true;
                $scope.showPageSearch = true; 
                $scope.showEventSearch = true;
                $scope.showGroupSearch = true;
                $scope.showPlaceSearch = true;
                $scope.appState = "showNone"; 
                $scope.isDone = 0;
            }
            console.log($scope.isDone);
            console.log("---end json obj pass to jsquery---");
        });
        
        // GET GROUP FB DATA
        var group_url = "https://helloworld-162211.appspot.com?callback=JSON_CALLBACK&key=" + user_key + "&type=" + 'group' + "&_=1490911938879";
        // var group_url = "http://localhost:8080?callback=JSON_CALLBACK&key=" + user_key + "&type=" + 'group' + "&_=1490911938879";
        
        // write out json data to bootstrap table
        $http.jsonp(group_url, {jsonpCallbackParam: 'callback'})
            .success(function(response){
            console.log("---json obj pass to jsquery for group data---");
            $scope.group_data = response.data;
            console.log($scope.group_data);
            if(response.paging != undefined) {
                console.log("response.paging is defined");
                $scope.fb_group_next = response.paging.next;
            } else {
                console.log("response.paging not defined");
            }
            
            $scope.isDone = $scope.isDone + 1;
            if($scope.isDone == 5) { 
                $scope.showUserSearch = true;
                $scope.showPageSearch = true; 
                $scope.showEventSearch = true;
                $scope.showGroupSearch = true;
                $scope.showPlaceSearch = true;
                $scope.appState = "showNone"; 
                $scope.isDone = 0;
            }
            console.log($scope.isDone);
            console.log("---end json obj pass to jsquery---");
        });
        
        
        if(readyGeo == false) {
            $scope.myLat = '34.0220';
            $scope.myLng = '-118.2892';
        } else {
            $scope.myLat = myLoc['lat'];
            $scope.myLng = myLoc['lng'];
        }
        

        
        // GET PLACE FB DATA
        var place_url = "https://helloworld-162211.appspot.com?callback=JSON_CALLBACK&key=" + user_key + "&type=" + 'place' + "&lat=" + $scope.myLat + "&lng=" + $scope.myLng + "&_=1490911938879";
        // var place_url = "http://localhost:8080?callback=JSON_CALLBACK&key=" + user_key + "&type=" + 'place' + "&lat=" + $scope.myLat + "&lng=" + $scope.myLng + "&_=1490911938879";
        
        console.log(place_url);
        // write out json data to bootstrap table
        $http.jsonp(place_url, {jsonpCallbackParam: 'callback'})
            .success(function(response){
            console.log("---json obj pass to jsquery for place data---");
            $scope.place_data = response.data;
            console.log(response);
            console.log($scope.place_data);
            
            if(response.paging != undefined) {
                console.log("response.paging is defined");
                $scope.fb_place_next = response.paging.next;
            } else {
                console.log("response.paging not defined");
            }
            
            $scope.isDone = $scope.isDone + 1;
            if($scope.isDone == 5) { 
                $scope.showUserSearch = true;
                $scope.showPageSearch = true; 
                $scope.showEventSearch = true;
                $scope.showGroupSearch = true;
                $scope.showPlaceSearch = true;
                $scope.appState = "showNone"; 
                $scope.isDone = 0;
            }
            console.log($scope.isDone);
            console.log("---end json obj pass to jsquery---");
        });
            
        }
        
    }
    
    $scope.clickClear = function() {
        $scope.showUserSearch = false;
        $scope.showPageSearch = false;
        $scope.showEventSearch = false;
        $scope.showPlaceSearch = false;
        $scope.showGroupSearch = false;
        
        $scope.showUserDetail = false;
        $scope.showPageDetail = false;
        $scope.showEventDetail = false;
        $scope.showPlaceDetail = false;
        $scope.showGroupDetail = false;
        
        $scope.appState = "showNone";
        
        $("#keyword").val('');
        
    }
    
    
    $scope.nextHandler = function(next_url) {
        console.log("agular js: nextHandler button");
        
        var user_type = $("#sel_type li.active").attr("id");
        
        if(next_url === undefined) {
            console.log("next is null");
        } else {
            console.log(next_url);
            
        $http({
            method: 'GET',
            url: next_url
        }).then(function successCallback(response) {
            console.log(user_type);
            console.log(response.data.data);
            console.log(response.data.paging);
            
            if(user_type == 'user') {
                if(response.data.paging.previous != undefined) {
                    $scope.showUserPrev = true;
                }
                if($scope.showUserPrev) {
                    console.log("showUserPrev is true");
                    $("#"+user_type+"_next").removeClass("col-xs-12");
                    $("#"+user_type+"_next").addClass("col-xs-6");
                    $("#"+user_type+"_next").css("text-align","left");
                } else {
                    $("#"+user_type+"_next").removeClass("col-xs-6");
                    $("#"+user_type+"_next").addClass("col-xs-12");
                    $("#"+user_type+"_next").css("text-align","center");
                }
                $scope.fb_user_next = response.data.paging.next;
                $scope.fb_user_prev = response.data.paging.previous;
                $scope.user_data = response.data.data; 
            }
            if(user_type == 'page') {
                if(response.data.paging.previous != undefined) {
                    $scope.showPagePrev = true;
                }
                if($scope.showPagePrev) {
                    console.log("showUserPrev is true");
                    $("#"+user_type+"_next").removeClass("col-xs-12");
                    $("#"+user_type+"_next").addClass("col-xs-6");
                    $("#"+user_type+"_next").css("text-align","left");
                } else {
                    $("#"+user_type+"_next").removeClass("col-xs-6");
                    $("#"+user_type+"_next").addClass("col-xs-12");
                    $("#"+user_type+"_next").css("text-align","center");
                }
                $scope.fb_page_next = response.data.paging.next;
                $scope.fb_page_prev = response.data.paging.previous;
                $scope.page_data = response.data.data; 
            }
            if(user_type == 'event') { 
                if(response.data.paging.previous != undefined) {
                    $scope.showEventPrev = true;
                }
                if($scope.showEventPrev) {
                    console.log("showUserPrev is true");
                    $("#"+user_type+"_next").removeClass("col-xs-12");
                    $("#"+user_type+"_next").addClass("col-xs-6");
                    $("#"+user_type+"_next").css("text-align","left");
                } else {
                    $("#"+user_type+"_next").removeClass("col-xs-6");
                    $("#"+user_type+"_next").addClass("col-xs-12");
                    $("#"+user_type+"_next").css("text-align","center");
                }
                $scope.fb_event_next = response.data.paging.next;
                $scope.fb_event_prev = response.data.paging.previous; 
                $scope.event_data = response.data.data; 
            }
            if(user_type == 'place') { 
                if(response.data.paging.previous != undefined) {
                    $scope.showPlacePrev = true;
                }
                if($scope.showPlacePrev) {
                    console.log("showUserPrev is true");
                    $("#"+user_type+"_next").removeClass("col-xs-12");
                    $("#"+user_type+"_next").addClass("col-xs-6");
                    $("#"+user_type+"_next").css("text-align","left");
                } else {
                    $("#"+user_type+"_next").removeClass("col-xs-6");
                    $("#"+user_type+"_next").addClass("col-xs-12");
                    $("#"+user_type+"_next").css("text-align","center");
                }
                $scope.fb_place_next = response.data.paging.next;
                $scope.fb_place_prev = response.data.paging.previous;
                console.log(response.data.paging.next);
                console.log(response.data.paging.previous);
                $scope.place_data = response.data.data; 
            }
            
            if(user_type == 'group') { 
                if(response.data.paging.previous != undefined) {
                    $scope.showGroupPrev = true;
                }
                if($scope.showGroupPrev) {
                    console.log("showUserPrev is true");
                    $("#"+user_type+"_next").removeClass("col-xs-12");
                    $("#"+user_type+"_next").addClass("col-xs-6");
                    $("#"+user_type+"_next").css("text-align","left");
                } else {
                    $("#"+user_type+"_next").removeClass("col-xs-6");
                    $("#"+user_type+"_next").addClass("col-xs-12");
                    $("#"+user_type+"_next").css("text-align","center");
                }
                $scope.fb_group_next = response.data.paging.next;
                $scope.fb_group_prev = response.data.paging.previous;  
                $scope.group_data = response.data.data; 
            }
            
        });
        }
    }
    $scope.prevHandler = function(prev_url) {
        console.log("agular js: prevHandler button");
        
        var user_type = $("#sel_type li.active").attr("id");
        
        
        if(prev_url === undefined) {
            console.log("prev is null");
        } else {
            console.log(prev_url);
        
        $http({
            method: 'GET',
            url: prev_url
        }).then(function successCallback(response) {
            console.log(user_type);
            console.log(response.data.data);
            console.log(response.data.paging);
            

            
            if(user_type == 'user') {
                if(response.data.paging.previous == undefined) {
                    $scope.showUserPrev = false;
                }
                if($scope.showUserPrev) {
                    console.log("showUserPrev is true");
                    $("#"+user_type+"_next").removeClass("col-xs-12");
                    $("#"+user_type+"_next").addClass("col-xs-6");
                    $("#"+user_type+"_next").css("text-align","left");
                } else {
                    $("#"+user_type+"_next").removeClass("col-xs-6");
                    $("#"+user_type+"_next").addClass("col-xs-12");
                    $("#"+user_type+"_next").css("text-align","center");
                }
                $scope.fb_user_next = response.data.paging.next;
                $scope.fb_user_prev = response.data.paging.previous;
                $scope.user_data = response.data.data; 
            }
            if(user_type == 'page') {
                if(response.data.paging.previous == undefined) {
                    $scope.showPagePrev = false;
                }
                if($scope.showPagePrev) {
                    console.log("showUserPrev is true");
                    $("#"+user_type+"_next").removeClass("col-xs-12");
                    $("#"+user_type+"_next").addClass("col-xs-6");
                    $("#"+user_type+"_next").css("text-align","left");
                } else {
                    $("#"+user_type+"_next").removeClass("col-xs-6");
                    $("#"+user_type+"_next").addClass("col-xs-12");
                    $("#"+user_type+"_next").css("text-align","center");
                }
                $scope.fb_page_next = response.data.paging.next;
                $scope.fb_page_prev = response.data.paging.previous;
                $scope.page_data = response.data.data; 
            }
            if(user_type == 'event') { 
                if(response.data.paging.previous == undefined) {
                    $scope.showEventPrev = false;
                }
                if($scope.showEventPrev) {
                    console.log("showUserPrev is true");
                    $("#"+user_type+"_next").removeClass("col-xs-12");
                    $("#"+user_type+"_next").addClass("col-xs-6");
                    $("#"+user_type+"_next").css("text-align","left");
                } else {
                    $("#"+user_type+"_next").removeClass("col-xs-6");
                    $("#"+user_type+"_next").addClass("col-xs-12");
                    $("#"+user_type+"_next").css("text-align","center");
                }
                $scope.fb_event_next = response.data.paging.next;
                $scope.fb_event_prev = response.data.paging.previous;
                $scope.event_data = response.data.data; 
            }
            if(user_type == 'place') { 
                if(response.data.paging.previous == undefined) {
                    $scope.showPlacePrev = false;
                }
                if($scope.showPlacePrev) {
                    console.log("showUserPrev is true");
                    $("#"+user_type+"_next").removeClass("col-xs-12");
                    $("#"+user_type+"_next").addClass("col-xs-6");
                    $("#"+user_type+"_next").css("text-align","left");
                } else {
                    $("#"+user_type+"_next").removeClass("col-xs-6");
                    $("#"+user_type+"_next").addClass("col-xs-12");
                    $("#"+user_type+"_next").css("text-align","center");
                }
                $scope.fb_place_next = response.data.paging.next;
                $scope.fb_place_prev = response.data.paging.previous;
                $scope.place_data = response.data.data; 
            }
            if(user_type == 'group') { 
                if(response.data.paging.previous == undefined) {
                    $scope.showGroupPrev = false;
                }
                if($scope.showGroupPrev) {
                    console.log("showUserPrev is true");
                    $("#"+user_type+"_next").removeClass("col-xs-12");
                    $("#"+user_type+"_next").addClass("col-xs-6");
                    $("#"+user_type+"_next").css("text-align","left");
                } else {
                    $("#"+user_type+"_next").removeClass("col-xs-6");
                    $("#"+user_type+"_next").addClass("col-xs-12");
                    $("#"+user_type+"_next").css("text-align","center");
                }
                $scope.fb_group_next = response.data.paging.next;
                $scope.fb_group_prev = response.data.paging.previous;
                $scope.group_data = response.data.data; 
            }
        });
            
        }
    }
    
    
    $scope.detailHandler = function(user_arg, user_name, user_pic) {
        console.log("angular js: detailHander button");
        
        $scope.showNoAlbumData = false;
        $scope.showNoPostData = false;
        $scope.showAlbumData = false;
        $scope.showPostData = false;
        
        
        var user_type = $("#sel_type li.active").attr("id");
        
        if($("#" + user_type + "Container").hasClass("trans_right")) {
            $("#" + user_type + "Container").removeClass("trans_right");
        }
        
        var y = $("#"+user_type+user_arg).hasClass('glyphicon glyphicon-star icon-success');
        var x = $("#"+user_type+user_arg).hasClass('glyphicon glyphicon-star-empty');
        if(y) {
            if($("#"+user_type+"fav").hasClass('glyphicon glyphicon-star-empty')) {
                $("#"+user_type+"fav").removeClass('glyphicon glyphicon-star-empty');
                $("#"+user_type+"fav").addClass('glyphicon glyphicon-star icon-success');
            }
        }
        if(x) {
            if($("#"+user_type+"fav").hasClass('glyphicon glyphicon-star icon-success')) {
                $("#"+user_type+"fav").removeClass('glyphicon glyphicon-star icon-success');
                $("#"+user_type+"fav").addClass('glyphicon glyphicon-star-empty');
            }
        }
        
        if(user_type == 'favorite') {
            console.log("favorite in detailHandler");
            if($("#"+'favorite'+"fav").hasClass('glyphicon glyphicon-star-empty')) {
                console.log("favorite icon not yellow");
                var myIndex = $scope.favID.indexOf(user_arg);
                console.log($scope.favID);
                console.log(myIndex);
                if(myIndex > -1) {
                    console.log("in detail handler: id in fav array, but not yellow star");
                    console.log("going to make fav empty -> yellow star");
                    $("#"+'favorite'+"fav").removeClass('glyphicon glyphicon-star-empty');
                    $("#"+'favorite'+"fav").addClass('glyphicon glyphicon-star icon-success');
                    console.log("made favorite icon yellow");
                }
            }
        }
        
        console.log("detail clicked on" + user_type);
        
        // $scope.appState = "showUserDetail";
        if(user_type == 'user') {
            $scope.showUserSearch = false;
            $scope.showUserDetail = true;
        }
        if(user_type == 'page') {
            $scope.showPageSearch = false;
            $scope.showPageDetail = true;
        }
        if(user_type == 'event') {
            $scope.showEventSearch = false;
            $scope.showEventDetail = true;
        }
        if(user_type == 'place') {
            $scope.showPlaceSearch = false;
            $scope.showPlaceDetail = true;
        }
        if(user_type == 'group') {
            $scope.showGroupSearch = false;
            $scope.showGroupDetail = true;
        }
        if(user_type == 'favorite') {
            $scope.showFavTable = false;
            $scope.showFavoriteDetail = true;
        }
        
        // button - find user id for details
        var user_id = user_arg;
        $scope.detail_id = user_id;
        $scope.detail_name = user_name;
        $scope.detail_pic = user_pic;
        console.log(user_id);
        console.log(user_name);
        console.log(user_pic);
        // call_ajax_details(user_id);
        
        $scope.showLoadingAlbum = true;
        $scope.showLoadingPost = true;
        
        // GET FB DETAILS
        var myurl = "https://helloworld-162211.appspot.com?callback=JSON_CALLBACK&details=" + user_id + "&_=1490911938879";
        // var myurl = "http://localhost:8080?callback=JSON_CALLBACK&details=" + user_id + "&_=1490911938879";
        
        $http.jsonp(myurl, {jsonpCallbackParam: 'callback'})
            .success(function(response){
            console.log("---json obj pass to jsquery---");
            console.log(response);
            console.log("getting to parse");
            
            if(response.albums === undefined) {
                // display no data found
                $scope.showAlbumData = false;
                $scope.showNoAlbumData = true;
                console.log("response.albums is undefined");
                $scope.showLoadingAlbum = false;
            } else {
                $scope.showAlbumData = true;
                $scope.showNoAlbumData = false;
                $scope.album_data = response.albums;
                console.log(response.albums.length);
                $scope.showLoadingAlbum = false;
            }
            
            
            if(response.posts === undefined) {
                // display no data found
                $scope.showPostData = false;
                $scope.showNoPostData = true;
                console.log("response.posts is undefined");
                $scope.showLoadingPost = false;
            } else {
                $scope.showPostData = true;
                $scope.showNoPostData = false;
                $scope.post_data = response.posts;
                $scope.post_id = user_id;
                $scope.post_name = user_name;
                $scope.post_purl = user_pic;
                console.log(response.posts.length);
                $scope.showLoadingPost = false;
                
            }
            
            console.log("---json obj pass to jsquery---");
            
        });
        
    }
    
    $scope.showAlbumContent = function(albumData) {
        
        console.log("in show album content checking!");
        if(albumData.url_1 == null || albumData.url_1 == undefined) {
            console.log("url is missing in album or not present!");
            return false;
        } else {
            return true;
        }
    }
    
    
    
    
    $scope.backHandler = function() {
        console.log("angular js: backHandler search button");
        
        var user_type = $("#sel_type li.active").attr("id");
        console.log("back clicked on" + user_type);
        // $scope.appState = "showUserDetail";
        
        if(!($("#" + user_type + "Container").hasClass("trans_right"))) {
            $("#" + user_type + "Container").addClass("trans_right");
        }
        
        if(user_type == 'user') {
            $scope.showUserDetail = false;
            $scope.showUserSearch = true;
        }
        if(user_type == 'page') {
            $scope.showPageDetail = false;
            $scope.showPageSearch = true;
        }
        if(user_type == 'place') {
            $scope.showPlaceDetail = false;
            $scope.showPlaceSearch = true;
        }
        if(user_type == 'event') {
            $scope.showEventDetail = false;
            $scope.showEventSearch = true;
        }
        if(user_type == 'group') {
            $scope.showGroupDetail = false;
            $scope.showGroupSearch = true;
        }
        if(user_type == 'favorite') {
            $scope.showFavoriteDetail = false;
            $scope.showFavTable = true;
            
            myFavArray = [];
        for(i=0; i < $scope.favID.length; i++) {
            console.log($scope.favID[i]);
            myFavArray[i] = JSON.parse(localStorage.getItem($scope.favID[i]));
        }
        
        $scope.fav_data = myFavArray;
        }
           
    }
    
    $scope.showStar = true;
    $scope.favoriteHandler = function(user_id, type, user_name, user_pic_url) {
        console.log("inside favorite handler!");
        console.log(type);
        
        var x = $("#"+type+user_id).hasClass('glyphicon glyphicon-star-empty');
        var y = $("#"+type+user_id).hasClass('glyphicon glyphicon-star icon-success');
        console.log(x);
        console.log(y);
        if(x == true) {
            $("#"+type+user_id).removeClass('glyphicon glyphicon-star-empty');
            $("#"+type+user_id).addClass('glyphicon glyphicon-star icon-success');
        }
        if(y == true) {
            $("#"+type+user_id).removeClass('glyphicon glyphicon-star icon-success');
            $("#"+type+user_id).addClass('glyphicon glyphicon-star-empty');
        }
        console.log("end favorite handler!");
        
        /*
        if($scope.showStar == false) {
            $scope.showStar = true;
        } else {
            $scope.showStar = false;
        }
        */
        
        console.log("in favorite handler!");
        console.log("testing local storage!");
        console.log(localStorage.length);
        
        if(x) {
            console.log("add to local storage!");
            if(!($scope.favID.indexOf(user_id) > -1)) {
                var fidObj = {"name": user_name, "type" : type, "pic" : user_pic_url, "id" : user_id};
                var fidStr = JSON.stringify(fidObj);
                localStorage.setItem(user_id, fidStr);
                $scope.favID.push(user_id);
                console.log(localStorage.getItem(user_id));
                console.log(JSON.parse(localStorage.getItem(user_id)));
                console.log(localStorage.length);
            }
        }
        
        if(y) {
            console.log("remove from local storage!");
            localStorage.removeItem(user_id);
            var toRemove = $scope.favID.indexOf(user_id);
            if(toRemove > -1) {
                $scope.favID.splice(toRemove, 1);
            }
            console.log(localStorage.length);
        }
        
        
    }
    
    $scope.detailStarHandler = function(type, user_id, user_name, user_pic_url) {
        console.log("inside detail star handle!!!");
        console.log(type);
        var x = $("#"+type+"fav").hasClass('glyphicon glyphicon-star-empty');
        var y = $("#"+type+"fav").hasClass('glyphicon glyphicon-star icon-success');
        
        /*
        var a = $("#"+type+user_id).hasClass('glyphicon glyphicon-star-empty');
        var b = $("#"+type+user_id).hasClass('glyphicon glyphicon-star icon-success');
        */
        
        if(x) {
            console.log("going to make empty star -> yellow star!");
            
            $("#"+type+user_id).removeClass('glyphicon glyphicon-star-empty');
            $("#"+type+user_id).addClass('glyphicon glyphicon-star icon-success');
            $("#"+type+"fav").removeClass('glyphicon glyphicon-star-empty');
            $("#"+type+"fav").addClass('glyphicon glyphicon-star icon-success');
            

            
            console.log("add to local storage!");
            if(!($scope.favID.indexOf(user_id) > -1)) {
                var fidObj = {"name": user_name, "type" : type, "pic" : user_pic_url, "id" : user_id};
                var fidStr = JSON.stringify(fidObj);
                localStorage.setItem(user_id, fidStr);
                $scope.favID.push(user_id);
                console.log(localStorage.getItem(user_id));
                console.log(JSON.parse(localStorage.getItem(user_id)));
                console.log(localStorage.length);
            }
        }

        if(y) {
            console.log("going to make yellow star -> empty star!");
            
            $("#"+type+user_id).removeClass('glyphicon glyphicon-star icon-success');
            $("#"+type+user_id).addClass('glyphicon glyphicon-star-empty');
            $("#"+type+"fav").removeClass('glyphicon glyphicon-star icon-success');
            $("#"+type+"fav").addClass('glyphicon glyphicon-star-empty');
            
            console.log("remove from local storage!");
            localStorage.removeItem(user_id);
            var toRemove = $scope.favID.indexOf(user_id);
            if(toRemove > -1) {
                $scope.favID.splice(toRemove, 1);
            }
            console.log(localStorage.length);
        }  
    }
    
    
    $scope.detailFavStarHandler = function(type, user_id, user_name, user_pic_url) {
        console.log("inside favorite detail star handler!!");
        if($("#"+type+"fav").hasClass('glyphicon glyphicon-star icon-success')) {
            console.log("going to make yellow star -> empty star!");
            myObj = JSON.parse(localStorage.getItem(user_id));
            myObjType = myObj.type;
            
            $("#"+myObjType+user_id).removeClass('glyphicon glyphicon-star icon-success');
            $("#"+myObjType+user_id).addClass('glyphicon glyphicon-star-empty');
            $("#"+type+"fav").removeClass('glyphicon glyphicon-star icon-success');
            $("#"+type+"fav").addClass('glyphicon glyphicon-star-empty');
            
            console.log("remove from local storage!");
            localStorage.removeItem(user_id);
            var toRemove = $scope.favID.indexOf(user_id);
            if(toRemove > -1) {
                $scope.favID.splice(toRemove, 1);
            }
            console.log(localStorage.length);
            
        } else {
            console.log("going to make empty star -> yellow star!");
            
            $("#"+type+"fav").removeClass('glyphicon glyphicon-star-empty');
            $("#"+type+"fav").addClass('glyphicon glyphicon-star icon-success');
            
            var typeArray = ['user', 'page', 'event', 'place', 'group'];
            var myObjType = null;
            for(i=0; i<typeArray.length; i++) {
                if($("#"+typeArray[i]+"fav").hasClass('glyphicon glyphicon-star-empty')) {
                    $("#"+typeArray[i]+user_id).removeClass('glyphicon glyphicon-star-empty');
                    $("#"+typeArray[i]+user_id).addClass('glyphicon glyphicon-star icon-success');
                    myObjType = typeArray[i];
                }
            }
            
            console.log("add to local storage!");
            if(!($scope.favID.indexOf(user_id) > -1)) {
                var fidObj = {"name": user_name, "type" : myObjType, "pic" : user_pic_url, "id" : user_id};
                var fidStr = JSON.stringify(fidObj);
                localStorage.setItem(user_id, fidStr);
                $scope.favID.push(user_id);
                console.log(localStorage.getItem(user_id));
                console.log(JSON.parse(localStorage.getItem(user_id)));
                console.log(localStorage.length);
            }
        }
        
    }
    
    
    
    $scope.favClickHandler = function() {
        console.log("inside fav handler!");
        if($scope.showFavoriteDetail == true) {$scope.showFavTable = false;}
        $scope.showFavTable = true;
        
        console.log(localStorage);
        console.log($scope.favID);
        
        $scope.lssize = $scope.favID.length + localStorage.length;
        
        myFavArray = [];
        for(i=0; i < $scope.favID.length; i++) {
            console.log($scope.favID[i]);
            myFavArray[i] = JSON.parse(localStorage.getItem($scope.favID[i]));
        }
        
        $scope.fav_data = myFavArray;
    }
    
    $scope.removeFavHandler = function(user_id, type) {
        console.log("inside removeFavHandler for fav tab!");
        
        // var y = $("#"+type+"fav").hasClass('glyphicon glyphicon-star icon-success');
        var x = $("#"+type+user_id).hasClass('glyphicon glyphicon-star icon-success');
        
        /*if(y) {
            $("#"+type+"fav").removeClass('glyphicon glyphicon-star icon-success');
            $("#"+type+"fav").addClass('glyphicon glyphicon-star-empty');
        }*/
        if(x) {
            $("#"+type+user_id).removeClass('glyphicon glyphicon-star icon-success');
            $("#"+type+user_id).addClass('glyphicon glyphicon-star-empty');
        }
        
        
        console.log("remove from local storage!");
        localStorage.removeItem(user_id);
        var toRemove = $scope.favID.indexOf(user_id);
        console.log(user_id);
        if(toRemove > -1) {
            $scope.favID.splice(toRemove, 1);
        }
        console.log(localStorage.length);
        console.log(myFavArray);
        
        myFavArray = [];
        for(i=0; i < $scope.favID.length; i++) {
            myFavArray[i] = JSON.parse(localStorage.getItem($scope.favID[i]));
        }
        
        $scope.fav_data = myFavArray;
        console.log(myFavArray);
        
    }

    
    
});



// --- jquery functions ---
$(document).ready(function() {
    
    // jquery to find user input in search form
    $("#form_search").submit(function(event) {
        var user_key = $("#keyword").val();
        var user_key_len = user_key.length;
        
        if(user_key_len <= 0) {
            $("#keyword").tooltip('show');
            console.log("tooltip is shown!");
        } else {
            console.log("tooltip is not shown!");
            $("#keyword").tooltip('destroy');
        }
        
        
        //event.preventDefault();
        
    });
    
    // jquery to highlight active menu tab
    $(".nav-tabs a").click(function(){
        $(this).tab('show');
    });
});

