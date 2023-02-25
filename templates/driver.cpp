// BeepBox song player.
// C++ implementation.

#include "wasm4.h"

struct ToneParams  {
	uint32_t freq1 = 0; // First frequency.
	uint32_t freq2 = 0; // Second frequency.
	uint32_t attack = 0; // Attack (aggressive start).
	uint32_t decay = 0; // Decay (smooth fading).
	uint32_t sustain = 0; // Sustain time.
	uint32_t release = 0; // Release time.
	uint32_t volume = 0; // Volume.
	uint32_t channel = 0; // Audio channel. Each channel, except `0` and `1`, are different.
	uint32_t mode = 0; // Audio mode. Only works for channels `0` and `1`.
};

// Musical note frequencies used by tracks.
uint32_t trackNotes[60] = {
	 65,  70,  75,  80,  85,  90, 95, 100, 105, 110, 115, 125, 
	130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 250, 
	260, 280, 290, 310, 330, 350, 370, 390, 410, 440, 460, 490, 
	520, 550, 600, 620, 660, 700, 750, 780, 840, 880, 940, 980,
   1050,1110,1170,1240,1320,1400,1480,1570,1660,1760,1860,1980  
	};

// Instruments available for use.
uint32_t trackInstruments[][2] = {

	// Channel 2.
	{2, 0}, // Triangle
	
	// Channel 0.
	{0, 2}, // Square
	{0, 3}, // Pulse wide
	{0, 1}, // Pulse narrow
	{0, 0}, // Sawtooth
	
	// Channel 1.
	{1, 2}, // Square
	{1, 3}, // Pulse wide
	{1, 1}, // Pulse narrow
	{1, 0}, // Sawtooth
};

// Reserved for empty notes.
const uint8_t TrackOpCodeEmpty = 0xFF;

// This will cut-off the track, reverting it to the beginning.
const uint8_t TrackOpCodeEnd = 0xFE;

// A sound track is basically one fragment of a music.
//struct Tone {
//	uint8_t toneItem[3];
//};

struct Track {
	uint32_t next = 0;
	uint16_t wait = 0;
	uint8_t ticks = 0;
	uint8_t instrument = 0;
	uint8_t volume = 100;
	uint8_t flags[2] = {0,0};
	uint8_t* tones = nullptr;
	uint32_t toneCount = 0;
};

ToneParams newToneParams() {
	return ToneParams{
		/*freq1*/ 500,
		/*freq2*/   0,
		/*attack*/  0,
		/*decay*/   0,
		/*sustain*/ 30,
		/*release*/ 0,
		/*volume*/  100,
		/*channel*/ 0,
		/*mode*/    0,
	};
};

void toneSub(ToneParams& p) {
	tone(
		uint32_t(p.freq1|(p.freq2<<16)),
		uint32_t((p.attack<<24)|(p.decay<<16)|p.sustain|(p.release<<8)),
		uint32_t(p.volume),
		uint32_t(p.channel|(p.mode<<2))
	);
}

void step(Track& self) {
	if (self.wait == 0) {
		// Musical tone to be played.
		//uint8_t* tone = self.tones[self.next*3];
		auto note = self.tones[self.next*3 + 0];
		auto wait = self.tones[self.next*3 + 1];
		// auto wait = tone.toneItem[self.next*3 + 2];

		// Instrument in use.
		auto instrumentCount = sizeof(trackInstruments) / sizeof(trackInstruments[0]);
		auto instrument = self.instrument % uint8_t(instrumentCount);

		// Play tone...
		auto noteCount = sizeof(trackNotes) / sizeof(trackNotes[0]);
		if (note < noteCount) {
			ToneParams params = {
				/*freq1*/   uint32_t(trackNotes[note]),
				/*freq2*/   0,
				/*attack*/  0,
				/*decay*/   0,
				/*sustain*/ 0,
				/*release*/ uint32_t(wait * self.ticks),
				/*volume*/  self.volume,
				/*channel*/ trackInstruments[instrument][0],
				/*mode*/    trackInstruments[instrument][1],
			};
			toneSub(params);
		}

		// Proceed to next note...
		self.next = (self.next + 1) % self.toneCount;
		self.wait = uint16_t(wait);

		// Redirection...
		if( note == TrackOpCodeEnd) {
			self.next = 0;
		}
	} else {
		self.wait--;
	}
}
		   