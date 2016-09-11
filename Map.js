class Map {
    constructor(width, height, tilesize, design) {
        // POSITIONS ARE (Y, X) / (ROW, COL)
        
        this.width = width;
        this.height = height;
        this.tilesize = tilesize;
        
        this.tiles = [];
        
        if(!design) {
            this.destinationTilePos = [3, 3];
            for(let row = 0; row < this.height; row++) {
                this.tiles.push([]);    
                for(let col = 0; col < this.width; col++) {
                    if(row === this.destinationTilePos[0] && col === this.destinationTilePos[1]) {
                        this.tiles[row][col] = new Tile(row, col, this.tilesize, 'destination');
                    } else {                                    
                        this.tiles[row][col] = new Tile(row, col, this.tilesize);                    
                    }
                }
            }
        } else {
            for(let row = 0; row < design.length; row++) {
                this.tiles.push([]);
                for(let col = 0; col < design[row].length; col++) {
                    let tileType = design[row][col];
                    switch(tileType) {
                        case "X":
                            this.tiles[row][col] = new Tile(row, col, this.tilesize, 'wall');
                            break;
                        case '.':
                            this.tiles[row][col] = new Tile(row, col, this.tilesize);
                            break;
                        case 'D':
                            this.destinationTilePos = [row, col];
                            this.tiles[row][col] = new Tile(row, col, this.tilesize, 'destination');
                            break;
                    }
                }
            }
        }
        this.createGridPaths();
    }
    
//    createMapLayout(des) {
//        for(let t of des) {
//            let tileA = t[0],
//                tileB = t[1];
//            
//            tileA.addOccupier('wall');
//            tileB.addOccupier('wall');
//        }
//    }
    
    getGridPos(y, x, offY, offX) {
        offY = offY || 0;        
        offX = offX || 0;

        return [Math.floor( (y - (offY) / this.tilesize)), Math.floor( (x - (offX) / game.map.tilesize))];
    }
    
    getTileByGridPos(tY, tX) {
        try {
            return this.tiles[tY][tX];
        } catch(e) {
            return undefined;
        }
    }
    
    setDestinationPoint(row, col) {
        this.tiles[this.destinationTilePos[0]][this.destinationTilePos[1]].clearOccupiers();
        this.destinationTilePos = [row, col];
        this.tiles[row][col].addOccupier('destination');
    }
    
    createGridPaths() {
        let frontier = [];
        frontier.push(this.destinationTilePos);
        let came_from = {};
        came_from[this.destinationTilePos] = false;
        
        while(frontier.length > 0) {
            let curr = frontier.shift();
            for(let next of this.getNeighbors(...curr)) {
                if(!(next in came_from)) {
                    frontier.push(next);
                    came_from[next] = curr;
                }
            }
        }
        this.gridpaths = came_from;
    }
    
    getNeighbors(tY, tX) {
        let neighbors = [];
        for(let row in this.tiles) {
            for(let col in this.tiles[row]) {
                if( (Math.abs(tX - col) == 1 && Math.abs(tY - row) == 0) || (Math.abs(tX - col) == 0 && Math.abs(tY - row) === 1)) {
                    // == instead of === because row becomes a string (js implicit type conversion)
                    if((!this.tiles[row][col].occupied || this.tiles[row][col].occupiers[0] instanceof Spawner) && !(row == tY && col == tX) ) {
                        neighbors.push([row, col]);
                    }
                }
            }
        }
        return neighbors;
    }
    
    getAllUndefinedGridPaths() {
        let undefinedGridPaths = {};
        for(let row in this.tiles) {
            for(let tile of this.tiles[row]) {
                if(!tile.gridPos.toString() in this.gridpaths) {
                    undefinedGridPaths[tile.gridPos.toString()] = tile;
                }
            }
        }
        return undefinedGridPaths;
    }
    
    getAllSpawners() {
        let spawners = {};
        for(let row in this.tiles) {
            for(let tile of this.tiles[row]) {
                if(tile.occupiers[0] instanceof Spawner) {
                    spawners[tile.gridPos.toString()] = tile.occupiers[0];
                }
            }
        }
        return spawners;
    }
    
    getAllUnoccupied() {
       let unoccupied = {};
        for(let row in this.tiles) {
            for(let tile of this.tiles[row]) {
                if(!tile.occupied) {
                    spawners[tile.gridPos.toString()] = tile;
                }
            }
        }
        return unoccupied; 
    }
    
    getAllTowers() {
        let towers = {};
        for(let row in this.tiles) {
            for(let tile of this.tiles[row]) {
                if(tile.occupiers[1] instanceof Tower) {
                    towers[tile.gridPos.toString()] = tile.occupiers[1];
                }
            }
        }
        return towers;
    }
    
    getAllWalls() {
        let walls = {};
        for(let row in this.tiles) {
            for(let tile of this.tiles[row]) {
                if(tile.occupiers[0] instanceof Wall) {
                    walls[tile.gridPos.toString()] = tile.occupiers[0];
                }
            }
        }
        return walls;
    }
    
    display() {
        for(let row in this.tiles) {
            for(let col in this.tiles[row]) {
                let currTile = this.tiles[row][col];
                if(currTile.occupied) {
                    currTile.display();
                    currTile.update();
                } else {
                    if(this.gridpaths[currTile.gridPos] === undefined) {
                        fill('#9d9d8e');
                    } else {
                        fill('#CCBFB3');
                    }
                    rect(currTile.col * this.tilesize, currTile.row * this.tilesize, this.tilesize, this.tilesize);
                }
            }
        }
        
        
//        for(let i = 0; i < this.generatedLevel.length; i++) {
//            let tileA = this.generatedLevel[i][0],
//                tileB = this.generatedLevel[i][1];
//            line((tileA.col * this.tilesize) + (this.tilesize / 2), (tileA.row * this.tilesize) + (this.tilesize / 2), tileB.col * this.tilesize + (this.tilesize / 2), tileB.row * this.tilesize + (this.tilesize / 2));
//        }
//        for(let i = 0; i < this.longPath.length; i++) {
//            try {
//              let tileA = this.longPath[i],
//                  tileB = this.longPath[i + 1];
//             
//            } catch(e) {
//                
//            }
//            
//        }
        
//        for(let row in this.tiles) {
//            for(let col in this.tiles[row]) {
//                let currTile = this.tiles[row][col];
//                if(currTile.occupiers.length === 2) {
//                    fill(0, 0, 0, 100);
//                    let currTower = currTile.occupiers[1]
//                    ellipse(currTower.pos.x + (currTower.size.x / 2), currTower.pos.y + (currTower.size.y / 2), currTower.range, currTower.range);
//                }
//            }
//        }
    }
    
    clear() {
        for(let row = 0; row < this.height; row++) {  
            for(let col = 0; col < this.width; col++) {
                this.tiles[row][col].clearOccupiers();                  
            }
        }
        this.createGridPaths();
    }
    
    fillAllNonPathTiles(path) {
        let allTilesInPath = [];
        for(let pathItems of path) {
            allTilesInPath.push(pathItems[0], pathItems[1]);
        }
        
        for(let row in this.tiles) {
            for(let col of this.tiles[row]) {
                if(allTilesInPath.indexOf(col) === -1) {
                    col.addOccupier('wall');
                }
            }
        }
    }
    
    findPathEndings(path) {
        let tileReferences = {};
        for(let pathItems of path) {
            for(let pathItem of pathItems) {
                if(pathItem.gridPos.toString() in tileReferences) {
                   tileReferences[pathItem.gridPos.toString()] += 1; 
                } else {
                    tileReferences[pathItem.gridPos.toString()] = 1; 
                }
                
            }
        }
        let pathEndings = [];
        for(let tile of Object.keys(tileReferences)) {
            if(tileReferences[tile] > 1) {
                continue;
            }
            let tilePos = JSON.parse(`[${tile}]`);
            pathEndings.push(this.tiles[tilePos[0]][tilePos[1]]);
        }
        return pathEndings;
    }
    
    findPathSegments(path) {
        let pathEndings = this.findPathEndings(path);
        let allPaths = [];
        
        for(let pathEnding of pathEndings) {
            let checkPathEndings = pathEndings;
            checkPathEndings.splice(checkPathEndings.indexOf(pathEnding), 1);
            let curr = pathEnding;
            let p = [curr];
            while(checkPathEndings.indexOf(curr) === -1) {
                for(let pathItems of path) {
                    if(pathItems[0].gridPos.toString() === curr.gridPos.toString()) {
                        p.push(pathItems[1]);
                        curr = pathItems[1];
                    } else if(pathItems[1].gridPos.toString() === curr.gridPos.toString()) {
                        p.push(pathItems[0]);
                        curr = pathItems[0];
                    }
                }
            }
            allPaths.push(p);
        }
        return allPaths;
    }
    
    fillInPathGaps(pathSegment) {
        let newPath = pathSegment;
        let newPathParts = [];
        let prev_segment = pathSegment[0];
        for(let segment = 1; segment < pathSegment.length; segment++) {
            let prev_pos = prev_segment.gridPos,
                curr_pos = pathSegment[segment].gridPos;
            
            let xDiff = (prev_pos[1] - curr_pos[1]),
                yDiff = (prev_pos[0] - curr_pos[0]);
            
            let absxDiff = Math.abs(xDiff),
                absyDiff = Math.abs(yDiff);
            
            if(Math.abs(xDiff) + Math.abs(yDiff) > 1) 
            {
                if(absxDiff >= 1 && absyDiff >= 1) 
                {
                    if(absxDiff > 1 && absyDiff > 1) 
                    {
                        for(let i = 0; i < absxDiff; i++) 
                        {
                            newPathParts.push(this.tiles[curr_pos[0]][curr_pos[1] + ((i + 1) * ((xDiff > 0) ? 1 : -1))]);
                        }
                        
                        for(let i = 0; i < absyDiff; i++) 
                        {
                            newPathParts.push(this.tiles[curr_pos[0] + ((i + 1) * ((yDiff > 0) ? 1 : -1))][curr_pos[1] + ((absxDiff) * ((xDiff > 0) ? 1 : -1))]);
                        }
                    } 
                    else 
                    {
                        for(let i = 0; i < absxDiff; i++) 
                        {
                            newPathParts.push(this.tiles[curr_pos[0]][curr_pos[1] + ((i + 1) * ((xDiff > 0) ? 1 : -1))]);
                        }
                        for(let i = 0; i < absyDiff; i++) 
                        {
                            newPathParts.push(this.tiles[curr_pos[0] + ((i + 1) * ((yDiff > 0) ? 1 : -1))][curr_pos[1]]);
                        }
                    }
                } 
                else if(absxDiff > 1 && absyDiff < 1) 
                {
                    for(let i = 0; i < absxDiff; i++) 
                    {
                        newPathParts.push(this.tiles[curr_pos[0]][curr_pos[1] + ((i + 1) * ((xDiff > 0) ? 1 : -1))]);
                    }
                } 
                else if(absxDiff < 1 && absyDiff > 1) 
                {
                    for(let i = 0; i < absyDiff; i++) 
                    {
                        newPathParts.push(this.tiles[curr_pos[0] + ((i + 1) * ((yDiff > 0) ? 1 : -1))][curr_pos[1]]);
                    }
                }
            }
            prev_segment = pathSegment[segment];
        }
        Array.prototype.push.apply(newPath, newPathParts);
        return newPath;
    }
    
    addWallsAroundPath(pathSegment) {
        for(let tile of pathSegment) {
            let neighbors = [];
            for(let row in this.tiles) {
                for(let col in this.tiles[row]) {
                    if( (Math.abs(tile.col - col) == 1 && Math.abs(tile.row - row) == 0) || (Math.abs(tile.col - col) == 0 && Math.abs(tile.row - row) === 1)) {
                        if(pathSegment.indexOf(this.tiles[row][col]) === -1 && !(row == tile.row && col == tile.col) ) {
                            neighbors.push([row, col]);
                        }
                    }
                }
            }
            for(let neighbor of neighbors) {
                this.tiles[neighbor[0]][neighbor[1]].addOccupier('wall');
            }
        }
    }
    
    findIntersectingPaths(pathList) {
        let pathOverlaps = [];
        for(let path of pathList) {
            for(let tile of path) {
                for(let path2 of pathList) {
                    if(path2 !== path && path2.indexOf(tile) !== -1) {
                        pathOverlaps.push([path, path2]);
                        break;
                    }
                }
            }
        }
        return pathOverlaps;
    }
    
    getDelaunayTriangulation(roomsToHit) {
        let tileCenters = [];
        for(let room of roomsToHit) {
            let tile = game.map.tiles[room[0]][room[1]];
            tileCenters.push([tile.col * game.tilesize + (game.tilesize / 2), tile.row * game.tilesize + (game.tilesize / 2)]);
        }
        let triangulation = Delaunay.triangulate(tileCenters);
        return triangulation; 
    }
    
    doKruskalAlgorithm(vertices, edges) {
        let lastEdge = [];
        let dataset = new DisjointSet(vertices.length);
        let edgeDistance = [];
    
        for(let ind of edges) {
            let u = ind[0],
                v = ind[1];
            edgeDistance.push({edge: ind, weight: (Math.pow(vertices[u][0] - vertices[v][0], 2) + Math.pow(vertices[u][1] - vertices[v][1], 2))});
        }
        edgeDistance.sort((a, b) => { return a.weight - b.weight });
    
        for(let edge of edgeDistance) {
            let u = edge.edge[0],
                v = edge.edge[1];
            if(dataset.find(u) !== dataset.find(v)) {
                lastEdge.push([u, v]);
                dataset.union(u, v);
            }
        }
        return lastEdge;
    }
    // find path endings earlier in code
    chooseDestinationPoint(finalPath) {
        let numNeighbors = {};
        
        for(let tile of finalPath) {
            let neighbors = this.getNeighbors(...tile.gridPos).length;
            if(neighbors in numNeighbors) {
                numNeighbors[neighbors].push(tile);
            } else {
                numNeighbors[neighbors] = [tile];
            }
        }
        this.setDestinationPoint(...numNeighbors[Math.min(...Object.keys(numNeighbors))].reduce((prev, curr) => { return ((prev.getDistanceFromCorner() > curr.getDistanceFromCorner()) ? prev : curr) }).gridPos);
    }
    
    chooseSpawnPoints(finalPath, numSpawnPoints) {
        let numNeighbors = {};
        let furthestTiles = [];
        for(let tile of finalPath) {
            furthestTiles.push(tile);
        }
        furthestTiles = furthestTiles.sort((a, b) => { return b.getDistanceFromTile(...this.destinationTilePos) - a.getDistanceFromTile(...this.destinationTilePos)});
        
        for(let tile of finalPath) {
            let neighbors = this.getNeighbors(...tile.gridPos).length;
            if(tile.gridPos.toString() !== this.destinationTilePos.toString() && furthestTiles.indexOf(tile) <= furthestTiles.length / 10) {
                if(neighbors in numNeighbors) {
                    numNeighbors[neighbors].push(tile);
                } else {
                    numNeighbors[neighbors] = [tile];
                }
            }   
        }
        let spawnerPos = [];
        for(let i = 0; i < numSpawnPoints; i++) {
            let neighborNum = (Math.min(...Object.keys(numNeighbors)));
            while (numNeighbors[neighborNum].length === 0) {
                neighborNum++;
            }
            if(i > 0) {
                numNeighbors[neighborNum] = numNeighbors[neighborNum].sort((a, b) => {return (b.getDistanceFromTile(...this.destinationTilePos) + (b.getDistanceFromTile(...spawnerPos[0])) * 2) - (a.getDistanceFromTile(...this.destinationTilePos) + (a.getDistanceFromTile(...spawnerPos[0]) * 2))});
            }
            let spawnPoint = numNeighbors[neighborNum].shift();
            spawnerPos.push(spawnPoint.gridPos);
            this.tiles[spawnPoint.row][spawnPoint.col].addOccupier('spawner');
        }
//        for(let i = 0; i < numSpawnPoints; i++) {
//            let spawnpoint = numNeighbors[Math.min(...Object.keys(numNeighbors))].sort((a, b) => { return a.getDistanceFromCorner() - b.getDistanceFromCorner() });
//            this.tiles[spawnpoint.row][spawnpoint.col].addOccupier('spawner');
//        }
    }

    generateNewLevel() {
        try {
            this.clear();
            let roomsToHit = [];
            let triangles = [];
            for(let i = 0; i < 15; i++) {
                let room = [Math.floor(Math.random() * this.height), Math.floor(Math.random() * this.width)];
                while(roomsToHit.indexOf(room) !== -1) {
                    room = [Math.floor(Math.random() * this.height), Math.floor(Math.random() * this.width)];
                }
                roomsToHit.push(room);
            }
    
            let delaunayTriangles = this.getDelaunayTriangulation(roomsToHit);

            let allTiles = roomsToHit.map((r) => { return this.tiles[r[0]][r[1]] });

            let tileCenters = [];
            for(let room of roomsToHit) {
                let tile = this.tiles[room[0]][room[1]];
                tileCenters.push([tile.col * game.tilesize + (game.tilesize / 2), tile.row * game.tilesize + (game.tilesize / 2)]);
            }

            for(let i = 0; i < delaunayTriangles.length; i+= 3) {
                triangles.push([allTiles[delaunayTriangles[i]], allTiles[delaunayTriangles[i + 1]], allTiles[delaunayTriangles[i + 2]]]);
            }

            let edges = [];
            for(let i = 0; i < triangles.length; i++) {
                for(let j = 0; j < triangles[i].length; j++) {
                    edges.push([allTiles.indexOf(triangles[i][j]), allTiles.indexOf(triangles[i][((j + 1 === 3) ? 0 : j + 1)])]);
                }
            }
            let resp = this.doKruskalAlgorithm(tileCenters, edges).map((p) => { return [allTiles[p[0]], allTiles[p[1]]] });
            let intersectingPaths = this.findIntersectingPaths(this.findPathSegments(resp)).sort((a, b) => { return (b[0].length + b[1].length) - (a[0].length + a[1].length) });
            let finalPath = this.fillInPathGaps(intersectingPaths[0][0]).concat(this.fillInPathGaps(intersectingPaths[0][1]))
            this.addWallsAroundPath(finalPath);
            this.chooseDestinationPoint(finalPath);
            this.chooseSpawnPoints(finalPath, Math.floor(random(1, 3)));
            this.createGridPaths(); 
            
            if(!finalPath.length > (this.width * this.height) / 3 || Object.keys(this.gridpaths).length >= (this.width * this.height) / 3) {
                this.generateNewLevel();
            }
        } catch(e) {
            this.generateNewLevel();
        }
        
    }
    
    checkEnemiesLeft() {
        for(let spawner of this.getAllSpawners()) {
            console.log(spawner);
        }
    }
}

// only used with kruskal algorithm
class DisjointSet {
    constructor(len) {
        this.roots = new Array(len);
        
        for(let i = 0; i < len; i++) {
            this.roots[i] = i;
        }
    }
    
    find(element) {
        let _ele = element;
        while(this.roots[element] !== element) {
            element = this.roots[element];
        }
        while(this.roots[_ele] !== element) {
            let parent = this.roots[_ele];
            this.roots[parent] = element;
            _ele = parent;
        }
        return element;
    }
    
    union(setA, setB) {
        let rootA = this.find(setA),
            rootB = this.find(setB);
        
        if(rootA === rootB) {
            return;
        } else {
            this.roots[rootA] = rootB;
        }
    }
}