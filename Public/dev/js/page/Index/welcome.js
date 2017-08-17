define( [ 'jquery' ], function( $ ) {
	//点击到相应的页面
	$( '.search_area .search_item' ).eq( 0 ).addClass( 'selected' ).siblings().removeClass( 'selected' );
	if ( localStorage.getItem( 'count' ) == undefined ) {
		$( '.guide_wrap img' ).each( function() {
			$( this ).prop( 'src', $( this ).attr( '_src' ) );
		} );
		$( '.guide_wrap' ).fadeIn();
		$( '.guide_jingr' ).fadeIn();
		$( 'body' ).css( 'overflow', 'hidden' );
		try {
			localStorage.setItem( 'count', 1 );
		} catch ( e ) {
			alert( '您当前处于无痕浏览模式，某些功能可能会受到限制，建议切换到正常模式使用！' )
		}
	}

	$( '.guide_jingr .close' ).on( 'click', function() {
		$( '.guide_wrap' ).hide();
		$( '.guide_wrap>div' ).hide();
		$('body').css('overflow','');
	} );

	return null;
} );