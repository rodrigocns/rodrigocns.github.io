
function tamanhoJanela () {
  var win = window,
  doc = document,
  docElem = doc.documentElement,
  body = doc.getElementsByTagName('body')[0],
  x = win.innerWidth || docElem.clientWidth || body.clientWidth,
  y = win.innerHeight|| docElem.clientHeight|| body.clientHeight;
  alert(x + ' × ' + y);    
  //https://stackoverflow.com/questions/3437786/get-the-size-of-the-screen-current-web-page-and-browser-window
}

function meuSubmit() {      //função para setar os dados do formulário e ao final, enviá-los
    //document.getElementById('nomeField').value = NomeCompleto;
    document.getElementById('tempoField').value = resultados.tempo;
    document.getElementById('paramFField').value = resultados.parametroF;
    document.getElementById('param1Field').value = resultados.parametro1;
    document.getElementById('param2Field').value = resultados.parametro2;
    document.getElementById('param3Field').value = resultados.parametro3;
    document.getElementById('param4Field').value = resultados.parametro4;
    document.getElementById("meuForm").submit();    //linha final da função, para o envio dos dados
    
}

function botaoInicio() {
  javascript:Jmol.script(jsmol_molecula,'moveto 0.0 {-666 39 745 139.54}');
  document.getElementById("divMoleculaPNG").style.visibility="visible";
  document.getElementById("divMoleculaTeste").style.visibility="visible";
  timerStart ();
  //javascript:Jmol.script(jsmol_molecula,'color structure');
}

var duracao = 0;
var tempo = document.getElementById("tempoGasto");
tempo.innerHTML = duracao;
var tempoInicial = 0;
var timerIsOn = false;
var timerVar; // variavel para a contagem de tempo  

function timerStart () {    //função iniciar a contagem
  if (timerIsOn == false) {           //se timer estiver parado,
    timerIsOn = true;                 //liga "led" do timer
    expected = Date.now() + interval; //define o próximo ciclo
    tempoInicial = Date.now();        // ancora da contagem de tempo com os ciclos do pc
    setTimeout(step, interval);       //começa a execuçao em loop da funcao "step" depois de "interval" tempo
    getTheNumbers();                  // e registra os dados no instante inicial (t=0)
  }
}

function timerStop() { //função que para contagem
  timerIsOn = false;
}

//função de tempo nova https://stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript 

var interval = 100; // ms
var expected = Date.now() + interval;
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

function step() {
  var dt = Date.now() - expected; // the drift (positive for overshooting)
  if (dt > interval) {  //demorou mais do que devia

  }
  // do what is to be done
  duracao += interval/1000; // contagem sobe em 0.1
  duracao = Math.round(duracao*10)/10;
  tempo.innerHTML = duracao;
  getTheNumbers();                  // e registra os dados no instante inicial (t=0)

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
  expected += interval;
  // take into account drift with prediction
  if (timerIsOn == true) {  //se o timer estiver on, segue em frente
    setTimeout(step, Math.max(0, interval - dt - drift_correction)); //terminando a primeira chamada, vai executar essa mesma funcao com um tempo corrigido
  }
}
//fim da nova funcao de timer

    
var resultados = new Object();
resultados.tempo = [];  // declarando os arrays 
resultados.parametroF = [];
resultados.parametro1 = [];
resultados.parametro2 = [];
resultados.parametro3 = [];
resultados.parametro4 = [];
function getTheNumbers() {      //Função que captura as coordenadas de orientação da molécula a cada chamada e cria uma nova linha de uma tabela com as informações obtidas
    var orientacaoRawStr = Jmol.getPropertyAsString(jsmol_molecula, 'orientationInfo.moveTo');      // (bendita) Função que grava as propriedades moveTo de orientação em uma string 
    
    var axisAngle = orientacaoRawStr.slice( (orientacaoRawStr.search("{") +1 ) , orientacaoRawStr.search("}") );        //valor de "axisAngle" recebe fatia de dados da string "orientacaoStr" com 4 parametros de orientação AxisAngle. Data entre '{' e '}' é a "fatia" que interessa)
    
    var eulerAngles = axisAngle.split(" "); // eulerAngles[0] é o índice da string, [1], [2] e [3] são os parametros do eixo de rotação, [4] é o ângulo de rotação 
    resultados.parametro1[resultados.parametro1.length] = eulerAngles[1];   // grava os parâmetros do eixo de rotação de euler e o ângulo de rotação 
    resultados.parametro2[resultados.parametro2.length] = eulerAngles[2];
    resultados.parametro3[resultados.parametro3.length] = eulerAngles[3];
    //eulerAngles[4] = eulerAngles[4].replace(".", ",");
    resultados.parametro4[resultados.parametro4.length] = eulerAngles[4];
    
    var valorTempResult =  Math.sqrt( Math.pow((eulerAngles[1]-Ori1),2) + Math.pow((eulerAngles[2]-Ori2),2) + Math.pow((eulerAngles[3]-Ori3),2) + Math.pow((eulerAngles[4]-Ori4),2) );  // calculo para obtenção de fator de proximidade da resposta 
    resultados.parametroF[resultados.parametroF.length] = Math.floor(valorTempResult) + "," + Math.round((valorTempResult%1)*1000);     // transformando o extenso float em uma string que representa um numero na forma "abcd,efg"
    resultados.tempo[resultados.tempo.length] = tempo.innerHTML;       // adicionando valores aos arrays

    ctx.lineTo( (30+(tempo.innerHTML*10)) , (250-(valorTempResult/10)) );
    ctx.stroke();
}

function writeParamTable(tableID) { // Função para imprimir tabela de parametros de orientação
  for (var i=0; i<resultados.tempo.length; i++){
    var table = document.getElementById(tableID).insertRow(1+i);
    
      var cellTempo = table.insertCell(0);
      var cellParamF = table.insertCell(1);
      var cellParam1 = table.insertCell(2);
      var cellParam2 = table.insertCell(3);
      var cellParam3 = table.insertCell(4);
      var cellParam4 = table.insertCell(5);
      
      cellTempo.innerHTML = resultados.tempo[i];
      cellParamF.innerHTML = resultados.parametroF[i];
      cellParam1.innerHTML = resultados.parametro1[i];
      cellParam2.innerHTML = resultados.parametro2[i];
      cellParam3.innerHTML = resultados.parametro3[i];
      cellParam4.innerHTML = resultados.parametro4[i];
      
    }
    //meuSubmit();  //chamada para a função que passa os dados do formulário
}

tabs = function(options) {  //funções para a estrutura da página em abas 

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
    
