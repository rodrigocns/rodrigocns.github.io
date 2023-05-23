//functions for page data structure and flow.

//Insert here your copied web app URL between the single quotes! 
const scriptURL = 'https://script.google.com/macros/s/AKfycbxtKza8SDt27Ik39cktDyv66dD2Lt77vERuHWOVEnraLH91kQwBl1r2bPQoD8Gi1BZW/exec';

//Besides the line above, everything else in this file should be left as it is.
//Unless you know what you are doing, or you want to fiddle with coding and learn more! :D

let task_n = 0; //número da tarefa interativa inicial
let stage = 0;

const stage_elements = document.getElementsByClassName('stage'); //pega a lista de stages
function nextStage() {  //makes the present stage (section with tag stage) invisible and shows the next section 
  // get the currently visible stage with the `current-stage` class
  var currentSection = document.querySelector(".current-stage");
  // get the next sequential section with the `stage` class
  var nextSection = currentSection.nextElementSibling;
  while (nextSection && !nextSection.classList.contains("stage")) {
    nextSection = nextSection.nextElementSibling;
  }
  // if there is no next sequential section go back to the first one
  if (!nextSection) {
    nextSection = document.querySelector(".stage");
  }
  // hide button if element is the last one 
  /*
  if (stage_elements[stage_elements.length - 1]==nextSection) {
    document.getElementById("next_stage_button_debug").style.visibility="hidden";
  }
  */
  // hide the current sequential section with the `stage` class
  currentSection.style.display = "none";
  currentSection.classList.remove("current-stage");
  // show the next sequential section with the `stage` class
  nextSection.style.display = "block";
  nextSection.classList.add("current-stage");
}

var debug_state = 0;
function debug() { //switch (on/off) de recursos de debug. 
  //Alterna visibilidade de cada elemento de classe 'debug'
  const debug_elements = document.getElementsByClassName('debug');
  if (debug_state == 0){
    debug_state = 1;
    for (let i = 0; i < debug_elements.length; i++) {
      debug_elements[i].style.display = "inline";
    }
  } else {
    debug_state = 0;
    for (let i = 0; i < debug_elements.length; i++) {
      debug_elements[i].style.display = "none";
    }
  }
  // alert(debug_elements.length);
}

function openFullscreen() { /* View in fullscreen */
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
    document.documentElement.webkitRequestFullscreen();
  } else if (document.documentElement.msRequestFullscreen) { /* IE11 */
    document.documentElement.msRequestFullscreen();
  }
}
function closeFullscreen() {/* Close fullscreen */
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
}

function botaoInicio() { //funções para executar com o botão de inicio do teste. 
  zerar_contagem();
  document.getElementById("cellLeft").style.visibility="visible";
  document.getElementById("cellRight").style.visibility="visible";
  
  timerStart ();                    //inicia contagem de tempo e funções periódicas
  getTheNumbers();                  // registra os dados SÓ do instante inicial (t=0)
  document.getElementById("startButton").style.visibility="hidden";
  setTimeout(function() {
    document.getElementById("submitButton").style.visibility="visible";
  }, 1000);
  razaoPxAngst=pixelAngstromRatio(randXYZ(jsmolInteractiveObject),jsmolInteractiveObject);
}

function botaoSubmit(){ //funções para executar com o botão de fim do teste.
  timerStop();  //stop cronometer
  document.getElementById("cellLeft").style.visibility="hidden";
  document.getElementById("cellRight").style.visibility="hidden"; //hides jmol screens
  gsFormStatus = insert_form_values();
  if (gsFormStatus != 1){
    alert("Error in forms data upload!\nSomething inside the function insert_form_values() went wrong!");
  }
  document.getElementById("submitButton").style.visibility="hidden"; //hides submit button
  task_n +=1; //Progride para a próxima tarefa em task_list e prepMolecula()
  // if (task_n >= 6) {task_n = 0;} /*volta ao primeiro*/
  if (is_local_save == true) {
    saveFile();
  }
  if (task_n >= task_list.length) { //if submitted task is/was last one, shows button for next stage instead of next task  
    document.getElementById("endTasksButton").style.visibility="visible";
    return;
  } else {
    prepMolecula(task_n);
    setTimeout(function() {
      document.getElementById("startButton").style.visibility="visible";
    }, 1000);
  }
}

