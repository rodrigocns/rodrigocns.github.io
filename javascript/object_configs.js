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
  frank off;",
  //unbind _popupMenu;\ //comment out pra testes (CRIAR SWITCH COM MODO DEBUG!)
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
//remove/add bond between selected atoms
// select C4 C5; connect (selected) DELETE;

var Info_reference = structuredClone(Info_interactive);
//disable rotation at 0. default is 1
Info_reference.script = Info_interactive.script.concat("set mouseDragFactor 0");

//target orientation
//ex.: moveto 0 QUATERNION {-0.4902575975335792 -0.2825336376897219 -0.45539483504230244 0.6873410913449087}
// 'moveTo 0 QUATERNION {0.6249 -0.0366 -0.6990 -0.3458}' e 'moveto 0.0 {-666 39 745 139.54}' são equivalentes.

// List of interactive task names the subject will perform 
const task_list = [
  "Line","LineMirror",
  "Segments","SegmentsMirror",
  "Perimeter","PerimeterMirror",
  "Faces","FacesMirror",
  "bolaBastao_c","poligonFill","mrt"
];

function prepMolecule(num) {   //mapper para o preparo do teste que está acontecendo
  // SE PULAR CASES VAI DAR ERRO! task_list.length e quantidade de cases precisa ser igual!
  jsmol_ref = jsmolReferenceObject; //janela esquerda
  jsmol_obj = jsmolInteractiveObject; //janela direita
  //em cada case # estão as chamadas das funções de renderização dos objetos
  // e suas orientações para cada tarefa
  switch (num){
    case 0:
      buildLin(jsmol_ref);
      buildLin(jsmol_obj);
      Jmol.script(jsmol_ref, 'moveTo 0 quaternion {0.4590 0.4866 -0.4611 -0.5831}');
      Jmol.script(jsmol_obj, 'moveTo 0 quaternion {0.7910  0.3605  0.4065  0.2812}');
    break;
    case 1:
      buildLin(jsmol_ref);
      buildLinMirror(jsmol_obj);
      Jmol.script(jsmol_ref, 'moveTo 0 quaternion {0.4590 0.4866 -0.4611 -0.5831}');
      Jmol.script(jsmol_obj, 'moveTo 0 quaternion {0.6945 -0.1174 0.6696 -0.2358}');
    break;
    case 2:
      buildSeg(jsmol_ref);
      buildSeg(jsmol_obj);
      Jmol.script(jsmol_ref, 'moveTo 0 quaternion {-0.6583 -0.1168 0.2756 0.6907}');
      Jmol.script(jsmol_obj, 'moveTo 0 quaternion {-0.2508 -0.4495 0.7128 -0.4764}');
    break;
    case 3:
      buildSeg(jsmol_ref);
      buildSegMirror(jsmol_obj);
      Jmol.script(jsmol_ref, 'moveTo 0 quaternion {-0.6583 -0.1168 0.2756 0.6907}');
      Jmol.script(jsmol_obj, 'moveTo 0 quaternion {0.6769 0.0808 0.5685 -0.4606}');
    break;
    case 4:
      buildPer(jsmol_ref);
      buildPer(jsmol_obj);
      Jmol.script(jsmol_ref, 'moveTo 0 quaternion {-0.0471 0.7526 -0.6326 -0.1769}');
      Jmol.script(jsmol_obj, 'moveTo 0 quaternion {0.6832 -0.0267 -0.5950 -0.4224}');
    break;
    case 5:
      buildPer(jsmol_ref);
      buildPerMirror(jsmol_obj);
      Jmol.script(jsmol_ref, 'moveTo 0 quaternion {-0.0471 0.7526 -0.6326 -0.1769}');
      Jmol.script(jsmol_obj, 'moveTo 0 quaternion {-0.6045 0.4107 0.6822 0.0227}');
    break;
    case 6:
      buildFac(jsmol_ref);
      buildFac(jsmol_obj);
      Jmol.script(jsmol_ref, 'moveTo 0 quaternion {0.3939 0.1734 -0.5907 0.6825}');
      Jmol.script(jsmol_obj, 'moveTo 0 quaternion {-0.4412 0.5134 0.1199 0.7262}');
    break;
    case 7:
      buildFac(jsmol_ref);
      buildFacMirror(jsmol_obj);
      Jmol.script(jsmol_ref, 'moveTo 0 quaternion {0.3939 0.1734 -0.5907 0.6825}');
      Jmol.script(jsmol_obj, 'moveTo 0 quaternion {0.7034 -0.1115 -0.6420 0.2840}');
    break;
    case 8: 
      //cor interativa
      buildBallStickMol(jsmol_ref);
      buildBallStickMol(jsmol_obj);
      Jmol.script(jsmol_ref,'color cpk; spacefill 23%; wireframe 0.15');
      Jmol.script(jsmol_obj,'color cpk; spacefill 23%; wireframe 0.15');
      Jmol.script(jsmol_ref,'moveto 0 QUATERNION {-0.4903 -0.2825 -0.4554 0.6873}');
      Jmol.script(jsmol_obj,'moveTo 0 QUATERNION {0.6249 -0.0366 -0.6990 -0.3458}');
    break;
    case 9: 
      //cor polyfill interativa
      buildPoligonFilledMol(jsmol_obj);
      buildPoligonFilledMol(jsmol_ref);
      Jmol.script(jsmol_ref,'color cpk; spacefill off; wireframe 0.08');
      Jmol.script(jsmol_obj,'color cpk; spacefill off; wireframe 0.08');
      Jmol.script(jsmol_ref,'moveto 0 QUATERNION {-0.4903 -0.2825 -0.4554 0.6873}');
      Jmol.script(jsmol_obj,'moveTo 0 QUATERNION {0.6249 -0.0366 -0.6990 -0.3458}');
    break;
    case 10: 
      //mrt polycubes
      buildMRTModel(jsmol_ref);
      buildMRTModel(jsmol_obj);
      Jmol.script(jsmol_ref,'moveto 0 QUATERNION {0.2992,0.2237,-0.1030,0.9219}');
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

function buildLin(jsmol_obj) {
  Jmol.script(jsmol_obj, 'load models/PrePos_line.xyz');
  Jmol.script(jsmol_obj, 'background black; color cpk; spacefill OFF; set ambientPercent 45; wireframe 0.15')
  Jmol.script(jsmol_obj, 'select C4, C5, C12, C11, C15; connect (selected) DELETE;' );
}
function buildLinMirror(jsmol_obj) {
  Jmol.script(jsmol_obj, 'load models/PrePos_line_mirror.xyz');
  Jmol.script(jsmol_obj, 'background black; color cpk; spacefill OFF; set ambientPercent 45; wireframe 0.15')
  Jmol.script(jsmol_obj, 'select C4, C5, C12, C11, C15; connect (selected) DELETE;' );
  Jmol.script(jsmol_obj, 'moveTo 0 quaternion {0.7910  0.3605  0.4065  0.2812}');
}
function buildSeg(jsmol_obj) {
  Jmol.script(jsmol_obj, 'load models/PrePos_segments.xyz');
  Jmol.script(jsmol_obj, 'background black; color cpk; spacefill OFF; set ambientPercent 45; wireframe 0.15')
  Jmol.script(jsmol_obj, 'moveTo 0 quaternion {0.7910  0.3605  0.4065  0.2812}');
}
function buildSegMirror(jsmol_obj) {
  Jmol.script(jsmol_obj, 'load models/PrePos_segments_mirror.xyz');
  Jmol.script(jsmol_obj, 'background black; color cpk; spacefill OFF; set ambientPercent 45; wireframe 0.15')
  Jmol.script(jsmol_obj, 'moveTo 0 quaternion {0.7910  0.3605  0.4065  0.2812}');
}
function buildPer(jsmol_obj) {
  Jmol.script(jsmol_obj, 'load models/PrePos_perimeter.xyz');
  Jmol.script(jsmol_obj, 'background black; color cpk; spacefill OFF; set ambientPercent 45; wireframe 0.15')
  Jmol.script(jsmol_obj, 'select C4, C5; connect (selected) DELETE;' );
  Jmol.script(jsmol_obj, 'select C12, C11; connect (selected) DELETE;' );
  Jmol.script(jsmol_obj, 'moveTo 0 quaternion {0.7910  0.3605  0.4065  0.2812}');
}
function buildPerMirror(jsmol_obj) {
  Jmol.script(jsmol_obj, 'load models/PrePos_perimeter_mirror.xyz');
  Jmol.script(jsmol_obj, 'background black; color cpk; spacefill OFF; set ambientPercent 45; wireframe 0.15')
  Jmol.script(jsmol_obj, 'select C4, C5; connect (selected) DELETE;' );
  Jmol.script(jsmol_obj, 'select C12, C11; connect (selected) DELETE;' );
  Jmol.script(jsmol_obj, 'moveTo 0 quaternion {0.7910  0.3605  0.4065  0.2812}');
}
function buildFac(jsmol_obj) {
  Jmol.script(jsmol_obj, 'load models/PrePos_faces.xyz');
  Jmol.script(jsmol_obj, 'background black; color cpk; spacefill OFF; set ambientPercent 45; wireframe 0.15')
  Jmol.script(jsmol_obj, 'moveTo 0 quaternion {0.7910  0.3605  0.4065  0.2812}');
}
function buildFacMirror(jsmol_obj) {
  Jmol.script(jsmol_obj, 'load models/PrePos_faces_mirror.xyz');
  Jmol.script(jsmol_obj, 'background black; color cpk; spacefill OFF; set ambientPercent 45; wireframe 0.15')
  Jmol.script(jsmol_obj, 'moveTo 0 quaternion {0.7910  0.3605  0.4065  0.2812}');
}