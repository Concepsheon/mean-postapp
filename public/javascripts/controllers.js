var routerCtrls = angular.module('routerCtrls', ['postAuth'])

.controller('MainCtrl', function($scope,posts, auth){
    $scope.posts = posts.posts;
    $scope.isLoggedIn = auth.isLoggedIn;
    
    $scope.addPost = function(){
        if(!$scope.title || $scope.title === '') { return; }
        posts.create({
            title: $scope.title,
            link: $scope.link,
        });
        $scope.title = '';
        $scope.link = '';
    };
    
    $scope.upvote = function(post){
        posts.upvote(post);
    };
})

.controller('PostsCtrl', function($scope, posts, post, auth){
    $scope.post = post;
    $scope.isLoggedIn = auth.isLoggedIn;
    
   $scope.addComment = function(){
       if($scope.body === '') { return; }
       posts.addComment(post._id, {
           body: $scope.body
       }).success(function(comment) {
           $scope.post.comments.push(comment);
       });
       $scope.body = '';
   };
   
   $scope.upvote = function(comment){
       posts.upvoteComment(post, comment);
   };
})

.controller('AuthCtrl', function($scope, $state, auth){
    $scope.user = {};
    
     $scope.register = function(){
    auth.register($scope.user).then(function(){
      $state.go('home');
    });
  };

  $scope.login = function(){
    auth.login($scope.user).then(function(){
      $state.go('home');
    });
  };
    
})

.controller('NavCtrl', function($scope, auth){
    
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.currentUser = auth.currentUser;
    $scope.logout = auth.logout;
});