function rot_matrix(qi,qj,qk,qr,s=1) { //generates 3x3 matrix of rotation related to input quaternion
  //Jmol gives quaternion numbers with the real part at the last position. Thats why qr is last. 
  let matrix = [
    [1-2*s*(qj**2 + qk**2),   2*s*(qi*qj - qk*qr),   2*s*(qi*qk + qj*qr)],
    [  2*s*(qi*qj + qk*qr), 1-2*s*(qi**2 + qk**2),   2*s*(qj*qk - qi*qr)],
    [  2*s*(qi*qk - qj*qr),   2*s*(qj*qk + qi*qr), 1-2*s*(qi**2 + qj**2)],
  ];
  return matrix;
}
function matrix_prod (mat3x3,mat3x1) { //returns product of matrix 3x3 and matrix 3x1
  let matProd = [
    mat3x3[0][0]*mat3x1[0] + mat3x3[0][1]*mat3x1[1] + mat3x3[0][2]*mat3x1[2],
    mat3x3[1][0]*mat3x1[0] + mat3x3[1][1]*mat3x1[1] + mat3x3[1][2]*mat3x1[2],
    mat3x3[2][0]*mat3x1[0] + mat3x3[2][1]*mat3x1[1] + mat3x3[2][2]*mat3x1[2]
  ];
  return matProd;
}
function pixelAngstromRatio(xyz,jsmol_obj,debug=0){  //returns the pixel to Angstrons ratio 
  quatArr = Jmol.getPropertyAsArray(jsmol_obj, 'orientationInfo.quaternion'); 
  
  //get center of rotations xyz coordinates
  let bBoxCenter = Jmol.getPropertyAsArray(jsmol_obj, 'boundBoxInfo.center'); 
  //correct xyz coordinates as if rotation center is at (0,0,0)
  let xyzCorrected = [xyz[0]-bBoxCenter[0],xyz[1]-bBoxCenter[1],xyz[2]-bBoxCenter[2]];
  
  //get rotation matrix
  let matrix = rot_matrix(quatArr[0],quatArr[1],quatArr[2],quatArr[3]);
  //aply rotation matrix to xyzCorrected coordinates
  let xyzRotated = matrix_prod(matrix,xyzCorrected);
  
  //get the equivalent xy projection (pixels) of the xyz point in space. 
  //NOTE: Jmol gives xyz "pixel" coordinates, but we use only x and y. 
  //NOTE: y rises going up, x rises going right.
  Jmol.script(jsmol_obj,'projecaoXY = point({'+xyz+'}, true)');
  let sXYZ = Jmol.getPropertyAsArray(jsmol_obj, 'variableInfo.projecaoXY'); 
  //correct pixel coordinates as if the middle of the screen is (0.0)
  sHeight= Jmol.getPropertyAsArray(jsmol_obj, 'variableInfo._height');
  sWidth= Jmol.getPropertyAsArray(jsmol_obj, 'variableInfo._width');
  let sXYCorrected = [sXYZ[0]-sHeight/2, sXYZ[1]-sWidth/2];
  //get the pixel:angstrom ratio
  let razao = [sXYCorrected[0]/xyzRotated[0],sXYCorrected[1]/xyzRotated[1]];
  if (debug==1){
    console.log('razao pixel:Angstrom = '+razao)//debug
  }
  return razao;
}
function randXYZ(jsmol_obj) { //return random xyz coordinates inside boundbox of input jmol object 
  let boxMin= Jmol.getPropertyAsArray(jsmol_obj, 'boundBoxInfo.corner0');
  let boxMax= Jmol.getPropertyAsArray(jsmol_obj, 'boundBoxInfo.corner1');
  let xyz = [0,0,0];
  xyz[0] = Math.random()*(boxMax[0]-boxMin[0])+boxMin[0];
  xyz[1] = Math.random()*(boxMax[1]-boxMin[1])+boxMin[1];
  xyz[2] = Math.random()*(boxMax[2]-boxMin[2])+boxMin[2];
  // console.log('xyz: '+xyz); //debug
  return xyz;
}

// create numButtons button tags dinamically. Reflects task_list entries 
const numButtons = task_list.length;
const buttonContainer = document.getElementById("button-container");
for (let i = 1; i <= numButtons; i++) {
  const button = document.createElement("button");
  button.innerText = `${i}`;
  button.onclick = function() {
    task_n=i-1;
    prepMolecula(task_n);
  };
  buttonContainer.appendChild(button);
}

