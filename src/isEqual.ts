function checkEquality<T>(a:T, b:T, refs:any[]): boolean {
    let aElements,
      bElements,
      element,
      aType = Object.prototype.toString.call(a),
      bType = Object.prototype.toString.call(b);

    // trivial case: primitives and referentially equal objects
    if (a === b) return true;

    // if both are null/undefined, the above check would have returned true
    if (a == null || b == null) return false;

    // check to see if we've seen this reference before; if yes, return true
    if (refs.indexOf(a) > -1 && refs.indexOf(b) > -1) return true;

    // save results for circular checks
    refs.push(a, b);

    if (aType !== bType) return false; // not the same type of objects

    // for non-null objects, check all custom properties
    aElements = Object.getOwnPropertySymbols(a);
    bElements = Object.getOwnPropertySymbols(b);

    if(!checkEquality(aElements, bElements, refs)) {
        return false;
    }

    for(const key in aElements) {
        if(!checkEquality((a as any)[key], (b as any)[key], refs)) {
            return false;
        }
    }

    switch (aType.slice(8, -1)) {
      case "Symbol":
        return a.valueOf() == b.valueOf();
      case "Date":
      case "Number":
        return +a == +b || (+a != +a && +b != +b); // convert Dates to ms, check for NaN
      case "RegExp":
      case "Function":
      case "String":
      case "Boolean":
        return "" + a == "" + b;
      case "Set":
      case "Map": {
        aElements = (a as any).entries();
        bElements = (b as any).entries();
        do {
          element = aElements.next();
          if (!checkEquality(element.value, bElements.next().value, refs)) {
            return false;
          }
        } while (!element.done);
        return true;
      }
      case "ArrayBuffer":
        (a = (new Uint8Array(a as any)) as any), (b = (new Uint8Array(b as any)) as any); // fall through to be handled as an Array
      case "DataView":
        (a = (new Uint8Array((a as any).buffer)) as any), (b = (new Uint8Array((b as any).buffer)) as any); // fall through to be handled as an Array
      case "Float32Array":
      case "Float64Array":
      case "Int8Array":
      case "Int16Array":
      case "Int32Array":
      case "Uint8Array":
      case "Uint16Array":
      case "Uint32Array":
      case "Uint8ClampedArray":
      case "Arguments":
      case "Array":
        if ((a as any).length != (b as any).length) return false;
        for (element = 0; element < (a as any).length; element++) {
          if (!(element in a) && !(element in b)) continue; // empty slots are equal
          // either one slot is empty but not both OR the elements are not equal
          if (
            element in a != element in b ||
            !checkEquality((a as any)[element], (b as any)[element], refs)
          )
            return false;
        }
        return true;
      case "Object":
        return checkEquality(Object.getPrototypeOf(a), Object.getPrototypeOf(b), refs);
      default:
        return false;
    }
  }

 export function isEqual<T>(a:T, b:T) {
    return checkEquality(a,b,[])
 }
