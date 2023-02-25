/// # ToneParams
///
/// Config parameters to be passed with `tone_sub()` function.
struct ToneParams {
    /// First frequency.
    freq1: u32,
    /// Second frequency.
    freq2: u32,
    /// Attack (aggressive start).
    attack: u32,
    /// Decay (smooth fading).
    decay: u32,
    /// Sustain time.
    sustain: u32,
    /// Release time.
    release: u32,
    /// Volume.
    volume: u32,
    /// Audio channel. Each channel, except `0` and `1`, are different.
    channel: u32,
    /// Audio mode. Only works for channels `0` and `1`.
    mode: u32,
}

impl Default for ToneParams {
    fn default() -> Self {
        return ToneParams {
            freq1  : 500,
            freq2  : 0,
            attack : 0,
            decay  : 0,
            sustain: 30,
            release: 0,
            volume : 100,
            channel: 0,
            mode   : 0,
        };
    }
}

/// Extended `tone()` function.
///
/// # Arguments
///
/// * `params` - Config parameters.
fn tone_sub(params: ToneParams) {
    tone(params.freq1 | (params.freq2 << 16), (params.attack << 24) | (params.decay << 16) | params.sustain | (params.release << 8), params.volume, params.channel | (params.mode << 2));
}

/// Musical note frequencies used by tracks.
const TRACK_NOTES: [u16; 37] = [
     130,   140,   150,   160,   170,   180,   190,   200,   210,
     220,   230,   250,   260,   280,   290,   310,   330,   350,
     370,   390,   410,   440,   460,   490,   520,   550,   600,
     620,   660,   700,   750,   780,   840,   880,   940,   980,
    1000
];

/// Instruments available for use.
const TRACK_INSTRUMENTS: [(u32, u32); 5] = [
	
	// Channel 2.	
    (2, 0), // Triangle
	
	// Channel 0.	
    (0, 2), // Square
    (0, 3), // Pulse wide
    (0, 1), // Pulse narrow
    (0, 0),  // Sawtooth'
	
	// Channel 1.	
    (1, 2), // Square
    (1, 3), // Pulse wide
    (1, 1), // Pulse narrow
    (1, 0)  // Sawtooth
];

/// Reserved for empty notes.
const TRACK_OPCODE_EMPTY: u8 = 0xFF;
/// This will cut-off the track, reverting it to the beginning.
const TRACK_OPCODE_END: u8 = 0xFE;

/// # Track
///
/// A *sound track* is basically one fragment of a music.
struct Track {
    /// Next tone index.
    next: usize,
    /// Wait time until the next tone.
    wait: u16,
    /// Ticks per beat.
    ticks: u8,
    /// Instrument used by this track (see `TRACK_INSTRUMENTS`).
    instrument: u8,
    /// Volume.
    volume: u8,
    /// Variable Flags reserved for opcodes.
    flags: (u8,u8),
    /// Soundtrack tones.
    tones: [(u8,u8,u8); 32],
}

impl Default for Track {
    fn default() -> Self {
        return Track {
            next      : 0,
            wait      : 0,
            ticks     : 1,
            instrument: 0,
            volume    : 100,
            flags     : (0,0),
            tones     : [(0, 255, 0); 32],
        };
    }
}

impl Track {
    /// Instance a new track.
    ///
    /// # Arguments
    ///
    /// * `tones` - Soundtrack tones.
    pub fn new(tones: [(u8,u8,u8); 32]) -> Self {
        return Track {
            next      : 0,
            wait      : 0,
            ticks     : 1,
            instrument: 0,
            volume    : 100,
            flags     : (0,0),
            tones     : tones,
        };
    }
    
    /// Resets the track back to beginning.
    pub fn reset(&mut self) {
        self.next = 0;
        self.wait = 0;
    }

    /// Event responsible for controlling music execution.
    pub fn step(&mut self) {
        // When empty, proceed to next tone index...
        if self.wait == 0 {
            // Musical tone to be played.
            let tone : (u8,u8,u8) = self.tones[self.next];
            let note : u8 = tone.0;
            let wait : u8 = tone.1;
            let flags: u8 = tone.2;

            // Instrument in use.
            let instrument: usize = (self.instrument as usize) % TRACK_INSTRUMENTS.len();

            // Play tone...
            if note < TRACK_NOTES.len() as u8 {
                tone_sub(ToneParams
                    {
                        freq1  : TRACK_NOTES[note as usize] as u32,
                        freq2  : 0,
                        attack : 0,
                        decay  : 0,
                        sustain: 0,
                        release: (wait * self.ticks) as u32,
                        volume : self.volume,
                        channel: TRACK_INSTRUMENTS[instrument].0,
                        mode   : TRACK_INSTRUMENTS[instrument].1,
                    }
                );
            }

            // Proceed to next note...
            self.next = (self.next + 1) % self.tones.len();
            self.wait = wait as u16;

            // Redirection...
            if note == TRACK_OPCODE_END {
                self.next = 0;
            }
        }

        // Countdown wait time...
        else {
            self.wait -= 1;
        }
    }
}
