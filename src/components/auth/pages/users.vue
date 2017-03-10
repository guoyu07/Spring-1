<!-- <template>
  <div class="users">
    <div class="content" id="js-drop-zone">

      <div class="message intro">
        <div class="note">
          Drop BPMN diagram from your desktop or <a id="js-create-diagram" href>create a new diagram</a> to get started.
        </div>
      </div>

      <div class="message error">
        <div class="note">
          <p>Ooops, we could not display the BPMN 2.0 diagram.</p>

          <div class="details">
            <span>cause of the problem</span>
            <pre></pre>
          </div>
        </div>
      </div>

      <div class="canvas" id="js-canvas"></div>
      <div id="js-properties-panel"></div>
    </div>

    <ul class="buttons">
      <li>
        download
      </li>
      <li>
        <a id="js-download-diagram" href title="download BPMN diagram">
          BPMN diagram
        </a>
      </li>
      <li>
        <a id="js-download-svg" href title="download as SVG image">
          SVG image
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
var fs = require('fs')
var path = require('path')

var $ = require('jquery')
var BpmnModeler = require('bpmn-js/lib/Modeler')

var propertiesPanelModule = require('bpmn-js-properties-panel')
var propertiesProviderModule = require('bpmn-js-properties-panel/lib/provider/camunda')
var camundaModdleDescriptor = require('camunda-bpmn-moddle/resources/camunda.json')

var container = $('#js-drop-zone')

var canvas = $('#js-canvas')

var bpmnModeler = new BpmnModeler({
  container: canvas,
  propertiesPanel: {
    parent: '#js-properties-panel'
  },
  additionalModules: [
    propertiesPanelModule,
    propertiesProviderModule
  ],
  moddleExtensions: {
    camunda: camundaModdleDescriptor
  }
})

var newDiagramXML = fs.readFileSync(path.join(__dirname, '/../resources/newDiagram.bpmn'))

function createNewDiagram () {
  openDiagram(newDiagramXML)
}

function openDiagram (xml) {
  bpmnModeler.importXML(xml, function (err) {
    if (err) {
      container
        .removeClass('with-diagram')
        .addClass('with-error')

      container.find('.error pre').text(err.message)

      console.log(err)
    } else {
      container
        .removeClass('with-error')
        .addClass('with-diagram')
    }
  })
}

function saveSVG (done) {
  bpmnModeler.saveSVG(done)
}

function saveDiagram (done) {
  bpmnModeler.saveXML({ format: true }, function (err, xml) {
    done(err, xml)
  })
}

function registerFileDrop (container, callback) {
  function handleFileSelect (e) {
    e.stopPropagation()
    e.preventDefault()

    var files = e.dataTransfer.files

    var file = files[0]

    var FileReader = window.FileReader
    var reader = new FileReader()

    reader.onload = function (e) {
      var xml = e.target.result

      callback(xml)
    }

    reader.readAsText(file)
  }

  function handleDragOver (e) {
    e.stopPropagation()
    e.preventDefault()

    e.dataTransfer.dropEffect = 'copy' // Explicitly show this is a copy.
  }

  container.get(0).addEventListener('dragover', handleDragOver, false)
  container.get(0).addEventListener('drop', handleFileSelect, false)
}

// check file api availability
if (!window.FileList || !window.FileReader) {
  window.alert(
    'Looks like you use an older browser that does not support drag and drop. ' +
    'Try using Chrome, Firefox or the Internet Explorer > 10.')
} else {
  registerFileDrop(container, openDiagram)
}

// bootstrap diagram functions

