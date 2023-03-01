//#region <beepbox.ts>

/**
 * @interface ExportPoint
 * 
 * @description
 * Structure of an note point.
 */
export interface ExportPoint {
	/** Tick (where the note starts). */
	tick: number;

	/** Pitch bend. */
	pitchBend: number;

	/** Volume. */
	volume: number;
}

/**
 * @interface ExportNote
 * 
 * @description
 * Structure of an pattern note.
 */
export interface ExportNote {
	/** Pitches, *aka* note intensity. */
	pitches: number[];

	/** Note points. It should have at least two of them. */
	points: ExportPoint[];
}

/**
 * @interface ExportPattern
 * 
 * @description
 * Structure of an music pattern.
 */
export interface ExportPattern {
	/** Instrument index. */
	instrument: number;

	/** Notes. */
	notes: ExportNote[];
}

/**
 * @interface ExportInstrument
 * 
 * @description
 * Structure of an music instrument.
 */
export interface ExportInstrument {
	/** Instrument type. */
	type: string;

	/** Instrument volume. */
	volume: number;

	/** Wave type (square, triangle, *etc*.). */
	wave: string;

	/** Transition type. */
	transition: string;

	/** Filter type. */
	filter: string;

	/** Chorus type. */
	chorus: string;

	/** Effect type. */
	effect: string;
}

/**
 * @interface ExportChannel
 * 
 * @description
 * Structure of an music channel.
 */
export interface ExportChannel {
	/** Channel type. */
	type: string;

	/** Octave scroll bar. */
	octaveScrollBar: number;

	/** Instruments. */
	instruments: ExportInstrument[];
	
	/** Patterns. */
	patterns: ExportPattern[];

	/** Music sequence. */
	sequence: number[];
}

/**
 * @interface ExportData
 * 
 * @description
 * Structure of an exported *BeepBox 2.3* file.
 */
export interface ExportData {
	/** Format information. */
	format: string;

	/** Version information. */
	version: number;

	/** Note scale (easy, normal, expert, *etc*.). */
	scale: string;

	/** Note octave (A, B, C, *etc*.). */
	key: string;

	/** Intro bars. */
	introBars: number;

	/** Loop bars. */
	loopBars: number;

	/** Beats per bar. */
	beatsPerBar: number;

	/** Ticks per beat. */
	ticksPerBeat: number;

	/** Beats per minute, *aka* music speed. */
	beatsPerMinute: number;

	/** Reverb. */
	reverb: number;

	/** Channels. */
	channels: ExportChannel[];
}

/** Song scales. */
const SONG_SCALES: string[] = [
	"easy :)",
	"easy :(",
	"island :)",
	"island :(",
	"blues :)",
	"blues :(",
	"normal :)",
	"normal :(",
	"dbl harmonic :)",
	"dbl harmonic :(",
	"enigma",
	"expert",
];

/** Song keys. */
const SONG_KEYS: string[] = [
	"B",
	"A♯",
	"A",
	"G♯",
	"G",
	"F♯",
	"F",
	"E",
	"D♯",
	"D",
	"C♯",
	"C",
];

/** Channel types. */
const CHANNEL_TYPES: string[] = [
	"pitch",
	"drum",
];

/** Instrument types. */
const INSTRUMENT_TYPES: string[] = [
	"chip",
	"FM",
];

/** Instrument waves. */
const INSTRUMENT_WAVES: string[] = [
	"triangle",
	"square",
	"pulse wide",
	"pulse narrow",
	"sawtooth",
	"double saw",
	"double pulse",
	"spiky",
	"plateau",
];

/** Instrument transitions. */
const INSTRUMENT_TRANSITIONS: string[] = [
	"seamless",
	"sudden",
	"smooth",
	"slide",
];

/** Instrument filters. */
const INSTRUMENT_FILTERS: string[] = [
	"none",
	"bright",
	"medium",
	"soft",
	"decay bright",
	"decay medium",
	"decay soft",
];

/** Instrument choruses. */
const INSTRUMENT_CHORUSES: string[] = [
	"union",
	"shimmer",
	"hum",
	"honky tonk",
	"dissonant",
	"fifths",
	"octaves",
	"bowed",
	"custom harmony",
];

/** Instrument effects. */
const INSTRUMENT_EFFECTS: string[] = [
	"none",
	"vibrato light",
	"vibrato delayed",
	"vibrato heavy",
	"tremolo light",
	"tremolo heavy",
];

