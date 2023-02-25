# wasm4-beep2src
Experimental music converter for WASM-4. The script generates WASM-4 code from the selected channel in the BeepBox json file. Currently Rust, Go, and C++ source file generation is supported.

# How to use (C++)

There are only 4 channels in WASM-4 and some of thenm are possibly used for sound effects. The beep2src script can be used to generate the scores from the selected channel in the BeepBox json file like below.

1) You can generate the C++ code of the melody channel (templated added, channel 0, create new file) like this:
  node beep2src ./Bach.json Bach_melody true cpp 0 >../my-wasm-project/src/sounds.cpp

2) Then you can also add one (or more) another channel (no template added, channel 3, append to the file) if you want:
  node beep2src ./Bach.json Bach_bass false cpp 3 >> ../my-wasm-project/src/sounds.cpp
  
To play the two channels you can first add these definitions at the top of your main.cpp file:
  
  // These are implemented in the generated sounds.cpp file.
  void step_BACH_MELODY();
  void step_BACH_BASS();
  
And then call them in your update() function. You can call those on each iteration of the update() method if that do not sound too fast.

  // Run the sound engine step with my scores.
  step_BACH_MELODY();
  step_BACH_BASS();
  



