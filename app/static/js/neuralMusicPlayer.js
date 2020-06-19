
var resume = false;
var generatedMidi = '';


$(".play-button").click(function(){
	console.log("Clicked");
	if (resume==true){
		MIDIjs.resume()
	}
	else {
		resume = true;
		MIDIjs.play(generatedMidi);
	}

});

$(".stop-button").click(function(){
	 MIDIjs.pause();
});

$(".download-button").click(function(){
	 window.open(generatedMidi, '_blank').focus();
});