/** Song scales. */
export enum SongScale {
	Null         = -1,
	Easy1        =  0,
	Easy2        =  1,
	Island1      =  2,
	Island2      =  3,
	Blues1       =  4,
	Blues2       =  5,
	Normal1      =  6,
	Normal2      =  7,
	DBLHarmonic1 =  8,
	DBLHarmonic2 =  9,
	Enigma       = 10,
	Expert       = 11,
}

/** Song keys. */
export enum SongKey {
	Null = -1,
	B    =  0,
	AS   =  1,
	A    =  2,
	GS   =  3,
	G    =  4,
	FS   =  5,
	F    =  6,
	E    =  7,
	DS   =  8,
	D    =  9,
	CS   = 10,
	C    = 11,
}

/** Channel types. */
export enum ChannelType {
	Null  = -1,
	Pitch =  0,
	Drum  =  1,
}

/** Instrument types. */
export enum InstrumentType {
	Null = -1,
	Chip =  0,
	FM   =  1,
}

/** Instrument waves. */
export enum InstrumentWave {
	Null        = -1,
	Triangle    =  0,
	Square      =  1,
	PulseWide   =  2,
	PulseNarrow =  3,
	Sawtooth    =  4,
	DoubleSaw   =  5,
	DoublePulse =  6,
	Spiky       =  7,
	Plateau     =  8,
}

/** Instrument transitions. */
export enum InstrumentTransition {
	Null     = -1,
	Seamless =  0,
	Sudden   =  1,
	Smooth   =  2,
	Slide    =  3,
}

/** Instrument filters. */
export enum InstrumentFilter {
	Null        = -1,
	None        =  0,
	Bright      =  1,
	Medium      =  2,
	Soft        =  3,
	DecayBright =  4,
	DecayMedium =  5,
	DecaySoft   =  6,
}

/** Instrument choruses. */
export enum InstrumentChorus {
	Null          = -1,
	Union         =  0,
	Shimmer       =  1,
	Hum           =  2,
	HonkyTonk     =  3,
	Dissonant     =  4,
	Fifhts        =  5,
	Octaves       =  6,
	Bowed         =  7,
	CustomHarmony =  8,
}

/** Instrument effects. */
export enum InstrumentEffect {
	Null           = -1,
	None           =  0,
	VibratoLight   =  1,
	VibratoDelayed =  2,
	VibratoHeavy   =  3,
	TremoloLight   =  4,
	TremoloHeavy   =  5,
}

//#endregion <beepbox.ts>
//#region </index.ts>

/** Tone's ArrayBuffer size. */
const TONE_BUFFER_SIZE: number = 3;

/** Track's ArrayBuffer size dedicated to header. */
const TRACK_BUFFER_HEADER_SIZE: number = 1;

/** Instrument's ArrayBuffer size. */
const INSTRUMENT_BUFFER_SIZE: number = 2;

/**
 * @class Tone
 * 
 * @description
 * Represents a track's tone.
 */
export class Tone {
	/** Tone pitch. */
	pitch: number;

	/** Tone starting point. */
	start: number;

	/** Tone ending point. */
	end: number;

	/** Tone duration. */
	duration: number;

	/**
	 * Create a new tone instance from an exported note data.
	 * 
	 * @param {ExportNote} data Exported note data.
	 * 
	 * @returns {Tone}
	 */
	static from(data: ExportNote): Tone {
		const pitch   : number = data.pitches[0];
		const start   : number = data.points[0].tick;
		const end     : number = data.points[1].tick;
		const duration: number = end - start;

		// Create and return a tone:
		const tone: Tone = new Tone(pitch, start, end, duration);
		return tone;
	}

	/**
	 * @constructor
	 * 
	 * @param {number} pitch Tone pitch.
	 * @param {number} start Tone starting point.
	 * @param {number} end Tone ending point.
	 * @param {number} duration Tone duration.
	 */
	constructor(pitch: number, start: number, end: number, duration: number) {
		this.pitch    = pitch;
		this.start    = start;
		this.end      = end;
		this.duration = duration;
	}

	/**
	 * Returns an binary representation of this object.
	 * 
	 * Data structure has a fixed size of 3 bytes.
	 * Only starting point, pitch and duration are included.
	 * ```
	 * {
	 *   start   : u8;
	 *   pitch   : u8;
	 *   duration: u8;
	 * }
	 * ```
	 * 
	 * @returns {ArrayBuffer}
	 */
	toArrayBuffer(): ArrayBuffer {
		const array: Uint8Array = new Uint8Array([
			this.start,
			this.pitch,
			this.duration,
		]);

		return array.buffer;
	}
}

