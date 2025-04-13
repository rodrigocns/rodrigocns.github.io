// jsPsych functions and variables

var introductionText = `
<p>In this trial, squares will flash in a sequence.</p>
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
let corsi_answer_array = [];
var corsi_trial_count = 0;
var corsi_trial_correct = 0;
var corsi_score = 1;

//corsi trial constructor
function CorsiTrial(sequenceLength, nextTrial) {
  this.seqLength = sequenceLength;
  this.nextTrial = nextTrial;
  this.type= jsPsychCorsiBlocks,
  this.blocks= corsiBlocksCoordinates,
  this.display_width= '800px', 
  this.display_height= '800px',
  this.sequence_block_duration = 500,
  this.timeline= [
    {sequence: corsiSeq[this.seqLength*2-4], mode: 'display', prompt: `${this.seqLength}a display`},
    {sequence: corsiSeq[this.seqLength*2-4], mode: 'input'  , prompt: `${this.seqLength}a input`  },
    {sequence: corsiSeq[this.seqLength*2-3], mode: 'display', prompt: `${this.seqLength}b display`},
    {sequence: corsiSeq[this.seqLength*2-3], mode: 'input'  , prompt: `${this.seqLength}b input`  },
  ],
  // check if any of last 2 answers were correct
  this.on_timeline_finish= function() {
    result_a = jsPsych.data.results.trials[jsPsych.data.results.trials.length-3].correct;
    result_b = jsPsych.data.results.trials[jsPsych.data.results.trials.length-1].correct;
    corsi_answer_array.push(result_a);
    corsi_answer_array.push(result_b);
    corsi_trial_correct = corsi_trial_correct + result_a + result_b;
    corsi_trial_count = corsi_trial_count + 2;
    //if correct, proceed to next corsi trial. Else, ends trials.
    if (result_a || result_b) {
      console.log(`corsi seq. ${this.seqLength} passed. Correct responses: ${result_a}, ${result_b}`);
      timeline.push(this.nextTrial);
      corsi_score = this.seqLength;
    } else {
      console.log(`corsi seq. ${this.seqLength} failed. Correct responses: ${result_a}, ${result_b}`);
      timeline.push(corsiEnd);
    };
  }
};
      
const corsiEnd = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: " ",
  choices: "NO_KEYS",
  trial_duration: 100,
  on_finish: function() {
    document.getElementById("corsi-correct-span").innerText=corsi_trial_correct;
    document.getElementById("corsi-count-span").innerText=corsi_trial_count;
    document.getElementById("corsi-score-span").innerText=corsi_score;
    document.getElementById("corsi-result").style.display='block';
  }
};

//declare each trial in reverse order (from last to first)
const corsi11 = new CorsiTrial(11,corsiEnd);
const corsi10 = new CorsiTrial(10,corsi11);
const corsi09 = new CorsiTrial( 9,corsi10);
const corsi08 = new CorsiTrial( 8,corsi09);
const corsi07 = new CorsiTrial( 7,corsi08);
const corsi06 = new CorsiTrial( 6,corsi07);
const corsi05 = new CorsiTrial( 5,corsi06);
const corsi04 = new CorsiTrial( 4,corsi05);
const corsi03 = new CorsiTrial( 3,corsi04);
const corsi02 = new CorsiTrial( 2,corsi03);

timeline.push(corsi02);

// start trial sequence
jsPsych.run(timeline);
