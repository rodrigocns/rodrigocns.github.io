// jsPsych functions and variables

var introductionText = `
  <p>In this experiment, squares will flash in a sequence.</p>
  <p>After the squares stop flashing, click in the squares following the same sequence.</p>
  <div style='width: 700px;'>
  </div>
  <p>Press the "Next" button to begin.</p>
  `;

// corsi block position and sequences taken from the e-corsi paper supplemental material. 

// position is a percentage of the screen, calculated as (x-a)/horizontal area, (y-b)/vertical area,
// a and b being half of the square dimensions (120px/2) to change the position from top-left to center 
var corsiBlocksCoordinates = [
  {x:57,y:17},
  {x:18,y:22},
  {x:76,y:33},
  {x:33,y:39},
  {x:61,y:49},
  {x:82,y:63},
  {x:12,y:68},
  {x:35,y:83},
  {x:59,y:78},
];

// sequence numbers have -1 than original source because block numbers goes from 0 to 8 instead of 1 to 9.
var corsiSeq = [
  [3,6],
  [1,8],
  [8,2,3],
  [5,2,6],
  [0,4,1,7],
  [6,3,2,8],
  [2,0,7,5,4],
  [8,2,0,3,6],
  [1,7,2,4,5,3],
  [4,2,0,1,7,8],
  [6,2,1,8,0,7,5],
  [3,2,6,5,1,4,8],
  [0,8,5,2,4,3,1,7],
  [1,8,3,5,0,6,2,4],
  [4,2,7,6,0,1,3,5,8],
  [3,1,5,7,0,6,8,2,4],
  [8,7,4,1,2,0,5,6,3,2],
  [0,7,1,3,5,6,0,2,8,4],
  [4,1,7,2,0,6,5,8,3,6,7],
  [3,1,6,0,4,5,7,2,8,3,2],
];

//initialize jsPsych. 
var jsPsych = initJsPsych({
//  display_element: 'corsi-task-container'
});

//create timeline
var timeline = [];

//define welcome message trial
var corsiWelcome = {
  type: jsPsychHtmlButtonResponse,
  stimulus: introductionText,
  choices: ['Next'],
  post_trial_gap: 500,
  //function to hide the corsi block content
  on_load: function(){
    document.getElementById("jspsych-content").style.visibility="hidden";
  },
};
timeline.push(corsiWelcome);

//corsi
var corsi_answer_array = [];

var corsi2 = {
  type: jsPsychCorsiBlocks,
  blocks: corsiBlocksCoordinates,
  display_width: '800px', display_height: '800px',
  timeline: [
    {sequence: corsiSeq[0], mode: 'display', prompt: '2a display'},
    {sequence: corsiSeq[0], mode: 'input'  , prompt: '2a input'  },
    {sequence: corsiSeq[1], mode: 'display', prompt: '2b display'},
    {sequence: corsiSeq[1], mode: 'input'  , prompt: '2b input'  },
  ],
  // check if any of last 2 answers were correct
  on_timeline_finish: function() {
    result_a = jsPsych.data.results.trials[jsPsych.data.results.trials.length-3]
    result_b = jsPsych.data.results.trials[jsPsych.data.results.trials.length-1]
    corsi_answer_array.push(result_a);
    corsi_answer_array.push(result_b);
    //if correct, proceed to next corsi trial
    if (result_a || result_b) {
      console.log('Corsi2 passed.');
      timeline.push(corsi3);
    };
  }
};
timeline.push(corsi2);

var corsi3 = {
  type: jsPsychCorsiBlocks,
  blocks: corsiBlocksCoordinates,
  display_width: '800px', display_height: '800px',
  timeline: [
    {sequence: corsiSeq[2], mode: 'display', prompt: '3a display'},
    {sequence: corsiSeq[2], mode: 'input'  , prompt: '3a input'  },
    {sequence: corsiSeq[3], mode: 'display', prompt: '3b display'},
    {sequence: corsiSeq[3], mode: 'input'  , prompt: '3b input'  },
  ],
  on_timeline_finish: function() {
    result_a = jsPsych.data.results.trials[jsPsych.data.results.trials.length-3]
    result_b = jsPsych.data.results.trials[jsPsych.data.results.trials.length-1]
    corsi_answer_array.push(result_a);
    corsi_answer_array.push(result_b);
    if (result_a || result_b) {
      console.log('Corsi3 passed.');
      timeline.push(corsi4);
    };
  }
};


// start trial sequence
jsPsych.run(timeline);