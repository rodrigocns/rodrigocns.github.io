
//Todas as Funcoes aqui
const task_list = ["bastao_c","bastao_g","bolaBastao_c","bolaBastao_g","bola_c","bola_g"];
let task_n = 0;
let stage = 0;

function func_teste() {
  const stage_elements = document.getElementsByClassName('stage');
  stage_elements[0].style.display = "none"
  if (debug_state == 0){
    debug_state = 1;
    for (let i = 0; i < debug_elements.length; i++) {
      debug_elements[i].style.display = "block";
    }
  } else {
    debug_state = 0;
    for (let i = 0; i < debug_elements.length; i++) {
      debug_elements[i].style.display = "none";
    }
  }
  // alert(debug_elements.length);
}

function prepMolecula(num) { 
  //mapper para o preparo do teste que está acontecendo
  //em "Jmol.script(...)" o comando em texto diz respeito à orientação de rotação que o objeto vai estar ao começar cada tarefa
  Jmol.script(jsmol_molecula,'moveto 0.0 {-666 39 745 139.54}');
  //em cada case estão as configurações de renderização do objeto interativo em cada tarefa
  switch (num){
    case 0:
      Jmol.script(jsmol_molecula,'color cpk; spacefill off; wireframe 0.15');
      document.getElementById('modelo_estatico').src='imgs/batracoisa_0.png';
      break;
    case 1:
      Jmol.script(jsmol_molecula,'color structure; spacefill off; wireframe 0.15');
      document.getElementById('modelo_estatico').src='imgs/batracoisa_1.png';
      break;
    case 2:
      Jmol.script(jsmol_molecula,'color cpk; spacefill 23%; wireframe 0.15');
      document.getElementById('modelo_estatico').src='imgs/batracoisa_2.png';
      break;
    case 3:
      Jmol.script(jsmol_molecula,'color structure; spacefill 23%; wireframe 0.15');
      document.getElementById('modelo_estatico').src='imgs/batracoisa_3.png';
      break;
    case 4:
      Jmol.script(jsmol_molecula,'color cpk; spacefill 23%; wireframe OFF');
      document.getElementById('modelo_estatico').src='imgs/batracoisa_4.png';
      break;
    case 5:
      Jmol.script(jsmol_molecula,'color structure; spacefill 23%; wireframe OFF');
      document.getElementById('modelo_estatico').src='imgs/batracoisa_5.png';
      break;
    
    //https://chemapps.stolaf.edu/jmol/docs/examples/bonds.htm  altera visualisação dos dados
  }
}

function botaoInicio() {
  zerar_contagem();
  document.getElementById("divMoleculaPNG").style.visibility="visible";
  document.getElementById("divMoleculaTeste").style.visibility="visible";
  timerStart ();
  document.getElementById("startButton").style.visibility="hidden";
  document.getElementById("submitButton").style.visibility="visible";
}

function botaoSubmit(){
  timerStop();
  document.getElementById("divMoleculaPNG").style.visibility="hidden";
  document.getElementById("divMoleculaTeste").style.visibility="hidden";
  inserir_valores_form();
  document.getElementById("submitButton").style.visibility="hidden";
  task_n +=1; //progride para o proximo teste em task_list e prepMolecula()
  // if (task_n >= 6){ /*volta ao primeiro*/ task_n = 0;}
  if (task_n >= 6){/*finaliza os testes*/ return;} 
  //se falso, botão start aparece
  document.getElementById("startButton").style.visibility="visible";
  prepMolecula(task_n);
}

var debug_state = 0;
function debug() { //switch (on/off) de recursos de debug. 
  //Alterna visibilidade de cada elemento de classe 'debug'
  const debug_elements = document.getElementsByClassName('debug');
  if (debug_state == 0){
    debug_state = 1;
    for (let i = 0; i < debug_elements.length; i++) {
      debug_elements[i].style.display = "block";
    }
  } else {
    debug_state = 0;
    for (let i = 0; i < debug_elements.length; i++) {
      debug_elements[i].style.display = "none";
    }
  }
  // alert(debug_elements.length);
}

