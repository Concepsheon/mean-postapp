var postAuth = angular.module('postAuth', [])

.factory('posts', function($http, auth){
    var o = {
        posts: []
    };
    
    o.getAll = function() {
        return $http.get('/posts').then(function(res){
            angular.copy(res.data, o.posts);
        },function(res){
            return console.log(res.statusText);
        });
    };
    
    o.create = function(post) {
      return $http.post('/posts', post, {
          headers: {Authorization: 'Bearer '+ auth.getToken()}
      }).then(function(res){
          o.posts.push(res.data);
      });
    };

    o.upvote = function(post) {
        return $http.put('/posts/' + post._id + '/upvote', null, {
          headers: {Authorization: 'Bearer '+ auth.getToken()}
        }).then(function(res){
            post.upvotes ++;
        });
    };
    
    o.get = function(id) {
        return $http.get('/posts/' + id).then(function(res){
            return res.data;
        });
    };
    
    o.addComment = function(id, comment) {
        return $http.post('/posts/' + id + '/comments', comment, {
          headers: {Authorization: 'Bearer '+ auth.getToken()}
        });
    };
    
    o.upvoteComment = function(post, comment) {
        return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote', null, {
          headers: {Authorization: 'Bearer '+ auth.getToken()}
        }).then(function(res){
            comment.upvotes ++;
        });
};
    return o;
})

.factory('auth', function($http,$window) {
    var auth = {};
    
    auth.saveToken = function(token){
        $window.localStorage['access-token'] = token;
    };
    
    auth.getToken = function(){
        return $window.localStorage['access-token'];
    };
    
    auth.isLoggedIn = function(){
        var token = auth.getToken();
        
        if(token){
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    };
    
    auth.currentUser = function(){
        if(auth.isLoggedIn()){
            var token = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            
            return payload.username;
        }
    };
    
    auth.register = function(user){
        return $http.post('/register', user).success(function(data){
            auth.saveToken(data.token);
        });
    };
    
    auth.login = function(user){
        return $http.post('/login', user).success(function(data){
            auth.saveToken(data.token);
        });
    };
    
    auth.logout = function(){
        $window.localStorage.removeItem('access-token');
    };
    
    return auth;
})