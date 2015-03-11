'use strict';

var app = angular.module('yaadeinApp');
var originURL = 'http://172.25.55.156:60010';

app.controller('YaadeinController', ['$scope', '$http', '$q', '$upload', '$location', '$routeParams', 'dataTicker', 
    function ($scope, $http, $q, $upload, $location, $routeParams, dataTicker) {

	$scope.appname = 'Yaadein';

	$scope.navigationItems = [
		{
			'id': 'home',
			'class': 'fa fa-home',
			'url': '/',
			'hint': 'Home'
		},
		{
			'id': 'profile',
			'class': 'fa fa-user',
			'url': '/profile/',
			'hint': 'My Profile'
		},
		{
			'id': 'search',
			'class': 'fa fa-search',
			'url': '#',
			'hint': 'Search something'
		},
		{
			'id': 'post',
			'class': 'fa fa-pencil-square-o',
			'url': '#',
			'hint:': 'Post a memory'
		},
		{
			'id': 'notifications',
			'class': 'fa fa-bell',
			'url': '#',
			'hint': 'Notifications'
		},
		{
			'id': 'signOut',
			'class': 'fa fa-sign-out',
			'url': '/',
			'hint': 'Log Out'
		}
	];

	$scope.currentNavItem = $scope.navigationItems[0];
	$scope.prevNavItem = $scope.navigationItems[0];

	$scope.setCurrentNavItem = function (navItem) {
		$scope.prevNavItem = $scope.currentNavItem;		
		$scope.currentNavItem = navItem;
		if ($scope.currentNavItem.id === 'search' || $scope.currentNavItem.id === 'post') {
			$('#centered').addClass('blur-back');
			$('.right-sidebar').addClass('blur-back');
		} else {
			$('#centered').removeClass('blur-back');
			$('.right-sidebar').removeClass('blur-back');
		}
	};

	$scope.isCurrentNavItem = function (navItem) {
		return $scope.currentNavItem !== null && $scope.currentNavItem.id === navItem.id;
	};

	$scope.getCurrentNavItem = function () {
		return $scope.currentNavItem.id;
	};

	$scope.closePost = function () {
		$('#centered').removeClass('blur-back');
		$('.right-sidebar').removeClass('blur-back');
		$('#postBox').fadeOut(300);
		$scope.currentNavItem = $scope.prevNavItem;
	};

	$scope.closeSearch = function () {
    $('#centered').removeClass('blur-back');
		$('.right-sidebar').removeClass('blur-back');
		$('#searchBox').fadeOut(300);
		$scope.currentNavItem = $scope.prevNavItem;
	};

  $scope.addOriginToImageUrl = function (resp) {
    var results = resp.results;
    for(var i = 0; i < results.length; i += 1) {
      results[i].profile_pic = originURL + results[i].profile_pic;
      results.id;
      console.log(results[i].profile_pic);
    }
    return resp;
  };

  $scope.personSelected = function(selected) {
    $location.path('/profile/' + selected.originalObject.id);
    $scope.setCurrentNavItem($scope.navigationItems[1]);
  };

	$scope.user = {
		'name': 'Sahil Lamba',
		'enrolmentNo': 13117060,
		'label': 'B.Tech. ME II Year',
		'profilePic': 'images/users/1.jpg',
		'coverPic': 'images/cover.png'
	};

	//Append enrolment number to profile and gallery URLs
	$scope.navigationItems[1].url += $scope.user.enrolmentNo.toString();

	$scope.ticks = [];
	var tickPromise = dataTicker.getTicks();
	tickPromise.then(function (d) {
		$scope.ticks = d;
	});

	$scope.isLoading = false;

	$scope.addToTicker = function () {
		$scope.isLoading = true;
		$http.get('http://beta.json-generator.com/api/json/get/HByxuXv')
			.success(function (ds) {
				for(var i = 0; i < ds.length; i += 1) {
					$scope.ticks.push(ds[i]);
				}
		});
		$scope.isLoading = false;
	}; 

  $scope.newPost = {
    'post_owner': $scope.user.name,
    'post_owner_enrol': $scope.user.enrolmentNo.toString(),
    'post_owner_branch': $scope.user.label,
    'post_owner_pic': $scope.user.profilePic,
    'time': '',
    'image_url': [],
    'post_text': '',
    'user_tags': []
  };

  $scope.loadTags = function (query) {
    var defer = $q.defer();
    $http.get(originURL + '/yaadein/search/?q=' + query)
      .success(function (d) {
          defer.resolve(d.results);
    });
    return defer.promise;
  };

  $scope.$watch('files', function () {
      $scope.upload($scope.files);
  });

  $scope.$watch('coverpic', function () {
      $scope.upload($scope.coverpic);
  });

  $scope.upload = function (files) {
    var uploadUrl = originURL + '/yaadein/user/' + $scope.user.enrolmentNo.toString() + '/';
    if ($routeParams && $routeParams.enrolmentNo) {
      console.log($routeParams.enrolmentNo);
      uploadUrl = originURL + '/yaadein/user/' + $routeParams.enrolmentNo + '/';
    }
    if (files && files.length) {
      console.log($scope.newPost.post_text);
      console.log($scope.newPost.user_tags);
      //for(var i = 0; i < files.length; i += 1) {
        //var file = files[i];
        $upload.upload({
          url: uploadUrl,
          headers: {'Content-Type':'multipart/form-data'}, 
          method: 'POST',
          data: {
            post_text: $scope.newPost.post_text,
            user_tags: $scope.newPost.user_tags
          },
          file: files,
          withCredentials: false,
        }).progress(function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '%' + evt.config.file.name);
        }).success(function (data, status, headers, config) {
          console.log('file' + config.file.name + 'uploaded. Response' + JSON.stringify(data)); 
        });
     //}
    }
  };

$scope.uploadCover = function (files) {
    if (files && files.length === 1) {
      //for(var i = 0; i < files.length; i += 1) {
        //var file = files[i];
        $upload.upload({
          url: originURL + '/yaadein/cover/upload/',
          headers: {'Content-Type':'multipart/form-data'}, 
          method: 'POST',
          data: {
          },
          file: files,
          withCredentials: false,
        }).progress(function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '%' + evt.config.file.name);
        }).success(function (data, status, headers, config) {
          console.log('file' + config.file.name + 'uploaded. Response' + JSON.stringify(data)); 
          location.reload();
        });
     //}
    }
  };
  
  $scope.predictEmoji = function(term) {
    var emojiList = [];
    return $http.get('data/emojis.json')
      .then(function (response) {
          angular.forEach(response.data, function(item) {
            if (item.name.toUpperCase().indexOf(term.toUpperCase()) >= 0) {
              emojiList.push(item);
              console.log(emojiList);
            }
          });
      $scope.emojis = emojiList;
      return $q.when(emojiList);
   });
  };

  $scope.getEmojiTextRaw = function(item) {
    return ':' + item.name + ':';
  };

  $scope.macros = {
	'brb': 'Be right back',
	'omw': 'On my way',
	'(smile)' : '<img src="http://a248.e.akamai.net/assets.github.com/images/icons/emoji/smile.png"' +
	' height="20" width="20">'
  };
}]);

