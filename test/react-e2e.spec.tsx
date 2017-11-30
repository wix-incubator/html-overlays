import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { expect, waitFor, selectDom, ClientRenderer } from 'test-drive-react';
import { OverlayManager} from '../src';
import createHTML from "../src/create-html";

export interface PortalProps {
    tagName: string;
    className?:string;
    style?:any;
    overlayManager:OverlayManager;
}

export class MyPortal extends React.Component<PortalProps,any>{
    // overlayManager;
    destroy:()=>void;

    constructor(props:PortalProps){
        super(props);
    }

    render(){
        return this.renderRoot({visibility:'hidden'}, false);
    }

    renderRoot(portalStyle:React.CSSProperties, renderChildren:boolean) {
        let {tagName:TagName, style, children, ...rest} = this.props;
        return <TagName style={{...style, ...portalStyle}} {...rest}>{renderChildren ? children : null}</TagName>
    }

    componentWillUnmount(){
        this.destroy && this.destroy();
    }

    componentDidMount(){
        const root:HTMLElement = ReactDOM.findDOMNode(this);
        // create layer
        const {parentTarget,destroy} = this.props.overlayManager.createOverlay(root);
        this.destroy = destroy;
        //  render target into parentTarget
        const portalTarget = ReactDOM.unstable_renderSubtreeIntoContainer(this, this.renderRoot({visibility:'visible'}, true), parentTarget);

        // ? let portalMng modify target ?
        // layout and stuff on portalTarget
    }
}

describe('e2e - react', () => {
    const clientRenderer = new ClientRenderer();
    let contentRoot:HTMLDivElement;
    let overlayManager:OverlayManager;
    afterEach(() => clientRenderer.cleanup());

    beforeEach(()=> {
        contentRoot = createHTML('<div data-automation-id="content-root"></div>') as HTMLDivElement;
        document.body.appendChild(contentRoot);
        overlayManager = new OverlayManager(contentRoot);
    });

    afterEach(()=>{
        overlayManager.removeSelf();
        document.body.removeChild(contentRoot);
    });

    it('should copy css to overlay layer', () => {

        const {select} = clientRenderer.render(<div className="out-of-portal">
            <style>{`
                .out-of-portal .in-portal{
                    border:1px solid black;
                }
            `}</style>
            <MyPortal tagName="div" data-automation-id="portal" overlayManager={overlayManager}>
                <div className="in-portal" data-automation-id="test-content"></div>
            </MyPortal>
        </div>,overlayManager.getContentLayer());

        return waitFor(() => {
            const selectBody = selectDom(document.body);
            expect(selectBody('overlay-layers','portal')).to.have.style('visibility','visible');
            expect(selectBody('overlay-layers','test-content')).to.have.style('border','1px solid black');
        });
    });
});
