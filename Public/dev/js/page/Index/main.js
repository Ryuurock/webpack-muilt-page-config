require( '$d/css/common.less' );
require( './style.less' );
define( [
  'require',
  'jquery',
  'bootstrap',
  'login',
  'header',
  'bigwe_utils',
  'message',
  'constants',
  './welcome'
], function( require, $ ) {
  var login = require( 'login' );
  var constants = require( 'constants' );
  var ShowTitleMessage = require( 'message' );

  if ( $( '#back_show_modal' ).val() && constants.userLogin == '' ) {
    $( function() {
      setTimeout( function() {
        login.$selector.modal( 'show' );
      }, 100 );
    } );
  }
  $( '#carousel' ).carousel();
  $( document ).on( 'scroll.homeAnimation', function() {
    var scrollTop = $( this ).scrollTop();
    if ( $( 'section.product_show.active' ).length == $( 'section.product_show' ).length ) {
      $( this ).off( 'scroll.homeAnimation' );
      return;
    }
    $( 'section.product_show' ).each( function() {
      var thisOffsetTop = $( this ).offset().top;
      if ( thisOffsetTop - scrollTop < $( window ).height() - $( this ).outerHeight() / 3 && !$( this ).hasClass( 'active' ) ) {
        $( this ).addClass( 'active' );
        // 优化备用
        /*$('img', this).each(function() {
            $(this).prop('src', $(this).attr('_src'));
        });*/
      }
    } );
  } );


  $( 'section.product_show' ).each( function() {
    var thisOffsetTop = $( this ).offset().top;
    var thisHeight = $( this ).outerHeight();
    if ( thisOffsetTop + thisHeight / 3 < $( window ).height() ) {
      $( this ).addClass( 'active' );
      // 优化备用
      /*$('img', this).each(function() {
          $(this).prop('src', $(this).attr('_src'));
      });*/
    }
  } );
  $( 'body' ).removeClass( 'safe_load' );

} );