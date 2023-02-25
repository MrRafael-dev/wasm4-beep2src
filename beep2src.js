/** Filesystem library. */
let fs = require("fs");

/** Command line arguments. */
var arguments = process.argv.slice(2);

/** Expected arguments to be received. */
var expectedArguments = 6;

// Display usage when not enough arguments are passed...
if(arguments.length < expectedArguments) {
  console.log(`
===========================================================
BeatBox to WASM-4 Importer
Version 0.0.0.1
===========================================================
Usage:
  * node beep2src {@path} {@resname} {@incdriver} {@language} {@source channel} {@max sequences}

@path: The path to BeepBox's JSON file.
@resname: A resource name (that is, the variable name you want to use in code).
@incdriver: Use "true" to include the driver code at the top.
@language: The programming language to use. Currently supported: "rust", "go" or "cpp".
@source channel: The music channel to select in the source file. Only one channel can be selected.
@max sequences: The maximum number of squences to process.

Example:
* node beep2src ./Bach.json Bach_melody true cpp 0 6 >../my-wasm-project/src/sounds.cpp
===========================================================
Notes:
  * Scale must be "expert", key must be "C".
  * Only the very first instrument will be converted.
  * This may or may not be updated (it's just a PoC).
  * Only Rust, Go and C++ are supported.
===========================================================
BeepBox:
  * Official website: https://www.beepbox.co/
===========================================================
`);
  return;
}

/** BeepBox music file. */
let file = fs.readFileSync(arguments[0].toString(), "utf8");

/** BeepBox data object parsed from JSON. */
let data = JSON.parse(file);

/** Templates in use. */
let templates = {
  	"rust": 	fs.readFileSync("./templates/driver.rs", "utf8"),
  	"go":  		fs.readFileSync("./templates/driver.go", "utf8"),
  	"cpp": 		fs.readFileSync("./templates/driver.cpp", "utf8")
};

// Final result.
let result = "";

// Include driver (optional)...
if(arguments[2].toString().trim().toLowerCase() === "true") {
	let keyLang = arguments[3].toString().trim().toLowerCase();
  	result += templates[keyLang];
}

/**
 * BeepBox settings.
 * Some important notes:
 *
 * ~ Tones SHOULD be in scale "expert" and key "C".
 * ~ The "introBars" and "loopBars" determine music duration. In the context
 *   of the original file, they represent offsets from the beginning and the
 *   end of the music.
 */
let BeepBox = {
	
  /** Note value mapping */
  firstTone : 24,  // The first tone.
  lastTone : 83,  // The last tone.
	
  /** Waves (instruments) available for use. */
  waves: [
    "triangle",
    "square",
    "pulse wide",
    "pulse narrow",
    "sawtooth"
  ]
};

/**
 * Music data mounted via conversion.
 */
let Music = {
  /** Variable name. */
  name : arguments[1].toString().trim().toUpperCase(),
  /** Instrument in use. */
  instrument: 0,
  /** Track notes. */
  notes: [],
  /* The last tick processed */
  finalTick: 0,
};

/**
 * Instance an description object for one note.
 *
 * @param {Object} note Note object (from BeepBox file).
 *
 * @return {Object}
 */
Music.createNote = function(note, tickOffset) {
  // Get the converted tone value for the note.
  let toneVal = 0;

  if(note.pitches[0] < BeepBox.firstTone || note.pitches[0]> BeepBox.lastTone)
    toneVal = 0xFF;
  else
  	toneVal = note.pitches[0] - BeepBox.firstTone;

  // Description object.
  let noteObject = {
    pitch   : note.pitches[0],
    start   : note.points[0].tick + tickOffset,
    end     : note.points[1].tick + tickOffset,
    tone    : toneVal,
    sustain : 5,
    duration: (note.points[1].tick - note.points[0].tick)
  };

  // Calculate music sustain.
  if(noteObject.duration > 2) {
    noteObject.sustain = (noteObject.duration * 5) - 5;
  }

  return noteObject;
};

/**
 * Create an empty description note.
 *
 * @return {Object}
 */
Music.createNoteEmpty = function() {
  return {
    pitch   : null,
    start   : null,
    end     : null,
    tone    : 0xFF,
    sustain : 5,
    duration: null
  };
};

