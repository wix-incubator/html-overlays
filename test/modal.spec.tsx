import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { expect, waitFor, selectDom, ClientRenderer } from 'test-drive-react';
import { OverlayManager} from '../src';
import createHTML from "../src/create-html";
import {MyPortal} from "./react-e2e.spec";

interface PortalProps {
    tagName: string;
    style?:any;
    overlayManager:OverlayManager;
}

// class MyPortal extends React.Component<PortalProps,any>{
//     // overlayManager;
//     destroy;
//
//     constructor(props:PortalProps){
//         super(props);
//     }
//
//     render(){
//         return this.renderRoot({visibility:'hidden'}, false);
//     }
//
//     renderRoot(portalStyle, renderChildren) {
//         let {tagName:TagName, style, children, ...rest} = this.props;
//         return <TagName style={{...style, ...portalStyle}} {...rest}>{renderChildren ? children : null}</TagName>
//     }
//
//     componentWillUnmount(){
//         this.destroy && this.destroy();
//     }
//
//     componentDidMount(){
//         const root:HTMLElement = ReactDOM.findDOMNode(this);
//         // create layer
//         const {parentTarget,destroy} = this.props.overlayManager.createOverlay(root);
//         this.destroy = destroy;
//         //  render target into parentTarget
//         const portalTarget = ReactDOM.unstable_renderSubtreeIntoContainer(this, this.renderRoot({visibility:'visible'}, true), parentTarget);
//
//         // ? let portalMng modify target ?
//         // layout and stuff on portalTarget
//     }
// }

xdescribe('React modal using react portal', () => {
    const clientRenderer = new ClientRenderer();
    let contentRoot:HTMLDivElement;
    afterEach(() => clientRenderer.cleanup());

    beforeEach(()=> {
        contentRoot = createHTML('<div data-automation-id="content-root"></div>') as HTMLDivElement;
        document.body.appendChild(contentRoot);
    });

    afterEach(()=>{
        document.body.removeChild(contentRoot);
    })

    it('should copy css to overlay layer', () => {
        const overlayManager = new OverlayManager(contentRoot);

        const {select} = clientRenderer.render(<div className="out-of-portal">
            <style>{`
                .out-of-portal .portal{

                    position:absolute;
                    width:95%;
                    height:90%;
                    margin: 20px;
                    box-shadow: 4px 4px 5px #888888;
                    background-color:grey;
                }
            `}</style>
            <MyPortal tagName="div" data-automation-id="portal" className="portal" overlayManager={overlayManager}>
                <div className="in-portal" data-automation-id="test-content"></div>
            </MyPortal>
        </div>,overlayManager.getContentLayer());

        return waitFor(() => {
            const selectBody = selectDom(document.body);
            expect(selectBody('overlay-layers','portal')).to.have.style('visibility','visible');
            // expect(selectBody('overlay-layers','test-content')).to.have.style('border','1px solid black');
        });
    });
});
