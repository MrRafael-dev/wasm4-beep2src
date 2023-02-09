package main

import (
	"cart/w4"
)

type ToneParams struct {
	freq1   uint32 // First frequency.
	freq2   uint32 // Second frequency.
	attack  uint32 // Attack (aggressive start).
	decay   uint32 // Decay (smooth fading).
	sustain uint32 // Sustain time.
	release uint32 // Release time.
	volume  uint32 // Volume.
	channel uint32 // Audio channel. Each channel, except `0` and `1`, are different.
	mode    uint32 // Audio mode. Only works for channels `0` and `1`.
}

func NewToneParams() ToneParams {
	return ToneParams{
		freq1:   500,
		freq2:   0,
		attack:  0,
		decay:   0,
		sustain: 30,
		release: 0,
		volume:  100,
		channel: 0,
		mode:    0,
	}
}

// Musical note frequencies used by tracks.
var TrackNotes = [37]uint16{
	130, 140, 150, 160, 170, 180, 190, 200, 210,
	220, 230, 250, 260, 280, 290, 310, 330, 350,
	370, 390, 410, 440, 460, 490, 520, 550, 600,
	620, 660, 700, 750, 780, 840, 880, 940, 980,
	1000}

// Instruments available for use.
var TrackInstruments = [5][2]uint32{
	{2, 0}, // Triangle
	{0, 2}, // Square
	{0, 3}, // Pulse wide
	{0, 1}, // Pulse narrow
	{0, 0}, // Sawtooth
}

// Reserved for empty notes.
const TrackOpCodeEmpty uint8 = 0xFF

// This will cut-off the track, reverting it to the beginning.
const TrackOpCodeEnd uint8 = 0xFE

// A sound track is basically one fragment of a music.
type Track struct {
	next       int
	wait       uint16
	ticks      uint8
	instrument uint8
	flags      [2]uint8
	tones      [][3]byte
}

func toneSub(p ToneParams) {
	w4.Tone(
		uint(p.freq1|(p.freq2<<16)),
		uint((p.attack<<24)|(p.decay<<16)|p.sustain|(p.release<<8)),
		uint(p.volume),
		uint(p.channel|(p.mode<<2)),
	)
}

func (self *Track) Step() {
	if self.wait == 0 {
		// Musical tone to be played.
		tone := self.tones[self.next]
		note := tone[0]
		wait := tone[1]
		// flags := tone[2]

		// Instrument in use.
		instrument := self.instrument % uint8(len(TrackInstruments))

		// Play tone...
		if int(note) < len(TrackNotes) {
			toneSub(ToneParams{
				freq1:   uint32(TrackNotes[note]),
				freq2:   0,
				attack:  0,
				decay:   0,
				sustain: 0,
				release: uint32(wait * self.ticks),
				volume:  100,
				channel: TrackInstruments[instrument][0],
				mode:    TrackInstruments[instrument][1],
			})
		}

		// Proceed to next note...
		self.next = (self.next + 1) % len(self.tones)
		self.wait = uint16(wait)

		// Redirection...
		if note == TrackOpCodeEnd {
			self.next = 0
		}
	} else {
		self.wait--
	}
}
