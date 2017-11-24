/**
 * Author: Sergey Bondarenko (BR0kEN)
 * E-mail: broken@propeople.com.ua
 * Github: https://github.com/BR0kEN-/jTap
 * Updated: June 2, 2014
 * Version: 0.2.9
 */
(function($, _) {
  'use strict';

  /**
   * @param (object) ev - extending object, which contain event properties.
   *  - (string) start - start event depending of @isTap.
   *  - (string) end - start event depending of @isTap.
   */
  var ev = {
    start: 'mousedown.tap',
    end: 'mouseup.tap'
  };

  //auto detect
  if("ontouchstart" in document){
	  ev.start = "touchstart.tap";
  }
  
  if("ontouchend" in document){
	  ev.end = "touchend.tap";
  }
  
  $.event.special[_] = {
    setup: function() {
      $(this).off('click').on(ev.start + ' ' + ev.end, function(e) {
        /**
         * Adding jQuery event to @ev object depending of @isTap.
         *
         * Attention: value of this property will change two time
         * per event: first time - on start, second - on end.
         */
    	  var evt = null;
    	  if(e.originalEvent != null){
    		  if(e.originalEvent.changedTouches != null){
    			  evt = e.originalEvent.changedTouches[0];
    		  }else if(e.originalEvent.targetTouches != null){
    			  evt = e.originalEvent.targetTouches[0];
    		  }else{
    			  evt = e.originalEvent;
    		  }
    	  }else{
    		  evt = e;
    	  }
    	  
    	  ev.E = evt;
      }).on(ev.start, function(e) {
        /**
         * Function stop if event is simulate by mouse.
         */
        if (e.which && e.which !== 1) {
        	return;
        }

        /**
         * Extend @ev object from event properties of initial phase.
         */
        ev.target = e.target;
        ev.time = new Date().getTime();
        ev.X = ev.E.pageX;
        ev.Y = ev.E.pageY;
      }).on(ev.end, function(e) {
        /**
         * Compare property values of initial phase with properties
         * of this, final, phase. Execute event if values will be
         * within the acceptable and set new properties for event.
         */
    	  var diff = 2;
    	  var durationTime = 750;
    	  var range = {x1:ev.E.pageX - diff, x2:ev.E.pageX + diff,y1:ev.E.pageY - diff, y2:ev.E.pageY + diff};
    	  var nextTime = new Date().getTime();
          var diffTime = nextTime - ev.time;
          var isHit = false;
          if(ev.X >= range.x1 && ev.X <= range.x2 && ev.Y >= range.y1 && ev.Y <= range.y2){
        	  isHit = true;
          }
          
		 if (ev.target === e.target && diffTime < durationTime && isHit) {
			  e.type = _;
			  e.pageX = ev.E.pageX;
			  e.pageY = ev.E.pageY;
			  $.event.dispatch.call(this, e);
		 }
		
          
      });
    },

    /**
     * Disassembling event.
     */
    remove: function() {
      $(this).off(ev.start + ' ' + ev.end);
    }
    
  };

  $.fn[_] = function(fn) {
    return this[fn ? 'on' : 'trigger'](_, fn);
  };
})(jQuery, 'tap');
