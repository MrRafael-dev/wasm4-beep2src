import * as fs from "fs";

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

	/** Loops per bar. */
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
 * Import an exported *BeepBox 2.3* file. 
 * 
 * @param {string} fileName File name.
 * 
 * @returns {ExportData}
 */
export function importData(fileName: string): ExportData {
	const file: string  = fs.readFileSync(fileName, { encoding: "utf-8" });
	const data: unknown = JSON.parse(file);

	return data as ExportData;
}
