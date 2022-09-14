# jsNotes
Snippets of useful code samples for JavaScript, React, Leaflet...

## Javascript
### `map`
``` js
// Returning an object from map with a subset of fields using destructuring
let data = [
    {a:1,b:5,c:9}, {a:2,b:6,c:10},
    {a:3,b:7,c:11}, {a:4,b:8,c:12}
];
let result = data.map(({ a, b }) => ({a, b}));

// Returning an array of object with a subset of fields, plus rename the object keys
const newArray = data.map(({id, FacilityName}) => ({values: id , option:FacilityName}))

// Longer way returning an object from map with a subset of fields
objectArray.map(obj => {
    let rObj = {}
    rObj['ApplicationId'] = obj.ApplicationId;
    rObj['Fid'] = obj.Fid;
    return rObj;
});

// Slight variation if looking to copy properties with spread operator and update a property
const updatedObj = data.map(obj => {
    let returnObj = { ...obj };
    returnObj.dollarsObligated = Number(obj.dollarsObligated);
    return returnObj;
});

// Iterate through a collection of objects and add a new field based off of the index
const updatedArray = array.map((obj, index) => {
    let returnObj = {...obj}
    returnObj.id = index;
    return returnObj;
});

// Update an array of objects property value with dynamic keys
Object.entries(entry).map(([key, value]) => {
    if (value === -999) {
	entry[key] = 'Missing*';
    } else if (value === -777) {
	entry[key] = 'Suppressed*';
    } 
    return entry;
});

// Using map to switch lat lng order. 
// Geoprocessing service returns in [lng,lat], need to convert to [lat,lng] order
    const orderedArray = []
    mergedGeometry.map(x => {
	orderedArray.push( [x[1], x[0]] );
});
```

### `reduce`
```js
// Get the object with highest price
let max = items.reduce((acc, curr) => acc.price > curr.price ? acc : curr)
```

``` js
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

``` js
// Using reduce to sum a field
const sum = entries.reduce((prev, cur) => {
        if (!isNaN(cur.area_for_calculation))
            prev += Number(cur.area_for_calculation)
        return prev;
      }, 0);
```

```js
// Using reduce over an array of objects 
// to bring back only certain objects that match a condition
const checked = bmpFilterStatusCheckboxes.reduce((acc, curr) => {
    if (curr.checked === true)
        acc.push(curr);
    return acc;
}, [])

// Extending the above example to then filter another array of objects 
// that have a field matching those results
var res = entries.filter(e => checked.includes(e.status))
```

```js
// Iterate through an array of objects, summing certain properties, 
// and then returning the sums in a new object
const sum = unmappableEvents.reduce((acc, cur) => {
    acc.inPersonEvents = acc.inPersonEvents + Number(cur.properties.InPersonEvents);
    acc.virtualEvents = acc.virtualEvents + Number(cur.properties.VirtualEvents);
    acc.numEvents = acc.numEvents + Number(cur.properties.NumEvents);
    return acc;
},{ inPersonEvents: 0, virtualEvents: 0, numEvents: 0 });
```

```js
// Find objects that match on a property value from two arrays of objects
featuresInExtent.reduce((acc, curr) => {
    let match = features.find(feature => feature.COUNTY === curr.feature.properties.COUNTY)
    acc.push(match);
    return acc;
},[])
```

### `some`
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

``` js
// Check if array of object contains a given property value
obj.stratifications.some((strat) => strat.field === 'target value')
```

### `sort`
``` js
// Sort an array of objects by a property value
const sortedTopicList = topicList.sort((a, b) => (a.key > b.key ? 1 : -1));
```

```js
// Sort an array of objects with a special case property that should always be first in the results 
const sorted = content.sort((a, b) => {
if (a.county && b.county === 'Statewide') {
    return 1;
}
if (a.county === 'Statewide' && b.county) {
    return -1;
}
return a.county > b.county ? 1 : -1;
});
```

### filter
``` js
// Find if an array of objects match a property in an array of filters
itemsList.filter(item => item.group.includes(filters.find(filter => filter.includes(item.group))))

