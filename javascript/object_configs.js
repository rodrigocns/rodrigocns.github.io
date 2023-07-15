var Info_interactive = { 
  //For more explanations go to https://wiki.jmol.org/index.php/Jmol_JavaScript_Object/Info
  color: "#000000",
  height: 400,
  width: 400,
  use: "HTML5",
  j2sPath: "jsmol/j2s",
  serverURL: "jsmol/php/jsmol.php",
  disableMouse: true,

  defaultModel: "",
  src: "models/pseudobatracotoxin_molecule.xyz", //script overwrites this
  script: 
  "load models/pseudobatracotoxin_molecule.xyz;\
  set perspectiveDepth OFF;\
  unbind _rotateZ;\
  unbind _rotateZorZoom;\
  unbind _reset;\
  unbind _translate;\
  unbind _center;\
  unbind _pickAtom;\
  unbind _setMeasure;\
  unbind _slideZoom;\
  unbind _wheelZoom;\
  unbind _popupMenu;\
  frank off;",
  readyFunction: null,   //calls func. when jmol has loaded and is ready
  debug: true //gives more error warnings if true 
}
//explaining JSmol script commands:
//disable perspective (needed for better precision in calculations of screen xy projections)
// set perspectiveDepth OFF;
//disable the input of most interactions
// unbind _rotateZ; unbind _rotateZorZoom; unbind <...>';
//disable the jmol watermark
// frank off;

var Info_reference = structuredClone(Info_interactive);
//disable rotation at 0. default is 1
Info_reference.script = Info_interactive.script.concat("set mouseDragFactor 0");

//target orientation
//ex.: moveto 0 QUATERNION {-0.4902575975335792 -0.2825336376897219 -0.45539483504230244 0.6873410913449087}

// List of interactive task names the subject will perform 
const task_list = ["bolaBastao_c","poligonFill","mrt"];

