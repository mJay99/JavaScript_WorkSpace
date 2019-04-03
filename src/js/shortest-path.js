function Graph() {
  var connectedStations = this.connectedStations = {}; // Key = source station, value = array of directly connected stations.

  this.addLines = function(u, v) {
     if (connectedStations[u] === undefined) { // Add the edge u -> v.
        connectedStations[u] = [];
     }
     connectedStations[u].push(v);
     if (connectedStations[v] === undefined) {
        connectedStations[v] = [];
     }
     connectedStations[v].push(u);
  };

  return this;
}

function bfs(graph, source, dest) { // calculates shortest distance between source and destination stations.
  var queue = [{
        vertex: source,
        count: 0
     }],
     visited = {
        source: true
     },
     node = 0;
  while (node < queue.length) {
     var u = queue[node].vertex,
        count = queue[node++].count;
     if (dest == u) {
        printOnScreen('Shortest distance from ' + source + ' to ' + u + ': ' + count);
     }

     graph.connectedStations[u].forEach(function(v) {
        if (!visited[v]) {
           visited[v] = true;
           queue.push({
              vertex: v,
              count: count + 1
           });
        }
     });
  }
}

function shortestPath(graph, source, target) { //  finds all the  stations from source to destination. 

  var queue = [source],
     visited = {
        source: true
     },
     predecessor = {},
     node = 0;
  while (node < queue.length) {
     var u = queue[node++],
        connectedStations = graph.connectedStations[u];
     for (var i = 0; i < connectedStations.length; ++i) {
        var v = connectedStations[i];
        if (visited[v]) {
           continue;
        }
        visited[v] = true;
        if (v === target) { // Check if the path is complete.
           var path = [v]; // If path is completed, backtrack through the path.
           while (u !== source) {
              path.push(u);
              u = predecessor[u];
           }
           path.push(u);
           path.reverse();
           printOnScreen('Full Path :\n<br>')
           printOnScreen(path.join(' &rarrtl; ')); // displays full path consist of all the station from source to destination. 
           return;
        }
        predecessor[v] = u;
        queue.push(v);
     }
  }
  window.alert('There is no path from ' + source + ' to ' + target);
}

function printOnScreen(msg) {
  msg = msg || '';
  var output = document.getElementById('display');
  output.innerHTML += msg + '<br>';

}

const graph = new Graph(); // create instance of graph.
const metroData = {}; //data object for storing raw text data from metroData.txt file.
var submit = document.getElementById("submit");
submit.disabled = true;
var selectSource = document.getElementById("selectSource");
var selectDest = document.getElementById("selectDest");

function readFile() {

  var file = document.querySelector('input[type=file]').files[0];
  var reader = new FileReader();
  var textFile = /text.*/;

  if (file.type.match(textFile)) {
     reader.onload = function(event) {
        const metroLines = String(event.target.result).split('\n'); //reading lines from text file 

        for (let index = 0; index < metroLines.length; index++) {
           const line = metroLines[index]
           const sNode = String(line).split(':').shift(); //extracting source stations.
           const dNodes = String(line).split(':').pop(); //extracting directly connected stations to source stations.
           const dNodeList = dNodes.split(','); //generating array of directly connected stations.
           metroData[sNode] = dNodeList; //generating adjecency list.
        }

        var options = Object.keys(metroData); //generated options data for select stations fropdowns.

        for (var i = 0; i < options.length; i++) {
           var opt = options[i];
           var el = document.createElement("option");
           var el2 = document.createElement("option");

           el.textContent = el2.textContent = opt;
           el.value = el2.value = opt;
           selectSource.appendChild(el); //generating select dropdown options for source select.
           selectDest.appendChild(el2); //generating select dropdown options for dest select.

        }

        for (const [source, drnodes] of Object.entries(metroData)) {
           for (let index = 0; index < drnodes.length; index++) {
              graph.addLines(source, drnodes[index]); // generating graph from adjecency list.
           }
        }

     }
  }

  reader.readAsBinaryString(file);
}

function getSource() { //for selecting source station                    

  if (selectSource.selectedIndex !== 0 && selectDest.value !== undefined) {
     clearOutput();
     if (selectDest.value !== selectSource.value) {
        submit.disabled = false;

     } else {
        window.alert('Source station and destination station cannot be same.')
        selectSource.value = '';
        selectSource.selectedIndex = 0;
        clearOutput();
     }
  }
}

function getDest() { //for selecting dest station    
  if (selectDest.selectedIndex !== 0 && selectSource.value !== undefined) {
     clearOutput();
     if (selectDest.value !== selectSource.value) {
        submit.disabled = false;
     } else {
        window.alert('Source station and destination station cannot be same.')
        selectDest.value = '';
        selectDest.selectedIndex = 0;
        clearOutput();

     }
  }
}

function findShortPath() { //finally calculating and displying shortest path. 
  if (selectSource.selectedIndex !== 0 && selectDest.selectedIndex !== 0) {
     bfs(graph, selectSource.value, selectDest.value);
     printOnScreen();
     shortestPath(graph, selectSource.value, selectDest.value);
     printOnScreen();
  } else {
     window.alert('Please select a valid station from the list.');
  }
}

function clearOutput() {
  document.getElementById('display').innerHTML = "";
}
