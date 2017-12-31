import 'core-js/shim';

// matcher 'match' in tests uses Element matches which doesn't go by that name in ie and chrome mobile.
// see https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
if (!Element.prototype.matches) {
    const elemProto = Element.prototype as any;
    Element.prototype =
        elemProto.matchesSelector ||
        elemProto.mozMatchesSelector ||
        elemProto.msMatchesSelector ||
        elemProto.oMatchesSelector ||
        elemProto.webkitMatchesSelector ||
        function(this:any,s:string) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;
        };
}