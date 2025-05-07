//functions for page data structure and flow.

//Insert here your copied web app URL between the single quotes! 
const scriptURL = 'https://script.google.com/macros/s/AKfycbxtKza8SDt27Ik39cktDyv66dD2Lt77vERuHWOVEnraLH91kQwBl1r2bPQoD8Gi1BZW/exec';

//Besides the line above, everything else in this file should be left as it is.
//Unless you know what you are doing, or you want to fiddle with coding and learn more! :D

//trying to fix X-Frame-Options problem
delete Jmol._tracker;

let task_n = 0; //number of the initial interactive task
let ContentStage = 0;

const stage_elements = document.getElementsByClassName('ContentStage'); //get stages list
//hides the current section (with tag ContentStage-now), and shows the next section 
function nextStage() {  
  // get the currently visible section with the `ContentStage-now` class
  var currentSection = document.querySelector(".ContentStage-now");
  // get the next sequential section with the `ContentStage` class
  var nextSection = currentSection.nextElementSibling;
  while (nextSection && !nextSection.classList.contains("ContentStage")) {
    nextSection = nextSection.nextElementSibling;
  }
  // if there is no next sequential section go back to the first one
  if (!nextSection) {
    nextSection = document.querySelector(".ContentStage");
  }
  /*
  // hide button if element is the last one 
  if (stage_elements[stage_elements.length - 1]==nextSection) {
    document.getElementById("next_stage_button_debug").style.visibility="hidden";
  }
  */
  // hide the current sequential section with the `ContentStage` class
  currentSection.style.display = "none";
  currentSection.classList.remove("ContentStage-now");
  // show the next sequential section with the `ContentStage` class
  nextSection.style.display = "block";
  nextSection.classList.add("ContentStage-now");
}