$(document).on('ready', function () {
  $('#js-create-diagram').click(function (e) {
    e.stopPropagation()
    e.preventDefault()

    createNewDiagram()
  })

  var downloadLink = $('#js-download-diagram')
  var downloadSvgLink = $('#js-download-svg')

  $('.buttons a').click(function (e) {
    if (!$(this).is('.active')) {
      e.preventDefault()
      e.stopPropagation()
    }
  })

  function setEncoded (link, name, data) {
    var encodedData = encodeURIComponent(data)

    if (data) {
      link.addClass('active').attr({
        'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
        'download': name
      })
    } else {
      link.removeClass('active')
    }
  }

  var debounce = require('lodash/fp/debounce')

  var exportArtifacts = debounce(function () {
    saveSVG(function (err, svg) {
      setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg)
    })

    saveDiagram(function (err, xml) {
      setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml)
    })
  }, 500)

  bpmnModeler.on('commandStack.changed', exportArtifacts)
})
</script>

<style>
* {
  box-sizing: border-box;
}

body, html {

  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;

  font-size: 12px;

  height: 100%;
  padding: 0;
  margin: 0;
}

a:link {
  text-decoration: none;
}

.content,
.content > div {
  width: 100%;
  height: 100%;
  position: relative;
}

.content > .message {
  text-align: center;
  display: table;

  font-size: 16px;
  color: #111;
}

.content > .message .note {
  vertical-align: middle;
  text-align: center;
  display: table-cell;
}

.content .error .details {
  max-width: 500px;
  font-size: 12px;
  margin: 20px auto;
  text-align: left;
}

.content .error pre {
  border: solid 1px #CCC;
  background: #EEE;
  padding: 10px;
}

.content:not(.with-error) .error,
.content.with-error .intro,
.content.with-diagram .intro {
  display: none;
}


.content .canvas,
.content.with-error .canvas {
  visibility: hidden;
}

.content.with-diagram .canvas {
  visibility: visible;
}

.buttons {
  position: fixed;
  bottom: 20px;
  left: 20px;

  padding: 0;
  margin: 0;
  list-style: none;
}

.buttons > li {
  display: inline-block;
  margin-right: 10px;
}
.buttons > li > a {
  background: #DDD;
  border: solid 1px #666;
  display: inline-block;
  padding: 5px;
}

.buttons a {
  opacity: 0.3;
}

.buttons a.active {
  opacity: 1.0;
}
/**
 * outline styles
 */

.djs-outline {
  fill: none;
  visibility: hidden;
}

.djs-element.hover .djs-outline,
.djs-element.selected .djs-outline {
  visibility: visible;
  shape-rendering: crispEdges;
  stroke-dasharray: 3,3;
}

.djs-element.selected .djs-outline {
  stroke: #8888FF;
  stroke-width: 1px;
}

.djs-element.hover .djs-outline {
  stroke: #FF8888;
  stroke-width: 1px;
}

.djs-shape.connect-ok .djs-visual > :nth-child(1) {
  fill: #DCFECC /* light-green */ !important;
}

.djs-shape.connect-not-ok .djs-visual > :nth-child(1),
.djs-shape.drop-not-ok .djs-visual > :nth-child(1) {
  fill: #f9dee5 /* light-red */ !important;
}

.djs-shape.new-parent .djs-visual > :nth-child(1) {
  fill: #F7F9FF !important;
}

svg.drop-not-ok {
  background: #f9dee5 /* light-red */ !important;
}

svg.new-parent {
  background: #F7F9FF /* light-blue */ !important;
}

.djs-connection.connect-ok .djs-visual > :nth-child(1),
.djs-connection.drop-ok .djs-visual > :nth-child(1) {
  stroke: #90DD5F /* light-green */ !important;
}

.djs-connection.connect-not-ok .djs-visual > :nth-child(1),
.djs-connection.drop-not-ok .djs-visual > :nth-child(1) {
  stroke: #E56283 /* light-red */ !important;
}

.drop-not-ok,
.connect-not-ok {
  cursor: not-allowed;
}

.djs-element.attach-ok .djs-visual > :nth-child(1) {
  stroke-width: 5px !important;
  stroke: rgba(255, 116, 0, 0.7) !important;
}


