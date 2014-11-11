'use strict';

/**
 * @ngdoc overview
 * @name bongApp
 * @description
 * # bongApp
 *
 * Main module of the application.
 */

var requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

angular
  .module('bongApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
 .service('CanvasService',  function() {
   var context
   return  {
     player : null,
     computer: null,
     ball: null,
       
     styleCanvasElement : function(element, width, height, color){
         context = element.getContext('2d');
         //console.log(element);
         element.width = width;
         element.height = height;
         this.render(color)
         context.fillStyle = color; //"#FF00FF";
         context.fillRect(0, 0, width, height);
       },
       
     render : function(participant,color){
         context.fillStyle = '#0000FF'; //"#FF00FF";
         context.fillRect(participant.x, participant.y, participant.width, participant.height);
       },
       
     ballRender : function(){
       //console.log(this.ball.x + this.ball.y + this.ball.radius);
         context.beginPath();
         context.arc(this.ball.x, this.ball.y, this.ball.radius,0, 2 * Math.PI, false);
         context.fillStyle = "#000000";
         context.fill();
       },
     CreatePlayer: function(x, y, width, height){
       this.player = new this.Paddle(x, y, width, height);
       //console.log(this.player);
       
     },
     
     CreateComputer: function(x, y, width, height){
       this.computer = new this.Paddle(x, y, width, height)
     },
       
     Paddle : function(x, y, width, height){
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
          this.x_speed = 0;
          this.y_speed = 0;
          //context.fillStyle = '#0000FF';
          //context.fillRect(this.x, this.y, this.width, this.height);
       },
     
     CreateBall: function(x,y) {
        this.ball = new this.Ball(x,y);
    },       
    
     Ball : function(x,y){
         this.x = x;
         this.y = y;
         this.x_speed = 0;
         this.y_speed = 3;
         this.radius = 5;
       },
     
     animate: function(){
       requestAnimFrame(this.step.bind(this))
     },
     
     step : function () {
                  this.updatePosition();
                  this.renderObjects();
                  requestAnimFrame(this.step.bind(this))
      },
     
     renderObjects: function(){
       //console.log(this.player);
        this.render(this.player);
        this.render(this.computer);
        this.ballRender();
     } ,
       
     updatePosition : function() {
//                   console.log(this.ball.x);
//                   console.log(this.ball.y);
                  this.ballUpdate(this.ball,this.player, this.computer);
        },

     ballUpdate : function(ballPosition,paddle1, paddle2) {
              ballPosition.x += ballPosition.x_speed;
              ballPosition.y += ballPosition.y_speed;
              var top_x = ballPosition.x - 5;
              var top_y = ballPosition.y - 5;
              var bottom_x = ballPosition.x + 5;
              var bottom_y = ballPosition.y + 5;

  if(ballPosition.x - 5 < 0) { // hitting the left wall
    ballPosition.x = 5;
    ballPosition.x_speed = -ballPosition.x_speed;
  } else if(ballPosition.x + 5 > 400) { // hitting the right wall
    ballPosition.x = 395;
    ballPosition.x_speed = -ballPosition.x_speed;
  }

  if(ballPosition.y < 0 || ballPosition.y > 600) { // a point was scored
    ballPosition.x_speed = 0;
    ballPosition.y_speed = 3;
    ballPosition.x = 200;
    ballPosition.y = 300;
  }

  if(top_y > 300) {
    if(top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
      // hit the player's paddle
      ballPosition.y_speed = -3;
      ballPosition.x_speed += (paddle1.x_speed / 2);
      ballPosition.y += ballPosition.y_speed;
    }
  } else {
    if(top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
      // hit the computer's paddle
      ballPosition.y_speed = 3;
      ballPosition.x_speed += (paddle2.x_speed / 2);
      ballPosition.y += ballPosition.y_speed;
    }
  }

        }
     

     };
  })
 .directive("drawing",['CanvasService', function(CanvasService){
    return{
      restrict: 'A',
      link: function(scope,element,attributes){
        //console.log(element[0]);
        //var gameFactory = new CanvasFactory();
        CanvasService.styleCanvasElement(element[0],400,600,'#FF00FF')
        
        CanvasService.CreatePlayer(175, 580, 50, 10);
        CanvasService.CreateComputer(175, 10, 50, 10);
        CanvasService.CreateBall(200,300);
        CanvasService.animate();
        //CanvasService.animate(CanvasService.step);
    }
  };
  }]);