// Longer way with a forEach loop
let res = []
itemsList.forEach((item) => {
    if (filters.includes(item.group)) {
    res.push(item);
    }
})
```

### `Math.max`
```javascript
// Find the max value within an array of objects. 
// Data is an array of objects with a property 'dollarsObligated'
// 0 is passed in case the array is empty
const max = Math.max(...data.map(x => x.dollarsObligated), 0);
```

### Optional parameter assignment
```javascript
// Optional parameter assignment
function getLandRiverSegment(lat, lng) {
        lat = lat || this.state.data.lat;
        lng = lng || this.state.data.lng;
````

### `Map` object
Maps provide the ability to hold key value pairs in order, and are also iterable

```js
// To return only the values within a map that meet a condition
const filteredMap = new Map(
  [...originalMap]
  .filter(([k, v]) => v < 3 )
);
```

### Loops
`for ... of => ` for iterables and strings, maps, sets, generators,  
DOM node collections and the arguments object available inside a functions.  

`for ... in => ` for object keys, or to get the index of an iterable


### Promises
#### A single method example to convert an AWS JavaScript SDK callback to async/await
```js
// The original callback version
documentclient.query(params, function(err, data) {
  if (err) 
  	console.log(err, err.stack); // an error occurred
  else     
  	console.log(data);           // successful response
});

async function getRecipients(params) {
    const response = await docClient.query(params, (err) => {
        if (err) {
            console.log('Unable to query EmailRecipients table. Error: ', JSON.stringify( err, null, 2 ) );
        }
    }).promise();
   
    return response.Items.map(x => x.email_address);
}
```

#### An example of converting multiple AWS callbacks to use Promises in a chain
```js
// Use this if modifying an existing API. Note you will need to set the restApiId for the API.
const getResources = (restApiId) => {
    return apig.getResources({ restApiId: restApiId }).promise()
        .then((data) => {
            const parentId = data.items[0].parentId;
            return parentId;
        });
}

// Creates the resource using the parentId found
const createResource = (parentId) => {
    return apig.createResource({ restApiId: restApiId, parentId: parentId, pathPart: 'Affiliates' }).promise()
        .then((data) => {
            const parentId = data.id;
            return parentId;
        });
}

// Create the method referencing the parent resource
const createMethod = (parentId) => {
    return apig.putMethod({ restApiId: restApiId, resourceId: parentId, 
    	httpMethod: 'GET', authorizationType: 'NONE' })
	.promise()
        .then((data) => {
            return {parentId, data};
        });
}

// Set the Integration type for the method created.
const createIntegration = (result) => {
    return apig.putIntegration({ httpMethod: result.data.httpMethod, resourceId: result.parentId, 
    	restApiId: restApiId, type: 'AWS' })
	.promise()
        .then((data) => {
            return data;
        });
}

getResources()
    .then(parentId => createResource(parentId))
    .then(parentId => createMethod(parentId))
    .then(result => createIntegration(result))
    .catch(err => console.error(err))
```

## React
Using a variable to assign a property key in state
```js
this.setState({
	[`${stateKey}`]: 'someValue'
});
```

### React CSS Animation
// Used to animate transitions in an image carousel within Leaflet map popup
```js
import styled from 'styled-components';

const ImageContainer = styled.div`
    visibility: visible;
    height: 200px;
    opacity: 1;
    transition: opacity 1s linear;
`;

export class PopUp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedImage: 0,
            imgStyle: {
                opacity: '1',
                transition: 'opacity 1s ease-in'
            }
        }
    }

    handleClick = (e, { name }) => {
        if (this.state.selectedImage != name) {
            this.fadeOut(name);
        }
    }

    // Fade-in an image set to a timeout the matches the fade-out duration
    fadeIn = (name) => {
        setTimeout(() => {
            this.setState({
                selectedImage: name,
                imgStyle: {
                    opacity: '1',
                    transition: 'opacity 1s ease-out'
                }
            });
        }, 300)
    }

    // Fade-out the existing image
    fadeOut = (name) => {
        this.setState({
            imgStyle: {
                opacity: '0',
                transition: 'opacity 0.3s ease-in'
            }
        }, () => this.fadeIn(name));
    }

    render() {
        const imgArray = this.props.item.images || [];
	
        return (
            <Popup minWidth='270' maxWidth='600'>
                <Grid verticalAlign='middle' centered>
                    <Grid.Row>
                        <h4>BMP Type: { getName(this.context.bmpTypes, this.props.item.bmpType, 'id', 'name') }</h4>
                    </Grid.Row>
                    <Grid.Row>
                        { imgArray.length > 0
                            ?
                            <ImageContainer>
                                <img src={ imgArray[this.state.selectedImage] } style={ this.state.imgStyle }></img>
                            </ImageContainer>
                            : 'No image available'
                        }
                    </Grid.Row>
                    <Grid.Row>
                        <ImageSelector
                            images={ imgArray }
                            handleSelection={ this.handleClick }
                            selected={ this.state.selectedImage } />
                    </Grid.Row>
                </Grid>
            </Popup>
        );
    }
}

// Component that holds the image selection buttons
const ImageSelector = ({ images, handleSelection, selected }) => {
    const buttons = images.map((item, index) =>
        images.length > 1
            ?
            <List.Item
                key={ item }
                name={ index }
                onClick={ handleSelection }
            >
                <Icon name={ selected == index ? 'circle outline' : 'circle' } />
            </List.Item>
            : null
    );

    return (
        <List horizontal>{ buttons }</List>
    )
}
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

### Rounding
```
// Method to round a decimal value to a specific number of decimals. From https://www.jacklmoore.com/notes/rounding-in-javascript/
export const round = (value, decimals) => {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

```