function insert_form_values() { //insert values in form before sumbission
  document.getElementById('gsForm').sessionID.value = sessionID;
  document.getElementById('gsForm').task_id.value = task_list[task_n]; //tasks identifier
  document.getElementById('gsForm').pxAngstRatio.value = razaoPxAngst; //pixels to jmol distance unit ratio 
  document.getElementById('gsForm').epochStart.value = time_initial;//initial time in unix epoch
  document.getElementById('gsForm').epochArr.value = arrayEpoch;//duration in milliseconds
  document.getElementById('gsForm').duration.value = parametroD;//time registered by iRT
  document.getElementById('gsForm').fQi.value = parametro1; //quaternion array of values of the interactive model.
  document.getElementById('gsForm').fQj.value = parametro2;
  document.getElementById('gsForm').fQk.value = parametro3;
  document.getElementById('gsForm').fQr.value = parametro4; // Qr is the real component
  refQuat = Jmol.getPropertyAsArray(jsmolReferenceObject, 'orientationInfo.quaternion');
  document.getElementById('gsForm').ref_i.value = refQuat[0]; //quaternion values of the reference model
  document.getElementById('gsForm').ref_j.value = refQuat[1];
  document.getElementById('gsForm').ref_k.value = refQuat[2];
  document.getElementById('gsForm').ref_r.value = refQuat[3]; 
  [winX,winY] = tamanhoJanela();
  document.getElementById('gsForm').scrSizeX.value = winX;  // browser screen width and height (X,Y)
  document.getElementById('gsForm').scrSizeY.value = winY;  //Header,url field and other elements are outside 
  refCanvasPositions = jsmolReferenceObject_canvas2d.getBoundingClientRect();
  document.getElementById('gsForm').cvsRefTop.value = refCanvasPositions.top;  // reference canvas top,right,bottom,left positions
  document.getElementById('gsForm').cvsRefRight.value = refCanvasPositions.right;  
  document.getElementById('gsForm').cvsRefBottom.value = refCanvasPositions.bottom;  
  document.getElementById('gsForm').cvsRefLeft.value = refCanvasPositions.left;  
  intCanvasPositions = jsmolInteractiveObject_canvas2d.getBoundingClientRect();
  document.getElementById('gsForm').cvsIntTop.value = intCanvasPositions.top;  // interactive canvas top,right,bottom,left positions
  document.getElementById('gsForm').cvsIntRight.value = intCanvasPositions.right;  
  document.getElementById('gsForm').cvsIntBottom.value = intCanvasPositions.bottom;  
  document.getElementById('gsForm').cvsIntLeft.value = intCanvasPositions.left;  
  browserInfo = Jmol.getPropertyAsArray(jsmolInteractiveObject, 'appletInfo.operatingSystem');
  document.getElementById('gsForm').browser.value = browserInfo; // what browser was used
  modelFileLocation = Jmol.getPropertyAsArray(jsmolInteractiveObject, 'fileName');
  modelName = modelFileLocation.slice(modelFileLocation.lastIndexOf("/")+1);
  document.getElementById('gsForm').modelName.value = modelName; // fileName of 3D model used
  gsFormStatus = 1;
  //alert ("Func1 executou e alterou valor fy"); //debug
  console.log("Form values inserted! gsFormStatus: "+gsFormStatus);
  return gsFormStatus;
}


function tamanhoJanela() { //pega o tamanho/resolução da janela do browser
  var win = window,
  doc = document,
  docElem = doc.documentElement,
  body = doc.getElementsByTagName('body')[0],
  x = win.innerWidth || docElem.clientWidth || body.clientWidth,
  y = win.innerHeight|| docElem.clientHeight|| body.clientHeight;
  console.log(x + ' × ' + y);
  return [x,y];
  //https://stackoverflow.com/questions/3437786/get-the-size-of-the-screen-current-web-page-and-browser-window
}

function elemPosition(elemID) { //pega posições xy (left-top) e outras do elemento pela ID
//const element = document.getElementById(elemID);
const rect = elemID.getBoundingClientRect();
const position = {
  x: rect.left + window.scrollX,
  y: rect.top + window.scrollY
};
console.log(position);
}

let arrayEpoch = [];  //system time (Date.now())
let parametroD = [];  //Time elapsed in seconds
let parametro1 = [];
let parametro2 = [];
let parametro3 = [];
let parametro4 = [];
var time_elapsed = 0; //duração do teste
// document.getElementById("timer_onscreen").value = time_elapsed;
var time_initial = Date.now(); //precisa ser global para usar no formulario
var timerIsOn = false;

function zerar_contagem() { //reset time_elapsed(num) and parameter array values
  time_elapsed = 0;
  document.getElementById("timer_onscreen").value = 0;
  arrayEpoch = [];
  parametroD = [];
  parametro1 = []; 
  parametro2 = [];
  parametro3 = [];
  parametro4 = [];
}