/**
 * Print every saved note in array format (text).
 *
 * @return {string}
 */
Music.print = function(lang) {
  // Text to return.
  let text = "";

  // Iterate through each note and concatenate text...
  for(let i = 0; i <= Music.finalTick; i += 1) {
    let note = Music.notes[i] || Music.createNoteEmpty();
	  
	if(lang=="rust")
    	text += `(0x${note.tone.toString(16).padStart(2,0)},0x${note.sustain.toString(16).padStart(2,0)},0x00),`;
	else if(lang=="go")
    	text += `(0x${note.tone.toString(16).padStart(2,0)},0x${note.sustain.toString(16).padStart(2,0)},0x00),`;
	else if(lang=="cpp")
    	text += `0x${note.tone.toString(16).padStart(2,0)},0x${note.sustain.toString(16).padStart(2,0)},0x00 ,`;
  }

  // Remove comma from last element...
  text = text.substring(0, text.length - 1);
	
  return text;
};

// Fill soundtrack with empty notes. They will be replaced by actual notes
// when the data file is processed...
for(let i = 0; i < 32; i += 1) {
  Music.notes[i] = Music.createNoteEmpty();
}

/** Ticks per beat. */
let ticks = data.ticksPerBeat;

/** Main channel (only the first track is supported). */
let selectedChannel = arguments[4];
let numberOfSequencesToProcess = arguments[5];
let channel = data.channels[selectedChannel];

/** Wave name in use. */
let instrument = channel.instruments[0];

/** Patterns **/
let tickOffset = 0;
for(let i=0; i<numberOfSequencesToProcess && channel.sequence[i]; i+=1) {

	/** Get the sequence **/
	let sequence = channel.sequence[i];
	
	/** Track pattern of notes */
	let pattern = channel.patterns[sequence];

	/** Soundtrack notes. */
	let notes = pattern.notes;

	// Iterate through the track...
	lastTickEnd = 0;
	for(let noteIndex in notes) {
	  let note = notes[noteIndex];

	  // Description object.
	  let noteObject = Music.createNote(note, tickOffset);

	  // Save music...
	  Music.notes[noteObject.start] = noteObject;

	  lastTickEnd = noteObject.end;
	}

	tickOffset = lastTickEnd;

}  // end sequence

Music.finalTick = tickOffset;

// Get instrument index...
Music.instrument = BeepBox.waves.indexOf(instrument.wave);

// Revert back to zero if it doesn't exist or it's not supported...
if(Music.instrument < 0) {
  Music.instrument = 0;
}

// Print track...
let lang = arguments[3].toString().trim().toLowerCase();
if(lang=="rust") {
	
// *** RUST ***
result += `
/// Soundtrack: *${Music.name}*
static mut ${Music.name}: Track = Track {
    next      : 0,
    wait      : 0,
    ticks     : ${ticks},
    instrument: ${Music.instrument},
    volume    : 100,
    flags     : (0,0),
    tones: [ ${Music.print(lang)} ],
};
`;

} else if(lang=="go") {
	
// *** GO ***
result += `
/// Soundtrack: *${Music.name}*
static mut ${Music.name}: Track = Track {
    next      : 0,
    wait      : 0,
    ticks     : ${ticks},
    instrument: ${Music.instrument},
	volume    : 100,
    flags     : (0,0),
    tones: [ ${Music.print(lang)} ],
};
`;
	
// *** CPP ***
} else if(lang=="cpp") {
	
result += `
/// Soundtrack: *${Music.name}*
const uint8_t ${Music.name}_tones[] =  { 
 ${Music.print(lang)} 
};

Track ${Music.name} = {
    /*next*/ 0,
    /*wait*/ 0,
    /*ticks*/ ${ticks},
    /*instrument*/ ${Music.instrument},
	/*volume*/ 100,
    /*flags*/ {0,0},
    /*tones*/ (uint8_t*)${Music.name}_tones,
    /*tone count*/ sizeof(${Music.name}_tones)/3
};

void step_${Music.name}()
{
	step( ${Music.name} );
}
`;
	
}

// Result.
console.log(result);