function prepMolecule(num) {   //mapper para o preparo do teste que está acontecendo
  //Rotaciona para a orientação inicial do objeto
  jsmol_ref = jsmolReferenceObject; //janela esquerda
  jsmol_obj = jsmolInteractiveObject; //janela direita
  //em cada case # estão as configurações de renderização dos objetos de cada tarefa
  switch (num){
    case 0:
      buildBallStickMol(jsmol_ref);
      buildBallStickMol(jsmol_obj);
      Jmol.script(jsmol_ref,'color cpk; spacefill 23%; wireframe 0.15');
      Jmol.script(jsmol_obj,'color cpk; spacefill 23%; wireframe 0.15');
      Jmol.script(jsmol_ref,'moveto 0 QUATERNION {-0.4902575975335792 -0.2825336376897219 -0.45539483504230244 0.6873410913449087}');
      Jmol.script(jsmol_obj,'moveto 0.0 {-666 39 745 139.54}');
    break;
    case 1:
      buildPoligonFilledMol(jsmol_obj);
      buildPoligonFilledMol(jsmol_ref);
      Jmol.script(jsmol_ref,'color cpk; spacefill off; wireframe 0.08');
      Jmol.script(jsmol_obj,'color cpk; spacefill off; wireframe 0.08');
      Jmol.script(jsmol_ref,'moveto 0 QUATERNION {-0.4902575975335792 -0.2825336376897219 -0.45539483504230244 0.6873410913449087}');
      Jmol.script(jsmol_obj,'moveto 0.0 {-666 39 745 139.54}');
    break;
    case 2:
      buildMRTModel(jsmol_ref);
      buildMRTModel(jsmol_obj);
      Jmol.script(jsmol_ref,'moveto 0 QUATERNION {0.29922234471855447,0.2236541366945916,-0.10297736856098816,0.9218679282439424}');
      Jmol.script(jsmol_obj,'moveto 0 QUATERNION {0,0,0,1}');
    break;

    //https://chemapps.stolaf.edu/jmol/docs/examples/bonds.htm  help on altering model rendering
  }
}
function buildMRTModel(jsmol_obj) {
  //load new 3D model
  Jmol.script(jsmol_obj,'load models/MRT_VK_mol.xyz');
  //change background color, line/vertices color, vertices size, ambient shadows from light-source
  Jmol.script(jsmol_obj,'background white; color [0x404040]; spacefill OFF;set ambientPercent 100; wireframe 0.10');
  //draw polygons to build opaque solid. The vertices numbers must follow a clockwise or counterclockwise order.
  //For multi-line commands, each line besides the last ends with a '\' 
  Jmol.script(jsmol_obj,'\
    draw ID f1 polygon [@1 @5 @19 @15]; color $f1 [0xf0f0f0];color $f1 TRANSLUCENT 0.4;\
    draw ID f2 polygon [@1 @15 @18 @4]; color $f2 [0xf0f0f0];color $f2 TRANSLUCENT 0.4;\
    draw ID f3 polygon [@19 @15 @18 @26 @25 @21]; color $f3 [0xf0f0f0];color $f3 TRANSLUCENT 0.4;\
    draw ID f4 polygon [@5 @19 @21 @7]; color $f4 [0xf0f0f0];color $f4 TRANSLUCENT 0.4;\
    draw ID f5 polygon [@1 @5 @7 @13 @14 @4]; color $f5 [0xf0f0f0];color $f5 TRANSLUCENT 0.4;\
    draw ID f6 polygon [@18 @4 @14 @37 @34 @26]; color $f6 [0xf0f0f0];color $f6 TRANSLUCENT 0.4;\
    draw ID f7 polygon [@7 @21 @25 @39 @42 @13]; color $f7 [0xf0f0f0];color $f7 TRANSLUCENT 0.4;\
    draw ID f8 polygon [@14 @13 @42 @44 @38 @37]; color $f8 [0xf0f0f0];color $f8 TRANSLUCENT 0.4;\
    draw ID f9 polygon [@25 @26 @34 @35 @41 @39]; color $f9 [0xf0f0f0];color $f9 TRANSLUCENT 0.4;\
    draw ID f10 polygon [@41 @39 @42 @44]; color $f10 [0xf0f0f0];color $f10 TRANSLUCENT 0.4;\
    draw ID f11 polygon [@34 @37 @38 @35]; color $f11 [0xf0f0f0];color $f11 TRANSLUCENT 0.4;\
    draw ID f12 polygon [@35 @38 @44 @41]; color $f12 [0xf0f0f0];color $f12 TRANSLUCENT 0.4;\
    ');
}

function buildBallStickMol(jsmol_obj) {
  Jmol.script(jsmol_obj,'load models/pseudobatracotoxin_molecule.xyz');
  Jmol.script(jsmol_obj,'background black; color cpk; spacefill 23%;set ambientPercent 45; wireframe 0.15;set showHydrogens TRUE');
}

function buildPoligonFilledMol(jsmol_obj) {
  //load 3D model
  Jmol.script(jsmol_obj,'load models/pseudobatracotoxin_molecule.xyz');
  //change background color, line/vertices color etc.
  Jmol.script(jsmol_obj,'background black; color cpk; spacefill OFF;set ambientPercent 45; wireframe 0.08;set showHydrogens FALSE');
  //draw polygons
  Jmol.script(jsmol_obj,'\
    draw ID f1 polygon [@30 @29 @35 @42 @43 @44 @36];\
    draw ID f2 polygon [@29 @39 @41 @40 @30];\
    draw ID f3 polygon [@30 @29 @28 @27 @7 @8];\
    draw ID f4 polygon [@5 @6 @7 @8 @9 @10];\
    draw ID f5 polygon [@2 @1 @6 @5];\
    draw ID f6 polygon [@2 @3 @4 @5];\
    draw ID f7 polygon [@2 @22 @10 @5];\
    color $f1 gray;\
    color $f2 gray;\
    color $f3 gray;\
    color $f4 gray;\
    color $f5 gray;\
    color $f6 gray;\
    color $f7 gray;\
    ');
}
