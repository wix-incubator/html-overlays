const placeholder = document.createElement('div');
export default function createHTML(HTMLString:string):HTMLElement{//, ids:{[s:string]:Node}
    placeholder.innerHTML = HTMLString;
    const root = placeholder.firstChild;
    placeholder.innerHTML = '';
    if(root instanceof HTMLElement){
        return root;
    } else {
        throw new Error('error creating HTML: ' + HTMLString);
    }
    // placeholder.querySelectorAll('[id]')
    // const ids = .entries().reduce((acc, node) => {acc[node.id] = node; return acc;}, {});
}