var debug_state = 0;
//switch (on/off) of debug features.
function debug() {  
  //Toggles visibility of each 'debug' class element
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

var img2Dindex = 1;
var img3Dindex = 1;
var chemStructureArray = [];
const img2DStruct = document.getElementById('img2DStruct');
const img3DStruct = document.getElementById('img3DStruct');
const img3DLegend = document.getElementById('img3DLegend');
// index passa por 3 3struturas 2d, cada uma com 4 estruturas 3d 
function chemStructureNext() {
  //jmol script for images: select all; wireframe 0.10; spacefill 20%; select hydrogens; spacefill 15%
  const chemForm = document.getElementById('form-chem-test')
  //register current choice
  chemStructureArray.push(chemForm.p_chem_structure.value);
  //clean radio choice
  document.querySelector('input[name="p_chem_structure"]:checked').checked = false;
  //next image counter
  img3Dindex = img3Dindex + 1;
  // se 3D index maior que 4, 2D index aumenta e 3d index volta a 1
  if (img3Dindex > 4 ) {
    img2Dindex = img2Dindex +1;
    img3Dindex = 1;
  }
  //set (possible) new images
  img2DStruct.src = `testequimica/structureA${img2Dindex}.jpg`;
  img3DStruct.src = `testequimica/structureA${img2Dindex}B${img3Dindex}.jpg`;
  img3DLegend.src = `testequimica/legendB${img2Dindex}.jpg`;
  //hide current section, prepare for next one
  if (img2Dindex > 3) {
    unhideById('button-chem-end');
    removeById('form-chem-test');
  }
}

/* hide document element */
function visibilityById (idNameAsString) {
  //check is argument is a name, a string
  if (typeof(idNameAsString) != "string" ) {
    console.log ("Atention: Argument passed to hideId() is not a string.")
  }
  //if already hidden, unhide. Else, hide it.
  if (document.getElementById(idNameAsString).style.visibility == "hidden") {
    document.getElementById(idNameAsString).style.visibility="visible";
    console.log(`Unhid the element ${idNameAsString}`);
  } else {
    document.getElementById(idNameAsString).style.visibility="hidden";
  }
}

function hideById(idNameAsString) {
  const el = document.getElementById(idNameAsString);
  el.style.visibility="hidden";
}

function unhideById(idNameAsString) {
  const el = document.getElementById(idNameAsString);
  el.style.visibility="visible";
}

function removeById (idNameAsString) {
  document.getElementById(idNameAsString).style.display="none";
}

function unremoveById (idNameAsString, displayType="block") {
  document.getElementById(idNameAsString).style.display = displayType;
}

/* View in fullscreen */
function openFullscreen () { 
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
    document.documentElement.webkitRequestFullscreen();
  } else if (document.documentElement.msRequestFullscreen) { /* IE11 */
    document.documentElement.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
}

//function to track mouse movement and position

onmousemove = function(e) {
  mouseX=e.clientX;
  mouseY=e.clientY;
}

//functions to run when starting an iRT trial ..
let razaoPxAngst = [0,0];
function iRTStart() {  
  zerarContagem();
  unhideById("cellLeft");
  unhideById("cellRight");
  Jmol.script(jsmolReferenceObject,'refresh'); // refresh pixels of object window
  Jmol.script(jsmolInteractiveObject,'refresh');
  timerStart ();         //starts time counting and periodic functions
  getTheNumbers();       // records the data ONLY from the initial instant (t=0)
  hideById("startButton");
  setTimeout(function() {
    unhideById("submitButton")
    razaoPxAngst=pixelAngstromRatio(jsmolInteractiveObject);
    console.log(`razaoPxAngst: ${razaoPxAngst}}`);
  }, 1000);
  
}
//functions to run when clicking the "DONE" button.
function buttoniRTSubmit(){ 
  //stop cronometer
  timerStop();  
  //hide jsmol screens
  hideById("cellLeft");
  hideById("cellRight");
  //pass forms data to sheets
  gsFormStatus = insertFormValues();
  if (gsFormStatus != 1){
    console.log("Error in forms data upload!\nSomething inside the function insertFormValues() went wrong!");
  }
  //hide submit button
  hideById("submitButton");
  task_n +=1; //Progress to next task in task_list and prepMolecule()
  // if (task_n >= 6) {task_n = 0;} /*volta ao primeiro*/
  if (is_local_save == true) {
    saveFile();
  }
  //if submitted task is/was last one, shows button for next stage instead of next task  
  if (task_n >= task_list.length) { 
    unhideById("endTasksButton");
    return;
  } else {
    prepMolecule(task_n);
    setTimeout(function() {
      unhideById("startButton");
    }, 1000);
  }
}

//functions to run when starting/running corsi
function corsiStart() {  
  zerarContagem();
  timerStart ();         //starts time counting and periodic functions
  getTheNumbers();       // records the data ONLY from the initial instant (t=0)
}
//functions to run when completing corsi trials.
var corsiMouseTime = [];
var corsiMouseX = [];
var corsiMouseY = [];
function buttonCorsiSubmit(){ 
  //stop cronometer
  timerStop();  
  corsiMouseTime = arrayEpoch;
  corsiMouseX = arrayMouseX;
  corsiMouseY = arrayMouseY;
  console.log("Corsi data saved!");
}

//generates 3x3 matrix of rotation related to input quaternion
function rotationMatrix(qi,qj,qk,qr,s=1) { 
  //Jmol gives quaternion numbers with the real part at the last position. Thats why qr is last. 
  let matrix = [
    [1-2*s*(qj**2 + qk**2),   2*s*(qi*qj - qk*qr),   2*s*(qi*qk + qj*qr)],
    [  2*s*(qi*qj + qk*qr), 1-2*s*(qi**2 + qk**2),   2*s*(qj*qk - qi*qr)],
    [  2*s*(qi*qk - qj*qr),   2*s*(qj*qk + qi*qr), 1-2*s*(qi**2 + qj**2)],
  ];
  return matrix;
}

//returns product of matrix 3x3 and matrix 3x1
function matrixProduct (mat3x3,mat3x1) { 
  let matProd = [
    mat3x3[0][0]*mat3x1[0] + mat3x3[0][1]*mat3x1[1] + mat3x3[0][2]*mat3x1[2],
    mat3x3[1][0]*mat3x1[0] + mat3x3[1][1]*mat3x1[1] + mat3x3[1][2]*mat3x1[2],
    mat3x3[2][0]*mat3x1[0] + mat3x3[2][1]*mat3x1[1] + mat3x3[2][2]*mat3x1[2]
  ];
  return matProd;
}

//returns the pixel to Angstrons ratio
function pixelAngstromRatio(jsmol_obj,debug=0){   
  // get random xyz coordinate inside jmol canvas
  xyz = randXYZ(jsmol_obj);
  // get jmol onject orientation 
  quatArr = Jmol.getPropertyAsArray(jsmol_obj, 'orientationInfo.quaternion'); 
  //get center of rotations xyz coordinates
  let bBoxCenter = Jmol.getPropertyAsArray(jsmol_obj, 'boundBoxInfo.center'); 
  //correct xyz coordinates as if rotation center is at (0,0,0)
  let xyzCorrected = [xyz[0]-bBoxCenter[0],xyz[1]-bBoxCenter[1],xyz[2]-bBoxCenter[2]];
  
  //get rotation matrix
  let matrix = rotationMatrix(quatArr[0],quatArr[1],quatArr[2],quatArr[3]);
  //aply rotation matrix to xyzCorrected coordinates
  let xyzRotated = matrixProduct(matrix,xyzCorrected);
  
  //get the equivalent xy projection (pixels) of the xyz point in space. 
  //NOTE: Jmol gives xyz screen coordinates in pixels, but we use only x and y. 
  //NOTE: y rises going up, x rises going right.
  Jmol.script(jsmol_obj,'projecaoXY = point({'+xyz+'}, true)');
  let sXYZ = Jmol.getPropertyAsArray(jsmol_obj, 'variableInfo.projecaoXY'); 
  //get canvas height and width
  sHeight= Jmol.getPropertyAsArray(jsmol_obj, 'variableInfo._height');
  sWidth= Jmol.getPropertyAsArray(jsmol_obj, 'variableInfo._width');
  //update pixel coordinates so the middle of the canvas is (0.0)
  let sXYCorrected = [sXYZ[0]-sHeight/2, sXYZ[1]-sWidth/2];
  //get the pixel:angstrom ratio
  let razao = [sXYCorrected[0]/xyzRotated[0],sXYCorrected[1]/xyzRotated[1]];
  razao = [window.devicePixelRatio * razao[0], window.devicePixelRatio * razao[1]];
  if (debug==1){
    console.log('razao pixel:Angstrom = '+razao)//debug
  }
  return razao;
}

//return random xyz coordinates inside boundbox of input jmol object
function randXYZ(jsmol_obj) {  
  let boxMin= Jmol.getPropertyAsArray(jsmol_obj, 'boundBoxInfo.corner0');
  let boxMax= Jmol.getPropertyAsArray(jsmol_obj, 'boundBoxInfo.corner1');
  let xyz = [0,0,0];
  xyz[0] = Math.random()*(boxMax[0]-boxMin[0])+boxMin[0];
  xyz[1] = Math.random()*(boxMax[1]-boxMin[1])+boxMin[1];
  xyz[2] = Math.random()*(boxMax[2]-boxMin[2])+boxMin[2];
  // console.log('xyz: '+xyz); //debug
  return xyz;
}

// Pass chosen Paper task answers to forms
//Each time an alternative is chosen, choice is pushed to 'paperAnswer' array, 
// 'imgmap_n' increases and next image is loaded, until the image is the last one.
var imgmap_n = 1; 
var paperAnswer = "";
var paperRt = [];
function imgAlternativeChosen(chosen_alternative) {
  paperRt = paperRt.concat(toc());
  //add chosen_alternative to forms
  paperAnswer = paperAnswer + chosen_alternative;
  //go to next image
  imgmap_n += 1;
  //lock clicking inside map for 1000 ms, to avoid misclicks
  lockMap("imgmap");
  // if there are more images, load next image in new image path (img.src)
  if (imgmap_n <= 3 ) {
    const img = document.getElementById("imgmap");
    img.src = "images/PSVT-R ("+imgmap_n+").jpg"; // Change to the new image path
    tic (); // img is loaded, 
  }
  // else, blank screen for next trial
  else {
    nextStage();
    unhideById("button-corsi-start");
  }
}
//lock clicking inside map 
function lockMap(mapId, duration = 1000) {
  const map = document.getElementById(mapId);
  map.style.pointerEvents = "none";

  setTimeout(() => {
    map.style.pointerEvents = "auto";
  }, duration);
}


// create numButtons button tags dinamically. Reflects task_list entries 
const numButtons = task_list.length;
const buttonContainer = document.getElementById("button-container");
for (let i = 1; i <= numButtons; i++) {
  const button = document.createElement("button");
  button.innerText = `${i}`;
  button.onclick = function() {
    task_n=i-1;
    prepMolecule(task_n);
  };
  buttonContainer.appendChild(button);
}

//insert values in form before sumbission to google sheets
function insertFormValues() { 
  const gsForm = document.getElementById('gsForm');
  gsForm.sessionID.value = sessionID;
  gsForm.taskID.value = task_list[task_n]; //tasks identifier
  gsForm.pxAngstRatio.value = razaoPxAngst; //pixels to jmol distance unit ratio 
  gsForm.epochStart.value = time_initial;//initial time in unix epoch
  gsForm.epochArr.value = arrayEpoch;//duration in milliseconds
  gsForm.duration.value = parametroD;//time registered by iRT
  //quaternion array of values of the interactive model.
  gsForm.fQi.value = parametro1; 
  gsForm.fQj.value = parametro2;
  gsForm.fQk.value = parametro3;
  gsForm.fQr.value = parametro4; // Qr is the real (non-imaginary) component
  //quaternion values of the target model
  refQuat = Jmol.getPropertyAsArray(jsmolReferenceObject, 'orientationInfo.quaternion');
  gsForm.ref_i.value = refQuat[0]; 
  gsForm.ref_j.value = refQuat[1];
  gsForm.ref_k.value = refQuat[2];
  gsForm.ref_r.value = refQuat[3];
  //mouse position (xy) array
  gsForm.mouseX.value = arrayMouseX;
  gsForm.mouseY.value = arrayMouseY; 
  // browser screen width and height (X,Y)
  //Header,url field and other elements are outside 
  [scrSizeX,scrSizeY] = getWindowSize();
  gsForm.scrSizeX.value = scrSizeX;  
  gsForm.scrSizeY.value = scrSizeY;  
  // screen scaling of windows. As in how many pixels exist in a screen pixel
  gsForm.pxRatio.value = window.devicePixelRatio; 
  // target Object canvas top,right,bottom,left positions
  refCanvasPositions = jsmolReferenceObject_canvas2d.getBoundingClientRect();
  gsForm.cvsRefTop.value = refCanvasPositions.top * window.devicePixelRatio;  
  gsForm.cvsRefRight.value = refCanvasPositions.right * window.devicePixelRatio;  
  gsForm.cvsRefBottom.value = refCanvasPositions.bottom * window.devicePixelRatio;  
  gsForm.cvsRefLeft.value = refCanvasPositions.left * window.devicePixelRatio;  
  // interactive canvas top,right,bottom,left positions
  intCanvasPositions = jsmolInteractiveObject_canvas2d.getBoundingClientRect();
  gsForm.cvsIntTop.value = intCanvasPositions.top * window.devicePixelRatio;  
  gsForm.cvsIntRight.value = intCanvasPositions.right * window.devicePixelRatio;  
  gsForm.cvsIntBottom.value = intCanvasPositions.bottom * window.devicePixelRatio;  
  gsForm.cvsIntLeft.value = intCanvasPositions.left * window.devicePixelRatio;  
  // what browser was used
  browserInfo = Jmol.getPropertyAsArray(jsmolInteractiveObject, 'appletInfo.operatingSystem');
  gsForm.browser.value = browserInfo; 
  modelFileLocation = Jmol.getPropertyAsArray(jsmolInteractiveObject, 'fileName');
  // fileName of 3D model used, after all '/' folder divisories
  modelName = modelFileLocation.slice(modelFileLocation.lastIndexOf("/")+1);
  gsForm.modelName.value = modelName; 
  gsForm.paperAnswer.value = paperAnswer;
  gsForm.paperRt.value = paperRt;
  gsForm.corsiScore.value = corsi_score;
  gsForm.corsiTrials.value = corsi_correct_trials_array;
  gsForm.corsiRt.value = corsi_rt_array;
  gsForm.corsiChoices.value = corsi_choice_array;
  gsForm.corsiTrialId.value = corsi_trial_id_array;
  gsForm.corsiMouseTime.value  = corsiMouseTime ;
  gsForm.corsiMouseX.value = corsiMouseX;
  gsForm.corsiMouseY.value = corsiMouseY;
  //Inform ok status to console
  gsFormStatus = 1;
  console.log("Form values inserted! gsFormStatus: "+gsFormStatus);
  return gsFormStatus;
}

//gets the browser window size/resolution
function getWindowSize() { 
  var win = window,
  doc = document,
  docElem = doc.documentElement,
  body = doc.getElementsByTagName('body')[0],
  x = win.innerWidth || docElem.clientWidth || body.clientWidth,
  y = win.innerHeight|| docElem.clientHeight|| body.clientHeight;
  console.log('Window resolution: ' + x + ' × ' + y);
  return [x,y];
  //https://stackoverflow.com/questions/3437786/get-the-size-of-the-screen-current-web-page-and-browser-window
}

//take xy position ( left-top) of element from its ID
function elemPosition(elemID) { 
  //const element = document.getElementById(elemID);
  const rect = elemID.getBoundingClientRect();
  const position = {
  x: rect.left + window.scrollX,
  y: rect.top + window.scrollY
  };
  console.log(position);
}

//simple duration tracker 
var startTime = 0;
function tic () {
  startTime = Date.now();
}
function toc () {
  const endTime = Date.now();
  const rt = (endTime - startTime)/1000;
  console.log (`Elapsed time: ${rt} seconds`);
  return rt;
}

let arrayEpoch = [];  //system time (Date.now())
let parametroD = [];  //Time elapsed in seconds
let parametro1 = [];
let parametro2 = [];
let parametro3 = [];
let parametro4 = [];
let arrayMouseX = [];
let arrayMouseY = [];
var time_elapsed = 0; //duração do teste
// document.getElementById("timer_onscreen").value = time_elapsed;
var time_initial = Date.now(); //precisa ser global para usar no formulario
var timerIsOn = false;

//reset time_elapsed(num) and parameter array values
function zerarContagem() { 
  time_elapsed = 0;
  document.getElementById("timer_onscreen").value = 0;
  arrayEpoch = [];
  parametroD = [];
  parametro1 = []; 
  parametro2 = [];
  parametro3 = [];
  parametro4 = [];
  arrayMouseX = [];
  arrayMouseY = [];
}

//starts time counting (cronometer) and its associated data collection (getTheNumbers())
function timerStart () {    
  if (timerIsOn == false) {           // se timer estiver parado,
    time_expected = Date.now() + interval; //define o próximo ciclo esperado
    time_initial = Date.now();        // âncora da contagem de tempo com os ciclos do pc
    setTimeout(step, interval);       // começa a execuçao em loop da funcao "step" depois de "interval" milissegundos
    timerIsOn = true;                 // liga "luz LED" do timer
  }
}

//stop the cronometer
function timerStop() { 
  timerIsOn = false;
}

//precise time counting with drift correction https://stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript 
var interval = 100; // milisseconds. Expected interval between each data point 
var time_expected = Date.now() + interval; 
var drift_history = [];
var drift_history_samples = 10;
var drift_correction = 0;

//Calculates drift median for its correction based in the array 
function calcDrift(arr){ 
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

//function called after each "interval" milisseconds
function step() { 
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
    drift_correction = calcDrift(drift_history);
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

//Creating unique session ID based in unix epoch
const sessionID = `${Date.now()}`;
//const randomString = Math.random().toString(36).substring(2, 7);
//const sessionID = `${Date.now()}-${randomString}`;

var precision = 1000000 //decimal point (precision) used in queternion data
var orientacaoQuat;
//obtain the quaternion orientation data for arrays at each call
function getTheNumbers() { 
  /*var*/ orientacaoQuat = Jmol.getPropertyAsArray(jsmolInteractiveObject, 'orientationInfo.quaternion'); 
  document.getElementById("indicador_orientacao").innerHTML = `Quaternion: ${orientacaoQuat}`;// debug
  
  arrayEpoch.push(Date.now()-time_initial);
  parametroD.push(time_elapsed.toFixed(1)); //adiciona na pilha dados de tempo percorrido, com 1 casa decimal {toFixed(1)}
  parametro1.push( Math.round(orientacaoQuat[0]*precision)/precision );
  parametro2.push( Math.round(orientacaoQuat[1]*precision)/precision );
  parametro3.push( Math.round(orientacaoQuat[2]*precision)/precision );
  parametro4.push( Math.round(orientacaoQuat[3]*precision)/precision );
  arrayMouseX.push(mouseX);
  arrayMouseY.push(mouseY);
  
  // calc. da distancia à resposta (CORRIGIR PRO QUATERNION!)
  // var valorTempResult =  Math.sqrt( Math.pow((orientacaoQuat[1]-RefOri1),2) + Math.pow((orientacaoQuat[2]-RefOri2),2) + Math.pow((orientacaoQuat[3]-RefOri3),2) + Math.pow((orientacaoQuat[4]-RefOri4),2) );  
  // parametroF.push(Math.floor(valorTempResult) + "," + Math.round((valorTempResult%1)*1000));     // transformando float em string "abcd,efg"

  //cortei o grafico fora, depois eu reativo
  // ctx.lineTo( (30+(timer_onscreen.value*10)) , (250-(valorTempResult/10)) );
  // ctx.stroke();
}

// compile subject series of simple answers (ex: ans_01,ans_02,ans_03) to an array
function compileAnswersToArray(p_ans_name, ans_amount, inputType='value') {
  const answers = [];
  for (let i = 1; i <= ans_amount; i++) {
    //set name with counter "i"
    const name = `${p_ans_name}${String(i).padStart(2, '0')}`;
    //select element with answers
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    if (inputType == 'value') {
      answers.push(selected ? parseInt(selected.value) : null);
    }
    //if input was a checkbox, to check whether it was checked or not 
    else if (inputType == 'checkbox') {
      answers.push(selected ? (selected.checked) : false);
    }
  }
  console.log(answers);
  return answers;
}

//snip translate form in a gsheets line. scriptURL is located at this file's first lines.
const form = document.forms['submit-to-google-sheet']
form.addEventListener('submit', e => {
  e.preventDefault()
  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => console.log('Success!', response))
    .catch(error => console.error('Error!', error.message))
})

//save profiling data
function saveProfilingData () {
  //get forms links
  const gsForm = document.getElementById('gsForm');
  const endForm = document.getElementById('endForm');
  const chemForm = document.getElementById('form-chem-test');

  const profileData = {
    sessionID:          sessionID,
    name:               gsForm.fname.value,
    email:              gsForm.email.value,
    sex:                gsForm.p_sex.value,
    gender:             gsForm.p_gender.value,
    age:                gsForm.p_age.value,
    ocupation:          gsForm.p_ocupation,
    active:             gsForm.p_active.value,

    educGrau:           gsForm.p_educ_grau.value,
    educField:          gsForm.p_educ_field.value,
    educYear:           gsForm.p_educ_year.value,
    educDuration:       gsForm.p_educ_duration.value,
    educPrev:           gsForm.p_educ_prev.value,
    educPrevTxt:        gsForm.p_educ_prev_txt.value,

    difQui:             gsForm.p_dif_disc_qui.value,
    difMat:             gsForm.p_dif_disc_mat.value,
    difFis:             gsForm.p_dif_disc_fis.value,
    difBio:             gsForm.p_dif_disc_bio.value,
    difHum:             gsForm.p_dif_disc_hum.value,
    difArt:             gsForm.p_dif_disc_art.value,

    difQuiSubj:         compileAnswersToArray('p_dif_q', 14),
    difMatSubj:         compileAnswersToArray('p_dif_m', 11),
    difCotidSubj:       compileAnswersToArray('p_dif_c', 19),
    
    testeEstruturas:    chemStructureArray,

    browser:            navigator.userAgent,
    pixelRatio:         window.devicePixelRatio,

    paperAnswer:        paperAnswer,
    paperRt:            paperRt,

    corsiScore:         corsi_score,
    corsiTrials:        corsi_correct_trials_array,
    corsiRt:            corsi_rt_array,
    corsiChoices:       corsi_choice_array,
    corsiTrialId:       corsi_trial_id_array,
    corsiMouseTime:     corsiMouseTime,
    corsiMouseX:        corsiMouseX,
    corsiMouseY:        corsiMouseY,

    dificultyChem:      endForm.p_dific_chem.value,
    dificultyPaper:     endForm.p_dific_paper.value,
    dificultyCorsi:     endForm.p_dific_corsi.value,
    dificultyJsmol:     endForm.p_dific_jsmol.value,
    jsmolLikeness:      endForm.p_likeness.value,
    jsmolLikenessText:  endForm.p_likeness_txt.value,
  };
  
  //make the data structure into json. 
  //stringify(profileData) builds a compact .json
  //stringify(profileData,null,2) builds a pretty, multi-line .json
  
  function replacer(key,value){
    if (Array.isArray(value)) {
      return JSON.stringify(value); //compact arrays
    }
    return value; //other data formats
  }

  let jsonString = JSON.stringify(profileData, replacer, 2);

  jsonString = jsonString.replace(/"(\[.*?\])"/g, (_, arrayStr) => arrayStr);

  const blob = new Blob([jsonString], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `profile-data-${sessionID}.json`;
  link.click();
}

//data used in local backup
function getLocalData() {
  var localData =
    'sessionID'     + ';' +
    'taskID'        + ';' +
    'fname'         + ';' +
    'email'         + ';' +
    'pxAngstRatio'  + ';' +
    'epochStart'    + ';' +
    'modelName'     + ';' +
    'scrSizeX'      + ';' +
    'scrSizeY'      + ';' +
    'cvsRefTop'     + ';' +
    'cvsRefRight'   + ';' +
    'cvsRefBottom'  + ';' +
    'cvsRefLeft'    + ';' +
    'cvsIntTop'     + ';' +
    'cvsIntRight'   + ';' +
    'cvsIntBottom'  + ';' +
    'cvsIntLeft'    + ';' +
    'pxRatio'       + ';' +
    'paperAnswer'   + ';' +
    'paperRt'       + ';' +
    'corsiScore'    + ';' +
    'corsiTrials'   + ';' +
    'corsiRt'       + ';' +
    'corsiChoices'  + ';' +
    'corsiTrialId'  + ';' +
    'corsiMouseTime'+ ';' +
    'corsiMouseX'   + ';' +
    'corsiMouseY'   + ';' +
    '\n' + 
    sessionID                           + ';' +
    task_list[task_n]                   + ';' +
    gsForm.fname.value                  + ';' +
    gsForm.email.value                  + ';' +
    Math.round((razaoPxAngst[0]+razaoPxAngst[1])*10E6/2)/10E6 + ';' +
    time_initial                        + ';' +
    modelName                           + ';' +
    scrSizeX                            + ';' +
    scrSizeY                           + ';' +
    gsForm.cvsRefTop.value              + ';' +
    gsForm.cvsRefRight.value            + ';' +
    gsForm.cvsRefBottom.value           + ';' +
    gsForm.cvsRefLeft.value             + ';' +
    gsForm.cvsIntTop.value              + ';' +
    gsForm.cvsIntRight.value            + ';' +
    gsForm.cvsIntBottom.value           + ';' +
    gsForm.cvsIntLeft.value             + ';' +
    gsForm.pxRatio.value                + ';' +
    paperAnswer                         + ';' +
    paperRt                             + ';' +
    gsForm.corsiScore.value             + ';' +
    gsForm.corsiTrials.value            + ';' +
    gsForm.corsiRt.value                + ';' +
    gsForm.corsiChoices.value           + ';' +
    gsForm.corsiTrialId.value           + ';' +
    gsForm.corsiMouseTime.value             + ';' +
    gsForm.corsiMouseX.value            + ';' +
    gsForm.corsiMouseY.value            + ';' +
    
    
    
    '\n' + 
    
    'browser:' + browserInfo + ';\n' +
    "sessionID;taskID;epoch;duration;Qi;Qj;Qk;Qr;mouseX;mouseY;\n";
  let newRow = "";
  for (i = 0; i < parametro1.length; i++) {
    newRow = 
      sessionID                 + ';' +
      task_list[task_n]         + ';' +
      arrayEpoch[i]             + ';' +
      parametroD[i]             + ';' +
      parametro1[i]             + ';' +
      parametro2[i]             + ';' +
      parametro3[i]             + ';' +
      parametro4[i]             + ';' +
      arrayMouseX[i]            + ';' +
      arrayMouseY[i]            + '\n';
    localData = localData + newRow;
  }
  return localData;
}

//Save data locally (backup)
let saveFile = () => { 

  // This variable stores all the local data.
  let backupData = getLocalData();
  
  // Convert the text to BLOB.
  const textToBLOB = new Blob([backupData], { type: 'text/plain' });
  // Local file name.
  const sFileName = `IRT_OUTPUT_${sessionID}_${task_list[task_n]}.csv`;	

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
  console.log("Local Backup download started!");
}
var is_local_save = false;
document.getElementById('checkbox-local-backup').checked = false; //default is to save only online.
function localSaveSwitch(checkbox) {
  if (checkbox.checked) {
    // document.body.style.backgroundColor = "red" //debug
    is_local_save = true;
  } else {
    //document.body.style.backgroundColor = "" //debug
    is_local_save = false;
  }
}

//Functions for page's tabs structure 
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