function next_section() {
  // get the currently visible section with the `visible-section` class
  var currentSection = document.querySelector(".visible-section");

  // get the next sequential section with the `stage` class
  var nextSection = currentSection.nextElementSibling;
  while (nextSection && !nextSection.classList.contains("stage")) {
    nextSection = nextSection.nextElementSibling;
  }

  // if there is no next sequential section, go back to the first one
  if (!nextSection) {
    nextSection = document.querySelector(".stage:first-child");
  }

  // hide the current sequential section with the `stage` class
  currentSection.style.display = "none";
  currentSection.classList.remove("visible-section");

  // show the next sequential section with the `stage` class
  nextSection.style.display = "block";
  nextSection.classList.add("visible-section");
}

//funcao que insere valores no form antes de submeter
function inserir_valores_form() { 
  document.getElementById('test_id').value = task_list[task_n]; //qual tarefa foi realizada
  document.getElementById('ft').value = parametroT;
  document.getElementById('fd').value = parametroD;
  document.getElementById('fx').value = parametro1;
  document.getElementById('fy').value = parametro2;
  document.getElementById('fz').value = parametro3;
  document.getElementById('fw').value = parametro4;
  //alert ("Func1 executou e alterou valor fy"); //debug
}

function tamanhoJanela() { //pega o tamanho/resolução da janela do browser
  var win = window,
  doc = document,
  docElem = doc.documentElement,
  body = doc.getElementsByTagName('body')[0],
  x = win.innerWidth || docElem.clientWidth || body.clientWidth,
  y = win.innerHeight|| docElem.clientHeight|| body.clientHeight;
  alert(x + ' × ' + y);    
  //https://stackoverflow.com/questions/3437786/get-the-size-of-the-screen-current-web-page-and-browser-window
}

function zerar_contagem() { //reseta os valores de time_elapsed(num) e parametros (arrays)
  time_elapsed = 0;
  parametroT = [];
  parametroD = [];
  parametro1 = []; 
  parametro2 = [];
  parametro3 = [];
  parametro4 = [];
  // parametroF = []; 
  
}

let parametroT = [];  //tempo do sistema (Date.now())
let parametroD = [];  //Duração em segundos
let parametro1 = [];
let parametro2 = [];
let parametro3 = [];
let parametro4 = [];
// let parametroF = [];  //paramtetroF era para a distância à referencia
var time_elapsed = 0;
var tempo = document.getElementById("timer_onscreen"); //muda o valor do tempo na tela
tempo.innerHTML = time_elapsed;
var time_initial = Date.now();
var timerIsOn = false;

function timerStart () {    //inicia contagem de tempo e registro de dados (getTheNumbers())
  if (timerIsOn == false) {           // se timer estiver parado,
    timerIsOn = true;                 // liga "led" do timer
    time_expected = Date.now() + interval; //define o próximo ciclo esperado
    time_initial = Date.now();        // âncora da contagem de tempo com os ciclos do pc
    setTimeout(step, interval);       // começa a execuçao em loop da funcao "step" depois de "interval" milissegundos
    getTheNumbers();                  // e registra os dados SÓ no instante inicial (t=0)
  }
}

function timerStop() { //função que para contagem
  timerIsOn = false;
}

//contagem de tempo precisa com correção de drift https://stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript 
var interval = 100; // milissegundos. Período de cada registro
var time_expected = Date.now() + interval; 
var drift_history = [];
var drift_history_samples = 10;
var drift_correction = 0;

function calc_drift(arr){ //calcula mediana do drift para correcao com base do array
  var values = arr.concat(); // copy array so it isn't mutated
  values.sort(function(a,b){
    return a-b;
  });
  if(values.length ===0) return 0;   //se array é 0, mediana é 0
  var half = Math.floor(values.length / 2); //pega id da metade do array 
  if (values.length % 2) return values[half];   //se array for impar, mediana é valor do meio 
  var median = (values[half - 1] + values[half]) / 2.0;  //se array for par, mediana é média entre os dois valores do meio
  
  return median;
}

function step() { //função executada a cada "interval" milissegundos
  
  var dt = Date.now() - time_expected; // the drift (positive for overshooting)
  if (dt > interval) {  //demorou mais do que devia

  }
  // do what is to be done
  time_elapsed += interval/1000; // contagem sobe em "interval" segundos
  time_elapsed = Math.round(time_elapsed*10)/10; //arredonda pra ter só uma casa decimal
  tempo.innerHTML = time_elapsed;
  getTheNumbers();      //registro periódico da orientação
  
  if (dt <= interval) {
    // sample drift amount to history after removing current correction
    // (add to remove because the correction is applied by subtraction)
    drift_history.push(dt + drift_correction); //adiciona um ponto no array de drifts
    // predict new drift correction
    drift_correction = calc_drift(drift_history);
    // cap and refresh samples
    if (drift_history.length >= drift_history_samples) {
      drift_history.shift();  //remove um ponto no array de drifts se estiver com mais de 10
    }    
  }
  time_expected += interval;
  // take into account drift with prediction
  if (timerIsOn == true) {  //se o timer estiver on, segue em frente
    setTimeout(step, Math.max(0, interval - dt - drift_correction)); //terminando a primeira chamada, vai executar essa mesma funcao com um tempo corrigido
  }
}
    
