(function(){
	var stage,
		scene,
		boxContainer,
		sw, sh,
		px, py,
		ppx, ppy,
		cpx, cpy,
		boxSize = 575,
		lastVache,
		cows = [],
		clouds = [],
		wind = 2,
		targetWind = 2,
		touched = false,
		touchID = -1,
		helix,
		touhedObject,
		ufo,
		uforx = 0,
		ufosx = .12,
		lastFrame,
		boxTop;

	var init = function() {
	
		stage = Sprite3D.createCenteredContainer();
		sw = window.innerWidth;
		sh = window.innerHeight;
		px = -0.17849898580121704;
		py = 0.4572815533980582;
		cpx = -0.17849898580121704;
		cpy = 0.4572815533980582;
		ppx = 0;
		ppy = 0;
	
		scene = stage.addChild( new Sprite3D() );
	 
		// BOX //
		boxContainer = stage.addChild( 
			new Sprite3D()
				.setId("boxContainer")
				.setRegistrationPoint( 640, 640, 0 )
				.setPosition( 0,200,-600)
				.setRotation( 70,0,0 )
				.setTransformString( "_p _rx _rz _ry _s" )
				.update()
		);
		boxTop = boxContainer.addChild(
			new Sprite3D()
				.setId("boxTop")
				.setPosition( 358, 362, 231 )
				.update()
		);
		// BOX SIDES //
		addBoxSide( "boxSide1", 358, 937, 0 );
		addBoxSide( "boxSide2", 358, 362, 270 );
		addBoxSide( "boxSide3", 933, 362, 180 );
		addBoxSide( "boxSide4", 933, 937, 90 );
	
		// COWS //
		for( var i = 0; i < 5; i++ ) {
			var x = (Math.random()*.8+.1),
				flipped = Math.random()>.5;
			cows.push( boxTop.addChild( 
				new Sprite3D()
					.setClassName("vache"+Math.ceil(Math.random()*3))
					.setRegistrationPoint( 38, 78, 0 )
					.setTransformOrigin( "38px", "78px" )
					.setPosition( x*boxSize, (Math.random()*.8+.1)*boxSize, 0 )
					.setRotation( -90, (x-.5) * 45, 0 )
					.setProperty( "flipped", flipped )
					.addEventListener( "mouseover", onVacheTouch )
					.addEventListener( "touchstart", onVacheTouch )
					.update()
			) );
		}
	
		// BANNER //
		boxTop.addChild( 
			new Sprite3D()
				.setId("banner")
				.setRegistrationPoint( 0, 332, 0 )
				.setTransformOrigin( "0px", "332px" )
				.setPosition( 10, 60, 0 )
				.setRotation( -90, .4, 0 )
				.update()
		);
	
		// SUN //
		boxTop.addChild( 
			new Sprite3D()
				.setId("sun")
				.setTransformString( "_p _rx _rz _ry _s" )
				.setRegistrationPoint( 125, 750-136, 0 )
				.setTransformOrigin( "125px", (750-136)+"px" )
				.setPosition( boxSize * .92, -250, 360 )
				.setRotation( -90, -2, 0 )
				.addEventListener( "mousedown", onSunClick )
				.addEventListener( "touchstart", onSunClick )
				.update()
		);
	
		// CLOUD //
		var cloudY, cloudZ;
		for( var i = 0; i < 7; i++ ) {
			cloudY = (Math.random()*1.4-.4)*boxSize;
			cloudZ = Math.random()*190+300;
			clouds.push( boxTop.addChild( 
				new Sprite3D()
					.setClassName("cloud"+Math.ceil(Math.random()*3))
					.setTransformString( "_p _rx _rz _ry _s" )
					.setTransformOrigin( "62px", (750-40)+"px" )
					.setRegistrationPoint( 62, 750-40, 0 )
					.setPosition( (Math.random()*1.4-.2)*boxSize, cloudY, cloudZ )
					.setRotation( -90, -Math.random()*10-5, 0 )
					.setProperty( "targetY", cloudY )
					.setProperty( "targetZ", cloudZ )
					.update()
			) );
		
		}
	
		// MOULIN //
		var moulin = boxTop.addChild( 
			new Sprite3D()
				.setId("moulin")
				.setRegistrationPoint( 60, 201, 0 )
				.setTransformOrigin( "60px", "201px" )
				.setPosition( 90, 380, 0 )
				.setRotation( -90, 20, 0 )
				.update()
		);
	
		helix = moulin.addChild( 
			new Sprite3D()
				.setId("helix")
				.setRegistrationPoint( 89, 93, 0 )
				.setTransformOrigin( "89px", "93px" )
				.setPosition( 60, 80, 5 )
				.addEventListener( "mousedown", onHelixClick )
				.addEventListener( "touchstart", onHelixClick )
				.update()
		);
	
		// UFO //
		boxTop.addChild( 
			new Sprite3D()
				.setId("ufo")
				.setTransformString( "_p _rx _rz _ry _s" )
				.setRegistrationPoint( 61, 750-50, 0 )
				.setTransformOrigin( "61px", "0px")//(750-50)+"px" )
				.setPosition( boxSize>>1, boxSize>>1, 800 )
				.setRotation( -90, -2, 0 )
	//			.addEventListener( "mousedown", onSunClick )
	//			.addEventListener( "touchstart", onSunClick )
				.update()
		);
	
	
		// mouse listeners
		document.addEventListener( "mousedown", onMouseDown, false );
		document.addEventListener( "mousemove", onMouseMove, false );
		document.addEventListener( "mouseup", onMouseUp, false );
		// touch listeners
		document.addEventListener( "touchstart", onTouchStart, false );
		document.addEventListener( "touchmove", onTouchMove, false );
		document.addEventListener( "touchend", onTouchEnd, false );
		// window listeners
		window.addEventListener( "resize", onResize, false );
		window.addEventListener( "deviceorientation", onOrientation, false );
		onResize();
	
		// animate
		//setInterval( move, 1000 / 50 );
		lastFrame = new Date().getTime();
		animate();
	}

	// TOUCH LISTENERS ///////////////////////////////////
	var onTouchStart = function(e) {
		if ( !touched ) {
			var t = e.changedTouches[0];
			ppx = ( t.pageX / sw ) - .5;
			ppy = ( t.pageY / sh ) - .5;
			touched = true;
			touchID = t.identifier;
		}
		e.preventDefault();
	}

	var onTouchMove = function(e) {
		if ( touched ) {
			var ts = e.changedTouches,
				nt = ts.length;
			while(nt--) {
				var t = e.changedTouches[nt];
				if ( t.identifier == touchID ) {
					var tx = ( t.pageX / sw ) - .5,
						ty = ( t.pageY / sh ) - .5;
					px -= tx - ppx;
					py -= ty - ppy;
					ppx = tx;
					ppy = ty;
					if ( px < -.5 ) px = -.5;
					if ( px > .5 ) px = .5;
					if ( py < -.5 ) py = -.5;
					if ( py > .5 ) py = .5;
					break;
				}
			}
		}
		e.preventDefault();
	}

	var onTouchEnd = function(e) {
		if ( touched ) {
			var ts = e.changedTouches,
				nt = ts.length;
			while(nt--) {
				var t = e.changedTouches[nt];
				if ( t.identifier == touchID ) {
					touched = false;
					touchID = -1;
					break;
				}
			}
		}
		e.preventDefault();
	}


	// MOUSE LISTENERS ///////////////////////////////////

	var onMouseDown = function( e ) {
		if ( !touched ) {
			ppx = ( e.pageX / sw ) - .5;
			ppy = ( e.pageY / sh ) - .5;
			touched = true;
		}
		e.preventDefault();
	}

	var onMouseMove = function( e ) {
		if ( touched ) {
			var tx = ( e.pageX / sw ) - .5,
				ty = ( e.pageY / sh ) - .5;
			px -= tx - ppx;
			py -= ty - ppy;
			ppx = tx;
			ppy = ty;
			if ( px < -.5 ) px = -.5;
			if ( px > .5 ) px = .5;
			if ( py < -.5 ) py = -.5;
			if ( py > .5 ) py = .5;
		}
		e.preventDefault();
	}

	var onMouseUp = function(e) {
		touched = false;
		e.preventDefault();
	}


	// WINDOW LISTENERS ///////////////////////////////////

	var onResize = function(e) {
		sw = window.innerWidth;
		sh = window.innerHeight;
		var s = Math.min( sw, sh ) / 768.0;
		stage.setScale( s, s, s ).update();
	}

	var onOrientation = function(e) {
		window.scrollTo( 0, 0 );
	}


	// OBJECTS LISTENERS ///////////////////////////////////

	var activateVache = function(vache) {
		if ( lastVache ) 
			lastVache
				.setScale( lastVache.flipped?-1:1, 1, 1 )
				.update();
		/*
		vache.flipped = !vache.flipped;
		vache
			.setScale( vache.flipped?-1.2:1.2, 1.4, 1 )
			.rotateY( Math.random()*2-1 )
			.update();
			*/
		lastVache = vache;
	}

	var onVacheTouch = function(e,sprite) {
		// move
		var x = sprite.x + (Math.round(Math.random())*2-1) * 50,
			y = sprite.y + (Math.round(Math.random())*2-1) * 50,
			flipped = sprite.flipped;
		// limit
		if ( x < 50 ) x = 50;
		if ( x > boxSize-50 ) x = boxSize - 50;
		if ( y < 80 ) y = 80;
		if ( y > boxSize-50 ) y = boxSize - 50;
		// move
		sprite
			.setPosition( x, y, 0 )
			.setRotation( -90, (x/boxSize-.5) * 45, 0 )
			.setProperty( "flipped", flipped )
			//.setScale( flipped?-1+Math.random()*.3:1+Math.random()*.3, 1+Math.random()*.3, 1 )
			.update();
				
	//	activateVache(sprite);
		e.preventDefault();
		e.stopImmediatePropagation();
	}

	var onVacheOver = function(e,sprite) {
		activateVache(sprite);
	}

	var onVacheOut = function(e,sprite) {
		
	}

	var onHelixClick = function(e,sprite) {
		if ( targetWind == 0 ) {
			targetWind = 1 + Math.random()*7;
		} else {
			targetWind = 0;
		}
		e.preventDefault();
		e.stopImmediatePropagation();
	}

	var onSunClick = function(e,sprite) {
		sprite
			.setPosition( boxSize * Math.random(), -250, 360 )
			.setRotation( -90, sprite.rotationY+180, 0 )
			.update();
		e.preventDefault();
		e.stopImmediatePropagation();
	}

	// ANIMATION LOOP ///////////////////////////////////

	var animate = function() {
		requestAnimationFrame( animate );
		move();
	}

	var move = function() {
		cpx += (px-cpx) * .1;
		cpy += (py-cpy) * .1;
		boxContainer
			.setPosition( cpx*100, 230+cpy*50, -cpy*600-150)
			.setRotation( 70 + cpy * 50, 0, cpx * 210 )
			.update();
	
		wind += (targetWind-wind) * .01;
		
		helix.rotateZ(wind).update();
	
		var n = clouds.length,
			c, cx;
		
		while(n--) {
			c = clouds[n];
			cx = c.x;
			if ( cx < -290 ) {
				cx = -290-cx;
				c.z = c.targetZ + cx*cx*.1;
			} else if ( cx > boxSize+290 ) {
				cx = cx - (boxSize+290);
				c.z = c.targetZ + cx*cx*.1;
				if ( cx > 110 ) {
					c.targetY = (Math.random()*1.4-.4)*boxSize;
					c.targetZ = Math.random()*190+300;
					c.setPosition(-400 - Math.random()*400, c.targetY, 3000 );
				}
			}
			c.moveX(wind).update();
		}
	}



	// HELPER FUNCTIONS ///////////////////////////////////

	var addBoxSide = function( id, px, py, r ) {
		boxContainer.addChild(
			new Sprite3D()
				.setClassName("boxSide")
				.setId(id)
				.setTransformOrigin( "0px", "0px" )
				.setTransformString( "_p _rx _rz _ry _s" )
				.setPosition( px, py, 231 )
				.setRotation( -90, r, 0 )
				.update()
		);
	}

	init();
})();