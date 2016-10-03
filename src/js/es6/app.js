'use strict';

(function($){
	function eda() {
		const aText = 'Whazzupp!';
		$('h1').html(aText);
	}

	$(window).on('load', function(){
		eda();
	});

})(jQuery || {});