var orientacaoQuat;
function getTheNumbers() { //armazena os dados de orientação em quat. para os arrays a cada chamada
  /*var*/ orientacaoQuat = Jmol.getPropertyAsArray(jsmol_molecula, 'orientationInfo.quaternion'); 
  document.getElementById("indicador_orientacao").innerHTML = orientacaoQuat;// debug
  
  parametroT.push(Date.now());
  parametroD.push(tempo.innerHTML);
  parametro1.push(orientacaoQuat[0]);
  parametro2.push(orientacaoQuat[1]);
  parametro3.push(orientacaoQuat[2]);
  parametro4.push(orientacaoQuat[3]);
  
  // calc. da distancia à resposta (CORRIGIR PRO QUATERNION!)
  // var valorTempResult =  Math.sqrt( Math.pow((orientacaoQuat[1]-Ori1),2) + Math.pow((orientacaoQuat[2]-Ori2),2) + Math.pow((orientacaoQuat[3]-Ori3),2) + Math.pow((orientacaoQuat[4]-Ori4),2) );  
  // parametroF.push(Math.floor(valorTempResult) + "," + Math.round((valorTempResult%1)*1000));     // transformando float em string "abcd,efg"

  //cortei o grafico fora, depois eu reativo
  // ctx.lineTo( (30+(tempo.innerHTML*10)) , (250-(valorTempResult/10)) );
  // ctx.stroke();
}

//snip traduz form em linha no gsheets
const scriptURL = 'https://script.google.com/macros/s/AKfycbxtKza8SDt27Ik39cktDyv66dD2Lt77vERuHWOVEnraLH91kQwBl1r2bPQoD8Gi1BZW/exec'
const form = document.forms['submit-to-google-sheet']
form.addEventListener('submit', e => {
  e.preventDefault()
  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => console.log('Success!', response))
    .catch(error => console.error('Error!', error.message))
})
// let data = ''

let saveFile = () => {

  // This variable stores all the data.
  let data =
  // data= 
    parametroT + '\n' + 
    parametroD + '\n' + 
    parametro1 + '\n' + 
    parametro2 + '\n' + 
    parametro3 + '\n' + 
    parametro4 + '\n';

  // Convert the text to BLOB.
  const textToBLOB = new Blob([data], { type: 'text/plain' });
  const sFileName = 'IRT_OUTPUT_'+task_list[task_n]+'.csv';	// Local file name.

  let newLink = document.createElement("a");
  newLink.download = sFileName;

  if (window.webkitURL != null) {
    newLink.href = window.webkitURL.createObjectURL(textToBLOB);
  }
  else {
    newLink.href = window.URL.createObjectURL(textToBLOB);
    newLink.style.display = "none";
    document.body.appendChild(newLink);
  }

  newLink.click(); 
  //créditos: https://www.encodedna.com/javascript/practice-ground/default.htm?pg=save_form_data_in_text_file_using_javascript
}

//funções para a estrutura da página em abas 
tabs = function(options) {  
  //ENTENDER MELHOR O QUE ESTA SENDO FEITO AQUI
  var defaults = {  
      selector: '.tabs',
      selectedClass: 'selected'
  };  
  
  if(typeof options == 'string') defaults.selector = options;
  var options = $.extend(defaults, options); 

  return $(options.selector).each(function(){
                              
      var obj = this; 
      var targets = Array();

      function show(i){
          $.each(targets,function(index,value){
              $(value).hide();
          })
          $(targets[i]).fadeIn('fast');
          $(obj).children().removeClass(options.selectedClass);
          selected = $(obj).children().get(i);
          $(selected).addClass(options.selectedClass);
      };

      $('a',this).each(function(i){   
          targets.push($(this).attr('href'));
          $(this).click(function(e){
              e.preventDefault();
              show(i);
          });
      });
      
      show(0);

  });         
}
// initialize the function
tabs('nav ul');
