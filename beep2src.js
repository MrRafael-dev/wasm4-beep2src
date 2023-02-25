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

@path: path to BeepBox's JSON file.
@resname: Resource name (that is, the variable name you want to use in code).
@incdriver: use "true" to include the driver.
@language: the programming language to use. Currently supported: "rust", "go" or "cpp".
@source channel: The music channel to select in the source file. Only one channel can be selected.
@max sequences: The maximun number of squences to process.

Example:
* node beep2src ./Bach.json Bach_melody true cpp 0 6 >../my-wasm-project/src/sounds.cpp
===========================================================
Notes:
  * Scale must be "expert", key must be "C".
  * Only the very first instrument will be converted.
  * It only works with one track.
  * Each track has support for 32 notes.
  * This may or may not be updated (it's just a PoC).
  * Only Rust is supported.
===========================================================
BeepBox:
  * Official website: https://www.beepbox.co/2_3/
  * Only version 2.3 is supported.
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
  /** Musical note indexes, sorted by pitch. */
  //notes: [
  //  24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 
  //  36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 
  //	48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,  
  //	60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
  //   72, 72, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83,
   //84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95,
  // ],

  firstTone : 24,  // The first tone.
  lastTone : 83,  // The last tone.
	
  /** Musical note names. */
  //names: [
  //    "C0", "D+0",  "D0", "E+0",  "E0",  "F0", "F#0",  "G0", "A+0",  "A0", "B+0",  "B0",  
  //	  "C1", "D+1",  "D1", "E+1",  "E1",  "F1", "F#1",  "G1", "A+1",  "A1", "B+1",  "B1",  
  //	  "C2", "D+2",  "D2", "E+2",  "E2",  "F2", "F#2",  "G2", "A+2",  "A2", "B+2",  "B2", 
  //	  "C3", "D+3",  "D3", "E+3",  "E3",  "F3", "F#3",  "G3", "A+3",  "A3", "B+3",  "B3",
  //	  "C4", "D+4",  "D4", "E+4",  "E4",  "F4", "F#4",  "G4", "A+4",  "A4", "B+4",  "B4",
  //],
  /** WASM-4 equivalent of musical tones, using the same musical notes. */
  //tones: [
  //    10,   20,   30,   40,   50,   60,   70,   80,   90,  100,  110,  120,  
  //   130,  140,  150,  160,  170,  180,  190,  200,  210,  220,  230,  250,  
  //	 260,  280,  290,  310,  330,  350,  370,  390,  410,  440,  460,  490,  
  //	 520,  550,  600,  620,  660,  700,  750,  780,  840,  880,  940,  980,
  //  1000, 1010, 1020, 1030, 1040, 1050, 1060, 1070, 1080, 1090, 2000, 2020, 
  //],
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
  // Get note index...
  //let noteIndex = BeepBox.notes.indexOf(note.pitches[0]);

  let toneVal = 0;

  if(note.pitches[0] < BeepBox.firstTone || note.pitches[0]> BeepBox.lastTone) {
	console.log('!!HV: createNote(). invalid note. pitch: %d', note.pitches[0]);
    toneVal = 0xFF;
  } else {
  	toneVal = note.pitches[0] - BeepBox.firstTone;
  }

  // Check if note index is valid...
  //if(noteIndex <= 0 || isNaN(noteIndex)) {
  //	console.log('!!HV: createNote(). invalid note. pitch: %d', note.pitches[0]);
  //    noteIndex = 0xFF;
  //}

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
	  
	  //if(!Music.notes[i]) 
	  //	  console.log('!!HV: Music.print(). NO NOTE! i=%d', i);  
	  
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
	  //console.log('!!HV: Stored Music.notes[%d]', noteObject.start);

	  lastTickEnd = noteObject.end;
	}

	tickOffset = lastTickEnd;

}  // end patterns

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
