// jsPsych functions and variables

var introductionText = `
<p>  Repita a sequência de quadrados!
<br> 1. Uma sequência de quadrados irá piscar. Preste atenção.
<br> 
<br> 2. Quando a sequência acabar, um sinal na parte de baixo 
<br> da tela irá aparecer.
<br> 
<br> 3. Sua vez: repita a sequência, clicando nos quadrados.
<br> 
<br> Quando você acerta, o quadrado pisca verde.
<br> Quando você erra, o quadrado pisca vermelho.
<br>
<br> Um novo teste surgirá automaticamente por algumas vezes até parar. 
<br> 
<br> Vamos praticar? 
<br> As próximas 3 sequências são para você treinar e se acostumar com o teste.
</p>
<p>Clique em "Próximo" para iniciar.</p>
`;

var oldIntroText = `
<p>  Uma sequência de quadrados irá piscar em amarelo.
<br> Quando a sequência terminar, um sinal irá aparecer abaixo, indicando para 
<br> que repita a sequência na mesma ordem em que apareceram.
<br>
<br> Os quadrados piscam em verde a cada acerto, ou vermelho se errado. 
<br> Ao errar ou ao concluir corretamente a sequência,
<br> uma nova sequência começará a piscar.
<br> O tamanho da sequência irá aumentar a cada par de sequências (2,2,3,3,4,4 etc.).
<br> Ao errar duas sequências de mesmo tamanho, o teste termina.
<br>
<br> Excepcionalmente, as próximas 3 sequências serão de 3 quadrados, 
<br> para se acostumar com a interface. 
</p>
<p>Clique no botão "Próximo" para começar.</p>
`;

// Set test for #jspsych-corsi-prompt
var promptText = `
<span style="font-size:24px; color:paleturquoise">
Repita a sequência
</span>
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
  display_element: 'corsi-task-container'
});

//create timeline
var timeline = [];

//define welcome message trial
var corsiWelcome = {
  type: jsPsychHtmlButtonResponse,
  stimulus: introductionText,
  choices: ['Próximo'],
  post_trial_gap: 500,
  //function to hide the corsi block content on load
  /*on_load: function(){
    removeById("jspsych-content");
  },*/
};
timeline.push(corsiWelcome);

//intro corsi
var corsiIntro = {
  type: jsPsychCorsiBlocks,
  blocks: corsiBlocksCoordinates,
  timeline: [
    {sequence: [2,7,3], mode: 'display' },
    {sequence: [2,7,3], mode: 'input', prompt: promptText },
    {sequence: [0,8,4], mode: 'display' },
    {sequence: [0,8,4], mode: 'input', prompt: promptText },
    {sequence: [5,1,6], mode: 'display' },
    {sequence: [5,1,6], mode: 'input', prompt: promptText },
  ],
  display_width: '800px', 
  display_height: '800px',
  sequence_gap_duration:  1000, 
  sequence_block_duration: 500,
  pre_stim_duration: 1500,
  block_color: "#777", 
  highlight_color: "yellow",
}
timeline.push(corsiIntro);

//pre task message trial
var corsiPreTask = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `Após calibrar o eye-tracker, <br>
  pressione "Começar" para iniciar o teste <br><br>`,
  choices: ['Começar'],
  post_trial_gap: 500,
  on_finish: function() {
    corsiStart();
  },
};
timeline.push(corsiPreTask);

//corsi
let corsi_correct_trials_array = [];
var corsi_rt_array = [];
var corsi_choice_array = [];
var corsi_trial_id_array = [];
var corsi_trial_count = 0;
var corsi_trial_correct = 0;
var corsi_score = 1;

//corsi trial constructor
function CorsiTrial(sequenceLength, nextTrial) {
  this.seqLength = sequenceLength;
  this.nextTrial = nextTrial;

  this.type = jsPsychCorsiBlocks,
  this.blocks = corsiBlocksCoordinates,
  //this.block_size = 12, // 12 default
  this.display_width = '800px', 
  this.display_height = '800px',
  this.sequence_gap_duration = 1000, //250 default
  this.sequence_block_duration = 500,//1000 default
  this.pre_stim_duration = 1500, //500 default
  //this.response_animation_duration = 500, //500 default
  this.block_color = "#777",  //#555 default
  this.highlight_color = "yellow", //#f00 default
  //this.correct_colot = "#0f0" //#0f0 default
  //this.incorrect_color = "#f00" //#f00 default
  
  //timeline repetition: double pair (display/input/display/input) of 
  // corsi trials for each length of the sequence (2,2, 3,3, 4,4 etc.) 
  //IF OTHER TRIALS ARE ADDED BEFORE THIS, seqLength WILL BREAK ORDER
  this.timeline = [
    {sequence: corsiSeq[this.seqLength*2-4], mode: 'display', /*prompt: `${this.seqLength}a display`*/},
    {sequence: corsiSeq[this.seqLength*2-4], mode: 'input'  , prompt: promptText  },
    {sequence: corsiSeq[this.seqLength*2-3], mode: 'display', /*prompt: `${this.seqLength}b display`*/},
    {sequence: corsiSeq[this.seqLength*2-3], mode: 'input'  , prompt: promptText  },
  ],
  // check if any of last 2 answers were correct
  this.on_timeline_finish= function() {
    //get corsi data array length to have the correct indexes
    length_a = jsPsych.data.results.trials.length -3;
    length_b = jsPsych.data.results.trials.length -1;
    //correct answer: boolean
    result_a = jsPsych.data.results.trials[length_a].correct;
    result_b = jsPsych.data.results.trials[length_b].correct;
    corsi_correct_trials_array.push(result_a);
    corsi_correct_trials_array.push(result_b);
    //response time array: int for milliseconds
    corsi_rt_array = corsi_rt_array.concat(jsPsych.data.results.trials[length_a].rt);
    corsi_rt_array = corsi_rt_array.concat(jsPsych.data.results.trials[length_b].rt);
    //chosen answers array: int for choice id (0 to 8)
    corsi_choice_array = corsi_choice_array.concat(jsPsych.data.results.trials[length_a].response)
    corsi_choice_array = corsi_choice_array.concat(jsPsych.data.results.trials[length_b].response)
    //corsi trial id array (from 0 to n) for each subject's choice
    // concat ( new Array(answer length).fill(id) )
    corsi_trial_id_array = corsi_trial_id_array.concat(new Array(jsPsych.data.results.trials[length_a].response.length).fill(this.seqLength*2-4));
    corsi_trial_id_array = corsi_trial_id_array.concat(new Array(jsPsych.data.results.trials[length_b].response.length).fill(this.seqLength*2-3));
    //count of trial amount and correct answers 
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
  on_load: function() {
    buttonCorsiSubmit ();
  },
  on_finish: function() {
    console.log(`Corsi block task complete. Score:${corsi_score} 
      | Correct answers: ${corsi_trial_correct} of ${corsi_trial_count}`);
    unremoveById("div-corsi-end",'grid');
    removeById('corsi-task-container');
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
