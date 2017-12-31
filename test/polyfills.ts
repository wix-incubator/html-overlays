import 'core-js/shim';

// matcher 'match' in tests uses Element matches which doesn't go by that name in ie.
// see https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
if (!Element.prototype.matches)
    Element.prototype.matches = Element.prototype.msMatchesSelector;