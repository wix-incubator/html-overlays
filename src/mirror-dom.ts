export type Filter = (name:string, value:string) => boolean;

export class DOMMirror {
    private srcToMirrors = new WeakMap();
    private mirrorConfig = new WeakMap<Element, Element>();
    
    private observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
        switch(mutation.type){
            case 'attributes':
                const target = mutation.target as Element;
                const name = mutation.attributeName;
                const clones = this.srcToMirrors.get(target);
                if(clones && name){
                    const newValue = target.getAttribute(name);
                    if(newValue){
                        clones.forEach(clone => {
                            const value = this.filter ? this.filter(name, newValue) : newValue;
                            if(value !== undefined) {
                                clone.setAttribute(name, value);
                            }
                        });
                    } else {
                        clones.forEach(clone => clone.removeAttribute(name));
                    }
                }
                break;
            }
        }    
    });

    constructor(
        private filter?:Filter
    ){}

    public mirrorNode<T extends Element>(srcNode:T):T {
        srcNode = this.getSource(srcNode) || srcNode;
        if(!this.srcToMirrors.has(srcNode)){
            this.srcToMirrors.set(srcNode, []);
        }
        const mirrorNode = srcNode.cloneNode() as T;
        if(this.filter) {
            const attrList = Array.from(mirrorNode.attributes);
            for(const {name, value} of attrList) {
                if(!this.filter(name, value)) {
                    mirrorNode.removeAttribute(name);
                }
            }
        }
        this.mirrorConfig.set(mirrorNode, srcNode);
        this.srcToMirrors.get(srcNode).push(mirrorNode);
        this.observer.observe(srcNode, {attributes: true});
        return mirrorNode;
    }

    public getSource<T extends Element>(mirrorNode:Element | null):T|null {
        const srcNode = mirrorNode && this.mirrorConfig.get(mirrorNode);
        return srcNode ? <T>srcNode : null;
    }
}