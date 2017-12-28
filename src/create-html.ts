let placeholder:HTMLElement;
export default function createHTML(HTMLString: string): HTMLElement {// , ids:{[s:string]:Node}
    placeholder = placeholder || document.createElement('div');
    placeholder.innerHTML = HTMLString;
    const root = placeholder.firstChild;
    if (root instanceof HTMLElement) {
        return root;
    } else {
        throw new Error('error creating HTML: ' + HTMLString);
    }
    // placeholder.querySelenpctorAll('[id]')
    // const ids = .entries().reduce((acc, node) => {acc[node.id] = node; return acc;}, {});
}