/**
* Selection box style
*
*/
.djs-lasso-overlay {
  fill: rgb(255, 116, 0);
  fill-opacity: 0.1;

  stroke-dasharray: 5 1 3 1;
  stroke: rgb(255, 116, 0);

  shape-rendering: crispEdges;
  pointer-events: none;
}

/**
 * Resize styles
 */
.djs-resize-overlay {
  fill: none;

  stroke-dasharray: 5 1 3 1;
  stroke: rgb(255, 116, 0);

  pointer-events: none;
}

.djs-resizer-hit {
  fill: none;
  pointer-events: all;
}

.djs-resizer-visual {
  fill: white;
  stroke-width: 1px;
  stroke: black;
  shape-rendering: crispEdges;
  stroke-opacity: 0.2;
}

.djs-cursor-resize-nwse,
.djs-resizer-nw,
.djs-resizer-se {
  cursor: nwse-resize;
}

.djs-cursor-resize-nesw,
.djs-resizer-ne,
.djs-resizer-sw {
  cursor: nesw-resize;
}

.djs-shape.djs-resizing > .djs-outline {
  visibility: hidden !important;
}

.djs-shape.djs-resizing > .djs-resizer {
  visibility: hidden;
}

.djs-dragger > .djs-resizer {
  visibility: hidden;
}

/**
 * drag styles
 */
.djs-dragger .djs-visual circle,
.djs-dragger .djs-visual path,
.djs-dragger .djs-visual polygon,
.djs-dragger .djs-visual polyline,
.djs-dragger .djs-visual rect,
.djs-dragger .djs-visual text {
  fill: none !important;
  stroke: rgb(255, 116, 0) !important;
}

.djs-dragging {
  opacity: 0.3;
}

.djs-dragging,
.djs-dragging > * {
  pointer-events: none !important;
}

.djs-dragging .djs-context-pad,
.djs-dragging .djs-outline {
  display: none !important;
}

/**
 * no pointer events for visual
 */
.djs-visual,
.djs-outline {
  pointer-events: none;
}

/**
 * all pointer events for hit shape
 */
.djs-shape .djs-hit {
  pointer-events: all;
}

.djs-connection .djs-hit {
  pointer-events: stroke;
}

/**
 * shape / connection basic styles
 */
.djs-connection .djs-visual {
  stroke-width: 2px;
  fill: none;
}

.djs-cursor-grab {
  cursor: -webkit-grab;
  cursor: -moz-grab;
  cursor: grab;
}

.djs-cursor-grabbing {
  cursor: -webkit-grabbing;
  cursor: -moz-grabbing;
  cursor: grabbing;
}

.djs-cursor-crosshair {
  cursor: crosshair;
}

.djs-cursor-move {
  cursor: move;
}

.djs-cursor-resize-ns {
  cursor: ns-resize;
}

.djs-cursor-resize-ew {
  cursor: ew-resize;
}


/**
 * snapping
 */
.djs-snap-line {
  stroke: rgb(255, 195, 66);
  stroke: rgba(255, 195, 66, 0.50);
  stroke-linecap: round;
  stroke-width: 2px;
  pointer-events: none;
}

/**
 * snapping
 */
.djs-crosshair {
  stroke: #555;
  stroke-linecap: round;
  stroke-width: 1px;
  pointer-events: none;
  shape-rendering: crispEdges;
  stroke-dasharray: 5, 5;
}

/**
 * palette
 */

.djs-palette {
  position: absolute;
  left: 20px;
  top: 20px;

  width: 46px;
}

.djs-container.two-column .djs-palette.open {
  width: 94px;
}

.djs-palette .separator {
  margin: 3px 5px 5px 5px;
  border: none;
  border-top: solid 1px #DDD;

  clear: both;
}

.djs-palette .entry:before {
  vertical-align: middle;
}

.djs-palette .djs-palette-toggle {
  cursor: pointer;
}

.djs-palette .entry,
.djs-palette .djs-palette-toggle {
  color: #333;
  font-size: 30px;

  text-align: center;
}

