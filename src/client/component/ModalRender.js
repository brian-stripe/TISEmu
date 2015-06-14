var React = require('react');
var Marty = require('marty');
var AppComponent = require('./AppBaseComponent');


var nodeTypes = require('../TISMachine').nodeTypes;
class NodeAddModal extends AppComponent {
    render() {
        let [pos] = this.props.args;
        let nodeButtons = _.map(nodeTypes, (node, name) => {
            return <a key={name} onClick={() => this.addModal(name)}>
                {node.displayName}
            </a>;
        });

        return <div>
            What node type do you want to add at {pos.toString()}?
            <br/>
            {nodeButtons}
        </div>;
    }
    addModal(name) {
        let [pos] = this.props.args;
        this.app.managerStore.addNode(pos, name);
        this.props.close();
    }
}

class SaveJsonModal extends AppComponent {
    render() {
        return <div>
            <div>Save this text to save your program. It can be pasted back into the load dialog.</div>
            <textarea readOnly value={this.props.args[0]}/>
        </div>;
    }
}

class LoadJsonModal extends AppComponent {
    render() {
        return <div>
            <div>Paste the text from the save dialog into the text area below to load a program</div>
            <textarea ref="text"/>
            <a href="#" onClick={this.doLoad.bind(this)}>Load</a>
        </div>;
    }

    doLoad() {
        this.props.args[0](this.refs.text.getDOMNode().value);
        this.props.close();
    }
}

class ModalRenderComponent extends AppComponent {
    constructor(props, context) {
        super(props, context);
        this.types = this.app.modalStore.modalTypes;
        this.typeComponents = {
            "nodeAddDialog": NodeAddModal,
            "saveJson": SaveJsonModal,
            "loadJson": LoadJsonModal
        };
    }

    render() {
        if (this.props.modal) {
            let content = this.makeContent();
            return <div className="modalContainer" ref="background" onClick={this.backClick.bind(this)}>
                <div className={"type " + this.props.modal[0] + "Type"}>
                    {content}
                </div>
            </div>;
        } else {
            return <div></div>;
        }
    }
    backClick(event) {
        if (event.target === this.refs.background.getDOMNode()) {
            this.closeModal();
        }
    }
    closeModal() {
        this.app.modalStore.closeModal();
    }
    makeContent() {
        let [type, args] = this.props.modal;
        let component = this.typeComponents[type];
        return React.createElement(component, {args: args, close: this.closeModal.bind(this)});
    }
}
let ModalRenderComponentContainer = Marty.createContainer(ModalRenderComponent, {
    listenTo: 'modalStore',
    fetch: {
        modal() {
            return this.app.modalStore.getModal();
        }
    }
});

export default ModalRenderComponentContainer;