app.controller('HomeController', ['$scope', '$http', 'HomeService', function ($scope, $http, HomeService) {

	$scope.loggedUser = {};
	var userPromise = HomeService.getLoggedUser();
	userPromise.then(function (d) {
		  $scope.currentUser = d;
      console.log(d);
	});

	//$scope.addToFeed = function () {
		//$http.get('http://beta.json-generator.com/api/json/get/CHdvIym')
			//.success(function (ds) {
				//for(var i = 0; i < ds.length; i += 1) {
					//$scope.posts.push(ds[i]);
				//}
		//});
	//};

}]);

app.controller('ProfileController', ['$routeParams', '$scope', '$http', 'dataUsers', 
	function ($routeParams, $scope, $http, dataUsers) {

	$scope.currentUser = {};
	var userPromise = dataUsers.getUser($routeParams.enrolmentNo);
	userPromise.then(function (d) {
			$scope.currentUser = d;
      $scope.currentUser.profilePic = originURL + $scope.currentUser.profilePic;
      $scope.currentUser.coverPic = originURL + $scope.currentUser.coverPic;
      $scope.user.profilePic = $scope.currentUser.profilePic;
      var posts = $scope.currentUser.posts_data;
      for (var i = 0; i < posts.length; i += 1) {
        posts[i].post_owner_pic = originURL + posts[i].post_owner_pic;
        for (var j = 0; j < posts[i].image_url.length; j += 1) {
          posts[i].image_url[j] = originURL + posts[i].image_url[j];
        }
      }
      console.log(d);
	});

	$scope.addToFeed = function () {
		$http.get('http://beta.json-generator.com/api/json/get/CHdvIym')
			.success(function (ds) {
				for(var i = 0; i < ds.length; i += 1) {
					$scope.posts.push(ds[i]);
				}
		});
	};

}]);

app.controller('GalleryController', ['$routeParams', '$scope', 'dataUsers', 
	function ($routeParams, $scope, dataUsers) {

	$scope.currentUser = {};
	var userPromise = dataUsers.getUsers();
	userPromise.then(function (d) {
		for(var i = 0; i < d.length; i += 1) {
			if(d[i].enrolmentNo === parseInt($routeParams.enrolmentNo)) {
				$scope.currentUser = d[i];
				break;
			}
 		}
	});

}]);

app.controller('HashtagController', ['$routeParams', '$scope', '$http', 'HashtagService', 
	function ($routeParams, $scope, $http, HashtagService) {

  $scope.hash = $routeParams.hashtag;  
	$scope.posts = [];
	var dataPromise = HashtagService.getHashtaggedPosts($routeParams.hashtag);
	dataPromise.then(function (d) {
    for(var i = 0; i < d.posts_data.length; i += 1) {
      d.posts_data[i].post_owner_pic = originURL + d.posts_data[i].post_owner_pic;
      for(var j = 0; j < d.posts_data[i].image_url.length; j += 1) {
        d.posts_data[i].image_url[j] = originURL + d.posts_data[i].image_url[j];
      }
    }
    $scope.posts = d.posts_data;
    console.log($scope.posts);
  });
	
}]);

app.controller('SettingsController', ['$scope', function ($scope) {
}]);
