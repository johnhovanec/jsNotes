# jsNotes
Snippets of useful code samples for JavaScript and some React

### Javascript
``` javascript
// Returning an object from map
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

#### Loops
`for ... of => ` for iterables and strings, maps, sets, generators, DOM node collections and the arguments object available inside a functions.
`for ... in => ` for object keys, or to get the index of an iterable
