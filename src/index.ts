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
	 * @constructor
	 * 
	 * @param {number} offset Track offset.
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
	 * @constructor
	 * 
	 * @param {Tone[]} tones Tones.
	 */
	constructor(tones: Tone[] = []) {
		this.tones = tones;
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
	type: string;

	/** Tracks. */
	tracks: Track[];

	/** Sequence. */
	sequence: number[];

	/**
	 * @constructor
	 * 
	 * @param {string} type Channel type.
	 * @param {Track[]} tracks Tracks.
	 * @param {number[]} sequence Sequence.
	 */
	constructor(type: string, tracks: Track[] = [], sequence: number[] = []) {
		this.type     = type;
		this.tracks   = tracks;
		this.sequence = sequence;
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
		
		// Loop through channels...
		for(const channelData of data.channels) {
			const channel: Channel = new Channel(channelData.type);

			// Push sequence data to channel, they are being subtracted by one in order
			// to match their respective track indexes...
			for(const sequence of channelData.sequence) {
				channel.sequence.push(sequence - 1);
			}

			// Instrument and patterns.
			const instrument: ExportInstrument = channelData.instruments[0];
			const patterns  : ExportPattern[]  = channelData.patterns;

			// Loop through patterns...
			for(const pattern of patterns) {
				const notes: ExportNote[] = pattern.notes;
				const track: Track        = new Track();

				// Loop through notes...
				for(const note of notes) {
					const pitch   : number = note.pitches[0];
					const start   : number = note.points[0].tick;
					const end     : number = note.points[1].tick;
					const duration: number = end - start;

					// Create a new tone and include it into track:
					const tone: Tone = new Tone(pitch, start, end, duration);
					track.tones.push(tone);
				}

				// Include track into channel:
				channel.tracks.push(track);
			}

			// Include channel into music:
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

			// Loop through tracks, but only if they're within the bars...
			for(let index: number = 0; index < this.loopBars; index += 1) {
				const track: Track = channel.tracks[this.introBars + index];
				
				// Loop through tones...
				for(const tone of track.tones) {

				}
			}
		}
	}
}
