define([], function() {
  function flattenArray(array) {
    if (!Array.isArray(array)) {
      return [array];
    }
    return array.reduce(function(combined, current) {
      return combined.concat(flattenArray(current));
    }, []);
  }
  
  function collectBranches(branch, getChildrenFn) {
    return (getChildrenFn(branch) || []).reduce(function(collection, nextChild) {
      return collection.concat(collectBranches(nextChild, getChildrenFn));
    }, [branch]);
  }
  
  return {
    flattenArray: flattenArray,
    collectBranches: collectBranches
  }
});