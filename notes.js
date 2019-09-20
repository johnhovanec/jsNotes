// Javascript

// Returning an object from map
objectArray.map(obj => {
    var rObj = {}
    rObj['ApplicationId'] = obj.ApplicationId;
	rObj['Fid'] = obj.Fid;
    return rObj;
});

// Using reduce to sum the count of an object property
var countsByType = entries.reduce(function (allEntries, entry) {
        if (entry.bmpType in allEntries) {
            allEntries[entry.bmpType]++;
        } else {
            allEntries[entry.bmpType] = 1;
        }
        return allEntries;
    }, {});