/**
 * @class Track
 * 
 * @description
 * Represents a channel track. It's made from tones.
 */
export class Track {
	/** Tones. */
	tones: Tone[];

	/**
	 * Create a new track instance from an exported pattern data.
	 * 
	 * @param {ExportPattern} data Exported pattern data.
	 * 
	 * @returns {Track}
	 */
	static from(data: ExportPattern): Track {
		// Create a track to be returned later, and get notes:
		const track: Track = new Track();
		const notes: ExportNote[] = data.notes;

		// Loop through notes and create tones...
		for(const note of notes) {
			const tone: Tone = Tone.from(note);
			track.tones.push(tone);
		}

		return track;
	}

	/**
	 * @constructor
	 * 
	 * @param {Tone[]} tones Tones.
	 */
	constructor(tones: Tone[] = []) {
		this.tones = tones;
	}

	/**
	 * Returns an binary representation of this object.
	 * 
	 * Data structure has a dynamic size. At least 1 byte will be used to 
	 * determine it's item length, proceeded by the items themselves, where
	 * each `Tone` will always have 3 bytes.
	 * ```
	 * {
	 *   length: u8;
	 *   tones : Tone[]
	 * }
	 * ```
	 * 
	 * @returns {ArrayBuffer}
	 */
	toArrayBuffer(): ArrayBuffer {
		// Declare a byte array and set the item length:
		const size : number     = TRACK_BUFFER_HEADER_SIZE + (this.tones.length * TONE_BUFFER_SIZE);
		const array: Uint8Array = new Uint8Array(size);
					array[0] = this.tones.length;

		// Insertion offset:
		let offset: number = TRACK_BUFFER_HEADER_SIZE;

		// Iterate through tones...
		for(const tone of this.tones) {
			array.set(new Uint8Array(tone.toArrayBuffer()), offset);
			offset += TONE_BUFFER_SIZE;
		}

		return array.buffer;
	}
}

/**
 * @class Instrument
 * 
 * @description
 * Represents a channel's instrument.
 */
export class Instrument {
	/** Instrument type. */
	type: InstrumentType;

	/** Instrument volume. */
	volume: number;

	/** Instrument wave. */
	wave: InstrumentWave;

	/** Instrument transition. */
	transition: InstrumentTransition;

	/** Instrument filter. */
	filter: InstrumentFilter;

	/** Instrument chorus. */
	chorus: InstrumentChorus;

	/** Instrument effect. */
	effect: InstrumentEffect;

	/**
	 * Create a new instrument instance from an exported instrument data.
	 * 
	 * @param {ExportInstrument} data Exported instrument data.
	 * 
	 * @returns {Instrument}
	 */
	static from(data: ExportInstrument): Instrument {
		// Create a instrument to be returned later:
		const instrument: Instrument = new Instrument(
			INSTRUMENT_TYPES.indexOf(data.type),
			data.volume,
			INSTRUMENT_WAVES.indexOf(data.wave),
			INSTRUMENT_TRANSITIONS.indexOf(data.transition),
			INSTRUMENT_CHORUSES.indexOf(data.chorus),
			INSTRUMENT_EFFECTS.indexOf(data.effect)
		);

		return instrument;
	}

	/**
	 * @constructor
	 * 
	 * @param {InstrumentType} type Instrument type.
	 * @param {number} volume Instrument volume
	 * @param {InstrumentWave} wave Instrument wave.
	 * @param {InstrumentTransition} transition Instrument transition.
	 * @param {InstrumentFilter} filter Instrument filter.
	 * @param {InstrumentChorus} chorus Instrument chorus.
	 * @param {InstrumentEffect} effect Instrument effect.
	 */
	constructor(type: InstrumentType = InstrumentType.Null, volume: number = 0, wave: InstrumentWave = InstrumentWave.Null, transition: InstrumentTransition = InstrumentTransition.Null, filter: InstrumentFilter = InstrumentFilter.Null, chorus: InstrumentChorus = InstrumentChorus.Null, effect: InstrumentEffect = InstrumentEffect.Null) {
		this.type       = type;
		this.volume     = volume;
		this.wave       = wave;
		this.transition = transition;
		this.filter     = filter;
		this.chorus     = chorus;
		this.effect     = effect;
	}

	/**
	 * Returns an binary representation of this object.
	 * 
	 * Data structure has a fixed size of 2 bytes.
	 * Only type and volume are included.
	 * 
	 * ```
	 * {
	 *   type  : u8;
	 *   volume: u8;
	 * }
	 * ```
	 * 
	 * @returns {ArrayBuffer}
	 */
	toArrayBuffer(): ArrayBuffer {
		const array: Uint8Array = new Uint8Array([
			this.type,
			this.volume,
		]);

		return array.buffer;
	}
}