function timerStart () {    //inicia contagem de tempo e registro de dados (getTheNumbers())
  if (timerIsOn == false) {           // se timer estiver parado,
    time_expected = Date.now() + interval; //define o próximo ciclo esperado
    time_initial = Date.now();        // âncora da contagem de tempo com os ciclos do pc
    setTimeout(step, interval);       // começa a execuçao em loop da funcao "step" depois de "interval" milissegundos
    timerIsOn = true;                 // liga "luz LED" do timer
  }
}

function timerStop() { //stop the cronometer
  timerIsOn = false;
}

//contagem de tempo precisa com correção de drift https://stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript 
var interval = 100; // milissegundos. Período esperado entre cada registro
var time_expected = Date.now() + interval; 
var drift_history = [];
var drift_history_samples = 10;
var drift_correction = 0;

function calc_drift(arr){ //calcula mediana do drift para correcao com base no array
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
  document.getElementById("timer_onscreen").value = time_elapsed;
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

//Criando id único da sessão (ninguém deveria conseguir abrir a página no mesmo milésimo sem querer)
const sessionID = `${Date.now()}`;
//const randomString = Math.random().toString(36).substring(2, 7);
//const sessionID = `${Date.now()}-${randomString}`;

var precision = 1000000 //quantidade de casas decimais para usar nos dados de quaternios
var orientacaoQuat;
function getTheNumbers() { //armazena os dados de orientação em quat. para os arrays a cada chamada
  /*var*/ orientacaoQuat = Jmol.getPropertyAsArray(jsmolInteractiveObject, 'orientationInfo.quaternion'); 
  document.getElementById("indicador_orientacao").innerHTML = orientacaoQuat;// debug
  
  arrayEpoch.push(Date.now()-time_initial);
  parametroD.push(time_elapsed);
  parametro1.push( Math.round(orientacaoQuat[0]*precision)/precision );
  parametro2.push( Math.round(orientacaoQuat[1]*precision)/precision );
  parametro3.push( Math.round(orientacaoQuat[2]*precision)/precision );
  parametro4.push( Math.round(orientacaoQuat[3]*precision)/precision );
  
  // calc. da distancia à resposta (CORRIGIR PRO QUATERNION!)
  // var valorTempResult =  Math.sqrt( Math.pow((orientacaoQuat[1]-Ori1),2) + Math.pow((orientacaoQuat[2]-Ori2),2) + Math.pow((orientacaoQuat[3]-Ori3),2) + Math.pow((orientacaoQuat[4]-Ori4),2) );  
  // parametroF.push(Math.floor(valorTempResult) + "," + Math.round((valorTempResult%1)*1000));     // transformando float em string "abcd,efg"

  //cortei o grafico fora, depois eu reativo
  // ctx.lineTo( (30+(timer_onscreen.value*10)) , (250-(valorTempResult/10)) );
  // ctx.stroke();
}

//snip traduz form em linha no gsheets. scriptURL moved to file's first lines.
const form = document.forms['submit-to-google-sheet']
form.addEventListener('submit', e => {
  e.preventDefault()
  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => console.log('Success!', response))
    .catch(error => console.error('Error!', error.message))
})

function getLocalData() {
  let data =
    'sessionID:' + sessionID + ';' +
    'fname:' + gsForm.fname.value + ';' +
    'email:' + gsForm.email.value + ';' +
    'pxAngstRatio:' + (razaoPxAngst[0]+razaoPxAngst[1])/2 + ';' +
    '\n' + 
    "sessionID,task_id,epoch,duration,Qi,Qj,Qk,Qr\n";
  let newRow = "";
  for (i = 0; i < parametro1.length; i++) {
    newRow = 
      sessionID + ',' +
      task_list[task_n] + ',' +
      time_initial+arrayEpoch[i] + ',' +
      parametroD[i] + ',' +
      parametro1[i] + ',' +
      parametro2[i] + ',' +
      parametro3[i] + ',' +
      parametro4[i] + '\n';
    data = data + newRow;
  }
  return data;
}

let saveFile = () => { //Salvar os dados localmente.

  // This variable stores all the local data.
  let data = getLocalData();
  
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
var is_local_save = false;
document.getElementById('save_check').checked = false; //default é não salvar.
function localSaveSwitch(checkbox) {
  if (checkbox.checked) {
    // document.body.style.backgroundColor = "red" //debug
    is_local_save = true;
  } else {
    //document.body.style.backgroundColor = "" //debug
    is_local_save = false;
  }
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