.djs-palette .entry {
  float: left;
}

.djs-palette .entry img {
  max-width: 100%;
}

.djs-palette.open .djs-palette-toggle {
  height: 10px;
}

.djs-palette .djs-palette-entries:after {
  content: '';
  display: table;
  clear: both;
}

.djs-palette:not(.open) .djs-palette-entries {
  display: none;
}

.djs-palette .djs-palette-toggle:hover {
  background: #666;
}

.djs-palette .entry:hover {
  color: rgb(255, 116, 0);
}

.highlighted-entry {
  color: rgb(255, 116, 0) !important;
}

.djs-palette:not(.open) {
  overflow: hidden;
}

.djs-palette .entry,
.djs-palette .djs-palette-toggle {
  width: 46px;
  height: 46px;
  line-height: 46px;
  cursor: default;
}

.djs-palette.open .djs-palette-toggle {
  width: 100%;
}

/**
 * context-pad
 */
.djs-overlay-context-pad {
  width: 72px;
}

.djs-context-pad {
  position: absolute;
  display: none;
  pointer-events: none;
}

.djs-context-pad .entry {
  width: 22px;
  height: 22px;
  text-align: center;
  display: inline-block;
  font-size: 22px;
  margin: 0 2px 2px 0;

  border-radius: 3px;

  cursor: default;

  background-color: #FEFEFE;
  box-shadow: 0 0 2px 1px #FEFEFE;

  pointer-events: all;
}

.djs-context-pad .entry:before {
  vertical-align: top;
}

.djs-context-pad .entry:hover {
  background: rgb(255, 252, 176);
}

.djs-context-pad.open {
  display: block;
}

/**
 * popup styles
 */
.djs-popup .entry {
  line-height: 20px;
  white-space: nowrap;
  border: solid 1px transparent;
  cursor: default;
}

/* larger font for prefixed icons */
.djs-popup .entry:before {
  vertical-align: middle;
  font-size: 20px;
}

.djs-popup .entry > span {
  vertical-align: middle;
  font-size: 14px;
}

.djs-popup .entry:hover,
.djs-popup .entry.active:hover {
  background: rgb(255, 252, 176);
}

.djs-popup .entry.disabled {
  background: inherit;
}

.djs-popup .entry.active {
  color: rgb(255, 116, 0);
  border: solid 1px rgb(255, 116, 0);
  border-radius: 3px;
  background-color: #F6F6F6;
}

.djs-popup-body .entry {
  padding: 2px 10px 2px 5px;
}

.djs-popup-header .entry {
  display: inline-block;
  padding: 2px 3px 2px 3px;
}

.djs-popup-body .entry > span {
  margin-left: 5px;
}

.djs-popup-body {
  background-color: #FEFEFE;
}

.djs-popup-header {
  border-bottom: 1px solid #DDD;
}

.djs-popup-header .entry {
  margin: 1px;
  margin-left: 3px;
}

.djs-popup-header .entry:last-child {
  margin-right: 3px;
}

/**
 * popup / palette styles
 */