/**
 * @class Channel
 * 
 * @description
 * Represent's a music. It's made from tracks, which can be sorted by any 
 * given order.
 */
export class Channel {
	/** Channel type. */
	type: ChannelType;

	/** Instrument. */
	instrument: Instrument;

	/** Tracks. */
	tracks: Track[];

	/** Sequence. */
	sequence: number[];

	/**
	 * Create a new channel instance from an exported channel data.
	 * 
	 * @param {ExportChannel} data Exported channel data.
	 * 
	 * @returns {Channel}
	 */
	static from(data: ExportChannel): Channel {
		// Create a channel to be returned later:
		const channel: Channel = new Channel(
			CHANNEL_TYPES.indexOf(data.type)
		);

		// Get instrument, if it exists...
		if(data.instruments.length > 0) {
			channel.instrument = Instrument.from(data.instruments[0]);
		}

		// Push sequence data to channel, they are being subtracted by one in order
		// to match their respective track indexes...
		for(const sequence of data.sequence) {
			channel.sequence.push(sequence - 1);
		}

		// Channel patterns.
		const patterns: ExportPattern[]  = data.patterns;

		// Loop through patterns and create tracks...
		for(const pattern of patterns) {
			const track: Track = Track.from(pattern);
			channel.tracks.push(track);
		}

		return channel;
	}

	/**
	 * @constructor
	 * 
	 * @param {ChannelType} type Channel type.
	 * @param {Track[]} tracks Tracks.
	 * @param {number[]} sequence Sequence.
	 */
	constructor(type: ChannelType = ChannelType.Null, instrument: Instrument = new Instrument(), tracks: Track[] = [], sequence: number[] = []) {
		this.type       = type;
		this.instrument = instrument;
		this.tracks     = tracks;
		this.sequence   = sequence;
	}
}

/**
 * @class Music
 * 
 * @description
 * Represents a music. It's made from channels, and also a few more extra
 * information, such as start and end positions, and music speed.
 */
export class Music {
	/** Intro bars. */
	introBars: number;

	/** Loop bars. */
	loopBars: number;

	/** Beats per bar. */
	beatsPerBar: number;

	/** Ticks per beat. */
	ticksPerBeat: number;

	/** Beats per minute, *aka* music speed. */
	beatsPerMinute: number;

	/** Channels. */
	channels: Channel[];

	/**
	 * Create a new music instance from an exported *BeepBox* data.
	 * 
	 * @param {ExportData} data Exported *BeepBox* data.
	 * 
	 * @returns {Music}
	 */
	static from(data: ExportData): Music {
		// Create a music to be returned later:
		const music: Music = new Music(
			data.introBars, 
			data.loopBars, 
			data.beatsPerBar, 
			data.ticksPerBeat, 
			data.beatsPerMinute
		);
		
		// Loop through channels and create channels...
		for(const channelData of data.channels) {
			const channel: Channel = Channel.from(channelData);
			music.channels.push(channel);
		}

		return music;
	}

	/**
	 * @constructor
	 * 
	 * @param {number} introBars Intro bars.
	 * @param {number} loopBars Loop bars.
	 * @param {number} beatsPerBar Beats per bar.
	 * @param {number} ticksPerbeat Ticks per beat.
	 * @param {number} beatsPerMinute Beats per minute, *aka* music speed.
	 * @param {Channel[]} channels Channels.
	 */
	constructor(introBars: number, loopBars: number, beatsPerBar: number, ticksPerbeat: number, beatsPerMinute: number, channels: Channel[] = []) {
		this.introBars      = introBars;
		this.loopBars       = loopBars;
		this.beatsPerBar    = beatsPerBar;
		this.ticksPerBeat   = ticksPerbeat;
		this.beatsPerMinute = beatsPerMinute;
		this.channels       = channels;
	}
	
	/** @todo */
	emit(): void {
		// Loop through channels...
		for(const channel of this.channels) {
			const _a = [];

			// Loop through tracks, but only if they're within the bars...
			for(let index: number = 0; index < this.loopBars; index += 1) {
				const trackIndex: number = this.introBars + index;
				const track     : Track  = channel.tracks[trackIndex];

				// Loop through tones...
				for(const tone of track.tones) {
					
				}
			}
		}
	}
}

//#endregion </index.ts>
