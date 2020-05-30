$(function() {
    var playerTrack = $("#player-track"), 
    bgArtwork = $('#bg-artwork'), 
    bgArtworkUrl, 
    albumName = $('#album-name'), 
    trackName = $('#track-name'), 
    albumArt = $('#album-art'), 
    sArea = $('#s-area'), 
    seekBar = $('#seek-bar'), 
    trackTime = $('#track-time'), 
    insTime = $('#ins-time'), 
    sHover = $('#s-hover'), 
    playPauseButton = $("#play-pause-button"),  
    i = playPauseButton.find('i'), 
    tProgress = $('#current-time'), 
    tTime = $('#track-length'), 
    seekT, seekLoc, seekBarPos, cM, ctMinutes, ctSeconds, curMinutes, curSeconds, durMinutes, durSeconds, playProgress, bTime, nTime = 0, buffInterval = null, tFlag = false, 
    albumNameText = "Blabla",
    trackNameText = "Track name",
    // albums = ['Jeck','Me & You','Electro Boy','Home','Proxy (Original Mix)'], 
    // trackNames = ['Pirates','Alex Skrindo - Me & You','Kaaze - Electro Boy','Jordan Schor - Home','Martin Garrix - Proxy'], 
    albumArtworks = ['_1','_2','_3','_4','_5'];
    // trackUrl = ['https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/2.mp3'],
    // currIndex = -1;

    function playPause()
    {
        setTimeout(function()
        {
            if(player.state === "paused")
            {
                playerTrack.addClass('active');
                albumArt.addClass('active');
                checkBuffering();
                i.attr('class','fas fa-pause');
                player.play();
            }
            else
            {
                playerTrack.removeClass('active');
                albumArt.removeClass('active');
                clearInterval(buffInterval);
                albumArt.removeClass('buffering');
                i.attr('class','fas fa-play');
                player.pause();
            }
        },300);
    }

    
    // Is hovering the timeline on the song progress bar according to the mause position over it
	function showHover(event)
	{
		seekBarPos = sArea.offset(); 
		seekT = event.clientX - seekBarPos.left;
		seekLoc = player.duration * (seekT / sArea.outerWidth());
		
		sHover.width(seekT);
		
		cM = seekLoc / 60;
		
		ctMinutes = Math.floor(cM);
		ctSeconds = Math.floor(seekLoc - ctMinutes * 60);
		
		if( (ctMinutes < 0) || (ctSeconds < 0) )
			return;
		
        if( (ctMinutes < 0) || (ctSeconds < 0) )
			return;
		
		if(ctMinutes < 10)
			ctMinutes = '0'+ctMinutes;
		if(ctSeconds < 10)
			ctSeconds = '0'+ctSeconds;
        
        if( isNaN(ctMinutes) || isNaN(ctSeconds) )
            insTime.text('--:--');
        else
		    insTime.text(ctMinutes+':'+ctSeconds);
            
		insTime.css({'left':seekT,'margin-left':'-21px'}).fadeIn(0);
		
	}

    // Hiding the hover when the mause in not on the progress bar
    function hideHover()
	{
        sHover.width(0);
        insTime.text('00:00').css({'left':'0px','margin-left':'0px'}).fadeOut(0);		
    }
    
    function playFromClickedPos()
    {
        player.setPosition(seekLoc);//nothing
        console.log("position is " + player.getPosition());
		seekBar.width(seekT);
		hideHover();
    }

    function updateCurrTime()
	{
        nTime = new Date();
        nTime = nTime.getTime();

        if( !tFlag )
        {
            tFlag = true;
            trackTime.addClass('active');
        }

		curMinutes = Math.floor(player.getPosition() / 60);
		curSeconds = Math.floor(player.getPosition() - curMinutes * 60);
		
        durMinutes = Math.floor(player.duration / 60);
        // console.log("player duration " + player.duration);
		durSeconds = Math.floor(player.duration - durMinutes * 60);
		
		playProgress = (player.getPosition() / player.duration) * 100;
		
		if(curMinutes < 10)
			curMinutes = '0'+curMinutes;
		if(curSeconds < 10)
			curSeconds = '0'+curSeconds;
		
		if(durMinutes < 10)
			durMinutes = '0'+durMinutes;
		if(durSeconds < 10)
			durSeconds = '0'+durSeconds;
        
        if( isNaN(curMinutes) || isNaN(curSeconds) )
            tProgress.text('00:00');
        else
		    tProgress.text(curMinutes+':'+curSeconds);
        
        if( isNaN(durMinutes) || isNaN(durSeconds) )
            tTime.text('00:00');
        else
		    tTime.text(durMinutes+':'+durSeconds);
        
        if( isNaN(curMinutes) || isNaN(curSeconds) || isNaN(durMinutes) || isNaN(durSeconds) )
            trackTime.removeClass('active');
        else
            trackTime.addClass('active');

        
		seekBar.width(playProgress+'%');
		
		if( playProgress == 100 )
		{
			i.attr('class','fa fa-play');
			seekBar.width(0);
            tProgress.text('00:00');
            albumArt.removeClass('buffering').removeClass('active');
            clearInterval(buffInterval);
		}
    }
    
    function checkBuffering()
    {
        clearInterval(buffInterval);
        buffInterval = setInterval(function()
        { 
            if( (nTime == 0) || (bTime - nTime) > 1000  )
                albumArt.addClass('buffering');
            else
                albumArt.removeClass('buffering');

            bTime = new Date();
            bTime = bTime.getTime();

        },100);
    }

    function selectTrack(flag)
    {
        // if( flag == 0 || flag == 1 )
        //     ++currIndex;
        // else
        //     --currIndex;

        // if( (currIndex > -1) && (currIndex < albumArtworks.length) )
        // {
            if( flag == 0 )
                i.attr('class','fa fa-play');
            else
            {
                albumArt.removeClass('buffering');
                i.attr('class','fa fa-pause');
            }

            seekBar.width(0);
            trackTime.removeClass('active');
            tProgress.text('00:00');
            tTime.text('00:00');

            // currAlbum = albums[0];
            // currTrackName = trackNames[0];
            currArtwork = albumArtworks[0];

            // audio.src = trackUrl[currIndex];
            
            nTime = 0;
            bTime = new Date();
            bTime = bTime.getTime();

            if(flag != 0)
            {
                player.play();
                playerTrack.addClass('active');
                albumArt.addClass('active');
            
                clearInterval(buffInterval);
                checkBuffering();
            }

            albumName.text(albumNameText);
            trackName.text(trackNameText);
            albumArt.find('img.active').removeClass('active');
            $('#'+currArtwork).addClass('active');
            
            // bgArtworkUrl = $('#'+currArtwork).attr('src');

            // bgArtwork.css({'background-image':'url('+bgArtworkUrl+')'});
        // }
        // else
        // {
        //     if( flag == 0 || flag == 1 )
        //         --currIndex;
        //     else
        //         ++currIndex;
        // }
    }

    function initPlayer()
	{	
        player=new MIDIPlayer();
        player.setSong("/static/assets/pirates.mid");
        selectTrack(0);
		
		// audio.loop = false;
		
		playPauseButton.on('click',playPause);
		sArea.mousemove(function(event){ showHover(event); });
        sArea.mouseout(hideHover);
        sArea.on('click',playFromClickedPos);
        // player.addEventListener('timeupdate',updateCurrTime);
        setInterval(updateCurrTime, 500);
	}
    
	initPlayer();
});