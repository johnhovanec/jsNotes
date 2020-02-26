# jsNotes
Snippets of useful code samples for JavaScript and some React

## Javascript
``` javascript
// Returning an object from map with a subset of fields
objectArray.map(obj => {
    var rObj = {}
    rObj['ApplicationId'] = obj.ApplicationId;
	rObj['Fid'] = obj.Fid;
    return rObj;
});
```

``` javascript
// Using reduce to sum the count of an object property
var countsByType = entries.reduce(function (allEntries, entry) {
        if (entry.bmpType in allEntries) {
            allEntries[entry.bmpType]++;
        } else {
            allEntries[entry.bmpType] = 1;
        }
        return allEntries;
    }, {});
```

``` javascript
// Using reduce to sum a field
const sum = entries.reduce((prev, cur) => {
        if (!isNaN(cur.area_for_calculation))
            prev += Number(cur.area_for_calculation)
        return prev;
      }, 0);
```

```js
// Using reduce over an array of objects to bring back only certain objects that match a condition
var checked = bmpFilterStatusCheckboxes.reduce((acc, curr) => {
    if (curr.checked === true)
        acc.push(curr);
    return acc;
}, [])

// Extending the above example to then filter another array of objects that have a field matching those results
var res = entries.filter(e => checked.includes(e.status))
```

``` javascript
// Using map to switch lat lng order. Geoprocessing service returns in [lng,lat], need to convert to [lat,lng] order
    const orderedArray = []
    mergedGeometry.map(x => {
	orderedArray.push( [x[1], x[0]] );
});
```

```javascript
// Optional parameter assignment
function getLandRiverSegment(lat, lng) {
        lat = lat || this.state.data.lat;
        lng = lng || this.state.data.lng;
````

``` js
// Check if array contains one element from another array
// Longer way
function findOneElement (array1, array2) {
    return array2.some(function (x) {
        return array1.includes(x);
    });
};

// Shorter ES6 way
array1.some(x => array2.includes(x))
```
#### Maps
Maps provide the ability to hold key value pairs in order, and are also iterable

```js
// To return only the values within a map that meet a condition
const filteredMap = new Map(
  [...originalMap]
  .filter(([k, v]) => v < 3 )
);
```

#### Loops
`for ... of => ` for iterables and strings, maps, sets, generators, DOM node collections and the arguments object available inside a functions.
`for ... in => ` for object keys, or to get the index of an iterable

## React
Using a variable to assign a property key in state
```js
this.setState({
	[`${stateKey}`]: 'someValue'
});
```


## Leaflet and react-leaflet
#### Example to get bounds for a polygon:
```
class FilteredExtent extends React.Component {
	constructor(props) {
        super(props);

        // Create a ref to the which will be used to access leaflet.js
        this.polygonRef = React.createRef();
        this.bounds = [];

        this.state = { northEastCorner: [], southWestCorner: []};
      }
	
    // When the component updates we directly access leaflet.js methods to get the bounds for the polygon
    componentDidUpdate(prevProps) {
        if(this.props.positions !== prevProps.positions) {
            this.bounds = this.props.positions;

            if (this.bounds.length > 0) {
                this.setState({
                    northEastCorner: this.polygonRef.current.leafletElement.getBounds().getNorthEast(),
                    southWestCorner: this.polygonRef.current.leafletElement.getBounds().getSouthWest(), 
                }, () => {
                    this.props.handleExtentUpdate(this.state)
                });
            }
        }
    }

    render() {
        return (
            <Polygon ref={this.polygonRef} color={this.props.color} positions={ this.props.positions } />
        );
    }
}
```

#### Fit map to a polygon's bounds:
```
    // Create a ref to the Map
    this.refMap = React.createRef();
    
    getMapExtent = (bounds) => {
        // Zoom the map to the bounds of the extent of the filtered area
        const extentBounds = [bounds.northEastCorner, bounds.southWestCorner];
	
	// Various padding options are available
        this.refMap.current.leafletElement.fitBounds(extentBounds, { padding: [10, 10] });
    }
```
