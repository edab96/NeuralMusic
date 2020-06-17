
var resume = false;
var generatedMidi = '/static/LinkinPark 15-06-2020 221406.mid';

console.log(MIDIjs.get_duration(generatedMidi))

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