.djs-popup, .djs-palette {
  background: #FAFAFA;
  border: solid 1px #CCC;
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

/**
 * touch
 */

.djs-shape,
.djs-connection {
  touch-action: none;
}

.djs-segment-dragger,
.djs-bendpoint {
  display: none;
}

/**
 * bendpoints
 */
.djs-segment-dragger .djs-visual {
  fill: rgba(255, 255, 121, 0.2);
  stroke-width: 1px;
  stroke-opacity: 1;
  stroke: rgba(255, 255, 121, 0.3);
}

.djs-bendpoint .djs-visual {
  fill: rgba(255, 255, 121, 0.8);
  stroke-width: 1px;
  stroke-opacity: 0.5;
  stroke: black;
}

.djs-segment-dragger:hover,
.djs-bendpoints.hover .djs-segment-dragger,
.djs-bendpoints.selected .djs-segment-dragger,
.djs-bendpoint:hover,
.djs-bendpoints.hover .djs-bendpoint,
.djs-bendpoints.selected .djs-bendpoint {
  display: block;
}

.djs-drag-active .djs-bendpoints * {
  display: none;
}

.djs-bendpoints:not(.hover) .floating {
  display: none;
}

.djs-segment-dragger:hover .djs-visual,
.djs-segment-dragger.djs-dragging .djs-visual,
.djs-bendpoint:hover .djs-visual,
.djs-bendpoint.floating .djs-visual {
  fill: yellow;
  stroke-opacity: 0.5;
  stroke: black;
}

.djs-bendpoint.floating .djs-hit {
  pointer-events: none;
}

.djs-segment-dragger .djs-hit,
.djs-bendpoint .djs-hit {
  pointer-events: all;
  fill: none;
}

.djs-segment-dragger.horizontal .djs-hit {
  cursor: ns-resize;
}

.djs-segment-dragger.vertical .djs-hit {
  cursor: ew-resize;
}

.djs-segment-dragger.djs-dragging .djs-hit {
  pointer-events: none;
}

.djs-updating,
.djs-updating > * {
  pointer-events: none !important;
}

.djs-updating .djs-context-pad,
.djs-updating .djs-outline,
.djs-updating .djs-bendpoint,
.connect-ok .djs-bendpoint,
.connect-not-ok .djs-bendpoint,
.drop-ok .djs-bendpoint,
.drop-not-ok .djs-bendpoint {
  display: none !important;
}

.djs-segment-dragger.djs-dragging,
.djs-bendpoint.djs-dragging {
  display: block;
  opacity: 1.0;
}

.djs-segment-dragger.djs-dragging .djs-visual,
.djs-bendpoint.djs-dragging .djs-visual {
  fill: yellow;
  stroke-opacity: 0.5;
}


/**
 * tooltips
 */
.djs-tooltip-error {
  font-size: 11px;
  line-height: 18px;
  text-align: left;

  padding: 5px;

  opacity: 0.7;
}

.djs-tooltip-error > * {
  width: 160px;

  background: rgb(252, 236, 240);
  color: rgb(158, 76, 76);
  padding: 3px 7px;
  box-shadow: 0 1px 2px rgba(0,0,0, 0.2);
  border-radius: 5px;
  border-left: solid 5px rgb(174, 73, 73);
}

.djs-tooltip-error:hover {
  opacity: 1;
}


/**
 * search pad
 */
.djs-search-container {
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;

  width: 25%;
  min-width: 300px;
  max-width: 400px;
  z-index: 10;

  font-size: 1.05em;
  opacity: 0.9;
  background: #FAFAFA;
  border: solid 1px #CCC;
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.djs-search-container:not(.open) {
  display: none;
}

.djs-search-input input {
  font-size: 1.05em;
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #ccc;
}

.djs-search-input input:focus{
  outline: none;
  border-color: #52B415;
  box-shadow: 0 0 1px 2px rgba(82, 180, 21, 0.2);
}

.djs-search-results {
  position: relative;
  overflow-y: auto;
  max-height: 200px;
}

.djs-search-results:hover {
  /*background: #fffdd7;*/
  cursor: pointer;
}

.djs-search-result {
  width: 100%;
  padding: 6px 10px;
  background: white;
  border-bottom: solid 1px #AAA;
  border-radius: 1px;
}

.djs-search-highlight {
  color: black;
}

.djs-search-result-primary {
  margin: 0 0 10px;
}

.djs-search-result-secondary {
  font-family: monospace;
  margin: 0;
}

.djs-search-result:hover {
  background: #fdffd6;
}

.djs-search-result-selected {
  background: #fffcb0;
}

.djs-search-result-selected:hover {
  background: #f7f388;
}

.djs-search-overlay {
  background: yellow;
  opacity: 0.3;
}

</style> -->